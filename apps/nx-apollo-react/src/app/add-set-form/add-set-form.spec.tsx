import React from 'react';
import { render } from '@testing-library/react';

import AddSetForm from './add-set-form';

describe(' AddSetForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddSetForm />);
    expect(baseElement).toBeTruthy();
  });
});
