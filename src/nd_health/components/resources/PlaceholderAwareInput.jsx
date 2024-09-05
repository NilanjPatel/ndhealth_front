import React, { useState } from 'react';

const PlaceholderAwareInput = ({ value, onChange }) => {
  const [cursorPosition, setCursorPosition] = useState(null);

  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Check if the change is within a placeholder
    if (cursorPosition !== null) {
      const placeholderStart = value.lastIndexOf('{{', cursorPosition - 1);
      const placeholderEnd = value.indexOf('}}', cursorPosition);
      
      if (placeholderStart !== -1 && placeholderEnd !== -1) {
        const placeholder = value.substring(placeholderStart, placeholderEnd + 2);
        newValue = value.replace(placeholder, '');
        setCursorPosition(placeholderStart);
      }
    }

    onChange(newValue);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onSelect={handleCursorChange}
    />
  );
};

export default PlaceholderAwareInput;
