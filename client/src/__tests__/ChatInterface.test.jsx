/**
 * @vitest-environment jsdom
 * Unit tests for the ChatInterface component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mock react-router-dom (not needed by ChatInterface but imported transitively) ──
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// ── Mock the config module so fetch hits a controlled URL ──
vi.mock('../config', () => ({
  default: 'http://localhost:3001',
}));

// ── Mock fetch globally ──
const mockFetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ reply: 'Namaste! I am Gyani.', responseType: 'text' }),
    ok: true,
  })
);
global.fetch = mockFetch;

// ── Mock crypto.randomUUID ──
vi.stubGlobal('crypto', { randomUUID: () => 'test-uuid-' + Math.random() });

// ── Import component AFTER mocks ──
const { default: ChatInterface } = await import('../components/Chat/ChatInterface');

// ── Helpers ──
const noop = () => {};
const dummyMessages = [];

describe('ChatInterface', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders the chat textarea input', () => {
    render(<ChatInterface messages={dummyMessages} onAddMessage={noop} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders the send button', () => {
    render(<ChatInterface messages={dummyMessages} onAddMessage={noop} />);
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInterface messages={dummyMessages} onAddMessage={noop} />);
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeDisabled();
  });

  it('send button becomes enabled after typing', () => {
    render(<ChatInterface messages={dummyMessages} onAddMessage={noop} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).not.toBeDisabled();
  });

  it('renders all quick question buttons', () => {
    render(<ChatInterface messages={dummyMessages} onAddMessage={noop} />);
    expect(screen.getByText('What is NOTA?')).toBeInTheDocument();
    expect(screen.getByText('What is VVPAT?')).toBeInTheDocument();
  });

  it('placeholder text is present', () => {
    render(<ChatInterface messages={dummyMessages} onAddMessage={noop} />);
    expect(
      screen.getByPlaceholderText('Kuch poochho — elections, registration, EVMs...')
    ).toBeInTheDocument();
  });
});
