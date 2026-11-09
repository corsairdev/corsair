import { logEventFromContext } from 'corsair/core';
import { Attachments, Crm, Records } from './endpoints';
import {
	activity,
	activityDetailsPage,
	attachmentDetailsPage,
	conversation,
	conversationDetailsPage,
	createdRecord,
	customer,
	customerDetailsPage,
	invoice,
	invoiceDetailsPage,
	item,
	itemDetailsPage,
	itemResult,
	message,
	messageDetailsPage,
	organization,
	organizationContainerTypes,
	organizationDetailsPage,
	organizationItemTypes,
	organizationLifecycleStatus,
	organizationProfile,
	organizationUserTypes,
	pagedIds,
	project,
	projectDetailsPage,
	quote,
	quoteDetailsPage,
	team,
	teamDetailsPage,
	timer,
	timerActionResult,
	timerDetailsPage,
	timesheet,
	timesheetDetailsPage,
	updateCodeString,
	user,
	userDetailsPage,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'od-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown: the assertions inspect it per case.
// unknown: see above.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// The fake context carries what the endpoints read: ctx.key and the host.
function context(host?: string) {
	return { key: API_KEY, options: host ? { host } : {} } as never;
}

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown, host?: string) {
	return endpoint(context(host), input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or a bare code string.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the body is whatever the endpoint serialised.
		body:
			init.body === undefined || init.body instanceof FormData
				? init.body
				: JSON.parse(String(init.body)),
		headers: new Headers(init.headers),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('items', () => {
	it('items.filter posts the type and paging to /items/filter', async () => {
		respond(pagedIds);

		const result = (await invoke(Records.itemsFilter, {
			itemType: 'Ticket',
			limit: 2,
			offset: 0,
		})) as { data: string[]; nextOffset: number | null };

		expect(result.data).toHaveLength(2);
		expect(result.nextOffset).toBe(2);
		const request = lastRequest();
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/rest/public/items/filter');
		expect(request.body).toMatchObject({ itemType: 'Ticket', limit: 2 });
		expect(request.headers.get('od-public-api-key')).toBe(API_KEY);
	});

	it('items.filterDetails returns item records', async () => {
		respond(itemDetailsPage);

		const result = (await invoke(Records.itemsFilterDetails, {
			itemType: 'Ticket',
		})) as { data: { name?: string }[] };

		expect(result.data[0]?.name).toBe(item.name);
		expect(lastRequest().path).toBe('/rest/public/items/filter/details');
	});

	it('items.filter rejects a filter without itemType', async () => {
		await expect(invoke(Records.itemsFilter, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('items.filter reports no next offset on the last page', async () => {
		respond({ ...pagedIds, data: [], totalNum: 0 });

		const result = (await invoke(Records.itemsFilter, {
			itemType: 'Ticket',
		})) as { nextOffset: number | null };

		expect(result.nextOffset).toBeNull();
	});

	it('items.get uses the external id path when given one', async () => {
		respond(itemResult);

		await invoke(Records.itemsGet, { externalId: 'i-1' });

		expect(lastRequest().path).toBe('/rest/public/items/externalId/i-1');
	});

	it('items.get uses the numeric id path when given only an id', async () => {
		respond(itemResult);

		await invoke(Records.itemsGet, { id: 2 });

		expect(lastRequest().path).toBe('/rest/public/items/id/2');
	});

	it('items.get rejects an input with neither identifier', async () => {
		await expect(invoke(Records.itemsGet, {})).rejects.toThrow(
			/Pass externalId or id/,
		);
	});

	it('items.create posts the item and returns its external id', async () => {
		respond(createdRecord);

		const result = (await invoke(Records.itemsCreate, {
			name: 'Broken button',
			type: 'Ticket',
			priority: 80,
		})) as { code?: string; data?: string };

		expect(result.data).toBe(createdRecord.data);
		const request = lastRequest();
		expect(request.path).toBe('/rest/public/items/');
		// Priority is declared as a string enum and arrives as a number.
		expect(request.body).toMatchObject({ name: 'Broken button', priority: 80 });
	});

	it('items.create rejects a priority the API does not accept', async () => {
		await expect(
			invoke(Records.itemsCreate, { name: 'x', priority: 50 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('items.update strips the identifier from the body', async () => {
		respond(updateCodeString);

		const result = (await invoke(Records.itemsUpdate, {
			externalId: 'i-1',
			name: 'Renamed',
			percentComplete: 50,
		})) as { code: string };

		expect(result.code).toBe('SUCCESS');
		const request = lastRequest();
		expect(request.path).toBe('/rest/public/items/externalId/i-1');
		expect(request.body).toEqual({ name: 'Renamed', percentComplete: 50 });
	});

	it('items.update rejects a percentComplete over 100', async () => {
		await expect(
			invoke(Records.itemsUpdate, { externalId: 'i-1', percentComplete: 101 }),
		).rejects.toThrow();
	});
});

describe('users', () => {
	it('users.filter posts the filter and derives the offset', async () => {
		respond(pagedIds);

		await invoke(Records.usersFilter, { offset: 0, limit: 2 });

		const request = lastRequest();
		expect(request.path).toBe('/rest/public/users/filter');
		expect(request.body).toMatchObject({ offset: 0, limit: 2 });
	});

	it('users.filterDetails returns users', async () => {
		respond(userDetailsPage);

		const result = (await invoke(Records.usersFilterDetails, {})) as {
			data: { profile?: { email?: string } }[];
		};

		expect(result.data[0]?.profile?.email).toBe(user.profile.email);
	});

	it('users.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: user });

		await invoke(Records.usersGet, { externalId: 'u-1' });

		expect(lastRequest().path).toBe('/rest/public/users/externalId/u-1');
	});

	it('users.get reads by numeric id', async () => {
		respond({ code: 'SUCCESS', data: user });

		await invoke(Records.usersGet, { id: 7 });

		expect(lastRequest().path).toBe('/rest/public/users/id/7');
	});

	it('users.create rejects an email that is not an address', async () => {
		await expect(
			invoke(Records.usersCreate, { email: 'not-an-email' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('users.create posts the user and returns the id', async () => {
		respond(createdRecord);

		await invoke(Records.usersCreate, {
			email: 'ada@example.com',
			firstName: 'Ada',
			isAdmin: false,
		});

		const request = lastRequest();
		expect(request.path).toBe('/rest/public/users/');
		expect(request.body).toMatchObject({
			email: 'ada@example.com',
			isAdmin: false,
		});
	});

	it('users.update sends the team list update', async () => {
		respond(updateCodeString);

		await invoke(Records.usersUpdate, {
			externalId: 'u-1',
			teamExternalIds: { add: ['t-1'] },
		});

		expect(lastRequest().body).toEqual({ teamExternalIds: { add: ['t-1'] } });
	});
});

describe('projects and portfolios', () => {
	it('projects.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Records.projectsFilter, { limit: 10 });

		expect(lastRequest().path).toBe('/rest/public/projects/filter');
	});

	it('projects.filterDetails returns projects', async () => {
		respond(projectDetailsPage);

		const result = (await invoke(Records.projectsFilterDetails, {})) as {
			data: { name?: string }[];
		};

		expect(result.data[0]?.name).toBe(project.name);
	});

	it('projects.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: project });

		await invoke(Records.projectsGet, { externalId: 'p-1' });

		expect(lastRequest().path).toBe('/rest/public/projects/externalId/p-1');
	});

	it('projects.create posts the project', async () => {
		respond(createdRecord);

		await invoke(Records.projectsCreate, {
			name: 'Website',
			invoiceType: 'flat fee',
		});

		expect(lastRequest().body).toMatchObject({ invoiceType: 'flat fee' });
	});

	it('projects.create rejects an unknown invoice type', async () => {
		await expect(
			invoke(Records.projectsCreate, { name: 'x', invoiceType: 'hourly' }),
		).rejects.toThrow();
	});

	it('projects.update posts the lifecycle status', async () => {
		respond(updateCodeString);

		await invoke(Records.projectsUpdate, {
			externalId: 'p-1',
			lifecycleStatus: 'Closed',
		});

		expect(lastRequest().body).toEqual({ lifecycleStatus: 'Closed' });
	});

	it('portfolios.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Records.portfoliosFilter, {});

		expect(lastRequest().path).toBe('/rest/public/portfolios/filter');
	});

	it('portfolios.filterDetails returns portfolios', async () => {
		respond({
			code: 'SUCCESS',
			data: [{ externalId: 'pf-1', name: '2024' }],
			totalNum: 1,
		});

		const result = (await invoke(Records.portfoliosFilterDetails, {})) as {
			data: { name?: string }[];
		};

		expect(result.data[0]?.name).toBe('2024');
	});

	it('portfolios.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: { externalId: 'pf-1', name: '2024' } });

		await invoke(Records.portfoliosGet, { externalId: 'pf-1' });

		expect(lastRequest().path).toBe('/rest/public/portfolios/externalId/pf-1');
	});

	it('portfolios.create posts the parent ids', async () => {
		respond(createdRecord);

		await invoke(Records.portfoliosCreate, {
			name: '2024',
			parentPortfolioExternalIds: ['pf-0'],
		});

		expect(lastRequest().body).toMatchObject({
			parentPortfolioExternalIds: ['pf-0'],
		});
	});

	it('portfolios.update posts the list update', async () => {
		respond(updateCodeString);

		await invoke(Records.portfoliosUpdate, {
			externalId: 'pf-1',
			parentPortfolioExternalIds: { remove: ['pf-0'] },
		});

		expect(lastRequest().body).toEqual({
			parentPortfolioExternalIds: { remove: ['pf-0'] },
		});
	});
});

describe('teams', () => {
	it('teams.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Records.teamsFilter, {});

		expect(lastRequest().path).toBe('/rest/public/teams/filter');
	});

	it('teams.filterDetails returns teams', async () => {
		respond(teamDetailsPage);

		const result = (await invoke(Records.teamsFilterDetails, {})) as {
			data: { name?: string }[];
		};

		expect(result.data[0]?.name).toBe(team.name);
	});

	it('teams.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: team });

		await invoke(Records.teamsGet, { externalId: 't-1' });

		expect(lastRequest().path).toBe('/rest/public/teams/externalId/t-1');
	});

	it('teams.create posts the members', async () => {
		respond(createdRecord);

		await invoke(Records.teamsCreate, { name: 'Support', users: ['u-1'] });

		expect(lastRequest().body).toMatchObject({ users: ['u-1'] });
	});

	it('teams.update posts the member list update', async () => {
		respond(updateCodeString);

		await invoke(Records.teamsUpdate, {
			externalId: 't-1',
			users: { replace: ['u-1', 'u-2'] },
		});

		expect(lastRequest().body).toEqual({ users: { replace: ['u-1', 'u-2'] } });
	});
});

describe('invoices and quotes', () => {
	it('invoices.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Records.invoicesFilter, {});

		expect(lastRequest().path).toBe('/rest/public/invoices/filter');
	});

	it('invoices.filterDetails returns invoices', async () => {
		respond(invoiceDetailsPage);

		const result = (await invoke(Records.invoicesFilterDetails, {})) as {
			data: { displayNumber?: string }[];
		};

		expect(result.data[0]?.displayNumber).toBe(invoice.displayNumber);
	});

	it('invoices.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: invoice });

		await invoke(Records.invoicesGet, { externalId: 'inv-1' });

		expect(lastRequest().path).toBe('/rest/public/invoices/externalId/inv-1');
	});

	it('invoices.update posts the status', async () => {
		respond(updateCodeString);

		await invoke(Records.invoicesUpdate, {
			externalId: 'inv-1',
			status: 'sent',
		});

		expect(lastRequest().body).toEqual({ status: 'sent' });
	});

	it('invoices.update rejects a status OneDesk does not define', async () => {
		await expect(
			invoke(Records.invoicesUpdate, {
				externalId: 'inv-1',
				status: 'paid-ish',
			}),
		).rejects.toThrow();
	});

	it('quotes.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Records.quotesFilter, {});

		expect(lastRequest().path).toBe('/rest/public/quotes/filter');
	});

	it('quotes.filterDetails returns quotes', async () => {
		respond(quoteDetailsPage);

		const result = (await invoke(Records.quotesFilterDetails, {})) as {
			data: { displayNumber?: string }[];
		};

		expect(result.data[0]?.displayNumber).toBe(quote.displayNumber);
	});

	it('quotes.get reads by numeric id', async () => {
		respond({ code: 'SUCCESS', data: quote });

		await invoke(Records.quotesGet, { id: 71 });

		expect(lastRequest().path).toBe('/rest/public/quotes/id/71');
	});

	it('quotes.update posts the quote status', async () => {
		respond(updateCodeString);

		await invoke(Records.quotesUpdate, {
			externalId: 'q-1',
			status: 'convert to invoice',
		});

		expect(lastRequest().body).toEqual({ status: 'convert to invoice' });
	});
});

describe('customers and organizations', () => {
	it('customers.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Crm.customersFilter, { limit: 5 });

		expect(lastRequest().path).toBe('/rest/public/customers/filter');
	});

	it('customers.filterDetails returns customers', async () => {
		respond(customerDetailsPage);

		const result = (await invoke(Crm.customersFilterDetails, {})) as {
			data: { email?: string }[];
		};

		expect(result.data[0]?.email).toBe(customer.email);
	});

	it('customers.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: customer });

		await invoke(Crm.customersGet, { externalId: 'c-1' });

		expect(lastRequest().path).toBe('/rest/public/customers/externalId/c-1');
	});

	it('customers.create posts the customer', async () => {
		respond(createdRecord);

		await invoke(Crm.customersCreate, {
			email: 'ada@example.com',
			customerOrganization: 'co-1',
		});

		expect(lastRequest().body).toMatchObject({
			email: 'ada@example.com',
			customerOrganization: 'co-1',
		});
	});

	it('customers.update posts the deactivate flag', async () => {
		respond(updateCodeString);

		await invoke(Crm.customersUpdate, { externalId: 'c-1', deactivate: true });

		expect(lastRequest().body).toEqual({ deactivate: true });
	});

	it('organizations.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Crm.organizationsFilter, {});

		expect(lastRequest().path).toBe(
			'/rest/public/customer-organizations/filter',
		);
	});

	it('organizations.filterDetails returns organizations', async () => {
		respond(organizationDetailsPage);

		const result = (await invoke(Crm.organizationsFilterDetails, {})) as {
			data: { name?: string }[];
		};

		expect(result.data[0]?.name).toBe(organization.name);
	});

	it('organizations.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: organization });

		await invoke(Crm.organizationsGet, { externalId: 'co-1' });

		expect(lastRequest().path).toBe(
			'/rest/public/customer-organizations/externalId/co-1',
		);
	});

	it('organizations.create posts the domains', async () => {
		respond(createdRecord);

		await invoke(Crm.organizationsCreate, {
			name: 'Analytical Engines',
			domains: ['example.com'],
		});

		expect(lastRequest().body).toMatchObject({ domains: ['example.com'] });
	});

	it('organizations.update posts the customer list update', async () => {
		respond(updateCodeString);

		await invoke(Crm.organizationsUpdate, {
			externalId: 'co-1',
			customers: { add: ['c-1'] },
		});

		expect(lastRequest().body).toEqual({ customers: { add: ['c-1'] } });
	});
});

describe('timesheets and timers', () => {
	it('timesheets.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Crm.timesheetsFilter, {});

		expect(lastRequest().path).toBe('/rest/public/timesheets/filter');
	});

	it('timesheets.filterDetails returns timesheets', async () => {
		respond(timesheetDetailsPage);

		const result = (await invoke(Crm.timesheetsFilterDetails, {})) as {
			data: { works?: number }[];
		};

		expect(result.data[0]?.works).toBe(timesheet.works);
	});

	it('timesheets.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: timesheet });

		await invoke(Crm.timesheetsGet, { externalId: 'ts-1' });

		expect(lastRequest().path).toBe('/rest/public/timesheets/externalId/ts-1');
	});

	it('timesheets.create posts every required field', async () => {
		respond(createdRecord);

		await invoke(Crm.timesheetsCreate, {
			userExternalId: 'u-1',
			taskExternalId: 'i-1',
			works: 2.5,
			percentCompleted: 100,
			finish: '2024-05-14T11:30:00Z',
		});

		expect(lastRequest().body).toMatchObject({
			works: 2.5,
			percentCompleted: 100,
		});
	});

	it('timesheets.create rejects a call missing a required field', async () => {
		await expect(
			invoke(Crm.timesheetsCreate, {
				userExternalId: 'u-1',
				taskExternalId: 'i-1',
				works: 1,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('timesheets.update posts the approval status', async () => {
		respond(updateCodeString);

		await invoke(Crm.timesheetsUpdate, {
			externalId: 'ts-1',
			status: 'approved',
		});

		expect(lastRequest().body).toEqual({ status: 'approved' });
	});

	it('timers.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Crm.timersFilter, {});

		expect(lastRequest().path).toBe('/rest/public/timers/filter');
	});

	it('timers.filterDetails returns timers', async () => {
		respond(timerDetailsPage);

		const result = (await invoke(Crm.timersFilterDetails, {})) as {
			data: { status?: string }[];
		};

		expect(result.data[0]?.status).toBe(timer.status);
	});

	it('timers.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: timer });

		await invoke(Crm.timersGet, { externalId: 'tm-1' });

		expect(lastRequest().path).toBe('/rest/public/timers/externalId/tm-1');
	});

	it('timers.start puts both ids in the path', async () => {
		respond(timerActionResult);

		const result = (await invoke(Crm.timersStart, {
			timerExternalId: 'tm-1',
			itemExternalId: 'i-1',
		})) as { code?: string };

		expect(result.code).toBe('SUCCESS');
		const request = lastRequest();
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/rest/public/timers/start/tm-1/i-1');
	});

	it('timers.pause changes the timer over GET', async () => {
		respond(timerActionResult);

		await invoke(Crm.timersPause, { timerExternalId: 'tm-1' });

		const request = lastRequest();
		expect(request.method).toBe('GET');
		expect(request.path).toBe('/rest/public/timers/pause/tm-1');
	});

	it('timers.resume changes the timer over GET', async () => {
		respond(timerActionResult);

		await invoke(Crm.timersResume, { timerExternalId: 'tm-1' });

		expect(lastRequest().path).toBe('/rest/public/timers/resume/tm-1');
	});

	it('timers.cancel changes the timer over GET', async () => {
		respond(timerActionResult);

		await invoke(Crm.timersCancel, { timerExternalId: 'tm-1' });

		expect(lastRequest().path).toBe('/rest/public/timers/cancel/tm-1');
	});
});

describe('conversations and messages', () => {
	it('conversations.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Crm.conversationsFilter, {});

		expect(lastRequest().path).toBe('/rest/public/conversations/filter');
	});

	it('conversations.filterDetails returns conversations', async () => {
		respond(conversationDetailsPage);

		const result = (await invoke(Crm.conversationsFilterDetails, {})) as {
			data: { externalId?: string }[];
		};

		expect(result.data[0]?.externalId).toBe(conversation.externalId);
	});

	it('conversations.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: conversation });

		await invoke(Crm.conversationsGet, { externalId: 'cv-1' });

		expect(lastRequest().path).toBe(
			'/rest/public/conversations/externalId/cv-1',
		);
	});

	it('conversations.create posts the first messages', async () => {
		respond(createdRecord);

		await invoke(Crm.conversationsCreate, {
			itemExternalId: 'i-1',
			messages: [{ content: 'Hello' }],
		});

		expect(lastRequest().body).toMatchObject({
			itemExternalId: 'i-1',
			messages: [{ content: 'Hello' }],
		});
	});

	it('conversations.create rejects a conversation with no target', async () => {
		await expect(invoke(Crm.conversationsCreate, {})).rejects.toThrow(
			/itemExternalId or projectExternalId/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('conversations.update posts the open and lock flags', async () => {
		respond(updateCodeString);

		await invoke(Crm.conversationsUpdate, {
			externalId: 'cv-1',
			open: false,
			lock: true,
		});

		expect(lastRequest().body).toEqual({ open: false, lock: true });
	});

	it('messages.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Crm.messagesFilter, {});

		expect(lastRequest().path).toBe(
			'/rest/public/conversation-messages/filter',
		);
	});

	it('messages.filterDetails returns messages', async () => {
		respond(messageDetailsPage);

		const result = (await invoke(Crm.messagesFilterDetails, {})) as {
			data: { content?: string }[];
		};

		expect(result.data[0]?.content).toBe(message.content);
	});

	it('messages.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: message });

		await invoke(Crm.messagesGet, { externalId: 'm-1' });

		expect(lastRequest().path).toBe(
			'/rest/public/conversation-messages/externalId/m-1',
		);
	});

	it('messages.create posts into the conversation', async () => {
		respond(createdRecord);

		await invoke(Crm.messagesCreate, {
			conversationExternalId: 'cv-1',
			content: 'Thanks',
		});

		expect(lastRequest().body).toMatchObject({
			conversationExternalId: 'cv-1',
			content: 'Thanks',
		});
	});

	it('messages.update posts the new content', async () => {
		respond(updateCodeString);

		await invoke(Crm.messagesUpdate, {
			externalId: 'm-1',
			content: 'Edited',
		});

		expect(lastRequest().body).toEqual({ content: 'Edited' });
	});
});

describe('activities and attachments', () => {
	it('activities.filterDetails posts the filter', async () => {
		respond(activityDetailsPage);

		const result = (await invoke(Crm.activitiesFilterDetails, {})) as {
			data: { activityType?: string }[];
		};

		expect(result.data[0]?.activityType).toBe(activity.activityType);
		expect(lastRequest().path).toBe('/rest/public/activities/filter/details');
	});

	it('attachments.filter posts the filter', async () => {
		respond(pagedIds);

		await invoke(Attachments.attachmentsFilter, {});

		expect(lastRequest().path).toBe('/rest/public/attachments/filter');
	});

	it('attachments.filterDetails returns attachments', async () => {
		respond(attachmentDetailsPage);

		const result = (await invoke(Attachments.attachmentsFilterDetails, {})) as {
			data: { name?: string }[];
		};

		expect(result.data[0]?.name).toBe('invoice.pdf');
	});

	it('attachments.get reads by external id', async () => {
		respond({ code: 'SUCCESS', data: { externalId: 'at-1', name: 'x.pdf' } });

		await invoke(Attachments.attachmentsGet, { externalId: 'at-1' });

		expect(lastRequest().path).toBe('/rest/public/attachments/externalId/at-1');
	});

	it('attachments.upload sends the decoded bytes as multipart', async () => {
		respond(createdRecord);

		await invoke(Attachments.attachmentsUpload, {
			fileName: 'note.txt',
			contentBase64: Buffer.from('hello').toString('base64'),
			contentType: 'text/plain',
		});

		const request = lastRequest();
		expect(request.path).toBe('/rest/public/attachments/');
		expect(request.body).toBeInstanceOf(FormData);
		const form = request.body as FormData;
		expect(form.get('fileName')).toBe('note.txt');
		const file = form.get('file');
		expect(file).toBeInstanceOf(Blob);
		expect(await (file as Blob).text()).toBe('hello');
	});

	it('attachments.upload rejects content that decodes to nothing', async () => {
		await expect(
			invoke(Attachments.attachmentsUpload, {
				fileName: 'empty.txt',
				contentBase64: '',
			}),
		).rejects.toThrow();
	});

	it('attachments.attachToItem posts to the item segment', async () => {
		respond(createdRecord);

		await invoke(Attachments.attachmentsAttachToItem, {
			externalId: 'i-1',
			fileName: 'a.txt',
			contentBase64: Buffer.from('x').toString('base64'),
		});

		const request = lastRequest();
		expect(request.path).toBe('/rest/public/attachments/item/i-1');
		expect(request.body).toBeInstanceOf(FormData);
	});

	it('attachments.attachToProject posts to the project segment', async () => {
		respond(createdRecord);

		await invoke(Attachments.attachmentsAttachToProject, {
			externalId: 'p-1',
			fileName: 'a.txt',
			contentBase64: Buffer.from('x').toString('base64'),
		});

		expect(lastRequest().path).toBe('/rest/public/attachments/project/p-1');
	});

	it('attachments.attachToPortfolio posts to the portfolio segment', async () => {
		respond(createdRecord);

		await invoke(Attachments.attachmentsAttachToPortfolio, {
			externalId: 'pf-1',
			fileName: 'a.txt',
			contentBase64: Buffer.from('x').toString('base64'),
		});

		expect(lastRequest().path).toBe('/rest/public/attachments/portfolio/pf-1');
	});

	it('attachments.attachToOrganization posts to the organization segment', async () => {
		respond(createdRecord);

		await invoke(Attachments.attachmentsAttachToOrganization, {
			externalId: 'co-1',
			fileName: 'a.txt',
			contentBase64: Buffer.from('x').toString('base64'),
		});

		expect(lastRequest().path).toBe(
			'/rest/public/attachments/customer-organization/co-1',
		);
	});
});

describe('organization settings', () => {
	it('organization.itemTypes reads the type names', async () => {
		respond(organizationItemTypes);

		const result = (await invoke(Crm.organizationItemTypes, {})) as {
			data: { name?: string }[];
		};

		expect(result.data.map((row) => row.name)).toEqual(['Ticket', 'Task']);
		expect(lastRequest().path).toBe('/rest/public/organization/itemTypes');
	});

	it('organization.containerTypes reads the container types', async () => {
		respond(organizationContainerTypes);

		const result = (await invoke(Crm.organizationContainerTypes, {})) as {
			data: { name?: string }[];
		};

		expect(result.data).toHaveLength(2);
	});

	it('organization.userTypes reads the user types', async () => {
		respond(organizationUserTypes);

		const result = (await invoke(Crm.organizationUserTypes, {})) as {
			data: { name?: string }[];
		};

		expect(result.data[0]?.name).toBe('full-time');
	});

	it('organization.lifecycleStatus reads the status names', async () => {
		respond(organizationLifecycleStatus);

		const result = (await invoke(Crm.organizationLifecycleStatus, {})) as {
			data: string[];
		};

		expect(result.data).toContain('In Progress');
	});

	it('organization.profile reads the profile', async () => {
		respond(organizationProfile);

		const result = (await invoke(Crm.organizationProfile, {})) as {
			data?: { currency?: string };
		};

		expect(result.data?.currency).toBe('USD');
		expect(lastRequest().path).toBe(
			'/rest/public/organization/profileAndPolicy',
		);
	});
});

describe('hosts and logging', () => {
	it('sends the request to a configured white-label host', async () => {
		respond(organizationItemTypes);

		await invoke(Crm.organizationItemTypes, {}, 'https://acme.onedesk.example');

		const [url] = fetchMock.mock.calls.at(-1) as [string];
		expect(url).toBe(
			'https://acme.onedesk.example/rest/public/organization/itemTypes',
		);
	});

	it('logs a failed call and still rethrows the provider error', async () => {
		respond({ code: 'ERROR_SECURITY_ACCESS' });

		await expect(
			invoke(Records.itemsFilter, { itemType: 'Ticket' }),
		).rejects.toThrow(/ERROR_SECURITY_ACCESS/);

		const logged = mockLog.mock.calls.at(-1);
		expect(logged?.[1]).toBe('onedesk.items.filter');
		expect(logged?.[3]).toBe('failed');
	});

	it('never logs the personal data that was sent with a create', async () => {
		respond(createdRecord);

		await invoke(Crm.customersCreate, {
			email: 'private@example.com',
			firstName: 'Ada',
		});

		// The saved event carries the new record's id and nothing else: an email
		// address and a name are personal data that do not belong in the log.
		const logged = mockLog.mock.calls.at(-1);
		const saved = JSON.stringify(logged?.[2]);
		expect(saved).not.toContain('private@example.com');
		expect(saved).not.toContain('Ada');
		expect(logged?.[2]).toEqual({ externalId: createdRecord.data });
	});
});
