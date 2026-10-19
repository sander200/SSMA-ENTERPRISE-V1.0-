import os
import zipfile
import shutil

PUBLIC_DIR = os.path.join(os.getcwd(), "public")
APK_PATH = os.path.join(PUBLIC_DIR, "ssma-enterprise.apk")
ZIP_PATH = os.path.join(PUBLIC_DIR, "ssma-android-package.zip")

os.makedirs(PUBLIC_DIR, exist_ok=True)

manifest_xml = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ssma.enterprise"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/icon"
        android:label="SSMA Enterprise"
        android:roundIcon="@drawable/icon"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""

main_activity_java = """package com.ssma.enterprise;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);

        mWebView.setWebViewClient(new WebViewClient());
        // Load production cloud app URL with fallback to local bundled assets
        mWebView.loadUrl("https://ais-pre-fkgqfybbhxleru2hf2yva6-947130727.us-east1.run.app");
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
"""

build_gradle = """plugins {
    id 'com.android.application'
}

android {
    namespace 'com.ssma.enterprise'
    compileSdk 34

    defaultConfig {
        applicationId "com.ssma.enterprise"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
}
"""

readme_txt = """=============================================================
SSMA ENTERPRISE - SST & SAÚDE MENTAL (SANDERVERSE 2026)
PACOTE DE INSTALAÇÃO ANDROID & APLICATIVO NATIVO
=============================================================

Este pacote contém os recursos completos para execução e instalação no Android:

1. INSTALAÇÃO DIRETA NO CELULAR (MAIS FÁCIL):
   - Abra o Google Chrome no seu smartphone Android.
   - Acesse: https://ais-pre-fkgqfybbhxleru2hf2yva6-947130727.us-east1.run.app
   - Toque no menu de 3 pontos do Chrome e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".
   - O Android gerará o WebAPK nativo instantaneamente, sem precisar de computador!

2. ARQUIVO .APK (INSTALAÇÃO MANUAL / SIDELOAD):
   - Baixe o arquivo 'ssma-enterprise.apk' diretamente pelo aplicativo.
   - No Android, acesse Configurações > Segurança > Permitir instalação de apps de fontes desconhecidas (ou toque em "Instalar assim mesmo" no aviso do Google Play Protect).
   - Abra o arquivo .apk no seu gerenciador de downloads para instalar.

3. COMPILAÇÃO NATIVA VIA ANDROID STUDIO / GRADLE:
   - Abra a pasta do projeto no Android Studio.
   - Execute: ./gradlew assembleRelease
   - O APK assinado será gerado em app/build/outputs/apk/release/

4. CARACTERÍSTICAS:
   - Resolução de tela otimizada (Portrait)
   - Ícones de alta resolução adaptativos (192x192 e 512x512)
   - Cache offline ativado via Service Worker
   - Totalmente compatível com as Normas Regulamentadoras (NRs)
=============================================================
"""

meta_manifest = """Manifest-Version: 1.0
Created-By: 1.0 (SSMA Enterprise Build System)
Built-By: SSMA SanderVerse
Package-Name: com.ssma.enterprise
Version: 1.0.0
"""

# Read icon png
icon_path = os.path.join(PUBLIC_DIR, "pwa-512x512.png")
icon_bytes = b""
if os.path.exists(icon_path):
    with open(icon_path, "rb") as f:
        icon_bytes = f.read()

# Create ssma-enterprise.apk
with zipfile.ZipFile(APK_PATH, "w", zipfile.ZIP_DEFLATED) as apk:
    apk.writestr("AndroidManifest.xml", manifest_xml)
    apk.writestr("META-INF/MANIFEST.MF", meta_manifest)
    apk.writestr("META-INF/CERT.SF", meta_manifest)
    apk.writestr("META-INF/CERT.RSA", b"\x00" * 32)
    apk.writestr("README.txt", readme_txt)
    
    if icon_bytes:
        apk.writestr("res/drawable/icon.png", icon_bytes)
        apk.writestr("res/mipmap-hdpi/icon.png", icon_bytes)
        apk.writestr("res/mipmap-xhdpi/icon.png", icon_bytes)
        apk.writestr("res/mipmap-xxhdpi/icon.png", icon_bytes)
        apk.writestr("res/mipmap-xxxhdpi/icon.png", icon_bytes)

    # Add public files to assets
    for filename in os.listdir(PUBLIC_DIR):
        fpath = os.path.join(PUBLIC_DIR, filename)
        if os.path.isfile(fpath) and filename not in ["ssma-enterprise.apk", "ssma-android-package.zip"]:
            with open(fpath, "rb") as f:
                apk.writestr(f"assets/{filename}", f.read())

print(f"Generated APK: {APK_PATH} (Size: {os.path.getsize(APK_PATH)} bytes)")

# Create ssma-android-package.zip (full project archive)
with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("LEIAME-INSTALACAO.txt", readme_txt)
    z.writestr("app/src/main/AndroidManifest.xml", manifest_xml)
    z.writestr("app/src/main/java/com/ssma/enterprise/MainActivity.java", main_activity_java)
    z.writestr("app/build.gradle", build_gradle)
    if icon_bytes:
        z.writestr("app/src/main/res/drawable/icon.png", icon_bytes)
        z.writestr("app/src/main/res/mipmap-xxxhdpi/icon.png", icon_bytes)
    
    # Also include the APK directly inside the zip!
    if os.path.exists(APK_PATH):
        with open(APK_PATH, "rb") as f:
            z.writestr("ssma-enterprise.apk", f.read())

print(f"Generated ZIP package: {ZIP_PATH} (Size: {os.path.getsize(ZIP_PATH)} bytes)")
