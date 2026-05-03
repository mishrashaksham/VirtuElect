import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * A component that throws an error to test the ErrorBoundary.
 */
const Bomb = () => {
  throw new Error('Test explosion');
};

describe('ErrorBoundary Component', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="safe-child">Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('safe-child')).toBeInTheDocument();
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });

  it('renders fallback UI when a child throws an error', () => {
    // Suppress console.error in this test to avoid noisy output
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We've encountered an unexpected error/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('calls window.location.reload when Refresh Page is clicked', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock window.location.reload
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: vi.fn() };

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByText(/Refresh Page/i);
    fireEvent.click(refreshButton);

    expect(window.location.reload).toHaveBeenCalled();

    // Restore original window.location
    window.location = originalLocation;
    consoleErrorSpy.mockRestore();
  });
});
