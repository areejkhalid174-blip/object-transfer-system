const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web-specific resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add web-specific resolver for react-native-maps
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add web-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

// Block native modules on web
config.resolver.blockList = [
  /node_modules\/react-native-maps\/.*\.(ios|android)\.(js|ts|tsx)$/,
  /node_modules\/react-native-maps\/lib\/MapMarkerNativeComponent\.js$/,
];

// Add alias to completely avoid react-native-maps on web
config.resolver.alias = {
  'react-native-maps': './components/WebMapView.js',
  'react-native-keyboard-controller': './components/KeyboardControllerShim.js',
};

module.exports = config;
