import React from 'react';
import { ICompass, IPeakInRange, IPeakOnTarget } from '../constants/Interfaces';
import { PEAK_SHOW_MODE } from '../constants/constants';
import { getAngle, getDegree, getFace, getPeaksOnTarget, getPeaksInRange } from '../utils/calculations';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import LPF from 'lpf';
import DrawPeaks from './DrawPeaks';

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
  show: boolean;
  showMode: string;
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

const findLongestDistance = (peaksInRange: IPeakInRange[]): number => {
  if (peaksInRange.length === 0) return null;

  return peaksInRange.reduce((currentLongest, peak) => {
    if (peak.distance > currentLongest) return peak.distance;

    return currentLongest;
  }, 0);
};

const PeaksOnTargetInfo: React.FC<IPeaksOnTargetInfo> = ({ angle, peaksInRange, show, showMode }) => {
  const peaksInRangeMsg = `Peaks in Range (km): ${peaksInRange.length}`;
  const matchesOnTarget = getPeaksOnTarget(angle, peaksInRange, true);
  const matchesMsg = `Peaks on Target (angle): ${matchesOnTarget.length}`;
  const longestDistance = findLongestDistance(peaksInRange);

  return (
    <>
      <Text>{peaksInRangeMsg}</Text>
      <Text>{matchesMsg}</Text>
      {show && showMode === PEAK_SHOW_MODE.list ? getTopPeaksOnTarget(matchesOnTarget) : null}
      {show && showMode === PEAK_SHOW_MODE.graph 
        ? <DrawPeaks drawPeaks={show} peaksToDraw={matchesOnTarget} angle={angle} distance={longestDistance} /> 
        : null
      }
    </>  
  );
};

export default PeaksOnTargetInfo;