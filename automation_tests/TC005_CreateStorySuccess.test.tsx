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

describe('TC005: Create Story Successfully (Admin)', () => {
  it('should add a new heritage site successfully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('admin');
    const sitesAddMock = api.sites.add as jest.Mock;
    sitesAddMock.mockResolvedValue({ success: true });

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

    // Fill form
    fireEvent.changeText(screen.getByPlaceholderText('Enter site name'), 'Maya Devi Temple');
    fireEvent.changeText(screen.getByPlaceholderText('Enter description'), 'Lumbini, Nepal');
    
    fireEvent.press(screen.getByText('Add Site'));

    await waitFor(() => {
      expect(sitesAddMock).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Heritage site added successfully');
    });
  });
});
