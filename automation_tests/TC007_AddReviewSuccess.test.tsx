import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import HeritageSiteScreen from '../app/heritagesite';
import * as api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Set longer timeout
jest.setTimeout(30000);

// Mock dependencies
jest.mock('../api', () => ({
  reviews: {
    create: jest.fn(),
    getSummary: jest.fn().mockResolvedValue({ 
      title: 'Pashupatinath',
      averageRating: '4.5', 
      totalReviews: 10,
      reviews: []
    }),
  },
  sites: {
    getFullSite: jest.fn().mockResolvedValue({ 
      site: { site_id: 1, name: 'Pashupatinath', description: 'Template', is_unlocked: true, has_full_content: true } 
    }),
    getAll: jest.fn().mockResolvedValue({ 
      sites: [{ site_id: 1, name: 'Pashupatinath', description: 'Template', is_unlocked: true, has_full_content: true }] 
    }),
  },
  favorites: {
    getAll: jest.fn().mockResolvedValue({ favorites: [] }),
    add: jest.fn(),
  },
  payment: {
    initiateSiteKhalti: jest.fn(),
  }
}));

jest.spyOn(Alert, 'alert');

describe('TC007: Add Review Successfully', () => {
  it('should submit a review successfully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'userType') return Promise.resolve('user');
        return Promise.resolve(null);
    });
    (api.reviews.create as jest.Mock).mockResolvedValue({ success: true });

    render(<HeritageSiteScreen />);

    // Wait for sites to load
    await waitFor(() => expect(screen.getByText('Pashupatinath')).toBeTruthy(), { timeout: 10000 });

    // Open site details (Read Now)
    fireEvent.press(screen.getByText('Read Now'));
    
    // In details view, "Write a Review" button
    await waitFor(() => expect(screen.getByText('Write a Review')).toBeTruthy());
    fireEvent.press(screen.getByText('Write a Review'));

    // Fill review - matching placeholder from dump
    fireEvent.changeText(screen.getByPlaceholderText('Tell us what you liked about this place...'), 'Amazing place!');
    
    // Select rating
    fireEvent.press(screen.getByTestId('star-5'));

    fireEvent.press(screen.getByText('Submit Review'));

    await waitFor(() => {
      expect(api.reviews.create).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Thank you for your review!');
    });
  });
});
