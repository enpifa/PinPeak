import React from 'react';
import { IPeakOnTarget } from '../constants/Interfaces';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listOfPeaksOnTargetContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

interface IListOfPeaksOnTarget {
  peaksToList: IPeakOnTarget[];
}

const ListOfPeaksOnTarget: React.FC<IListOfPeaksOnTarget> = ({ peaksToList }) => {
  return (
    <View style={styles.listOfPeaksOnTargetContainer}>
      {peaksToList.map((peak, index) => {
      const peakName = peak.peak.peak;
      const peakDistance = peak.peak.distance.toFixed(2);
      const peakAngle = peak.peak.angle.toFixed(1);
      const peakSize = peak.peak.peakInfo.Elevation;
      const key = `${peakName}-${peakAngle}-${peakDistance}`;
      const message = `${index+1}) ${peakName} | ${peakDistance}km | ${peakAngle}˚ | ${peakSize}ft`
      return (
        <Text key={key}>{message}</Text>
        );
      })}
    </View>
  );
};

export default ListOfPeaksOnTarget;