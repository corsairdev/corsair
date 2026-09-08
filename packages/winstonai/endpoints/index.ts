import { detectAiImage } from './detect-ai-image';
import { detectAiText } from './detect-ai-text';
import { detectPlagiarism } from './detect-plagiarism';

export const Detect = {
	aiText: detectAiText,
	plagiarism: detectPlagiarism,
	aiImage: detectAiImage,
};

export * from './types';
