ValorantHub – Mobile Companion App for VALORANT

Aplikasi mobile berbasis React Native + Expo yang menyediakan informasi lengkap tentang Agen, Senjata, Bundles, Esports, hingga peta lokasi turnamen menggunakan Leaflet.

📱 1. Deskripsi Sistem

ValorantHub adalah aplikasi perangkat bergerak yang dikembangkan menggunakan Expo (Managed Workflow) dan React Native. Aplikasi ini menyediakan data real-time & statis terkait:

Agen & skill

Senjata & statistik damage

Koleksi bundle & skin

Informasi esports & anthem video

Pemetaan lokasi turnamen dunia secara interaktif

🏗️ 2. Arsitektur Teknologi
2.1. Inti & Framework

Expo

React Native

TypeScript

File-based routing via expo-router

2.2. Libraries Utama

axios — HTTP client

expo-av — pemutar video

react-native-webview — Leaflet Map

expo-linear-gradient

react-native-safe-area-context

@expo/vector-icons

@expo-google-fonts/poppins

expo-linking, expo-screen-orientation

📂 3. Struktur Direktori Proyek
ValorantHub/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Agents
│   │   ├── arsenal.tsx        # Weapons
│   │   ├── bundles.tsx        # Bundles
│   │   ├── esports.tsx        # Esports
│   │   ├── map.tsx            # Leaflet Map (WebView)
│   │   └── explore.tsx
│   ├── details/
│   │   ├── agent.tsx
│   │   ├── weapon.tsx
│   │   ├── skin.tsx
│   │   ├── bundle.tsx
│   │   └── tournament.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── components/
│   └── CustomAlert.tsx
├── constants/
│   └── theme.ts
├── assets/
│   ├── images/
│   └── videos/
│       ├── anthem_2021.mp4
│       ├── anthem_2022.mp4
│       ├── anthem_2023.mp4
│       ├── anthem_2024.mp4
│       └── anthem_2025.mp4
└── app.json

⚙️ 4. Modul & Fungsionalitas
4.1. Navigasi Utama (Tabs)
Agents

Fetch data dari API

Filtering berdasarkan role

Arsenal

Grid responsif (otomatis menyesuaikan device)

Filter berdasarkan kategori senjata

Bundles

Search bar untuk memfilter nama bundle

Esports

Menggunakan data lokal + video anthem

Filter berdasarkan tahun (2021–2025)

Map

Leaflet JS dalam WebView

Komunikasi dua arah WebView ↔ React Native

4.2. Modul Detail
Detail Senjata

Statistik lengkap

Damage table dinamis

Validasi skin via CustomAlert

Detail Skin

Auto-detect video → tampilkan <Video />

Jika tidak ada video → tampilkan <Image />

Chroma selector

Detail Turnamen

Pemutar video anthem lokal

Auto-rotate landscape saat full-screen

🔄 5. Alur Data & Logika Bisnis
5.1. Fetching Data

Menggunakan axios via useEffect:

https://valorant-api.com

5.2. Routing Data (URL Serialization)

Encode

encodeURIComponent(JSON.stringify(item))


Decode

JSON.parse(decodeURIComponent(params.data))

5.3. Error Handling

Double tap prevention

Validasi data sebelum render

CustomAlert untuk mencegah aksi invalid

🛠️ 6. Konfigurasi Sistem (app.json)

Package ID: com.valoranthub.app

Version: 1.0.0

UI: Dark Mode only

Default orientation: Portrait

Support tablet & new architecture

🎨 7. Styling (theme.ts)

Primary color: #FF4655 (Merah Valorant)

Background: #0F1923

Font: Poppins (Regular, SemiBold, Bold)

🚀 8. Instalasi & Persiapan Lingkungan
1. Inisialisasi Proyek
npx create-expo-app@latest ValorantHub --template tabs
cd ValorantHub

2. Instalasi Dependensi
Font & Ikon
npm install @expo-google-fonts/poppins expo-font
npm install @expo/vector-icons

UI & Navigasi
npm install react-native-safe-area-context react-native-screens expo-linear-gradient expo-status-bar

Jaringan, Media & Peta
npm install axios
npm install expo-av
npm install react-native-webview
npm install expo-screen-orientation expo-linking

📦 9. Build APK (EAS Build)
1. Instal EAS CLI
npm install -g eas-cli

2. Login & Konfigurasi
eas login
eas build:configure

3. Konfigurasi eas.json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}

4. Build APK
eas build --platform android --profile preview

🌐 10. Dokumentasi API Valorant
Agents
GET https://valorant-api.com/v1/agents?isPlayableCharacter=true

Weapons
GET https://valorant-api.com/v1/weapons

Bundles
GET https://valorant-api.com/v1/bundles


Semua menggunakan axios.

🧭 11. Logika Routing

Tabs → Agents, Arsenal, Bundles, Esports, Map

Stack → Detail Agent, Weapon, Skin, Bundle, Tournament

Root layout memuat font

404 page

🗺️ 12. Modul Khusus
A. Map (Leaflet via WebView)

Load HTML + Leaflet

WebView postMessage → buka halaman detail turnamen

B. Media

Skin: image → video switch

Tournament: full-screen → auto rotate

C. Detail Weapon

Damage table otomatis

CustomAlert jika skin invalid

🖼️ 13. Manajemen Aset & Font

Font via useFonts untuk mencegah FOUT

Video anthem lokal → require()

🎯 14. Kesimpulan

README ini berisi seluruh dokumentasi teknis lengkap untuk ValorantHub, mencakup arsitektur aplikasi, struktur folder, instalasi, API, logika bisnis, hingga panduan build APK.
