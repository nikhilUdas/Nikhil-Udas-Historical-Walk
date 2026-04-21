import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login';
import { auth } from '../api';

jest.setTimeout(30000);

jest.mock('../api', () => ({
  auth: {
    login: jest.fn(),
  },
}));

describe('TC004: Login Fails (Incorrect Password)', () => {
  it('should show error message on login failure', async () => {
    (auth.login as jest.Mock).mockRejectedValue(new Error('Invalid password'));

    const { getByTestId, findByText } = render(<LoginScreen />);

    // Wait for sites to load
    await waitFor(() => expect(getByTestId('emailInput')).toBeTruthy());

    fireEvent.changeText(getByTestId('emailInput'), 'nikhil@example.com');
    fireEvent.changeText(getByTestId('passwordInput'), 'wrongpassword');

    fireEvent.press(getByTestId('loginButton'));

    expect(await findByText('Invalid password')).toBeTruthy();
  });
});
