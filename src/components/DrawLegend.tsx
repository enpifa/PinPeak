import React from 'react';
import { ANGLE_THRESHOLD } from '../constants/constants';
import { View, Text, Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  distanceFar: {
    position: 'absolute',
    top: 150,
    left: 5
  },
  distanceZero: {
    position: 'absolute',
    bottom: 20,
    left: 5
  },
  angleLeft: {
    position: 'absolute',
    bottom: 5,
    left: 5
  },
  angleCurrent: {
    position: 'absolute',
    bottom: 5
  },
  angleRight: {
    position: 'absolute',
    bottom: 5,
    right: 5
  },
});

interface IDrawLegend {
  distance: number;
  angle: number;
}

const DrawLegend: React.FC<IDrawLegend> = ({ distance, angle }) => {
  const farDistance = distance ? distance.toFixed(1) : '##';
  const zeroDistance = '0';

  // TODO: fix when angle becomes negative
  const minAngle = angle ? `${(angle - ANGLE_THRESHOLD).toFixed(1)}` : '##';
  const middleAngle = angle ? angle.toFixed(1) : '##';
  const maxAngle = angle ? `${((angle + ANGLE_THRESHOLD) % 360).toFixed(1)}` : '##';

  return (
    <>
      <Text style={styles.distanceFar}>{farDistance} km</Text>
      <Text style={styles.distanceZero}>{zeroDistance}</Text>
      <Text style={styles.angleLeft}>{minAngle}˚</Text>
      <Text style={styles.angleCurrent}>{middleAngle}˚</Text>
      <Text style={styles.angleRight}>{maxAngle}˚</Text>
    </>
  );
};

export default DrawLegend;