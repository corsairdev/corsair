import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moco } from './index';

/**
 * Live run against a MOCO account. Skipped unless MOCO_API_KEY and
 * MOCO_SUBDOMAIN are set (CI never runs files named api.test.ts).
 *
 *   MOCO_API_KEY=... MOCO_SUBDOMAIN=... npx jest api.test.ts
 *
 * Every resource family's list (and get, where a record exists), then
 * create/update/delete round trips on made-up records: example.com companies
 * and contacts, a test project with tasks, contracts, expenses and payment
 * schedules, activities, a draft offer and a draft invoice, uploads, payments,
 * approvals and the bulk routes. Everything created is deleted at the end,
 * even when a step fails (about 7 minutes: MOCO allows 120 requests per 2
 * minutes, so calls are spaced about 1 s apart).
 *
 * Never run here: anything that emails (invoices/offers/invoiceReminders
 * sendEmail), users.create (adds a billed seat and sends a welcome email),
 * users.delete, and bookkeeping exports (they lock what they export).
 * Not reachable on a trial account: invoice status changes, invoice payments
 * and reminders (403 while invoices stay drafts), receipts.create (403), and
 * project groups, purchase categories and todos (none exist; no create route).
 */
const apiKey = process.env.MOCO_API_KEY;
const subdomain = process.env.MOCO_SUBDOMAIN;
const describeIfKey = apiKey && subdomain ? describe : describe.skip;

if (!apiKey || !subdomain) {
	const missing = [!apiKey && 'MOCO_API_KEY', !subdomain && 'MOCO_SUBDOMAIN']
		.filter(Boolean)
		.join(', ');
	console.warn(`Skipping MOCO live run: set ${missing}.`);
}

const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = Number(TODAY.slice(0, 4));
const LATER = `${YEAR + 1}-06-15`;
const NAME = 'corsair-plugin-test';

/** A one-page PDF, for the upload routes. */
const TINY_PDF = Buffer.from(
	'%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 72 72]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n',
).toString('base64');

// `unknown` because the bulk and upload routes answer a record, a list or `{ items }`.
function firstOf(value: unknown): unknown {
	if (Array.isArray(value)) return value[0];
	if (typeof value === 'object' && value !== null && 'items' in value) {
		const items = (value as { items?: unknown }).items;
		return Array.isArray(items) ? items[0] : undefined;
	}
	return undefined;
}

// `unknown` because the value is any parsed response.
function idOf(value: unknown): number | undefined {
	return typeof value === 'object' && value !== null && 'id' in value
		? typeof (value as { id?: unknown }).id === 'number'
			? (value as { id: number }).id
			: undefined
		: undefined;
}

