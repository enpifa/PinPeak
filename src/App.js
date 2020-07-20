import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Dimensions } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import Constants from 'expo-constants';
// import LPF from 'lpf';

// import ListOfTargetMountains from './components/ListOfTargetMountains';
// import DrawPeaks from './components/DrawPeaks';
import HeaderInfo from './components/HeaderInfo';
import PeaksOnTargetInfo from './components/PeaksOnTargetInfo';

import listOfPeaks from './ListOfPeaks.json';
import { getAngle, getDegree, getPeaksInRange } from './utils/calculations';
import { MAGNETOMETER_AVG_SAMPLE, PEAK_SHOW_MODE } from './constants/constants';

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
  // const [peaksOnTarget, setPeaksOnTarget] = useState([]);
  const [subscription, setSubscription] = React.useState(null);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      if (isMock) mockfn();
      _subscribe();
    }
  };

  const _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Magnetometer.setUpdateInterval(50);
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((result) => {
        setData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  let updateCount = 0;
  let partialCompass = { x: 0, y: 0, z: 0 };
  let isMock = false;

  useEffect(() => {
    async function findCoordinates() {
      navigator.geolocation.getCurrentPosition(
        position => {
          const newCurrentCoordinates = { lat: position.coords.latitude, long: position.coords.longitude };
          setCurrentCoordinates(newCurrentCoordinates);
  
          const newPeaks = getPeaksInRange(listOfPeaks, newCurrentCoordinates, isMock);
          setPeaksInRange(newPeaks);
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };
    findCoordinates();

    // _fast();
    _toggle();
    return () => {
      _unsubscribe();
    };
    // LPF.init([]);
    // LPF.smoothing = 0.3;
  }, []);

  const setData = (magnetometerResult) => {
    if (updateCount === MAGNETOMETER_AVG_SAMPLE) {
      const newCompass = {
        x: partialCompass.x / MAGNETOMETER_AVG_SAMPLE,
        y: partialCompass.y / MAGNETOMETER_AVG_SAMPLE,
        z: partialCompass.z / MAGNETOMETER_AVG_SAMPLE
      };
      setCompass(newCompass);

      // const newAngle = Math.round(LPF.next(getAngle(newCompass)));
      const newAngle = getAngle(newCompass);
      const newDegree = getDegree(newAngle);
      setCurrentAngle(newDegree);

      // const matches = getPeaksOnTarget(newDegree, peaksInRange, isMock);
      // setPeaksOnTarget(matches);

      // reset partial values
      updateCount = 0;
      partialCompass = { x: 0, y: 0, z: 0 };
    }
    else {
      updateCount += 1
      partialCompass.x += magnetometerResult.x;
      partialCompass.y += magnetometerResult.y;
      partialCompass.z += magnetometerResult.z;
    }
  };
      
  return (
    <View style={styles.container}>
      <HeaderInfo angle={currentAngle} compassXYZ={compass} coordinates={currentCoordinates} />
      {/* <ListOfTargetMountains showList={false} peaksOnTarget={peaksOnTarget} currentCoordinates={currentCoordinates} />
      <DrawPeaks drawPeaks={false} peaksInRange={peaksInRange} /> */}
      <PeaksOnTargetInfo angle={currentAngle} peaksInRange={peaksInRange} show={true} showMode={PEAK_SHOW_MODE.list}/>
    </View>
  );
}
