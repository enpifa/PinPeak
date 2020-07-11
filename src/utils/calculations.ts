import LPF from 'lpf';

interface ICoordinates {
  long: number;
  lat: number;
}

interface ICompass {
  x: number;
  y: number;
  z: number;
}

interface IPeakDataSet {
  [key: string] : ICoordinates
}

interface ISuperCoordinates {
  "Rank": number;
  "Category Rank": number;
  "Elevation": number;
  "Range": string;
  "Latitude": number;
  "Longitude": number;
}

interface IPeaks {
  [key: string]: ISuperCoordinates
}

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

// Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
const getDegree = (angle: number) => {
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

const findAngleMatch = (myAngle: number, dataset: IPeaks, currentPosition: ICoordinates) => {
  const matches = [];
  const ANGLE_THRESHOLD = 5.0;

  Object.keys(dataset).forEach(peak => {
    const superPeak = { lat: dataset[peak].Latitude, long: dataset[peak].Longitude };
    const angle = comparePoints(currentPosition, superPeak);
    const min = angle < ANGLE_THRESHOLD ? 0 : angle - ANGLE_THRESHOLD;
    const max = angle + ANGLE_THRESHOLD;
    if (myAngle > min && myAngle < max) matches.push(peak);
  });

  return matches;
}

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

export { comparePoints, getQuadrant, calculateAngle, getAngle, getDegree, getDirection, findAngleMatch, calculateDistanceBetweenAB };