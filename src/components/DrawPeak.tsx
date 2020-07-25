import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutRectangle } from 'react-native';

import { IPeakOnTarget } from '../constants/Interfaces';

const top = 170;
const bottom = 20;
const left = 10;
const right = 10;

const styles = StyleSheet.create({
  singlePeakContainer: {
    borderLeftColor: 'red',
    borderLeftWidth: 1,
    borderTopColor: 'red',
    borderTopWidth: 1,
    borderRightColor: 'red',
    borderRightWidth: 1,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    borderRadius: 5,
    padding: 2,
    position: 'absolute',
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  }
});

const getHorizontalPosition = (horizontalPosition: number, size: LayoutRectangle, index: number) => {
  if (!horizontalPosition || !size) return { left: 0 };

  const { width } = size;

  return { left: horizontalPosition * width, zIndex: index };
};

const getVerticalPosition = (peakDistance: number, maxDistance: number, size: LayoutRectangle) => {
  if (!peakDistance || !maxDistance || !size) return { top: 0 };

  const { height, y } = size;
  const topDistance = (1 - (peakDistance / maxDistance)) * height;

  return { top: topDistance };
};

interface IDrawPeak {
  peakToDraw: IPeakOnTarget;
  maxDistance: number;
  gridSize: LayoutRectangle;
  index: number;
}

const DrawPeak: React.FC<IDrawPeak> = ({ maxDistance, peakToDraw, gridSize, index }) => {
  const styleHorizontal = getHorizontalPosition(peakToDraw.horizontalPosition, gridSize, index);
  const styleVertical = getVerticalPosition(peakToDraw.peak.distance, maxDistance, gridSize);
  const peakName = peakToDraw.peak.peak;
  const peakDistance = peakToDraw.peak.distance;
  const peakAngle = peakToDraw.peak.angle;
  const peakSize = peakToDraw.peak.peakInfo.Elevation;
  const key = `${peakName}-${peakAngle}-${peakDistance}`;

  return (
    <View key={key} style={[styles.singlePeakContainer, styleHorizontal, styleVertical]}>
      <Text>{peakName}</Text>
      <Text>{peakDistance.toFixed(2)}km</Text>
      <Text>{peakAngle.toFixed(1)}˚</Text>
      <Text>{peakSize} ft</Text>
      {/* <Text>left: {styleHorizontal.left.toFixed(2)}</Text>
      <Text>top: {styleVertical.top.toFixed(2)}</Text>
      {/* <Text>max: {maxDistance.toFixed(2)}</Text>
      <Text>H: {gridSize.height.toFixed(2)}</Text>
      <Text>Win: {Dimensions.get('window').height.toFixed(2)}</Text> */}
      {/* <Text>x</Text> */}
    </View>
  );
};

export default DrawPeak;