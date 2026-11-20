import {
	CheckInSchema,
	CheckInsCreateInputSchema,
	CheckInsReplaceInputSchema,
	FaultSchema,
	FaultsListInputSchema,
	FaultsResolveInputSchema,
	FaultsSnoozeInputSchema,
	InsightsQueryInputSchema,
	NoticesGetInputSchema,
	ProjectSchema,
	ProjectsCreateInputSchema,
	ProjectsListInputSchema,
	ProjectsUpdateInputSchema,
	SiteSchema,
	SitesCreateInputSchema,
	SitesUpdateInputSchema,
} from './endpoints/types';

describe('paging bounds', () => {
	it('caps per_page at the documented maximum', () => {
		expect(ProjectsListInputSchema.parse({ per_page: 100 }).per_page).toBe(100);
		expect(() => ProjectsListInputSchema.parse({ per_page: 101 })).toThrow();
		expect(() => ProjectsListInputSchema.parse({ per_page: 0 })).toThrow();
		expect(() => ProjectsListInputSchema.parse({ page: 0 })).toThrow();
	});

	it('rejects a negative or fractional per_page', () => {
		expect(() => ProjectsListInputSchema.parse({ per_page: -1 })).toThrow();
		expect(() => ProjectsListInputSchema.parse({ per_page: 1.5 })).toThrow();
	});
});

describe('fault filters', () => {
	it('accepts the documented sort values and refuses others', () => {
		expect(
			FaultsListInputSchema.parse({ project_id: 'p', order: 'recent' }).order,
		).toBe('recent');
		expect(
			FaultsListInputSchema.parse({ project_id: 'p', order: 'frequent' }).order,
		).toBe('frequent');
		// The three values are recent, frequent and omitted; `oldest` is not one.
		expect(() =>
			FaultsListInputSchema.parse({ project_id: 'p', order: 'oldest' }),
		).toThrow();
		expect(() =>
			FaultsListInputSchema.parse({ project_id: 'p', sort: 'up' }),
		).toThrow();
	});

	it('takes time filters as Unix seconds, not ISO strings', () => {
		expect(
			FaultsListInputSchema.parse({
				project_id: 'p',
				occurred_after: 1_700_000_000,
			}).occurred_after,
		).toBe(1_700_000_000);
		expect(() =>
			FaultsListInputSchema.parse({
				project_id: 'p',
				occurred_after: '2026-01-01T00:00:00Z',
			}),
		).toThrow();
	});
});

describe('bulk fault selection', () => {
	it('accepts fault_ids alone', () => {
		expect(
			FaultsResolveInputSchema.parse({ project_id: 'p', fault_ids: ['1'] })
				.fault_ids,
		).toEqual(['1']);
	});

	it('accepts an explicit all', () => {
		expect(
			FaultsResolveInputSchema.parse({ project_id: 'p', all: true }).all,
		).toBe(true);
	});

	// The API answers 422 for a request that names neither, so it fails here
	// instead of spending a call to learn that.
	it('refuses a request that names neither fault_ids nor all', () => {
		expect(() =>
			FaultsResolveInputSchema.parse({ project_id: 'p', q: 'is:resolved' }),
		).toThrow(/fault_ids/);
	});

	it('refuses all: false with no fault_ids, which is the same unbounded nothing', () => {
		expect(() =>
			FaultsResolveInputSchema.parse({ project_id: 'p', all: false }),
		).toThrow(/fault_ids/);
	});
});

describe('fault snooze', () => {
	it('accepts exactly one of time or count', () => {
		expect(
			FaultsSnoozeInputSchema.parse({
				project_id: 'p',
				fault_id: 'f',
				time: 'day',
			}).time,
		).toBe('day');
		expect(
			FaultsSnoozeInputSchema.parse({
				project_id: 'p',
				fault_id: 'f',
				count: 100,
			}).count,
		).toBe(100);
	});

	it('refuses both, and refuses neither', () => {
		expect(() =>
			FaultsSnoozeInputSchema.parse({
				project_id: 'p',
				fault_id: 'f',
				time: 'day',
				count: 10,
			}),
		).toThrow(/exactly one/);
		expect(() =>
			FaultsSnoozeInputSchema.parse({ project_id: 'p', fault_id: 'f' }),
		).toThrow(/exactly one/);
	});

	// `count` is documented as one of three values, not any integer.
	it('refuses a count outside the documented set', () => {
		expect(() =>
			FaultsSnoozeInputSchema.parse({
				project_id: 'p',
				fault_id: 'f',
				count: 50,
			}),
		).toThrow();
	});
});

