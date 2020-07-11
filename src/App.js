import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import LPF from 'lpf';
import listOfPeaks from './ListOfPeaks.json';

import peakDB from './constants/peakDB';
import { comparePoints, getAngle, getDegree, getDirection, findAngleMatch, calculateDistanceBetweenAB } from './utils/calculations';
// import {magnetometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";
// import Geolocation from '@react-native-community/geolocation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helloMessage: {
    fontSize: 20
  }
});

// NOTE: latitude refers to N/S, which corresponds to the Y axis
// the same way, longitude refers to E/W, which corresponds to the X axis

export default function App() {
  const initialCompass = {x: null, y: null, z: null};
  const initialCoords = {lat: null, long: null};
  const [compass, setCompass] = useState(initialCompass);
  const [coords, setCoords] = useState(initialCoords);
  const [face, setFace] = useState(null);
  const [target, setTarget] = useState([]);
  let updateCount = 0;
  let partialCompass = { x: 0, y: 0, z: 0 };

  useEffect(() => {
    LPF.init([]);
    LPF.smoothing = 0.4;
    Magnetometer.removeAllListeners();
    setCompass(initialCompass);
    setCoords(initialCoords);
    setFace(null);
    findCoordinates();
    findXYZ();
  }, []);
  
  const findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const coords = { lat: position.coords.latitude, long: position.coords.longitude };
        setCoords(coords);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
      
  const findXYZ = () => {
    Magnetometer.setUpdateInterval(40);
    Magnetometer.addListener(xyz => {
      if (updateCount === 7) {
        updateCount = 0;
        const newCompass = { x: partialCompass.x / 5, y: partialCompass.y / 5, z: partialCompass.z / 5 };
        setCompass(newCompass);
        const newAngle = Math.round(LPF.next(getAngle(newCompass)));
        const newDegree = getDegree(newAngle);
        setFace(newDegree);
  
        const matches = findAngleMatch(newDegree, listOfPeaks, coords);
        setTarget(matches);
        partialCompass = { x: 0, y: 0, z: 0 };
      }
      else {
        updateCount += 1
        partialCompass.x += xyz.x;
        partialCompass.y += xyz.y;
        partialCompass.z += xyz.z;
      }
    });
    // Magnetometer.removeAllListeners();
  }

  const getFace = () => {
    const newAngle = getAngle(compass);
    const newDegree = getDegree(newAngle);
    const newDirection = getDirection(newDegree);

    return newDirection;

    // const matches = findAngleMatch(newDegree, peakDB, coords);
    
    // setTarget(matches);
    // setFace(newDegree);
  };

  const mockMatch = findAngleMatch(191.0, listOfPeaks, {lat: 39.798, long: -105.074});
      
  return (
    <View style={styles.container}>
      {coords.lat !== null ? (<Text>Your position is [ {coords.lat}, {coords.long} ]</Text>) : null}
      {/* {compass.x !== null ? (<Text>[ {compass.x.toFixed(3)} | {compass.y.toFixed(3)} | {compass.z.toFixed(3)} ]</Text>) : null} */}
      <Text>You are facing [ {getFace()} , angle: {face} ]</Text>
      <Text>#Matches: {target.length}</Text>
      {target.length !== 0 ? (
        target.map(match => {
          const key = `match-${match}`;
          const matchCoords = { lat: listOfPeaks[match].Latitude, long: listOfPeaks[match].Longitude };
          const distance = calculateDistanceBetweenAB(coords, matchCoords);
          return <Text key={key}>{match} / distance: {distance.toFixed(3)} / angle: {comparePoints(coords, matchCoords).toFixed(4)}</Text>
        })
      ) : null}
      {/* {coords.long !== null ? (
        Object.keys(listOfPeaks).map(peak => {
          const target = { lat: listOfPeaks[peak].Latitude, long: listOfPeaks[peak].Longitude };
          return <Text key={peak}>{peak} => [angle]: {comparePoints(coords, target).toFixed(4)} / [distance]: {calculateDistanceBetweenAB(coords, target).toFixed(4)}</Text>
        })
      ) : null} */}
      {/* <Button title="Get Coordinates" onPress={findCoordinates} /> */}
      {/* <Button title="Get XYZ" onPress={findXYZ} /> */}
      {/* <Button title="Where am I facing?" onPress={getFace} /> */}
    </View>
  );
}
