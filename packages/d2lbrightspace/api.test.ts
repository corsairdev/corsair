import { createCorsair } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import type { D2LBrightspaceContext } from './index';
import { d2lbrightspace } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

// The module mock above replaces request with a Jest mock at runtime.
const http = request as jest.Mock;
const plugin = d2lbrightspace({
	baseUrl: 'https://school.example',
	key: 'token',
});
const endpoints = plugin.endpoints!;
// Endpoint seam tests supply only the key and options the endpoint reads;
// the full Corsair context is exercised separately by the bound-client test.
const ctx = {
	key: 'token',
	options: { baseUrl: 'https://school.example' },
} as D2LBrightspaceContext;
const role = { Identifier: '7', DisplayName: 'Teacher', Code: 'teacher' };

beforeEach(() => http.mockReset());

test('a bound Corsair endpoint validates and sends the bearer token', async () => {
	const client = createCorsair({ plugins: [plugin] });
	const user = {
		Identifier: '1',
		FirstName: 'A',
		LastName: 'B',
		UniqueName: 'ab',
		ProfileIdentifier: '2',
	};
	http.mockResolvedValue(user);
	await expect(client.d2lbrightspace.api.users.current({})).resolves.toEqual(
		user,
	);
	expect(http.mock.calls[0]?.[0]).toEqual(
		expect.objectContaining({ BASE: 'https://school.example', TOKEN: 'token' }),
	);
});

test('a bound Corsair endpoint reports missing credentials without a key store', async () => {
	const client = createCorsair({
		plugins: [d2lbrightspace({ baseUrl: 'https://school.example' })],
	});
	await expect(client.d2lbrightspace.api.users.current({})).rejects.toThrow(
		/auth/i,
	);
	expect(http).not.toHaveBeenCalled();
});

test('grade writes require the fields for their documented grade type', async () => {
	const base = {
		Name: 'Grade',
		ShortName: 'G',
		CategoryId: null,
		Description: { Content: '', Type: 'Text' as const },
	};
	// Deliberately bypass the static input type to exercise runtime rejection of
	// an incomplete numeric grade; a correctly typed input cannot represent it.
	await expect(
		endpoints.grades.create(ctx, {
			orgUnitId: '10',
			body: { ...base, GradeType: 'Numeric' },
		} as never),
	).rejects.toThrow();
	expect(http).not.toHaveBeenCalled();
	const body = {
		...base,
		GradeType: 'Numeric' as const,
		MaxPoints: 10,
		CanExceedMaxPoints: false,
		IsBonus: false,
		ExcludeFromFinalGradeCalculation: false,
		GradeSchemeId: null,
	};
	http.mockResolvedValue({ ...body, Id: 7, Description: { Text: '' } });
	await endpoints.grades.create(ctx, { orgUnitId: '10', body });
	expect(http.mock.calls[0]?.[1].body).toEqual(body);
});

test('current user uses the stable LP route and parses nullable pronouns', async () => {
	const user = {
		Identifier: '1',
		FirstName: 'A',
		LastName: 'B',
		UniqueName: 'ab',
		ProfileIdentifier: '2',
		Pronouns: null,
	};
	http.mockResolvedValue(user);
	await expect(endpoints.users.current(ctx, {})).resolves.toEqual(user);
	expect(http).toHaveBeenCalledWith(
		expect.objectContaining({ BASE: 'https://school.example', TOKEN: 'token' }),
		expect.objectContaining({
			method: 'GET',
			url: '/d2l/api/lp/1.49/users/whoami',
		}),
		expect.objectContaining({
			rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
		}),
	);
});

test('role listing and retrieval use their distinct documented routes', async () => {
	http
		.mockResolvedValueOnce([role])
		.mockResolvedValueOnce(role)
		.mockResolvedValueOnce([role]);
	await expect(endpoints.roles.list(ctx, {})).resolves.toEqual([role]);
	await expect(endpoints.roles.get(ctx, { roleId: '7' })).resolves.toEqual(
		role,
	);
	await expect(
		endpoints.roles.getEnrolled(ctx, { orgUnitId: '10' }),
	).resolves.toEqual([role]);
	expect(http.mock.calls.map((call) => call[1].url)).toEqual([
		'/d2l/api/lp/1.49/roles/',
		'/d2l/api/lp/1.49/roles/7',
		'/d2l/api/lp/1.49/10/roles/',
	]);
});

