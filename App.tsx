
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ControlPanel } from './components/ControlPanel';
import { ResultPanel } from './components/ResultPanel';
import { Toast } from './components/ui/Toast';
import { generateImage } from './services/geminiService';
import type { GenerateImageParams, GeneratedImage } from './types';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

    const handleGenerateImage = useCallback(async (params: GenerateImageParams) => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateImage(params);
            setGeneratedImage(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearResult = () => {
        setGeneratedImage(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <ControlPanel onSubmit={handleGenerateImage} isLoading={isLoading} />
                    <ResultPanel isLoading={isLoading} image={generatedImage} clearResult={clearResult} />
                </div>
            </main>
            <Footer />
            {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        </div>
    );
};

export default App;
