import React from 'react';
import { ICompass, IPeakInRange } from '../constants/Interfaces';
import { getAngle, getDegree, getFace, getPeaksOnTarget, getPeaksInRange } from '../utils/calculations';
import PeaksOnTargetInfo from './PeaksOnTargetInfo';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import LPF from 'lpf';

const styles = StyleSheet.create({
  singlePeakContainer: {
    flex: 1,
    position: 'absolute',
    top: 150
  }
});

interface IHeaderInfo {
  compassXYZ: ICompass;
  peaksInRange: IPeakInRange[];
}

const HeaderInfo: React.FC<IHeaderInfo> = ({ compassXYZ, peaksInRange }) => {
  // const newAngle = Math.round(LPF.next(getAngle(compassXYZ)));
  const newAngle = getAngle(compassXYZ);
  const currentAngle = getDegree(newAngle);
  const angleMessage = compassXYZ.x === null 
    ? 'Compass not active' 
    : `You are facing [ ${getFace(compassXYZ)} , angle: ${currentAngle.toFixed(1)} ]`;
  const peaksInRangeMessage = `Peaks in Range (km): ${peaksInRange.length}`;

  return (
    <>
      <Text>{angleMessage}</Text>
      <Text>{peaksInRangeMessage}</Text>
      <PeaksOnTargetInfo angle={currentAngle} peaksInRange={peaksInRange} />
    </>  
  );
};

export default HeaderInfo;