import { logEventFromContext } from 'corsair/core';
import { makeCallinglyRequest } from '../client';
import type { CallinglyContext } from '../index';
import * as Handlers from './handlers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeCallinglyRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeCallinglyRequest);
const mockLog = jest.mocked(logEventFromContext);

const mockDb = {
	leads: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	calls: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	users: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	teams: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	teamUsers: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	schedules: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	clients: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
	webhooks: { upsertByEntityId: jest.fn(), deleteByEntityId: jest.fn() },
};

const ctx = {
	key: 'test-api-key',
	db: mockDb,
} as unknown as CallinglyContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockReset();
	for (const table of Object.values(mockDb)) {
		table.upsertByEntityId.mockReset();
		table.deleteByEntityId.mockReset();
	}
});

describe('Callingly Endpoints Handlers', () => {
	describe('Leads', () => {
		it('getLead calls GET /leads/:id and persists to db', async () => {
			const lead = { id: 'lead_10', phone_number: '+15550001111' };
			mockRequest.mockResolvedValue(lead);

			const res = await Handlers.getLead(ctx, { leadId: 'lead_10' });
			expect(mockRequest).toHaveBeenCalledWith(
				'leads/lead_10',
				'test-api-key',
				{
					method: 'GET',
					accountId: undefined,
				},
			);
			expect(res.id).toBe('lead_10');
			expect(mockDb.leads.upsertByEntityId).toHaveBeenCalledWith(
				'lead_10',
				expect.objectContaining({ id: 'lead_10' }),
			);
		});

		it('getLead rejects invalid input schema', async () => {
			// @ts-expect-error invalid input missing leadId
			await expect(Handlers.getLead(ctx, {})).rejects.toThrow();
		});

		it('listLeads calls GET /leads with query and persists collection', async () => {
			const leads = [{ id: 'lead_1' }, { id: 'lead_2' }];
			mockRequest.mockResolvedValue(leads);

			const res = await Handlers.listLeads(ctx, {
				start: '2020-01-01',
				end: '2020-02-01',
			});
			expect(mockRequest).toHaveBeenCalledWith('leads', 'test-api-key', {
				method: 'GET',
				query: { start: '2020-01-01', end: '2020-02-01' },
				accountId: undefined,
			});
			expect(res).toEqual(leads);
			expect(mockDb.leads.upsertByEntityId).toHaveBeenCalledTimes(2);
		});

		it('updateLead calls PUT /leads/:id and updates db', async () => {
			const lead = { id: 'lead_10', fname: 'Updated' };
			mockRequest.mockResolvedValue(lead);

			const res = await Handlers.updateLead(ctx, {
				leadId: 'lead_10',
				fname: 'Updated',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'leads/lead_10',
				'test-api-key',
				{
					method: 'PUT',
					body: { fname: 'Updated' },
					accountId: undefined,
				},
			);
			expect(res.fname).toBe('Updated');
			expect(mockDb.leads.upsertByEntityId).toHaveBeenCalledWith(
				'lead_10',
				expect.objectContaining({ id: 'lead_10', fname: 'Updated' }),
			);
		});

		it('deleteLead calls DELETE /leads/:id and deletes from db', async () => {
			mockRequest.mockResolvedValue({ success: true });

			const res = await Handlers.deleteLead(ctx, { leadId: 'lead_10' });
			expect(mockRequest).toHaveBeenCalledWith(
				'leads/lead_10',
				'test-api-key',
				{
					method: 'DELETE',
					accountId: undefined,
				},
			);
			expect(res.success).toBe(true);
			expect(mockDb.leads.deleteByEntityId).toHaveBeenCalledWith('lead_10');
		});
	});

	describe('Calls', () => {
		it('createCall calls POST /calls and persists to db', async () => {
			const call = { id: 'call_1', lead_id: 'lead_10', status: 'initiated' };
			mockRequest.mockResolvedValue(call);

			const res = await Handlers.createCall(ctx, {
				phone_number: '555-555-5555',
				team_id: 123,
			});
			expect(mockRequest).toHaveBeenCalledWith('calls', 'test-api-key', {
				method: 'POST',
				body: { phone_number: '555-555-5555', team_id: 123 },
				accountId: undefined,
			});
			expect(res.id).toBe('call_1');
			expect(mockDb.calls.upsertByEntityId).toHaveBeenCalledWith(
				'call_1',
				expect.objectContaining({ id: 'call_1' }),
			);
		});

		it('getCall calls GET /calls/:id and persists to db', async () => {
			const call = { id: 'call_1', duration: 45 };
			mockRequest.mockResolvedValue(call);

			const res = await Handlers.getCall(ctx, { callId: 'call_1' });
			expect(mockRequest).toHaveBeenCalledWith('calls/call_1', 'test-api-key', {
				method: 'GET',
				accountId: undefined,
			});
			expect(res.duration).toBe(45);
			expect(mockDb.calls.upsertByEntityId).toHaveBeenCalledWith(
				'call_1',
				expect.objectContaining({ id: 'call_1', duration: 45 }),
			);
		});

		it('listCalls calls GET /calls and persists collection', async () => {
			const calls = [{ id: 'call_1' }];
			mockRequest.mockResolvedValue(calls);

			const res = await Handlers.listCalls(ctx, { limit: 5 });
			expect(mockRequest).toHaveBeenCalledWith('calls', 'test-api-key', {
				method: 'GET',
				query: { limit: 5 },
				accountId: undefined,
			});
			expect(res).toEqual(calls);
			expect(mockDb.calls.upsertByEntityId).toHaveBeenCalledWith(
				'call_1',
				expect.objectContaining({ id: 'call_1' }),
			);
		});
	});

	describe('Agents / Users', () => {
		it('createAgent calls POST /agents and persists to db', async () => {
			const agent = { id: 'ag_1', name: 'New Agent', email: 'agent@test.com' };
			mockRequest.mockResolvedValue(agent);

			const res = await Handlers.createAgent(ctx, {
				fname: 'John',
				lname: 'Smith',
				phone_number: '555-555-5555',
			});
			expect(mockRequest).toHaveBeenCalledWith('agents', 'test-api-key', {
				method: 'POST',
				body: {
					fname: 'John',
					lname: 'Smith',
					phone_number: '555-555-5555',
				},
				accountId: undefined,
			});
			expect(res.id).toBe('ag_1');
			expect(mockDb.users.upsertByEntityId).toHaveBeenCalledWith(
				'ag_1',
				expect.objectContaining({ id: 'ag_1' }),
			);
		});

		it('listUsers calls GET /agents and persists collection', async () => {
			mockRequest.mockResolvedValue([{ id: 'u1', name: 'Agent 1' }]);
			const res = await Handlers.listUsers(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('agents', 'test-api-key', {
				method: 'GET',
				query: {},
				accountId: undefined,
			});
			expect(res).toEqual([{ id: 'u1', name: 'Agent 1' }]);
			expect(mockDb.users.upsertByEntityId).toHaveBeenCalledWith(
				'u1',
				expect.objectContaining({ id: 'u1', name: 'Agent 1' }),
			);
		});

		it('updateAgent calls PUT /agents/:id and persists to db', async () => {
			mockRequest.mockResolvedValue({ id: 'ag_1', fname: 'Updated' });
			const res = await Handlers.updateAgent(ctx, {
				agentId: 'ag_1',
				fname: 'Updated',
			});
			expect(mockRequest).toHaveBeenCalledWith('agents/ag_1', 'test-api-key', {
				method: 'PUT',
				body: { fname: 'Updated' },
				accountId: undefined,
			});
			expect(res.fname).toBe('Updated');
			expect(mockDb.users.upsertByEntityId).toHaveBeenCalledWith(
				'ag_1',
				expect.objectContaining({ id: 'ag_1', fname: 'Updated' }),
			);
		});

		it('deleteAgent calls DELETE /agents/:id and deletes from db', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const res = await Handlers.deleteAgent(ctx, { agentId: 'ag_1' });
			expect(mockRequest).toHaveBeenCalledWith('agents/ag_1', 'test-api-key', {
				method: 'DELETE',
				accountId: undefined,
			});
			expect(res.success).toBe(true);
			expect(mockDb.users.deleteByEntityId).toHaveBeenCalledWith('ag_1');
		});

		it('getAgentSchedule calls GET /agents/:id/schedule and persists to db', async () => {
			mockRequest.mockResolvedValue({ agent_id: 'ag_1', timezone: 'UTC' });
			const res = await Handlers.getAgentSchedule(ctx, { agentId: 'ag_1' });
			expect(mockRequest).toHaveBeenCalledWith(
				'agents/ag_1/schedule',
				'test-api-key',
				{
					method: 'GET',
					accountId: undefined,
				},
			);
			expect(res).toEqual(
				expect.objectContaining({ agent_id: 'ag_1', timezone: 'UTC' }),
			);
			expect(mockDb.schedules.upsertByEntityId).toHaveBeenCalledWith(
				'ag_1',
				expect.objectContaining({ agent_id: 'ag_1', timezone: 'UTC' }),
			);
		});

		it('updateAgentSchedule calls PUT /agents/:id/schedule with the documented day array', async () => {
			const days = [
				{
					label: 'Monday',
					day: 1,
					is_available: true,
					times: [{ start: '06:00:00', end: '20:00:00' }],
				},
			];
			mockRequest.mockResolvedValue(days);
			const res = await Handlers.updateAgentSchedule(ctx, {
				agentId: 'ag_1',
				days,
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'agents/ag_1/schedule',
				'test-api-key',
				{
					method: 'PUT',
					body: days,
					accountId: undefined,
				},
			);
			expect(res).toEqual(days);
			expect(mockDb.schedules.upsertByEntityId).toHaveBeenCalledWith(
				'ag_1',
				expect.objectContaining({ agent_id: 'ag_1', days }),
			);
		});
	});

	describe('Teams', () => {
		it('createTeam calls POST /teams and persists to db', async () => {
			mockRequest.mockResolvedValue({ id: 't1', name: 'New Team' });
			const res = await Handlers.createTeam(ctx, { name: 'New Team' });
			expect(mockRequest).toHaveBeenCalledWith('teams', 'test-api-key', {
				method: 'POST',
				body: { name: 'New Team' },
				accountId: undefined,
			});
			expect(res.id).toBe('t1');
			expect(mockDb.teams.upsertByEntityId).toHaveBeenCalledWith(
				't1',
				expect.objectContaining({ id: 't1', name: 'New Team' }),
			);
		});

		it('listTeams calls GET /teams and persists collection', async () => {
			mockRequest.mockResolvedValue([{ id: 't1', name: 'Team A' }]);
			const res = await Handlers.listTeams(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('teams', 'test-api-key', {
				method: 'GET',
				query: {},
				accountId: undefined,
			});
			expect(res).toEqual([{ id: 't1', name: 'Team A' }]);
			expect(mockDb.teams.upsertByEntityId).toHaveBeenCalledWith(
				't1',
				expect.objectContaining({ id: 't1', name: 'Team A' }),
			);
		});

		it('getTeam calls GET /teams/:id and persists to db', async () => {
			mockRequest.mockResolvedValue({ id: 't1', name: 'Team A' });
			const res = await Handlers.getTeam(ctx, { teamId: 't1' });
			expect(mockRequest).toHaveBeenCalledWith('teams/t1', 'test-api-key', {
				method: 'GET',
				accountId: undefined,
			});
			expect(res.name).toBe('Team A');
			expect(mockDb.teams.upsertByEntityId).toHaveBeenCalledWith(
				't1',
				expect.objectContaining({ id: 't1', name: 'Team A' }),
			);
		});

		it('listTeamUsers calls GET /teams/:id/agents and persists collection with composite keys', async () => {
			mockRequest.mockResolvedValue([
				{ id: 'u1', name: 'Agent 1', priority: 1 },
			]);
			const res = await Handlers.listTeamUsers(ctx, { teamId: 't1' });
			expect(mockRequest).toHaveBeenCalledWith(
				'teams/t1/agents',
				'test-api-key',
				{
					method: 'GET',
					accountId: undefined,
				},
			);
			expect(res).toEqual([{ id: 'u1', name: 'Agent 1', priority: 1 }]);
			expect(mockDb.teamUsers.upsertByEntityId).toHaveBeenCalledWith(
				't1:u1',
				expect.objectContaining({ id: 'u1', priority: 1, team_id: 't1' }),
			);
		});

		it('updateTeamUsers calls PUT /teams/:id/agents and persists to db', async () => {
			mockRequest.mockResolvedValue({
				id: 't1',
				name: 'Team A',
				user_ids: ['u1', 'u2'],
			});
			const res = await Handlers.updateTeamUsers(ctx, {
				teamId: 't1',
				user_ids: ['u1', 'u2'],
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'teams/t1/agents',
				'test-api-key',
				{
					method: 'PUT',
					body: { agents: ['u1', 'u2'] },
					accountId: undefined,
				},
			);
			expect(res.id).toBe('t1');
			expect(mockDb.teams.upsertByEntityId).toHaveBeenCalledWith(
				't1',
				expect.objectContaining({ id: 't1' }),
			);
		});

		it('updateTeamAgentSettings calls PUT /teams/:id/agents/:agentId and persists to db with composite key', async () => {
			mockRequest.mockResolvedValue({ id: 'u1', priority: 2, cap: 10 });
			const res = await Handlers.updateTeamAgentSettings(ctx, {
				teamId: 't1',
				agentId: 'u1',
				priority: 2,
				cap: 10,
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'teams/t1/agents/u1',
				'test-api-key',
				{
					method: 'PUT',
					body: { priority: 2, cap: 10 },
					accountId: undefined,
				},
			);
			expect(res.priority).toBe(2);
			expect(mockDb.teamUsers.upsertByEntityId).toHaveBeenCalledWith(
				't1:u1',
				expect.objectContaining({
					id: 'u1',
					priority: 2,
					cap: 10,
					team_id: 't1',
				}),
			);
		});

		it('removeTeamAgent calls DELETE /teams/:id/agents/:agentId and deletes from db with composite key', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const res = await Handlers.removeTeamAgent(ctx, {
				teamId: 't1',
				agentId: 'u1',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'teams/t1/agents/u1',
				'test-api-key',
				{
					method: 'DELETE',
					accountId: undefined,
				},
			);
			expect(res.success).toBe(true);
			expect(mockDb.teamUsers.deleteByEntityId).toHaveBeenCalledWith('t1:u1');
		});
	});

	describe('Clients (Agency)', () => {
		it('listClients calls GET /clients and persists collection', async () => {
			mockRequest.mockResolvedValue([{ id: 'c1', name: 'Client 1' }]);
			const res = await Handlers.listClients(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('clients', 'test-api-key', {
				method: 'GET',
			});
			expect(res).toEqual([{ id: 'c1', name: 'Client 1' }]);
			expect(mockDb.clients.upsertByEntityId).toHaveBeenCalledWith(
				'c1',
				expect.objectContaining({ id: 'c1', name: 'Client 1' }),
			);
		});

		it('createClient calls POST /clients and persists to db', async () => {
			const body = {
				fname: 'John',
				lname: 'Smith',
				company: 'Smith Pools',
				email: 'client@email.com',
				phone_number: '555-555-5555',
				password: 'password123',
			};
			mockRequest.mockResolvedValue({ id: 'c1', name: 'Smith Pools' });
			const res = await Handlers.createClient(ctx, body);
			expect(mockRequest).toHaveBeenCalledWith('clients', 'test-api-key', {
				method: 'POST',
				body,
			});
			expect(res.name).toBe('Smith Pools');
			expect(mockDb.clients.upsertByEntityId).toHaveBeenCalledWith(
				'c1',
				expect.objectContaining({ id: 'c1', name: 'Smith Pools' }),
			);
		});

		it('deleteClient calls DELETE /clients/:id and deletes from db', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const res = await Handlers.deleteClient(ctx, { clientId: 'c1' });
			expect(mockRequest).toHaveBeenCalledWith('clients/c1', 'test-api-key', {
				method: 'DELETE',
			});
			expect(res.success).toBe(true);
			expect(mockDb.clients.deleteByEntityId).toHaveBeenCalledWith('c1');
		});

		it('setClientActive calls POST /clients/:id/active with is_active flag and persists to db', async () => {
			mockRequest.mockResolvedValue({
				id: 'c1',
				name: 'Client 1',
				active: true,
			});
			const res = await Handlers.setClientActive(ctx, {
				clientId: 'c1',
				active: true,
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'clients/c1/active',
				'test-api-key',
				{
					method: 'POST',
					body: { is_active: 1 },
				},
			);
			expect(res.active).toBe(true);
			expect(mockDb.clients.upsertByEntityId).toHaveBeenCalledWith(
				'c1',
				expect.objectContaining({ id: 'c1', active: true }),
			);
		});
	});

	describe('Webhooks Config', () => {
		it('listWebhooks calls GET /webhooks and persists collection', async () => {
			mockRequest.mockResolvedValue([
				{ id: 'wh_1', url: 'https://test.com/hook' },
			]);
			const res = await Handlers.listWebhooks(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('webhooks', 'test-api-key', {
				method: 'GET',
				query: {},
				accountId: undefined,
			});
			expect(res).toEqual([{ id: 'wh_1', url: 'https://test.com/hook' }]);
			expect(mockDb.webhooks.upsertByEntityId).toHaveBeenCalledWith(
				'wh_1',
				expect.objectContaining({ id: 'wh_1', url: 'https://test.com/hook' }),
			);
		});

		it('getWebhook calls GET /webhooks/:id and persists to db', async () => {
			mockRequest.mockResolvedValue({
				id: 'wh_1',
				url: 'https://test.com/hook',
			});
			const res = await Handlers.getWebhook(ctx, { webhookId: 'wh_1' });
			expect(mockRequest).toHaveBeenCalledWith(
				'webhooks/wh_1',
				'test-api-key',
				{
					method: 'GET',
					accountId: undefined,
				},
			);
			expect(res.id).toBe('wh_1');
			expect(mockDb.webhooks.upsertByEntityId).toHaveBeenCalledWith(
				'wh_1',
				expect.objectContaining({ id: 'wh_1' }),
			);
		});

		it('createWebhook calls POST /webhooks and persists to db', async () => {
			mockRequest.mockResolvedValue({
				id: 'wh_1',
				name: 'Call Webhook',
				target_url: 'https://test.com/hook',
				event: 'call_completed',
			});
			const res = await Handlers.createWebhook(ctx, {
				name: 'Call Webhook',
				target_url: 'https://test.com/hook',
				event: 'call_completed',
			});
			expect(mockRequest).toHaveBeenCalledWith('webhooks', 'test-api-key', {
				method: 'POST',
				body: {
					name: 'Call Webhook',
					target_url: 'https://test.com/hook',
					event: 'call_completed',
				},
				accountId: undefined,
			});
			expect(res.id).toBe('wh_1');
			expect(mockDb.webhooks.upsertByEntityId).toHaveBeenCalledWith(
				'wh_1',
				expect.objectContaining({
					id: 'wh_1',
					target_url: 'https://test.com/hook',
				}),
			);
		});

		it('updateWebhook calls PUT /webhooks/:id and persists to db', async () => {
			mockRequest.mockResolvedValue({
				id: 'wh_1',
				target_url: 'https://updated.com/hook',
			});
			const res = await Handlers.updateWebhook(ctx, {
				webhookId: 'wh_1',
				target_url: 'https://updated.com/hook',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'webhooks/wh_1',
				'test-api-key',
				{
					method: 'PUT',
					body: { target_url: 'https://updated.com/hook' },
					accountId: undefined,
				},
			);
			expect(res.target_url).toBe('https://updated.com/hook');
			expect(mockDb.webhooks.upsertByEntityId).toHaveBeenCalledWith(
				'wh_1',
				expect.objectContaining({
					id: 'wh_1',
					target_url: 'https://updated.com/hook',
				}),
			);
		});

		it('deleteWebhook calls DELETE /webhooks/:id and deletes from db', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const res = await Handlers.deleteWebhook(ctx, { webhookId: 'wh_1' });
			expect(mockRequest).toHaveBeenCalledWith(
				'webhooks/wh_1',
				'test-api-key',
				{
					method: 'DELETE',
					accountId: undefined,
				},
			);
			expect(res.success).toBe(true);
			expect(mockDb.webhooks.deleteByEntityId).toHaveBeenCalledWith('wh_1');
		});
	});
});
