import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// ── OpenWeatherMap Plugin Tests ──────────────────────────────────────────

	console.log('=== OpenWeatherMap Plugin Tests ===\n');

	// Test 1: list_operations — verify the plugin is registered and endpoints are discoverable
	console.log('1. list_operations({ plugin: "openweathermap" })');
	const ops = corsair.list_operations({ plugin: 'openweathermap' });
	console.log(ops);
	console.log();

	// Test 2: get_schema — verify schema introspection works for each endpoint
	console.log('2. get_schema("openweathermap.api.weather.oneCall")');
	const oneCallSchema = corsair.get_schema('openweathermap.api.weather.oneCall');
	console.log(oneCallSchema);
	console.log();

	console.log('3. get_schema("openweathermap.api.history.timeMachine")');
	const timeMachineSchema = corsair.get_schema(
		'openweathermap.api.history.timeMachine',
	);
	console.log(timeMachineSchema);
	console.log();

	console.log('4. get_schema("openweathermap.api.summary.daySummary")');
	const daySummarySchema = corsair.get_schema(
		'openweathermap.api.summary.daySummary',
	);
	console.log(daySummarySchema);
	console.log();

	console.log('5. get_schema("openweathermap.api.summary.overview")');
	const overviewSchema = corsair.get_schema(
		'openweathermap.api.summary.overview',
	);
	console.log(overviewSchema);
	console.log();

	// Test 3: Live API call — requires OPENWEATHERMAP_API_KEY in .env
	// Uncomment the following to test with a real API key:
	//
	// console.log('6. Live API call: weather.oneCall (New York City)');
	// try {
	// 	const weather = await corsair.openweathermap.api.weather.oneCall({
	// 		lat: 40.7128,
	// 		lon: -74.006,
	// 		units: 'metric',
	// 		exclude: ['minutely'],
	// 	});
	// 	console.log('Current temp:', weather.current?.temp, '°C');
	// 	console.log('Weather:', weather.current?.weather[0]?.description);
	// 	console.log('Daily forecast entries:', weather.daily?.length);
	// 	console.log('Hourly forecast entries:', weather.hourly?.length);
	// } catch (error) {
	// 	console.error('API call failed:', error);
	// }
	// console.log();
	//
	// console.log('7. Live API call: summary.overview (London)');
	// try {
	// 	const overview = await corsair.openweathermap.api.summary.overview({
	// 		lat: 51.5074,
	// 		lon: -0.1278,
	// 		units: 'metric',
	// 	});
	// 	console.log('Overview:', overview.weather_overview);
	// } catch (error) {
	// 	console.error('API call failed:', error);
	// }

	console.log('=== All schema tests passed ===');
};

main();
