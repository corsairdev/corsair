import {
	JobContextGetResponseSchema,
	ProfileGetResponseSchema,
	ProfileUpdateInputSchema,
	REMOET_PROFILE_FIELD_MAX_LENGTH,
	RemoetEducationSchema,
	RemoetProjectSchema,
	RemoetWorkExperienceSchema,
} from './endpoints/types';
import { RemoetSchema } from './schema';

describe('Remoet schema', () => {
	it('declares a semver version', () => {
		expect(RemoetSchema.version).toBeDefined();
		expect(RemoetSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RemoetSchema.entities).toBe('object');
		expect(RemoetSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RemoetSchema.entities))).toBe(true);
		for (const entity of Object.values(RemoetSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Remoet profile.update input', () => {
	it('accepts any subset of the writable fields', () => {
		expect(
			ProfileUpdateInputSchema.safeParse({ githubUrl: 'https://github.com/x' })
				.success,
		).toBe(true);
		expect(
			ProfileUpdateInputSchema.safeParse({
				phone: '1',
				url: 'https://example.com',
				location: 'Remote',
				githubUrl: 'https://github.com/x',
				linkedinUrl: 'https://linkedin.com/in/x',
			}).success,
		).toBe(true);
	});

	it('rejects keys Remoet would silently drop', () => {
		expect(
			ProfileUpdateInputSchema.safeParse({ name: 'Someone' }).success,
		).toBe(false);
		expect(
			ProfileUpdateInputSchema.safeParse({ phone: '1', summary: 'x' }).success,
		).toBe(false);
	});

	it('requires at least one non-blank field', () => {
		expect(ProfileUpdateInputSchema.safeParse({}).success).toBe(false);
		expect(ProfileUpdateInputSchema.safeParse({ phone: '   ' }).success).toBe(
			false,
		);
	});

	it('enforces the length limit after trimming', () => {
		const atLimit = 'a'.repeat(REMOET_PROFILE_FIELD_MAX_LENGTH);
		const parsed = ProfileUpdateInputSchema.safeParse({
			location: `  ${atLimit}  `,
		});
		expect(parsed.success).toBe(true);
		expect(parsed.data?.location).toBe(atLimit);
		expect(
			ProfileUpdateInputSchema.safeParse({ location: `${atLimit}a` }).success,
		).toBe(false);
	});
});

describe('Remoet output schemas', () => {
	it('requires a work experience start date but allows a null or absent end date', () => {
		const role = {
			createdAt: '2025-01-01T00:00:00.000Z',
			updatedAt: '2025-01-01T00:00:00.000Z',
			title: 'Engineer',
			startDate: '2024-03-01T00:00:00.000Z',
			endDate: null,
		};
		expect(RemoetWorkExperienceSchema.safeParse(role).success).toBe(true);
		const { endDate: _endDate, ...withoutEndDate } = role;
		expect(RemoetWorkExperienceSchema.safeParse(withoutEndDate).success).toBe(
			true,
		);
		expect(
			RemoetWorkExperienceSchema.safeParse({ ...role, startDate: null })
				.success,
		).toBe(false);
		expect(
			RemoetWorkExperienceSchema.safeParse({ ...role, createdAt: undefined })
				.success,
		).toBe(false);
	});

	it('allows null start and end dates on projects and education', () => {
		expect(
			RemoetProjectSchema.safeParse({
				title: 'Side project',
				startDate: null,
				endDate: null,
			}).success,
		).toBe(true);
		expect(
			RemoetEducationSchema.safeParse({
				institution: 'Uni',
				startDate: null,
				endDate: null,
			}).success,
		).toBe(true);
	});

	it('types ghId as a number and rejects a string', () => {
		const base = {
			createdAt: '2025-01-01T00:00:00.000Z',
			updatedAt: '2025-01-01T00:00:00.000Z',
			profile: { updatedAt: '2025-01-01T00:00:00.000Z' },
			jobs: [],
			projects: [],
			linkTrees: [],
			education: [],
		};
		expect(
			ProfileGetResponseSchema.safeParse({ ...base, ghId: 42 }).success,
		).toBe(true);
		expect(
			ProfileGetResponseSchema.safeParse({ ...base, ghId: null }).success,
		).toBe(true);
		expect(
			ProfileGetResponseSchema.safeParse({ ...base, ghId: '42' }).success,
		).toBe(false);
	});

	it('parses a job-context match, including reposts and extra keys', () => {
		const match = {
			company: 'Acme',
			companySlug: 'acme',
			firstSeenAt: '2026-09-23T19:42:05.197Z',
			daysSinceFirstSeen: 3,
			firstSeenAtIsCensored: true,
			isActive: true,
			deactivatedAt: null,
			reposts: [
				{
					removedAt: '2026-08-01T00:00:00.000Z',
					repostedAt: '2026-08-10T00:00:00.000Z',
					gapDays: 9,
				},
			],
			otherOpenRoles: 2,
			isStarred: true,
			techStack: [],
			remotePolicy: null,
			remoteRestrictions: null,
			salary: null,
			experienceLevel: null,
			summary: null,
		};
		expect(JobContextGetResponseSchema.safeParse({ match }).success).toBe(true);
		expect(
			JobContextGetResponseSchema.safeParse({
				match: { ...match, salary: { from: 1, to: null } },
				extra: 'kept',
			}).success,
		).toBe(true);
		expect(
			JobContextGetResponseSchema.safeParse({
				match: { ...match, firstSeenAt: undefined },
			}).success,
		).toBe(false);
		expect(JobContextGetResponseSchema.safeParse({ match: null }).success).toBe(
			true,
		);
	});
});
