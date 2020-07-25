import { IPeakInRange } from '../constants/Interfaces';
import { ANGLE_THRESHOLD } from '../constants/constants';

export const mockPeak: IPeakInRange[] = [
  {
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
  },
  {
    peak: 'Mt. Elbert',
    peakInfo: {
      "Rank": 1,
      "Category Rank": 1,
      "Elevation": 14440,
      "Range": "Sawatch Range",
      "Latitude": 39.1178,
      "Longitude": -106.4454
    },
    distance: 50,
    angle: 240
  },
  {
    peak: 'Mt. Elbert',
    peakInfo: {
      "Rank": 5,
      "Category Rank": 5,
      "Elevation": 14343,
      "Range": "Sawatch Range",
      "Latitude": 39.0294,
      "Longitude": -106.4729
    },
    distance: 50,
    angle: 240
  },
  {
    peak: 'Blanca Peak',
    peakInfo: {
      "Rank": 4,
      "Category Rank": 4,
      "Elevation": 14351,
      "Range": "Sangre de Cristo",
      "Latitude": 37.5775,
      "Longitude": -105.4856
    },
    distance: 120,
    angle: 253
  },
  {
    peak: 'Mt. Harvard',
    peakInfo: {
      "Rank": 3,
      "Category Rank": 3,
      "Elevation": 14421,
      "Range": "Sawatch Range",
      "Latitude": 38.9244,
      "Longitude": -106.3207
    },
    distance: 150,
    angle: 250
  },
  {
    peak: 'Mt. Massive',
    peakInfo: {
      "Rank": 2,
      "Category Rank": 2,
      "Elevation": 14428,
      "Range": "Sawatch Range",
      "Latitude": 39.1875,
      "Longitude": -106.4757
    },
    distance: 200,
    angle: 245
  },
];

export const mockGetPeaksOnTarget = () => {
  const myAngle = 245;
  return mockPeak.reduce((acc, peak) => {
    // TODO: fix angles that cross 360 degrees
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
}
