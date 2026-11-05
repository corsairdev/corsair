import { detectAiImage } from './detect-ai-image';
import { detectAiText } from './detect-ai-text';
import { detectPlagiarism } from './detect-plagiarism';
import { textCompare } from './text-compare';

export const Detect = {
	aiText: detectAiText,
	plagiarism: detectPlagiarism,
	aiImage: detectAiImage,
};

export const Text = {
	compare: textCompare,
};

export * from './types';
