
export type AspectRatio = "1:1" | "16:9" | "9:16";

export type ActiveTab = 'create' | 'edit';

export interface GenerateImageParams {
    promptText: string;
    aspectRatio: AspectRatio;
    referenceImage?: {
        base64: string;
        mimeType: string;
    };
    faceLock?: boolean;
    removeBG?: boolean;
    beautyPreserve?: boolean;
}

export interface GeneratedImage {
    imageBase64: string;
    mimeType: string;
    seed: number;
    width: number;
    height: number;
}
