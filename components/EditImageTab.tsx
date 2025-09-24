
import React, { useState, useEffect, useCallback } from 'react';
import type { AspectRatio, GenerateImageParams } from '../types';
import { ImageUpload } from './ImageUpload';
import { AspectRatioSelector } from './AspectRatioSelector';
import { Button } from './ui/Button';
import { ToggleSwitch } from './ui/ToggleSwitch';

interface EditImageTabProps {
    onSubmit: (params: GenerateImageParams) => void;
    isLoading: boolean;
}

export const EditImageTab: React.FC<EditImageTabProps> = ({ onSubmit, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [faceLock, setFaceLock] = useState(true);

    const handleSubmit = useCallback(() => {
        if (!prompt.trim() || !imageFile || isLoading) return;

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            const params: GenerateImageParams = {
                promptText: prompt,
                aspectRatio,
                referenceImage: { base64, mimeType: imageFile.type },
                faceLock,
            };
            onSubmit(params);
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };
    }, [prompt, imageFile, isLoading, aspectRatio, faceLock, onSubmit]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSubmit]);

    return (
        <div className="space-y-6">
            <ImageUpload 
                file={imageFile} 
                setFile={setImageFile} 
                title="Ảnh tham chiếu (giữ khuôn mặt)" 
                dropzoneText="Kéo-thả ảnh tham chiếu vào đây, hoặc bấm để chọn."
            />

            <div>
                <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300">
                    Mô tả chỉnh sửa/kết hợp
                </label>
                <div className="mt-1 relative">
                    <textarea
                        id="edit-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        maxLength={1000}
                        placeholder="Ví dụ: Thay đổi màu tóc thành màu đỏ, thêm một chiếc vòng cổ ngọc trai..."
                        className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                     <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {prompt.length}/1000
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-700/50">
                 <ToggleSwitch id="face-lock-edit" label="Khóa khuôn mặt (Face Vector Lock)" checked={faceLock} onChange={setFaceLock} disabled={!imageFile} />
            </div>
            
            <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
            
            <Button onClick={handleSubmit} disabled={!prompt.trim() || !imageFile || isLoading} isLoading={isLoading} fullWidth>
                Tạo ảnh
            </Button>
        </div>
    );
};
