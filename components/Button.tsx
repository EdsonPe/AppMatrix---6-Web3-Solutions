import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ isLoading = false, children, className, ...props }) => {
    return (
        <button
            className={`relative inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent disabled:bg-brand-accent/30 disabled:cursor-not-allowed group ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            <span className="absolute -inset-0.5 rounded-md bg-brand-accent blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse group-hover:animate-none"></span>
            <span className="relative flex items-center">
                {isLoading ? (
                    <>
                       <Spinner />
                        <span className="ml-2">Processing...</span>
                    </>
                ) : (
                    children
                )}
            </span>
        </button>
    );
};