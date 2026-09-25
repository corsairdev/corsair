import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeRemoetRequest, RemoetAPIError } from './client';
import { Education, Projects, WorkExperience } from './endpoints';
import type {
	EducationCreateResponse,
	ProjectsCreateResponse,
	RemoetContext,
	WorkExperienceCreateResponse,
} from './index';
import { TEST_KEY, testContext } from './test-utils';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeRemoetRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeRemoetRequest);
const mockLog = jest.mocked(logEventFromContext);

const context = testContext();
const KEY = TEST_KEY;
const ID = '65f0000000000000000000e1';

/** The error the client throws for a Remoet error response, as in discovery.test.ts. */
function remoetError(status: number, message: string): RemoetAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://api.remoet.dev/user',
			ok: false,
			status,
			statusText: '',
			body: { statusCode: status, message },
		},
		message,
	);
	return new RemoetAPIError(message, { cause });
}

const workExperience: WorkExperienceCreateResponse = {
	id: ID,
	createdAt: '2026-09-20T00:00:00.000Z',
	updatedAt: '2026-09-20T00:00:00.000Z',
	userId: null,
	title: 'Staff Engineer',
	startDate: '2024-01-15',
	endDate: null,
	isCurrent: true,
	isPublic: true,
	companyName: 'Example Co',
	technologies: ['TypeScript'],
	description: null,
	isRemote: true,
	companyUrl: null,
	listingId: null,
};

const project: ProjectsCreateResponse = {
	id: ID,
	title: 'corsair-remoet',
	shortDescription: 'A Corsair plugin',
	technologies: null,
	isCurrent: null,
	isRemote: null,
	isOpenSource: true,
	description: null,
	role: null,
	startDate: null,
	endDate: null,
	repoUrl: null,
	demoUrl: null,
	jobId: null,
};

const education: EducationCreateResponse = {
	id: ID,
	institution: 'Example University',
	institutionUrl: null,
	studyLevel: 'BACHELOR',
	fieldOfStudy: null,
	startDate: null,
	endDate: null,
	isCurrent: false,
	description: null,
};

