import { ReplicateEndpointOutputSchemas } from './endpoints/types';

// The answer Replicate gave on 2026-11-02 to starting black-forest-labs/
// flux-schnell through POST /models/{owner}/{name}/predictions (urls trimmed).
const OFFICIAL_MODEL_START = {
	id: 'jw0meqbevnrzy0d1kf796bmrcr',
	model: 'black-forest-labs/flux-schnell',
	version: null,
	input: { prompt: 'a small red fishing boat, watercolor', num_outputs: 1 },
	logs: '',
	output: null,
	data_removed: false,
	error: null,
	source: 'api',
	status: 'starting',
	created_at: '2026-11-02T10:29:19.709Z',
	urls: {
		cancel:
			'https://api.replicate.com/v1/predictions/jw0meqbevnrzy0d1kf796bmrcr/cancel',
		get: 'https://api.replicate.com/v1/predictions/jw0meqbevnrzy0d1kf796bmrcr',
	},
};

describe('Replicate prediction answers', () => {
	it('parse when an official model answers with no version', () => {
		const parsed =
			ReplicateEndpointOutputSchemas.modelsPredictionsCreate.parse(
				OFFICIAL_MODEL_START,
			);
		expect(parsed.id).toBe('jw0meqbevnrzy0d1kf796bmrcr');
		expect(parsed.version).toBeNull();
		expect(parsed.status).toBe('starting');
	});

	it('parse the answer to a cancel, which has no logs', () => {
		const parsed = ReplicateEndpointOutputSchemas.predictionsCancel.parse({
			...OFFICIAL_MODEL_START,
			logs: null,
			status: 'canceled',
		});
		expect(parsed.status).toBe('canceled');
		expect(parsed.logs).toBeNull();
	});

	it('parse when the read back says the version is hidden', () => {
		const parsed = ReplicateEndpointOutputSchemas.predictionsGet.parse({
			...OFFICIAL_MODEL_START,
			version: 'hidden',
			status: 'succeeded',
		});
		expect(parsed.version).toBe('hidden');
	});
});
