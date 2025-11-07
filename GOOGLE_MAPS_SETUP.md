# Google Maps Setup Instructions

This app uses Google Maps via `react-native-maps` with the `PROVIDER_GOOGLE` provider. Follow these steps to configure Google Maps for your app.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A GCP project with billing enabled
3. Google Maps APIs enabled

## Step 1: Get Your Google Maps API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Geocoding API** (for address conversion)
4. Create API keys:
   - **Android Key:**
     - Go to "APIs & Services" > "Credentials"
     - Click "Create Credentials" > "API Key"
     - Note the API key
     - Click "Restrict Key"
     - Under "Application restrictions", select "Android apps"
     - Add your package name: `com.anonymous.ObjectTransferApp`
   - **iOS Key:**
     - Create another API key
     - Restrict it for iOS apps
     - Add your bundle identifier

## Step 2: Configure API Keys in Your App

Open `app.json` and replace the placeholder API keys:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_ACTUAL_IOS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ACTUAL_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

## Step 3: For Android - Configure Google Maps in AndroidManifest.xml

The AndroidManifest.xml file should already have the API key configured if you're using Expo. If you need to add it manually:

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ANDROID_API_KEY"/>
</application>
```

## Step 4: For iOS - Configure Google Maps in Info.plist

For iOS, the API key is automatically configured through `app.json`. If you need to add it manually to Info.plist:

```xml
<key>GMSApiKey</key>
<string>YOUR_IOS_API_KEY</string>
```

## Step 5: Rebuild Your App

After configuring the API keys, you need to rebuild your app:

```bash
# For Android
npx expo prebuild --platform android
npx expo run:android

# For iOS
npx expo prebuild --platform ios
npx expo run:ios
```

**Note:** Google Maps will NOT work in Expo Go. You must create a development build or eject from Expo Go.

## Usage in the App

The app uses Google Maps in the following places:

1. **PackageDetail.js** - Location picker for pickup and drop locations
2. **CustomerBookTrip.js** - Trip booking with map view

Both screens use `PROVIDER_GOOGLE` to ensure Google Maps is used on native platforms.

## Testing

- **Android Emulator:** Requires Google Play Services to be installed
- **Physical Devices:** Should work out of the box
- **iOS Simulator:** Limited functionality, test on physical device
- **Web:** Uses a placeholder view (WebMapView component)

## Troubleshooting

### "API key not valid" error
- Verify API keys in app.json are correct
- Ensure APIs are enabled in Google Cloud Console
- Check API key restrictions match your app configuration

### Blank map on Android
- Ensure Google Play Services is installed on the emulator
- Check that the API key is properly configured in AndroidManifest.xml
- Verify the Maps SDK for Android is enabled

### Blank map on iOS
- Ensure the API key is properly configured in app.json
- Check that the Maps SDK for iOS is enabled
- Build the app in release mode if testing on a device

### "Development build required" message
- Google Maps doesn't work in Expo Go
- Create a development build: `npx expo run:android` or `npx expo run:ios`

## Security Best Practices

1. **Restrict your API keys** in Google Cloud Console
2. **Never commit API keys** to version control
3. Use environment variables for API keys in production
4. Set up API key restrictions by platform and application

## Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [react-native-maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Expo Maps Configuration](https://docs.expo.dev/versions/latest/sdk/map-view/)

