import { LeverEndpointInputSchemas } from './endpoints/types';
import { lever, leverEndpointSchemas } from './index';
import { LeverSchema } from './schema';

jest.mock('./client', () => ({
	makeLeverRequest: jest.fn(),
}));

import { makeLeverRequest } from './client';

describe('Lever schema', () => {
	it('declares a semver version', () => {
		expect(LeverSchema.version).toBeDefined();
		expect(LeverSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LeverSchema.entities).toBe('object');
		expect(LeverSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LeverSchema.entities))).toBe(true);
		for (const entity of Object.values(LeverSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers the full current Lever operation catalog', () => {
		expect(Object.keys(leverEndpointSchemas).length).toBeGreaterThanOrEqual(38);
	});

	it('enforces endpoint schemas at the bound endpoint boundary', async () => {
		const request = jest.mocked(makeLeverRequest);
		request.mockClear();
		request.mockResolvedValue({ data: [], has_more: false });
		const plugin = lever({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		if (!plugin.endpoints) throw new Error('Lever endpoints are missing');

		await expect(
			plugin.endpoints.opportunities.list(ctx, { offset: -1 } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();

		await expect(plugin.endpoints.opportunities.list(ctx, {})).resolves.toEqual(
			{ data: [], has_more: false },
		);

		request.mockResolvedValue({ invalid: true });
		await expect(
			plugin.endpoints.opportunities.list(ctx, {}),
		).rejects.toThrow();
	});

	it('requires every path parameter at the schema boundary', () => {
		const opportunityOperations = [
			'retrieveOpportunity',
			'listOpportunityFileActions',
			'listApplications',
			'listInterviews',
			'listNotes',
		] as const;
		for (const operation of opportunityOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse({ opportunityId: 'opp-1' }).success).toBe(true);
		}

		const twoIdOperations = [
			'retrieveApplication',
			'retrieveInterview',
			'updateInterview',
			'deleteInterview',
			'retrieveNote',
			'updateNote',
			'deleteNote',
		] as const;
		for (const operation of twoIdOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({ opportunityId: 'opp-1' }).success).toBe(false);
		}
		expect(
			LeverEndpointInputSchemas.retrieveApplication.safeParse({
				opportunityId: 'opp-1',
				applicationId: 'app-1',
			}).success,
		).toBe(true);
		expect(
			LeverEndpointInputSchemas.retrieveInterview.safeParse({
				opportunityId: 'opp-1',
				interviewId: 'int-1',
			}).success,
		).toBe(true);
		expect(
			LeverEndpointInputSchemas.deleteNote.safeParse({
				opportunityId: 'opp-1',
				noteId: 'note-1',
			}).success,
		).toBe(true);

		const bodyRequiredOperations = [
			[
				'addOpportunityLinks',
				{ opportunityId: 'opp-1', contactIDs: ['con-1'] },
			],
			[
				'removeOpportunityLinks',
				{ opportunityId: 'opp-1', contactIDs: ['con-1'] },
			],
			['addOpportunityTags', { opportunityId: 'opp-1', tags: ['remote'] }],
			['removeOpportunityTags', { opportunityId: 'opp-1', tags: ['remote'] }],
			[
				'addOpportunitySources',
				{ opportunityId: 'opp-1', sourceIDs: ['src-1'] },
			],
			[
				'removeOpportunitySources',
				{ opportunityId: 'opp-1', sourceIDs: ['src-1'] },
			],
			['createOpportunity', { name: 'Jane Doe' }],
			[
				'updateOpportunityStage',
				{ opportunityId: 'opp-1', stageID: 'stage-2' },
			],
			['createNote', { opportunityId: 'opp-1', value: 'note text' }],
			[
				'updateNote',
				{ opportunityId: 'opp-1', noteId: 'note-1', value: 'note text' },
			],
			[
				'applyToPosting',
				{ postingId: 'post-1', name: 'Jane', email: 'jane@example.com' },
			],
			['createPosting', { text: 'Software Engineer' }],
			['createInterview', { opportunityId: 'opp-1', date: 1700000000000 }],
		] as const;
		for (const [operation, validInput] of bodyRequiredOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(validInput).success).toBe(true);
		}

		expect(
			LeverEndpointInputSchemas.retrievePosting.safeParse({}).success,
		).toBe(false);
		expect(
			LeverEndpointInputSchemas.retrievePosting.safeParse({
				postingId: 'post-1',
			}).success,
		).toBe(true);
		expect(LeverEndpointInputSchemas.retrieveStage.safeParse({}).success).toBe(
			false,
		);
		expect(
			LeverEndpointInputSchemas.retrieveStage.safeParse({ stageId: 'stage-1' })
				.success,
		).toBe(true);
		expect(
			LeverEndpointInputSchemas.retrieveArchiveReason.safeParse({}).success,
		).toBe(false);
		expect(
			LeverEndpointInputSchemas.retrieveArchiveReason.safeParse({
				archiveReasonId: 'arch-1',
			}).success,
		).toBe(true);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(leverEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps every registered endpoint behind a schema boundary', () => {
		const plugin = lever({ key: 'secret' });
		const paths: string[] = [];
		const visit = (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				paths.push(prefix.join('.'));
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					visit(child, [...prefix, key]);
				}
			}
		};

		visit(plugin.endpoints);
		expect(paths).toHaveLength(Object.keys(leverEndpointSchemas).length);
		for (const path of paths) {
			expect(
				leverEndpointSchemas[path as keyof typeof leverEndpointSchemas],
			).toBeDefined();
		}
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation and asserts one request plus response parsing.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeLeverRequest);
		request.mockClear();
		const plugin = lever({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		const inputCandidates = [
			{
				opportunityId: 'opp-1',
				applicationId: 'app-1',
				postingId: 'post-1',
				interviewId: 'int-1',
				noteId: 'note-1',
				archiveReasonId: 'arch-1',
				stageId: 'stage-1',
			},
			{},
			{ name: 'Jane Doe' },
			{ text: 'Software Engineer' },
			{ opportunityId: 'opp-1', stageID: 'stage-2' },
			{ opportunityId: 'opp-1', archived: true },
			{ opportunityId: 'opp-1', contactIDs: ['con-1'] },
			{ opportunityId: 'opp-1', tags: ['remote'] },
			{ opportunityId: 'opp-1', sourceIDs: ['src-1'] },
			{ opportunityId: 'opp-1', value: 'note text' },
			{ opportunityId: 'opp-1', noteId: 'note-1', value: 'note text' },
			{ postingId: 'post-1', name: 'Jane Doe', email: 'jane@example.com' },
			{ opportunityId: 'opp-1', date: 1700000000000 },
		];
		const outputCandidates = [{ data: [] }, {}, undefined];
		let invokedOperations = 0;
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof leverEndpointSchemas;
				const contract = leverEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				const input = inputCandidates.find(
					(candidate) => contract.input.safeParse(candidate).success,
				);
				if (!input) throw new Error(`No valid test input for ${path}`);
				const output = outputCandidates.find(
					(candidate) => contract.output.safeParse(candidate).success,
				);
				request.mockResolvedValue(output);
				await (value as (context: unknown, args: unknown) => Promise<unknown>)(
					ctx,
					input,
				);
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(Object.keys(leverEndpointSchemas).length);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});
});
