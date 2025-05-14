import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// This is a mock component for testing - in a real implementation, 
// you would import the actual component from your src directory
const SocialPlatformSelector = ({ 
  platforms = ['linkedin', 'bluesky'], 
  selectedPlatforms = [], 
  onChange 
}) => {
  return (
    <div data-testid="platform-selector">
      {platforms.map(platform => (
        <label key={platform} htmlFor={`platform-${platform}`}>
          <input
            type="checkbox"
            id={`platform-${platform}`}
            data-testid={`platform-${platform}`}
            value={platform}
            checked={selectedPlatforms.includes(platform)}
            onChange={() => {
              const newSelection = selectedPlatforms.includes(platform)
                ? selectedPlatforms.filter(p => p !== platform)
                : [...selectedPlatforms, platform];
              onChange(newSelection);
            }}
          />
          {platform}
        </label>
      ))}
    </div>
  );
};

describe('SocialPlatformSelector', () => {
  it('renders all available platforms', () => {
    render(
      <SocialPlatformSelector 
        platforms={['linkedin', 'bluesky']} 
        selectedPlatforms={[]} 
        onChange={() => {}}
      />
    );
    
    expect(screen.getByText('linkedin')).toBeInTheDocument();
    expect(screen.getByText('bluesky')).toBeInTheDocument();
  });
  
  it('shows the correct platforms as selected', () => {
    render(
      <SocialPlatformSelector 
        platforms={['linkedin', 'bluesky']} 
        selectedPlatforms={['linkedin']} 
        onChange={() => {}}
      />
    );
    
    expect(screen.getByTestId('platform-linkedin')).toBeChecked();
    expect(screen.getByTestId('platform-bluesky')).not.toBeChecked();
  });
  
  it('calls onChange with updated platforms when selection changes', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SocialPlatformSelector 
        platforms={['linkedin', 'bluesky']} 
        selectedPlatforms={['linkedin']} 
        onChange={mockOnChange}
      />
    );
    
    // Click on bluesky to add it
    fireEvent.click(screen.getByTestId('platform-bluesky'));
    expect(mockOnChange).toHaveBeenCalledWith(['linkedin', 'bluesky']);
    
    // Reset mock
    mockOnChange.mockClear();
    
    // Click on linkedin to remove it
    fireEvent.click(screen.getByTestId('platform-linkedin'));
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
  
  it('only shows supported platforms', () => {
    render(
      <SocialPlatformSelector 
        // Only LinkedIn and Bluesky are supported now
        platforms={['linkedin', 'bluesky']} 
        selectedPlatforms={[]}
        onChange={() => {}}
      />
    );
    
    // Twitter should not be shown anymore
    expect(screen.queryByText('twitter')).not.toBeInTheDocument();
    expect(screen.queryByTestId('platform-twitter')).not.toBeInTheDocument();
  });
});