import { logEventFromContext } from 'corsair/core';
import { basicAuthHeader, TalentHRAPIError } from './client';
import { Employees, Organization, ReferenceData, TimeOff } from './endpoints';
import {
	deletedResponse,
	departmentsResponse,
	directoryResponse,
	divisionResponse,
	divisionsResponse,
	employeeResponse,
	employmentStatusesResponse,
	employmentStatusOptionsResponse,
	hiredEmployeeResponse,
	jobTitlesResponse,
	locationsResponse,
	notFoundResponse,
	rehireResponse,
	terminatedResponse,
	timeOffBudgetsResponse,
	timeOffCreatedResponse,
	timeOffListResponse,
	timeOffTypesResponse,
	unauthorizedResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'talenthr-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type, so assertions below
// see the real result rather than unknown.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://pubapi.talenthr.io');
	expect(sent.headers.get('authorization')).toBe(basicAuthHeader(API_KEY));
	// The key travels as the Basic username and never as a bearer token.
	expect(sent.headers.get('authorization')).not.toContain('Bearer');
}

/**
 * Resolves to the rejection reason, narrowed to the plugin's own error type.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before the typeof check narrows it.
 */
async function rejection(promise: Promise<unknown>): Promise<TalentHRAPIError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(TalentHRAPIError);
	return caught as TalentHRAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('employees.directory', () => {
	it('GETs /v1/directory and passes limit, offset, filter and custom fields', async () => {
		respond(directoryResponse);

		const result = await invoke(Employees.directory, {
			limit: 25,
			offset: 50,
			filter: 'department_id:6,division_id:13',
			customFields: 'custom-field-001,custom-field-002',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/directory',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			limit: '25',
			offset: '50',
			filter: 'department_id:6,division_id:13',
			custom_fields: 'custom-field-001,custom-field-002',
		});
		expect(result.total).toBe(1);
		expect(result.rows[0]?.first_name).toBe('John');
	});

	it('sends no query at all when the caller passes nothing', async () => {
		respond({ success: true, data: { total: 0, rows: [] } });

		await invoke(Employees.directory, {});

		expect(lastRequest().query).toEqual({});
	});
});

