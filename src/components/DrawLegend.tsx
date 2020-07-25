import React from 'react';
import { ANGLE_THRESHOLD } from '../constants/constants';
import { View, Text, Dimensions, StyleSheet, LayoutRectangle } from 'react-native';

const styles = StyleSheet.create({
  distanceFar: {
    position: 'absolute',
    left: 5
  },
  distanceZero: {
    position: 'absolute',
    top: Dimensions.get('window').height - 40,
    left: 5
  },
  angleLeft: {
    position: 'absolute',
    top: Dimensions.get('window').height - 20,
    left: 15
  },
  angleCurrent: {
    // position: 'absolute',
    // display: 'flex',
    alignItems: 'center',
    left: '45%',
    right: '50%',
    top: Dimensions.get('window').height - 20,
  },
  angleRight: {
    position: 'absolute',
    top: Dimensions.get('window').height - 20,
    right: 15
  },
});

interface IDrawLegend {
  distance: number;
  angle: number;
  size: LayoutRectangle;
}

const DrawLegend: React.FC<IDrawLegend> = ({ distance, angle, size }) => {
  const initialY = size ? size.y : 0;
  const marginTop = 20;
  const zeroDistanceTop = { top: Dimensions.get('window').height - initialY - marginTop - 20 };
  const anglesTop = { top: Dimensions.get('window').height - initialY - marginTop };
  const farDistance = distance ? distance.toFixed(1) : '##';
  const zeroDistance = '0';

  // TODO: fix when angle becomes negative
  const minAngle = angle ? `${(angle - ANGLE_THRESHOLD).toFixed(1)}` : '##';
  const middleAngle = angle ? angle.toFixed(1) : '##';
  const maxAngle = angle ? `${((angle + ANGLE_THRESHOLD) % 360).toFixed(1)}` : '##';

  return (
    <View>
      <Text style={[styles.distanceFar]}>{farDistance} km</Text>
      <Text style={[styles.distanceZero, zeroDistanceTop]}>{zeroDistance}</Text>
      <Text style={[styles.angleLeft, anglesTop]}>{minAngle}˚</Text>
      <Text style={[styles.angleCurrent, anglesTop]}>{middleAngle}˚</Text>
      <Text style={[styles.angleRight, anglesTop]}>{maxAngle}˚</Text>
    </View>
  );
};

export default DrawLegend;