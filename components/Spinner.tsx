import React from 'react';

export const Spinner: React.FC<{className?: string}> = ({className}) => {
    return (
        <div className={`w-5 h-5 border-2 border-gray-700 border-t-brand-accent rounded-full animate-spin ${className}`}></div>
    );
};