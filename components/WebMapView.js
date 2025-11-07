import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Web-specific MapView component that completely avoids react-native-maps
const MapView = ({ children, style, initialRegion, onPress, ...props }) => {
  const handlePress = (e) => {
    // For web, simulate coordinate by getting center of map
    if (onPress && initialRegion) {
      onPress({
        nativeEvent: {
          coordinate: {
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }
        }
      });
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      activeOpacity={1}
      onPress={handlePress}
    >
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Map View</Text>
        <Text style={styles.coordinateText}>
          Lat: {initialRegion?.latitude?.toFixed(4) || '0.0000'}
        </Text>
        <Text style={styles.coordinateText}>
          Lng: {initialRegion?.longitude?.toFixed(4) || '0.0000'}
        </Text>
        <Text style={styles.noteText}>Web Preview - Full maps on mobile</Text>
        <Text style={styles.noteText}>Tap to select location</Text>
      </View>
      {children}
    </TouchableOpacity>
  );
};

const Marker = ({ coordinate, title, pinColor, ...props }) => {
  const getMarkerColor = (color) => {
    switch (color) {
      case 'green': return '#4CAF50';
      case 'red': return '#F44336';
      case 'blue': return '#2196F3';
      default: return '#FF9800';
    }
  };

  return (
    <View style={[styles.marker, { backgroundColor: getMarkerColor(pinColor) }]}>
      <Text style={styles.markerText}>📍</Text>
      {title && <Text style={styles.markerTitle}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
    marginLeft: -15,
    marginTop: -15,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 16,
  },
  markerTitle: {
    position: 'absolute',
    top: 35,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 60,
    textAlign: 'center',
  },
});

// Export both named and default exports
export { MapView, Marker };
export default MapView;

// Also export as a module for compatibility
module.exports = MapView;
module.exports.MapView = MapView;
module.exports.Marker = Marker;
