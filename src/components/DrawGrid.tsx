import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, LayoutRectangle } from 'react-native';

import { IPeakOnTarget } from '../constants/Interfaces';
import DrawPeak from './DrawPeak';

// TODO: top needs to be relative on top info so we get a good experience for all the devices
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

interface IDrawGrid {
  peaksToDraw: IPeakOnTarget[];
  maxDistance: number;
}

const DrawGrid: React.FC<IDrawGrid> = ({ maxDistance, peaksToDraw }) => {
  const [gridSize, setGridSize] = useState<LayoutRectangle>();

  return (
    <View style={styles.grid} onLayout={(event) => {
      // console.log(event.nativeEvent.layout);
      setGridSize(event.nativeEvent.layout);
    }}>
      {peaksToDraw.map((peakToDraw, index) => {
        const key = `${index}-${peakToDraw.peak}`;
        return (
          <DrawPeak key={key} peakToDraw={peakToDraw} maxDistance={maxDistance} gridSize={gridSize} index={index * 2} />
        )
      })}
    </View>
  );
};

export default DrawGrid;