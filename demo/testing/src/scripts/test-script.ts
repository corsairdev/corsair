import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	console.log('=== Testing Dodo Payments Plugin ===\n');

	// Test 1: Get a completed payment by ID
	console.log('--- Test 1: Get Payment by ID ---');
	try {
		const payment = await corsair.dodopayments.api.payments.get({
			id: 'pay_0NbSIl8W8fVG9SkrO6w4Q',
		});
		console.log('✅ Payment fetched successfully:');
		console.log(JSON.stringify(payment, null, 2));
	} catch (error) {
		console.error('❌ Failed to get payment:', error);
	}

	// Test 2: List payments
	console.log('\n--- Test 2: List Payments ---');
	try {
		const payments = await corsair.dodopayments.api.payments.list({});
		console.log('✅ Payments listed successfully:');
		console.log(JSON.stringify(payments, null, 2));
	} catch (error) {
		console.error('❌ Failed to list payments:', error);
	}
};

main();
