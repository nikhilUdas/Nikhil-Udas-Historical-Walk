import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login';
import { auth } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.setTimeout(30000);

jest.mock('../api', () => ({
  auth: {
    login: jest.fn(),
  },
}));

describe('TC003: Successful Login', () => {
  it('should login successfully with valid credentials', async () => {
    (auth.login as jest.Mock).mockResolvedValue({ 
      token: 'fake-token', 
      user: { id: 1, name: 'Nikhil', type: 'user', isVerified: true } 
    });

    render(<LoginScreen />);

    // Wait for component to be ready
    const emailInput = await screen.findByTestId('emailInput');
    expect(emailInput).toBeTruthy();

    fireEvent.changeText(screen.getByTestId('emailInput'), 'nikhil@example.com');
    fireEvent.changeText(screen.getByTestId('passwordInput'), 'Password123!');

    fireEvent.press(screen.getByTestId('loginButton'));

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('jwtToken', 'fake-token');
    }, { timeout: 10000 });
  });
});
