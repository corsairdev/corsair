import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	// Test 1: List campaigns (read endpoint)
	console.log('--- Test: campaigns.getById ---');
	try {
		const campaign = await corsair.googleads.api.campaigns.getById({
			customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || '1234567890',
			campaignId: '1',
		});
		console.log('Campaign result:', JSON.stringify(campaign, null, 2));
	} catch (err) {
		console.error('campaigns.getById error (expected without credentials):', (err as Error).message);
	}

	// Test 2: List customer lists (read endpoint)
	console.log('\n--- Test: customerLists.getMany ---');
	try {
		const lists = await corsair.googleads.api.customerLists.getMany({
			customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || '1234567890',
		});
		console.log('Customer lists result:', JSON.stringify(lists, null, 2));
	} catch (err) {
		console.error('customerLists.getMany error (expected without credentials):', (err as Error).message);
	}

	console.log('\n--- Google Ads plugin test complete ---');
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
