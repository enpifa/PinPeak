import { updateCompassData } from '../calculations';

describe('calculations', () => {
  it(`should return the average compass value when we hit the threshold`, () => {
    const count = 12;
    const currentCompass = { x: 0, y: 0, z: 0 };
    const partialCompass = { x: 120, y: 120, z: 120};
    const actualResult = updateCompassData(currentCompass, count, partialCompass);
    const expectedResult = { x: partialCompass.x / count, y: partialCompass.y / count, z: partialCompass.z / count };

    expect(actualResult).toStrictEqual(expectedResult);
  });

  it('should return an empty object when the count is different from threshold', () => {
    const count = 11;
    const currentCompass = { x: 0, y: 0, z: 0 };
    const partialCompass = { x: 120, y: 120, z: 120};
    const actualResult = updateCompassData(currentCompass, count, partialCompass);
    const expectedResult = {};

    expect(actualResult).toStrictEqual(expectedResult);
  });
});
 