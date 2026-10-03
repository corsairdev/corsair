const API_KEY = process.env.TURBOT_PIPES_API_KEY;
const BASE_URL = 'https://pipes.turbot.com/api/v1';

async function runLiveVerification() {
	if (!API_KEY) {
		console.log('Set TURBOT_PIPES_API_KEY environment variable to test live endpoint.');
		return;
	}
	console.log('--- Testing Turbot Pipes API Authentication ---');
	console.log('Base URL:', BASE_URL);

	try {
		const res = await fetch(`${BASE_URL}/actor`, {
			headers: {
				'Authorization': API_KEY.startsWith('Bearer ') ? API_KEY : `Bearer ${API_KEY}`,
				'Content-Type': 'application/json',
			},
		});

		console.log('HTTP Status:', res.status, res.statusText);
		const data = await res.json();
		console.log(JSON.stringify(data, null, 2));
	} catch (err) {
		console.error('Error during live verification:', err);
	}
}

runLiveVerification();
