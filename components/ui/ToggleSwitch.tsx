
import React from 'react';

interface ToggleSwitchProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange, disabled = false }) => {
    return (
        <label htmlFor={id} className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="relative">
                <input 
                    id={id} 
                    type="checkbox" 
                    className="sr-only" 
                    checked={checked}
                    onChange={() => !disabled && onChange(!checked)}
                    disabled={disabled}
                />
                <div className={`block w-10 h-6 rounded-full transition ${checked ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm text-gray-300">{label}</div>
        </label>
    );
};
