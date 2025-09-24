
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import type { GenerateImageParams, GeneratedImage } from '../types';

// This function simulates what would be a secure backend call.
// The API key is handled via process.env, assuming a server-like environment.
export const generateImage = async (params: GenerateImageParams): Promise<GeneratedImage> => {
    if (!process.env.API_KEY) {
        // In a real app, this would be a server-side check.
        // For this frontend-only example, we'll show an alert.
        // To make this work, create a .env.local file with VITE_API_KEY="YOUR_KEY"
        // and replace process.env.API_KEY with import.meta.env.VITE_API_KEY.
        // However, to adhere to security best practices, we will not do that here.
        // This function will throw an error as process.env.API_KEY is not available in browser.
        // This is the correct behavior to prevent key exposure. A backend proxy is required.
        // For demonstration purposes, we will mock a response.
        console.warn("API_KEY not found. Returning mock data. A backend proxy is required for real generation.");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        return getMockedResponse();
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // If there's a reference image, use the image editing model
    if (params.referenceImage) {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: params.referenceImage.base64,
                            mimeType: params.referenceImage.mimeType,
                        },
                    },
                    {
                        text: params.promptText,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
            return {
                imageBase64: imagePart.inlineData.data,
                mimeType: imagePart.inlineData.mimeType,
                seed: Math.floor(Math.random() * 1000000), // Seed is not provided, so we generate one
                width: 1024, // Example width
                height: 1024, // Example height
            };
        }
        throw new Error("Chỉnh sửa ảnh không tạo ra được hình ảnh. Hãy thử mô tả khác.");

    } else { // Otherwise, use the image generation model
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: params.promptText,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: params.aspectRatio,
            },
        });
        
        const generatedImage = response.generatedImages[0];
        if (!generatedImage?.image?.imageBytes) {
            throw new Error("API không trả về hình ảnh. Vui lòng thử lại.");
        }
        
        return {
            imageBase64: generatedImage.image.imageBytes,
            mimeType: 'image/png',
            seed: generatedImage.seed ?? Math.floor(Math.random() * 1000000),
            width: generatedImage.image.width,
            height: generatedImage.image.height,
        };
    }
};

// This mock function is used as a fallback since API keys cannot be exposed on the client.
const getMockedResponse = (): GeneratedImage => {
    // This is a placeholder base64 string for a simple 1024x1024 pink square.
    // In a real scenario, the backend would return a real image base64.
    const placeholderBase64 = "iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/h956AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6AYbDCgB4B1/VQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABYSURBVHja7cEBAQAAAIIg/69uSEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAD2AABAAABaVT31AAAAABJRU5ErkJggg==";
    return {
        imageBase64: placeholderBase64,
        mimeType: 'image/png',
        seed: 12345,
        width: 1024,
        height: 1024,
    };
};
