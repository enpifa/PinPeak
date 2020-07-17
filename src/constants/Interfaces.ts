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

interface ICompass {
  x: number;
  y: number;
  z: number;
}

// interface IPeakToDraw {
//   peak: string;
//   horizontalPosition: number;
// }

interface IPeakInRange {
  peak: string;
  peakInfo: ISuperCoordinates;
  distance: number;
  angle: number;
}

interface IPeakOnTarget {
  peak: IPeakInRange;
  horizontalPosition: number;
}

export { ICompass, ICoordinates, IPeakDataSet, ISuperCoordinates, IPeaks, IPeakInRange, IPeakOnTarget };