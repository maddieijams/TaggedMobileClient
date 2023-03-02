import {
  Callback,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {GraffitiData, INITIAL_FORM_DATA, Screen} from '../App';
import CloseButton from '../../components/CloseButton';

interface IProps {
  formData: GraffitiData;
  setFormData: React.Dispatch<React.SetStateAction<GraffitiData>>;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

export default function UploadForm({formData, setFormData, setScreen}: IProps) {
  React.useEffect(() => {
    console.log('FORM DATA STATE:', formData);
  }, [formData]);

  // const handleUploadPhoto: Callback = async ({
  //   assets,
  //   // didCancel,
  //   // errorCode,
  //   // errorMessage,
  // }) => {
  //   setFormData({...formData, imageId: assets![0].base64 ?? ''});
  // };

  const backToPreviousScreen = () => setScreen(prevScreen => prevScreen);

  const handleSubmit = async () => {
    const body = new FormData();
    body.append('title', formData.title);
    body.append('description', formData.description);
    body.append('imageId', formData.imageId);
    body.append('lat', formData.lat);
    body.append('lng', formData.lng);
    const res = await fetch('http://localhost:3000/graffitis', {
      method: 'POST',
      body,
    });
    const data = await res.json();
    console.log('SUBMITTED ->', data);
    backToPreviousScreen();
    setFormData(INITIAL_FORM_DATA);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CloseButton handleClose={() => backToPreviousScreen()} />
      <TextInput
        placeholder="Title"
        onChangeText={text => setFormData({...formData, title: text})}
      />
      <TextInput
        placeholder="Description"
        onChangeText={text => setFormData({...formData, description: text})}
      />
      <Button
        onPress={() =>
          launchImageLibrary(
            {mediaType: 'photo', includeBase64: true},
            ({assets, didCancel, errorCode, errorMessage}) =>
              setFormData({...formData, imageId: assets![0].base64 ?? ''}),
          )
        }
        title="Choose a photo"
      />
      <Button onPress={handleSubmit} title="Submit" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
