
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}>
            <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
};
