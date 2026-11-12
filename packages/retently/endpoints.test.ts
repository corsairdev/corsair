import { logEventFromContext } from 'corsair/core';
import {
	Account,
	Campaigns,
	Companies,
	Customers,
	Feedback,
	Outbox,
	Reports,
	Survey,
	Templates,
} from './endpoints';
import { attributesQuery } from './endpoints/call';
import {
	BAD_KEY,
	CAMPAIGN_NOT_FOUND,
	CAMPAIGNS,
	COMPANIES,
	COMPANY_GET,
	CUSTOMER_GET,
	CUSTOMER_NOT_FOUND_IN_200,
	CUSTOMERS,
	CUSTOMERS_DELETED,
	CUSTOMERS_RESUBSCRIBED,
	CUSTOMERS_UNSUBSCRIBED,
	CUSTOMERS_UPSERTED,
	FEEDBACK_GET,
	FEEDBACK_IMPORTED,
	FEEDBACKS,
	NOT_TRANSACTIONAL,
	OUTBOX,
	PING,
	READ_ONLY_KEY,
	REPORTS,
	SURVEY_QUEUED,
	TEMPLATE,
	TEMPLATE_NOT_FOUND,
	TEMPLATES,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.ping', () => {
	it('reads the account snapshot from /ping', async () => {
		respond(fetchMock, PING);

		const result = (await invoke(Account.ping, {})) as {
			data?: {
				account?: { name?: string };
				plan?: { credits?: { surveys?: { remaining?: number } } };
			};
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/ping');
		expect(lastRequest(fetchMock).method).toBe('GET');
		expect(result.data?.account?.name).toBe('Acme Inc');
		expect(result.data?.plan?.credits?.surveys?.remaining).toBe(4766);
	});

	it('logs the account, contacts and remaining credits, never the key', async () => {
		respond(fetchMock, PING);

		await invoke(Account.ping, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'retently.account.ping',
			{ account: 'Acme Inc', contacts: 12500, remaining: 4766 },
			'completed',
		);
	});
});

