import { BrowserUseBrowser, BrowserUseRun, BrowserUseSchema } from './schema';

describe('Browser Use schema', () => {
	it('declares a semver version', () => {
		expect(BrowserUseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares browsers and runs entities', () => {
		expect(BrowserUseSchema.entities.browsers).toBe(BrowserUseBrowser);
		expect(BrowserUseSchema.entities.runs).toBe(BrowserUseRun);
	});

	it('parses the official browser session shape', () => {
		const parsed = BrowserUseBrowser.parse({
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			status: 'stopped',
			liveUrl: null,
			cdpUrl: null,
			timeoutAt: '2026-10-20T13:00:00Z',
			startedAt: '2026-10-20T12:00:00Z',
			finishedAt: '2026-10-20T12:30:00Z',
			proxyUsedMb: '12.5',
			proxyCost: '0.06',
			browserCost: '0.01',
			recordingUrl: 'https://example.com/rec.mp4',
			metadata: { team: 'growth' },
		});
		expect(parsed.metadata?.team).toBe('growth');
	});

	it('parses a run with structured output', () => {
		const parsed = BrowserUseRun.parse({
			id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
			status: 'completed',
			model: 'gpt-6-luna',
			sessionId: '9b2f1c3e-1111-4a2b-8c3d-123456789abc',
			output: { repos: ['a', 'b'] },
			totalCostUsd: '0.02',
		});
		expect(parsed.output).toEqual({ repos: ['a', 'b'] });
	});

	it('rejects unknown run statuses', () => {
		expect(() =>
			BrowserUseRun.parse({
				id: 'x',
				status: 'paused',
				model: 'm',
				sessionId: 's',
			}),
		).toThrow();
	});
});
