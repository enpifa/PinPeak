import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutRectangle } from 'react-native';

import { IPeakOnTarget } from '../constants/Interfaces';

const top = 170;
const bottom = 10;
const left = 10;
const right = 10;

const styles = StyleSheet.create({
  singlePeakContainer: {
    borderLeftColor: 'red',
    borderLeftWidth: 1,
    borderTopColor: 'red',
    borderTopWidth: 1,
    position: 'absolute'
  }
});

const getHorizontalPosition = (horizontalPosition: number, width: number) => {
  if (!horizontalPosition) return { left: 0 };
  return { left: horizontalPosition * width };
};

const getVerticalPosition = (peakDistance: number, maxDistance: number, height: number, positionY: number) => {
  if (!peakDistance || !maxDistance) return { top: 0 };

  const topDistance = positionY + ((1 - (peakDistance / maxDistance)) * height);
  return { top: topDistance };
};

interface IDrawPeak {
  peakToDraw: IPeakOnTarget;
  maxDistance: number;
  gridSize: LayoutRectangle;
}

const DrawPeak: React.FC<IDrawPeak> = ({ maxDistance, peakToDraw, gridSize }) => {
  const styleHorizontal = getHorizontalPosition(peakToDraw.horizontalPosition, gridSize.width);
  const styleVertical = getVerticalPosition(peakToDraw.peak.distance, maxDistance, gridSize.height, gridSize.y);
  const peakName = peakToDraw.peak.peak;
  const peakDistance = peakToDraw.peak.distance;
  const peakAngle = peakToDraw.peak.angle;
  const peakSize = peakToDraw.peak.peakInfo.Elevation;
  const key = `${peakName}-${peakAngle}-${peakDistance}`;

  return (
    <View key={key} style={[styles.singlePeakContainer, styleHorizontal, styleVertical]}>
      <Text>{peakName}</Text>
      <Text>{peakDistance.toFixed(2)}km</Text>
      {/* <Text>{peakAngle.toFixed(1)}˚</Text> */}
      {/* <Text>{peakSize} ft</Text> */}
      {/* <Text>left: {styleHorizontal.left.toFixed(2)}</Text> */}
      <Text>top: {styleVertical.top.toFixed(2)}</Text>
      <Text>max: {maxDistance.toFixed(2)}</Text>
      <Text>H: {gridSize.height.toFixed(2)}</Text>
      {/* <Text>x</Text> */}
    </View>
  );
};

export default DrawPeak;