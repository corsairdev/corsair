/**
 * Live smoke against Alchemy (Prices + Portfolio).
 * Usage: ALCHEMY_API_KEY=... node packages/alchemy/scripts/live-smoke.mjs
 */
const key = process.env.ALCHEMY_API_KEY;
if (!key) {
	console.error('Set ALCHEMY_API_KEY');
	process.exit(1);
}

const VITALIK = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

async function check(name, fn) {
	try {
		const data = await fn();
		console.log(
			`PASS ${name}`,
			typeof data === 'string'
				? data.slice(0, 120)
				: JSON.stringify(data).slice(0, 160),
		);
		return true;
	} catch (error) {
		console.error(`FAIL ${name}`, error.message);
		return false;
	}
}

let ok = true;
ok =
	(await check('prices/by-symbol', async () => {
		const res = await fetch(
			`https://api.g.alchemy.com/prices/v1/${key}/tokens/by-symbol?symbols=ETH`,
		);
		const text = await res.text();
		if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
		const json = JSON.parse(text);
		if (!json.data?.[0]?.prices?.[0]?.value) throw new Error('missing price');
		return json.data[0].prices[0].value;
	})) && ok;

ok =
	(await check('prices/historical', async () => {
		const res = await fetch(
			`https://api.g.alchemy.com/prices/v1/${key}/tokens/historical`,
			{
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					symbol: 'ETH',
					startTime: '2026-08-01T00:00:00Z',
					endTime: '2026-08-03T00:00:00Z',
					interval: '1d',
				}),
			},
		);
		const text = await res.text();
		if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
		const json = JSON.parse(text);
		if (!Array.isArray(json.data) || json.data.length < 1) {
			throw new Error('missing historical points');
		}
		return `${json.data.length} points`;
	})) && ok;

ok =
	(await check('portfolio/tokens', async () => {
		const res = await fetch(
			`https://api.g.alchemy.com/data/v1/${key}/assets/tokens/by-address`,
			{
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					addresses: [{ address: VITALIK, networks: ['eth-mainnet'] }],
					withMetadata: false,
					withPrices: true,
					pageSize: 2,
				}),
			},
		);
		const text = await res.text();
		if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
		const json = JSON.parse(text);
		if (!json.data?.tokens?.length) throw new Error('no tokens');
		return `${json.data.tokens.length} tokens`;
	})) && ok;

ok =
	(await check('portfolio/nfts', async () => {
		const res = await fetch(
			`https://api.g.alchemy.com/data/v1/${key}/assets/nfts/by-address`,
			{
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					addresses: [{ address: VITALIK, networks: ['eth-mainnet'] }],
					withMetadata: false,
					pageSize: 2,
				}),
			},
		);
		const text = await res.text();
		if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
		const json = JSON.parse(text);
		if (!json.data?.ownedNfts?.length) throw new Error('no nfts');
		return `totalCount=${json.data.totalCount}`;
	})) && ok;

ok =
	(await check('nft/v3 (expect network enable msg if disabled)', async () => {
		const res = await fetch(
			`https://eth-mainnet.g.alchemy.com/nft/v3/${key}/getContractMetadata?contractAddress=0xBC4CA0EDA7647A8Ab7C2061c2E118A18a936f13D`,
		);
		const text = await res.text();
		if (text.includes('not enabled for this app')) {
			return 'BLOCKED: enable eth-mainnet in Alchemy dashboard';
		}
		if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
		return text.slice(0, 120);
	})) && ok;

process.exit(ok ? 0 : 1);
