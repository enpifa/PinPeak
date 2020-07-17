import React from 'react';
import { IPeaks, IPeakToDraw, IPeakOnTarget } from '../constants/Interfaces';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  singlePeakContainer: {
    flex: 1,
    position: 'absolute',
    top: 150
  }
});

const getHorizontalPosition = (peakToDraw: IPeakOnTarget) => {
  // if (peakToDraw.length > 0) {
  //   const left = peakToDraw[0].horizontalPosition * Dimensions.get('window').width;
  //   return { left: left };
  // }
  if (!peakToDraw) return {};
  return { left: peakToDraw.horizontalPosition * Dimensions.get('window').width };
};

const getVerticalPosition = (peakToDraw: IPeakOnTarget) => {
  if (!peakToDraw) return {};
  return { top: peakToDraw.peak.distance / 200 * Dimensions.get('window').height };
};

const renderedPeaks = (peaksToDraw: IPeakOnTarget[]) => {
  if (!peaksToDraw) return null;

  return peaksToDraw.map(peak => {
    const styleHorizontal = getHorizontalPosition(peak);
    const styleVertical = getVerticalPosition(peak);
    const peakName = peak.peak.peak;
    const peakDistance = peak.peak.distance;
    const peakAngle = peak.peak.angle;
    const peakSize = peak.peak.peakInfo.Elevation;
    return (
      <View style={[styles.singlePeakContainer, styleHorizontal, styleVertical]}>
        <Text>{peakName}</Text>
        <Text>{peakDistance}</Text>
        <Text>{peakAngle}</Text>
        <Text>{peakSize}</Text>
      </View>
    );
  });
};

interface IDrawPeaksOnTargetInRange {
  drawPeaks: boolean;
  peaksToDraw: IPeakOnTarget[];
}

const DrawPeaksOnTargetInRange: React.FC<IDrawPeaksOnTargetInRange> = ({drawPeaks, peaksToDraw }) => {
  // const drawing = peaksToDraw.map(peak => {
  //   return 
  // })
  // const styleHorizontal = getHorizontalPosition(peaksToDraw[0]);
  // const styleVertical = getVerticalPosition(peaksToDraw[0]);
  // const peakName = peaksToDraw && peaksToDraw[0] && peaksToDraw[0].peak && peaksToDraw[0].peak ? peaksToDraw[0].peak.peak : '';
  return (
    <>
    {drawPeaks ? renderedPeaks(peaksToDraw) : null}
    </>
  );
};

export default DrawPeaksOnTargetInRange;