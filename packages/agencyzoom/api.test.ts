import { request } from 'corsair/http';
import { makeAgencyZoomRequest } from './client';
import { syncAgencyZoomOperationCache } from './endpoints/cache-sync';
import { requestBody, resolvePath } from './endpoints/factory';
import { agencyZoomRoutes } from './endpoints/routes';
import type { AgencyZoomContext } from './index';
import { agencyZoomEndpointSchemas, agencyzoom } from './index';
import {
	AgencyZoomCustomer,
	AgencyZoomLead,
	AgencyZoomTask,
} from './schema/database';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-jwt-token',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as AgencyZoomContext;

describe('AgencyZoom database schemas', () => {
	it('uses AgencyZoom wire-case field names', () => {
		expect(
			AgencyZoomLead.parse({
				id: 1,
				firstname: 'Jane',
				lastname: 'Doe',
				email: 'jane@example.com',
				status: 0,
			}),
		).toMatchObject({ firstname: 'Jane', lastname: 'Doe' });
		expect(
			AgencyZoomCustomer.parse({
				id: 2,
				firstname: 'John',
				lastname: 'Smith',
			}),
		).toMatchObject({ firstname: 'John', lastname: 'Smith' });
		expect(
			AgencyZoomTask.parse({ id: 3, title: 'Call', status: 0 }),
		).toMatchObject({ title: 'Call', status: 0 });
	});

	it('requires leadDataRequests for batchCreateLead', () => {
		const schema = agencyZoomEndpointSchemas['leads.batchCreateLead']?.input;
		expect(schema).toBeDefined();
		expect(() => schema!.parse({})).toThrow();
		expect(
			schema!.parse({
				leadDataRequests: [{ email: 'a@b.com' }],
			}),
		).toMatchObject({ leadDataRequests: [{ email: 'a@b.com' }] });
	});

	it('types OpenAPI pagination on search and thread list inputs', () => {
		for (const key of [
			'leads.searchLeads',
			'customers.searchCustomers',
			'textThreads.searchSmsThreads',
			'emailThreads.searchEmailThreads',
			'leads.searchLeadsCount',
			'life.searchLifeAndHealthLeads',
			'referenceData.searchBusinessClassifications',
			'tasks.searchTasks',
			'leads.getLeadFiles',
			'emailThreads.getThreadDetails',
			'textThreads.textDetailThread',
		] as const) {
			const schema = agencyZoomEndpointSchemas[key]?.input;
			expect(schema).toBeDefined();
			const sample =
				key === 'textThreads.textDetailThread'
					? {
							threadId: 't-1',
							page: 0,
							pageSize: 20,
							sort: 'id',
							order: 'asc',
						}
					: { page: 0, pageSize: 20, sort: 'id', order: 'asc' };
			expect(schema!.parse(sample)).toMatchObject({
				page: 0,
				pageSize: 20,
			});
		}

		const deleteMessage =
			agencyZoomEndpointSchemas['emailThreads.deleteMessage']?.input;
		expect(deleteMessage).toBeDefined();
		expect(deleteMessage!.parse({ messageId: 'msg-1' })).toMatchObject({
			messageId: 'msg-1',
		});
		expect(() => deleteMessage!.parse({ id: 1 })).toThrow();
	});
});

