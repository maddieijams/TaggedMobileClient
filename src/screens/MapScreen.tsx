import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {
  Marker,
  MapMarkerProps,
  PROVIDER_GOOGLE,
  MapPressEvent,
  Region,
  LongPressEvent,
  LatLng,
  Callout,
  MapMarker,
} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {customStyleMap} from '../styles';
import {GraffitiMarker, Screen, UserAddedGraffiti} from '../App';

interface IProps {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  userAddedMarker: UserAddedGraffiti;
  setUserAddedMarker: React.Dispatch<React.SetStateAction<UserAddedGraffiti>>;
  markers: GraffitiMarker[];
}

// click on the map to add a new graffiti
export default function MapScreen({
  setScreen,
  userAddedMarker,
  setUserAddedMarker,
  markers,
}: IProps) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const markerRef = useRef<MapMarker>(null);

  const showCallout = useCallback(() => {
    if (markerRef?.current) markerRef.current.showCallout();
  }, []);

  useEffect(() => {
    showCallout();
  }, [userAddedMarker]);

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

  const handleLongPress = (e: LongPressEvent) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    // setScreen(true);
    setUserAddedMarker({...userAddedMarker, lat: latitude, lng: longitude});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapView
        // onPress={handleMapPress}
        testID="map"
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 38.943868,
          longitude: -109.8516022,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // region={
        //   {...location, latitudeDelta: 0.0922, longitudeDelta: 0.0421} as Region
        // }
        onLongPress={handleLongPress}
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
        {userAddedMarker && (
          <Marker
            ref={markerRef}
            coordinate={{
              latitude: userAddedMarker.lat,
              longitude: userAddedMarker.lng,
            }}
            pinColor={'yellow'}
            onPress={() => showCallout()}>
            <Callout
              // title={`${userAddedMarker.lat}, ${userAddedMarker.lng}`}
              // description={userAddedMarker.description}
              onPress={() => setScreen('upload')}>
              <View>
                <Text>
                  Click here to add a new graffiti at {userAddedMarker.lat},
                  {userAddedMarker.lng}
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
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
  customMarker: {
    ...StyleSheet.absoluteFillObject,
    width: '95%',
    wordWrap: 'break-word',
  },
});