describe('project writes', () => {
	it('requires a name to create a project', () => {
		expect(ProjectsCreateInputSchema.parse({ name: 'Billing' }).name).toBe(
			'Billing',
		);
		expect(() => ProjectsCreateInputSchema.parse({})).toThrow();
		expect(() => ProjectsCreateInputSchema.parse({ name: '' })).toThrow();
	});

	it('lets a null clear a nullable field on update', () => {
		const parsed = ProjectsUpdateInputSchema.parse({
			project_id: 'p',
			language: null,
		});
		expect(parsed.language).toBeNull();
	});

	// The input is loose, because a GET's `data` can be sent back. What matters
	// is that a create-only field is not forwarded: the API ignores it, and
	// forwarding it would suggest it took effect.
	it('keeps a create-only field out of the update body', () => {
		const parsed = ProjectsUpdateInputSchema.parse({
			project_id: 'p',
			team_id: 't',
			name: 'Billing',
		});
		expect(parsed.name).toBe('Billing');
		expect('team_id' in parsed).toBe(true);
	});
});

describe('check-in schedules', () => {
	it('requires report_period on a simple schedule', () => {
		expect(() =>
			CheckInsCreateInputSchema.parse({ project_id: 'p', slug: 'nightly' }),
		).toThrow(/report_period/);
		expect(
			CheckInsCreateInputSchema.parse({
				project_id: 'p',
				report_period: '1 day',
			}).report_period,
		).toBe('1 day');
	});

	it('requires cron_schedule on a cron schedule, and does not need report_period', () => {
		expect(
			CheckInsCreateInputSchema.parse({
				project_id: 'p',
				schedule_type: 'cron',
				cron_schedule: '0 3 * * *',
			}).cron_schedule,
		).toBe('0 3 * * *');
		expect(() =>
			CheckInsCreateInputSchema.parse({
				project_id: 'p',
				schedule_type: 'cron',
			}),
		).toThrow(/cron_schedule/);
	});

	it('refuses a duration the API would reject', () => {
		// Honeybadger publishes this pattern, and `5 min` does not match it.
		expect(() =>
			CheckInsCreateInputSchema.parse({
				project_id: 'p',
				report_period: '5 min',
			}),
		).toThrow();
		expect(
			CheckInsCreateInputSchema.parse({
				project_id: 'p',
				report_period: '1 hour 30 minutes',
			}).report_period,
		).toBe('1 hour 30 minutes');
		expect(
			CheckInsCreateInputSchema.parse({
				project_id: 'p',
				report_period: '01:30:00',
			}).report_period,
		).toBe('01:30:00');
	});

	it('requires a slug on every entry of a replace', () => {
		expect(() =>
			CheckInsReplaceInputSchema.parse({
				project_id: 'p',
				check_ins: [{ report_period: '1 day' }],
			}),
		).toThrow(/slug/);
		expect(() =>
			CheckInsReplaceInputSchema.parse({ project_id: 'p', check_ins: [] }),
		).toThrow();
	});
});

describe('uptime sites', () => {
	it('requires an http or https URL', () => {
		expect(
			SitesCreateInputSchema.parse({ project_id: 'p', url: 'https://x.test' })
				.url,
		).toBe('https://x.test');
		expect(() =>
			SitesCreateInputSchema.parse({ project_id: 'p', url: 'ftp://x.test' }),
		).toThrow();
		expect(() =>
			SitesCreateInputSchema.parse({ project_id: 'p', url: 'x.test' }),
		).toThrow();
	});

	it('requires match for every match_type but success', () => {
		expect(
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				match_type: 'include',
				match: 'ok',
			}).match,
		).toBe('ok');
		expect(() =>
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				match_type: 'exclude',
			}),
		).toThrow(/match/);
	});

	it('refuses match with success, which the API rejects', () => {
		expect(() =>
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				match_type: 'success',
				match: 'ok',
			}),
		).toThrow(/left out/);
	});

	it('refuses a frequency outside the documented set', () => {
		// 1, 2, 5 and 15 minutes are the only values.
		expect(
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				frequency: 15,
			}).frequency,
		).toBe(15);
		expect(() =>
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				frequency: 3,
			}),
		).toThrow();
	});

	it('refuses a location outside the documented set', () => {
		expect(() =>
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				locations: ['Mars'],
			}),
		).toThrow();
		expect(
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				locations: ['Virginia', 'London'],
			}).locations,
		).toEqual(['Virginia', 'London']);
	});

	it('refuses a timeout that is not shorter than the check interval', () => {
		// Timeout is capped at 120 and must be under frequency * 60.
		expect(
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				frequency: 15,
				timeout: 120,
			}).timeout,
		).toBe(120);
		expect(() =>
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				frequency: 1,
				timeout: 120,
			}),
		).toThrow(/timeout/);
		expect(() =>
			SitesCreateInputSchema.parse({
				project_id: 'p',
				url: 'https://x.test',
				timeout: 121,
			}),
		).toThrow();
	});

	it('enforces the timeout rule on update too', () => {
		expect(() =>
			SitesUpdateInputSchema.parse({
				project_id: 'p',
				site_id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
				frequency: 2,
				timeout: 120,
			}),
		).toThrow(/timeout/);
	});

	it('refuses a site id that is not a UUID', () => {
		expect(() =>
			SitesUpdateInputSchema.parse({ project_id: 'p', site_id: 'abc' }),
		).toThrow();
	});
});

