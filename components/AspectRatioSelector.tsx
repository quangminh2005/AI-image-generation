
import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
    selected: AspectRatio;
    onSelect: (aspectRatio: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: 'Vuông (1:1)' },
    { value: '16:9', label: 'Ngang (16:9)' },
    { value: '9:16', label: 'Dọc (9:16)' },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Tỷ lệ khung hình
            </label>
            <div className="grid grid-cols-3 gap-2">
                {ratios.map((ratio) => (
                    <button
                        key={ratio.value}
                        onClick={() => onSelect(ratio.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${
                            selected === ratio.value
                                ? 'bg-purple-600 text-white shadow'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {ratio.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
