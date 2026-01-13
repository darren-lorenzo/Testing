import React from 'react';
import './Divider.css';

const Divider = ({
    orientation = 'horizontal',
    spacing = 'md',
    variant = 'solid',
    className = '',
    children,
    ...rest
}) => {
    const baseClass = 'divider';
    const orientationClass = `divider--${orientation}`;
    const spacingClass = `divider--spacing-${spacing}`;
    const variantClass = `divider--${variant}`;
    const classes = `${baseClass} ${orientationClass} ${spacingClass} ${variantClass} ${className}`.trim();

    return (
        <div className={classes} role="separator" {...rest}>
            {children && (
                <span className="divider__content">{children}</span>
            )}
        </div>
    );
};

export default Divider;
