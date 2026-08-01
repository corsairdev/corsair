import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function testAimlApi() {
	console.log('=== Testing AI/ML API Plugin ===\n');

	try {
		// Test 1: List available models
		console.log('1. Testing models.list...');
		const models = await corsair.aimlapi.api.models.list({});
		console.log(
			`✓ Found ${Array.isArray(models) ? models.length : 'N/A'} models`,
		);
		if (Array.isArray(models) && models.length > 0) {
			console.log(`  First model: ${models[0].id}\n`);
		}

		// Test 2: Get billing balance
		console.log('2. Testing billing.getBalance...');
		const balance = await corsair.aimlapi.api.billing.getBalance({});
		console.log(
			`✓ Current balance: ${balance.current_balance || balance.balance} ${balance.currency || 'credits'}\n`,
		);

		// Test 3: Chat completion (minimal token usage)
		console.log('3. Testing chat.createCompletion...');
		const chatResponse = await corsair.aimlapi.api.chat.createCompletion({
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: 'Say "Hello World" only.' }],
			maxTokens: 10,
		});
		console.log(`✓ Chat completion successful`);
		console.log(`  Response ID: ${chatResponse.id || 'N/A'}\n`);

		// Test 4: List models with details
		console.log('4. Testing models.listWithDetails...');
		const detailedModels = await corsair.aimlapi.api.models.listWithDetails({
			limit: 5,
		});
		console.log(`✓ Retrieved detailed models list\n`);

		// Test 5: List batches (if any exist)
		console.log('5. Testing batches.list...');
		try {
			const batches = await corsair.aimlapi.api.batches.list({});
			console.log(`✓ Batches retrieved successfully\n`);
		} catch (err: any) {
			console.log(`⚠ Batches list: ${err.message}\n`);
		}

		console.log('=== All tests completed successfully! ===');
	} catch (error: any) {
		console.error('❌ Test failed:', error.message);
		if (error.status) {
			console.error(`   Status: ${error.status}`);
		}
		throw error;
	}
}

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

const main = async () => {
	// Test AI/ML API
	if (process.env.AIMLAPI_API_KEY) {
		await testAimlApi();
	} else {
		console.log('⚠ AIMLAPI_API_KEY not set, skipping AI/ML API tests');
		console.log('  Add AIMLAPI_API_KEY=your_key to .env file to test');
	}

	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
