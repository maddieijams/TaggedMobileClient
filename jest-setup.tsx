import {jest} from '@jest/globals';
import {MapTypes, MapViewProps} from 'react-native-maps';

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');

  // class MockMapView extends React.Component {
  //   render() {
  //     const {testID, children, ...props} = this.props;

  //     return (
  //       <View
  //         {...{
  //           ...props,
  //           testID,
  //         }}>
  //         {children}
  //       </View>
  //     );
  //   }
  // }

  const MockMapView = ({testID, children, ...props}: MapViewProps) => {
    return (
      <View
        {...{
          ...props,
          testID,
        }}>
        {children}
      </View>
    );
  };

  const mockMapTypes: MapTypes = {
    STANDARD: 'standard',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid',
    TERRAIN: 'terrain',
    NONE: 'none',
    MUTEDSTANDARD: 'mutedStandard',
  };

  return {
    __esModule: true,
    default: MockMapView,
    MAP_TYPES: mockMapTypes,
    PROVIDER_DEFAULT: 'default',
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
