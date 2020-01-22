import React from 'react';
import { render } from '@testing-library/react';

import ReactDataAccess from './react-data-access';

describe(' ReactDataAccess', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactDataAccess />);
    expect(baseElement).toBeTruthy();
  });
});
