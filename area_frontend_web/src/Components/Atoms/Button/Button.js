import React, { useState } from 'react';
import './Button.css';

const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  const baseClass = "wcp-button";
  const variantClass = `wcp-button--${variant}`;
  const sizeClass = `wcp-button--${size}`;
  const stateClass = (disabled || isLoading) ? "wcp-button--disabled" : "";
  const classes = `${baseClass} ${variantClass} ${sizeClass} ${stateClass} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
      type="button"
      {...rest}
    >
      {isLoading ? (
        <span className="wcp-button__loader">loading....</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;