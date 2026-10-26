export type SupportedLanguage = "pt" | "es" | "en";

export interface TranslationDictionary {
  // Navigation
  appName: string;
  appBadge: string;
  appSubtitle: string;
  sectorLabel: string;
  mentalLoadLabel: string;
  lgpdBadge: string;
  apkDownload: string;
  apkShort: string;
  
  // Tabs
  tabTraining: string;
  tabCheckin: string;
  tabDecompression: string;
  tabGenerator: string;
  tabSesmt: string;
  tabSettings: string;
  tabBadges: string;
  badgesCardTitle: string;
  badgesCardSubtitle: string;

  // Simulator stats
  statNormativeAccuracy: string;
  statEvaluatedScenarios: string;
  statActiveTimeAttack: string;
  statCurrentSector: string;
  statLoadHigh: string;
  statLoadChallenge: string;
  statLoadStandard: string;

  // Sectors Bar
  sectorsHeading: string;
  sectorsSubheading: string;

  // Settings View
  settingsTitle: string;
  settingsSubtitle: string;
  languageSectionTitle: string;
  languageSectionDesc: string;
  currentLanguageBadge: string;
  
  // Password Protection
  securitySectionTitle: string;
  securitySectionDesc: string;
  requirePasswordLabel: string;
  requirePasswordDesc: string;
  passwordStatusActive: string;
  passwordStatusDisabled: string;
  lockNowBtn: string;
  lockNowSuccess: string;
  changePasswordTitle: string;
  currentPasswordLabel: string;
  currentPasswordPlaceholder: string;
  newPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  saveNewPasswordBtn: string;
  defaultPasswordNotice: string;
  resetPasswordTitle: string;
  resetPasswordDesc: string;
  resetPasswordBtn: string;
  resetPasswordConfirmPrompt: string;
  resetSuccessMessage: string;
  passwordChangedSuccess: string;
  errorCurrentPasswordWrong: string;
  errorPasswordMismatch: string;
  errorPasswordTooShort: string;

  // Animations Section
  animationsSectionTitle: string;
  animationsSectionDesc: string;
  enableMotionLabel: string;
  enableMotionDesc: string;
  transitionSpringNotice: string;

  // Local Storage & Data
  dataSectionTitle: string;
  dataSectionDesc: string;
  clearHistoryBtn: string;
  clearHistoryConfirm: string;
  clearHistorySuccess: string;
  exportDataBtn: string;

  // Password Prompt Modal
  modalPromptTitle: string;
  modalPromptDesc: string;
  modalInputPlaceholder: string;
  modalUnlockBtn: string;
  modalCancelBtn: string;
  modalWrongPassword: string;
  modalForgotLink: string;
  modalResetDirectBtn: string;
  modalDefaultTip: string;

