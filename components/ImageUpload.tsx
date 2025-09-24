
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, TrashIcon, ReplaceIcon } from './icons/ActionIcons';

interface ImageUploadProps {
    file: File | null;
    setFile: (file: File | null) => void;
    title?: string;
    dropzoneText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
    file, 
    setFile, 
    title = "Tải ảnh của bạn lên", 
    dropzoneText = "Kéo-thả ảnh vào đây, hoặc bấm để chọn (PNG/JPG/WEBP, ≤ 20MB)." 
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFile: File | null) => {
        setError(null);
        if (!selectedFile) {
            setFile(null);
            setPreview(null);
            return;
        }

        if (selectedFile.size > 20 * 1024 * 1024) {
            setError("Kích thước tệp không được vượt quá 20MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
        setFile(selectedFile);
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleRemove = () => {
        handleFileChange(null);
        if(inputRef.current) {
            inputRef.current.value = "";
        }
    }

    if (file && preview) {
        return (
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
                <div className="relative group w-full aspect-video rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                </div>
                 <div className="mt-2 p-2 bg-gray-700/50 rounded-md flex justify-between items-center text-xs">
                    <span className="truncate text-gray-300">{file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <div className="flex gap-2">
                        <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                            <ReplaceIcon /> Thay ảnh
                        </button>
                        <button onClick={handleRemove} className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                           <TrashIcon /> Xóa
                        </button>
                    </div>
                </div>
                <input
                    type="file"
                    ref={inputRef}
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
            </div>
        )
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
            <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${isDragging ? 'border-purple-500 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}
                    bg-white/5 backdrop-blur-sm shadow-inner`}
            >
                <div className="text-center">
                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-400">
                       {dropzoneText}
                    </p>
                    {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                </div>
            </div>
            <input
                type="file"
                ref={inputRef}
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
        </div>
    );
};
