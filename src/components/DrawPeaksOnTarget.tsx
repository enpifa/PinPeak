import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutRectangle } from 'react-native';

import { IPeakOnTarget } from '../constants/Interfaces';
import DrawLegend from './DrawLegend';
import DrawGrid from './DrawGrid';

const styles = StyleSheet.create({
  peaksGraphContainer: {
    marginTop: 20
  }
});

interface IDrawPeaksOnTarget {
  drawPeaks: boolean;
  peaksToDraw: IPeakOnTarget[];
  angle: number;
  distance: number;
}

const DrawPeaksOnTarget: React.FC<IDrawPeaksOnTarget> = ({ drawPeaks, peaksToDraw, angle, distance }) => {
  const [gridSize, setGridSize] = useState<LayoutRectangle>();

  return (
    <View style={styles.peaksGraphContainer} onLayout={(event) => {
      setGridSize(event.nativeEvent.layout);
    }}> 
      <DrawLegend distance={distance} angle={angle} size={gridSize} />
      {drawPeaks ? <DrawGrid maxDistance={distance} peaksToDraw={peaksToDraw} size={gridSize} /> : null}
    </View>
  );
};

export default DrawPeaksOnTarget;