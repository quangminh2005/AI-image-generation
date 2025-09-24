
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { CreateImageTab } from './CreateImageTab';
import { EditImageTab } from './EditImageTab';
import type { ActiveTab, GenerateImageParams } from '../types';

interface ControlPanelProps {
    onSubmit: (params: GenerateImageParams) => void;
    isLoading: boolean;
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full py-3 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-t-lg ${
            isActive
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
        }`}
    >
        {label}
    </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ onSubmit, isLoading }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('create');

    return (
        <Card title="Bảng điều khiển">
            <div className="border-b border-gray-700">
                <div className="flex -mb-px">
                    <TabButton 
                        label="Tạo ảnh mới" 
                        isActive={activeTab === 'create'} 
                        onClick={() => setActiveTab('create')} 
                    />
                    <TabButton 
                        label="Chỉnh sửa & Kết hợp ảnh" 
                        isActive={activeTab === 'edit'} 
                        onClick={() => setActiveTab('edit')} 
                    />
                </div>
            </div>
            <div className="p-6">
                {activeTab === 'create' && <CreateImageTab onSubmit={onSubmit} isLoading={isLoading} />}
                {activeTab === 'edit' && <EditImageTab onSubmit={onSubmit} isLoading={isLoading} />}
            </div>
        </Card>
    );
};
