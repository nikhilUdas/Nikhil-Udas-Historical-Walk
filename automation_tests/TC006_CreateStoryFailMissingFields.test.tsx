import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import AdminDashboard from '../app/admindashboard';
import * as api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

jest.setTimeout(30000);

jest.mock('../api', () => ({
  sites: {
    getAll: jest.fn().mockResolvedValue({ sites: [] }),
    add: jest.fn(),
  },
  reviews: {
    getAllAdmin: jest.fn().mockResolvedValue({ reviews: [] }),
  },
  museums: {
    getAll: jest.fn().mockResolvedValue({ museums: [] }),
  },
  notifications: {
    getUnreadCount: jest.fn().mockResolvedValue({ unreadCount: 0 }),
  },
  admin: {
    getStats: jest.fn().mockResolvedValue({ 
      totalUsers: 10, 
      totalMuseums: 5, 
      totalHeritageSites: 8, 
      totalTickets: 20, 
      totalRevenue: 5000 
    }),
  }
}));

jest.spyOn(Alert, 'alert');

describe('TC006: Story Creation Fails (Missing Fields)', () => {
  it('should show an alert if required fields are missing', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('admin');

    render(<AdminDashboard />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull(), { timeout: 10000 });
    await waitFor(() => expect(screen.getByText('8')).toBeTruthy());

    // Switch to sites tab
    const tabs = screen.getAllByText('Heritage Sites');
    fireEvent.press(tabs[0]);
    
    // Open form
    await waitFor(() => expect(screen.getByText('Add New Heritage Site')).toBeTruthy());
    fireEvent.press(screen.getByText('Add New Heritage Site'));

    // Try to submit empty form
    fireEvent.press(screen.getByText('Add Site'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Please fill in all required fields'
      );
    });
  });
});
