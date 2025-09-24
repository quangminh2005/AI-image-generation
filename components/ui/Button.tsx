
import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    isLoading = false,
    variant = 'primary',
    size = 'lg',
    fullWidth = false,
    ...props
}) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500',
        secondary: 'text-gray-200 bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600',
        danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    };

    const sizeClasses = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Spinner /> : children}
        </button>
    );
};
