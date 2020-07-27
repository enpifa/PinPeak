import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import Constants from 'expo-constants';
import LPF from 'lpf';
import HeaderInfo from './components/HeaderInfo';
import PeaksOnTargetInfo from './components/PeaksOnTargetInfo';

import listOfPeaks from './ListOfPeaks.json';
import { getAngle, getDegree, getPeaksInRange, updateCompassData } from './utils/calculations';
import { PEAK_SHOW_MODE } from './constants/constants';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    paddingTop: Constants.statusBarHeight
    // justifyContent: 'center',
  }
});

// NOTE: latitude refers to N/S, which corresponds to the Y axis
// the same way, longitude refers to E/W, which corresponds to the X axis

export default function App() {
  const initialCompass = {x: 0, y: 0, z: 0};
  const initialCoordinates = {lat: null, long: null};

  const [compass, setCompass] = useState(initialCompass);
  const [currentCoordinates, setCurrentCoordinates] = useState(initialCoordinates);
  const [currentAngle, setCurrentAngle] = useState(null);
  const [peaksInRange, setPeaksInRange] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [magnetometerCount, setMagnetometerCount] = useState(0);
  const [partialCompass, setPartialCompass] = useState(initialCompass);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _slow = () => {
    Magnetometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Magnetometer.setUpdateInterval(40);
  };

  const _subscribe = () => {
    _fast();
    setSubscription(
      Magnetometer.addListener((result) => {
        const newCompass = updateCompassData(result, magnetometerCount, partialCompass);

        if (newCompass !== {}) updateOnThreshold(newCompass);
        else updateOnNoThreshold();
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // let updateCount = 0;
  // let partialCompass = { x: 0, y: 0, z: 0 };
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
    LPF.init([]);
    LPF.smoothing = 0.3;
  }, []);

  const updateOnThreshold = (newCompass) => {
    setCompass(newCompass);

    // const newAngle = Math.round(LPF.next(getAngle(newCompass)));
    const newAngle = getAngle(newCompass);
    const newDegree = getDegree(newAngle);
    setCurrentAngle(newDegree);

    setMagnetometerCount(0);
    setPartialCompass(initialCompass);
  };

  const updateOnNoThreshold = () => {
    setMagnetometerCount(magnetometerCount + 1);
    setPartialCompass({
      x: partialCompass.x + result.x,
      y: partialCompass.y + result.y,
      z: partialCompass.z + result.z
    });
  };
      
  return (
    <View style={styles.container}>
      <HeaderInfo angle={currentAngle} compassXYZ={compass} coordinates={currentCoordinates} />
      <PeaksOnTargetInfo angle={currentAngle} peaksInRange={peaksInRange} show={true} showMode={PEAK_SHOW_MODE.graph}/>
    </View>
  );
}