/** Every record id in a list, `{ items }` or single-record answer. */
// `unknown` because the value is any parsed response.
function idsIn(value: unknown): number[] {
	const list = Array.isArray(value)
		? value
		: typeof value === 'object' &&
				value !== null &&
				Array.isArray((value as { items?: unknown }).items)
			? (value as { items: unknown[] }).items
			: [value];
	return list.map(idOf).filter((id): id is number => id !== undefined);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moco', 'default');
	const corsair = createCorsair({
		plugins: [moco({ key: apiKey, subdomain })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>['corsair'];

describeIfKey('moco live', () => {
	jest.setTimeout(60_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const api = () => (client as NonNullable<typeof client>).corsair.moco.api;
	const ids: Record<string, number> = {};
	/** Cleanups, run last-in first-out in afterAll. */
	const cleanups: Array<{
		what: string;
		run: (c: Client) => Promise<unknown>;
	}> = [];
	const cleanup = (what: string, run: (c: Client) => Promise<unknown>) =>
		cleanups.push({ what, run });
	const need = (name: string): number => {
		const id = ids[name];
		if (typeof id !== 'number')
			throw new Error(`no ${name} from an earlier step`);
		return id;
	};

	// MOCO allows 120 requests per 2 minutes: keep the run near 1 per second.
	const realFetch = globalThis.fetch;
	let last = 0;
	const seen429: string[] = [];

	beforeAll(async () => {
		globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
			const wait = last + 1050 - Date.now();
			if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
			last = Date.now();
			const response = await realFetch(...args);
			if (response.status === 429) {
				seen429.push(`retry-after=${response.headers.get('retry-after')}`);
			}
			return response;
		}) as typeof fetch;
		client = await createClient();
	});

	afterAll(async () => {
		if (!client) return;
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			try {
				await item.run(client.corsair);
			} catch (error) {
				left.push(`${item.what}: ${(error as Error).message}`);
			}
		}
		if (left.length > 0) console.warn(`MOCO cleanup left:\n${left.join('\n')}`);
		if (seen429.length > 0) console.warn(`MOCO 429s: ${seen429.join(', ')}`);
		globalThis.fetch = realFetch;
		client.testDb.cleanup();
	}, 300_000);

	// ── Reads ────────────────────────────────────────────────────────────────

	it('session.verify', async () => {
		const me = await api().session.verify({});
		expect(typeof me.id).toBe('number');
		ids.me = me.id as number;
	});

	it('profile.get + profile.performanceReport', async () => {
		const profile = await api().profile.get({});
		expect(profile.id).toBe(need('me'));
		const report = await api().profile.performanceReport({ year: YEAR });
		expect(report).toBeDefined();
	});

	it('users.list + get + performanceReport + roles.list', async () => {
		const users = await api().users.list({});
		expect(users.items.length).toBeGreaterThan(0);
		const user = await api().users.get({ id: need('me') });
		expect(user.id).toBe(need('me'));
		await api().users.performanceReport({ id: need('me'), year: YEAR });
		// Not paged: MOCO returns every role in one array.
		const roles = await api().users.roles.list({});
		expect(Array.isArray(roles)).toBe(true);
	});

	it('users.employments / holidays / presences / workTimeAdjustments / absenceRequests list', async () => {
		const employments = await api().users.employments.list({});
		if (employments.items[0]?.id) {
			await api().users.employments.get({ id: employments.items[0].id });
		}
		await api().users.holidays.list({ year: YEAR });
		await api().users.presences.list({});
		await api().users.workTimeAdjustments.list({});
		await api().users.absenceRequests.list({});
	});

	it('units.list + get', async () => {
		const units = await api().units.list({});
		const first = units.items[0];
		expect(first?.id).toBeDefined();
		await api().units.get({ id: first?.id as number });
	});

	it('vatCodeSales / vatCodePurchases list + get', async () => {
		const sales = await api().vatCodeSales.list({});
		const sale =
			sales.items.find((code) => code.tax === 0 && !code.reverse_charge) ??
			sales.items[0];
		ids.vatSale = sale?.id as number;
		await api().vatCodeSales.get({ id: need('vatSale') });
		const purchases = await api().vatCodePurchases.list({});
		ids.vatPurchase = purchases.items[0]?.id as number;
		await api().vatCodePurchases.get({ id: need('vatPurchase') });
	});

	it('companies / contacts / deals / dealCategories list', async () => {
		await api().companies.list({});
		await api().contacts.list({});
		await api().deals.list({});
		const categories = await api().dealCategories.list({});
		ids.dealCategory = categories.items[0]?.id as number;
		await api().dealCategories.get({ id: need('dealCategory') });
	});

	it('projects list / listAssigned / groups / expenses.listAll / paymentSchedules.listAll', async () => {
		const projects = await api().projects.list({});
		expect(projects.items.length).toBeGreaterThan(0);
		await api().projects.listAssigned({});
		await api().projects.groups.list({});
		await api().projects.expenses.listAll({});
		await api().projects.paymentSchedules.listAll({});
		await api().recurringExpenses.list({});
	});

	it('activities / schedules / planningEntries / comments / todos list', async () => {
		await api().activities.list({ from: `${YEAR}-01-01`, to: TODAY });
		await api().schedules.list({});
		await api().planningEntries.list({});
		await api().comments.list({});
		await api().todos.list({});
	});

	it('invoices list / listLocked / payments / bookkeepingExports / reminders', async () => {
		await api().invoices.list({});
		await api().invoices.listLocked({});
		await api().invoices.payments.list({});
		await api().invoices.bookkeepingExports.list({});
		await api().invoiceReminders.list({});
	});

	it('offers / offerConfirmations list', async () => {
		await api().offers.list({});
		await api().offerConfirmations.list({});
	});

	it('purchases list / drafts / payments / budgets / categories / bookkeepingExports, receipts, plannedPurchases', async () => {
		await api().purchases.list({});
		await api().purchases.drafts.list({});
		await api().purchases.payments.list({});
		await api().purchases.budgets.list({});
		await api().purchases.categories.list({});
		await api().purchases.bookkeepingExports.list({});
		await api().receipts.list({});
		await api().plannedPurchases.list({});
	});

	it('tags / letterPapers / revenueCategories / approvals list', async () => {
		await api().tags.list({});
		await api().letterPapers.list({});
		await api().revenueCategories.list({});
		await api().approvals.list({});
	});

	it('account settings reads', async () => {
		await api().account.catalogServices.list({});
		await api().account.customProperties.list({});
		await api().account.expenseTemplates.list({});
		await api().account.fixedCosts.list({});
		const rates = await api().account.hourlyRates.get({});
		expect(rates).toBeDefined();
		await api().account.internalHourlyRates.get({});
		const templates = await api().account.taskTemplates.list({});
		if (templates.items[0]?.id) {
			await api().account.taskTemplates.get({ id: templates.items[0].id });
		}
		await api().account.webHooks.list({});
	});

	it('reports', async () => {
		await api().reports.absences({ year: YEAR });
		await api().reports.cashflow({ from: `${YEAR}-01-01`, to: TODAY });
		await api().reports.finance({ from: `${YEAR}-01-01`, to: TODAY });
		await api().reports.plannedVsTracked({ from: `${YEAR}-01-01`, to: TODAY });
		await api().reports.utilization({ from: `${YEAR}-11-01`, to: TODAY });
	});

	// ── Round trips ──────────────────────────────────────────────────────────

	it('companies create / get / update / archive / unarchive', async () => {
		const company = await api().companies.create({
			type: 'customer',
			name: `${NAME} customer`,
			website: 'https://example.com',
			email: 'billing@example.com',
			currency: 'USD',
			country_code: 'US',
		});
		ids.company = company.id as number;
		cleanup('company', (c) =>
			c.moco.api.companies.delete({ id: need('company') }),
		);
		const read = await api().companies.get({ id: need('company') });
		expect(read.name).toBe(`${NAME} customer`);
		const updated = await api().companies.update({
			id: need('company'),
			info: 'updated by the corsair live run',
		});
		expect(updated.info).toBe('updated by the corsair live run');
		await api().companies.archive({ id: need('company') });
		await api().companies.unarchive({ id: need('company') });
	});

	it('contacts create / get / update', async () => {
		const contact = await api().contacts.create({
			firstname: 'Ada',
			lastname: NAME,
			gender: 'U',
			work_email: 'ada@example.com',
			company_id: need('company'),
		});
		ids.contact = contact.id as number;
		cleanup('contact', (c) =>
			c.moco.api.contacts.delete({ id: need('contact') }),
		);
		const read = await api().contacts.get({ id: need('contact') });
		expect(read.lastname).toBe(NAME);
		await api().contacts.update({
			id: need('contact'),
			job_position: 'Tester',
		});
	});

	it('tags create / get / update, taggings add / list / replace / remove', async () => {
		const tag = await api().tags.create({ name: NAME, context: 'Company' });
		ids.tag = tag.id as number;
		cleanup('tag', (c) => c.moco.api.tags.delete({ id: need('tag') }));
		await api().tags.get({ id: need('tag') });
		await api().tags.update({ id: need('tag'), name: `${NAME}-2` });
		const target = { taggable_type: 'Company', taggable_id: need('company') };
		await api().taggings.add({ ...target, tags: [`${NAME}-2`] });
		const tags = await api().taggings.list(target);
		expect(JSON.stringify(tags)).toContain(`${NAME}-2`);
		await api().taggings.replace({ ...target, tags: [`${NAME}-2`] });
		await api().taggings.remove({ ...target, tags: [`${NAME}-2`] });
	});

	it('dealCategories + deals create / get / update', async () => {
		const category = await api().dealCategories.create({
			name: NAME,
			probability: 50,
		});
		ids.newDealCategory = category.id as number;
		cleanup('dealCategory', (c) =>
			c.moco.api.dealCategories.delete({ id: need('newDealCategory') }),
		);
		await api().dealCategories.update({
			id: need('newDealCategory'),
			probability: 55,
		});
		const deal = await api().deals.create({
			name: `${NAME} deal`,
			currency: 'USD',
			money: 1000,
			reminder_date: LATER,
			user_id: need('me'),
			deal_category_id: need('newDealCategory'),
			company_id: need('company'),
		});
		ids.deal = deal.id as number;
		cleanup('deal', (c) => c.moco.api.deals.delete({ id: need('deal') }));
		await api().deals.get({ id: need('deal') });
		await api().deals.update({ id: need('deal'), money: 1200 });
	});

	it('projects create / get / update / report / archive / unarchive / share / disableShare', async () => {
		const project = await api().projects.create({
			name: `${NAME} project`,
			currency: 'USD',
			start_date: TODAY,
			finish_date: LATER,
			fixed_price: false,
			retainer: false,
			leader_id: need('me'),
			customer_id: need('company'),
			billing_variant: 'project',
			hourly_rate: 100,
		});
		ids.project = project.id as number;
		cleanup('project', (c) =>
			c.moco.api.projects.delete({ id: need('project') }),
		);
		await api().projects.get({ id: need('project') });
		await api().projects.update({
			id: need('project'),
			info: 'corsair live run',
		});
		await api().projects.report({ id: need('project') });
		await api().projects.share({ id: need('project') });
		await api().projects.disableShare({ id: need('project') });
		await api().projects.archive({ id: need('project') });
		await api().projects.unarchive({ id: need('project') });
	});

	it('projects.tasks create / get / update / list', async () => {
		const task = await api().projects.tasks.create({
			project_id: need('project'),
			name: `${NAME} task`,
			billable: true,
		});
		ids.task = task.id as number;
		cleanup('task', (c) =>
			c.moco.api.projects.tasks.delete({
				project_id: need('project'),
				id: need('task'),
			}),
		);
		await api().projects.tasks.get({
			project_id: need('project'),
			id: need('task'),
		});
		await api().projects.tasks.update({
			project_id: need('project'),
			id: need('task'),
			description: 'updated',
		});
		const tasks = await api().projects.tasks.list({
			project_id: need('project'),
		});
		expect(tasks.items.some((item) => item.id === need('task'))).toBe(true);
	});

	it('projects.contracts list / get / update', async () => {
		const contracts = await api().projects.contracts.list({
			project_id: need('project'),
		});
		// The leader gets a contract when the project is created.
		const mine =
			contracts.items.find((item) => item.user_id === need('me')) ??
			contracts.items[0];
		if (mine?.id) {
			await api().projects.contracts.get({
				project_id: need('project'),
				id: mine.id,
			});
			await api().projects.contracts.update({
				project_id: need('project'),
				id: mine.id,
				hourly_rate: 110,
			});
		} else {
			const contract = await api().projects.contracts.create({
				project_id: need('project'),
				user_id: need('me'),
				hourly_rate: 110,
			});
			ids.contract = contract.id as number;
			cleanup('contract', (c) =>
				c.moco.api.projects.contracts.delete({
					project_id: need('project'),
					id: need('contract'),
				}),
			);
		}
	});

	it('projects.expenses create / get / update', async () => {
		const expense = await api().projects.expenses.create({
			project_id: need('project'),
			date: TODAY,
			title: `${NAME} expense`,
			quantity: 2,
			unit: 'pcs',
			unit_price: 10,
			unit_cost: 5,
		});
		ids.expense = expense.id as number;
		cleanup('expense', (c) =>
			c.moco.api.projects.expenses.delete({
				project_id: need('project'),
				id: need('expense'),
			}),
		);
		await api().projects.expenses.get({
			project_id: need('project'),
			id: need('expense'),
		});
		await api().projects.expenses.update({
			project_id: need('project'),
			id: need('expense'),
			quantity: 3,
		});
		await api().projects.expenses.list({ project_id: need('project') });
	});

	it('projects.paymentSchedules create / get / update', async () => {
		const schedule = await api().projects.paymentSchedules.create({
			project_id: need('project'),
			date: LATER,
			net_total: 500,
			title: `${NAME} milestone`,
		});
		ids.paymentSchedule = schedule.id as number;
		cleanup('paymentSchedule', (c) =>
			c.moco.api.projects.paymentSchedules.delete({
				project_id: need('project'),
				id: need('paymentSchedule'),
			}),
		);
		await api().projects.paymentSchedules.get({
			project_id: need('project'),
			id: need('paymentSchedule'),
		});
		await api().projects.paymentSchedules.update({
			project_id: need('project'),
			id: need('paymentSchedule'),
			net_total: 600,
		});
		await api().projects.paymentSchedules.list({ project_id: need('project') });
	});

	it('projects.recurringExpenses create / get / update', async () => {
		const recurring = await api().projects.recurringExpenses.create({
			project_id: need('project'),
			start_date: LATER,
			period: 'monthly',
			title: `${NAME} hosting`,
			quantity: 1,
			unit: 'month',
			unit_price: 20,
			unit_cost: 10,
		});
		ids.recurring = recurring.id as number;
		cleanup('recurringExpense', (c) =>
			c.moco.api.projects.recurringExpenses.delete({
				project_id: need('project'),
				id: need('recurring'),
			}),
		);
		await api().projects.recurringExpenses.get({
			project_id: need('project'),
			id: need('recurring'),
		});
		await api().projects.recurringExpenses.update({
			project_id: need('project'),
			id: need('recurring'),
			unit_price: 25,
		});
		await api().projects.recurringExpenses.list({
			project_id: need('project'),
		});
	});

	it('activities create / get / update / billable seconds / timer', async () => {
		const activity = await api().activities.create({
			date: TODAY,
			project_id: need('project'),
			task_id: need('task'),
			seconds: 1800,
			description: `${NAME} activity`,
		});
		ids.activity = activity.id as number;
		// MOCO answers 403 to deleting an activity whose billable seconds differ
		// from its worked seconds, so they are set back to match first.
		cleanup('activity', async (c) => {
			const current = await c.moco.api.activities.get({ id: need('activity') });
			await c.moco.api.activities.updateBillableSeconds({
				id: need('activity'),
				seconds: current.worked_seconds as number,
			});
			return c.moco.api.activities.delete({ id: need('activity') });
		});
		await api().activities.get({ id: need('activity') });
		await api().activities.update({ id: need('activity'), seconds: 3600 });
		await api().activities.startTimer({ id: need('activity') });
		await api().activities.stopTimer({ id: need('activity') });
		const adjusted = await api().activities.updateBillableSeconds({
			id: need('activity'),
			seconds: 1800,
		});
		expect(adjusted.seconds).toBe(1800);
	});

	it('comments create / get / update', async () => {
		const comment = await api().comments.create({
			commentable_type: 'Project',
			commentable_id: need('project'),
			text: `<p>${NAME} comment</p>`,
		});
		ids.comment = comment.id as number;
		cleanup('comment', (c) =>
			c.moco.api.comments.delete({ id: need('comment') }),
		);
		await api().comments.get({ id: need('comment') });
		await api().comments.update({
			id: need('comment'),
			text: '<p>updated</p>',
		});
	});

	it('planningEntries create / get / update', async () => {
		const entry = await api().planningEntries.create({
			project_id: need('project'),
			user_id: need('me'),
			starts_on: LATER,
			ends_on: LATER,
			hours_per_day: 2,
		});
		ids.planning = entry.id as number;
		cleanup('planningEntry', (c) =>
			c.moco.api.planningEntries.delete({ id: need('planning') }),
		);
		await api().planningEntries.get({ id: need('planning') });
		await api().planningEntries.update({
			id: need('planning'),
			hours_per_day: 3,
		});
	});

	it('schedules create / get / update', async () => {
		const schedule = await api().schedules.create({
			date: LATER,
			absence_code: '4',
			am: true,
			pm: false,
			comment: NAME,
		});
		ids.schedule = schedule.id as number;
		cleanup('schedule', (c) =>
			c.moco.api.schedules.delete({ id: need('schedule') }),
		);
		await api().schedules.get({ id: need('schedule') });
		await api().schedules.update({ id: need('schedule'), pm: true });
	});

	it('users.presences create / get / update', async () => {
		const presence = await api().users.presences.create({
			date: TODAY,
			from: '07:00',
			to: '07:30',
		});
		ids.presence = presence.id as number;
		cleanup('presence', (c) =>
			c.moco.api.users.presences.delete({ id: need('presence') }),
		);
		await api().users.presences.get({ id: need('presence') });
		await api().users.presences.update({ id: need('presence'), to: '07:45' });
	});

	it('users.holidays create / get / update', async () => {
		const holiday = await api().users.holidays.create({
			user_id: need('me'),
			year: YEAR + 1,
			title: NAME,
			days: 1,
		});
		ids.holiday = holiday.id as number;
		cleanup('holiday', (c) =>
			c.moco.api.users.holidays.delete({ id: need('holiday') }),
		);
		await api().users.holidays.get({ id: need('holiday') });
		await api().users.holidays.update({ id: need('holiday'), days: 2 });
	});

	it('users.workTimeAdjustments create / get / update', async () => {
		const adjustment = await api().users.workTimeAdjustments.create({
			user_id: need('me'),
			date: TODAY,
			description: NAME,
			hours: 1,
		});
		ids.adjustment = adjustment.id as number;
		cleanup('workTimeAdjustment', (c) =>
			c.moco.api.users.workTimeAdjustments.delete({ id: need('adjustment') }),
		);
		await api().users.workTimeAdjustments.get({ id: need('adjustment') });
		await api().users.workTimeAdjustments.update({
			id: need('adjustment'),
			hours: 2,
		});
	});

	it('offers create (draft) / get / getPdf / update / customerApproval / attachments.list', async () => {
		const offer = await api().offers.create({
			company_id: need('company'),
			project_id: need('project'),
			title: `${NAME} offer`,
			recipient_address: 'Example Inc.\n1 Example St\nExample City',
			date: TODAY,
			due_date: LATER,
			currency: 'USD',
			tax: 0,
			vat_code_id: need('vatSale'),
			items: [
				{ type: 'title', title: 'Work' },
				{
					type: 'item',
					title: 'Consulting',
					quantity: 2,
					unit: 'h',
					unit_price: 100,
				},
			],
		});
		ids.offer = offer.id as number;
		cleanup('offer', async (c) => {
			// MOCO deletes an offer only in status created.
			await c.moco.api.offers.updateStatus({
				id: need('offer'),
				status: 'created',
			});
			return c.moco.api.offers.delete({ id: need('offer') });
		});
		await api().offers.get({ id: need('offer') });
		const pdf = await api().offers.getPdf({ id: need('offer') });
		expect(JSON.stringify(pdf)).toContain('pdf');
		await api().offers.update({ id: need('offer'), title: `${NAME} offer v2` });
		await api()
			.offers.customerApproval.get({ offer_id: need('offer') })
			.catch((error) => {
				// 404 until approval was activated once.
				if (!/404/.test((error as Error).message)) throw error;
			});
		await api().offers.attachments.list({ offer_id: need('offer') });
	});

	it('invoices create (draft) / get / getPdf / timesheet / expenses / attachments.list', async () => {
		const invoice = await api().invoices.create({
			status: 'draft',
			customer_id: need('company'),
			project_id: need('project'),
			recipient_address: 'Example Inc.\n1 Example St\nExample City',
			date: TODAY,
			due_date: LATER,
			title: `${NAME} invoice`,
			currency: 'USD',
			tax: 0,
			vat_code_id: need('vatSale'),
			items: [
				{
					type: 'item',
					title: 'Consulting',
					quantity: 1,
					unit: 'h',
					unit_price: 100,
				},
			],
		});
		ids.invoice = invoice.id as number;
		cleanup('invoice', (c) =>
			c.moco.api.invoices.delete({ id: need('invoice') }),
		);
		const read = await api().invoices.get({ id: need('invoice') });
		expect(read.status).toBe('draft');
		const pdf = await api().invoices.getPdf({ id: need('invoice') });
		expect(JSON.stringify(pdf)).toContain('pdf');
		await api().invoices.getTimesheet({ id: need('invoice') });
		await api().invoices.listExpenses({ id: need('invoice') });
		await api().invoices.attachments.list({ invoice_id: need('invoice') });
	});

	it('purchases create / get / update', async () => {
		const purchase = await api().purchases.create({
			date: TODAY,
			currency: 'USD',
			payment_method: 'bank_transfer',
			title: `${NAME} purchase`,
			items: [
				{
					title: 'Test item',
					total: 10,
					tax: 0,
					tax_included: true,
					vat_code_id: need('vatPurchase'),
				},
			],
		});
		ids.purchase = purchase.id as number;
		cleanup('purchase', (c) =>
			c.moco.api.purchases.delete({ id: need('purchase') }),
		);
		await api().purchases.get({ id: need('purchase') });
		await api().purchases.update({
			id: need('purchase'),
			info: 'corsair live run',
		});
	});

	// receipts.create answers 403 with no body on the trial account (the
	// expense-receipt feature isn't in it); receipts.list works.
	it.skip('receipts create / get / update', async () => {
		const receipt = await api().receipts.create({
			date: TODAY,
			title: `${NAME} receipt`,
			currency: 'USD',
			items: [{ vat_code_id: need('vatPurchase'), gross_total: 12 }],
		});
		ids.receipt = receipt.id as number;
		cleanup('receipt', (c) =>
			c.moco.api.receipts.delete({ id: need('receipt') }),
		);
		await api().receipts.get({ id: need('receipt') });
		await api().receipts.update({
			id: need('receipt'),
			info: 'corsair live run',
		});
	});

	it('purchases.budgets create / update / updateTarget', async () => {
		const budget = await api().purchases.budgets.create({
			title: NAME,
			active: true,
		});
		ids.budget = budget.id as number;
		// MOCO refuses to delete a budget with a stored target (422 "Budgets are
		// stored for <year>") until the target is set back to 0.
		cleanup('budget', async (c) => {
			await c.moco.api.purchases.budgets.updateTarget({
				id: need('budget'),
				year: YEAR,
				target_amount: 0,
			});
			return c.moco.api.purchases.budgets.delete({ id: need('budget') });
		});
		await api().purchases.budgets.update({
			id: need('budget'),
			title: `${NAME}-2`,
		});
		await api().purchases.budgets.updateTarget({
			id: need('budget'),
			year: YEAR,
			target_amount: 1000,
		});
	});

	it('plannedPurchases create / get / update', async () => {
		const planned = await api().plannedPurchases.create({
			date: LATER,
			title: NAME,
			net_total: 50,
			currency: 'USD',
			frequency: 'once',
			user_id: need('me'),
		});
		ids.planned = planned.id as number;
		cleanup('plannedPurchase', (c) =>
			c.moco.api.plannedPurchases.delete({ id: need('planned') }),
		);
		await api().plannedPurchases.get({ id: need('planned') });
		await api().plannedPurchases.update({ id: need('planned'), net_total: 60 });
	});

	it('units / revenueCategories create / get / update', async () => {
		const unit = await api().units.create({ name: NAME });
		ids.unit = unit.id as number;
		cleanup('unit', (c) => c.moco.api.units.delete({ id: need('unit') }));
		await api().units.update({ id: need('unit'), name: `${NAME}-2` });
		const category = await api().revenueCategories.create({
			name: NAME,
			revenue_account: 4000,
			assignment_kind: 'tasks_and_expenses',
		});
		ids.revenueCategory = category.id as number;
		cleanup('revenueCategory', (c) =>
			c.moco.api.revenueCategories.delete({ id: need('revenueCategory') }),
		);
		await api().revenueCategories.get({ id: need('revenueCategory') });
		await api().revenueCategories.update({
			id: need('revenueCategory'),
			name: `${NAME}-2`,
		});
	});

	it('account task / expense templates, custom property, catalog service create / get / update', async () => {
		const task = await api().account.taskTemplates.create({
			name: NAME,
			billable: true,
		});
		ids.taskTemplate = task.id as number;
		cleanup('taskTemplate', (c) =>
			c.moco.api.account.taskTemplates.delete({ id: need('taskTemplate') }),
		);
		await api().account.taskTemplates.update({
			id: need('taskTemplate'),
			name: `${NAME}-2`,
		});

		const expense = await api().account.expenseTemplates.create({
			title: NAME,
			unit: 'pcs',
			unit_price: 10,
			unit_cost: 5,
			currency: 'USD',
		});
		ids.expenseTemplate = expense.id as number;
		cleanup('expenseTemplate', (c) =>
			c.moco.api.account.expenseTemplates.delete({
				id: need('expenseTemplate'),
			}),
		);
		await api().account.expenseTemplates.get({ id: need('expenseTemplate') });
		await api().account.expenseTemplates.update({
			id: need('expenseTemplate'),
			unit_price: 12,
		});

		const property = await api().account.customProperties.create({
			name: NAME,
			kind: 'String',
			entity: 'Project',
		});
		ids.customProperty = property.id as number;
		cleanup('customProperty', (c) =>
			c.moco.api.account.customProperties.delete({
				id: need('customProperty'),
			}),
		);
		await api().account.customProperties.get({ id: need('customProperty') });
		await api().account.customProperties.update({
			id: need('customProperty'),
			name: NAME,
			placeholder: 'test',
		});

		const service = await api().account.catalogServices.create({
			title: NAME,
			items: [
				{
					type: 'item',
					title: 'Setup',
					quantity: 1,
					unit: 'h',
					unit_price: 80,
				},
			],
		});
		ids.catalogService = service.id as number;
		cleanup('catalogService', (c) =>
			c.moco.api.account.catalogServices.delete({ id: need('catalogService') }),
		);
		await api().account.catalogServices.get({ id: need('catalogService') });
		await api().account.catalogServices.update({
			id: need('catalogService'),
			title: `${NAME}-2`,
		});
		const item = await api().account.catalogServices.items.create({
			catalog_service_id: need('catalogService'),
			type: 'item',
			title: 'Consulting',
			quantity: 1,
			unit: 'h',
			unit_price: 100,
		});
		ids.catalogItem = item.id as number;
		await api().account.catalogServices.items.get({
			catalog_service_id: need('catalogService'),
			id: need('catalogItem'),
		});
		await api().account.catalogServices.items.update({
			catalog_service_id: need('catalogService'),
			id: need('catalogItem'),
			unit_price: 110,
		});
		await api().account.catalogServices.items.delete({
			catalog_service_id: need('catalogService'),
			id: need('catalogItem'),
		});
	});

	// ── Second batch: uploads, payments, bulk routes, approvals ──────────────

	it('invoice + offer attachments (upload, list, delete), timesheet PDF', async () => {
		// 404 while the invoice bills no tracked hours (this one has none).
		await api()
			.invoices.getTimesheetPdf({ id: need('invoice') })
			.catch((error) => {
				if (!/MOCO 404/.test((error as Error).message)) throw error;
			});
		const attachment = { filename: `${NAME}.pdf`, base64: TINY_PDF };
		const onInvoice = await api().invoices.attachments.create({
			invoice_id: need('invoice'),
			attachment,
		});
		const invoiceFiles = await api().invoices.attachments.list({
			invoice_id: need('invoice'),
		});
		const invoiceFile = idOf(onInvoice) ?? idOf(firstOf(invoiceFiles));
		expect(invoiceFile).toBeDefined();
		await api().invoices.attachments.delete({
			invoice_id: need('invoice'),
			id: invoiceFile as number,
		});
		const onOffer = await api().offers.attachments.create({
			offer_id: need('offer'),
			attachment,
		});
		const offerFiles = await api().offers.attachments.list({
			offer_id: need('offer'),
		});
		const offerFile = idOf(onOffer) ?? idOf(firstOf(offerFiles));
		expect(offerFile).toBeDefined();
		await api().offers.attachments.delete({
			offer_id: need('offer'),
			id: offerFile as number,
		});
	});

	it('offers assign / customerApproval activate + get + deactivate / updateStatus', async () => {
		await api().offers.assign({ id: need('offer'), deal_id: need('deal') });
		await api().offers.customerApproval.activate({ offer_id: need('offer') });
		const approval = await api().offers.customerApproval.get({
			offer_id: need('offer'),
		});
		expect(approval).toBeDefined();
		await api().offers.customerApproval.deactivate({ offer_id: need('offer') });
	});

	it('offerConfirmations create / get / getPdf / update', async () => {
		const confirmation = await api().offerConfirmations.create({
			offer_id: need('offer'),
			title: `${NAME} confirmation`,
		});
		ids.confirmation = confirmation.id as number;
		cleanup('offerConfirmation', (c) =>
			c.moco.api.offerConfirmations.delete({ id: need('confirmation') }),
		);
		await api().offerConfirmations.get({ id: need('confirmation') });
		const pdf = await api().offerConfirmations.getPdf({
			id: need('confirmation'),
		});
		expect(JSON.stringify(pdf)).toContain('pdf');
		await api().offerConfirmations.update({
			id: need('confirmation'),
			title: `${NAME} v2`,
		});
		// The confirmation set the offer to accepted; MOCO deletes an offer only
		// in status created. A status change only: nothing is sent.
		await api().offers.updateStatus({ id: need('offer'), status: 'created' });
		const offer = await api().offers.get({ id: need('offer') });
		expect(offer.status).toBe('created');
	});

	it('purchases storeDocument (multipart) / updateStatus / payments / approvals', async () => {
		await api().purchases.storeDocument({
			id: need('purchase'),
			file: { base64: TINY_PDF, filename: `${NAME}.pdf` } as never,
		});
		const withFile = await api().purchases.get({ id: need('purchase') });
		expect(withFile.file_url).toBeTruthy();

		const payment = await api().purchases.payments.create({
			purchase_id: need('purchase'),
			date: TODAY,
			total: 4,
		});
		ids.purchasePayment = payment.id as number;
		cleanup('purchasePayment', (c) =>
			c.moco.api.purchases.payments.delete({ id: need('purchasePayment') }),
		);
		await api().purchases.payments.get({ id: need('purchasePayment') });
		await api().purchases.payments.update({
			id: need('purchasePayment'),
			purchase_id: need('purchase'),
			date: TODAY,
			total: 5,
		});
		const bulk = await api().purchases.payments.bulkCreate({
			bulk_data: [{ purchase_id: need('purchase'), date: TODAY, total: 1 }],
		});
		for (const id of idsIn(bulk)) {
			cleanup('purchasePayment (bulk)', (c) =>
				c.moco.api.purchases.payments.delete({ id }),
			);
		}
		expect(idsIn(bulk).length).toBe(1);

		// Books the purchase item as an expense on the test project.
		const purchase = await api().purchases.get({ id: need('purchase') });
		const itemId = (purchase.items?.[0] as { id?: number } | undefined)?.id;
		expect(typeof itemId).toBe('number');
		await api().purchases.assignToProject({
			id: need('purchase'),
			item_id: itemId as number,
			project_id: need('project'),
			billable: false,
		});
		const booked = await api().projects.expenses.list({
			project_id: need('project'),
		});
		const bookedIds = booked.items
			.filter((expense) => expense.title === 'Test item')
			.map((expense) => expense.id as number);
		expect(bookedIds).toHaveLength(1);
		for (const id of bookedIds) {
			cleanup('expense (from purchase)', (c) =>
				c.moco.api.projects.expenses.delete({
					project_id: need('project'),
					id,
				}),
			);
		}

		const denied = await api().approvals.create({
			target_type: 'purchase',
			target_id: need('purchase'),
			approver_id: need('me'),
		});
		ids.deniedApproval = denied.id as number;
		cleanup('approval (denied)', (c) =>
			c.moco.api.approvals.delete({ id: need('deniedApproval') }),
		);
		const deny = await api().approvals.deny({
			id: need('deniedApproval'),
			note: NAME,
		});
		expect(deny.status).toBe('denied');

		const approval = await api().approvals.create({
			target_type: 'purchase',
			target_id: need('purchase'),
			approver_id: need('me'),
			note: NAME,
		});
		ids.approval = approval.id as number;
		cleanup('approval', (c) =>
			c.moco.api.approvals.delete({ id: need('approval') }),
		);
		await api().approvals.get({ id: need('approval') });
		await api().approvals.approve({ id: need('approval') });

		await api().purchases.updateStatus({
			id: need('purchase'),
			status: 'archived',
		});
		await api().purchases.updateStatus({
			id: need('purchase'),
			status: 'pending',
		});
	});

	it('purchases.drafts create / get / getPdf / delete', async () => {
		const draft = await api().purchases.drafts.create({
			title: `${NAME} draft`,
			file: { filename: `${NAME}.pdf`, base64: TINY_PDF },
		});
		ids.purchaseDraft = draft.id as number;
		cleanup('purchaseDraft', (c) =>
			c.moco.api.purchases.drafts
				.delete({ id: need('purchaseDraft') })
				.catch((error) => {
					if (!/404/.test((error as Error).message)) throw error;
				}),
		);
		await api().purchases.drafts.get({ id: need('purchaseDraft') });
		const pdf = await api().purchases.drafts.getPdf({
			id: need('purchaseDraft'),
		});
		expect(JSON.stringify(pdf)).toContain('pdf');
		await api().purchases.drafts.delete({ id: need('purchaseDraft') });
	});

	it('activities.bulkCreate + disregard, comments.bulkCreate', async () => {
		const created = await api().activities.bulkCreate({
			activities: [
				{
					date: TODAY,
					project_id: need('project'),
					task_id: need('task'),
					seconds: 600,
					description: `${NAME} bulk`,
				},
			],
		});
		const bulkIds = idsIn(created);
		for (const id of bulkIds) {
			cleanup('activity (bulk)', (c) => c.moco.api.activities.delete({ id }));
		}
		const ours =
			bulkIds.length > 0
				? bulkIds
				: idsIn(
						await api().activities.list({
							from: TODAY,
							to: TODAY,
							project_id: need('project'),
						}),
					).filter((id) => id !== need('activity'));
		if (bulkIds.length === 0) {
			for (const id of ours) {
				cleanup('activity (bulk, listed)', (c) =>
					c.moco.api.activities.delete({ id }),
				);
			}
		}
		expect(ours.length).toBe(1);
		await api().activities.disregard({
			company_id: need('company'),
			reason: `${NAME}: not billed`,
			activity_ids: ours,
		});
		// Disregarding books the activity on a hidden invoice (status
		// disregarded) and locks it (delete answers 403) until that invoice is
		// deleted, with a reason.
		const disregarded = await api().activities.get({ id: ours[0] as number });
		ids.disregardedInvoice = disregarded.invoice_id as number;
		expect(typeof ids.disregardedInvoice).toBe('number');
		cleanup('disregard invoice (activities)', (c) =>
			c.moco.api.invoices.delete({
				id: need('disregardedInvoice'),
				reason: NAME,
			}),
		);
		const comments = await api().comments.bulkCreate({
			commentable_type: 'Project',
			commentable_ids: [need('project')],
			text: `<p>${NAME} bulk</p>`,
		});
		const commentIds = idsIn(comments);
		for (const id of commentIds) {
			cleanup('comment (bulk)', (c) => c.moco.api.comments.delete({ id }));
		}
		expect(commentIds.length).toBe(1);
	});

	it('projects.expenses bulkCreate + disregard, recurringExpenses.recur', async () => {
		const created = await api().projects.expenses.bulkCreate({
			project_id: need('project'),
			bulk_data: [
				{
					date: TODAY,
					title: `${NAME} bulk expense`,
					quantity: 1,
					unit: 'pcs',
					unit_price: 3,
					unit_cost: 1,
				},
			],
		});
		const expenseIds = idsIn(created);
		for (const id of expenseIds) {
			cleanup('expense (bulk)', (c) =>
				c.moco.api.projects.expenses.delete({
					project_id: need('project'),
					id,
				}),
			);
		}
		expect(expenseIds.length).toBe(1);
		await api().projects.expenses.disregard({
			project_id: need('project'),
			reason: `${NAME}: not billed`,
			expense_ids: expenseIds,
		});
		const disregarded = await api().projects.expenses.get({
			project_id: need('project'),
			id: expenseIds[0] as number,
		});
		ids.disregardedExpenseInvoice = (disregarded as { invoice_id?: number })
			.invoice_id as number;
		expect(typeof ids.disregardedExpenseInvoice).toBe('number');
		cleanup('disregard invoice (expenses)', (c) =>
			c.moco.api.invoices.delete({
				id: need('disregardedExpenseInvoice'),
				reason: NAME,
			}),
		);
		const recurred = await api().projects.recurringExpenses.recur({
			project_id: need('project'),
			id: need('recurring'),
		});
		const recurredId = idOf(recurred);
		if (typeof recurredId === 'number') {
			cleanup('expense (recurred)', (c) =>
				c.moco.api.projects.expenses.delete({
					project_id: need('project'),
					id: recurredId,
				}),
			);
		}
	});

	it('projects.tasks.deleteAll on a second test project', async () => {
		const project = await api().projects.create({
			name: `${NAME} project 2`,
			currency: 'USD',
			finish_date: LATER,
			fixed_price: false,
			retainer: false,
			leader_id: need('me'),
			customer_id: need('company'),
			billing_variant: 'project',
		});
		ids.project2 = project.id as number;
		cleanup('project 2', (c) =>
			c.moco.api.projects.delete({ id: need('project2') }),
		);
		await api().projects.tasks.create({
			project_id: need('project2'),
			name: `${NAME} task`,
		});
		await api().projects.tasks.deleteAll({ project_id: need('project2') });
		const tasks = await api().projects.tasks.list({
			project_id: need('project2'),
		});
		expect(tasks.items).toHaveLength(0);
	});

	it('users.update / employments create + update / absenceRequests / presences.touch', async () => {
		// The profile's own note is put back as it was.
		const original = (await api().users.get({ id: need('me') })).info ?? '';
		await api().users.update({ id: need('me'), info: `${NAME}` });
		cleanup('user info', (c) =>
			c.moco.api.users.update({ id: need('me'), info: original }),
		);

		const employment = await api().users.employments.create({
			user_id: need('me'),
			// Before the account's first employment: periods may not overlap.
			from: '2020-01-01',
			to: '2020-12-31',
			pattern: { am: [4, 4, 4, 4, 0], pm: [4, 4, 4, 4, 0] },
		});
		ids.employment = employment.id as number;
		cleanup('employment', (c) =>
			c.moco.api.users.employments.delete({ id: need('employment') }),
		);
		await api().users.employments.update({
			id: need('employment'),
			pattern: { am: [4, 4, 4, 4, 4], pm: [4, 4, 4, 4, 0] },
		});

		const request = await api().users.absenceRequests.create({
			approver_user_id: String(need('me')),
			type: 'vacation',
			entries: [{ date: `${YEAR + 1}-07-14`, am: true, pm: true }],
			comment: NAME,
		});
		ids.absenceRequest = request.id as number;
		cleanup('absenceRequest', (c) =>
			c.moco.api.users.absenceRequests
				.delete({ id: need('absenceRequest'), comment: NAME })
				.catch((error) => {
					if (!/404/.test((error as Error).message)) throw error;
				}),
		);
		await api().users.absenceRequests.get({ id: need('absenceRequest') });
		await api().users.absenceRequests.delete({
			id: need('absenceRequest'),
			comment: NAME,
		});

		// One touch clocks in (an open presence); a second touch in the same
		// minute drops it again, so the open one is deleted instead. If the user
		// is already clocked in, touch would clock them out: skip it then.
		const all = await api().users.presences.list({});
		const open = all.items.some((presence) => presence.to === null);
		if (open) {
			console.warn('users.presences.touch not run: the user is clocked in');
			return;
		}
		const before = idsIn(
			await api().users.presences.list({ from: TODAY, to: TODAY }),
		);
		const clockedIn = await api().users.presences.touch({});
		expect(clockedIn.to ?? null).toBeNull();
		const after = idsIn(
			await api().users.presences.list({ from: TODAY, to: TODAY }),
		);
		const touched = after.filter((id) => !before.includes(id));
		for (const id of touched) {
			cleanup('presence (touch)', (c) =>
				c.moco.api.users.presences.delete({ id }),
			);
		}
		expect(touched.length).toBeGreaterThan(0);
	});

	it('account.internalHourlyRates.update writes back the current rates', async () => {
		const current = await api().account.internalHourlyRates.get({
			years: String(YEAR),
		});
		const rows = (Array.isArray(current) ? current : []) as Array<{
			id?: number;
			rates?: Array<{ year?: number; rate?: number }>;
		}>;
		const mine = rows.find((row) => row.id === need('me'));
		const rate = mine?.rates?.find((item) => item.year === YEAR)?.rate ?? 0;
		await api().account.internalHourlyRates.update({
			year: YEAR,
			rates: [{ user_id: need('me'), rate }],
		});
	});

	it('account.webHooks create / get / disable / enable / update / delete', async () => {
		// example.com never answers a delivery; the hook is deleted right away.
		const hook = await api().account.webHooks.create({
			target: 'Company',
			event: 'update',
			hook: 'https://example.com/corsair-plugin-test',
		});
		ids.webHook = hook.id as number;
		cleanup('webHook', (c) =>
			c.moco.api.account.webHooks
				.delete({ id: need('webHook') })
				.catch(() => undefined),
		);
		await api().account.webHooks.get({ id: need('webHook') });
		await api().account.webHooks.disable({ id: need('webHook') });
		await api().account.webHooks.enable({ id: need('webHook') });
		await api().account.webHooks.update({
			id: need('webHook'),
			hook: 'https://example.com/corsair-plugin-test-2',
		});
		await api().account.webHooks.delete({ id: need('webHook') });
	});

	it('errors: a missing record is a 404 ApiError with MOCO’s reason', async () => {
		await expect(api().companies.get({ id: 1 })).rejects.toThrow(/MOCO 404/);
	});
});