describe('employees.get', () => {
	it('GETs /v1/employees/{id} and unwraps data', async () => {
		respond(employeeResponse);

		const result = await invoke(Employees.get, { employeeId: 15 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/15',
			method: 'GET',
		});
		expect(result.id).toBe(15);
		expect(result.seniority?.years).toBe(12);
		expect(result.user_role?.slug).toBe('employee');
	});

	it('rejects a non-positive employee id before sending', async () => {
		await expect(invoke(Employees.get, { employeeId: 0 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('employees.hire', () => {
	it('POSTs /v1/employees/hire with the documented body', async () => {
		respond(hiredEmployeeResponse);

		const result = await invoke(Employees.hire, {
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			hire_date: '2024-02-29',
			employment_status: { employment_status_id: 1 },
			reports_to_employee_id: 15,
			job_record: { job_title_id: 25, department_id: 6 },
			prevent_email: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/hire',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			hire_date: '2024-02-29',
			employment_status: { employment_status_id: 1 },
			reports_to_employee_id: 15,
			job_record: { job_title_id: 25, department_id: 6 },
			prevent_email: true,
		});
		expect(result.id).toBe(41);
	});

	it('accepts a null manager for a head-of-company hire', async () => {
		respond(hiredEmployeeResponse);

		await invoke(Employees.hire, {
			first_name: 'Ada',
			last_name: 'Lovelace',
			email: 'ada@example.com',
			hire_date: '2024-03-01',
			employment_status: { employment_status_id: 1 },
			reports_to_employee_id: null,
		});

		expect(lastRequest().body).toMatchObject({
			reports_to_employee_id: null,
		});
	});

	it('rejects a hire date that is not YYYY-MM-DD', async () => {
		await expect(
			invoke(Employees.hire, {
				first_name: 'John',
				last_name: 'Doe',
				email: 'john.doe@example.com',
				hire_date: '29/02/2024',
				employment_status: { employment_status_id: 1 },
				reports_to_employee_id: 15,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('employees.update', () => {
	it('PUTs /v1/employees/{id} with the required identity fields and the changes', async () => {
		respond(employeeResponse);

		await invoke(Employees.update, {
			employeeId: 15,
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			work_phone: '+30 210 0000000',
			city: 'Athens',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/15',
			method: 'PUT',
		});
		// The path id must not reappear in the body.
		expect(lastRequest().body).toEqual({
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			work_phone: '+30 210 0000000',
			city: 'Athens',
		});
	});

	it('rejects an update without the name and email TalentHR requires', async () => {
		// The route treats the body as the full contact record, so a partial
		// update would be refused by the provider; the schema stops it first.
		await expect(
			invoke(Employees.update, { employeeId: 15, work_phone: '+30 210' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends reports_to_employee_id as null to clear the manager', async () => {
		respond(employeeResponse);

		await invoke(Employees.update, {
			employeeId: 15,
			first_name: 'John',
			last_name: 'Doe',
			email: 'john.doe@example.com',
			reports_to_employee_id: null,
		});

		expect(lastRequest().body).toMatchObject({
			reports_to_employee_id: null,
		});
	});
});

describe('employees.terminate', () => {
	it('POSTs /v1/employees/{id}/terminate and parses is_active as a number', async () => {
		respond(terminatedResponse);

		const result = await invoke(Employees.terminate, {
			employeeId: 34,
			effective_date: '2024-03-04',
			termination_reason: 'Relocation',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/34/terminate',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			effective_date: '2024-03-04',
			termination_reason: 'Relocation',
		});
		// TalentHR sends 0, not false, so the schema must accept both.
		expect(result.is_active).toBe(0);
		expect(result.employment_status?.name).toBe('Terminated');
	});
});

describe('employees.rehire', () => {
	it('POSTs /v1/employees/{id}/rehire and returns the employee id', async () => {
		respond(rehireResponse);

		const result = await invoke(Employees.rehire, {
			employeeId: 34,
			hire_date: '2026-06-01',
			reports_to_employee_id: 15,
			employment_status: { employment_status_id: 11 },
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/34/rehire',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			hire_date: '2026-06-01',
			reports_to_employee_id: 15,
			employment_status: { employment_status_id: 11 },
		});
		expect(result.employee_id).toBe(34);
	});
});

describe('employees.delete', () => {
	it('DELETEs /v1/employees/{id} and keeps the bare success envelope', async () => {
		respond(deletedResponse);

		const result = await invoke(Employees.remove, { employeeId: 34 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/34',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('fails when the body is not the documented success envelope', async () => {
		respond({ ok: true });

		await expect(
			invoke(Employees.remove, { employeeId: 34 }),
		).rejects.toThrow();
	});
});

describe('employees.employmentStatuses', () => {
	it('GETs the employee status history and parses every record', async () => {
		respond(employmentStatusesResponse);

		const result = await invoke(Employees.employmentStatuses, {
			employeeId: 15,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/15/employment-statuses',
			method: 'GET',
		});
		expect(result).toHaveLength(1);
		expect(result[0]?.employment_status?.name).toBe('Full-Time');
	});
});

describe('timeOff.list', () => {
	it('GETs the employee time off requests with paging', async () => {
		respond(timeOffListResponse);

		const result = await invoke(TimeOff.list, {
			employeeId: 1,
			limit: 10,
			offset: 20,
			sort: 'start_date',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/1/time-off-requests',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			limit: '10',
			offset: '20',
			sort: 'start_date',
		});
		expect(result.total).toBe(5);
		expect(result.rows[0]?.timeoff_type_name).toBe('Vacation');
	});
});

describe('timeOff.create', () => {
	it('POSTs multipart form data, never JSON', async () => {
		respond(timeOffCreatedResponse);

		const result = await invoke(TimeOff.create, {
			employeeId: 15,
			start_date: '2024-03-04',
			end_date: '2024-03-08',
			timeoff_type_id: 1,
			preapproved: true,
			note: 'Sick',
			amountOptions: { '2024-03-04': 1, '2024-03-05': 0.5 },
		});

		const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(new URL(url).pathname).toBe(
			'/v1/employees/15/time-off-requests-advanced',
		);
		expect(init.method).toBe('POST');
		// No Content-Type is set by hand: fetch writes the multipart boundary
		// itself, and setting the header here would break the boundary.
		expect(new Headers(init.headers).get('content-type')).toBeNull();

		const sent = init.body as FormData;
		expect(sent).toBeInstanceOf(FormData);
		expect(sent.get('start_date')).toBe('2024-03-04');
		expect(sent.get('end_date')).toBe('2024-03-08');
		expect(sent.get('timeoff_type_id')).toBe('1');
		expect(sent.get('preapproved')).toBe('true');
		expect(sent.get('note')).toBe('Sick');
		// amount_options is a JSON string inside its single part.
		expect(JSON.parse(String(sent.get('amount_options')))).toEqual({
			'2024-03-04': 1,
			'2024-03-05': 0.5,
		});
		expect(result.id).toBe(2402);
	});

	it('omits the optional parts when they are not passed', async () => {
		respond(timeOffCreatedResponse);

		await invoke(TimeOff.create, {
			employeeId: 15,
			start_date: '2024-03-04',
			end_date: '2024-03-04',
			timeoff_type_id: 1,
		});

		const sent = (fetchMock.mock.calls.at(-1) as [string, RequestInit])[1]
			.body as FormData;
		expect(sent.get('preapproved')).toBeNull();
		expect(sent.get('note')).toBeNull();
		expect(sent.get('amount_options')).toBeNull();
	});
});

describe('timeOff.delete and timeOff.reply', () => {
	it('DELETEs the request', async () => {
		respond(deletedResponse);

		const result = await invoke(TimeOff.remove, {
			employeeId: 15,
			timeOffRequestId: 20,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/15/time-off-requests/20',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('POSTs the reply with accept as a boolean', async () => {
		respond(deletedResponse);

		await invoke(TimeOff.reply, {
			employeeId: 15,
			timeOffRequestId: 20,
			accept: false,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/15/time-off-requests/20/reply',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({ accept: false });
	});
});

describe('timeOff.types and timeOff.budgets', () => {
	it('GETs /v1/time-off-types', async () => {
		respond(timeOffTypesResponse);

		const result = await invoke(TimeOff.types, {});

		expect(lastRequest()).toMatchObject({
			path: '/v1/time-off-types',
			method: 'GET',
		});
		expect(result[0]?.slug).toBe('sick-leave');
	});

	it('keeps budget amounts as the strings TalentHR sends', async () => {
		respond(timeOffBudgetsResponse);

		const result = await invoke(TimeOff.budgets, { employeeId: 1 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/employees/1/time-off-budgets',
			method: 'GET',
		});
		expect(result[0]?.budget).toBe('10.000');
		expect(result[0]?.used_budget).toBe('0.000');
	});
});

describe('organization collections', () => {
	it('lists divisions', async () => {
		respond(divisionsResponse);

		const result = await invoke(Organization.divisionsList, {});

		expect(lastRequest()).toMatchObject({
			path: '/v1/divisions',
			method: 'GET',
		});
		expect(result).toHaveLength(2);
	});

	it('gets one division', async () => {
		respond(divisionResponse);

		const result = await invoke(Organization.divisionsGet, { id: 12 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/divisions/12',
			method: 'GET',
		});
		expect(result.name).toBe('North America');
	});

	it('creates a division with a name body', async () => {
		respond(divisionResponse);

		await invoke(Organization.divisionsCreate, { name: 'North America' });

		expect(lastRequest()).toMatchObject({
			path: '/v1/divisions',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({ name: 'North America' });
	});

	it('renames a division', async () => {
		respond(divisionResponse);

		await invoke(Organization.divisionsUpdate, {
			id: 12,
			name: 'North America East',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/divisions/12',
			method: 'PUT',
		});
		expect(lastRequest().body).toEqual({ name: 'North America East' });
	});

	it('deletes a division', async () => {
		respond(deletedResponse);

		const result = await invoke(Organization.divisionsRemove, { id: 12 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/divisions/12',
			method: 'DELETE',
		});
		expect(result).toEqual({ success: true });
	});

	it('lists departments, locations and job titles', async () => {
		respond(departmentsResponse);
		const departments = await invoke(Organization.departmentsList, {});
		expect(lastRequest().path).toBe('/v1/departments');
		expect(departments).toHaveLength(1);

		respond(locationsResponse);
		const locations = await invoke(Organization.locationsList, {});
		expect(lastRequest().path).toBe('/v1/locations');
		expect(locations[0]?.name).toBe('California');

		respond(jobTitlesResponse);
		const titles = await invoke(Organization.jobTitlesList, {});
		expect(lastRequest().path).toBe('/v1/job-titles');
		expect(titles[0]?.name).toBe('Accountant');
	});

	it('creates and deletes a department', async () => {
		respond({
			success: true,
			data: { id: 6, name: 'Engineering', object_type: 'department' },
		});
		await invoke(Organization.departmentsCreate, { name: 'Engineering' });
		expect(lastRequest()).toMatchObject({
			path: '/v1/departments',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({ name: 'Engineering' });

		respond(deletedResponse);
		await invoke(Organization.departmentsRemove, { id: 6 });
		expect(lastRequest()).toMatchObject({
			path: '/v1/departments/6',
			method: 'DELETE',
		});
	});

	it('rejects a blank name', async () => {
		await expect(
			invoke(Organization.divisionsCreate, { name: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a name longer than the documented 255 characters', async () => {
		await expect(
			invoke(Organization.divisionsCreate, { name: 'a'.repeat(256) }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('referenceData.employmentStatuses', () => {
	it('GETs /v1/employment-statuses', async () => {
		respond(employmentStatusOptionsResponse);

		const result = (await invoke(
			ReferenceData.employmentStatuses,
			{},
		)) as Array<{ name?: string | null }>;

		expect(lastRequest()).toMatchObject({
			path: '/v1/employment-statuses',
			method: 'GET',
		});
		expect(result.map((status) => status.name)).toEqual([
			'Full-Time',
			'Part-Time',
			'Contractor',
		]);
	});
});

describe('error handling', () => {
	it('turns a 401 into a TalentHRAPIError carrying the tenant code', async () => {
		respond(unauthorizedResponse, 401);

		const apiError = await rejection(invoke(Employees.get, { employeeId: 15 }));

		expect(apiError.status).toBe(401);
		expect(apiError.isAuthError).toBe(true);
		// A refused key arrives as a missing tenant, so both readings exist.
		expect(apiError.isTenantNotFound).toBe(true);
		expect(apiError.hrCodeKey).toBe('not_found_tenancy');
		expect(apiError.message).toContain('TalentHR 401 not_found_tenancy');
		expect(apiError.method).toBe('GET');
	});

	it('turns a 404 into a TalentHRAPIError that is not an auth failure', async () => {
		respond(notFoundResponse, 404);

		const apiError = await rejection(
			invoke(Employees.get, { employeeId: 999 }),
		);

		expect(apiError.status).toBe(404);
		expect(apiError.isAuthError).toBe(false);
	});

	it('never leaks the key through the error', async () => {
		respond(unauthorizedResponse, 401);

		const apiError = await rejection(invoke(Employees.get, { employeeId: 15 }));

		expect(apiError.message).not.toContain(API_KEY);
		expect(JSON.stringify(apiError)).not.toContain(API_KEY);
		expect(require('node:util').inspect(apiError)).not.toContain(API_KEY);
	});

	it('fails loudly when data is missing from a 200 body', async () => {
		respond({ success: true });

		await expect(invoke(Employees.get, { employeeId: 15 })).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the event name without the raw input', async () => {
		respond(employeeResponse);

		await invoke(Employees.get, { employeeId: 15 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'talenthr.employees.get',
			{},
			'completed',
		);
	});
});
