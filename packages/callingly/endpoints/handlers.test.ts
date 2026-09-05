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

const ctx = { key: 'test-api-key' } as CallinglyContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLog.mockReset();
});

describe('Callingly Endpoints Handlers', () => {
	describe('Leads', () => {
		it('createLead calls POST /leads and logs event', async () => {
			const lead = {
				id: 'lead_10',
				name: 'Test Lead',
				phone_number: '+15550001111',
			};
			mockRequest.mockResolvedValue(lead);

			const res = await Handlers.createLead(ctx, {
				name: 'Test Lead',
				phone_number: '+15550001111',
			});

			expect(mockRequest).toHaveBeenCalledWith('leads', 'test-api-key', {
				method: 'POST',
				body: { name: 'Test Lead', phone_number: '+15550001111' },
				accountId: undefined,
			});
			expect(res.id).toBe('lead_10');
			expect(mockLog).toHaveBeenCalledWith(
				ctx,
				'callingly.leads.create',
				{ id: 'lead_10' },
				'completed',
			);
		});

		it('getLead calls GET /leads/:id', async () => {
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
		});

		it('listLeads calls GET /leads with query', async () => {
			const leads = [{ id: 'lead_1' }, { id: 'lead_2' }];
			mockRequest.mockResolvedValue(leads);

			const res = await Handlers.listLeads(ctx, { limit: 10, page: 1 });
			expect(mockRequest).toHaveBeenCalledWith('leads', 'test-api-key', {
				method: 'GET',
				query: { limit: 10, page: 1 },
				accountId: undefined,
			});
			expect(res).toEqual(leads);
		});

		it('updateLead calls PUT /leads/:id', async () => {
			const lead = { id: 'lead_10', name: 'Updated' };
			mockRequest.mockResolvedValue(lead);

			const res = await Handlers.updateLead(ctx, {
				leadId: 'lead_10',
				name: 'Updated',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'leads/lead_10',
				'test-api-key',
				{
					method: 'PUT',
					body: { name: 'Updated' },
					accountId: undefined,
				},
			);
			expect(res.name).toBe('Updated');
		});

		it('deleteLead calls DELETE /leads/:id', async () => {
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
		});
	});

	describe('Calls', () => {
		it('createCall calls POST /calls', async () => {
			const call = { id: 'call_1', lead_id: 'lead_10', status: 'initiated' };
			mockRequest.mockResolvedValue(call);

			const res = await Handlers.createCall(ctx, { lead_id: 'lead_10' });
			expect(mockRequest).toHaveBeenCalledWith('calls', 'test-api-key', {
				method: 'POST',
				body: { lead_id: 'lead_10' },
				accountId: undefined,
			});
			expect(res.id).toBe('call_1');
		});

		it('getCall calls GET /calls/:id', async () => {
			const call = { id: 'call_1', duration: 45 };
			mockRequest.mockResolvedValue(call);

			const res = await Handlers.getCall(ctx, { callId: 'call_1' });
			expect(mockRequest).toHaveBeenCalledWith('calls/call_1', 'test-api-key', {
				method: 'GET',
				accountId: undefined,
			});
			expect(res.duration).toBe(45);
		});

		it('listCalls calls GET /calls', async () => {
			const calls = [{ id: 'call_1' }];
			mockRequest.mockResolvedValue(calls);

			const res = await Handlers.listCalls(ctx, { limit: 5 });
			expect(mockRequest).toHaveBeenCalledWith('calls', 'test-api-key', {
				method: 'GET',
				query: { limit: 5 },
				accountId: undefined,
			});
			expect(res).toEqual(calls);
		});
	});

	describe('Agents / Users', () => {
		it('createAgent calls POST /agents', async () => {
			const agent = { id: 'ag_1', name: 'New Agent', email: 'agent@test.com' };
			mockRequest.mockResolvedValue(agent);

			const res = await Handlers.createAgent(ctx, {
				name: 'New Agent',
				email: 'agent@test.com',
			});
			expect(mockRequest).toHaveBeenCalledWith('agents', 'test-api-key', {
				method: 'POST',
				body: { name: 'New Agent', email: 'agent@test.com' },
				accountId: undefined,
			});
			expect(res.id).toBe('ag_1');
		});

		it('listUsers calls GET /users', async () => {
			mockRequest.mockResolvedValue([{ id: 'u1', name: 'Agent 1' }]);
			const res = await Handlers.listUsers(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('users', 'test-api-key', {
				method: 'GET',
				query: {},
				accountId: undefined,
			});
			expect(res).toEqual([{ id: 'u1', name: 'Agent 1' }]);
		});

		it('getUser calls GET /users/:id', async () => {
			mockRequest.mockResolvedValue({ id: 'u1', name: 'Agent 1' });
			const res = await Handlers.getUser(ctx, { userId: 'u1' });
			expect(mockRequest).toHaveBeenCalledWith('users/u1', 'test-api-key', {
				method: 'GET',
				accountId: undefined,
			});
			expect(res.id).toBe('u1');
		});

		it('updateAgent calls PUT /agents/:id', async () => {
			mockRequest.mockResolvedValue({ id: 'ag_1', name: 'Updated Agent' });
			const res = await Handlers.updateAgent(ctx, {
				agentId: 'ag_1',
				name: 'Updated Agent',
			});
			expect(mockRequest).toHaveBeenCalledWith('agents/ag_1', 'test-api-key', {
				method: 'PUT',
				body: { name: 'Updated Agent' },
				accountId: undefined,
			});
			expect(res.name).toBe('Updated Agent');
		});

		it('deleteAgent calls DELETE /agents/:id', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const res = await Handlers.deleteAgent(ctx, { agentId: 'ag_1' });
			expect(mockRequest).toHaveBeenCalledWith('agents/ag_1', 'test-api-key', {
				method: 'DELETE',
				accountId: undefined,
			});
			expect(res.success).toBe(true);
		});

		it('getAgentSchedule calls GET /agents/:id/schedule', async () => {
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
			expect(res.timezone).toBe('UTC');
		});

		it('updateAgentSchedule calls PUT /agents/:id/schedule', async () => {
			mockRequest.mockResolvedValue({ agent_id: 'ag_1', timezone: 'EST' });
			const res = await Handlers.updateAgentSchedule(ctx, {
				agentId: 'ag_1',
				timezone: 'EST',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'agents/ag_1/schedule',
				'test-api-key',
				{
					method: 'PUT',
					body: { timezone: 'EST' },
					accountId: undefined,
				},
			);
			expect(res.timezone).toBe('EST');
		});
	});

	describe('Teams', () => {
		it('createTeam calls POST /teams', async () => {
			mockRequest.mockResolvedValue({ id: 't1', name: 'New Team' });
			const res = await Handlers.createTeam(ctx, { name: 'New Team' });
			expect(mockRequest).toHaveBeenCalledWith('teams', 'test-api-key', {
				method: 'POST',
				body: { name: 'New Team' },
				accountId: undefined,
			});
			expect(res.id).toBe('t1');
		});

		it('listTeams calls GET /teams', async () => {
			mockRequest.mockResolvedValue([{ id: 't1', name: 'Team A' }]);
			const res = await Handlers.listTeams(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('teams', 'test-api-key', {
				method: 'GET',
				query: {},
				accountId: undefined,
			});
			expect(res).toEqual([{ id: 't1', name: 'Team A' }]);
		});

		it('getTeam calls GET /teams/:id', async () => {
			mockRequest.mockResolvedValue({ id: 't1', name: 'Team A' });
			const res = await Handlers.getTeam(ctx, { teamId: 't1' });
			expect(mockRequest).toHaveBeenCalledWith('teams/t1', 'test-api-key', {
				method: 'GET',
				accountId: undefined,
			});
			expect(res.name).toBe('Team A');
		});

		it('listTeamUsers calls GET /teams/:id/users', async () => {
			mockRequest.mockResolvedValue([
				{ id: 'u1', name: 'Agent 1', priority: 1 },
			]);
			const res = await Handlers.listTeamUsers(ctx, { teamId: 't1' });
			expect(mockRequest).toHaveBeenCalledWith(
				'teams/t1/users',
				'test-api-key',
				{
					method: 'GET',
					accountId: undefined,
				},
			);
			expect(res).toEqual([{ id: 'u1', name: 'Agent 1', priority: 1 }]);
		});

		it('updateTeamUsers calls PUT /teams/:id/users', async () => {
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
				'teams/t1/users',
				'test-api-key',
				{
					method: 'PUT',
					body: { user_ids: ['u1', 'u2'] },
					accountId: undefined,
				},
			);
			expect(res.id).toBe('t1');
		});

		it('updateTeamAgentSettings calls PUT /teams/:id/agents/:agentId', async () => {
			mockRequest.mockResolvedValue({ id: 'u1', priority: 2, call_cap: 10 });
			const res = await Handlers.updateTeamAgentSettings(ctx, {
				teamId: 't1',
				agentId: 'u1',
				priority: 2,
				call_cap: 10,
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'teams/t1/agents/u1',
				'test-api-key',
				{
					method: 'PUT',
					body: { priority: 2, call_cap: 10 },
					accountId: undefined,
				},
			);
			expect(res.priority).toBe(2);
		});

		it('removeTeamAgent calls DELETE /teams/:id/agents/:agentId', async () => {
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
		});
	});

	describe('Clients (Agency)', () => {
		it('listClients calls GET /clients', async () => {
			mockRequest.mockResolvedValue([{ id: 'c1', name: 'Client 1' }]);
			const res = await Handlers.listClients(ctx, {});
			expect(mockRequest).toHaveBeenCalledWith('clients', 'test-api-key', {
				method: 'GET',
				query: {},
			});
			expect(res).toEqual([{ id: 'c1', name: 'Client 1' }]);
		});

		it('getClient calls GET /clients/:id', async () => {
			mockRequest.mockResolvedValue({ id: 'c1', name: 'Client 1' });
			const res = await Handlers.getClient(ctx, { clientId: 'c1' });
			expect(mockRequest).toHaveBeenCalledWith('clients/c1', 'test-api-key', {
				method: 'GET',
			});
			expect(res.name).toBe('Client 1');
		});

		it('createClient calls POST /clients', async () => {
			mockRequest.mockResolvedValue({ id: 'c1', name: 'New Client' });
			const res = await Handlers.createClient(ctx, { name: 'New Client' });
			expect(mockRequest).toHaveBeenCalledWith('clients', 'test-api-key', {
				method: 'POST',
				body: { name: 'New Client' },
			});
			expect(res.name).toBe('New Client');
		});

		it('deleteClient calls DELETE /clients/:id', async () => {
			mockRequest.mockResolvedValue({ success: true });
			const res = await Handlers.deleteClient(ctx, { clientId: 'c1' });
			expect(mockRequest).toHaveBeenCalledWith('clients/c1', 'test-api-key', {
				method: 'DELETE',
			});
			expect(res.success).toBe(true);
		});

		it('setClientActive calls POST /clients/:id/active', async () => {
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
					body: { active: true },
				},
			);
			expect(res.active).toBe(true);
		});
	});

	describe('Webhooks Config', () => {
		it('listWebhooks calls GET /webhooks', async () => {
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
		});

		it('getWebhook calls GET /webhooks/:id', async () => {
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
		});

		it('createWebhook calls POST /webhooks', async () => {
			mockRequest.mockResolvedValue({
				id: 'wh_1',
				url: 'https://test.com/hook',
				event: 'call_completed',
			});
			const res = await Handlers.createWebhook(ctx, {
				url: 'https://test.com/hook',
				event: 'call_completed',
			});
			expect(mockRequest).toHaveBeenCalledWith('webhooks', 'test-api-key', {
				method: 'POST',
				body: { url: 'https://test.com/hook', event: 'call_completed' },
				accountId: undefined,
			});
			expect(res.id).toBe('wh_1');
		});

		it('updateWebhook calls PUT /webhooks/:id', async () => {
			mockRequest.mockResolvedValue({
				id: 'wh_1',
				url: 'https://updated.com/hook',
			});
			const res = await Handlers.updateWebhook(ctx, {
				webhookId: 'wh_1',
				url: 'https://updated.com/hook',
			});
			expect(mockRequest).toHaveBeenCalledWith(
				'webhooks/wh_1',
				'test-api-key',
				{
					method: 'PUT',
					body: { url: 'https://updated.com/hook' },
					accountId: undefined,
				},
			);
			expect(res.url).toBe('https://updated.com/hook');
		});

		it('deleteWebhook calls DELETE /webhooks/:id', async () => {
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
		});
	});
});
