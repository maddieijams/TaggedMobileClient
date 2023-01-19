import React, {useEffect, useState} from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import MapView, {
  Marker,
  MapMarkerProps,
  PROVIDER_GOOGLE,
  MapPressEvent,
} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {customStyleMap} from '../styles';
import {GraffitiData} from './UploadForm';

interface Coords {
  latitude: number;
  longitude: number;
}

interface GraffitiMarker extends MapMarkerProps {
  imageId: string;
}

// click on the map to add a new graffiti
export default function MapScreen() {
  // current location and clicked location?
  const [location, setLocation] = useState<Coords | null>(null);
  const [markers, setMarkers] = useState<GraffitiMarker[]>([]);

  useEffect(() => {
    console.log(markers);
  }, [markers]);

  useEffect(() => {
    fetch('http://localhost:3000/graffitis')
      .then(res => res.json())
      .then((data: GraffitiData[]) => {
        console.log(data);
        const mappedMarkers: GraffitiMarker[] = data.map(
          ({title, description, lat, lng, imageId}) => ({
            title,
            description,
            coordinate: {latitude: lat, longitude: lng},
            imageId,
          }),
        );
        setMarkers(mappedMarkers);
      });
  }, []);

  const handleLocationPermission = async () => {
    let permissionCheck = '';
    if (Platform.OS === 'ios') {
      permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (
        permissionCheck === RESULTS.BLOCKED ||
        permissionCheck === RESULTS.DENIED
      ) {
        const permissionRequest = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('location permission denied.');
      }
    }

    if (Platform.OS === 'android') {
      permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (
        permissionCheck === RESULTS.BLOCKED ||
        permissionCheck === RESULTS.DENIED
      ) {
        const permissionRequest = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('location permission denied.');
      }
    }
  };

  useEffect(() => {
    handleLocationPermission();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    console.log(e.nativeEvent.coordinate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {location && (
        <MapView
          onPress={handleMapPress}
          testID="map"
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 44.590182,
            longitude: -123.2438848,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          customMapStyle={customStyleMap}
          paddingAdjustmentBehavior="automatic"
          showsMyLocationButton={true}
          showsBuildings={true}
          maxZoomLevel={17.5}
          loadingEnabled={true}
          loadingIndicatorColor="#fcb103"
          loadingBackgroundColor="#242f3e">
          {markers.map(({title, description, coordinate}, i) => (
            <Marker
              title={title}
              description={description}
              coordinate={coordinate}
              key={i}
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
