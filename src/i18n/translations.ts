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
    appBadge: "SanderVerse • 2026",
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

    securitySectionTitle: "Segurança e Proteção por Senha",
    securitySectionDesc: "Controle o acesso à aba de configurações para proteger parâmetros do sistema e dados gerenciais.",
    requirePasswordLabel: "Exigir senha para acessar a aba de Configurações",
    requirePasswordDesc: "Quando ativado, solicita a senha mestra toda vez que abrir esta aba.",
    passwordStatusActive: "Proteção por Senha Ativa",
    passwordStatusDisabled: "Acesso Livre (Sem Senha)",
    lockNowBtn: "Bloquear Aba Imediatamente",
    lockNowSuccess: "Aba bloqueada com sucesso! A próxima visita exigirá a senha.",
    changePasswordTitle: "Configurar / Alterar Senha de Acesso",
    currentPasswordLabel: "Senha Atual",
    currentPasswordPlaceholder: "Digite a senha atual...",
    newPasswordLabel: "Nova Senha",
    newPasswordPlaceholder: "Mínimo 4 caracteres...",
    confirmPasswordLabel: "Confirmar Nova Senha",
    confirmPasswordPlaceholder: "Repita a nova senha...",
    saveNewPasswordBtn: "Salvar Nova Senha",
    defaultPasswordNotice: "Senha mestra inicial de fábrica: admin123",
    resetPasswordTitle: "Reestabelecer Senha de Acesso",
    resetPasswordDesc: "Esqueceu a senha configurada? Reestabeleça com facilidade a senha padrão inicial 'admin123'.",
    resetPasswordBtn: "Reestabelecer para Padrão (admin123)",
    resetPasswordConfirmPrompt: "Deseja realmente redefinir a senha para o padrão de fábrica 'admin123'?",
    resetSuccessMessage: "Senha reestabelecida com sucesso para 'admin123'!",
    passwordChangedSuccess: "Senha atualizada com sucesso! Guarde-a em local seguro.",
    errorCurrentPasswordWrong: "A senha atual informada está incorreta.",
    errorPasswordMismatch: "As novas senhas não coincidem.",
    errorPasswordTooShort: "A nova senha deve ter no mínimo 4 caracteres.",

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
    modalPromptDesc: "Esta aba contém ajustes de segurança, idiomas e parâmetros globais. Digite a senha para continuar.",
    modalInputPlaceholder: "Digite a senha de acesso...",
    modalUnlockBtn: "Desbloquear e Entrar",
    modalCancelBtn: "Voltar ao Simulador",
    modalWrongPassword: "Senha incorreta. Tente novamente ou reestabeleça para o padrão.",
    modalForgotLink: "Esqueceu a senha? Reestabelecer para 'admin123'",
    modalResetDirectBtn: "Reestabelecer para admin123",
    modalDefaultTip: "Dica do Administrador: A senha inicial padrão é admin123",

    save: "Salvar Alterações",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Fechar",
    active: "Ativo",
    disabled: "Desativado",
    footerRights: "SSMA Enterprise • SanderVerse 2026",
    footerNorms: "Normas Regulamentadoras MTE (NR-10 a NR-35)",
    footerLgpd: "Conformidade LGPD (Lei nº 13.709/2018)",
    footerApk: "Gerar APK / Instalar Android",
    footerDisclaimer: "Ambiente didático e operacional integrado de Segurança e Saúde no Trabalho. As métricas de carga mental são estritamente anonimizadas e protegidas contra uso punitivo corporativo.",
  },

  es: {
    appName: "SSMA Enterprise",
    appBadge: "SanderVerse • 2026",
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
    settingsSubtitle: "Personalice idioma, seguridad con protección por contraseña y animaciones dinámicas de navegación.",
    languageSectionTitle: "Idioma del Sistema / Multilingüe",
    languageSectionDesc: "Seleccione el idioma de visualización de la interfaz, normativas de seguridad e informes.",
    currentLanguageBadge: "Idioma Activo",

    securitySectionTitle: "Seguridad y Protección por Contraseña",
    securitySectionDesc: "Controle el acceso a la pestaña de configuración para proteger parámetros y datos clave.",
    requirePasswordLabel: "Exigir contraseña para acceder a la pestaña de Configuración",
    requirePasswordDesc: "Cuando está activado, solicita la contraseña maestra cada vez que se abre esta pestaña.",
    passwordStatusActive: "Protección por Contraseña Activa",
    passwordStatusDisabled: "Acceso Libre (Sin Contraseña)",
    lockNowBtn: "Bloquear Pestaña Inmediatamente",
    lockNowSuccess: "¡Pestaña bloqueada! La próxima visita requerirá la contraseña.",
    changePasswordTitle: "Configurar / Cambiar Contraseña de Acceso",
    currentPasswordLabel: "Contraseña Actual",
    currentPasswordPlaceholder: "Ingrese la contraseña actual...",
    newPasswordLabel: "Nueva Contraseña",
    newPasswordPlaceholder: "Mínimo 4 caracteres...",
    confirmPasswordLabel: "Confirmar Nueva Contraseña",
    confirmPasswordPlaceholder: "Repita la nueva contraseña...",
    saveNewPasswordBtn: "Guardar Nueva Contraseña",
    defaultPasswordNotice: "Contraseña maestra inicial predeterminada: admin123",
    resetPasswordTitle: "Restablecer Contraseña de Acceso",
    resetPasswordDesc: "¿Olvidó la contraseña configurada? Restablezca fácilmente a la contraseña de fábrica 'admin123'.",
    resetPasswordBtn: "Restablecer a Valor Predeterminado (admin123)",
    resetPasswordConfirmPrompt: "¿Desea realmente restablecer la contraseña a la predeterminada de fábrica 'admin123'?",
    resetSuccessMessage: "¡Contraseña restablecida con éxito a 'admin123'!",
    passwordChangedSuccess: "¡Contraseña actualizada con éxito! Guárdela en un lugar seguro.",
    errorCurrentPasswordWrong: "La contraseña actual ingresada es incorrecta.",
    errorPasswordMismatch: "Las nuevas contraseñas no coinciden.",
    errorPasswordTooShort: "La nueva contraseña debe tener al menos 4 caracteres.",

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
    modalPromptDesc: "Esta pestaña contiene ajustes de seguridad, idiomas y parámetros globales. Ingrese su contraseña.",
    modalInputPlaceholder: "Ingrese la contraseña de acceso...",
    modalUnlockBtn: "Desbloquear y Entrar",
    modalCancelBtn: "Volver al Simulador",
    modalWrongPassword: "Contraseña incorrecta. Intente de nuevo o restablezca al valor por defecto.",
    modalForgotLink: "¿Olvidó su contraseña? Restablecer a 'admin123'",
    modalResetDirectBtn: "Restablecer a admin123",
    modalDefaultTip: "Consejo del Administrador: La contraseña inicial por defecto es admin123",

    save: "Guardar Cambios",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Cerrar",
    active: "Activo",
    disabled: "Desactivado",
    footerRights: "SSMA Enterprise • SanderVerse 2026",
    footerNorms: "Normas de Seguridad y Salud en el Trabajo (SST)",
    footerLgpd: "Cumplimiento de Privacidad y Protección de Datos",
    footerApk: "Generar APK / Instalar Android",
    footerDisclaimer: "Entorno didáctico y operativo integrado de Seguridad y Salud en el Trabajo. Las métricas de carga mental están estrictamente anonimizadas y protegidas contra uso punitivo.",
  },

  en: {
    appName: "SSMA Enterprise",
    appBadge: "SanderVerse • 2026",
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
    settingsSubtitle: "Customize language, security with password protection, and dynamic navigation animations.",
    languageSectionTitle: "System Language / Multilingual",
    languageSectionDesc: "Choose display language for the interface, safety guidelines, and operational reports.",
    currentLanguageBadge: "Active Language",

    securitySectionTitle: "Security & Password Protection",
    securitySectionDesc: "Control access to the settings tab to protect system parameters and management data.",
    requirePasswordLabel: "Require password to access Settings tab",
    requirePasswordDesc: "When enabled, prompts for the master password every time this tab is opened.",
    passwordStatusActive: "Password Protection Active",
    passwordStatusDisabled: "Free Access (No Password)",
    lockNowBtn: "Lock Tab Immediately",
    lockNowSuccess: "Tab locked successfully! Next visit will require password.",
    changePasswordTitle: "Configure / Change Access Password",
    currentPasswordLabel: "Current Password",
    currentPasswordPlaceholder: "Enter current password...",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Minimum 4 characters...",
    confirmPasswordLabel: "Confirm New Password",
    confirmPasswordPlaceholder: "Repeat new password...",
    saveNewPasswordBtn: "Save New Password",
    defaultPasswordNotice: "Initial factory master password: admin123",
    resetPasswordTitle: "Reset Access Password",
    resetPasswordDesc: "Forgot your custom password? Easily restore the factory default password 'admin123'.",
    resetPasswordBtn: "Reset to Default (admin123)",
    resetPasswordConfirmPrompt: "Are you sure you want to reset password back to factory default 'admin123'?",
    resetSuccessMessage: "Password successfully reset to 'admin123'!",
    passwordChangedSuccess: "Password successfully updated! Keep it in a secure location.",
    errorCurrentPasswordWrong: "The current password entered is incorrect.",
    errorPasswordMismatch: "New passwords do not match.",
    errorPasswordTooShort: "New password must be at least 4 characters long.",

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
    modalPromptDesc: "This tab contains security settings, language options, and system parameters. Enter password to continue.",
    modalInputPlaceholder: "Enter access password...",
    modalUnlockBtn: "Unlock & Enter",
    modalCancelBtn: "Back to Simulator",
    modalWrongPassword: "Incorrect password. Please try again or reset to default.",
    modalForgotLink: "Forgot password? Reset to 'admin123'",
    modalResetDirectBtn: "Reset to admin123",
    modalDefaultTip: "Admin tip: Factory initial password is admin123",

    save: "Save Changes",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    active: "Active",
    disabled: "Disabled",
    footerRights: "SSMA Enterprise • SanderVerse 2026",
    footerNorms: "Occupational Safety and Health Standards (OSH)",
    footerLgpd: "Privacy and Data Protection Compliance",
    footerApk: "Generate APK / Install Android",
    footerDisclaimer: "Integrated educational and operational environment for Occupational Safety and Health. Mental workload metrics are strictly anonymized and protected against corporate punitive use.",
  },
};
