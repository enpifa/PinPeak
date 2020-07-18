import React from 'react';
import { ICompass, IPeakInRange, IPeakOnTarget } from '../constants/Interfaces';
import { getAngle, getDegree, getFace, getPeaksOnTarget, getPeaksInRange } from '../utils/calculations';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import LPF from 'lpf';

const styles = StyleSheet.create({
  singlePeakContainer: {
    flex: 1,
    position: 'absolute',
    top: 150
  }
});

interface IPeaksOnTargetInfo {
  angle: number;
  peaksInRange: IPeakInRange[];
}

const getTopPeaksOnTarget = (peaksOnTarget: IPeakOnTarget[]) => {
  if (peaksOnTarget.length === 0) return null;

  return peaksOnTarget.map((peak, index) => {
    const peakName = peak.peak.peak;
    const peakDistance = peak.peak.distance.toFixed(2);
    const peakAngle = peak.peak.angle.toFixed(1);
    const peakSize = peak.peak.peakInfo.Elevation;
    const key = `${peakName}-${peakAngle}-${peakDistance}`;
    const message = `${index+1}) ${peakName} | ${peakDistance}km | ${peakAngle}˚ | ${peakSize}ft`
    return (
      <Text key={key}>{message}</Text>
    );
  });
}

const PeaksOnTargetInfo: React.FC<IPeaksOnTargetInfo> = ({ angle, peaksInRange }) => {
  const matches = getPeaksOnTarget(angle, peaksInRange, false);
  const matchesMessage = `Peaks on Target (angle): ${matches.length}`

  return (
    <>
      <Text>{matchesMessage}</Text>
      {getTopPeaksOnTarget(matches)}
    </>  
  );
};

export default PeaksOnTargetInfo;