describe('AgencyZoom plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = agencyzoom();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(99);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(99);
		expect(Object.keys(agencyZoomEndpointSchemas)).toHaveLength(99);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(agencyZoomEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = agencyzoom();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('classifies textDetailThread as read and unreadThread as reversible write', () => {
		const textDetail = agencyZoomRoutes.find(
			(route) => route.name === 'textDetailThread',
		);
		const unread = agencyZoomRoutes.find(
			(route) => route.name === 'unreadThread',
		);
		expect(textDetail?.riskLevel).toBe('read');
		expect(unread?.riskLevel).toBe('write');
		expect(textDetail && 'irreversible' in textDetail).toBe(false);
		expect(unread && 'irreversible' in unread).toBe(false);
	});

	it('classifies POST search/list retrievals as read', () => {
		for (const name of [
			'searchCustomers',
			'searchLeads',
			'searchTasks',
			'searchEmailThreads',
			'searchSmsThreads',
			'searchLeadsCount',
			'searchLifeAndHealthLeads',
			'searchBusinessClassifications',
			'serviceTicketList',
			'getThreadDetails',
			'getLeadFiles',
			'getDepartmentsGroups',
		]) {
			const route = agencyZoomRoutes.find(
				(candidate) => candidate.name === name,
			);
			expect(route?.riskLevel).toBe('read');
		}
	});

	it('keeps unread-thread descriptions matched to channel', () => {
		const emailUnread = agencyZoomRoutes.find(
			(route) => route.name === 'markThreadAsUnreadApiEndpoint',
		);
		const textUnread = agencyZoomRoutes.find(
			(route) => route.name === 'unreadThread',
		);
		expect(emailUnread?.description.toLowerCase()).toContain('email');
		expect(emailUnread?.description.toLowerCase()).not.toContain('text thread');
		expect(textUnread?.description.toLowerCase()).toMatch(/sms|text/);
		expect(textUnread?.description.toLowerCase()).not.toContain('email');
	});
});

describe('AgencyZoom request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Bearer Authorization header and JSON bodies', async () => {
		await makeAgencyZoomRequest('/leads/list', 'test-jwt-token', {
			method: 'POST',
			body: { page: 1 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.agencyzoom.com/v1/api',
				TOKEN: 'test-jwt-token',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-jwt-token',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/leads/list',
				body: { page: 1 },
			}),
		);
	});

	it('does not let caller headers override Authorization', async () => {
		await makeAgencyZoomRequest('/leads/list', 'test-jwt-token', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer attacker',
				authorization: 'Bearer lowercase-attacker',
				'content-type': 'text/plain',
				'X-Custom': 'ok',
			},
		});

		const config = mockRequest.mock.calls[0]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(config.HEADERS.Authorization).toBe('Bearer test-jwt-token');
		expect(config.HEADERS.authorization).toBeUndefined();
		expect(config.HEADERS['Content-Type']).toBe('application/json');
		expect(config.HEADERS['content-type']).toBeUndefined();
		expect(config.HEADERS['X-Custom']).toBe('ok');
	});
});

