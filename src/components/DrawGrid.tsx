import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutRectangle } from 'react-native';

import { IPeakOnTarget } from '../constants/Interfaces';
import DrawPeak from './DrawPeak';

const top = 170;
const bottom = 10;
const left = 10;
const right = 10;

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    position: 'absolute',
    top: top,
    height: Dimensions.get('window').height - top - bottom,
    width: Dimensions.get('window').width - left - right,
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  }
});

// const getHorizontalPosition = (horizontalPosition: number, width: number) => {
//   if (!horizontalPosition) return { left: 0 };
//   return { left: horizontalPosition * width };
// };

// const getVerticalPosition = (peakDistance: number, maxDistance: number, height: number) => {
//   if (!peakDistance || !maxDistance) return { top: 0 };

//   const topDistance = (1 - (peakDistance / maxDistance)) * height;
//   return { top: topDistance };
// };

// const renderedPeaks = (peaksToDraw: IPeakOnTarget[], maxDistance: number, gridSize: LayoutRectangle):React.ReactNode[] => {
//   if (!peaksToDraw || !maxDistance || !gridSize) return null;

//   return peaksToDraw.map(peak => {
//     const styleHorizontal = getHorizontalPosition(peak.horizontalPosition, gridSize.width);
//     const styleVertical = getVerticalPosition(peak.peak.distance, maxDistance, gridSize.height);
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
//         <Text>{styleHorizontal.left.toFixed(2)}</Text>
//         <Text>{styleVertical.top.toFixed(2)}</Text>
//         {/* <Text>x</Text> */}
//       </View>
//     );
//   });
// };

interface IDrawLegend {
  peaksToDraw: IPeakOnTarget[];
  maxDistance: number;
}

const DrawLegend: React.FC<IDrawLegend> = ({ maxDistance, peaksToDraw }) => {
  const [gridSize, setGridSize] = useState<LayoutRectangle>();

  return (
    <View style={styles.grid} onLayout={(event) => {
      console.log(event.nativeEvent.layout);
      setGridSize(event.nativeEvent.layout);
    }}>
      {peaksToDraw.map(peakToDraw => {
        return (
          <DrawPeak peakToDraw={peakToDraw} maxDistance={maxDistance} gridSize={gridSize} />
        )
      })}
    </View>
  );
};

export default DrawLegend;