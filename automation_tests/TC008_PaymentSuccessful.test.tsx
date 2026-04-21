import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HeritageSiteScreen from '../app/heritagesite';
import { payment as paymentApi, sites } from '../api';

// Set longer timeout
jest.setTimeout(30000);

// Mock dependencies
jest.mock('../api', () => ({
  payment: {
    initiateSiteKhalti: jest.fn(),
    initiateSiteEsewa: jest.fn(),
  },
  sites: {
    getAll: jest.fn().mockResolvedValue({ 
      sites: [{ site_id: 1, name: 'Pashupatinath', description: 'Locked content', is_unlocked: false, has_full_content: true, id: 1 }] 
    }),
  },
  favorites: {
    getAll: jest.fn().mockResolvedValue({ favorites: [] }),
  },
  reviews: {
    getSummary: jest.fn(),
  }
}));

describe('TC008: Payment Successful (Initiation)', () => {
  it('should initiate Khalti payment successfully', async () => {
    (paymentApi.initiateSiteKhalti as jest.Mock).mockResolvedValue({ payment_url: 'https://khalti.com/pay', pidx: 'test-pidx' });

    const { getByText, getByTestId } = render(<HeritageSiteScreen />);

    // Wait for sites to load
    await waitFor(() => expect(getByText('Read More (Rs. 50)')).toBeTruthy(), { timeout: 10000 });
    
    // Press Read More to open payment modal
    fireEvent.press(getByText('Read More (Rs. 50)'));

    // Press Pay with Khalti
    await waitFor(() => expect(getByText('Pay with Khalti (Rs. 50)')).toBeTruthy(), { timeout: 10000 });
    fireEvent.press(getByText('Pay with Khalti (Rs. 50)'));

    await waitFor(() => {
      expect(paymentApi.initiateSiteKhalti).toHaveBeenCalled();
    });
  });
});
