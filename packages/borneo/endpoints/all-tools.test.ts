import * as client from '../client';
import { BORNEO_OPERATIONS } from '../operations';
import * as EndpointGroups from './index';

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
	key: 'composio-project-key',
	options: {
		composioApiKey: 'composio-project-key',
		connectedAccountId: 'ca_borneo',
	},
	db: {},
} as any;

function exportName(group: string): string {
	return `${group.charAt(0).toUpperCase()}${group.slice(1)}`;
}

describe('Borneo complete tool surface', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		executeMock.mockResolvedValue({ successful: true, data: {} });
	});

	it('exposes all 153 canonical operations as executable endpoints', () => {
		let count = 0;

		for (const operation of BORNEO_OPERATIONS) {
			const group = (EndpointGroups as Record<string, Record<string, unknown>>)[
				exportName(operation.group)
			];

			if (!group) {
				throw new Error(`Missing endpoint group: ${operation.group}`);
			}

			expect(typeof group[operation.name]).toBe('function');
			count += 1;
		}

		expect(count).toBe(153);
	});

	for (const operation of BORNEO_OPERATIONS) {
		it(`executes ${operation.id}`, async () => {
			const group = (
				EndpointGroups as Record<
					string,
					Record<string, (ctx: unknown, input: unknown) => Promise<unknown>>
				>
			)[exportName(operation.group)];

			if (!group) {
				throw new Error(`Missing endpoint group: ${operation.group}`);
			}

			const endpoint = group[operation.name];

			if (!endpoint) {
				throw new Error(`Missing endpoint: ${operation.name}`);
			}

			await endpoint(ctx, { marker: operation.id });

			expect(executeMock).toHaveBeenCalledWith(
				operation.id,
				{ marker: operation.id },
				expect.objectContaining({
					composioApiKey: 'composio-project-key',
					connectedAccountId: 'ca_borneo',
				}),
			);
		});
	}
});
