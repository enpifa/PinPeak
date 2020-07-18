import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Dimensions } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import Constants from 'expo-constants';
import LPF from 'lpf';
import listOfPeaks from './ListOfPeaks.json';
import { getAngle, getDegree, getFace, getPeaksOnTarget, getPeaksInRange } from './utils/calculations';
import ListOfTargetMountains from './components/ListOfTargetMountains';
import DrawPeaksOnTargetInRange from './components/DrawPeaksOnTargetInRange';
import { MAGNETOMETER_AVG_SAMPLE } from './constants/constants';
// import {magnetometer, SensorTypes, setUpdateIntervalForType} from "react-native-sensors";
// import Geolocation from '@react-native-community/geolocation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight
    // justifyContent: 'center',
  },
  helloMessage: {
    fontSize: 20
  }
});

// NOTE: latitude refers to N/S, which corresponds to the Y axis
// the same way, longitude refers to E/W, which corresponds to the X axis

export default function App() {
  const initialCompass = {x: null, y: null, z: null};
  const initialCoordinates = {lat: null, long: null};

  const [compass, setCompass] = useState(initialCompass);
  const [currentCoordinates, setCurrentCoordinates] = useState(initialCoordinates);
  const [currentAngle, setCurrentAngle] = useState(null);
  const [peaksInRange, setPeaksInRange] = useState([]);
  const [peaksOnTarget, setPeaksOnTarget] = useState([]);
  // const [positionOfPeaksOnTarget, setPositionOfPeaksOnTarget] = useState([]);

  let updateCount = 0;
  let partialCompass = { x: 0, y: 0, z: 0 };
  let isMock = true;

  useEffect(() => {
    LPF.init([]);
    LPF.smoothing = 0.3;
    findCoordinates(findXYZ);
  }, []);
  
  const findCoordinates = (callback) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const newCurrentCoordinates = { lat: position.coords.latitude, long: position.coords.longitude };
        setCurrentCoordinates(newCurrentCoordinates);

        const newPeaks = getPeaksInRange(listOfPeaks, newCurrentCoordinates);
        setPeaksInRange(newPeaks);

        callback();
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
      
  const findXYZ = () => {
    Magnetometer.setUpdateInterval(50);
    Magnetometer.addListener(xyz => {
      // if (peaksInRange === null) {
      //   setTimeout(1000);
      //   return;
      // }
      if (updateCount === MAGNETOMETER_AVG_SAMPLE) {
        const newCompass = {
          x: partialCompass.x / MAGNETOMETER_AVG_SAMPLE,
          y: partialCompass.y / MAGNETOMETER_AVG_SAMPLE,
          z: partialCompass.z / MAGNETOMETER_AVG_SAMPLE
        };
        setCompass(newCompass);

        const newAngle = Math.round(LPF.next(getAngle(newCompass)));
        const newDegree = getDegree(newAngle, isMock);
        setCurrentAngle(newDegree);

        const matches = getPeaksOnTarget(newDegree, peaksInRange);
        setPeaksOnTarget(matches);
        // setPositionOfPeaksOnTarget(positions);

        // reset partial values
        updateCount = 0;
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

  // const [mock1, mock2] = findAngleMatch(315, peaksInRange, currentCoordinates);
      
  return (
    <View style={styles.container}>
      {currentCoordinates.lat !== null ? (<Text>Your position is [ {currentCoordinates.lat}, {currentCoordinates.long} ]</Text>) : null}
      {/* {compass.x !== null ? (<Text>[ {compass.x.toFixed(3)} | {compass.y.toFixed(3)} | {compass.z.toFixed(3)} ]</Text>) : null} */}
      <Text>You are facing [ {getFace(compass)} , angle: {currentAngle} ]</Text>
      <Text>#Matches: {Object.keys(peaksOnTarget).length}/{Object.keys(peaksInRange).length}</Text>
      <ListOfTargetMountains showList={false} peaksOnTarget={peaksOnTarget} currentCoordinates={currentCoordinates} />
      <DrawPeaksOnTargetInRange drawPeaks={true} peaksToDraw={peaksOnTarget} />
    </View>
  );
}
