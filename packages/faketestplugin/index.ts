// TODO: replace with real base URL
const FAKETEST_API_BASE = 'https://api.example.com/v1';

export async function listItems(_apiKey: string) {
	const res = await fetch(`${FAKETEST_API_BASE}/items`, {
		headers: {
			// Authorization: `Bearer ${apiKey}`,
		},
	});
	return res.json();
}
