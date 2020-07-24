import { mount } from 'enzyme';
import React from 'react';
import DrawLegend from '../DrawLegend';

describe('DrawLegend', () => {
  it(`renders a view with a custom background`, () => {
    const drawLegendWrapper = mount(<DrawLegend angle={150} distance={150} />);
    const drawLegendComponent = drawLegendWrapper.find(DrawLegend);
    expect(drawLegendComponent.exists()).toBe(true);
  });
});
 