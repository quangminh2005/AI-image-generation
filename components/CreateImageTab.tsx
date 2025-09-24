
import React, { useState, useEffect, useCallback } from 'react';
import type { AspectRatio, GenerateImageParams } from '../types';
import { ImageUpload } from './ImageUpload';
import { AspectRatioSelector } from './AspectRatioSelector';
import { Button } from './ui/Button';
import { ToggleSwitch } from './ui/ToggleSwitch';

interface CreateImageTabProps {
    onSubmit: (params: GenerateImageParams) => void;
    isLoading: boolean;
}

export const CreateImageTab: React.FC<CreateImageTabProps> = ({ onSubmit, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    // Face lock is ON by default when an image is present
    const [faceLock, setFaceLock] = useState(false);
    useEffect(() => {
        setFaceLock(!!imageFile);
    }, [imageFile]);
    
    const [removeBG, setRemoveBG] = useState(false);
    const [beautyPreserve, setBeautyPreserve] = useState(true);

    const handleSubmit = useCallback(async () => {
        if (!prompt.trim() || isLoading) return;

        let imagePayload;
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                imagePayload = { base64, mimeType: imageFile.type };
                const params: GenerateImageParams = {
                    promptText: prompt,
                    aspectRatio,
                    referenceImage: imagePayload,
                    faceLock,
                    removeBG,
                    beautyPreserve,
                };
                onSubmit(params);
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
        } else {
            const params: GenerateImageParams = {
                promptText: prompt,
                aspectRatio,
                faceLock,
                removeBG,
                beautyPreserve,
            };
            onSubmit(params);
        }
    }, [prompt, isLoading, imageFile, aspectRatio, faceLock, removeBG, beautyPreserve, onSubmit]);

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
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
                    Mô tả hình ảnh (Prompt)
                </label>
                <div className="mt-1 relative">
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        maxLength={1000}
                        placeholder="Ví dụ: Chai serum thủy tinh đặt trên nền đá cẩm thạch, ánh sáng mềm, phong cách tối giản..."
                        className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 transition"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {prompt.length}/1000
                    </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">Mô tả càng chi tiết, kết quả càng chính xác.</p>
            </div>
            
            <ImageUpload file={imageFile} setFile={setImageFile} />

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 border-t border-gray-700/50">
                 <ToggleSwitch id="face-lock-create" label="Khóa khuôn mặt (Face Vector Lock)" checked={faceLock} onChange={setFaceLock} disabled={!imageFile} />
                 <ToggleSwitch id="bg-remove-create" label="Xóa nền thông minh (Smart BG Removal)" checked={removeBG} onChange={setRemoveBG} />
                 <ToggleSwitch id="beauty-preserve-create" label="Giữ chi tiết da & tóc (Beauty-preserve)" checked={beautyPreserve} onChange={setBeautyPreserve} />
            </div>

            <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
            
            <Button onClick={handleSubmit} disabled={!prompt.trim() || isLoading} isLoading={isLoading} fullWidth>
                Tạo ảnh
            </Button>
        </div>
    );
};
