/**
 * Guards the persisted entity schemas against the two ways they go wrong:
 * dropping a field Ayrshare actually returns, and requiring a field Ayrshare
 * sometimes omits.
 *
 * Schedule keys were captured live on 2026-08-13. History had no posts on
 * this account (HTTP 400, code 221), so the post key list is the official
 * example from https://www.ayrshare.com/docs/apis/history/get-history.
 */

import {
	AyrshareEndpointInputSchemas as Inputs,
	AyrshareEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { AyrshareSchema } from './schema';
import { AyrshareAutoSchedule, AyrsharePost } from './schema/database';

const LIVE_SCHEDULE_KEYS = [
	'title',
	'schedule',
	'daysOfWeek',
	'excludeDates',
] as const;

const OFFICIAL_SCHEDULE_KEYS = [
	...LIVE_SCHEDULE_KEYS,
	'lastScheduleDate',
] as const;

const OFFICIAL_POST_KEYS = [
	'id',
	'post',
	'platforms',
	'postIds',
	'status',
	'created',
	'scheduleDate',
	'errors',
	'mediaUrls',
	'urls',
	'type',
	'notes',
	'profileTitle',
	'refId',
	'requiresApproval',
	'approved',
	'approvedBy',
	'approvedDate',
	'rejectedBy',
	'rejectedDate',
	'shortenLinks',
] as const;

describe('Ayrshare schema', () => {
	it('declares a semver version', () => {
		expect(AyrshareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares autoSchedules and posts', () => {
		expect(Object.keys(AyrshareSchema.entities).sort()).toEqual([
			'autoSchedules',
			'posts',
		]);
	});
});

describe('entity schemas declare every official attribute', () => {
	it('autoSchedules declares the official list/set fields', () => {
		const declared = AyrshareAutoSchedule.shape;
		for (const key of OFFICIAL_SCHEDULE_KEYS) {
			expect(declared).toHaveProperty(key);
		}
	});

	it('posts declares the official history example fields', () => {
		const declared = AyrsharePost.shape;
		for (const key of OFFICIAL_POST_KEYS) {
			expect(declared).toHaveProperty(key);
		}
	});
});

describe('entity schemas declare every live field', () => {
	it('autoSchedules declares the keys SET/LIST returned on 2026-08-13', () => {
		const declared = AyrshareAutoSchedule.shape;
		for (const key of LIVE_SCHEDULE_KEYS) {
			expect(declared).toHaveProperty(key);
		}
	});
});

describe('entity schemas require only the primary key', () => {
	it('autoSchedules parses a record carrying only title', () => {
		expect(AyrshareAutoSchedule.safeParse({ title: 'default' }).success).toBe(
			true,
		);
	});

	it('posts parses a record carrying only id', () => {
		expect(AyrsharePost.safeParse({ id: 'abc' }).success).toBe(true);
	});
});

describe('entity schemas keep unknown fields', () => {
	it('preserves a field Ayrshare adds later rather than dropping it', () => {
		const parsed = AyrshareAutoSchedule.parse({
			title: 'default',
			some_future_field: 'kept',
		});
		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});
});

describe('entity schemas reject a record with no key', () => {
	it('rejects a schedule with no title', () => {
		expect(
			AyrshareAutoSchedule.safeParse({ schedule: ['13:05Z'] }).success,
		).toBe(false);
	});

	it('rejects a post with no id', () => {
		expect(AyrsharePost.safeParse({ status: 'success' }).success).toBe(false);
	});
});

describe('setAutoSchedule input', () => {
	it('accepts a non-empty schedule', () => {
		expect(
			Inputs.setAutoSchedule.safeParse({ schedule: ['13:05Z'] }).success,
		).toBe(true);
	});

	it('accepts setStartDate without a schedule', () => {
		expect(
			Inputs.setAutoSchedule.safeParse({
				setStartDate: '2026-08-14T00:00:00Z',
			}).success,
		).toBe(true);
	});

	it('rejects an empty object and an empty schedule array', () => {
		expect(Inputs.setAutoSchedule.safeParse({}).success).toBe(false);
		expect(Inputs.setAutoSchedule.safeParse({ schedule: [] }).success).toBe(
			false,
		);
	});
});

describe('captured live responses satisfy the output schemas', () => {
	it('SET auto-schedule (live 2026-08-13)', () => {
		const captured = {
			status: 'success',
			message: 'Auto schedule set.',
			title: 'CorsairVerify',
			schedule: ['13:05Z', '20:14Z'],
			daysOfWeek: [1, 3],
			excludeDates: ['2026-12-25'],
		};
		expect(Outputs.setAutoSchedule.parse(captured)).toBeTruthy();
	});

	it('LIST auto-schedule (live 2026-08-13)', () => {
		const captured = {
			status: 'success',
			schedules: {
				CorsairVerify: {
					schedule: ['13:05Z', '20:14Z'],
					excludeDates: ['2026-12-25'],
					daysOfWeek: [1, 3],
				},
			},
		};
		expect(Outputs.listAutoSchedules.parse(captured)).toBeTruthy();
	});

	it('LIST after deleting the only schedule is an empty record, not an error', () => {
		expect(
			Outputs.listAutoSchedules.parse({
				status: 'success',
				schedules: {},
			}),
		).toBeTruthy();
	});

	it('history success example from official docs', () => {
		const captured = {
			history: [
				{
					errors: [],
					post: 'This is the  post I sent',
					platforms: ['twitter', 'facebook'],
					postIds: [
						{
							status: 'success',
							id: '1288968500063775749',
							platform: 'twitter',
						},
					],
					urls: [],
					type: 'now',
					notes: 'Approved by John Smith',
					created: '2022-05-20T17:25:06Z',
					status: 'deleted',
					scheduleDate: {
						_seconds: 1604578889,
						_nanoseconds: 211000000,
						utc: '2020-11-05T12:21:29Z',
					},
					id: 'rhn6u7wwz2WxGv6MZGK9',
				},
			],
			refId: '9abf1426d6ce9122ef11c72bd62e59807c5cc083',
			count: 100,
			lastUpdated: '2025-04-05T22:44:14.209Z',
			nextUpdate: '2025-04-05T22:45:14.209Z',
		};
		expect(Outputs.getPostHistory.parse(captured)).toBeTruthy();
	});

	it('markManualDeleted success from official docs', () => {
		expect(
			Outputs.deletePost.parse({
				status: 'success',
				id: 'p8Ee6xDPx8PRxsjtDXf3',
			}),
		).toBeTruthy();
	});
});