test('role copy sends the source as a query parameter and role name as JSON', async () => {
	http.mockResolvedValue(role);
	await expect(
		endpoints.roles.copy(ctx, {
			deepCopyRoleId: '7',
			body: { RoleName: 'Copy' },
		}),
	).resolves.toEqual(role);
	expect(http).toHaveBeenCalledWith(
		expect.objectContaining({ TOKEN: 'token' }),
		expect.objectContaining({
			method: 'POST',
			url: '/d2l/api/lp/unstable/roles/',
			query: { deepCopyRoleId: '7' },
			body: { RoleName: 'Copy' },
		}),
		expect.anything(),
	);
});

test('user search forwards a later bookmark and preserves cleared fields', async () => {
	const page = {
		PagingInfo: { Bookmark: '42', HasMoreItems: true },
		Items: [{ OrgId: 1, UserId: 42, MiddleName: null, ExternalEmail: null }],
	};
	http.mockResolvedValue(page);
	await expect(
		endpoints.users.list(ctx, { query: { bookmark: '17' } }),
	).resolves.toEqual(page);
	expect(http).toHaveBeenCalledWith(
		expect.anything(),
		expect.objectContaining({
			url: '/d2l/api/lp/1.62/users/',
			query: { bookmark: '17' },
		}),
		expect.anything(),
	);
});

test('user create, get, update and delete preserve method, query, body and empty result', async () => {
	const user = { OrgId: 1, UserId: 42 };
	const createBody = {
		OrgDefinedId: null,
		FirstName: 'A',
		MiddleName: null,
		LastName: 'B',
		ExternalEmail: null,
		UserName: 'ab',
		RoleId: 2,
		IsActive: true,
		SendCreationEmail: false,
		Pronouns: null,
	};
	const updateBody = {
		OrgDefinedId: 'x',
		FirstName: 'A',
		MiddleName: null,
		LastName: 'B',
		ExternalEmail: null,
		UserName: 'ab',
		Activation: { IsActive: true },
		Pronouns: null,
	};
	http
		.mockResolvedValueOnce(user)
		.mockResolvedValueOnce(user)
		.mockResolvedValueOnce(user)
		.mockResolvedValueOnce(undefined);
	await expect(
		endpoints.users.create(ctx, { body: createBody }),
	).resolves.toEqual(user);
	await expect(endpoints.users.get(ctx, { userId: '42' })).resolves.toEqual(
		user,
	);
	await expect(
		endpoints.users.update(ctx, { userId: '42', body: updateBody }),
	).resolves.toEqual(user);
	await expect(
		endpoints.users.delete(ctx, { userId: '42' }),
	).resolves.toBeUndefined();
	expect(
		http.mock.calls.map((call) => [call[1].method, call[1].url, call[1].body]),
	).toEqual([
		['POST', '/d2l/api/lp/1.62/users/', createBody],
		['GET', '/d2l/api/lp/1.62/users/42', undefined],
		['PUT', '/d2l/api/lp/1.62/users/42', updateBody],
		['DELETE', '/d2l/api/lp/1.62/users/42', undefined],
	]);
});

test('user creation preserves nonblank names and rejects whitespace-only names', async () => {
	const body = {
		OrgDefinedId: null,
		FirstName: ' Ada ',
		MiddleName: null,
		LastName: ' Lovelace ',
		ExternalEmail: null,
		UserName: 'ada',
		RoleId: 2,
		IsActive: true,
		SendCreationEmail: false,
		Pronouns: null,
	};
	http.mockResolvedValue({ OrgId: 1, UserId: 42 });
	await endpoints.users.create(ctx, { body });
	expect(http.mock.calls[0]?.[1].body).toEqual(body);
	await expect(
		endpoints.users.create(ctx, { body: { ...body, FirstName: '  ' } }),
	).rejects.toThrow();
	expect(http).toHaveBeenCalledTimes(1);
});

