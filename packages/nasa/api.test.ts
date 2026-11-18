import { asRecord, createCorsair } from 'corsair/core';
import { NasaEndpointOutputSchemas as Outputs } from './endpoints/types';
import { nasa } from './index';

/**
 * Live smoke test: a few calls per host, every answer parsed through its output
 * schema before an assertion touches it, so a field typed wrongly fails here as
 * well as for a caller.
 *
 * Skipped unless NASA_API_KEY is set, and the skip is logged so it cannot read
 * as a pass. `DEMO_KEY` works but at 30 requests an hour shared per IP, so a
 * suite gated on it would fail for reasons outside this plugin.
 */
const apiKey = process.env.NASA_API_KEY;
const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey) {
	console.warn('NASA_API_KEY is not set: live tests skipped');
}

describeIfKey('NASA live API', () => {
	const corsair = createCorsair({
		plugins: [nasa({ key: apiKey })],
	});

	it('reads the latest APOD entries through the output schema', async () => {
		const parsed = Outputs.apodList.parse(
			await corsair.nasa.api.apod.list({ per_page: 1 }),
		);

		expect(parsed.entries).toHaveLength(1);
		const [entry] = parsed.entries;
		expect(entry?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(entry?.title).toBeTruthy();
		// Every entry has at least one image or video URL.
		expect(entry?.url ?? entry?.hdurl).toBeTruthy();
	}, 30_000);

	it('reads one asteroid through the output schema', async () => {
		const parsed = Outputs.neoLookup.parse(
			await corsair.nasa.api.neo.lookup({ asteroid_id: 3542519 }),
		);

		expect(parsed.id).toBe('3542519');
		// Orbital distances are decimal strings, so a numeric read would throw.
		expect(typeof asRecord(parsed.orbital_data)?.aphelion_distance).toBe(
			'string',
		);
	}, 30_000);

	it('browses the asteroid catalogue through the output schema', async () => {
		const parsed = Outputs.neoBrowse.parse(
			await corsair.nasa.api.neo.browse({ size: 1 }),
		);

		expect(parsed.near_earth_objects.length).toBeGreaterThan(0);
		expect(typeof parsed.page.total_pages).toBe('number');
	}, 30_000);

	it('lists coronal mass ejections through the output schema', async () => {
		const parsed = Outputs.cmeList.parse(
			await corsair.nasa.api.donki.cme({
				startDate: '2026-10-20',
				endDate: '2026-10-24',
			}),
		);

		for (const event of parsed.events) {
			expect(event.activityID).toBeTruthy();
			expect(Array.isArray(event.cmeAnalyses)).toBe(true);
		}
	}, 30_000);

	it('lists geomagnetic storms through the output schema', async () => {
		const parsed = Outputs.geomagneticStormList.parse(
			await corsair.nasa.api.donki.geomagneticStorm({
				startDate: '2026-10-20',
				endDate: '2026-10-31',
			}),
		);

		for (const storm of parsed.storms) {
			expect(storm.gstID).toBeTruthy();
			expect(Array.isArray(storm.allKpIndex)).toBe(true);
		}
	}, 30_000);

	it('reads EPIC imagery metadata through the output schema', async () => {
		const parsed = Outputs.epicImages.parse(
			await corsair.nasa.api.epic.images({ date: '2019-05-30' }),
		);

		expect(parsed.images.length).toBeGreaterThan(0);
		// EPIC sends "YYYY-MM-DD HH:MM:SS", so an ISO read would fail here.
		expect(parsed.images[0]?.date).toMatch(
			/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
		);
	}, 30_000);

	it('lists EPIC dates through the output schema', async () => {
		const parsed = Outputs.epicAvailableDates.parse(
			await corsair.nasa.api.epic.availableDates({}),
		);

		expect(parsed.dates.length).toBeGreaterThan(0);
		expect(parsed.dates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	}, 30_000);

	it('lists open natural events through the output schema', async () => {
		const parsed = Outputs.eonetEvents.parse(
			await corsair.nasa.api.eonet.events({ limit: 1 }),
		);

		expect(parsed.events).toHaveLength(1);
		expect(typeof parsed.events[0]?.id).toBe('string');
	}, 30_000);

	it('searches the image library through the output schema', async () => {
		const parsed = Outputs.imageSearch.parse(
			await corsair.nasa.api.images.search({
				q: 'apollo 11',
				media_type: 'image',
				page_size: 1,
			}),
		);

		expect(parsed.items).toHaveLength(1);
		expect(parsed.total_hits).toBeGreaterThan(1);
		expect(parsed.next_page).toBe(2);
	}, 30_000);
});