describe('AgencyZoom endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = agencyzoom({ key: 'test-jwt-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			leads: {
				searchLeads: (
					ctx: AgencyZoomContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
				createLead: (
					ctx: AgencyZoomContext,
					input: { firstName: string; lastName: string; email: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.leads.searchLeads(mockCtx, { page: 1 });
		await endpoints.leads.createLead(mockCtx, {
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'POST',
					url: '/leads/list',
					body: { page: 1 },
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/leads/create',
					body: {
						firstName: 'Jane',
						lastName: 'Doe',
						email: 'jane@example.com',
					},
				}),
			]),
		);
	});

	it('resolves snake_case path-param aliases', () => {
		const route = agencyZoomRoutes.find(
			(candidate) => candidate.name === 'getTheLeadDetails',
		);
		expect(route).toBeDefined();
		expect(resolvePath(route!.path, { lead_id: 42 } as never, route)).toBe(
			'/leads/42',
		);
	});

	it('maps getAListOfRecycleEvents to OpenAPI /{leadId}/recycle-events', async () => {
		const plugin = agencyzoom({ key: 'test-jwt-token' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			referenceData: {
				getAListOfRecycleEvents: (
					ctx: AgencyZoomContext,
					input: { leadId: number },
				) => Promise<unknown>;
			};
		};

		await endpoints.referenceData.getAListOfRecycleEvents(mockCtx, {
			leadId: 42,
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/42/recycle-events',
			}),
		);
	});

	it('allows login bootstrap without an existing JWT', async () => {
		const plugin = agencyzoom();
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			auth: {
				logTheUserIn: (
					ctx: AgencyZoomContext,
					input: { username: string; password: string },
				) => Promise<unknown>;
			};
		};

		const noKeyCtx = { ...mockCtx, key: '' } as unknown as AgencyZoomContext;
		await endpoints.auth.logTheUserIn(noKeyCtx, {
			username: 'agent@example.com',
			password: 'secret',
		});

		const config = mockRequest.mock.calls[0]?.[0] as {
			HEADERS: Record<string, string>;
			TOKEN?: string;
		};
		expect(config.HEADERS.Authorization).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/auth/login',
				body: {
					username: 'agent@example.com',
					password: 'secret',
				},
			}),
		);
	});

	it('requires JWT for authenticated routes', async () => {
		const plugin = agencyzoom();
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			leads: {
				getTheLeadDetails: (
					ctx: AgencyZoomContext,
					input: { leadId: number },
				) => Promise<unknown>;
			};
		};

		const noKeyCtx = { ...mockCtx, key: '' } as unknown as AgencyZoomContext;
		await expect(
			endpoints.leads.getTheLeadDetails(noKeyCtx, { leadId: 1 }),
		).rejects.toThrow(/agencyzoom|api_key|Authentication|JWT/i);
	});

	it('evicts task cache on POST batchDeleteTask', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		const upsertByEntityId = jest.fn();
		const route = agencyZoomRoutes.find(
			(candidate) => candidate.name === 'batchDeleteTask',
		);
		expect(route).toBeDefined();

		await syncAgencyZoomOperationCache(
			{
				...mockCtx,
				db: {
					tasks: { deleteByEntityId, upsertByEntityId },
				},
			} as unknown as AgencyZoomContext,
			route!,
			{ taskIds: [1, 2] },
			{ ok: true },
		);

		expect(deleteByEntityId).toHaveBeenCalledWith('1');
		expect(deleteByEntityId).toHaveBeenCalledWith('2');
		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('evicts task cache when ids are nested under body', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(true);
		const route = agencyZoomRoutes.find(
			(candidate) => candidate.name === 'batchDeleteTask',
		);
		expect(route).toBeDefined();

		await syncAgencyZoomOperationCache(
			{
				...mockCtx,
				db: {
					tasks: { deleteByEntityId },
				},
			} as unknown as AgencyZoomContext,
			route!,
			{ body: { taskIds: [9, 10] } },
			{ ok: true },
		);

		expect(deleteByEntityId).toHaveBeenCalledWith('9');
		expect(deleteByEntityId).toHaveBeenCalledWith('10');
	});

	it('excludes path-param aliases from request bodies', () => {
		const route = agencyZoomRoutes.find(
			(candidate) => candidate.name === 'createACustomerNote',
		);
		expect(route).toBeDefined();
		expect(
			requestBody(route!, {
				customer_id: 11,
				customerId: 11,
				note: 'hello',
			}),
		).toEqual({ note: 'hello' });
	});

	it('keeps updateTask taskId in both path and body', () => {
		const route = agencyZoomRoutes.find(
			(candidate) => candidate.name === 'updateTask',
		);
		expect(route).toBeDefined();
		expect(route!.bodyPathParams).toEqual(['taskId']);
		expect(
			requestBody(route!, {
				taskId: 123,
				title: 'Call',
			}),
		).toEqual({ taskId: 123, title: 'Call' });
		expect(resolvePath(route!.path, { taskId: 123 } as never, route)).toBe(
			'/tasks/123',
		);
	});

	it('requires tagNames and a policy identifier for updateTagsForAPolicy', () => {
		const schema =
			agencyZoomEndpointSchemas['policies.updateTagsForAPolicy']?.input;
		expect(schema).toBeDefined();
		expect(() => schema!.parse({})).toThrow();
		expect(() => schema!.parse({ tagNames: 'vip' })).toThrow();
		expect(schema!.parse({ tagNames: 'vip', policyId: 1 })).toMatchObject({
			tagNames: 'vip',
			policyId: 1,
		});
		expect(schema!.parse({ tagNames: 'vip', amsPolicyId: 9 })).toMatchObject({
			tagNames: 'vip',
			amsPolicyId: 9,
		});
	});

	it('maps destructive and multi-path-param routes correctly', async () => {
		const plugin = agencyzoom({ key: 'test-jwt-token' });
		// Test-only: exercise deletes Greptile flagged + multi-segment path params.
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			customers: {
				deleteACustomer: (
					ctx: AgencyZoomContext,
					input: { customerId: number },
				) => Promise<unknown>;
				deleteACustomerFile: (
					ctx: AgencyZoomContext,
					input: { customerId: number; fileId: number },
				) => Promise<unknown>;
				deleteACustomerPolicy: (
					ctx: AgencyZoomContext,
					input: { customerId: number; policyId: number },
				) => Promise<unknown>;
			};
			tasks: {
				batchDeleteTask: (
					ctx: AgencyZoomContext,
					input: { taskIds: number[] },
				) => Promise<unknown>;
				deleteATask: (
					ctx: AgencyZoomContext,
					input: { taskId: number },
				) => Promise<unknown>;
			};
			leads: {
				deleteALeadFile: (
					ctx: AgencyZoomContext,
					input: { leadId: number; fileId: number },
				) => Promise<unknown>;
				deleteALeadOpportunity: (
					ctx: AgencyZoomContext,
					input: { leadId: number; opportunityId: number },
				) => Promise<unknown>;
				deleteALeadQuote: (
					ctx: AgencyZoomContext,
					input: { leadId: number; quoteId: number },
				) => Promise<unknown>;
			};
			opportunities: {
				deleteAnOpportunity: (
					ctx: AgencyZoomContext,
					input: { opportunityId: number },
				) => Promise<unknown>;
				deleteADriver: (
					ctx: AgencyZoomContext,
					input: { driverId: number },
				) => Promise<unknown>;
			};
			emailThreads: {
				deleteThread: (
					ctx: AgencyZoomContext,
					input: { threadId: string },
				) => Promise<unknown>;
			};
			textThreads: {
				removeTextThreadEndpoint: (
					ctx: AgencyZoomContext,
					input: { threadId: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.customers.deleteACustomer(mockCtx, { customerId: 11 });
		await endpoints.tasks.batchDeleteTask(mockCtx, { taskIds: [1, 2] });
		await endpoints.customers.deleteACustomerFile(mockCtx, {
			customerId: 11,
			fileId: 22,
		});
		await endpoints.customers.deleteACustomerPolicy(mockCtx, {
			customerId: 11,
			policyId: 33,
		});
		await endpoints.leads.deleteALeadFile(mockCtx, {
			leadId: 44,
			fileId: 55,
		});
		await endpoints.leads.deleteALeadOpportunity(mockCtx, {
			leadId: 44,
			opportunityId: 66,
		});
		await endpoints.leads.deleteALeadQuote(mockCtx, {
			leadId: 44,
			quoteId: 77,
		});
		await endpoints.tasks.deleteATask(mockCtx, { taskId: 88 });
		await endpoints.opportunities.deleteAnOpportunity(mockCtx, {
			opportunityId: 99,
		});
		await endpoints.opportunities.deleteADriver(mockCtx, { driverId: 101 });
		await endpoints.emailThreads.deleteThread(mockCtx, {
			threadId: 'email-1',
		});
		await endpoints.textThreads.removeTextThreadEndpoint(mockCtx, {
			threadId: 'sms-1',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'DELETE',
					url: '/customers/11',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/tasks/batch-delete',
					body: { taskIds: [1, 2] },
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/customers/11/files/22',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/customers/11/policies/33',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/leads/44/files/55',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/leads/44/opportunities/66',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/leads/44/quotes/77',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/tasks/88',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/opportunities/99',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/opportunities/drivers/101',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/email-thread/delete-thread',
					body: { threadId: 'email-1' },
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/text-thread/delete-thread',
					body: { threadId: 'sms-1' },
				}),
			]),
		);

		const customerDelete = mockRequest.mock.calls.find(
			(call) => call[1].method === 'DELETE' && call[1].url === '/customers/11',
		);
		expect(customerDelete?.[1].body).toBeUndefined();
	});
});
