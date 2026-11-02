import { recallai, recallaiEndpointSchemas } from './index';
import { RecallaiSchema } from './schema';

jest.mock('./client', () => ({
	makeRecallaiRequest: jest.fn(),
}));

import { makeRecallaiRequest } from './client';

describe('Recall.ai schema', () => {
	it('declares a semver version and workspace entity', () => {
		expect(RecallaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(RecallaiSchema.entities.recallaiWorkspace).toBeDefined();
	});

	it('registers every implemented operation with executable contracts', () => {
		expect(Object.keys(recallaiEndpointSchemas)).toEqual([
		'bots.list',
		'bots.create',
		'bots.retrieve',
		'bots.update',
		'bots.delete',
			'meetingMetadata.list',
			'meetingMetadata.retrieve',
			'participantEvents.list',
			'participantEvents.retrieve',
			'participantEvents.update',
			'transcripts.list',
			'transcripts.retrieve',
		]);
		for (const contract of Object.values(recallaiEndpointSchemas)) {
			expect(typeof contract.input.safeParse).toBe('function');
			expect(typeof contract.output.safeParse).toBe('function');
		}
	});

	it('validates required identifiers at the public endpoint boundary', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue({ count: 0, results: [] });
		const plugin = recallai({ key: 'recall-key' });
		const ctx = { key: 'recall-key' } as never;
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(plugin.endpoints.bots.retrieve(ctx, {} as never)).rejects.toThrow();
		await expect(plugin.endpoints.meetingMetadata.retrieve(ctx, {} as never)).rejects.toThrow();
		await expect(plugin.endpoints.participantEvents.retrieve(ctx, {} as never)).rejects.toThrow();
		await expect(plugin.endpoints.participantEvents.update(ctx, { id: 'x', metadata: {} })).rejects.toThrow();
		await expect(plugin.endpoints.transcripts.retrieve(ctx, {} as never)).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
		await expect(plugin.endpoints.bots.list(ctx, {})).resolves.toEqual({ count: 0, results: [] });
	});
});
