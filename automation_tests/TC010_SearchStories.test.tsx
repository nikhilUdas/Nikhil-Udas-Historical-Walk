import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HeritageSiteScreen from '../app/heritagesite';
import { sites } from '../api';

// Set longer timeout
jest.setTimeout(30000);

// Mock dependencies
jest.mock('../api', () => ({
  sites: {
    getAll: jest.fn(),
  },
  favorites: {
    getAll: jest.fn().mockResolvedValue({ favorites: [] }),
  },
  reviews: {
    getSummary: jest.fn(),
  }
}));

describe('TC010: Search Heritage Sites/Stories by Keyword', () => {
  it('should filter sites by keyword', async () => {
    const mockSites = [
      { site_id: 1, name: 'Pashupatinath Temple', description: 'Hindu temple' },
      { site_id: 2, name: 'Boudhanath Stupa', description: 'Buddhist stupa' },
    ];
    (sites.getAll as jest.Mock).mockResolvedValue({ sites: mockSites });

    const { getByPlaceholderText, queryByText, getByText } = render(<HeritageSiteScreen />);

    // Wait for sites to load
    await waitFor(() => expect(getByText('Pashupatinath Temple')).toBeTruthy(), { timeout: 10000 });
    expect(getByText('Boudhanath Stupa')).toBeTruthy();

    // Type in search bar
    const searchInput = getByPlaceholderText('Search heritage sites...');
    fireEvent.changeText(searchInput, 'Pashu');

    // Verify filter
    await waitFor(() => {
      expect(queryByText('Pashupatinath Temple')).toBeTruthy();
      expect(queryByText('Boudhanath Stupa')).toBeNull();
    });
  });
});
