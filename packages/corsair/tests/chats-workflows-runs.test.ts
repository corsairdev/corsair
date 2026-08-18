import { buildWorkflowsNamespace } from '../core/workflows';
import { createChat, listChats, postChatMessage } from '../hub/chats';
import type { HubConfig } from '../hub/types';

const hub: HubConfig = {
	apiUrl: 'https://hub.example',
	projectApiKey: 'ck_dev_test',
	signingSecret: 'signing-secret',
};

type FetchCall = { url: string; init: any };

// Minimal Response stand-in for readHubJsonResponse (headers.get + text()).
function jsonResponse(body: unknown): any {
	return {
		ok: true,
		status: 200,
		headers: { get: () => 'application/json' },
		text: async () => JSON.stringify(body),
	};
}

describe('chats / workflows / runs SDK surface', () => {
	const originalFetch = global.fetch;
	let calls: FetchCall[];

	function mockFetch(body: unknown): void {
		calls = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			return jsonResponse(body);
		}) as unknown as typeof fetch;
	}

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('createChat maps {thread, reply:{threadId}} → {chat, reply:{chatId}}', async () => {
		mockFetch({
			thread: { id: 'th_1', title: 'demo', workflowId: null },
			reply: {
				threadId: 'th_1',
				message: { id: 'm_1', role: 'assistant', content: 'hi' },
				workflowId: 'wf_1',
				action: 'created',
			},
		});

		const result = await createChat(hub, { tenantId: 'dev', message: 'go' });

		expect(calls[0]!.url).toBe('https://hub.example/threads');
		expect(result.chat.id).toBe('th_1');
		expect(result.reply.chatId).toBe('th_1');
		expect(result.reply.action).toBe('created');
		expect((result.reply as any).threadId).toBeUndefined();
	});

	it('postChatMessage maps {threadId,...} → {chatId,...}', async () => {
		mockFetch({
			threadId: 'th_2',
			message: { id: 'm_2', role: 'assistant', content: 'ok' },
			workflowId: null,
			action: 'none',
		});

		const reply = await postChatMessage(hub, {
			chatId: 'th_2',
			tenantId: 'dev',
			message: 'edit',
		});

		expect(calls[0]!.url).toBe('https://hub.example/threads/th_2/messages');
		expect(reply.chatId).toBe('th_2');
		expect((reply as any).threadId).toBeUndefined();
	});

	it('listChats reads the `threads` array', async () => {
		mockFetch({ threads: [{ id: 'th_3', title: 'a' }, { id: 'th_4' }] });

		const chats = await listChats(hub, { tenantId: 'dev' });

		expect(calls[0]!.url).toBe('https://hub.example/threads?tenantId=dev');
		expect(chats.map((c) => c.id)).toEqual(['th_3', 'th_4']);
	});

	it('workflows.get(id) calls GET /workflows/:id and returns the workflow', async () => {
		mockFetch({ workflow: { id: 'wf_1', name: 'demo', status: 'active' } });

		const workflows = buildWorkflowsNamespace(hub, 'dev');
		const wf = await workflows.get('wf_1');

		expect(calls[0]!.url).toBe(
			'https://hub.example/workflows/wf_1?tenantId=dev',
		);
		expect(wf.id).toBe('wf_1');
	});

	it('workflows.run(id, opts) posts payload + idempotencyKey to /workflows/:id/run', async () => {
		mockFetch({ status: 'queued', runId: 'run_1' });

		const workflows = buildWorkflowsNamespace(hub, 'dev');
		const result = await workflows.run('wf_1', {
			payload: { a: 1 },
			idempotencyKey: 'k1',
		});

		expect(calls[0]!.url).toBe(
			'https://hub.example/workflows/wf_1/run?tenantId=dev',
		);
		const body = JSON.parse(calls[0]!.init.body);
		expect(body.payload).toEqual({ a: 1 });
		expect(body.idempotencyKey).toBe('k1');
		expect(result.runId).toBe('run_1');
	});

	it('workflows.runs.list({ workflowId }) calls /workflows/:id/runs and returns the runs array', async () => {
		mockFetch({ runs: [{ id: 'run_1' }, { id: 'run_2' }] });

		const workflows = buildWorkflowsNamespace(hub, 'dev');
		const runs = await workflows.runs.list({ workflowId: 'wf_1' });

		expect(calls[0]!.url).toBe(
			'https://hub.example/workflows/wf_1/runs?tenantId=dev',
		);
		expect(runs.map((r) => r.id)).toEqual(['run_1', 'run_2']);
	});

	it('disable/enable/archive/unarchive map to POST /workflows/:id/status', async () => {
		const workflows = buildWorkflowsNamespace(hub, 'dev');
		const cases: Array<[keyof typeof workflows, string]> = [
			['disable', 'inactive'],
			['enable', 'active'],
			['archive', 'archived'],
			['unarchive', 'inactive'],
		];
		for (const [method, expectedStatus] of cases) {
			mockFetch({ ok: true });
			await (workflows[method] as (id: string) => Promise<void>)('wf_1');
			expect(calls[0]!.url).toBe(
				'https://hub.example/workflows/wf_1/status?tenantId=dev',
			);
			expect(calls[0]!.init.method).toBe('POST');
			expect(JSON.parse(calls[0]!.init.body).status).toBe(expectedStatus);
		}
	});

	it('workflows.rename(id, name) posts the name to /workflows/:id/rename', async () => {
		mockFetch({ ok: true });

		const workflows = buildWorkflowsNamespace(hub, 'dev');
		await workflows.rename('wf_1', 'New Name');

		expect(calls[0]!.url).toBe(
			'https://hub.example/workflows/wf_1/rename?tenantId=dev',
		);
		expect(JSON.parse(calls[0]!.init.body).name).toBe('New Name');
	});

	it('runs.list() calls GET /runs tenant-wide', async () => {
		mockFetch({ runs: [{ id: 'run_1' }, { id: 'run_2' }] });

		const runs = buildWorkflowsNamespace(hub, 'dev').runs;
		const all = await runs.list();

		expect(calls[0]!.url).toBe('https://hub.example/runs?tenantId=dev');
		expect(all.map((r) => r.id)).toEqual(['run_1', 'run_2']);
	});

	it('runs.get(id) calls GET /runs/:id', async () => {
		mockFetch({ run: { id: 'run_9', workflowId: 'wf_1' } });

		const runs = buildWorkflowsNamespace(hub, 'dev').runs;
		const run = await runs.get('run_9');

		expect(calls[0]!.url).toBe('https://hub.example/runs/run_9?tenantId=dev');
		expect(run.id).toBe('run_9');
	});

	it('runs.approve/deny/cancel POST to /runs/:id/:action', async () => {
		const runs = buildWorkflowsNamespace(hub, 'dev').runs;
		for (const action of ['approve', 'deny', 'cancel'] as const) {
			mockFetch({ ok: true });
			await runs[action]('run_9');
			expect(calls[0]!.url).toBe(
				`https://hub.example/runs/run_9/${action}?tenantId=dev`,
			);
			expect(calls[0]!.init.method).toBe('POST');
		}
	});
});
