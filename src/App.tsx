import React, {useState} from 'react';
import {Button} from 'react-native';
import MapScreen from './screens/MapScreen';
import UploadForm, {GraffitiData} from './screens/UploadForm';

const App = () => {
  const [formData, setFormData] = useState<GraffitiData>({
    title: '',
    description: '',
    // pass these in as props from map
    lat: 0,
    lng: 0,
    imageId: '',
  });
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);

  // return <MapScreen />;
  return (
    <>
      <Button
        onPress={() => setShowUploadForm(true)}
        title="Add a new graffiti"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      {/* <MapScreen /> */}
      {showUploadForm && <UploadForm />}
    </>
  );
};

export default App;