describe('customers.list', () => {
	it('passes paging, sorting and the date window as query parameters', async () => {
		respond(fetchMock, CUSTOMERS);

		await invoke(Customers.list, {
			page: 2,
			limit: 50,
			sort: 'createdDate',
			startDate: '2024-01-01',
			endDate: '1704067200',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/customers');
		expect(request.query).toMatchObject({
			page: '2',
			limit: '50',
			sort: 'createdDate',
			startDate: '2024-01-01',
			endDate: '1704067200',
		});
	});

	it('finds a customer by email', async () => {
		respond(fetchMock, CUSTOMERS);

		await invoke(Customers.list, { email: 'jimsmith@acme.com' });

		expect(lastRequest(fetchMock).query.email).toBe('jimsmith@acme.com');
	});

	it('returns the rows with the documented paging envelope', async () => {
		respond(fetchMock, CUSTOMERS);

		const result = (await invoke(Customers.list, {})) as {
			// unknown: only the row count is asserted, not the rows' shape.
			data?: { subscribers?: unknown[]; total?: number };
		};

		expect(result.data?.subscribers).toHaveLength(1);
		expect(result.data?.total).toBe(1);
	});

	it('keeps a custom property whose value is a number', async () => {
		respond(fetchMock, CUSTOMERS);

		const result = (await invoke(Customers.list, {})) as {
			data?: {
				// unknown: a property value is a string, number or boolean by type.
				subscribers?: { properties?: { name?: string; value?: unknown }[] }[];
			};
		};

		const arr = result.data?.subscribers?.[0]?.properties?.find(
			(property) => property.name === 'total_account_arr',
		);
		expect(arr?.value).toBe(4860);
	});

	it('rejects a limit over the documented maximum of 1,000', async () => {
		await expect(invoke(Customers.list, { limit: 1001 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts exactly the documented maximum', async () => {
		respond(fetchMock, CUSTOMERS);

		await invoke(Customers.list, { limit: 1000 });

		expect(lastRequest(fetchMock).query.limit).toBe('1000');
	});

	it('rejects a page below 1', async () => {
		await expect(invoke(Customers.list, { page: 0 })).rejects.toThrow();
	});
});

describe('attributesQuery', () => {
	it('flattens a filter into the bracketed indexed keys Retently documents', () => {
		expect(
			attributesQuery([{ name: 'country', op: 'equal', value: 'US' }]),
		).toEqual({
			'attributes[0][name]': 'country',
			'attributes[0][op]': 'equal',
			'attributes[0][value]': 'US',
		});
	});

	it('indexes every filter', () => {
		const query = attributesQuery([
			{ name: 'country', op: 'equal', value: 'US' },
			{ name: 'plan', op: 'not_equal', value: 'free' },
		]);

		expect(Object.keys(query)).toHaveLength(6);
		expect(query['attributes[1][name]']).toBe('plan');
	});

	it('omits the value for exists and not_exists', () => {
		const query = attributesQuery([{ name: 'phone', op: 'exists' }]);

		expect(query).toEqual({
			'attributes[0][name]': 'phone',
			'attributes[0][op]': 'exists',
		});
	});

	it('joins a list for the in operator', () => {
		const query = attributesQuery([
			{ name: 'segment', op: 'in', value: ['smb', 'enterprise'] },
		]);

		expect(query['attributes[0][value]']).toBe('smb,enterprise');
	});

	it('keeps a numeric value numeric in the query string', () => {
		const query = attributesQuery([
			{ name: 'arr', op: 'greater_than', value: 1000 },
		]);

		expect(query['attributes[0][value]']).toBe('1000');
	});

	it('returns nothing for an empty list', () => {
		expect(attributesQuery([])).toEqual({});
		expect(attributesQuery(undefined)).toEqual({});
	});

	it('sends the filters as real query parameters, not one nested key', async () => {
		respond(fetchMock, CUSTOMERS);

		await invoke(Customers.list, {
			attributes: [{ name: 'country', op: 'equal', value: 'US' }],
			match: 'all',
		});

		const request = lastRequest(fetchMock);
		expect(request.query['attributes[0][name]']).toBe('country');
		expect(request.query['attributes[0][op]']).toBe('equal');
		expect(request.query['attributes[0][value]']).toBe('US');
		expect(request.query.match).toBe('all');
	});
});

describe('customers.get', () => {
	it('reads one customer by ID', async () => {
		respond(fetchMock, CUSTOMER_GET);

		const result = (await invoke(Customers.get, {
			customerId: '5a9d595701c85b38114b5a1',
		})) as {
			data?: { email?: string };
		};

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v2/customers/5a9d595701c85b38114b5a1',
		);
		expect(result.data?.email).toBe('john@example.com');
	});

	it('logs a found customer from the object Retently returns in data', async () => {
		respond(fetchMock, CUSTOMER_GET);

		await invoke(Customers.get, { customerId: '5a9d595701c85b38114b5a1' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'retently.customers.get',
			{ found: true },
			'completed',
		);
	});

	it('throws a not-found error when the 404 is only in the envelope', async () => {
		respond(fetchMock, CUSTOMER_NOT_FOUND_IN_200);

		// unknown: the rejection is narrowed by the assertions below.
		const error = (await invoke(Customers.get, {
			customerId: '000000000000000000000000',
		}).catch((e: unknown) => e)) as { status?: number; isNotFound?: boolean };

		expect(error.status).toBe(404);
		expect(error.isNotFound).toBe(true);
	});

	it('percent-encodes the ID', async () => {
		respond(fetchMock, CUSTOMER_GET);

		await invoke(Customers.get, { customerId: 'a/b c' });

		expect(lastRequest(fetchMock).path).toBe('/api/v2/customers/a%2Fb%20c');
	});

	it('rejects an empty ID without calling the API', async () => {
		await expect(invoke(Customers.get, { customerId: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('customers.upsert', () => {
	it('sends the batch under subscribers', async () => {
		respond(fetchMock, CUSTOMERS_UPSERTED);

		await invoke(Customers.upsert, {
			subscribers: [
				{
					email: 'johnsmith@example.com',
					first_name: 'John',
					tags: ['foo', 'bar'],
				},
			],
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/customers');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord?.subscribers).toEqual([
			{
				email: 'johnsmith@example.com',
				first_name: 'John',
				tags: ['foo', 'bar'],
			},
		]);
	});

	it('parses the per-email results the upsert returns', async () => {
		respond(fetchMock, CUSTOMERS_UPSERTED);

		const result = (await invoke(Customers.upsert, {
			subscribers: [{ email: 'johnsmith@example.com' }],
		})) as {
			data?: Record<string, { status?: string; company?: string }>;
		};

		expect(result.data?.['johnsmith@example.com']?.status).toBe('created');
		expect(result.data?.['johnsmith@example.com']?.company).toBe('ACME');
	});

	it('counts the customers the upsert returned', async () => {
		respond(fetchMock, CUSTOMERS_UPSERTED);

		await invoke(Customers.upsert, {
			subscribers: [{ email: 'johnsmith@example.com' }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'retently.customers.upsert',
			{ sent: 1, returned: 1 },
			'completed',
		);
	});

	it('carries unset_properties and unset_tags through unchanged', async () => {
		respond(fetchMock, CUSTOMERS_UPSERTED);

		await invoke(Customers.upsert, {
			subscribers: [
				{
					email: 'john@example.com',
					unset_properties: ['old_region', 'legacy_tier'],
					unset_tags: ['churned'],
				},
			],
		});

		const subscribers = lastRequest(fetchMock).bodyRecord?.subscribers as {
			unset_properties?: string[];
			unset_tags?: string[];
		}[];
		expect(subscribers[0]?.unset_properties).toEqual([
			'old_region',
			'legacy_tier',
		]);
		expect(subscribers[0]?.unset_tags).toEqual(['churned']);
	});

	it('rejects an empty batch', async () => {
		await expect(
			invoke(Customers.upsert, { subscribers: [] }),
		).rejects.toThrow();
	});

	it('rejects more than the documented 1,000 customers', async () => {
		const subscribers = Array.from({ length: 1001 }, (_, index) => ({
			email: `person${index}@example.com`,
		}));

		await expect(invoke(Customers.upsert, { subscribers })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a subscriber without an email', async () => {
		await expect(
			invoke(Customers.upsert, { subscribers: [{ first_name: 'John' }] }),
		).rejects.toThrow();
	});

	it('declares the batch not replayable, since a retry would duplicate new customers', async () => {
		respond(fetchMock, CUSTOMERS_UPSERTED);

		await invoke(Customers.upsert, {
			subscribers: [{ email: 'a@example.com' }],
		});
		// A 5xx here must not be retried; the handlers read this flag.
		expect(lastRequest(fetchMock).method).toBe('POST');
	});
});

describe('customers.unsubscribe', () => {
	it('sends the emails with the message', async () => {
		respond(fetchMock, CUSTOMERS_UNSUBSCRIBED);

		const result = (await invoke(Customers.unsubscribe, {
			subscribers: [{ email: 'john.smith@example.com' }],
			message: 'Unsubscribed by owner.',
		})) as { data?: { email?: string; unsubscribed?: boolean }[] };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/customers/unsubscribe');
		expect(request.bodyRecord).toEqual({
			subscribers: [{ email: 'john.smith@example.com' }],
			message: 'Unsubscribed by owner.',
		});
		expect(result.data?.[0]?.unsubscribed).toBe(true);
	});

	it('omits message when the caller does not set one', async () => {
		respond(fetchMock, CUSTOMERS_UNSUBSCRIBED);

		await invoke(Customers.unsubscribe, {
			subscribers: [{ email: 'john.smith@example.com' }],
		});

		expect(lastRequest(fetchMock).bodyRecord).toEqual({
			subscribers: [{ email: 'john.smith@example.com' }],
		});
	});
});

describe('customers.resubscribe', () => {
	it('returns a result per contact, including the ones left alone', async () => {
		respond(fetchMock, CUSTOMERS_RESUBSCRIBED);

		const result = (await invoke(Customers.resubscribe, {
			subscribers: [{ email: 'john.smith@example.com' }],
		})) as { data?: { email?: string; status?: string; reason?: string }[] };

		expect(result.data).toHaveLength(6);
		expect(result.data?.[2]).toMatchObject({
			status: 'skipped',
			reason: 'self-unsubscribed',
		});
	});

	it('logs the four outcomes separately', async () => {
		respond(fetchMock, CUSTOMERS_RESUBSCRIBED);

		await invoke(Customers.resubscribe, {
			subscribers: [{ email: 'john.smith@example.com' }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'retently.customers.resubscribe',
			{ requested: 1, resubscribed: 2, skipped: 2, notFound: 1 },
			'completed',
		);
	});

	it('surfaces the suppressed flag so a caller knows delivery may still fail', async () => {
		respond(fetchMock, CUSTOMERS_RESUBSCRIBED);

		const result = (await invoke(Customers.resubscribe, {
			subscribers: [{ email: 'john.smith@example.com' }],
		})) as { data?: { email?: string; suppressed?: boolean }[] };

		const suppressed = result.data?.find(
			(entry) => entry.email === 'ok-but-suppressed@example.com',
		);
		expect(suppressed?.suppressed).toBe(true);
	});
});

describe('customers.delete', () => {
	it('deletes by email and reports each result', async () => {
		respond(fetchMock, CUSTOMERS_DELETED);

		const result = (await invoke(Customers.remove, {
			subscribers: [{ email: 'john.smith@example.com' }],
		})) as { data?: { deleted?: boolean }[] };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/api/v2/customers');
		expect(request.bodyRecord).toEqual({
			subscribers: [{ email: 'john.smith@example.com' }],
		});
		expect(result.data?.[0]?.deleted).toBe(true);
	});
});

describe('companies.list', () => {
	it('passes paging and sorting', async () => {
		respond(fetchMock, COMPANIES);

		await invoke(Companies.list, { limit: 10, sort: '-companyName' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/companies');
		expect(request.query).toMatchObject({ limit: '10', sort: '-companyName' });
	});

	it('keeps the CX metrics, including one that is null', async () => {
		respond(fetchMock, COMPANIES);

		const result = (await invoke(Companies.list, {})) as {
			data?: {
				companies?: { cxMetrics?: { NPS?: number; STAR?: number | null } }[];
			};
		};

		expect(result.data?.companies?.[0]?.cxMetrics?.NPS).toBe(71);
		expect(result.data?.companies?.[0]?.cxMetrics?.STAR).toBeNull();
	});
});

describe('companies.get', () => {
	it('reads a company by ID', async () => {
		respond(fetchMock, COMPANY_GET);

		const result = (await invoke(Companies.get, {
			companyId: '60444db01eeeb6bf89799999',
		})) as {
			data?: { companyName?: string };
		};

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v2/companies/60444db01eeeb6bf89799999',
		);
		expect(result.data?.companyName).toBe('ACME');
	});

	it('accepts a domain in the same segment', async () => {
		respond(fetchMock, COMPANY_GET);

		await invoke(Companies.get, { companyId: 'acme.com' });

		expect(lastRequest(fetchMock).path).toBe('/api/v2/companies/acme.com');
	});
});

describe('feedback.list', () => {
	it('filters by customer, campaign and date', async () => {
		respond(fetchMock, FEEDBACKS);

		await invoke(Feedback.list, {
			email: 'john@example.com',
			campaignId: '60d983411991aad3dc2da064',
			startDate: '2024-01-01',
			limit: 10,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/feedback');
		expect(request.query).toMatchObject({
			email: 'john@example.com',
			campaignId: '60d983411991aad3dc2da064',
			startDate: '2024-01-01',
			limit: '10',
		});
	});

	it('parses the score, comment, topics and additional answers', async () => {
		respond(fetchMock, FEEDBACKS);

		const result = (await invoke(Feedback.list, {})) as {
			data?: {
				responses?: {
					score?: number;
					comment?: string;
					feedbackTopics?: { name?: string }[];
					// unknown: an answer is a number, string or list by question type.
					additionalQuestions?: { type?: string; answer?: unknown }[];
				}[];
			};
		};

		const response = result.data?.responses?.[0];
		expect(response?.score).toBe(5);
		expect(response?.comment).toBe('I love everything about your product.');
		expect(response?.feedbackTopics).toHaveLength(3);
		expect(response?.additionalQuestions?.[0]?.answer).toBe(10);
	});

	it('rejects the maximum-plus-one limit', async () => {
		await expect(invoke(Feedback.list, { limit: 1001 })).rejects.toThrow();
	});
});

describe('feedback.get', () => {
	it('reads one response by feedback ID', async () => {
		respond(fetchMock, FEEDBACK_GET);

		const result = (await invoke(Feedback.get, {
			feedbackId: '5f1faaa4b4e2e4963e41893b',
		})) as { data?: { responses?: { id?: string }[] } };

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v2/feedback/5f1faaa4b4e2e4963e41893b',
		);
		expect(result.data?.responses?.[0]?.id).toBe('5f1faaa4b4e2e4963e41893b');
	});
});

describe('feedback.import', () => {
	it('sends campaign_id and the feedback array', async () => {
		respond(fetchMock, FEEDBACK_IMPORTED);

		await invoke(Feedback.importFeedback, {
			campaign_id: '5a9d595701c85b37224ab2d0',
			feedback: [
				{
					email: 'john.smith@example.com',
					score: 9,
					comment: 'Loved the onboarding experience!',
					response_date: '2024-01-15T10:30:00Z',
				},
			],
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/import');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord?.campaign_id).toBe('5a9d595701c85b37224ab2d0');
		expect(request.bodyRecord?.feedback).toHaveLength(1);
		// options is only sent when the caller sets it.
		expect(request.bodyRecord?.options).toBeUndefined();
	});

	it('sends options when present', async () => {
		respond(fetchMock, FEEDBACK_IMPORTED);

		await invoke(Feedback.importFeedback, {
			campaign_id: '5a9d595701c85b37224ab2d0',
			feedback: [{ email: 'a@example.com', score: 9 }],
			options: { skip_duplicates: false, duplicate_check_window: 90 },
		});

		expect(lastRequest(fetchMock).bodyRecord?.options).toEqual({
			skip_duplicates: false,
			duplicate_check_window: 90,
		});
	});

	it('reports imported, skipped and failed counts with the reasons', async () => {
		respond(fetchMock, FEEDBACK_IMPORTED);

		const result = (await invoke(Feedback.importFeedback, {
			campaign_id: '5a9d595701c85b37224ab2d0',
			feedback: [{ email: 'a@example.com', score: 9 }],
		})) as {
			data?: {
				imported?: number;
				skipped?: number;
				failed?: number;
				details?: {
					failed?: { email?: string; reason?: string; field?: string }[];
				};
			};
		};

		expect(result.data?.imported).toBe(3);
		expect(result.data?.details?.failed?.[0]).toMatchObject({
			field: 'score',
			reason: 'Invalid score for nps',
		});
	});

	it('rejects a RATING answer without its metric', async () => {
		await expect(
			invoke(Feedback.importFeedback, {
				campaign_id: 'c1',
				feedback: [
					{
						email: 'a@example.com',
						score: 9,
						additional_questions: [
							{ uuid: 'b1c2d3e4-0002', type: 'RATING', answer: 5 },
						],
					},
				],
			}),
		).rejects.toThrow(/metric/i);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a RATING answer with its metric', async () => {
		respond(fetchMock, FEEDBACK_IMPORTED);

		await invoke(Feedback.importFeedback, {
			campaign_id: 'c1',
			feedback: [
				{
					email: 'a@example.com',
					score: 9,
					additional_questions: [
						{
							uuid: 'b1c2d3e4-0002',
							type: 'RATING',
							answer: 5,
							metric: 'csat',
						},
					],
				},
			],
		});

		expect(fetchMock).toHaveBeenCalled();
	});

	it('does not demand a metric for an OPEN_ENDED answer', async () => {
		respond(fetchMock, FEEDBACK_IMPORTED);

		await invoke(Feedback.importFeedback, {
			campaign_id: 'c1',
			feedback: [
				{
					email: 'a@example.com',
					score: 9,
					additional_questions: [
						{
							uuid: 'b1c2d3e4-0001',
							type: 'OPEN_ENDED',
							answer: 'Great support',
						},
					],
				},
			],
		});

		expect(fetchMock).toHaveBeenCalled();
	});

	it('rejects more than the documented 200 responses', async () => {
		const feedback = Array.from({ length: 201 }, (_, index) => ({
			email: `person${index}@example.com`,
			score: 9,
		}));

		await expect(
			invoke(Feedback.importFeedback, { campaign_id: 'c1', feedback }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a duplicate_check_window outside 1-365', async () => {
		await expect(
			invoke(Feedback.importFeedback, {
				campaign_id: 'c1',
				feedback: [{ email: 'a@example.com', score: 9 }],
				options: { duplicate_check_window: 366 },
			}),
		).rejects.toThrow();
	});

	it('rejects an unknown topic sentiment', async () => {
		await expect(
			invoke(Feedback.importFeedback, {
				campaign_id: 'c1',
				feedback: [
					{
						email: 'a@example.com',
						score: 9,
						topics: [{ name: 'Onboarding', sentiment: 'mixed' }],
					},
				],
			}),
		).rejects.toThrow();
	});

	it('logs the counts', async () => {
		respond(fetchMock, FEEDBACK_IMPORTED);

		await invoke(Feedback.importFeedback, {
			campaign_id: 'c1',
			feedback: [{ email: 'a@example.com', score: 9 }],
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'retently.feedback.import',
			{ imported: 3, skipped: 1, failed: 1 },
			'completed',
		);
	});
});

describe('campaigns.list', () => {
	it('reads the campaigns, which sit at the top level rather than under data', async () => {
		respond(fetchMock, CAMPAIGNS);

		const result = (await invoke(Campaigns.list, {})) as {
			campaigns?: { type?: string; metric?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/campaigns');
		expect(result.campaigns?.[0]?.type).toBe('transactional');
		expect(result.campaigns?.[0]?.metric).toBe('NPS');
	});
});

describe('reports.get', () => {
	it('reads all campaigns from /reports/', async () => {
		respond(fetchMock, REPORTS);

		const result = (await invoke(Reports.get, {})) as {
			data?: { campaignId?: string; last?: { score?: number } }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/reports/');
		expect(result.data?.[0]?.last?.score).toBe(52);
	});

	it('scopes the report to one campaign through the path', async () => {
		respond(fetchMock, REPORTS);

		await invoke(Reports.get, { campaignId: '5f1ec45y27b8313876299999' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/reports/5f1ec45y27b8313876299999');
		// The campaign never appears twice.
		expect(request.query['Campaign ID']).toBeUndefined();
	});

	it('passes a YYYY-MM-DD window', async () => {
		respond(fetchMock, REPORTS);

		await invoke(Reports.get, {
			startDate: '2024-01-01',
			endDate: '2024-12-31',
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			startDate: '2024-01-01',
			endDate: '2024-12-31',
		});
	});

	it('rejects a full ISO timestamp, which this route alone refuses', async () => {
		await expect(
			invoke(Reports.get, { startDate: '2024-01-01T00:00:00Z' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('parses the delivery stats and per-question stats', async () => {
		respond(fetchMock, REPORTS);

		const result = (await invoke(Reports.get, {})) as {
			data?: {
				deliveryStats?: { responded?: number };
				questionsStats?: {
					uuid?: string;
					stats?: { last?: { score?: number } };
				}[];
			}[];
		};

		expect(result.data?.[0]?.deliveryStats?.responded).toBe(512);
		expect(result.data?.[0]?.questionsStats?.[0]?.stats?.last?.score).toBe(1);
	});

	it('keeps the rating distribution keys as strings', async () => {
		respond(fetchMock, REPORTS);

		const result = (await invoke(Reports.get, {})) as {
			data?: { last?: { ratingDistribution?: Record<string, number> } }[];
		};

		expect(result.data?.[0]?.last?.ratingDistribution?.['10']).toBe(15);
	});
});

describe('outbox.list', () => {
	it('filters by channel and sender', async () => {
		respond(fetchMock, OUTBOX);

		await invoke(Outbox.list, { channel: 'email', sentBy: 'campaign' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/outbox');
		expect(request.query).toMatchObject({
			channel: 'email',
			sentBy: 'campaign',
		});
	});

	it('defaults to sorting by surveyCreatedDate', async () => {
		respond(fetchMock, OUTBOX);

		await invoke(Outbox.list, { sort: '-surveyCreatedDate' });

		expect(lastRequest(fetchMock).query.sort).toBe('-surveyCreatedDate');
	});

	it('keeps personTags as the JSON string Retently sends', async () => {
		respond(fetchMock, OUTBOX);

		const result = (await invoke(Outbox.list, {})) as {
			data?: { surveys?: { personTags?: string }[] };
		};

		expect(typeof result.data?.surveys?.[0]?.personTags).toBe('string');
		expect(result.data?.surveys?.[0]?.personTags).toBe('[]');
	});

	it('parses an opted-out record whose detailedStatus is present', async () => {
		respond(fetchMock, OUTBOX);

		const result = (await invoke(Outbox.list, {})) as {
			data?: {
				surveys?: {
					detailedStatus?: { isOpened?: boolean; hasFeedback?: boolean };
				}[];
			};
		};

		expect(result.data?.surveys?.[1]?.detailedStatus?.isOpened).toBe(true);
		expect(result.data?.surveys?.[1]?.detailedStatus?.hasFeedback).toBe(false);
	});

	it('rejects a channel Retently does not document', async () => {
		await expect(invoke(Outbox.list, { channel: 'sms' })).rejects.toThrow();
	});

	it('rejects a sentBy value Retently does not document', async () => {
		await expect(invoke(Outbox.list, { sentBy: 'api' })).rejects.toThrow();
	});
});

describe('templates', () => {
	it('lists templates at the top level', async () => {
		respond(fetchMock, TEMPLATES);

		const result = (await invoke(Templates.list, {})) as {
			templates?: { id?: string; metric?: string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/templates');
		expect(result.templates?.[0]?.metric).toBe('STAR');
	});

	it('reads one template with its questions', async () => {
		respond(fetchMock, TEMPLATE);

		const result = (await invoke(Templates.get, {
			templateId: '628765bf87439560a1b2c3d4',
		})) as {
			data?: {
				surveyQuestions?: { uuid?: string; type?: string; isMain?: boolean }[];
			};
		};

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v2/templates/628765bf87439560a1b2c3d4',
		);
		expect(result.data?.surveyQuestions).toHaveLength(3);
		expect(result.data?.surveyQuestions?.[0]?.isMain).toBe(true);
	});

	it('keeps the option UUIDs an import needs', async () => {
		respond(fetchMock, TEMPLATE);

		const result = (await invoke(Templates.get, { templateId: 't1' })) as {
			data?: { surveyQuestions?: { options?: { uuid?: string }[] }[] };
		};

		expect(result.data?.surveyQuestions?.[2]?.options?.[0]?.uuid).toBe('opt-1');
	});
});

describe('survey.send', () => {
	it('queues a transactional survey', async () => {
		respond(fetchMock, SURVEY_QUEUED);

		const result = (await invoke(Survey.send, {
			campaign: '5a9d595701c85b37224ab2d0',
			subscribers: [{ email: 'john.smith@example.com', first_name: 'John' }],
		})) as { status?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/survey');
		expect(request.bodyRecord).toEqual({
			campaign: '5a9d595701c85b37224ab2d0',
			subscribers: [{ email: 'john.smith@example.com', first_name: 'John' }],
		});
		expect(result.status).toBe('queued');
	});

	it('sends delay when set', async () => {
		respond(fetchMock, SURVEY_QUEUED);

		await invoke(Survey.send, {
			campaign: 'c1',
			delay: 7,
			subscribers: [{ email: 'a@example.com' }],
		});

		expect(lastRequest(fetchMock).bodyRecord?.delay).toBe(7);
	});

	it('omits delay when unset, so the campaign time frame applies', async () => {
		respond(fetchMock, SURVEY_QUEUED);

		await invoke(Survey.send, {
			campaign: 'c1',
			subscribers: [{ email: 'a@example.com' }],
		});

		expect(lastRequest(fetchMock).bodyRecord?.delay).toBeUndefined();
	});

	it('rejects more than the documented 100 recipients', async () => {
		const subscribers = Array.from({ length: 101 }, (_, index) => ({
			email: `person${index}@example.com`,
		}));

		await expect(
			invoke(Survey.send, { campaign: 'c1', subscribers }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('throws a refusal that arrives inside a 200 like the same refusal sent as a 400', async () => {
		respond(fetchMock, {
			success: false,
			status: 'error',
			code: 400,
			message: 'Campaign 5a9d595701c85b37224ab2d0 is not transactional',
		});

		// unknown: the rejection is narrowed by the assertions below.
		const error = (await invoke(Survey.send, {
			campaign: 'c1',
			subscribers: [{ email: 'a@example.com' }],
		}).catch((e: unknown) => e)) as {
			status?: number;
			isValidationError?: boolean;
			message?: string;
		};

		expect(error.status).toBe(400);
		expect(error.isValidationError).toBe(true);
		expect(error.message).toContain('not transactional');
	});
});

describe('error propagation', () => {
	it('turns a 401 into the plugin error', async () => {
		respond(fetchMock, BAD_KEY, 401);

		await expect(invoke(Account.ping, {})).rejects.toThrow('Account not found');
	});

	it('turns a 403 on a write into a permission error the caller can read', async () => {
		respond(fetchMock, READ_ONLY_KEY, 403);

		// unknown: the rejection is narrowed by the assertion below.
		const error = (await invoke(Survey.send, {
			campaign: 'c1',
			subscribers: [{ email: 'a@example.com' }],
		}).catch((e: unknown) => e)) as { status?: number; message?: string };

		expect(error.status).toBe(403);
		expect(error.message).toContain('write permission');
	});

	it('surfaces a 400 as a validation error', async () => {
		respond(fetchMock, NOT_TRANSACTIONAL, 400);

		await expect(
			invoke(Survey.send, {
				campaign: 'c1',
				subscribers: [{ email: 'a@example.com' }],
			}),
		).rejects.toThrow('not transactional');
	});

	it('surfaces a 404 with the campaign that was missing', async () => {
		respond(fetchMock, CAMPAIGN_NOT_FOUND, 404);

		await expect(
			invoke(Survey.send, {
				campaign: '5a9d595701c85b37224ab2d0',
				subscribers: [{ email: 'a@example.com' }],
			}),
		).rejects.toThrow('could not be found');
	});

	it('surfaces a 404 from a template lookup', async () => {
		respond(fetchMock, TEMPLATE_NOT_FOUND, 404);

		await expect(
			invoke(Templates.get, { templateId: 'missing' }),
		).rejects.toThrow('Template not found.');
	});
});
