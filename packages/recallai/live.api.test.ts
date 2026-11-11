import type { RecallaiContext } from './index';
import { recallai } from './index';

/**
 * Live pass against a real Recall.ai workspace. CI skips *api.test.ts; run it
 * with LIVE_TEST=1 RECALLAI_API_KEY=... [RECALLAI_REGION=us-west-2] npx jest
 * live.api.test.ts. Reads only, plus free round trips that clean up after
 * themselves (a Google login group, and a bot scheduled a week out that is
 * deleted before it can join anything).
 */
const apiKey = process.env.RECALLAI_API_KEY?.trim();
const storedRegion = process.env.RECALLAI_REGION?.trim();
const liveTestEnabled = process.env.LIVE_TEST === '1';
const liveBots = process.env.RECALLAI_LIVE_BOTS === '1';

const liveSuite = apiKey && liveTestEnabled ? describe : describe.skip;

type Outcome = { op: string; result: string };

const makeContext = (region: string | undefined): RecallaiContext =>
	({
		key: apiKey ?? '',
		options: {},
		$getAccountId: async () => 'recallai-live-test',
		// The region goes through the stored-account path, as a hosted tenant's would.
		keys: { get_region: async () => region ?? null },
	}) as unknown as RecallaiContext;
// why safe: the endpoints read only key, options, keys.get_region and
// $getAccountId; event logging without a database is a logged no-op.

