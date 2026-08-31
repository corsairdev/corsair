import { toNextJsHandler } from 'corsair';
import { corsair } from '@/corsair';

export const { GET, POST, OPTIONS } = toNextJsHandler(corsair, {
	basePath: '/api/corsair',
});
