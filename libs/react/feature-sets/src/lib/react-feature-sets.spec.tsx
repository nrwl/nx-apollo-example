import React from 'react';
import { render } from '@testing-library/react';

import ReactFeatureSets from './react-feature-sets';

describe(' ReactFeatureSets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactFeatureSets />);
    expect(baseElement).toBeTruthy();
  });
});
