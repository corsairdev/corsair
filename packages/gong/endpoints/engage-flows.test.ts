import { request } from 'corsair/http';
import {
	assignProspects,
	getFlowProspectsBulkAssignment,
	getFlowSteps,
	getProspectsAssignedFlows,
	listFlows,
	listFlowsFolders,
	searchFlows,
	submitFlowProspectsBulkAssignment,
	unassignFlows,
	unassignProspectFlows,
} from './engage-flows';
import {
	GongEngageFlowsInputSchemas,
	GongEngageFlowsOutputSchemas,
} from './engage-flows-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
};

describe('Gong Engage Flows request contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates flow schemas at their boundary', () => {
		expect(GongEngageFlowsInputSchemas.listFlows.safeParse({}).success).toBe(
			false,
		);
		expect(
			GongEngageFlowsInputSchemas.listFlows.safeParse({
				flowOwnerEmail: 'owner@example.com',
			}).success,
		).toBe(true);
		expect(
			GongEngageFlowsOutputSchemas.listFlows.safeParse({
				requestId: 'r',
				flows: [],
			}).success,
		).toBe(true);
	});
	// Endpoint signatures and provider envelopes vary across this table; public schemas validate the test inputs and outputs.
	const cases: Array<
		[
			string,
			(...args: never[]) => Promise<unknown>,
			Record<string, unknown>,
			string,
			string,
			Record<string, unknown> | undefined,
			unknown | undefined,
			unknown,
		]
	> = [
		[
			'getFlowSteps',
			getFlowSteps,
			{ flowIds: ['1'] },
			'POST',
			'/v2/flows/steps',
			undefined,
			{ flowIds: ['1'] },
			{ requestId: 'r', flows: [] },
		],
		[
			'getProspectsAssignedFlows',
			getProspectsAssignedFlows,
			{ crmProspectsIds: ['crm'] },
			'POST',
			'/v2/flows/prospects',
			undefined,
			{ crmProspectsIds: ['crm'] },
			{ requestId: 'r', prospectsAssigned: [] },
		],
		[
			'unassignFlows',
			unassignFlows,
			{ flowInstanceIds: ['fi'] },
			'POST',
			'/v2/flows/prospects/unassign-flows-by-instance-id',
			undefined,
			{ flowInstanceIds: ['fi'] },
			{ requestId: 'r', unassignedFlowInstanceIds: ['fi'] },
		],
		[
			'unassignProspectFlows',
			unassignProspectFlows,
			{ crmProspectId: 'crm' },
			'POST',
			'/v2/flows/prospects/unassign-flows-by-crm-id',
			undefined,
			{ crmProspectId: 'crm' },
			{ requestId: 'r', unassignedFlowInstanceIds: [] },
		],
		[
			'submitFlowProspectsBulkAssignment',
			submitFlowProspectsBulkAssignment,
			{
				flowId: 'f',
				flowInstanceOwnerEmail: 'owner@example.com',
				prospects: [],
			},
			'POST',
			'/v2/flows/prospects/bulk-assignments',
			undefined,
			{
				flowId: 'f',
				flowInstanceOwnerEmail: 'owner@example.com',
				prospects: [],
			},
			{
				requestId: 'r',
				id: 'job',
				status: 'PENDING',
				totalCount: 0,
				processedCount: 0,
				successCount: 0,
				failedCount: 0,
			},
		],
		[
			'assignProspects',
			assignProspects,
			{
				crmProspectsIds: ['crm'],
				flowId: 'f',
				flowInstanceOwnerEmail: 'owner@example.com',
			},
			'POST',
			'/v2/flows/prospects/assign',
			undefined,
			{
				crmProspectsIds: ['crm'],
				flowId: 'f',
				flowInstanceOwnerEmail: 'owner@example.com',
			},
			{ requestId: 'r' },
		],
		[
			'listFlows',
			listFlows,
			{ flowOwnerEmail: 'owner@example.com', cursor: 'next' },
			'GET',
			'/v2/flows',
			{ flowOwnerEmail: 'owner@example.com', cursor: 'next' },
			undefined,
			{ requestId: 'r', flows: [] },
		],
		[
			'searchFlows',
			searchFlows,
			{ flowOwnerEmail: 'owner@example.com', query: 'renewal', limit: 7 },
			'GET',
			'/v2/flows/search',
			{ flowOwnerEmail: 'owner@example.com', query: 'renewal', limit: 7 },
			undefined,
			{ requestId: 'r', flows: [] },
		],
		[
			'getFlowProspectsBulkAssignment',
			getFlowProspectsBulkAssignment,
			{ id: 'job-1' },
			'GET',
			'/v2/flows/prospects/bulk-assignments/job-1',
			undefined,
			undefined,
			{
				requestId: 'r',
				id: 'job-1',
				status: 'COMPLETED',
				totalCount: 0,
				processedCount: 0,
				successCount: 0,
				failedCount: 0,
			},
		],
		[
			'listFlowsFolders',
			listFlowsFolders,
			{ flowFolderOwnerEmail: 'owner@example.com' },
			'GET',
			'/v2/flows/folders',
			{ flowFolderOwnerEmail: 'owner@example.com' },
			undefined,
			{ requestId: 'r', folders: [] },
		],
	];
	it.each(cases)(
		'%s sends its documented request',
		async (_name, endpoint, input, method, url, query, body, output) => {
			mockedRequest.mockResolvedValue(output);
			await Reflect.apply(endpoint, undefined, [ctx, input]);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://tenant.api.gong.io',
					USERNAME: 'key',
					PASSWORD: 'secret',
				}),
				expect.objectContaining({ method, url, query, body }),
			);
		},
	);
	it.each(['', '.', '..', '/', '\\', 'a/b', 'a\\b', '"x"', "'x'"])(
		'rejects unsafe bulk assignment id %s',
		async (id) => {
			await expect(getFlowProspectsBulkAssignment(ctx, { id })).rejects.toThrow(
				'Unsafe Gong',
			);
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);
});
