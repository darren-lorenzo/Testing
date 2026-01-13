import React from 'react';
import './Icon.css';

const Icon = ({
    src,
    alt,
    size = 'md',
    className = '',
    ...rest
}) => {
    const baseClass = "wcp-icon";
    const sizeClass = `wcp-icon--${size}`;
    const classes = `${baseClass} ${sizeClass} ${className}`.trim();

    return (
        <div className={classes} {...rest}>
            <img src={src} alt={alt} />
        </div>
    );
};

export default Icon;