  // Common
  save: string;
  cancel: string;
  confirm: string;
  close: string;
  active: string;
  disabled: string;
  footerRights: string;
  footerNorms: string;
  footerLgpd: string;
  footerApk: string;
  footerDisclaimer: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  pt: {
    appName: "SSMA Enterprise",
    appBadge: "SST & Saúde Mental",
    appSubtitle: "SST Multi-Setorial & Saúde Psicológica",
    sectorLabel: "Setor",
    mentalLoadLabel: "Carga Mental",
    lgpdBadge: "LGPD",
    apkDownload: "Baixar APK / Android",
    apkShort: "APK",

    tabTraining: "Simulador SST (Time-Attack)",
    tabCheckin: "Check-in Emocional",
    tabDecompression: "Módulo Descompressão",
    tabGenerator: "Gerador de Cenários IA",
    tabSesmt: "Painel SESMT & LGPD",
    tabSettings: "Configurações",
    tabBadges: "Distintivos do Usuário",
    badgesCardTitle: "Distintivos & Conquistas SST",
    badgesCardSubtitle: "Desbloqueie distintivos por conclusão de cenários práticos (ex: 'Safety Novice', 'Compliance Expert').",

    statNormativeAccuracy: "Precisão Normativa",
    statEvaluatedScenarios: "Cenários Avaliados",
    statActiveTimeAttack: "Time-Attack Ativo",
    statCurrentSector: "Setor Vigente",
    statLoadHigh: "45s (Carga Alta)",
    statLoadChallenge: "24s (Desafio)",
    statLoadStandard: "30s (Padrão)",

    sectorsHeading: "6 Setores Econômicos Críticos (Cobertura Normativa Obrigatória)",
    sectorsSubheading: "Selecione para alternar o simulador",

    settingsTitle: "Configurações do Sistema",
    settingsSubtitle: "Personalize idioma, segurança com proteção por senha e animações dinâmicas de navegação.",
    languageSectionTitle: "Idioma do Sistema / Multilíngue",
    languageSectionDesc: "Escolha o idioma de exibição da interface, regras de segurança e relatórios operacionais.",
    currentLanguageBadge: "Idioma Ativo",

    securitySectionTitle: "Segurança e Proteção por Chave Mestra",
    securitySectionDesc: "Controle o acesso à aba de configurações para proteger parâmetros do sistema e dados gerenciais.",
    requirePasswordLabel: "Exigir chave mestra para acessar a aba de Configurações",
    requirePasswordDesc: "Quando ativado, solicita a chave mestra toda vez que abrir esta aba.",
    passwordStatusActive: "Proteção por Chave Mestra Ativa",
    passwordStatusDisabled: "Acesso Livre (Sem Senha)",
    lockNowBtn: "Bloquear Aba Imediatamente",
    lockNowSuccess: "Aba bloqueada com sucesso! A próxima visita exigirá a chave mestra.",
    changePasswordTitle: "Configurar / Alterar Chave de Acesso",
    currentPasswordLabel: "Chave Atual",
    currentPasswordPlaceholder: "Digite a chave atual...",
    newPasswordLabel: "Nova Chave",
    newPasswordPlaceholder: "Mínimo 4 caracteres...",
    confirmPasswordLabel: "Confirmar Nova Chave",
    confirmPasswordPlaceholder: "Repita a nova chave...",
    saveNewPasswordBtn: "Salvar Nova Chave",
    defaultPasswordNotice: "Não há chave padrão. Grave uma chave sua antes de ligar a trava.",
    resetPasswordTitle: "Remover chave deste aparelho",
    resetPasswordDesc: "Esqueceu a chave? A trava é apagada só neste aparelho. Nenhuma senha publicada é restaurada. Depois, grave uma chave nova.",
    resetPasswordBtn: "Remover trava",
    resetPasswordConfirmPrompt: "Remover a chave deste aparelho? A trava cai e nenhuma senha padrão volta.",
    resetSuccessMessage: "Trava removida. Não foi restaurada nenhuma chave.",
    passwordChangedSuccess: "Chave de acesso atualizada com sucesso! Guarde-a em local seguro.",
    errorCurrentPasswordWrong: "A chave atual informada está incorreta.",
    errorPasswordMismatch: "As novas chaves informadas não coincidem.",
    errorPasswordTooShort: "A nova chave deve ter no mínimo 4 caracteres.",

    animationsSectionTitle: "Animações e Efeitos Visuais das Abas",
    animationsSectionDesc: "Efeitos dinâmicos com física suave de transição (Motion Spring) para navegação fluida.",
    enableMotionLabel: "Animações dinâmicas de transição ativas",
    enableMotionDesc: "Deslizamento suave, pill flutuante animado e feedback tátil ao alternar entre as abas.",
    transitionSpringNotice: "Indicador elástico ativado com aceleração ultra suave de 60fps.",

    dataSectionTitle: "Armazenamento Local & Histórico",
    dataSectionDesc: "Gerencie o cache de tentativas normativas e logs psicológicos armazenados neste dispositivo.",
    clearHistoryBtn: "Limpar Histórico Local",
    clearHistoryConfirm: "Tem certeza que deseja apagar o histórico de tentativas deste navegador?",
    clearHistorySuccess: "Histórico de tentativas limpo com sucesso!",
    exportDataBtn: "Exportar Dados (JSON)",

    modalPromptTitle: "Acesso Restrito às Configurações",
    modalPromptDesc: "Esta aba contém ajustes de segurança, controle de licenças e parâmetros globais. Digite a chave mestra para continuar.",
    modalInputPlaceholder: "Digite a chave deste aparelho...",
    modalUnlockBtn: "Desbloquear e Entrar",
    modalCancelBtn: "Voltar ao Início",
    modalWrongPassword: "Chave incorreta.",
    modalForgotLink: "Esqueceu a chave? Remover a trava deste aparelho",
    modalResetDirectBtn: "Remover trava",
    modalDefaultTip: "Não existe chave publicada. Quem esquece remove a trava e grava outra.",

    save: "Salvar Alterações",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Fechar",
    active: "Ativo",
    disabled: "Desativado",
    footerRights: "SSMA Enterprise • 2026",
    footerNorms: "Normas Regulamentadoras MTE (NR-10 a NR-35)",
    footerLgpd: "Conformidade LGPD (Lei nº 13.709/2018)",
    footerApk: "Pacote Android Protegido",
    footerDisclaimer: "Ambiente didático e operacional integrado de Segurança e Saúde no Trabalho. As métricas de carga mental são estritamente anonimizadas e protegidas contra uso punitivo corporativo.",
  },