test.each(['', '.', '..', 'a/b', 'a\\b', 'a"b', "a'b"])(
	'rejects unsafe path ID %s',
	async (roleId) => {
		await expect(endpoints.roles.get(ctx, { roleId })).rejects.toThrow();
		expect(http).not.toHaveBeenCalled();
	},
);

test('rejects unsafe origins and missing OAuth tokens', async () => {
	expect(() =>
		d2lbrightspace({ baseUrl: 'https://user:pass@school.example' }),
	).toThrow();
	expect(() =>
		d2lbrightspace({ baseUrl: 'https://school.example/path' }),
	).toThrow();
	await expect(endpoints.roles.list({ ...ctx, key: '' }, {})).rejects.toThrow(
		'OAuth access token',
	);
});

test('factory supports introspection but requests require an instance origin', async () => {
	const withoutOrigin = d2lbrightspace();
	await expect(
		withoutOrigin.endpoints!.users.current({ ...ctx, options: {} }, {}),
	).rejects.toThrow('valid HTTPS origin');
});

test('rate limits preserve provider error details without retrying writes', async () => {
	const error = new ApiError(
		{ method: 'DELETE', url: '/d2l/api/lp/1.62/users/42' },
		{
			url: 'https://school.example/d2l/api/lp/1.62/users/42',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: { detail: 'Rate limited' },
		},
		'Too Many Requests',
		{ retryAfter: 5000 },
	);
	http.mockRejectedValue(error);
	await expect(endpoints.users.delete(ctx, { userId: '42' })).rejects.toBe(
		error,
	);
	expect(http).toHaveBeenCalledTimes(1);
	expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	await expect(errorHandlers.RATE_LIMIT_ERROR.handler(error)).resolves.toEqual({
		maxRetries: 0,
		headersRetryAfterMs: 5000,
	});
});

test('OAuth connections acquire tokens via Corsair and direct tokens stay supported', async () => {
	const core =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	const credentials = {
		get_integration_credentials: jest
			.fn()
			.mockResolvedValue({ client_id: 'client', client_secret: 'secret' }),
		get_access_token: jest.fn().mockResolvedValue('stored-token'),
		get_expires_at: jest
			.fn()
			.mockResolvedValue(String(Math.floor(Date.now() / 1000) + 3600)),
	};
	const oauth = d2lbrightspace();
	// These minimal key-builder contexts provide only the fields each tested
	// branch reads; full key-manager/context objects are not needed at this seam.
	const token = await oauth.keyBuilder!(
		{
			keys: credentials,
			tenantId: 'test',
			authType: 'oauth_2',
			options: {},
		} as never,
		'endpoint',
	);
	expect(token).toBe('stored-token');
	expect(credentials.get_integration_credentials).toHaveBeenCalled();
	await expect(plugin.keyBuilder!({} as never, 'endpoint')).resolves.toBe(
		'token',
	);
	await expect(
		plugin.keyBuilder!({} as never, 'webhook'),
	).rejects.toBeInstanceOf(core.AuthMissingError);
});

