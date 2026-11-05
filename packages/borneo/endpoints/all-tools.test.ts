import * as client from '../client';
import type { BorneoContext } from '../index';
import type { BorneoOperationName } from '../operations';
import { BORNEO_OPERATIONS } from '../operations';
import { BORNEO_OPERATION_SAMPLE_INPUTS } from './generated-operation-samples';
import * as EndpointGroups from './index';
import type { BorneoEndpointInputs, BorneoEndpointOutputs } from './types';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	executeBorneoTool: jest.fn(),
}));

const executeMock = client.executeBorneoTool as jest.MockedFunction<
	typeof client.executeBorneoTool
>;

const ctx = {
	key: 'provider-key',
	options: {
		composioApiKey: 'composio-project-key',
		credentialHeaderName: 'X-Provider-Key',
	},
} as BorneoContext;

const ENDPOINT_GROUPS = {
	accounts: EndpointGroups.Accounts,
	assets: EndpointGroups.Assets,
	audit: EndpointGroups.Audit,
	breaches: EndpointGroups.Breaches,
	categories: EndpointGroups.Categories,
	connectors: EndpointGroups.Connectors,
	dashboard: EndpointGroups.Dashboard,
	departments: EndpointGroups.Departments,
	documents: EndpointGroups.Documents,
	domains: EndpointGroups.Domains,
	employees: EndpointGroups.Employees,
	headquarters: EndpointGroups.Headquarters,
	infotypes: EndpointGroups.Infotypes,
	misc: EndpointGroups.Misc,
	processing: EndpointGroups.Processing,
	recipients: EndpointGroups.Recipients,
	resources: EndpointGroups.Resources,
	scans: EndpointGroups.Scans,
	support: EndpointGroups.Support,
	users: EndpointGroups.Users,
} as const;

type EndpointGroupName = keyof typeof ENDPOINT_GROUPS;
type BorneoEndpoint = (
	ctx: BorneoContext,
	input: BorneoEndpointInputs[BorneoOperationName],
) => Promise<BorneoEndpointOutputs[BorneoOperationName]>;

function isEndpointGroupName(group: string): group is EndpointGroupName {
	return Object.hasOwn(ENDPOINT_GROUPS, group);
}

function getEndpoint(
	operation: (typeof BORNEO_OPERATIONS)[number],
): BorneoEndpoint {
	if (!isEndpointGroupName(operation.group)) {
		throw new Error(`Missing endpoint group: ${operation.group}`);
	}

	const group = ENDPOINT_GROUPS[operation.group];
	if (!Object.hasOwn(group, operation.name)) {
		throw new Error(`Missing endpoint: ${operation.name}`);
	}

	// Group modules export only createBorneoEndpoint wrappers; the inventory
	// name is the export key, so this lookup is the typed endpoint itself.
	return group[operation.name as keyof typeof group] as BorneoEndpoint;
}

describe('Borneo complete tool surface', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		executeMock.mockResolvedValue({
			successful: true,
			data: {},
		});
	});

	it('exposes all 153 canonical operations as executable endpoints', () => {
		let count = 0;

		for (const operation of BORNEO_OPERATIONS) {
			expect(typeof getEndpoint(operation)).toBe('function');
			count += 1;
		}

		expect(count).toBe(153);
	});

	for (const operation of BORNEO_OPERATIONS) {
		it(`validates and executes ${operation.id}`, async () => {
			const input = BORNEO_OPERATION_SAMPLE_INPUTS[operation.name];
			const endpoint = getEndpoint(operation);

			// Sample fixtures are const-narrowed; the endpoint accepts the
			// operation's input schema, which those fixtures satisfy at runtime.
			await endpoint(ctx, input as BorneoEndpointInputs[typeof operation.name]);

			expect(executeMock).toHaveBeenCalledWith(
				operation.id,
				input,
				expect.objectContaining({
					composioApiKey: 'composio-project-key',
					borneoCredential: 'provider-key',
				}),
			);
		});
	}
});
