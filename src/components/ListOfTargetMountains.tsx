import React from 'react';
import { IPeaks, ICoordinates } from '../constants/Interfaces';
import { calculateDistanceBetweenAB, comparePoints } from '../utils/calculations';
import { Text } from 'react-native';

interface IListOfTargetMountains {
  showList: boolean;
  peaksOnTarget: IPeaks;
  currentCoordinates: ICoordinates;
}

const ListOfTargetMountains: React.FC<IListOfTargetMountains> = ({showList, peaksOnTarget, currentCoordinates}) => {
  return (
    <>
      {showList && Object.keys(peaksOnTarget).length !== 0 ? (
        Object.keys(peaksOnTarget).map(match => {
          const key = `match-${match}`;
          const matchCoordinates = { lat: peaksOnTarget[match].Latitude, long: peaksOnTarget[match].Longitude };
          const distance = calculateDistanceBetweenAB(currentCoordinates, matchCoordinates);
          return <Text key={key}>{match} / distance: {distance.toFixed(3)} / angle: {comparePoints(currentCoordinates, matchCoordinates).toFixed(4)}</Text>
        }))
        : null
      }
    </>
  );
};

export default ListOfTargetMountains;