test('course and template operations preserve routes, bodies, and empty responses', async () => {
	const course = {
		Identifier: '10',
		Name: 'Course',
		Code: 'C',
		Path: '',
		IsActive: true,
		StartDate: null,
		EndDate: null,
		CourseTemplate: null,
		Semester: null,
		Department: null,
		Description: { Text: '', Html: null },
		CanSelfRegister: false,
	};
	const template = { Identifier: '20', Name: 'Template', Code: 'T', Path: '' };
	const schema = [
		{
			Type: { Id: 1, Name: 'Department', Code: 'Department' },
			IsNotAllowed: false,
			IsRequired: true,
		},
	];
	const courseBody = {
		Name: 'Course',
		Code: 'C',
		StartDate: null,
		EndDate: null,
		LocaleId: null,
		ForceLocale: false,
		ShowAddressBook: false,
		IsActive: true,
		Description: { Content: '', Type: 'Text' as const },
		CanSelfRegister: false,
	};
	const createBody = {
		...courseBody,
		Path: '',
		CourseTemplateId: 20,
		SemesterId: null,
	};
	const templateBody = {
		Name: 'Template',
		Code: 'T',
		Path: '',
		ParentOrgUnitIds: [1],
	};
	http
		.mockResolvedValueOnce(course)
		.mockResolvedValueOnce(schema)
		.mockResolvedValueOnce(course)
		.mockResolvedValueOnce(undefined)
		.mockResolvedValueOnce(undefined)
		.mockResolvedValueOnce(template)
		.mockResolvedValueOnce(schema)
		.mockResolvedValueOnce(template)
		.mockResolvedValueOnce(undefined)
		.mockResolvedValueOnce(undefined);
	await expect(
		endpoints.courses.get(ctx, { orgUnitId: '10' }),
	).resolves.toEqual(course);
	await expect(endpoints.courses.schema(ctx, {})).resolves.toEqual(schema);
	await expect(
		endpoints.courses.create(ctx, { body: createBody }),
	).resolves.toEqual(course);
	await expect(
		endpoints.courses.update(ctx, { orgUnitId: '10', body: courseBody }),
	).resolves.toBeUndefined();
	await expect(
		endpoints.courses.delete(ctx, { orgUnitId: '10' }),
	).resolves.toBeUndefined();
	await expect(
		endpoints.templates.get(ctx, { orgUnitId: '20' }),
	).resolves.toEqual(template);
	await expect(endpoints.templates.schema(ctx, {})).resolves.toEqual(schema);
	await expect(
		endpoints.templates.create(ctx, { body: templateBody }),
	).resolves.toEqual(template);
	await expect(
		endpoints.templates.update(ctx, {
			orgUnitId: '20',
			body: { Name: 'Template', Code: 'T' },
		}),
	).resolves.toBeUndefined();
	await expect(
		endpoints.templates.delete(ctx, { orgUnitId: '20' }),
	).resolves.toBeUndefined();
	expect(http.mock.calls.map((call) => [call[1].method, call[1].url])).toEqual([
		['GET', '/d2l/api/lp/1.62/courses/10'],
		['GET', '/d2l/api/lp/1.62/courses/schema'],
		['POST', '/d2l/api/lp/1.62/courses/'],
		['PUT', '/d2l/api/lp/1.62/courses/10'],
		['DELETE', '/d2l/api/lp/1.62/courses/10'],
		['GET', '/d2l/api/lp/1.62/coursetemplates/20'],
		['GET', '/d2l/api/lp/1.62/coursetemplates/schema'],
		['POST', '/d2l/api/lp/1.62/coursetemplates/'],
		['PUT', '/d2l/api/lp/1.62/coursetemplates/20'],
		['DELETE', '/d2l/api/lp/1.62/coursetemplates/20'],
	]);
	expect(http.mock.calls[2]?.[1].body).toEqual(createBody);
	expect(http.mock.calls[7]?.[1].body).toEqual(templateBody);
});

test('demographics requests forward filters and deletion IDs', async () => {
	const page = {
		PagingInfo: { Bookmark: 'next', HasMoreItems: true },
		Items: [
			{ UserId: 5, EntryValues: [{ Name: 'Region', Values: ['North'] }] },
		],
	};
	http.mockResolvedValueOnce(page).mockResolvedValueOnce(undefined);
	await expect(
		endpoints.demographics.getOrgUnit(ctx, {
			orgUnitId: '10',
			query: { roleIds: '1,2', bookmark: 'last' },
		}),
	).resolves.toEqual(page);
	await expect(
		endpoints.demographics.deleteUser(ctx, {
			userId: '5',
			query: { entryIds: '1,2' },
		}),
	).resolves.toBeUndefined();
	expect(http.mock.calls[0]?.[1]).toEqual(
		expect.objectContaining({
			method: 'GET',
			url: '/d2l/api/lp/1.62/demographics/orgUnits/10/users/',
			query: { roleIds: '1,2', bookmark: 'last' },
		}),
	);
	expect(http.mock.calls[1]?.[1]).toEqual(
		expect.objectContaining({
			method: 'DELETE',
			url: '/d2l/api/lp/1.62/demographics/users/5',
			query: { entryIds: '1,2' },
		}),
	);
});

