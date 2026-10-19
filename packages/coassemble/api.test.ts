import 'dotenv/config';
import { makeCoassembleRequest } from './client';
import type {
	GetClientsResponse,
	GetCoursesResponse,
	GetTrackingsResponse,
	GetUsersResponse,
} from './endpoints/types';
import { CoassembleEndpointOutputSchemas } from './endpoints/types';

// Live API tests — executed when COASSEMBLE_API_KEY and COASSEMBLE_WORKSPACE_ID
// are configured in the environment. They hit the real Coassemble headless API
// and verify that the endpoint output schemas accept the real provider response shapes.
const COASSEMBLE_API_KEY = process.env.COASSEMBLE_API_KEY;
const COASSEMBLE_WORKSPACE_ID = process.env.COASSEMBLE_WORKSPACE_ID;
const COASSEMBLE_COURSE_ID = process.env.COASSEMBLE_COURSE_ID;

const describeLiveOrSkip =
	COASSEMBLE_API_KEY && COASSEMBLE_WORKSPACE_ID ? describe : describe.skip;

describeLiveOrSkip('Coassemble Live API Tests', () => {
	const apiKey = COASSEMBLE_API_KEY ?? '';
	const workspaceId = COASSEMBLE_WORKSPACE_ID ?? '';

	it('GET /v1/headless/clients returns valid client list', async () => {
		const response = await makeCoassembleRequest<GetClientsResponse>(
			'v1/headless/clients',
			apiKey,
			workspaceId,
			{
				method: 'GET',
				query: { length: 5 },
			},
		);

		const parsed = CoassembleEndpointOutputSchemas.getClients.parse(response);
		expect(Array.isArray(parsed)).toBe(true);
		if (parsed.length > 0) {
			const firstClient = parsed[0];
			expect(typeof firstClient?.clientIdentifier).toBe('string');
		}
	});

	it('GET /v1/headless/courses returns valid course list', async () => {
		const response = await makeCoassembleRequest<GetCoursesResponse>(
			'v1/headless/courses',
			apiKey,
			workspaceId,
			{
				method: 'GET',
				query: { length: 5 },
			},
		);

		const parsed = CoassembleEndpointOutputSchemas.getCourses.parse(response);
		expect(Array.isArray(parsed)).toBe(true);
		if (parsed.length > 0) {
			const firstCourse = parsed[0];
			expect(typeof firstCourse?.id).toBe('number');
		}
	});

	it('GET /v1/headless/users returns valid user list', async () => {
		const response = await makeCoassembleRequest<GetUsersResponse>(
			'v1/headless/users',
			apiKey,
			workspaceId,
			{
				method: 'GET',
				query: { length: 5 },
			},
		);

		const parsed = CoassembleEndpointOutputSchemas.getUsers.parse(response);
		expect(Array.isArray(parsed)).toBe(true);
	});

	it('GET /v1/headless/trackings returns valid tracking records for a course', async () => {
		let courseId: number | undefined;

		if (COASSEMBLE_COURSE_ID) {
			courseId = Number(COASSEMBLE_COURSE_ID);
		} else {
			const courses = await makeCoassembleRequest<GetCoursesResponse>(
				'v1/headless/courses',
				apiKey,
				workspaceId,
				{
					method: 'GET',
					query: { length: 1 },
				},
			);
			courseId = courses[0]?.id;
		}

		if (courseId !== undefined && !Number.isNaN(courseId)) {
			const response = await makeCoassembleRequest<GetTrackingsResponse>(
				'v1/headless/trackings',
				apiKey,
				workspaceId,
				{
					method: 'GET',
					query: { id: courseId, length: 5 },
				},
			);

			const parsed =
				CoassembleEndpointOutputSchemas.getTrackings.parse(response);
			expect(Array.isArray(parsed)).toBe(true);
			if (parsed.length > 0) {
				const firstTracking = parsed[0];
				expect(typeof firstTracking?.id).toBe('number');
			}
		}
	});
});

describe('Coassemble API Contract & Schema Parsing Tests', () => {
	it('parses realistic client records matching Coassemble API output', () => {
		const rawResponse = [
			{
				clientIdentifier: 'org_acme_corp',
				userCount: 25,
				metadata: { tier: 'gold', region: 'us-east-1' },
				created: '2026-03-01T08:00:00Z',
				updated: '2026-03-02T12:00:00Z',
			},
		];

		const parsed =
			CoassembleEndpointOutputSchemas.getClients.parse(rawResponse);
		expect(parsed.length).toBe(1);
		expect(parsed[0]?.clientIdentifier).toBe('org_acme_corp');
		expect(parsed[0]?.userCount).toBe(25);
	});

	it('parses realistic course records matching Coassemble API output', () => {
		const rawResponse = [
			{
				id: 101,
				title: 'Information Security Training',
				description: 'Annual compliance and security awareness',
				timeEstimateMinutes: 45,
				active: true,
				identified: true,
				key: 'infosec-2026',
				created: '2026-01-10T10:00:00Z',
				updated: '2026-01-15T10:00:00Z',
			},
		];

		const parsed =
			CoassembleEndpointOutputSchemas.getCourses.parse(rawResponse);
		expect(parsed.length).toBe(1);
		expect(parsed[0]?.id).toBe(101);
		expect(parsed[0]?.title).toBe('Information Security Training');
		expect(parsed[0]?.timeEstimateMinutes).toBe(45);
	});

	it('parses realistic tracking records matching Coassemble API output', () => {
		const rawResponse = [
			{
				id: 5001,
				commenced: '2026-02-01T09:00:00Z',
				completed: '2026-02-01T09:40:00Z',
				email: 'learner@example.com',
				identifier: 'user_999',
				clientIdentifier: 'org_acme_corp',
				passed: true,
				score: 92,
				progress_percent: 100,
				total_time: 2400,
				progress_status: 'passed',
				attempt_count: 1,
			},
		];

		const parsed =
			CoassembleEndpointOutputSchemas.getTrackings.parse(rawResponse);
		expect(parsed.length).toBe(1);
		expect(parsed[0]?.id).toBe(5001);
		expect(parsed[0]?.passed).toBe(true);
		expect(parsed[0]?.progress_percent).toBe(100);
	});

	it('parses realistic user records matching Coassemble API output', () => {
		const rawResponse = [
			{
				identifier: 'user_999',
				clientIdentifier: 'org_acme_corp',
				name: 'Jane Doe',
				avatar: null,
				testMode: false,
				metadata: { role: 'engineer' },
				created: '2026-01-05T09:00:00Z',
				updated: '2026-01-05T09:00:00Z',
			},
		];

		const parsed =
			CoassembleEndpointOutputSchemas.getUsers.parse(rawResponse);
		expect(parsed.length).toBe(1);
		expect(parsed[0]?.identifier).toBe('user_999');
		expect(parsed[0]?.name).toBe('Jane Doe');
		expect(parsed[0]?.avatar).toBeNull();
	});

	it('accepts empty list responses across all endpoint schemas', () => {
		expect(CoassembleEndpointOutputSchemas.getClients.parse([])).toEqual([]);
		expect(CoassembleEndpointOutputSchemas.getCourses.parse([])).toEqual([]);
		expect(CoassembleEndpointOutputSchemas.getTrackings.parse([])).toEqual([]);
		expect(CoassembleEndpointOutputSchemas.getUsers.parse([])).toEqual([]);
	});
});
