import {
	GetClientsInputSchema,
	GetClientsResponseSchema,
	GetCoursesInputSchema,
	GetCoursesResponseSchema,
	GetTrackingsInputSchema,
	GetTrackingsResponseSchema,
	GetUsersInputSchema,
	GetUsersResponseSchema,
} from './endpoints/types';
import { CoassembleSchema } from './schema';

describe('CoassembleSchema & Endpoints Schemas', () => {
	describe('CoassembleSchema registration', () => {
		it('registers clients, courses, trackings and users', () => {
			expect(CoassembleSchema.version).toBe('1.0.0');
			expect(Object.keys(CoassembleSchema.entities).sort()).toEqual([
				'clients',
				'courses',
				'trackings',
				'users',
			]);
		});
	});

	describe('ClientSchema', () => {
		it('parses a valid client record', () => {
			const client = CoassembleSchema.entities.clients.parse({
				clientIdentifier: 'client-abc-123',
				userCount: 42,
				metadata: { tier: 'enterprise', active: true },
				created: '2026-01-01T00:00:00Z',
				updated: '2026-01-02T00:00:00Z',
			});

			expect(client.clientIdentifier).toBe('client-abc-123');
			expect(client.userCount).toBe(42);
			expect(client.created).toBe('2026-01-01T00:00:00Z');
		});

		it('requires clientIdentifier', () => {
			expect(() => CoassembleSchema.entities.clients.parse({})).toThrow();
		});
	});

	describe('UserSchema', () => {
		it('parses a valid user record with metadata and null fields', () => {
			const user = CoassembleSchema.entities.users.parse({
				identifier: 'user-001',
				clientIdentifier: 'client-abc-123',
				name: 'Alice Learner',
				avatar: null,
				testMode: false,
				metadata: { role: 'student', departmentId: 7 },
				created: '2026-01-01T00:00:00Z',
				updated: null,
			});

			expect(user.identifier).toBe('user-001');
			expect(user.avatar).toBeNull();
			expect(user.updated).toBeNull();
			expect(user.testMode).toBe(false);
		});

		it('parses minimal user without optional fields', () => {
			const user = CoassembleSchema.entities.users.parse({});
			expect(user.identifier).toBeUndefined();
		});
	});

	describe('CourseSchema', () => {
		it('parses a valid course record with complex fields', () => {
			const course = CoassembleSchema.entities.courses.parse({
				id: 999,
				title: 'Safety Training 101',
				description: 'Mandatory workplace safety course',
				timeEstimateMinutes: 30,
				active: true,
				start: { screenTitle: 'Welcome Screen' },
				finish: { completionText: 'Congratulations!' },
				theme: { primaryColor: '#0055ff' },
				created: '2026-01-01T00:00:00Z',
				updated: '2026-01-02T00:00:00Z',
			});

			expect(course.id).toBe(999);
			expect(course.title).toBe('Safety Training 101');
			expect(course.timeEstimateMinutes).toBe(30);
			expect(course.active).toBe(true);
		});

		it('requires numeric course id', () => {
			expect(() => CoassembleSchema.entities.courses.parse({})).toThrow();
		});
	});

	describe('TrackingSchema', () => {
		it('parses learner tracking records with scores and progress', () => {
			const tracking = CoassembleSchema.entities.trackings.parse({
				id: 54321,
				identifier: 'user-001',
				clientIdentifier: 'client-abc-123',
				commenced: '2026-02-01T10:00:00Z',
				completed: '2026-02-01T10:30:00Z',
				passed: true,
				score: 95,
				progress_percent: 100,
				progress_status: 'complete',
				total_time: 1800,
				attempt_count: 1,
			});

			expect(tracking.id).toBe(54321);
			expect(tracking.progress_percent).toBe(100);
			expect(tracking.passed).toBe(true);
			expect(tracking.total_time).toBe(1800);
		});

		it('requires tracking record id', () => {
			expect(() => CoassembleSchema.entities.trackings.parse({})).toThrow();
		});
	});

	describe('Input and Output Schemas', () => {
		it('validates GetClientsInputSchema and GetClientsResponseSchema', () => {
			const input = GetClientsInputSchema.parse({ length: 50, page: 1 });
			expect(input.length).toBe(50);
			expect(input.page).toBe(1);

			const output = GetClientsResponseSchema.parse([
				{ clientIdentifier: 'c1', userCount: 10 },
			]);
			expect(output.length).toBe(1);
		});

		it('validates GetCoursesInputSchema and GetCoursesResponseSchema', () => {
			const input = GetCoursesInputSchema.parse({
				title: 'Compliance',
				deleted: false,
			});
			expect(input.title).toBe('Compliance');
			expect(input.deleted).toBe(false);

			const output = GetCoursesResponseSchema.parse([
				{ id: 1, title: 'Compliance' },
			]);
			expect(output.length).toBe(1);
		});

		it('validates GetTrackingsInputSchema and requires id', () => {
			const input = GetTrackingsInputSchema.parse({
				id: 12,
				identifier: 'u1',
				start: '2026-01-01',
				end: '2026-01-31',
			});
			expect(input.id).toBe(12);

			expect(() => GetTrackingsInputSchema.parse({ identifier: 'u1' })).toThrow();

			const output = GetTrackingsResponseSchema.parse([
				{ id: 100, passed: true },
			]);
			expect(output.length).toBe(1);
		});

		it('validates GetUsersInputSchema and GetUsersResponseSchema', () => {
			const input = GetUsersInputSchema.parse({
				clientIdentifier: 'client-1',
				length: 10,
			});
			expect(input.clientIdentifier).toBe('client-1');

			const output = GetUsersResponseSchema.parse([
				{ identifier: 'u1', name: 'Bob' },
			]);
			expect(output.length).toBe(1);
		});
	});
});