describe('Remoet profile item writes', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('workExperience', () => {
		it('creates a work experience entry', async () => {
			mockRequest.mockResolvedValueOnce(workExperience);

			const response = await WorkExperience.create(context, {
				title: 'Staff Engineer',
				startDate: '2024-01-15',
			});

			expect(response.id).toBe(ID);
			expect(mockRequest).toHaveBeenCalledWith('/user/jobs', KEY, {
				method: 'POST',
				body: { title: 'Staff Engineer', startDate: '2024-01-15' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.workExperience.create',
				{ id: ID },
				'completed',
			);
		});

		it('rejects null, an empty date and unknown keys before calling Remoet', async () => {
			await expect(
				WorkExperience.create(context, {
					title: 'Staff Engineer',
					startDate: '2024-01-15',
					// @ts-expect-error: null is never accepted on create
					companyName: null,
				}),
			).rejects.toThrow();
			await expect(
				WorkExperience.create(context, {
					title: 'Staff Engineer',
					startDate: '',
				}),
			).rejects.toThrow();
			await expect(
				WorkExperience.create(context, {
					title: 'Staff Engineer',
					startDate: '2024-01-15',
					// @ts-expect-error: unknown key, paired with valid fields
					nickname: 'Staffy',
				}),
			).rejects.toThrow();
			await expect(
				WorkExperience.create(context, {
					technologies: Array.from({ length: 51 }, (_, i) => `t${i}`),
					title: 'x',
					startDate: '2024-01-15',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it("clears companyName with '' and empties technologies with []", async () => {
			mockRequest.mockResolvedValueOnce({
				...workExperience,
				companyName: '',
				technologies: [],
			});

			const response = await WorkExperience.update(context, {
				id: ID,
				companyName: '',
				technologies: [],
			});

			expect(response.companyName).toBe('');
			expect(mockRequest).toHaveBeenCalledWith(`/user/jobs/${ID}`, KEY, {
				method: 'PATCH',
				body: { companyName: '', technologies: [] },
			});
		});

		it('updates by id, sending only the changed fields', async () => {
			mockRequest.mockResolvedValueOnce({
				...workExperience,
				isCurrent: false,
			});

			const response = await WorkExperience.update(context, {
				id: ID,
				isCurrent: false,
			});

			expect(response.isCurrent).toBe(false);
			expect(mockRequest).toHaveBeenCalledWith(`/user/jobs/${ID}`, KEY, {
				method: 'PATCH',
				body: { isCurrent: false },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.workExperience.update',
				{ id: ID },
				'completed',
			);
		});

		it('deletes by id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: ID });

			const response = await WorkExperience.delete(context, { id: ID });

			expect(response).toEqual({ deleted: true, id: ID });
			expect(mockRequest).toHaveBeenCalledWith(`/user/jobs/${ID}`, KEY, {
				method: 'DELETE',
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.workExperience.delete',
				{ id: ID },
				'completed',
			);
		});
	});

	describe('projects', () => {
		it('creates a project, requiring title and shortDescription', async () => {
			mockRequest.mockResolvedValueOnce(project);

			const response = await Projects.create(context, {
				title: 'corsair-remoet',
				shortDescription: 'A Corsair plugin',
			});

			expect(response.id).toBe(ID);
			expect(mockRequest).toHaveBeenCalledWith('/user/projects', KEY, {
				method: 'POST',
				body: { title: 'corsair-remoet', shortDescription: 'A Corsair plugin' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.projects.create',
				{ id: ID },
				'completed',
			);
		});

		it('rejects a missing shortDescription and an empty startDate', async () => {
			await expect(
				// @ts-expect-error: shortDescription is required
				Projects.create(context, { title: 'corsair-remoet' }),
			).rejects.toThrow();
			await expect(
				Projects.create(context, {
					title: 'corsair-remoet',
					shortDescription: 'A Corsair plugin',
					startDate: '',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it("clears role with '' and empties technologies with []", async () => {
			mockRequest.mockResolvedValueOnce({
				...project,
				role: '',
				technologies: [],
			});

			const response = await Projects.update(context, {
				id: ID,
				role: '',
				technologies: [],
			});

			expect(response.role).toBe('');
			expect(mockRequest).toHaveBeenCalledWith(`/user/projects/${ID}`, KEY, {
				method: 'PATCH',
				body: { role: '', technologies: [] },
			});
		});

		it('updates by id', async () => {
			mockRequest.mockResolvedValueOnce({ ...project, isOpenSource: false });

			const response = await Projects.update(context, {
				id: ID,
				isOpenSource: false,
			});

			expect(response.isOpenSource).toBe(false);
			expect(mockRequest).toHaveBeenCalledWith(`/user/projects/${ID}`, KEY, {
				method: 'PATCH',
				body: { isOpenSource: false },
			});
		});

		it('deletes by id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: ID });

			const response = await Projects.delete(context, { id: ID });

			expect(response).toEqual({ deleted: true, id: ID });
			expect(mockRequest).toHaveBeenCalledWith(`/user/projects/${ID}`, KEY, {
				method: 'DELETE',
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.projects.delete',
				{ id: ID },
				'completed',
			);
		});
	});

	describe('education', () => {
		it('creates an education entry, requiring institution', async () => {
			mockRequest.mockResolvedValueOnce(education);

			const response = await Education.create(context, {
				institution: 'Example University',
				studyLevel: 'BACHELOR',
			});

			expect(response.id).toBe(ID);
			expect(mockRequest).toHaveBeenCalledWith('/user/education', KEY, {
				method: 'POST',
				body: { institution: 'Example University', studyLevel: 'BACHELOR' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.education.create',
				{ id: ID },
				'completed',
			);
		});

		it('rejects a missing institution and a bad studyLevel', async () => {
			await expect(
				// @ts-expect-error: institution is required
				Education.create(context, { studyLevel: 'BACHELOR' }),
			).rejects.toThrow();
			await expect(
				Education.create(context, {
					institution: 'Example University',
					// @ts-expect-error: not a Remoet study level
					studyLevel: 'PHD',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it("clears institutionUrl with ''", async () => {
			// Remoet answers null for an empty institutionUrl.
			mockRequest.mockResolvedValueOnce({ ...education, institutionUrl: null });

			const response = await Education.update(context, {
				id: ID,
				institutionUrl: '',
			});

			expect(response.institutionUrl).toBeNull();
			expect(mockRequest).toHaveBeenCalledWith(`/user/education/${ID}`, KEY, {
				method: 'PATCH',
				body: { institutionUrl: '' },
			});
		});

		it('updates by id', async () => {
			mockRequest.mockResolvedValueOnce({ ...education, isCurrent: true });

			const response = await Education.update(context, {
				id: ID,
				isCurrent: true,
			});

			expect(response.isCurrent).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(`/user/education/${ID}`, KEY, {
				method: 'PATCH',
				body: { isCurrent: true },
			});
		});

		it('deletes by id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: ID });

			const response = await Education.delete(context, { id: ID });

			expect(response).toEqual({ deleted: true, id: ID });
			expect(mockRequest).toHaveBeenCalledWith(`/user/education/${ID}`, KEY, {
				method: 'DELETE',
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.education.delete',
				{ id: ID },
				'completed',
			);
		});
	});
});

// ── Shared mutation contract, checked identically for every item group ───────

// `any` here (test-only, not part of the package's public surface) sidesteps
// each group's distinct, stricter input type: this contract deliberately
// feeds malformed and unknown-key input.
type ItemGroupApi = {
	create: (ctx: RemoetContext, input: any) => Promise<{ id: string }>;
	update: (ctx: RemoetContext, input: any) => Promise<{ id: string }>;
	delete: (
		ctx: RemoetContext,
		input: any,
	) => Promise<{ deleted: boolean; id: string }>;
};

const GROUPS: Array<{
	name: 'workExperience' | 'projects' | 'education';
	api: ItemGroupApi;
	path: string;
	validCreateInput: Record<string, unknown>;
	fixture: { id: string };
}> = [
	{
		name: 'workExperience',
		api: WorkExperience,
		path: '/user/jobs',
		validCreateInput: { title: 'Staff Engineer', startDate: '2024-01-15' },
		fixture: workExperience,
	},
	{
		name: 'projects',
		api: Projects,
		path: '/user/projects',
		validCreateInput: {
			title: 'corsair-remoet',
			shortDescription: 'A Corsair plugin',
		},
		fixture: project,
	},
	{
		name: 'education',
		api: Education,
		path: '/user/education',
		validCreateInput: { institution: 'Example University' },
		fixture: education,
	},
];

describe.each(GROUPS)(
	'$name mutation contract',
	({ name, api, path, validCreateInput, fixture }) => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		it('create rejects an unknown key even alongside otherwise-valid fields', async () => {
			await expect(
				api.create(context, { ...validCreateInput, notAField: true }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('update requires at least one field besides id', async () => {
			await expect(api.update(context, { id: ID })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('update rejects a malformed id even with a valid field', async () => {
			await expect(
				api.update(context, { id: 'not-24-hex', isCurrent: true }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('delete rejects a malformed id', async () => {
			await expect(api.delete(context, { id: 'not-24-hex' })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('logs the create, update and delete events under remoet.<group>.<op>', async () => {
			mockRequest.mockResolvedValueOnce(fixture);
			await api.create(context, validCreateInput);
			expect(mockLog).toHaveBeenCalledWith(
				context,
				`remoet.${name}.create`,
				{ id: fixture.id },
				'completed',
			);

			mockRequest.mockResolvedValueOnce(fixture);
			await api.update(context, { id: ID, isCurrent: true });
			expect(mockLog).toHaveBeenCalledWith(
				context,
				`remoet.${name}.update`,
				{ id: fixture.id },
				'completed',
			);

			mockRequest.mockResolvedValueOnce({ deleted: true, id: ID });
			await api.delete(context, { id: ID });
			expect(mockLog).toHaveBeenCalledWith(
				context,
				`remoet.${name}.delete`,
				{ id: ID },
				'completed',
			);
		});

		it('surfaces a 404 on update without logging a false success', async () => {
			mockRequest.mockRejectedValueOnce(remoetError(404, 'Not found'));

			await expect(
				api.update(context, { id: ID, isCurrent: true }),
			).rejects.toMatchObject({ status: 404, message: 'Not found' });
			expect(mockLog).not.toHaveBeenCalled();
			expect(mockRequest).toHaveBeenCalledWith(`${path}/${ID}`, KEY, {
				method: 'PATCH',
				body: { isCurrent: true },
			});
		});

		it('surfaces a 404 on delete without logging a false success', async () => {
			mockRequest.mockRejectedValueOnce(remoetError(404, 'Not found'));

			await expect(api.delete(context, { id: ID })).rejects.toMatchObject({
				status: 404,
				message: 'Not found',
			});
			expect(mockLog).not.toHaveBeenCalled();
		});
	},
);
