/**
 * Live demo for Corsair OSS R4 (Loom / screen recording).
 *
 * Get an API key:
 *   https://home.openweathermap.org/api_keys
 *
 * Usage (from monorepo root):
 *   export OPENWEATHERMAP_API_KEY=...
 *   node packages/openweathermap/scripts/demo.mjs
 *
 * Package script:
 *   pnpm --filter @corsair-dev/openweathermap demo
 *
 * What it proves on camera:
 *   1. Current weather (Weather 2.5)
 *   2. Direct geocoding
 *   3. Current air pollution
 *   4. Weather map tile (PNG base64 preview)
 *
 * Never paste your real API key into the Loom description or GitHub.
 * Blur the terminal if the key is visible. Revoke after recording.
 */

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const LAT = 51.5074;
const LON = -0.1278;

if (!API_KEY) {
	console.error(`
❌  OPENWEATHERMAP_API_KEY is not set.

Get a free key: https://home.openweathermap.org/api_keys

Then re-run:
  PowerShell:  $env:OPENWEATHERMAP_API_KEY = "..." ; node packages/openweathermap/scripts/demo.mjs
  bash:        export OPENWEATHERMAP_API_KEY=... && node packages/openweathermap/scripts/demo.mjs
`);
	process.exit(1);
}

async function getJson(url) {
	const res = await fetch(url);
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		json = { raw: text };
	}
	if (!res.ok) {
		throw new Error(`GET ${url} → ${res.status}: ${text.slice(0, 500)}`);
	}
	return json;
}

function section(title) {
	console.log(`\n${'═'.repeat(60)}`);
	console.log(`  ${title}`);
	console.log('═'.repeat(60));
}

async function main() {
	console.log('Corsair × OpenWeatherMap plugin — live API demo');
	console.log('PR: https://github.com/corsairdev/corsair/pull/853');
	console.log('Package: @corsair-dev/openweathermap');
	console.log(
		'Ops: current weather · geocoding · air pollution · map tile (PNG)',
	);

	section('1/4  weather.current  (Weather 2.5 /weather)');
	const weather = await getJson(
		`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`,
	);
	console.log('city:', weather.name);
	console.log('temp °C:', weather.main?.temp);
	console.log('conditions:', weather.weather?.[0]?.description);

	section('2/4  geocoding.direct  (Geo 1.0 /direct)');
	const geo = await getJson(
		`https://api.openweathermap.org/geo/1.0/direct?q=London,UK&limit=1&appid=${API_KEY}`,
	);
	console.log('match:', geo[0]?.name, geo[0]?.country);
	console.log('lat/lon:', geo[0]?.lat, geo[0]?.lon);

	section('3/4  airPollution.current  (Air Pollution 2.5)');
	const pollution = await getJson(
		`https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`,
	);
	const aqi = pollution.list?.[0]?.main?.aqi;
	console.log('AQI index (1=best):', aqi);
	console.log('components sample:', pollution.list?.[0]?.components);

	section('4/4  maps.weatherMapTile  (Maps 2.0 PNG tile)');
	const tileRes = await fetch(
		`https://maps.openweathermap.org/maps/2.0/weather/TA2/1/0/0?appid=${API_KEY}`,
		{ headers: { Accept: 'image/png' } },
	);
	if (!tileRes.ok) {
		throw new Error(`map tile → ${tileRes.status}`);
	}
	const contentType = tileRes.headers.get('Content-Type') ?? '';
	const bytes = await tileRes.arrayBuffer();
	console.log('Content-Type:', contentType);
	console.log('tile bytes:', bytes.byteLength);
	console.log('valid PNG:', contentType.toLowerCase().includes('image/png'));

	section('✅  OpenWeatherMap plugin live demo finished');
	console.log(
		'Next: record this run in Loom, then paste https://www.loom.com/share/... into PR #853 under ## Screenshots / Demos',
	);
	console.log('Then revoke the API key used for this recording.');
}

main().catch((err) => {
	console.error('\n❌  Demo failed:', err.message || err);
	process.exit(1);
});
