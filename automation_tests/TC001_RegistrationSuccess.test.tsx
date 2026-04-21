import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../app/signup';
import { auth } from '../api';
import { router } from 'expo-router';

jest.setTimeout(30000);

jest.mock('../api', () => ({
  auth: {
    register: jest.fn(),
  },
}));

describe('TC001: Successful User Registration', () => {
  it('should register successfully and navigate to OTP screen', async () => {
    (auth.register as jest.Mock).mockResolvedValue({ success: true });

    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText('Your name'), 'Nikhil Udas');
    fireEvent.changeText(getByPlaceholderText('yourname@example.com'), 'nikhil@example.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'Password123!');

    fireEvent.press(getByText('Create Account →'));

    await waitFor(() => {
      expect(auth.register).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/otp',
        params: { email: 'nikhil@example.com' },
      });
    }, { timeout: 10000 });
  });
});
