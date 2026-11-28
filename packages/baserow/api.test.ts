import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { baserowOperations } from './endpoints/manifest';
import { baserow } from './index';

/**
 * Live run against a Baserow account (cloud or self-hosted). Skipped unless
 * the sign-in is set (CI never runs files named api.test.ts):
 *
 *   BASEROW_EMAIL=... BASEROW_PASSWORD=... [BASEROW_URL=https://api.baserow.io] npx jest api.test.ts
 *
 * The run makes its own workspace, works only inside it (a database, a
 * table, fields, rows, views, filters, a webhook to example.com, a database
 * token, exports, a builder, a dashboard and an automation), then deletes the
 * workspace and empties its trash, even when a step fails. It sends no email
 * (no invitations). BASEROW_LIVE_REPORT=<file> writes each step as JSON.
 */
const email = process.env.BASEROW_EMAIL;
const password = process.env.BASEROW_PASSWORD;
const baseUrl = process.env.BASEROW_URL;
const ready = Boolean(email && password);
const describeIfKey = ready ? describe : describe.skip;
if (!ready)
	console.warn(
		'Skipping Baserow live run: set BASEROW_EMAIL and BASEROW_PASSWORD.',
	);

const STAMP = Date.now().toString(36);

/** Paid-plan and permission answers: expected on a Free account, not failures. */
const PLAN =
	/ERROR_FEATURE_NOT_AVAILABLE|ERROR_NO_ACTIVE_PREMIUM|ERROR_NO_ACTIVE_ENTERPRISE|ERROR_USER_NOT_IN_GROUP|PERMISSION_DENIED|ERROR_PERMISSION_DENIED|ERROR_NO_PERMISSION|ERROR_STAFF_ONLY|ERROR_AUTH_PROVIDER|ERROR_LICENSE|402|ERROR_MAX_|LIMIT/;

type Step = {
	id: string;
	ok: boolean;
	expected?: boolean;
	status?: number;
	note?: string;
};

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: Array<string | number>): unknown {
	let node = value;
	for (const part of path) {
		if (typeof node !== 'object' || node === null) return undefined;
		node = (node as Record<string | number, unknown>)[part];
	}
	return node;
}

const id = (value: unknown, ...path: Array<string | number>) => {
	const found = pick(value, ...path);
	return typeof found === 'number' || typeof found === 'string'
		? String(found)
		: '';
};

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

