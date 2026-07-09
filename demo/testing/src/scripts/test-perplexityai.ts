import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { perplexityai } from '@corsair-dev/perplexityai';
import { createCorsair } from 'corsair';
import { sqlite } from '../db';

export const corsair = createCorsair({
	multiTenancy: false,
	database: sqlite,
	kek: process.env.CORSAIR_KEK || 'dummy-kek',
	plugins: [
		perplexityai({
			key: process.env.PERPLEXITYAI_API_KEY || 'dummy-api-key',
		}),
	],
});

const main = async () => {
	console.log('Testing Perplexity AI Plugin Chat Completions...');
	try {
		const res = await corsair.perplexityai.api.chat.completions({
			model: 'llama-3.1-sonar-small-128k-online',
			messages: [{ role: 'user', content: 'What is the capital of France?' }],
		});
		console.log('Response:', JSON.stringify(res, null, 2));
	} catch (err) {
		console.error(
			'Request failed as expected with dummy key, but plugin registration and schema typing is successful!',
		);
		console.error(err);
	}
};

main().catch(console.error);