  es: {
    appName: "SSMA Enterprise",
    appBadge: "SST & Salud Mental",
    appSubtitle: "SST Multisectorial & Salud Psicológica",
    sectorLabel: "Sector",
    mentalLoadLabel: "Carga Mental",
    lgpdBadge: "LGPD/Privacidad",
    apkDownload: "Descargar APK / Android",
    apkShort: "APK",

    tabTraining: "Simulador SST (Time-Attack)",
    tabCheckin: "Check-in Emocional",
    tabDecompression: "Módulo Descompresión",
    tabGenerator: "Generador de Escenarios IA",
    tabSesmt: "Panel SST & Privacidad",
    tabSettings: "Configuración",
    tabBadges: "Distintivos de Usuario",
    badgesCardTitle: "Distintivos y Rangos SST",
    badgesCardSubtitle: "Desbloquee distintivos completando escenarios de entrenamiento (ej: 'Safety Novice', 'Compliance Expert').",

    statNormativeAccuracy: "Precisión Normativa",
    statEvaluatedScenarios: "Escenarios Evaluados",
    statActiveTimeAttack: "Time-Attack Activo",
    statCurrentSector: "Sector Vigente",
    statLoadHigh: "45s (Carga Alta)",
    statLoadChallenge: "24s (Desafío)",
    statLoadStandard: "30s (Estándar)",

    sectorsHeading: "6 Sectores Económicos Críticos (Cobertura Normativa Obligatoria)",
    sectorsSubheading: "Seleccione para alternar el simulador",

    settingsTitle: "Configuración del Sistema",
    settingsSubtitle: "Personalice idioma, seguridad con clave maestra y animaciones dinámicas de navegación.",
    languageSectionTitle: "Idioma del Sistema / Multilingüe",
    languageSectionDesc: "Seleccione el idioma de visualización de la interfaz, normativas de seguridad e informes.",
    currentLanguageBadge: "Idioma Activo",

    securitySectionTitle: "Seguridad y Protección por Clave Maestra",
    securitySectionDesc: "Controle el acceso a la pestaña de configuración para proteger parámetros y datos clave.",
    requirePasswordLabel: "Exigir clave maestra para acceder a la pestaña de Configuración",
    requirePasswordDesc: "Cuando está activado, solicita la clave maestra cada vez que se abre esta pestaña.",
    passwordStatusActive: "Protección por Clave Maestra Activa",
    passwordStatusDisabled: "Acceso Libre (Sin Contraseña)",
    lockNowBtn: "Bloquear Pestaña Inmediatamente",
    lockNowSuccess: "¡Pestaña bloqueada! La próxima visita requerirá la clave maestra.",
    changePasswordTitle: "Configurar / Cambiar Clave de Acceso",
    currentPasswordLabel: "Clave Actual",
    currentPasswordPlaceholder: "Ingrese la clave actual...",
    newPasswordLabel: "Nueva Clave",
    newPasswordPlaceholder: "Mínimo 4 caracteres...",
    confirmPasswordLabel: "Confirmar Nueva Clave",
    confirmPasswordPlaceholder: "Repita la nueva clave...",
    saveNewPasswordBtn: "Guardar Nueva Clave",
    defaultPasswordNotice: "No hay clave predeterminada. Guarde una clave propia antes de activar el bloqueo.",
    resetPasswordTitle: "Quitar la clave de este dispositivo",
    resetPasswordDesc: "¿Olvidó la clave? El bloqueo se borra solo en este dispositivo. No se restaura ninguna clave publicada. Después, guarde una nueva.",
    resetPasswordBtn: "Quitar bloqueo",
    resetPasswordConfirmPrompt: "¿Quitar la clave de este dispositivo? El bloqueo cae y ninguna clave predeterminada vuelve.",
    resetSuccessMessage: "Bloqueo quitado. No se restauró ninguna clave.",
    passwordChangedSuccess: "¡Clave actualizada con éxito! Guárdela en un lugar seguro.",
    errorCurrentPasswordWrong: "La clave actual ingresada es incorrecta.",
    errorPasswordMismatch: "Las nuevas claves no coinciden.",
    errorPasswordTooShort: "La nueva clave debe tener al menos 4 caracteres.",

    animationsSectionTitle: "Animaciones y Efectos Visuales de Pestañas",
    animationsSectionDesc: "Efectos dinámicos con física suave de transición (Motion Spring) para un uso fluido y agradable.",
    enableMotionLabel: "Animaciones dinámicas de transición activas",
    enableMotionDesc: "Deslizamiento suave, indicador flotante animado y respuesta táctil al cambiar de pestaña.",
    transitionSpringNotice: "Indicador elástico activado con aceleración ultra suave de 60fps.",

    dataSectionTitle: "Almacenamiento Local e Historial",
    dataSectionDesc: "Administre la memoria caché de intentos normativos y registros psicológicos en este dispositivo.",
    clearHistoryBtn: "Borrar Historial Local",
    clearHistoryConfirm: "¿Está seguro de que desea eliminar el historial de intentos en este navegador?",
    clearHistorySuccess: "¡Historial de intentos eliminado con éxito!",
    exportDataBtn: "Exportar Datos (JSON)",

    modalPromptTitle: "Acceso Restringido a Configuración",
    modalPromptDesc: "Esta pestaña contiene ajustes de seguridad, control de licencias y parámetros globales. Ingrese la clave maestra.",
    modalInputPlaceholder: "Ingrese la clave de este dispositivo...",
    modalUnlockBtn: "Desbloquear y Entrar",
    modalCancelBtn: "Volver al Menú Principal",
    modalWrongPassword: "Clave incorrecta.",
    modalForgotLink: "¿Olvidó la clave? Quitar el bloqueo de este dispositivo",
    modalResetDirectBtn: "Quitar bloqueo",
    modalDefaultTip: "No hay clave publicada. Quien la olvida quita el bloqueo y guarda otra.",

    save: "Guardar Cambios",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Cerrar",
    active: "Activo",
    disabled: "Desactivado",
    footerRights: "SSMA Enterprise • 2026",
    footerNorms: "Normas de Seguridad y Salud en el Trabajo (SST)",
    footerLgpd: "Cumplimiento de Privacidad y Protección de Datos",
    footerApk: "Paquete Android Protegido",
    footerDisclaimer: "Entorno didáctico y operativo integrado de Seguridad y Salud en el Trabajo. Las métricas de carga mental están estrictamente anonimizadas y protegidas contra uso punitivo.",
  },

