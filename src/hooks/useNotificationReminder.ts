import { useState, useEffect, useCallback, useRef } from 'react';

export interface NotificationReminderConfig {
  enabled: boolean;
  time: string; // HH:MM format (24h)
  shiftType: 'START' | 'END' | 'BOTH';
}

interface UseNotificationReminderProps {
  onNavigateToCheckIn?: () => void;
}

export function useNotificationReminder({ onNavigateToCheckIn }: UseNotificationReminderProps = {}) {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (isSupported) {
      return Notification.permission;
    }
    return 'denied';
  });

  const [config, setConfig] = useState<NotificationReminderConfig>(() => {
    const savedEnabled = localStorage.getItem('ssma_reminder_enabled');
    const savedTime = localStorage.getItem('ssma_reminder_time');
    const savedShift = localStorage.getItem('ssma_reminder_shift');

    return {
      enabled: savedEnabled !== null ? savedEnabled === 'true' : true, // default enabled
      time: savedTime || '08:00', // default 08:00 AM
      shiftType: (savedShift as 'START' | 'END' | 'BOTH') || 'START',
    };
  });

  const [inAppAlert, setInAppAlert] = useState<{
    id: string;
    title: string;
    body: string;
    time: string;
  } | null>(null);

  // Sync state with local storage
  const updateConfig = useCallback((partial: Partial<NotificationReminderConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      if (partial.enabled !== undefined) {
        localStorage.setItem('ssma_reminder_enabled', String(partial.enabled));
      }
      if (partial.time !== undefined) {
        localStorage.setItem('ssma_reminder_time', partial.time);
      }
      if (partial.shiftType !== undefined) {
        localStorage.setItem('ssma_reminder_shift', partial.shiftType);
      }
      return next;
    });
  }, []);

  // Request browser notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        updateConfig({ enabled: true });
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Failed to request notification permission:', err);
      return false;
    }
  }, [isSupported, updateConfig]);

  // Dispatch Web Notification (via Service Worker or Native Notification Constructor)
  const dispatchNotification = useCallback(
    async (title: string, body: string, isTest = false) => {
      if (!isSupported || Notification.permission !== 'granted') {
        // Show in-app alert as fallback
        setInAppAlert({
          id: String(Date.now()),
          title,
          body,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        return;
      }

      const options: NotificationOptions & { renotify?: boolean } = {
        body,
        icon: '/pwa-192x192.png',
        badge: '/icon.svg',
        tag: isTest ? 'ssma-test-notification' : 'ssma-daily-checkin',
        renotify: true,
        data: { url: '/', tab: 'checkin' },
      };

      try {
        // Prefer ServiceWorker showNotification if available (works on mobile Android & standalone PWAs)
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.showNotification) {
            await registration.showNotification(title, options);
            return;
          }
        }

        // Fallback to Window Notification API
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
          notification.close();
          onNavigateToCheckIn?.();
        };
      } catch (e) {
        console.warn('Error displaying Notification, using fallback alert:', e);
        setInAppAlert({
          id: String(Date.now()),
          title,
          body,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    },
    [isSupported, onNavigateToCheckIn]
  );

  // Send immediate test notification
  const sendTestNotification = useCallback(() => {
    const title = '🔔 Lembrete de Check-in Emocional | SSMA Enterprise';
    const body = `Teste com sucesso! Diariamente às ${config.time}, você receberá este alerta para registrar sua prontidão e carga mental.`;
    dispatchNotification(title, body, true);
  }, [config.time, dispatchNotification]);

  // Check scheduled reminder loop every 20 seconds
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentConfig = configRef.current;
      if (!currentConfig.enabled) return;

      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      if (currentTimeStr === currentConfig.time) {
        const todayDateKey = now.toISOString().slice(0, 10);
        const lastNotifiedKey = `ssma_notified_${todayDateKey}_${currentConfig.time}`;

        if (!localStorage.getItem(lastNotifiedKey)) {
          localStorage.setItem(lastNotifiedKey, 'true');
          const title = '🔔 Hora do Check-in Emocional Diário | SSMA';
          const body = `Lembrete das ${currentConfig.time}: Reserve 1 minuto para registrar seu estado psicossocial e prontidão de turno.`;
          dispatchNotification(title, body, false);

          // Trigger in-app alert too
          setInAppAlert({
            id: String(Date.now()),
            title,
            body,
            time: currentTimeStr,
          });
        }
      }
    }, 20000); // Check every 20s

    return () => clearInterval(interval);
  }, [dispatchNotification]);

  // Listen for Service Worker messages (e.g. notification click to navigate to checkin)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE_TO_TAB' && event.data?.tab === 'checkin') {
        onNavigateToCheckIn?.();
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, [onNavigateToCheckIn]);

  return {
    isSupported,
    permission,
    config,
    updateConfig,
    onUpdateConfig: updateConfig,
    requestPermission,
    onRequestPermission: requestPermission,
    sendTestNotification,
    onSendTestNotification: sendTestNotification,
    inAppAlert,
    dismissInAppAlert: () => setInAppAlert(null),
  };
}
