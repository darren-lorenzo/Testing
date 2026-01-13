import React from 'react';
import './Input.css';

const InputText = ({
  type = 'text',
  placeholder,
  hasError = false,
  value,
  onChange,
  ...rest
}) => {
  const baseClass = "wcp-input";

  const errorClass = hasError ? "wcp-input--error" : "";

  const classes = `${baseClass} ${errorClass}`.trim();

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={classes}
      {...rest}
    />
  );
};

export default InputText;