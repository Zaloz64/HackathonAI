# HackathonAI - Food Allergen Scanner

A React Native (Expo) app that scans food product ingredients and checks for allergens. Users can create personas with specific allergies and scan products to check if they're safe.

## Features

- Scan ingredient labels using your camera
- Barcode scanning for product lookup (Open Food Facts database)
- Persona-based allergen checking (gluten, milk, lactose, soy)
- View detailed allergen analysis results
- Events and profile pages

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your phone (iOS/Android)

## Project Structure

```
src/
├── components/          # UI components
│   ├── BottomNavigation.js
│   ├── EventsPage.js
│   ├── IngredientsModal.js
│   ├── MainContent.js
│   ├── PersonaBar.js
│   ├── ProductModal.js
│   ├── ProfilePage.js
│   ├── Scanner.js
│   ├── TopNavigation.js
│   └── index.js
├── config/
│   └── constants.js     # API URL and persona configuration
├── services/
│   └── api.js           # API calls (scan, classify, product lookup)
├── styles/
│   ├── global.scss
│   └── styles.js        # StyleSheet definitions
└── utils/
    └── helpers.js       # Helper functions
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HackathonAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the backend URL**

   Edit `src/config/constants.js` and set your backend API URL:
   ```javascript
   export const API_URL = 'http://your-backend-url:port';
   ```

   For local development, you can use:
   - `http://localhost:4040` (if running on simulator)
   - `http://<your-ip>:4040` (if running on physical device)
   - An ngrok URL for remote access

## Running the App

1. **Start the Expo development server**
   ```bash
   npm start
   ```

   Or use specific platform commands:
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

2. **Run on your device**
   - Install the [Expo Go](https://expo.dev/client) app on your phone
   - Scan the QR code shown in the terminal
   - Make sure your phone and computer are on the same WiFi network

## Usage

1. **Select Personas**: Tap on persona names at the top to select who you're checking allergies for
2. **Scan Ingredients**: Tap the center scan button to take a photo of ingredient labels
3. **Barcode Scan**: Long-press the scan button to scan product barcodes
4. **View Results**: See if the product is safe for selected personas

## Backend API

The app expects a backend server with the following endpoints:

- `GET /api/ping` - Health check
- `POST /api/scan` - Send image (base64) for OCR and allergen detection
- `POST /api/classify` - Classify text for allergens

## Dependencies

- **expo** - React Native framework
- **expo-camera** - Camera access for barcode scanning
- **expo-image-picker** - Taking photos of ingredients
- **@expo/vector-icons** - Icon library (Ionicons)
- **react-native-safe-area-context** - Safe area handling

## Troubleshooting

**Camera not working?**
- Make sure you've granted camera permissions
- On iOS simulator, camera is not available - use a physical device

**Can't connect to backend?**
- Verify the API_URL in `src/config/constants.js`
- Ensure your device and backend are on the same network
- Check if the backend server is running

**Expo Go not finding the server?**
- Try using tunnel mode: `npx expo start --tunnel`
- Make sure no firewall is blocking the connection
