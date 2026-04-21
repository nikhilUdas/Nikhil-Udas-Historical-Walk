import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import MyTicketsScreen from '../app/mytickets';
import { tickets } from '../api';

jest.setTimeout(30000);

jest.mock('../api', () => ({
  tickets: {
    getAll: jest.fn(),
  },
}));

describe('TC009: Ticket Generation After Payment', () => {
  it('should display the purchased ticket in the list', async () => {
    const mockTickets = [
      {
        ticket_id: 12345,
        museum: { name: 'Pashupatinath' },
        visit_date: '2024-04-08',
        expiry_date: '2024-04-09',
        status: 'active',
        price: 50,
        quantity: 1,
      }
    ];
    (tickets.getAll as jest.Mock).mockResolvedValue({ tickets: mockTickets });

    render(<MyTicketsScreen />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Loading your tickets...')).toBeNull(), { timeout: 10000 });

    // Verify ticket is displayed
    await waitFor(() => {
      expect(screen.getByText('Pashupatinath')).toBeTruthy();
      expect(screen.getByText('#12345')).toBeTruthy();
    });
  });
});
