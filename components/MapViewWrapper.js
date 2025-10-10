import React from 'react';
import { Platform } from 'react-native';

// Platform-specific MapView component
let MapView, Marker;

if (Platform.OS === 'web') {
  // For web, use our custom WebMapView
  const WebMapComponents = require('./WebMapView');
  MapView = WebMapComponents.MapView;
  Marker = WebMapComponents.Marker;
} else {
  // For native platforms, use the actual react-native-maps
  try {
    const ReactNativeMaps = require('react-native-maps');
    MapView = ReactNativeMaps.default;
    Marker = ReactNativeMaps.Marker;
  } catch (error) {
    console.warn('react-native-maps not available, using fallback');
    // Fallback for when react-native-maps is not available
    const WebMapComponents = require('./WebMapView');
    MapView = WebMapComponents.MapView;
    Marker = WebMapComponents.Marker;
  }
}

export { MapView, Marker };
