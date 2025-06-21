export default {
  expo: {
    name: "FinancialTrack",
    slug: "FinancialTrack",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "financialtrack",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.financialtrack",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
      EXPO_PUBLIC_AUTH_DOMAIN: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
      EXPO_PUBLIC_PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
      EXPO_PUBLIC_STORAGE_BUCKET: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
      EXPO_PUBLIC_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID
    }
  }
}; 