test('grade operations use documented methods, responses and same-origin next links', async () => {
	const grade = {
		Id: 7,
		GradeType: 'Text',
		Name: 'Feedback',
		ShortName: 'F',
		CategoryId: null,
		Description: { Text: '', Html: null },
	};
	const body = {
		GradeType: 'Text' as const,
		Name: 'Feedback',
		ShortName: 'F',
		CategoryId: null,
		Description: { Type: 'Text' as const, Content: '' },
	};
	const setup = {
		GradingSystem: 'Points' as const,
		IsNullGradeZero: false,
		DefaultGradeSchemeId: 1,
	};
	const statistics = {
		OrgUnitId: 10,
		GradeObjectId: 7,
		Minimum: null,
		Maximum: null,
		Average: null,
		Mode: [],
		Median: null,
		StandardDeviation: null,
	};
	const page = { Next: null, Objects: [{ UserId: 1, HasAccess: true }] };
	http
		.mockResolvedValueOnce([grade])
		.mockResolvedValueOnce(grade)
		.mockResolvedValueOnce(grade)
		.mockResolvedValueOnce(grade)
		.mockResolvedValueOnce(undefined)
		.mockResolvedValueOnce(page)
		.mockResolvedValueOnce(statistics)
		.mockResolvedValueOnce(setup)
		.mockResolvedValueOnce(setup);
	await expect(
		endpoints.grades.list(ctx, { orgUnitId: '10' }),
	).resolves.toEqual([grade]);
	await expect(
		endpoints.grades.get(ctx, { orgUnitId: '10', gradeObjectId: '7' }),
	).resolves.toEqual(grade);
	await expect(
		endpoints.grades.create(ctx, { orgUnitId: '10', body }),
	).resolves.toEqual(grade);
	await expect(
		endpoints.grades.update(ctx, { orgUnitId: '10', gradeObjectId: '7', body }),
	).resolves.toEqual(grade);
	await expect(
		endpoints.grades.delete(ctx, { orgUnitId: '10', gradeObjectId: '7' }),
	).resolves.toBeUndefined();
	await expect(
		endpoints.grades.access(ctx, {
			orgUnitId: '10',
			gradeObjectId: '7',
			next: 'https://school.example/d2l/api/le/1.82/10/grades/7/access/?bookmark=next',
		}),
	).resolves.toEqual(page);
	await expect(
		endpoints.grades.statistics(ctx, { orgUnitId: '10', gradeObjectId: '7' }),
	).resolves.toEqual(statistics);
	await expect(
		endpoints.grades.setup(ctx, { orgUnitId: '10' }),
	).resolves.toEqual(setup);
	await expect(
		endpoints.grades.updateSetup(ctx, { orgUnitId: '10', body: setup }),
	).resolves.toEqual(setup);
	expect(http.mock.calls.map((call) => [call[1].method, call[1].url])).toEqual([
		['GET', '/d2l/api/le/1.82/10/grades/'],
		['GET', '/d2l/api/le/1.82/10/grades/7'],
		['POST', '/d2l/api/le/1.82/10/grades/'],
		['PUT', '/d2l/api/le/1.82/10/grades/7'],
		['DELETE', '/d2l/api/le/1.82/10/grades/7'],
		['GET', '/d2l/api/le/1.82/10/grades/7/access/?bookmark=next'],
		['GET', '/d2l/api/le/1.82/10/grades/7/statistics'],
		['GET', '/d2l/api/le/1.82/10/grades/setup/'],
		['PUT', '/d2l/api/le/1.82/10/grades/setup/'],
	]);
	await expect(
		endpoints.grades.access(ctx, {
			orgUnitId: '10',
			gradeObjectId: '7',
			next: 'https://evil.example/d2l/api/le/1.82/10/grades/7/access/',
		}),
	).rejects.toThrow('Invalid next page');
});