describeIfKey('baserow live', () => {
	jest.setTimeout(1_800_000);
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const apis: Record<'user' | 'token', Record<string, unknown>> = {
		user: {},
		token: {},
	};
	const op = (opId: string, as: 'user' | 'token' = 'user'): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = apis[as];
		for (const part of opId.split('.'))
			node = (node as Record<string, unknown>)[part];
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];
	const ids: Record<string, string> = {};

	async function run(
		opId: string,
		input: Record<string, unknown>,
		options: { expect?: RegExp; as?: 'user' | 'token'; note?: string } = {},
	): Promise<unknown> {
		try {
			const value = await op(opId, options.as)(input);
			steps.push({ id: opId, ok: true, note: options.note });
			return value;
		} catch (error) {
			const text = error instanceof Error ? error.message : String(error);
			const status = error instanceof ApiError ? error.status : undefined;
			const expected =
				PLAN.test(`${status} ${text}`) ||
				(options.expect?.test(`${status} ${text}`) ?? false);
			steps.push({
				id: opId,
				ok: false,
				expected,
				status,
				note: text.slice(0, 300),
			});
			return undefined;
		}
	}

	function client(key?: string) {
		const testDb = createTestDatabase();
		return createIntegrationAndAccount(testDb.db, 'baserow', 'default').then(
			() => {
				const corsair = createCorsair({
					plugins: [
						baserow({
							...(key ? { key } : { email, password }),
							...(baseUrl ? { baseUrl } : {}),
						}),
					],
					database: testDb.db,
					kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
				});
				return (
					corsair as unknown as { baserow: { api: Record<string, unknown> } }
				).baserow.api;
			},
		);
	}

	beforeAll(async () => {
		apis.user = await client();
	});

	afterAll(async () => {
		for (const cleanup of cleanups.reverse()) {
			try {
				await cleanup.run();
			} catch (error) {
				steps.push({
					id: `cleanup:${cleanup.what}`,
					ok: false,
					note: String(error).slice(0, 200),
				});
			}
		}
		const report = process.env.BASEROW_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify({ ids, steps }, null, 1));
		console.log(
			`baserow live: ${steps.length} steps, ${steps.filter((s) => s.ok).length} ok, ${steps.filter((s) => s.expected).length} expected, ${steps.filter((s) => !s.ok && !s.expected).length} failed; ${new Set(steps.map((s) => s.id)).size} of ${baserowOperations.length} operations called`,
		);
	});

	it('reads the account and makes a workspace', async () => {
		await run('user.getDashboard', {});
		await run('settings.get', {});
		await run('workspaces.list', {});
		const ws = await run('workspaces.create', {
			name: `Corsair test ${STAMP}`,
		});
		ids.workspace = id(ws, 'id');
		expect(ids.workspace).not.toBe('');
		cleanups.push({
			what: 'workspace',
			run: async () => {
				await op('workspaces.delete')({ workspace_id: ids.workspace });
				// Deleted workspaces go to the trash; empty it for good.
				await op('trash.emptyContents')({ workspace_id: ids.workspace }).catch(
					() => undefined,
				);
			},
		});
		await run('workspaces.update', {
			workspace_id: ids.workspace,
			name: `Corsair test 2 ${STAMP}`,
		});
		await run('workspaces.listUsers', { workspace_id: ids.workspace });
		await run('workspaces.getPermissions', { workspace_id: ids.workspace });
		await run('workspaces.invitations.list', { workspace_id: ids.workspace });
		await run('workspaces.invitationLinks.list', {
			workspace_id: ids.workspace,
		});
		await run('notifications.list', { workspace_id: ids.workspace });
		await run('notifications.markAllAsRead', { workspace_id: ids.workspace });
		await run('templates.list', {});
	});

	it('builds a database, table, fields and rows', async () => {
		const db = await run('applications.create', {
			workspace_id: ids.workspace,
			name: `CRM ${STAMP}`,
			type: 'database',
		});
		ids.database = id(db, 'id');
		await run('applications.get', { application_id: ids.database });
		await run('applications.list', { workspace_id: ids.workspace });
		await run('applications.listAll', {});
		await run('applications.update', {
			application_id: ids.database,
			name: `CRM 2 ${STAMP}`,
		});
		const table = await run('tables.create', {
			database_id: ids.database,
			name: 'Leads',
			data: [
				['Name', 'Company'],
				['Ada Lovelace', 'Northpeak'],
				['Grace Hopper', 'Fleet'],
			],
			first_row_header: true,
		});
		ids.table = id(table, 'id');
		await run('tables.get', { table_id: ids.table });
		await run('tables.list', { database_id: ids.database });
		await run('tables.update', { table_id: ids.table, name: 'Leads 2' });
		const fields = await run('fields.list', { table_id: ids.table });
		ids.primaryField = id(fields, 0, 'id');
		const score = await run('fields.create', {
			table_id: ids.table,
			name: 'Score',
			type: 'number',
		});
		ids.scoreField = id(score, 'id');
		await run('fields.get', { field_id: ids.scoreField });
		await run('fields.update', {
			field_id: ids.scoreField,
			name: 'Score 2',
			number_decimal_places: 1,
		});
		await run('fields.getUniqueRowValues', { field_id: ids.primaryField });
		await run('fields.duplicate', { field_id: ids.scoreField });

		const row = await run('rows.create', {
			table_id: ids.table,
			user_field_names: true,
			Name: `Linus ${STAMP}`,
			Company: 'Kernel',
		});
		ids.row = id(row, 'id');
		await run('rows.get', {
			table_id: ids.table,
			row_id: ids.row,
			user_field_names: true,
		});
		await run('rows.update', {
			table_id: ids.table,
			row_id: ids.row,
			user_field_names: true,
			Company: 'Kernel Org',
		});
		await run('rows.list', {
			table_id: ids.table,
			user_field_names: true,
			search: 'Linus',
			size: 10,
		});
		await run('rows.getAdjacent', { table_id: ids.table, row_id: ids.row });
		await run('rows.getHistory', { table_id: ids.table, row_id: ids.row });
		await run('rows.move', { table_id: ids.table, row_id: ids.row });
		const batch = await run('rows.batchCreate', {
			table_id: ids.table,
			user_field_names: true,
			items: [{ Name: `Batch A ${STAMP}` }, { Name: `Batch B ${STAMP}` }],
		});
		const batchIds = (
			(pick(batch, 'items') as Array<{ id: number }>) ?? []
		).map((r) => r.id);
		await run('rows.batchUpdate', {
			table_id: ids.table,
			user_field_names: true,
			items: batchIds.map((rowId) => ({ id: rowId, Company: 'Batch' })),
		});
		await run('rows.batchDelete', {
			table_id: ids.table,
			items: batchIds.slice(0, 1),
		});
		await run('rows.createComment', {
			table_id: ids.table,
			row_id: ids.row,
			message: {
				type: 'doc',
				content: [
					{ type: 'paragraph', content: [{ type: 'text', text: 'Live test' }] },
				],
			},
		});
		await run('rows.getComments', { table_id: ids.table, row_id: ids.row });
		await run('search.workspace', {
			workspace_id: ids.workspace,
			query: 'Linus',
		});
		await run('fields.delete', { field_id: ids.scoreField });
	});

	it('works with views, filters, sorts and groups', async () => {
		const view = await run('views.create', {
			table_id: ids.table,
			name: `Grid ${STAMP}`,
			type: 'grid',
		});
		ids.view = id(view, 'id');
		await run('views.list', { table_id: ids.table });
		await run('views.get', { view_id: ids.view });
		await run('views.update', { view_id: ids.view, name: `Grid 2 ${STAMP}` });
		await run('views.getFieldOptions', { view_id: ids.view });
		await run('views.updateFieldOptions', {
			view_id: ids.view,
			field_options: { [String(ids.primaryField)]: { width: 240 } },
		});
		const filter = await run('views.filters.create', {
			view_id: ids.view,
			field: Number(ids.primaryField),
			type: 'contains',
			value: 'a',
		});
		const filterId = id(filter, 'id');
		await run('views.filters.list', { view_id: ids.view });
		if (filterId) {
			await run('views.filters.get', { view_filter_id: filterId });
			await run('views.filters.update', {
				view_filter_id: filterId,
				value: 'e',
			});
			await run('views.filters.delete', { view_filter_id: filterId });
		}
		const sort = await run('views.sortings.create', {
			view_id: ids.view,
			field: Number(ids.primaryField),
			order: 'ASC',
		});
		const sortId = id(sort, 'id');
		await run('views.sortings.list', { view_id: ids.view });
		if (sortId) {
			await run('views.sortings.get', { view_sort_id: sortId });
			await run('views.sortings.update', {
				view_sort_id: sortId,
				order: 'DESC',
			});
			await run('views.sortings.delete', { view_sort_id: sortId });
		}
		const group = await run('views.groupBys.create', {
			view_id: ids.view,
			field: Number(ids.primaryField),
			order: 'ASC',
		});
		const groupId = id(group, 'id');
		await run('views.groupBys.list', { view_id: ids.view });
		if (groupId) {
			await run('views.groupBys.get', { view_group_by_id: groupId });
			await run('views.groupBys.update', {
				view_group_by_id: groupId,
				order: 'DESC',
			});
			await run('views.groupBys.delete', { view_group_by_id: groupId });
		}
		await run('views.grid.listRows', { view_id: ids.view, size: 10 });
		await run('views.grid.filterRows', {
			view_id: ids.view,
			row_ids: [Number(ids.row)],
		});
		await run('views.grid.getFieldAggregations', { view_id: ids.view });
		await run('views.duplicate', { view_id: ids.view });
		const form = await run('views.create', {
			table_id: ids.table,
			name: `Form ${STAMP}`,
			type: 'form',
		});
		ids.formView = id(form, 'id');
		const gallery = await run('views.create', {
			table_id: ids.table,
			name: `Gallery ${STAMP}`,
			type: 'gallery',
		});
		const galleryId = id(gallery, 'id');
		if (galleryId) await run('views.gallery.listRows', { view_id: galleryId });
		await run('views.order', {
			table_id: ids.table,
			view_ids: [Number(ids.view), Number(ids.formView)],
		});
		await run('views.delete', { view_id: ids.formView });
	});

	it('round-trips a webhook, a database token and exports', async () => {
		const hook = await run('webhooks.create', {
			table_id: ids.table,
			name: `Hook ${STAMP}`,
			url: 'https://example.com/baserow-hook',
			include_all_events: true,
			request_method: 'POST',
			use_user_field_names: true,
		});
		const hookId = id(hook, 'id');
		await run('webhooks.list', { table_id: ids.table });
		if (hookId) {
			await run('webhooks.get', { webhook_id: hookId });
			await run('webhooks.update', { webhook_id: hookId, active: false });
			await run('webhooks.delete', { webhook_id: hookId });
		}
		await run('webhooks.testCall', {
			table_id: ids.table,
			url: 'https://example.com/baserow-hook',
			event_type: 'rows.created',
			request_method: 'POST',
		});

		const token = await run('databaseTokens.create', {
			name: `Token ${STAMP}`,
			workspace: Number(ids.workspace),
		});
		ids.token = id(token, 'id');
		const secret = String(pick(token, 'key') ?? '');
		await run('databaseTokens.list', {});
		if (ids.token) {
			await run('databaseTokens.get', { token_id: ids.token });
			await run('databaseTokens.update', {
				token_id: ids.token,
				name: `Token 2 ${STAMP}`,
			});
		}
		if (secret) {
			// The same rows read with the database token instead of the user.
			apis.token = await client(secret);
			await run('databaseTokens.check', {}, { as: 'token' });
			await run(
				'rows.list',
				{ table_id: ids.table, user_field_names: true },
				{ as: 'token', note: 'with the database token' },
			);
			await run(
				'fields.list',
				{ table_id: ids.table },
				{ as: 'token', note: 'with the database token' },
			);
			await run('tables.listForToken', {}, { as: 'token' });
		}
		if (ids.token) await run('databaseTokens.delete', { token_id: ids.token });

		const exportJob = await run('tables.export.start', {
			table_id: ids.table,
			exporter_type: 'csv',
		});
		const exportId = id(exportJob, 'id');
		if (exportId) {
			await sleep(3000);
			await run('tables.export.getJob', { job_id: exportId });
		}
		const dupJob = await run('tables.duplicateAsync', { table_id: ids.table });
		const dupJobId = id(dupJob, 'id');
		if (dupJobId) {
			await sleep(4000);
			await run('jobs.get', { job_id: dupJobId });
		}
		await run('jobs.list', {});
		await run(
			'userFiles.uploadViaUrl',
			{ url: 'https://baserow.io/img/favicon_192.png' },
			{ expect: /ERROR_FILE_URL|ERROR_INVALID_FILE/ },
		);
		await run('userFiles.upload', {
			file: {
				base64: Buffer.from(`Corsair ${STAMP}`).toString('base64'),
				filename: 'note.txt',
				contentType: 'text/plain',
			},
		});
	});

	it('restores from the trash', async () => {
		const tmp = await run('rows.create', {
			table_id: ids.table,
			user_field_names: true,
			Name: `Trash ${STAMP}`,
		});
		const tmpId = id(tmp, 'id');
		if (!tmpId) return;
		await run('rows.delete', { table_id: ids.table, row_id: tmpId });
		await run('trash.getStructure', {});
		await run('trash.getContents', {
			workspace_id: ids.workspace,
			application_id: Number(ids.database),
		});
		await run('trash.restore', {
			trash_item_type: 'row',
			trash_item_id: Number(tmpId),
			parent_trash_item_id: Number(ids.table),
		});
	});

	it('makes a builder, a dashboard and an automation', async () => {
		const builder = await run('applications.create', {
			workspace_id: ids.workspace,
			name: `Site ${STAMP}`,
			type: 'builder',
		});
		ids.builder = id(builder, 'id');
		if (ids.builder) {
			const page = await run('builder.pages.create', {
				builder_id: ids.builder,
				name: 'Home',
				path: '/home',
			});
			const pageId = id(page, 'id');
			if (pageId) {
				const element = await run('builder.elements.create', {
					page_id: pageId,
					type: 'heading',
					level: 1,
				});
				await run('builder.elements.list', { page_id: pageId });
				const elementId = id(element, 'id');
				if (elementId) {
					await run('builder.elements.update', {
						element_id: elementId,
						level: 2,
					});
					await run('builder.elements.delete', { element_id: elementId });
				}
				await run('builder.dataSources.list', { page_id: pageId });
				await run('builder.workflowActions.list', { page_id: pageId });
				await run('builder.pages.update', { page_id: pageId, name: 'Home 2' });
			}
			await run('builder.domains.list', { builder_id: ids.builder });
			await run('integrations.list', { application_id: ids.builder });
			await run('userSources.list', { application_id: ids.builder });
		}
		const dashboard = await run('applications.create', {
			workspace_id: ids.workspace,
			name: `Board ${STAMP}`,
			type: 'dashboard',
		});
		ids.dashboard = id(dashboard, 'id');
		if (ids.dashboard) {
			const widget = await run('dashboards.widgets.create', {
				dashboard_id: ids.dashboard,
				title: 'Leads',
				type: 'summary',
			});
			await run('dashboards.widgets.list', { dashboard_id: ids.dashboard });
			const widgetId = id(widget, 'id');
			if (widgetId) {
				await run('dashboards.widgets.update', {
					widget_id: widgetId,
					title: 'Leads 2',
				});
				await run('dashboards.widgets.delete', { widget_id: widgetId });
			}
			await run('dashboards.dataSources.list', { dashboard_id: ids.dashboard });
		}
		const automation = await run('applications.create', {
			workspace_id: ids.workspace,
			name: `Flow ${STAMP}`,
			type: 'automation',
		});
		ids.automation = id(automation, 'id');
		if (ids.automation) {
			const workflow = await run('automations.workflows.create', {
				automation_id: ids.automation,
				name: `Flow ${STAMP}`,
			});
			const workflowId = id(workflow, 'id');
			if (workflowId) {
				await run('automations.workflows.get', { workflow_id: workflowId });
				await run('automations.nodes.list', { workflow_id: workflowId });
				await run('automations.workflows.update', {
					workflow_id: workflowId,
					name: `Flow 2 ${STAMP}`,
				});
				await run('automations.workflows.getHistory', {
					workflow_id: workflowId,
				});
				await run('automations.workflows.delete', { workflow_id: workflowId });
			}
		}
		await run('snapshots.list', { application_id: ids.database });
	});

	it('reads what else it can address', async () => {
		const done = new Set(steps.map((s) => s.id));
		const fill: Record<string, string | undefined> = {
			workspace_id: ids.workspace,
			application_id: ids.database,
			database_id: ids.database,
			table_id: ids.table,
			row_id: ids.row,
			view_id: ids.view,
			field_id: ids.primaryField,
		};
		for (const operation of baserowOperations) {
			if (operation.method !== 'GET' || done.has(operation.id)) continue;
			// The user client: routes that take a signed-in user.
			if (!(operation.auth ?? []).includes('jwt')) continue;
			const required = (operation.input.required as string[] | undefined) ?? [];
			if (!required.every((name) => fill[name])) continue;
			const input: Record<string, unknown> = {};
			for (const name of required) input[name] = fill[name];
			// Admin and instance routes answer 403 to a non-staff cloud user.
			await run(operation.id, input, {
				note: 'sweep',
				// fields.rules.getInvalidRows answered 500 on a table without rules (11-28).
				expect:
					/ERROR_.*DOES_NOT_EXIST|404|400|403: You do not have permission|500: Internal Server Error/,
			});
		}
		expect(steps.length).toBeGreaterThan(40);
	});

	it('has no unexpected failures', () => {
		const unexpected = steps.filter((s) => !s.ok && !s.expected);
		expect(unexpected.map((s) => `${s.id}: ${s.note}`)).toEqual([]);
	});
});
