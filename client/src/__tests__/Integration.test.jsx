/**
 * @vitest-environment jsdom
 * Integration test covering full chat flow with mocked API responses.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock config to ensure no real network requests escape
vi.mock('../config', () => ({
  default: 'http://localhost:3001',
}));

// Mock crypto
vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid-' + Math.random() });

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import component
const { default: ChatInterface } = await import('../components/Chat/ChatInterface');

describe('ChatInterface Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('handles a successful chat interaction', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'EVMs are secure machines.', responseType: 'text' }),
    });

    const messages = [{ id: 'welcome', role: 'assistant', content: 'Welcome' }];
    const onAddMessage = vi.fn((msg) => {
      messages.push(msg);
    });

    const { rerender } = render(<ChatInterface messages={messages} onAddMessage={onAddMessage} />);

    // User types message
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'How do EVMs work?' } });
    
    // User clicks send
    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);

    // Verify onAddMessage was called with user input
    expect(onAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'user', content: 'How do EVMs work?' })
    );

    // Verify API call was made
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/chat', expect.any(Object));

    // Wait for the bot response to be added
    await waitFor(() => {
      expect(onAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'assistant', content: 'EVMs are secure machines.' })
      );
    });
  });

  it('handles an API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const messages = [{ id: 'welcome', role: 'assistant', content: 'Welcome' }];
    const onAddMessage = vi.fn((msg) => {
      messages.push(msg);
    });

    render(<ChatInterface messages={messages} onAddMessage={onAddMessage} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Trigger error' } });
    fireEvent.click(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(onAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: expect.stringContaining('something went wrong'),
        })
      );
    });
  });
});
