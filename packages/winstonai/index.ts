import { detectAiImage } from './endpoints/detect-ai-image';
import { detectAiText } from './endpoints/detect-ai-text';
import { detectPlagiarism } from './endpoints/detect-plagiarism';

export const WinstonAiPlugin = {
	id: 'winston_ai',
	name: 'Winston AI',
	description:
		'AI content detection, plagiarism detection, and AI image detection',
	auth: {
		type: 'apikey' as const,
		header: 'Authorization',
		prefix: 'Bearer',
	},
	operations: {
		detectAiText,
		detectPlagiarism,
		detectAiImage,
	},
};
