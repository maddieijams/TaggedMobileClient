import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {LatLng, MapMarkerProps} from 'react-native-maps';
import List from './screens/List';
import MapScreen from './screens/MapScreen';
import UploadForm from './screens/UploadForm';

export interface GraffitiData {
  title: string;
  description: string;
  lat: number;
  lng: number;
  imageId: string;
}
export interface GraffitiMarker extends MapMarkerProps {
  imageId: string;
}
export type UserAddedGraffiti = Omit<GraffitiData, 'imageId'>;
export const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  lat: 0,
  lng: 0,
  imageId: '',
};
export type Screen = 'upload' | 'map' | 'list';

const App = () => {
  const [formData, setFormData] = useState<GraffitiData>(INITIAL_FORM_DATA);
  const [userAddedMarker, setUserAddedMarker] = useState<UserAddedGraffiti>({
    title: 'New Graffiti',
    description: 'Click to add a new graffiti at this location',
    lat: 0,
    lng: 0,
  });
  const [markers, setMarkers] = useState<GraffitiMarker[]>([]);
  const [list, setList] = useState<GraffitiData[]>([]);
  const [screen, setScreen] = useState<Screen>('list');

  useEffect(() => {
    fetch('http://localhost:3000/graffitis')
      .then(res => res.json())
      .then((data: GraffitiData[]) => {
        const mappedMarkers: GraffitiMarker[] = data.map(
          ({title, description, lat, lng, imageId}) => ({
            title,
            description,
            coordinate: {latitude: lat, longitude: lng},
            imageId,
          }),
        );
        setList(data);
        setMarkers(mappedMarkers);
      });
  }, []);

  switch (screen) {
    case 'list':
      return <List list={list} />;
    case 'map':
      return (
        <MapScreen
          setScreen={setScreen}
          userAddedMarker={userAddedMarker}
          setUserAddedMarker={setUserAddedMarker}
          markers={markers}
        />
      );
    case 'upload':
      return (
        <UploadForm
          setScreen={setScreen}
          formData={formData}
          setFormData={setFormData}
        />
      );
  }
};

export default App;