test('quiz and category operations preserve the documented request and response shapes', async () => {
	const text = {
		Text: { Type: 'Text' as const, Content: '' },
		IsDisplayed: false,
	};
	const body = {
		Name: 'Quiz',
		IsActive: true,
		SortOrder: 1,
		AutoExportToGrades: null,
		GradeItemId: null,
		IsAutoSetGraded: false,
		Instructions: text,
		Description: text,
		StartDate: null,
		EndDate: null,
		DueDate: null,
		DisplayInCalendar: false,
		NumberOfAttemptsAllowed: 1,
		LateSubmissionInfo: { LateSubmissionOption: 2, LateLimitMinutes: null },
		SubmissionTimeLimit: {
			IsEnforced: false,
			ShowClock: false,
			TimeLimitValue: 0,
		},
		SubmissionGracePeriod: null,
		Password: null,
		Header: text,
		Footer: text,
		AllowHints: false,
		DisableRightClick: false,
		DisablePagerAndAlerts: false,
		NotificationEmail: null,
		CalcTypeId: 1,
		RestrictIPAddressRange: null,
		CategoryId: null,
		PreventMovingBackwards: false,
		Shuffle: false,
		AllowOnlyUsersWithSpecialAccess: false,
		IsRetakeIncorrectOnly: false,
		PagingTypeId: 0,
		IsSynchronous: false,
		DeductionPercentage: null,
	};
	const quiz = { QuizId: 7, Name: 'Quiz', IsActive: true, SortOrder: 1 };
	const category = { CategoryId: 3, Name: 'Category', SortOrder: 1 };
	const attempt = {
		AttemptId: 9,
		QuizId: 7,
		UserId: 1,
		AttemptNumber: 1,
		Score: null,
		Started: '2026-01-01T00:00:00Z',
		Completed: null,
		AttemptFeedback: { Text: '', Html: null },
		FeedbackLastModified: null,
		IsPublished: false,
		IsRetakeIncorrectOnly: false,
		AttemptDueDate: null,
		AttemptEnforceTimeLimit: false,
		AttemptSubmissionTimeLimit: 0,
		AttemptSubmissionGraceLimit: 0,
		AttemptSubmissionLateTypeId: 2,
		AttemptSubmissionLateData: 0,
		AttemptIsSynchronous: false,
		DeductionPercentage: null,
	};
	const question = {
		QuestionId: 8,
		QuestionTypeId: 1,
		Name: null,
		QuestionText: { Text: 'Q' },
		Points: 1,
		Difficulty: 1,
		Bonus: false,
		Mandatory: false,
		Hint: { Text: '' },
		Feedback: { Text: '' },
		LastModified: '2026-01-01T00:00:00Z',
		LastModifiedBy: null,
		SectionId: 1,
		QuestionTemplateId: 1,
		QuestionTemplateVersionId: 1,
		QuestionInfo: { Answers: [] },
	};
	const page = <T>(item: T) => ({ Next: null, Objects: [item] });
	http
		.mockResolvedValueOnce(page(quiz))
		.mockResolvedValueOnce(quiz)
		.mockResolvedValueOnce(quiz)
		.mockResolvedValueOnce(quiz)
		.mockResolvedValueOnce(undefined)
		.mockResolvedValueOnce(page({ UserId: 1, HasAccess: true }))
		.mockResolvedValueOnce(page(attempt))
		.mockResolvedValueOnce(attempt)
		.mockResolvedValueOnce(page(question))
		.mockResolvedValueOnce(page(category))
		.mockResolvedValueOnce(category)
		.mockResolvedValueOnce(category)
		.mockResolvedValueOnce(category)
		.mockResolvedValueOnce(undefined);
	await expect(
		endpoints.quizzes.list(ctx, {
			orgUnitId: '10',
			next: '/d2l/api/le/1.82/10/quizzes/?bookmark=next',
		}),
	).resolves.toEqual(page(quiz));
	await expect(
		endpoints.quizzes.get(ctx, { orgUnitId: '10', quizId: '7' }),
	).resolves.toEqual(quiz);
	await expect(
		endpoints.quizzes.create(ctx, { orgUnitId: '10', body }),
	).resolves.toEqual(quiz);
	await expect(
		endpoints.quizzes.update(ctx, { orgUnitId: '10', quizId: '7', body }),
	).resolves.toEqual(quiz);
	await expect(
		endpoints.quizzes.delete(ctx, { orgUnitId: '10', quizId: '7' }),
	).resolves.toBeUndefined();
	await expect(
		endpoints.quizzes.access(ctx, {
			orgUnitId: '10',
			quizId: '7',
			query: { roleId: '2' },
		}),
	).resolves.toEqual(page({ UserId: 1, HasAccess: true }));
	await expect(
		endpoints.quizzes.listAttempts(ctx, {
			orgUnitId: '10',
			quizId: '7',
			query: { userId: '1' },
		}),
	).resolves.toEqual(page(attempt));
	await expect(
		endpoints.quizzes.getAttempt(ctx, {
			orgUnitId: '10',
			quizId: '7',
			attemptId: '9',
		}),
	).resolves.toEqual(attempt);
	await expect(
		endpoints.quizzes.listQuestions(ctx, { orgUnitId: '10', quizId: '7' }),
	).resolves.toEqual(page(question));
	await expect(
		endpoints.quizCategories.list(ctx, { orgUnitId: '10' }),
	).resolves.toEqual(page(category));
	await expect(
		endpoints.quizCategories.get(ctx, { orgUnitId: '10', categoryId: '3' }),
	).resolves.toEqual(category);
	await expect(
		endpoints.quizCategories.create(ctx, {
			orgUnitId: '10',
			body: { Name: 'Category', SortOrder: 1 },
		}),
	).resolves.toEqual(category);
	await expect(
		endpoints.quizCategories.update(ctx, {
			orgUnitId: '10',
			categoryId: '3',
			body: { Name: 'Category', SortOrder: 1 },
		}),
	).resolves.toEqual(category);
	await expect(
		endpoints.quizCategories.delete(ctx, { orgUnitId: '10', categoryId: '3' }),
	).resolves.toBeUndefined();
	expect(http.mock.calls.map((call) => [call[1].method, call[1].url])).toEqual([
		['GET', '/d2l/api/le/1.82/10/quizzes/?bookmark=next'],
		['GET', '/d2l/api/le/1.82/10/quizzes/7'],
		['POST', '/d2l/api/le/1.82/10/quizzes/'],
		['PUT', '/d2l/api/le/1.82/10/quizzes/7'],
		['DELETE', '/d2l/api/le/1.82/10/quizzes/7'],
		['GET', '/d2l/api/le/1.82/10/quizzes/7/access/'],
		['GET', '/d2l/api/le/1.82/10/quizzes/7/attempts/'],
		['GET', '/d2l/api/le/1.82/10/quizzes/7/attempts/9'],
		['GET', '/d2l/api/le/1.82/10/quizzes/7/questions/'],
		['GET', '/d2l/api/le/1.82/10/quizzes/categories/'],
		['GET', '/d2l/api/le/1.82/10/quizzes/categories/3'],
		['POST', '/d2l/api/le/1.82/10/quizzes/categories/'],
		['PUT', '/d2l/api/le/1.82/10/quizzes/categories/3'],
		['DELETE', '/d2l/api/le/1.82/10/quizzes/categories/3'],
	]);
	expect(http.mock.calls[2]?.[1].body).toEqual(body);
	expect(http.mock.calls[5]?.[1].query).toEqual({ roleId: '2' });
	expect(http.mock.calls[6]?.[1].query).toEqual({ userId: '1' });
});
