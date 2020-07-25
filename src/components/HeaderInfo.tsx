import React from 'react';
import { ICompass, ICoordinates } from '../constants/Interfaces';
import { getDirection } from '../utils/calculations';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

interface IHeaderInfo {
  compassXYZ: ICompass;
  angle: number;
  coordinates: ICoordinates;
}

const HeaderInfo: React.FC<IHeaderInfo> = ({ compassXYZ, angle, coordinates }) => {
  const coordinatesMsg = coordinates.lat !== null
  ? `Your position is [ ${coordinates.lat.toFixed(4)}, ${coordinates.long.toFixed(4)} ]`
  : `Finding coordinates...`;
  const angleMsg = compassXYZ.x === null || angle === null
    ? 'Compass not active' 
    : `You are facing [ ${getDirection(angle)} , angle: ${angle.toFixed(1)} ]`;

  return (
    <View style={styles.headerInfoContainer}>
      <Text>{coordinatesMsg}</Text>
      <Text>{angleMsg}</Text>
    </View>  
  );
};

export default HeaderInfo;