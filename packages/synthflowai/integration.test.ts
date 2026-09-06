import { makeSynthflowAiRequest, SynthflowAiAPIError } from './client';

const LIVE_KEY = process.env.SYNTHFLOW_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Synthflow AI live Platform API v2', () => {
	it('rejects an invalid API key on GET /assistants/', async () => {
		const err = await makeSynthflowAiRequest(
			'assistants/',
			'sk-invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(SynthflowAiAPIError);
		expect((err as SynthflowAiAPIError).status).toBe(401);
	});
});

describeIfKey('Synthflow AI live Platform API v2 (authenticated)', () => {
	it('lists assistants', async () => {
		const raw = await makeSynthflowAiRequest('assistants/', LIVE_KEY as string);
		expect(raw).toBeDefined();
		expect(typeof raw).toBe('object');
	});
});
