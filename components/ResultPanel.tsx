
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { DownloadIcon, CopyIcon, TrashIcon } from './icons/ActionIcons';
import type { GeneratedImage } from '../types';

interface ResultPanelProps {
    isLoading: boolean;
    image: GeneratedImage | null;
    clearResult: () => void;
}

const EmptyState: React.FC = () => (
    <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center">
        <p className="text-lg font-medium">Hình ảnh của bạn sẽ xuất hiện ở đây</p>
        <p className="text-sm">Hãy bắt đầu bằng cách tạo hoặc chỉnh sửa ảnh.</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="w-full aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
);

const ResultDisplay: React.FC<{ image: GeneratedImage; clearResult: () => void; }> = ({ image, clearResult }) => {
    const imageUrl = `data:${image.mimeType};base64,${image.imageBase64}`;
    const [copyStatus, setCopyStatus] = useState('Sao chép link');
    
    const downloadImage = (format: 'png' | 'jpg') => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `minh-master-ai-${image.seed}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(imageUrl).then(() => {
            setCopyStatus('Đã sao chép!');
            setTimeout(() => setCopyStatus('Sao chép link'), 2000);
        });
    };

    return (
        <div className="space-y-4">
            <div className="relative group">
                <img src={imageUrl} alt="Generated result" className="w-full h-auto rounded-lg shadow-lg" />
                 <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button onClick={() => downloadImage('png')} size="sm" variant="secondary"><DownloadIcon /> Tải PNG</Button>
                    <Button onClick={() => downloadImage('jpg')} size="sm" variant="secondary"><DownloadIcon /> Tải JPG</Button>
                    <Button onClick={copyLink} size="sm" variant="secondary"><CopyIcon /> {copyStatus}</Button>
                    <Button onClick={clearResult} size="sm" variant="danger"><TrashIcon /></Button>
                </div>
            </div>
        </div>
    );
};


export const ResultPanel: React.FC<ResultPanelProps> = ({ isLoading, image, clearResult }) => {
    return (
        <Card title="Kết quả" className="min-h-[500px] lg:min-h-0">
            <div className="p-6 h-full">
                {isLoading ? <LoadingState /> : (image ? <ResultDisplay image={image} clearResult={clearResult} /> : <EmptyState />)}
            </div>
        </Card>
    );
};
