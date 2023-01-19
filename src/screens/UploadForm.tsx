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
  const [formData, setFormData] = useState<GraffitiData>({
    title: '',
    description: '',
    // pass these in as props from map
    lat: 0,
    lng: 0,
    imageId: '',
  });

  React.useEffect(() => {
    console.log('FORM DATA STATE:', formData);
  }, [formData]);

  return (
    <View>
      <TextInput placeholder="Title" />
      <TextInput placeholder="Description" />
      <Button
        onPress={() =>
          launchImageLibrary(
            {mediaType: 'photo'},
            async ({assets, didCancel, errorCode, errorMessage}) => {
              const res = await fetch('http://localhost:3000/graffitis', {
                method: 'POST',
                // should this be uri?
                body: JSON.stringify({
                  ...formData,
                  imageId: (assets ?? [])[0].uri as string,
                }),
              });
              const data = await res.json();
              console.log('UPLOADED PHOTO DATA', data);
              setFormData({...formData, imageId: assets![0] as any});
            },
          )
        }
        title="Choose a photo"
      />
    </View>
  );
}
