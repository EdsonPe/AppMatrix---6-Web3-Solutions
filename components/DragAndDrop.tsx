import React, { useState, useCallback, useRef } from 'react';

interface DragAndDropProps {
    onFileDrop: (file: File) => void;
    acceptedFileType: string;
    children: React.ReactNode;
}

export const DragAndDrop: React.FC<DragAndDropProps> = ({ onFileDrop, acceptedFileType, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
            onFileDrop(file);
        }
    }, [onFileDrop]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileDrop(file);
        }
    };
    
    const openFileDialog = () => {
        if(fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            onClick={openFileDialog}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`w-full p-8 text-center bg-gray-900/50 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-brand-accent scale-105 shadow-[0_0_20px_rgba(190,0,197,0.3)]' : 'border-gray-600 hover:border-gray-500'}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={acceptedFileType}
                onChange={handleFileChange}
            />
            {fileName ? (
                <div className="text-brand-accent font-mono">
                    <p className="font-bold text-lg">{fileName}</p>
                    <p className="text-sm text-gray-400 mt-2">File selected. Click or drag another file to replace.</p>
                </div>
            ) : (
                children
            )}
        </div>
    );
};