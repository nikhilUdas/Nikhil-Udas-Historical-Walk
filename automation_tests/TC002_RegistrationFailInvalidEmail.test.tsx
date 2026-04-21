import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../app/signup';

describe('TC002: Registration Fails (Invalid Email Format)', () => {
  it('should show an error message for invalid email', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText('Your name'), 'Nikhil Udas');
    fireEvent.changeText(getByPlaceholderText('yourname@example.com'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'Password123!');

    fireEvent.press(getByText('Create Account →'));

    const errorMessage = await findByText('Please enter a valid email address');
    expect(errorMessage).toBeTruthy();
  });
});