liveSuite('Recall.ai live API', () => {
	const plugin = recallai({});
	const outcomes: Outcome[] = [];
	const ctx = makeContext(storedRegion);

	const run = async <T>(
		op: string,
		call: () => Promise<T>,
		describeResult: (value: T) => string = () => 'ok',
	): Promise<T | undefined> => {
		try {
			const value = await call();
			outcomes.push({ op, result: `ok ${describeResult(value)}` });
			return value;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			outcomes.push({ op, result: `FAIL ${message.slice(0, 300)}` });
			return undefined;
		}
	};
	// These two helpers serve every paged list in the plugin (bots, recordings,
	// transcripts, calendars…), whose row types differ. They only read the row
	// count and an `id`, so rows stay `unknown` and the id is checked at runtime
	// instead of naming a union of every response type here.
	const count = (value: { results: unknown[] }) =>
		`${value.results.length} rows`;
	const firstId = (value: { results: unknown[] } | undefined) => {
		const row = value?.results[0];
		return row && typeof row === 'object' && 'id' in row
			? String((row as { id: unknown }).id)
			: undefined;
	};

	afterAll(() => {
		console.log(
			outcomes.map(({ op, result }) => `${op.padEnd(42)} ${result}`).join('\n'),
		);
	});

	it('reads every list and the first record of each', async () => {
		const e = plugin.endpoints;
		if (!e) throw new Error('Recall.ai endpoints are missing');

		const bots = await run(
			'bots.list',
			() => e.bots.list(ctx, { page: 1 }),
			count,
		);
		await run(
			'bots.list (cursor)',
			() => e.bots.list(ctx, { use_cursor: 'true', status: ['done'] }),
			count,
		);
		const botId = firstId(bots);
		if (botId)
			await run('bots.retrieve', () => e.bots.retrieve(ctx, { id: botId }));

		const recordings = await run(
			'recordings.list',
			() => e.recordings.list(ctx, { status_code: 'done' }),
			count,
		);
		const recordingId = firstId(recordings);
		if (recordingId)
			await run('recordings.retrieve', () =>
				e.recordings.retrieve(ctx, { id: recordingId }),
			);

		const realtime = await run(
			'realtimeEndpoints.list',
			() => e.realtimeEndpoints.list(ctx, {}),
			count,
		);
		const realtimeId = firstId(realtime);
		if (realtimeId)
			await run('realtimeEndpoints.retrieve', () =>
				e.realtimeEndpoints.retrieve(ctx, { id: realtimeId }),
			);

		const uploads = await run(
			'sdkUploads.list',
			() => e.sdkUploads.list(ctx, {}),
			count,
		);
		const uploadId = firstId(uploads);
		if (uploadId)
			await run('sdkUploads.retrieve', () =>
				e.sdkUploads.retrieve(ctx, { id: uploadId }),
			);

		for (const group of [
			'meetingMetadata',
			'participantEvents',
			'transcripts',
			'audioMixed',
			'audioSeparate',
			'videoMixed',
			'videoSeparate',
		] as const) {
			const endpoints = e[group];
			const page = await run(
				`${group}.list`,
				() => endpoints.list(ctx, { status_code: 'done' }),
				count,
			);
			const id = firstId(page);
			if (id)
				await run(`${group}.retrieve`, () => endpoints.retrieve(ctx, { id }));
		}

		await run(
			'calendar.listUsers',
			() => e.calendar.listUsers(ctx, {}),
			(value) =>
				Array.isArray(value)
					? `${value.length} rows`
					: `${value.results.length} rows`,
		);
		const calendars = await run(
			'calendars.list',
			() => e.calendars.list(ctx, {}),
			count,
		);
		const calendarId = firstId(calendars);
		if (calendarId) {
			await run('calendars.retrieve', () =>
				e.calendars.retrieve(ctx, { id: calendarId }),
			);
			await run('calendar.listEvents', () =>
				e.calendar.listEvents(ctx, { calendar_id: calendarId }),
			);
		}

		const groups = await run(
			'googleLoginGroups.list',
			() => e.googleLoginGroups.list(ctx, {}),
			count,
		);
		const groupId = firstId(groups);
		if (groupId)
			await run('googleLoginGroups.retrieve', () =>
				e.googleLoginGroups.retrieve(ctx, { id: groupId }),
			);
		await run('googleLogins.list', () => e.googleLogins.list(ctx, {}), count);

		await run(
			'billing.retrieveUsage',
			() =>
				e.billing.retrieveUsage(ctx, {
					start: '2026-10-01T00:00:00Z',
					end: '2026-11-06T00:00:00Z',
				}),
			(value) => `bot_total=${value.bot_total}`,
		);
		const directConnects = await run(
			'meetingDirectConnects.list',
			() => e.meetingDirectConnects.list(ctx, {}),
			(value) => `${value.length} rows`,
		);
		const directConnectId = directConnects?.[0]?.id;
		if (directConnectId)
			await run('meetingDirectConnects.retrieve', () =>
				e.meetingDirectConnects.retrieve(ctx, { id: directConnectId }),
			);

		await run(
			'zoomMeetingsToCredentials.list',
			() => e.zoomMeetingsToCredentials.list(ctx, {}),
			count,
		);
		await run(
			'zoomOAuthAppLogs.list',
			() => e.zoomOAuthAppLogs.list(ctx, {}),
			count,
		);
		const apps = await run(
			'zoomOAuthApps.list',
			() => e.zoomOAuthApps.list(ctx, {}),
			count,
		);
		const appId = firstId(apps);
		if (appId)
			await run('zoomOAuthApps.retrieve', () =>
				e.zoomOAuthApps.retrieve(ctx, { id: appId }),
			);
		await run(
			'zoomOAuthCredentialLogs.list',
			() => e.zoomOAuthCredentialLogs.list(ctx, {}),
			count,
		);
		const credentials = await run(
			'zoomOAuthCredentials.list',
			() => e.zoomOAuthCredentials.list(ctx, {}),
			count,
		);
		const credentialId = firstId(credentials);
		if (credentialId)
			await run('zoomOAuthCredentials.retrieve', () =>
				e.zoomOAuthCredentials.retrieve(ctx, { id: credentialId }),
			);

		expect(outcomes.filter(({ result }) => result.startsWith('FAIL'))).toEqual(
			[],
		);
	}, 120_000);

	it('round-trips a Google login group', async () => {
		const e = plugin.endpoints;
		if (!e) throw new Error('Recall.ai endpoints are missing');
		const created = await run('googleLoginGroups.create', () =>
			e.googleLoginGroups.create(ctx, {
				name: `corsair-live-test-${Date.now()}`,
				login_mode: 'only_if_required',
			}),
		);
		if (!created) throw new Error('create failed');
		try {
			await run('googleLoginGroups.retrieve (new)', () =>
				e.googleLoginGroups.retrieve(ctx, { id: created.id }),
			);
			await run(
				'googleLoginGroups.partialUpdate',
				() =>
					e.googleLoginGroups.partialUpdate(ctx, {
						id: created.id,
						login_mode: 'always',
					}),
				(value) => `login_mode=${value.login_mode}`,
			);
		} finally {
			await run('googleLoginGroups.delete', () =>
				e.googleLoginGroups.delete(ctx, { id: created.id }),
			);
		}
		expect(outcomes.filter(({ result }) => result.startsWith('FAIL'))).toEqual(
			[],
		);
	}, 60_000);

	(liveBots ? it : it.skip)(
		'schedules a bot a week out and deletes it before it can join',
		async () => {
			const e = plugin.endpoints;
			if (!e) throw new Error('Recall.ai endpoints are missing');
			const joinAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
			const created = await run('bots.create (scheduled)', () =>
				e.bots.create(ctx, {
					meeting_url: 'https://meet.google.com/xqz-cors-tst',
					bot_name: 'Corsair live test',
					join_at: joinAt,
					metadata: { source: 'corsair-live-test' },
				}),
			);
			if (!created) throw new Error('create failed');
			try {
				await run('bots.retrieve (new)', () =>
					e.bots.retrieve(ctx, { id: created.id }),
				);
				await run(
					'bots.list (bot present)',
					() => e.bots.list(ctx, { page: 1 }),
					count,
				);
				// A scheduled bot is not in a call, so Recall refuses the action;
				// this checks the route and the error mapping, not the action.
				await run(
					'botActions.sendChatMessage (not in call)',
					async () => {
						try {
							await e.botActions.sendChatMessage(ctx, {
								id: created.id,
								message: 'hello',
							});
							return 'unexpected success';
						} catch (error) {
							const status = (error as { status?: number }).status;
							return `rejected with ${status}`;
						}
					},
					(value) => value,
				);
				await run(
					'bots.update (scheduled)',
					() =>
						e.bots.update(ctx, {
							id: created.id,
							bot_name: 'Corsair live test (renamed)',
						}),
					(value) => `bot_name=${value.bot_name}`,
				);
			} finally {
				await run('bots.delete (scheduled)', () =>
					e.bots.delete(ctx, { id: created.id }),
				);
			}
			// A 404 confirms the scheduled bot is gone and will not join anything.
			await expect(
				e.bots.retrieve(ctx, { id: created.id }),
			).rejects.toMatchObject({ status: 404 });
			outcomes.push({ op: 'bots.retrieve (after delete)', result: 'ok 404' });
			expect(
				outcomes.filter(({ result }) => result.startsWith('FAIL')),
			).toEqual([]);
		},
		60_000,
	);

	it('round-trips a calendar v1 user through its auth token', async () => {
		const e = plugin.endpoints;
		if (!e) throw new Error('Recall.ai endpoints are missing');
		const auth = await run('calendar.authenticate', () =>
			e.calendar.authenticate(ctx, { user_id: `corsair-live-${Date.now()}` }),
		);
		const token = typeof auth?.token === 'string' ? auth.token : undefined;
		if (!token) throw new Error('no calendar auth token');
		try {
			await run('calendar.retrieveUser', () =>
				e.calendar.retrieveUser(ctx, { calendar_auth_token: token }),
			);
			await run(
				'calendar.listMeetings',
				() => e.calendar.listMeetings(ctx, { calendar_auth_token: token }),
				(value) => `${value.length} rows`,
			);
			await run('calendar.updateUser', () =>
				e.calendar.updateUser(ctx, {
					calendar_auth_token: token,
					preferences: { record_external: false },
				}),
			);
		} finally {
			await run('calendar.deleteUser', () =>
				e.calendar.deleteUser(ctx, { calendar_auth_token: token }),
			);
		}
		expect(outcomes.filter(({ result }) => result.startsWith('FAIL'))).toEqual(
			[],
		);
	}, 60_000);

	it('fails cleanly when the key is sent to another region', async () => {
		const e = plugin.endpoints;
		if (!e) throw new Error('Recall.ai endpoints are missing');
		const other = storedRegion?.startsWith('eu-central-1')
			? 'us-east-1'
			: 'eu-central-1';
		await expect(
			e.bots.list(makeContext(other), { page: 1 }),
		).rejects.toMatchObject({
			name: 'RecallaiAPIError',
			status: 401,
			message: expect.stringContaining('check the region setting'),
		});
		outcomes.push({
			op: `bots.list on ${other}`,
			result: 'ok 401 as expected',
		});
	}, 30_000);
});
