import { ICompass, ICoordinates, IPeaks, IPeakToDraw, IPeakInRange, IPeakOnTarget } from '../constants/Interfaces';
import { ANGLE_THRESHOLD, PEAK_IN_RANGE_THRESHOLD } from '../constants/constants';

const mockPeak = {
  peak: 'Longs Peak',
  peakInfo: {
    "Rank": 15,
    "Category Rank": 15,
    "Elevation": 14255,
    "Range": "Front Range",
    "Latitude": 40.255,
    "Longitude": -105.6151
  },
  distance: 50,
  angle: 310
};

const comparePoints = (currentPosition: ICoordinates, target: ICoordinates) => {
  const x = target.long - currentPosition.long;
  const y = target.lat - currentPosition.lat;

  // TODO: what if it is exactly 0?
  const quadrantX = x > 0 ? 'E' : 'W';
  const quadrantY = y > 0 ? 'N' : 'S';

  const quadrant = getQuadrant(quadrantX, quadrantY);
  const angle = calculateAngle(quadrant, x, y);

  return angle;
};

const getQuadrant = (x: string, y: string) => {
  if (x === 'E' && y === 'N') return 0;
  if (x === 'E' && y === 'S') return 1;
  if (x === 'W' && y === 'S') return 2;
  
  return 3;
};

const calculateAngle = (quadrant: number, x: number, y: number) => {
  const angle = (Math.atan2(Math.abs(x), Math.abs(y))) * 180 / Math.PI;

  if (quadrant === 1) return 180 - angle;
  if (quadrant === 2) return 180 + angle;
  if (quadrant === 3) return 360 - angle;
  
  return angle;
};

const getAngle = (magnetometer: ICompass) => {
  if (magnetometer) {
    const {x, y} = magnetometer;
    const angleRad = Math.atan2(y, x);
    
    return angleRad >= 0
      ? (angleRad * 180 / Math.PI)
      : ((angleRad + (2 * Math.PI)) * 180 / Math.PI);
  }

  // return Math.round(LPF.next(angle))
  return 0;
};

/**
 * Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
 * @param angle original angle
 * @param isMock used to debug the app with mock data
 */
const getDegree = (angle: number): number => {
  return angle - 90 >= 0
    ? angle - 90
    : angle + 271;
};

const getDirection = (degree: number) => {
  if (degree >= 22.5 && degree < 67.5) {
    return "NE";
  } else if (degree >= 67.5 && degree < 112.5) {
    return "E";
  } else if (degree >= 112.5 && degree < 157.5) {
    return "SE";
  } else if (degree >= 157.5 && degree < 202.5) {
    return "S";
  } else if (degree >= 202.5 && degree < 247.5) {
    return "SW";
  } else if (degree >= 247.5 && degree < 292.5) {
    return "W";
  } else if (degree >= 292.5 && degree < 337.5) {
    return "NW";
  } else {
    return "N";
  }
};

const getFace = (compass) => {
  const newAngle = getAngle(compass);
  const newDegree = getDegree(newAngle);
  const newDirection = getDirection(newDegree);

  return newDirection;
};

const getPeaksOnTarget = (myAngle: number, peaksInRange: IPeakInRange[], isMock: boolean): IPeakOnTarget[] => {
  if (isMock) return [{ peak: mockPeak, horizontalPosition: (mockPeak.angle - (315 - ANGLE_THRESHOLD)) / (2 * ANGLE_THRESHOLD)}]
  if (peaksInRange.length === 0) return [];

  const result = peaksInRange.reduce((acc, peak) => {
    const myMinAngle = myAngle < ANGLE_THRESHOLD ? 0 : myAngle - ANGLE_THRESHOLD;
    const myMaxAngle = myAngle + ANGLE_THRESHOLD;

    // verify the peak is within my min and max range of view
    if (peak.angle > myMinAngle && peak.angle < myMaxAngle) {
      return [
        ...acc,
        {
          peak: peak,
          horizontalPosition: (peak.angle - myMinAngle) / (2 * ANGLE_THRESHOLD)
        }
      ];
    }

    return acc;
  }, []);

  return result;
};

/**
 * Calculate the distance (in km) between two points.
 * @param pointA 
 * @param pointB 
 */
const calculateDistanceBetweenAB = (pointA: ICoordinates, pointB: ICoordinates): number => {
  // This uses the ‘haversine’ formula to calculate the great-circle distance between two points 
  // – that is, the shortest distance over the earth’s surface – giving an ‘as-the-crow-flies’ 
  // distance between the points (ignoring any hills they fly over)
  // https://www.movable-type.co.uk/scripts/latlong.html
  const EARTH_RADIUS = 6371; // in Kilometers
  const latPointA = pointA.lat * Math.PI / 180;
  const latPointB = pointB.lat * Math.PI / 180;

  const dLat = (pointB.lat - pointA.lat) * Math.PI / 180;
  const dLong = (pointB.long - pointA.long) * Math.PI / 180;

  const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) + (Math.cos(latPointA) * Math.cos(latPointB) * Math.sin(dLong / 2) * Math.sin(dLong / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}

/**
 * Based on the current coordinates, get the peaks that are in range.
 * A peak is considered in range if it is within PEAK_IN_RANGE_THRESHOLD coordinate distance.
 * @param allThePeaks 
 * @param currentCoordinates 
 */
const getPeaksInRange = (allThePeaks: IPeaks, currentCoordinates: ICoordinates, isMock: boolean): IPeakInRange[] => {
  if (isMock) return [mockPeak];

  if (!allThePeaks) return [];

  const result = Object.keys(allThePeaks).reduce((acc, peak) => {
    const approximateDistance = Math.abs(currentCoordinates.lat - allThePeaks[peak].Latitude) + Math.abs(currentCoordinates.long - allThePeaks[peak].Longitude)
    
    if (approximateDistance <= PEAK_IN_RANGE_THRESHOLD) {
      const peakCoordinates = { long: allThePeaks[peak].Longitude, lat: allThePeaks[peak].Latitude };

      return [
        ...acc,
        {
          peak: peak,
          peakInfo: allThePeaks[peak],
          distance: calculateDistanceBetweenAB(currentCoordinates, peakCoordinates),
          angle: comparePoints(currentCoordinates, peakCoordinates)
        }
      ];
    }

    return acc;
  }, []);

  return result;
};

export { comparePoints, getQuadrant, calculateAngle, getAngle, getDegree, getDirection, getFace, getPeaksOnTarget, calculateDistanceBetweenAB, getPeaksInRange };