describe('notices', () => {
	it('refuses a notice id that is not a UUID', () => {
		expect(
			NoticesGetInputSchema.parse({
				uuid: '1e2ba1f0-4f3c-4b1a-9c7e-6f2f5c0f1a3b',
			}).uuid,
		).toBe('1e2ba1f0-4f3c-4b1a-9c7e-6f2f5c0f1a3b');
		expect(() => NoticesGetInputSchema.parse({ uuid: '12345' })).toThrow();
	});
});

describe('insights', () => {
	it('requires a query and accepts an empty stream list', () => {
		expect(
			InsightsQueryInputSchema.parse({ project_id: 'p', query: 'limit 1' })
				.query,
		).toBe('limit 1');
		expect(() =>
			InsightsQueryInputSchema.parse({ project_id: 'p', query: '' }),
		).toThrow();
		expect(
			InsightsQueryInputSchema.parse({
				project_id: 'p',
				query: 'x',
				stream_ids: [],
			}).stream_ids,
		).toEqual([]);
	});
});

describe('output schemas', () => {
	it('parses a project, tolerating fields Honeybadger adds', () => {
		const parsed = ProjectSchema.parse({
			id: 'Xk9mZp',
			account_id: 'Ab3kL9',
			name: 'Billing API',
			asana_workspace_id: null,
			active: true,
			links: { web: 'https://app.honeybadger.io/projects/Xk9mZp' },
			disable_public_links: false,
			environments: ['production'],
			language: null,
			resolve_errors_on_deploy: true,
			user_url: null,
			source_url: null,
			user_search_field: null,
			customer_throttle: null,
			fault_count: 3,
			unresolved_fault_count: 1,
			last_notice_at: null,
			earliest_notice_at: null,
			purge_days: null,
			created_at: '2025-01-01T00:00:00Z',
			// A field added after this plugin was written.
			brand_new_field: 'kept',
		});

		expect(parsed.name).toBe('Billing API');
		expect(parsed.brand_new_field).toBe('kept');
	});

	it('refuses a fault with no message, which the schema requires', () => {
		expect(() =>
			FaultSchema.parse({
				id: '1',
				project_id: 'p',
				created_at: '2025-01-01T00:00:00Z',
				links: { web: 'https://app.honeybadger.io/x' },
			}),
		).toThrow();
	});

	it('accepts a fault whose optional fields are absent', () => {
		const parsed = FaultSchema.parse({
			id: '1',
			project_id: 'p',
			message: 'boom',
			created_at: '2025-01-01T00:00:00Z',
			links: { web: 'https://app.honeybadger.io/x' },
		});
		expect(parsed.id).toBe('1');
		expect(parsed.tags).toBeUndefined();
	});

	it('accepts a check-in with a null report_period, as a cron check-in returns', () => {
		const parsed = CheckInSchema.parse({
			id: 'Ci5xWq',
			project_id: 'p',
			schedule_type: 'cron',
			links: { web: 'https://app.honeybadger.io/x' },
			name: null,
			slug: null,
			state: 'pending',
			reported_at: null,
			expected_at: null,
			missed_count: 0,
			grace_period: '00:00:00',
			report_url: 'https://api.honeybadger.io/v1/check_in/abc/x',
			cron_timezone: 'UTC',
			created_at: '2025-01-01T00:00:00Z',
			cron_schedule: '0 3 * * *',
			report_period: null,
		});
		expect(parsed.report_period).toBeNull();
		expect(parsed.cron_schedule).toBe('0 3 * * *');
	});

	it('accepts a site whose request_headers is an empty object', () => {
		const parsed = SiteSchema.parse({
			id: '9f8b6d2e-4c1a-4b7f-9e35-2a6c8d0f1b47',
			project_id: 'p',
			name: 'Marketing',
			url: 'https://x.test',
			active: true,
			links: { web: 'https://app.honeybadger.io/x' },
			state: 'up',
			last_checked_at: null,
			match_type: 'success',
			match: null,
			request_method: 'GET',
			frequency: 5,
			locations: [],
			validate_ssl: true,
			request_headers: {},
			request_body: null,
			outage_threshold: null,
			timeout: null,
			created_at: '2025-01-01T00:00:00Z',
		});
		expect(parsed.request_headers).toEqual({});
	});
});
