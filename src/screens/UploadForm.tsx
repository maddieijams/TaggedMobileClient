import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import React, {useState} from 'react';
import {Button, TextInput, View} from 'react-native';

export interface GraffitiData {
  title: string;
  description: string;
  lat: number;
  lng: number;
  imageId: string;
}

export default function UploadForm() {
  const [data, setData] = useState<GraffitiData>({
    title: '',
    description: '',
    // pass these in as props from map
    lat: 0,
    lng: 0,
    imageId: '',
  });

  return (
    <View>
      <TextInput placeholder="Title" />
      <TextInput placeholder="Description" />
      <Button
        onPress={() =>
          launchImageLibrary(
            {mediaType: 'photo'},
            ({assets, didCancel, errorCode, errorMessage}) => {
              fetch('http://localhost:3000/graffitis', {
                method: 'POST',
                // should this be uri?
                body: JSON.stringify({...data, imageId: (assets ?? [])[0].uri}),
              })
                .then(res => res.json())
                .then(json => {
                  // do something with error?
                });
            },
          )
        }
        title="Choose a photo"
      />
    </View>
  );
}
