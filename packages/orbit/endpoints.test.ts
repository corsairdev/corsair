import {
	BatchEnrichInput,
	CreateWatcherInput,
	DetectFacesInput,
	StartSearchInput,
	SubmitBulkInput,
} from './endpoints/types';

describe('orbit input bounds', () => {
	it('accepts a query and rejects a search with no seed', () => {
		expect(StartSearchInput.parse({ query: 'ml engineers' }).query).toBe(
			'ml engineers',
		);
		expect(() => StartSearchInput.parse({ limit: 10 })).toThrow();
	});

	it('accepts the discovery cap and rejects the next integer', () => {
		expect(
			StartSearchInput.parse({
				query: 'a person',
				candidate_discovery: true,
				candidate_discovery_limit: 50,
			}).candidate_discovery_limit,
		).toBe(50);
		expect(() =>
			StartSearchInput.parse({
				query: 'a person',
				candidate_discovery: true,
				candidate_discovery_limit: 51,
			}),
		).toThrow();
	});

	it('rejects a discovery cap when discovery is off', () => {
		expect(() =>
			StartSearchInput.parse({
				query: 'a person',
				candidate_discovery_limit: 5,
			}),
		).toThrow();
	});

	it('accepts 20 profiles and rejects 21', () => {
		const ids = Array.from({ length: 20 }, (_, index) => `profile_${index}`);
		expect(
			BatchEnrichInput.parse({ profile_ids: ids, operation: 'full' })
				.profile_ids,
		).toHaveLength(20);
		expect(() =>
			BatchEnrichInput.parse({
				profile_ids: [...ids, 'profile_20'],
				operation: 'full',
			}),
		).toThrow();
	});

	it('rejects an hourly watcher below 3600 seconds and a bulk face signal', () => {
		expect(() =>
			CreateWatcherInput.parse({
				orbit_id: '00000000-0000-4000-8000-000000000001',
				interval_seconds: 3599,
			}),
		).toThrow();
		expect(() =>
			SubmitBulkInput.parse({
				request_id: 'bulk-1',
				items: [{ signals: { face_source: { image_url: 'img_1' } } }],
			}),
		).toThrow();
	});

	it('rejects an extra key on a face upload', () => {
		expect(() =>
			DetectFacesInput.parse({ imageBase64: 'aGVsbG8=', refresh: true }),
		).toThrow();
	});
});
