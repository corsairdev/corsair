import { CrowterminalDataPoint, CrowterminalIncident } from './database';

// The ingest and status endpoints return no per-record id, so the entities
// derive a deterministic one from the fields that identify the record.

describe('data point ids', () => {
	it('derives an id from the identity fields', () => {
		const row = CrowterminalDataPoint.parse({
			clientId: 'c1',
			platform: 'TIKTOK',
			dataType: 'retention',
			videoId: 'v9',
		});

		expect(row.id).toBe('c1:TIKTOK:retention:v9');
	});

	it('derives a stable id for channel-level data with no video', () => {
		const row = CrowterminalDataPoint.parse({
			clientId: 'c1',
			platform: 'YOUTUBE',
			dataType: 'follower_growth',
		});

		expect(row.id).toBe('c1:YOUTUBE:follower_growth:');
	});

	// A raw join lets these two distinct points share one id, because the
	// separator can fall inside dataType or videoId. platform is an enum, so
	// the ambiguity has to come from the free-text fields.
	it('does not collide when a field contains the separator', () => {
		const a = CrowterminalDataPoint.parse({
			clientId: 'c1',
			platform: 'TIKTOK',
			dataType: 'a',
			videoId: 'b:c',
		});
		const b = CrowterminalDataPoint.parse({
			clientId: 'c1',
			platform: 'TIKTOK',
			dataType: 'a:b',
			videoId: 'c',
		});

		expect(a.id).not.toBe(b.id);
	});

	it('gives the same id for the same point twice', () => {
		const input = {
			clientId: 'c1',
			platform: 'TIKTOK' as const,
			dataType: 'retention',
		};

		expect(CrowterminalDataPoint.parse(input).id).toBe(
			CrowterminalDataPoint.parse({ ...input }).id,
		);
	});

	it('keeps an id the provider did supply', () => {
		expect(
			CrowterminalDataPoint.parse({
				id: 'provider-id',
				clientId: 'c1',
				platform: 'TIKTOK',
				dataType: 'retention',
			}).id,
		).toBe('provider-id');
	});

	it('still rejects a record missing its identity fields', () => {
		expect(() => CrowterminalDataPoint.parse({ clientId: 'c1' })).toThrow();
	});
});

describe('incident ids', () => {
	// The status endpoints name the start time `timestamp`.
	it('derives an id from the timestamp the API returns', () => {
		const row = CrowterminalIncident.parse({
			timestamp: '2026-08-22T15:00:51.198Z',
			status: 'degraded (ongoing)',
			components: ['redis'],
		});

		expect(row.id).toBe('2026-08-22T15:00:51.198Z');
		expect(row.startedAt).toEqual(new Date('2026-08-22T15:00:51.198Z'));
	});

	// zod strips the unrecognised `timestamp`, so normalising has to happen even
	// when the incident already carries an id.
	it('keeps the start time when the incident also has an id', () => {
		const row = CrowterminalIncident.parse({
			id: 'inc_1',
			timestamp: '2026-08-22T15:00:51.198Z',
			status: 'degraded',
		});

		expect(row.id).toBe('inc_1');
		expect(row.startedAt).toEqual(new Date('2026-08-22T15:00:51.198Z'));
	});

	it('rejects an incident with nothing to identify it', () => {
		expect(() => CrowterminalIncident.parse({ status: 'degraded' })).toThrow();
	});
});
