import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import MapScreen from '../MapScreen';
// Import check from react-native-permissions
import {check} from 'react-native-permissions';
// Import Geolocation also
import Geolocation from 'react-native-geolocation-service';

describe('<MapScreen />', () => {
  test('should render MapView and Marker with user current location', async () => {
    const {getByTestId} = render(<MapScreen />);

    await waitFor(() => {
      expect(check).toHaveBeenCalledTimes(1);
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(getByTestId('map')).toBeDefined();
    });
  });

  it('should render all existing markers', () => {});
});