  en: {
    appName: "SSMA Enterprise",
    appBadge: "OSH & Mental Health",
    appSubtitle: "Multi-Sector OSH & Psychological Health",
    sectorLabel: "Sector",
    mentalLoadLabel: "Mental Load",
    lgpdBadge: "Privacy / GDPR",
    apkDownload: "Download APK / Android",
    apkShort: "APK",

    tabTraining: "OSH Simulator (Time-Attack)",
    tabCheckin: "Emotional Check-in",
    tabDecompression: "Decompression Module",
    tabGenerator: "AI Scenario Generator",
    tabSesmt: "EHS & Privacy Dashboard",
    tabSettings: "Settings",
    tabBadges: "User Badges",
    badgesCardTitle: "User Badges & Ranks",
    badgesCardSubtitle: "Unlock badges by completing training scenarios (e.g. 'Safety Novice', 'Compliance Expert').",

    statNormativeAccuracy: "Normative Accuracy",
    statEvaluatedScenarios: "Evaluated Scenarios",
    statActiveTimeAttack: "Active Time-Attack",
    statCurrentSector: "Active Sector",
    statLoadHigh: "45s (High Load)",
    statLoadChallenge: "24s (Challenge)",
    statLoadStandard: "30s (Standard)",

    sectorsHeading: "6 Critical Economic Sectors (Mandatory Regulatory Scope)",
    sectorsSubheading: "Select to switch active simulator",

    settingsTitle: "System Settings",
    settingsSubtitle: "Customize language, master key security, and dynamic navigation animations.",
    languageSectionTitle: "System Language / Multilingual",
    languageSectionDesc: "Choose display language for the interface, safety guidelines, and operational reports.",
    currentLanguageBadge: "Active Language",

    securitySectionTitle: "Master Key Security & Protection",
    securitySectionDesc: "Control access to the settings tab to protect system parameters and license data.",
    requirePasswordLabel: "Require master key to access Settings tab",
    requirePasswordDesc: "When enabled, prompts for the master key every time this tab is opened.",
    passwordStatusActive: "Master Key Protection Active",
    passwordStatusDisabled: "Free Access (No Password)",
    lockNowBtn: "Lock Tab Immediately",
    lockNowSuccess: "Tab locked successfully! Next visit will require master key.",
    changePasswordTitle: "Configure / Change Access Key",
    currentPasswordLabel: "Current Key",
    currentPasswordPlaceholder: "Enter current key...",
    newPasswordLabel: "New Key",
    newPasswordPlaceholder: "Minimum 4 characters...",
    confirmPasswordLabel: "Confirm New Key",
    confirmPasswordPlaceholder: "Repeat new key...",
    saveNewPasswordBtn: "Save New Key",
    defaultPasswordNotice: "There is no default key. Save your own key before turning the lock on.",
    resetPasswordTitle: "Remove the key on this device",
    resetPasswordDesc: "Forgot the key? The lock is cleared only on this device. No published password is restored. Then save a new key.",
    resetPasswordBtn: "Remove lock",
    resetPasswordConfirmPrompt: "Remove the key on this device? The lock drops and no default password comes back.",
    resetSuccessMessage: "Lock removed. No key was restored.",
    passwordChangedSuccess: "Access key successfully updated! Keep it in a secure location.",
    errorCurrentPasswordWrong: "The current key entered is incorrect.",
    errorPasswordMismatch: "New keys do not match.",
    errorPasswordTooShort: "New key must be at least 4 characters long.",

    animationsSectionTitle: "Tab Animations & Visual Effects",
    animationsSectionDesc: "Dynamic effects with smooth transition physics (Motion Spring) for pleasant, fluid usage.",
    enableMotionLabel: "Dynamic transition animations enabled",
    enableMotionDesc: "Smooth sliding, animated floating indicator pill, and tactile feedback when switching tabs.",
    transitionSpringNotice: "Elastic indicator activated with ultra-smooth 60fps acceleration curve.",

    dataSectionTitle: "Local Storage & History",
    dataSectionDesc: "Manage local cache of safety test attempts and psychological logs stored on this device.",
    clearHistoryBtn: "Clear Local History",
    clearHistoryConfirm: "Are you sure you want to erase test attempts history on this browser?",
    clearHistorySuccess: "Attempt history cleared successfully!",
    exportDataBtn: "Export Data (JSON)",

    modalPromptTitle: "Restricted Access to Settings",
    modalPromptDesc: "This tab contains security settings, license controls, and system parameters. Enter master key to continue.",
    modalInputPlaceholder: "Enter the key for this device...",
    modalUnlockBtn: "Unlock & Enter",
    modalCancelBtn: "Back to Main Menu",
    modalWrongPassword: "Incorrect key.",
    modalForgotLink: "Forgot the key? Remove the lock on this device",
    modalResetDirectBtn: "Remove lock",
    modalDefaultTip: "There is no published key. If you forget it, remove the lock and save another.",

    save: "Save Changes",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    active: "Active",
    disabled: "Disabled",
    footerRights: "SSMA Enterprise • 2026",
    footerNorms: "Occupational Safety and Health Standards (OSH)",
    footerLgpd: "Privacy and Data Protection Compliance",
    footerApk: "Protected Android Package",
    footerDisclaimer: "Integrated educational and operational environment for Occupational Safety and Health. Mental workload metrics are strictly anonymized and protected against corporate punitive use.",
  },
};
