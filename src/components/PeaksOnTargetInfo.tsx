import React from 'react';
import { IPeakInRange, IPeakOnTarget } from '../constants/Interfaces';
import { PEAK_SHOW_MODE } from '../constants/constants';
import { getPeaksOnTarget } from '../utils/calculations';
import { View, Text, StyleSheet } from 'react-native';
import DrawPeaksOnTarget from './DrawPeaksOnTarget';
import ListOfPeaksOnTarget from './ListOfPeaksOnTarget';

const styles = StyleSheet.create({
  peaksInfoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

interface IPeaksOnTargetInfo {
  angle: number;
  peaksInRange: IPeakInRange[];
  show: boolean;
  showMode: string;
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
  const matchesOnTarget = getPeaksOnTarget(angle, peaksInRange, false);
  const matchesMsg = `Peaks on Target (angle): ${matchesOnTarget.length}`;
  const longestDistance = findLongestDistance(peaksInRange);

  return (
    <>
      <View style={styles.peaksInfoContainer}>
        <Text>{peaksInRangeMsg}</Text>
        <Text>{matchesMsg}</Text>
      </View>
      {show && showMode === PEAK_SHOW_MODE.list ? <ListOfPeaksOnTarget peaksToList={matchesOnTarget} /> : null}
      {show && showMode === PEAK_SHOW_MODE.graph 
        ? <DrawPeaksOnTarget drawPeaks={show} peaksToDraw={matchesOnTarget} angle={angle} distance={longestDistance} /> 
        : null
      }
    </>
  );
};

export default PeaksOnTargetInfo;