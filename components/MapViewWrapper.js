import React from 'react';
import { Platform } from 'react-native';

// Platform-specific MapView component with Google Maps support
let MapView, Marker, PROVIDER_GOOGLE;

if (Platform.OS === 'web') {
  // For web, use our custom WebMapView
  const WebMapComponents = require('./WebMapView');
  MapView = WebMapComponents.MapView;
  Marker = WebMapComponents.Marker;
  PROVIDER_GOOGLE = 'web';
} else {
  // For native platforms, use the actual react-native-maps
  try {
    const ReactNativeMaps = require('react-native-maps');
    MapView = ReactNativeMaps.default;
    Marker = ReactNativeMaps.Marker;
    // PROVIDER_GOOGLE constant value is 'google'
    PROVIDER_GOOGLE = ReactNativeMaps.PROVIDER_GOOGLE || 'google';
  } catch (error) {
    console.warn('react-native-maps not available, using fallback');
    // Fallback for when react-native-maps is not available
    const WebMapComponents = require('./WebMapView');
    MapView = WebMapComponents.MapView;
    Marker = WebMapComponents.Marker;
    PROVIDER_GOOGLE = 'web';
  }
}

export { MapView, Marker, PROVIDER_GOOGLE };
