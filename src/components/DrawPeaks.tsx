import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

import { IPeakOnTarget } from '../constants/Interfaces';
import DrawLegend from './DrawLegend';
import DrawGrid from './DrawGrid';

const styles = StyleSheet.create({
  singlePeakContainer: {
    flex: 1,
    position: 'absolute',
    left: 150,
    top: 150
  }
});

// const getHorizontalPosition = (peakToDraw: IPeakOnTarget) => {
//   if (!peakToDraw) return {};
//   return { left: peakToDraw.horizontalPosition * Dimensions.get('window').width };
// };

// const getVerticalPosition = (peakToDraw: IPeakOnTarget) => {
//   if (!peakToDraw) return {};
//   return { top: peakToDraw.peak.distance / 200 * Dimensions.get('window').height };
// };

// const renderedPeaks = (peaksToDraw: IPeakOnTarget[]):React.ReactNode[] => {
//   if (!peaksToDraw) return null;

//   return peaksToDraw.map(peak => {
//     const styleHorizontal = getHorizontalPosition(peak);
//     const styleVertical = getVerticalPosition(peak);
//     const peakName = peak.peak.peak;
//     const peakDistance = peak.peak.distance;
//     const peakAngle = peak.peak.angle;
//     const peakSize = peak.peak.peakInfo.Elevation;
//     const key = `${peakName}-${peakAngle}-${peakDistance}`;
//     return (
//       <View key={key} style={[styles.singlePeakContainer, styleHorizontal, styleVertical]}>
//         <Text>{peakName}</Text>
//         <Text>{peakDistance.toFixed(2)}km</Text>
//         <Text>{peakAngle.toFixed(1)}˚</Text>
//         <Text>{peakSize} ft</Text>
//         {/* <Text>x</Text> */}
//       </View>
//     );
//   });
// };

interface IDrawPeaks {
  drawPeaks: boolean;
  peaksToDraw: IPeakOnTarget[];
  angle: number;
  distance: number;
}

const DrawPeaks: React.FC<IDrawPeaks> = ({ drawPeaks, peaksToDraw, angle, distance }) => {
  return (
    <>
      <DrawLegend distance={distance} angle={angle} />
      {drawPeaks ? <DrawGrid maxDistance={distance} peaksToDraw={peaksToDraw }/> : null}
      {/* {drawPeaks ? renderedPeaks(peaksToDraw) : null} */}
    </>
  );
};

export default DrawPeaks;