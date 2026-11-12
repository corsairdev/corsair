import * as Directory from './endpoints/directory';
import * as Projects from './endpoints/projects';
import * as Tasks from './endpoints/tasks';
import * as TimeEntries from './endpoints/time-entries';
import {
	COMPANY,
	COMPANY_ID,
	COMPANY_PAGE,
	PROJECT,
	PROJECT_ID,
	PROJECT_PAGE,
	TASK,
	TASK_ID,
	TASK_PAGE,
	TASK_PAGE_MORE,
	TIME_ENTRY,
	TIME_ENTRY_ID,
	TIME_ENTRY_PAGE,
	USER,
	USER_ID,
	USER_PAGE,
} from './test-fixtures';
import {
	invoke,
	lastRequest,
	respond,
	respondNoContent,
	spyOnFetch,
} from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('tasks.list', () => {
	it('flattens the filters into field.operator query keys', async () => {
		respond(fetchMock, TASK_PAGE);

		const result = (await invoke(Tasks.list, {
			page_size: 20,
			project_id: { eq: PROJECT_ID },
			task_name: { cn: 'kickoff' },
			task_status: { oneOf: [1, 2] },
			assignee_user_id: { eq: USER_ID },
			include_archive: { eq: false },
			progress: { gt: 10, lt: 90 },
		})) as Awaited<ReturnType<typeof Tasks.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/1.0/tasks');
		expect(request.query).toEqual({
			pageSize: '20',
			'projectId.eq': String(PROJECT_ID),
			'taskName.cn': 'kickoff',
			'task.status.oneOf': '1,2',
			'assignee.userId.eq': String(USER_ID),
			'includeArchive.eq': 'false',
			'progress.gt': '10',
			'progress.lt': '90',
		});
		expect(result.tasks).toHaveLength(1);
		expect(result.tasks[0]?.taskName).toBe('Kickoff workshop');
		expect(result.has_more).toBe(false);
	});

	it('repeats includeFields rather than joining it', async () => {
		respond(fetchMock, TASK_PAGE);

		await invoke(Tasks.list, {
			include_fields: ['taskName', 'dueDate'],
		});

		expect(lastRequest(fetchMock).allQuery('includeFields')).toEqual([
			'taskName',
			'dueDate',
		]);
	});

	it('joins an id list into one comma-separated filter', async () => {
		respond(fetchMock, TASK_PAGE);

		await invoke(Tasks.list, {
			assignee_user_id: { oneOf: [USER_ID, USER_ID + 1] },
		});

		expect(lastRequest(fetchMock).query['assignee.userId.oneOf']).toBe(
			`${USER_ID},${USER_ID + 1}`,
		);
	});

	it('rejects an operator the filter does not define before fetch', async () => {
		await expect(
			invoke(Tasks.list, { task_name: { contains: 'kickoff' } }),
		).rejects.toThrow();
		// projectId only documents `eq`.
		await expect(
			invoke(Tasks.list, { project_id: { oneOf: [PROJECT_ID] } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends the documented sort order, match mode and epoch filters', async () => {
		respond(fetchMock, TASK_PAGE);

		await invoke(Tasks.list, {
			sort_by: 'dueDate',
			sort_order: 'ASC',
			match: 'any',
			created_at: { ge: 1794300000000 },
		});

		expect(lastRequest(fetchMock).query).toEqual({
			sortBy: 'dueDate',
			sortOrder: 'ASC',
			match: 'any',
			'createdAt.ge': '1794300000000',
		});
	});

	it('rejects a lowercase sort order and a free-text match', async () => {
		await expect(
			invoke(Tasks.list, { sort_order: 'asc' }),
		).rejects.toThrow();
		await expect(invoke(Tasks.list, { match: 'kickoff' })).rejects.toThrow();
		await expect(
			invoke(Tasks.list, { created_at: { ge: '2026-11-01' } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reads the next page token while more remain', async () => {
		respond(fetchMock, TASK_PAGE_MORE);

		const result = (await invoke(Tasks.list, {})) as Awaited<
			ReturnType<typeof Tasks.list>
		>;

		expect(result.next_page_token).toBe('abc');
		expect(result.has_more).toBe(true);
		expect(result.total_record_count).toBe(3);
	});

	it('rejects a page size above the documented maximum', async () => {
		await expect(invoke(Tasks.list, { page_size: 101 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks.get', () => {
	it('reads one task by id', async () => {
		respond(fetchMock, TASK);

		const result = (await invoke(Tasks.get, {
			task_id: TASK_ID,
			include_all_fields: true,
		})) as Awaited<ReturnType<typeof Tasks.get>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(`/api/1.0/tasks/${TASK_ID}`);
		expect(request.query).toEqual({ includeAllFields: 'true' });
		expect(result.task.project?.projectName).toBe('Acme onboarding');
		expect(result.task.status?.statusName).toBe('In progress');
	});

	it('rejects a non-positive id before sending anything', async () => {
		await expect(invoke(Tasks.get, { task_id: 0 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks.create', () => {
	it('sends the taskName and nested project the API expects', async () => {
		respond(fetchMock, TASK, 201);

		const result = (await invoke(Tasks.create, {
			task_name: 'Kickoff workshop',
			project_id: PROJECT_ID,
			start_date: '2026-11-10',
			effort_in_minutes: 240,
			assignees: [{ user_id: USER_ID }],
			follower_ids: [USER_ID],
		})) as Awaited<ReturnType<typeof Tasks.create>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.json()).toEqual({
			taskName: 'Kickoff workshop',
			project: { projectId: PROJECT_ID },
			startDate: '2026-11-10',
			effortInMinutes: 240,
			assignees: { users: [{ userId: USER_ID }] },
			followers: [{ userId: USER_ID }],
		});
		expect(result.task.taskId).toBe(TASK_ID);
	});

	it('sends the status and phase by id or name', async () => {
		respond(fetchMock, TASK, 201);

		await invoke(Tasks.create, {
			task_name: 'Kickoff',
			project_id: PROJECT_ID,
			status: { statusName: 'In progress' },
			phase: { phaseId: 11 },
		});

		expect(lastRequest(fetchMock).json()).toMatchObject({
			status: { statusName: 'In progress' },
			phase: { phaseId: 11 },
		});
	});

	it('rejects an assignee with no id and no email', async () => {
		await expect(
			invoke(Tasks.create, {
				task_name: 'x',
				project_id: PROJECT_ID,
				assignees: [{}],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a progress value outside 0 to 100', async () => {
		await expect(
			invoke(Tasks.create, {
				task_name: 'x',
				project_id: PROJECT_ID,
				progress: 101,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty task name', async () => {
		await expect(
			invoke(Tasks.create, { task_name: '', project_id: PROJECT_ID }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks.update', () => {
	it('carries the id in the path, not the body', async () => {
		respond(fetchMock, TASK);

		const result = (await invoke(Tasks.update, {
			task_id: TASK_ID,
			progress: 80,
			due_date: '2026-11-20',
		})) as Awaited<ReturnType<typeof Tasks.update>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(`/api/1.0/tasks/${TASK_ID}`);
		const body = request.json();
		expect(body.progress).toBe(80);
		expect(body.dueDate).toBe('2026-11-20');
		expect(body).not.toHaveProperty('taskId');
		expect(body).not.toHaveProperty('task_id');
		expect(result.task.taskId).toBe(TASK_ID);
	});

	it('rejects an update with no id', async () => {
		await expect(invoke(Tasks.update, { progress: 50 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks.delete', () => {
	it('reports success on the 204 the API returns', async () => {
		respondNoContent(fetchMock);

		const result = (await invoke(Tasks.remove, {
			task_id: TASK_ID,
		})) as Awaited<ReturnType<typeof Tasks.remove>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe(`/api/1.0/tasks/${TASK_ID}`);
		expect(result.success).toBe(true);
		expect(result.task_id).toBe(TASK_ID);
	});
});

describe('projects.list', () => {
	it('flattens the filters into field.operator query keys', async () => {
		respond(fetchMock, PROJECT_PAGE);

		const result = (await invoke(Projects.list, {
			company_id: { eq: COMPANY_ID },
			status: { oneOf: ['ACTIVE', 'ON_HOLD'] },
			include_archive: { eq: false },
			budgeted_hours: { ge: 10 },
		})) as Awaited<ReturnType<typeof Projects.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/1.0/projects');
		expect(request.query).toEqual({
			'companyId.eq': String(COMPANY_ID),
			'status.oneOf': 'ACTIVE,ON_HOLD',
			'includeArchive.eq': 'false',
			'budgetedHours.ge': '10',
		});
		expect(result.projects[0]?.customer?.companyName).toBe('Acme Inc');
	});
});

describe('projects.get', () => {
	it('reads one project by id', async () => {
		respond(fetchMock, PROJECT);

		const result = (await invoke(Projects.get, {
			project_id: PROJECT_ID,
		})) as Awaited<ReturnType<typeof Projects.get>>;

		expect(lastRequest(fetchMock).path).toBe(`/api/1.0/projects/${PROJECT_ID}`);
		expect(result.project.owner?.emailId).toBe('sam@example.com');
		expect(result.project.projectFee).toBe(45000);
	});
});

describe('projects.create', () => {
	it('sends the customer and owner blocks in the wire spelling', async () => {
		respond(fetchMock, PROJECT, 201);

		const result = (await invoke(Projects.create, {
			project_name: 'Acme onboarding',
			customer: { company_id: COMPANY_ID },
			owner: { email_id: 'sam@example.com' },
			start_date: '2026-11-01',
			currency: 'USD',
			team_member_ids: [USER_ID],
		})) as Awaited<ReturnType<typeof Projects.create>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/api/1.0/projects');
		expect(request.json()).toEqual({
			projectName: 'Acme onboarding',
			customer: { companyId: COMPANY_ID },
			owner: { emailId: 'sam@example.com' },
			startDate: '2026-11-01',
			currency: 'USD',
			teamMembers: [{ userId: USER_ID }],
		});
		expect(result.project.projectId).toBe(PROJECT_ID);
	});

	it('accepts a customer and owner by name', async () => {
		respond(fetchMock, PROJECT, 201);

		await invoke(Projects.create, {
			project_name: 'Acme onboarding',
			customer: { company_name: 'Acme Inc' },
			owner: { user_id: USER_ID },
		});

		expect(lastRequest(fetchMock).json()).toMatchObject({
			customer: { companyName: 'Acme Inc' },
			owner: { userId: USER_ID },
		});
	});

	it('rejects a customer block that names neither id nor name', async () => {
		await expect(
			invoke(Projects.create, {
				project_name: 'x',
				customer: {},
				owner: { user_id: USER_ID },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an owner block that names neither id nor email', async () => {
		await expect(
			invoke(Projects.create, {
				project_name: 'x',
				customer: { company_id: COMPANY_ID },
				owner: {},
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a visibility the API does not define', async () => {
		await expect(
			invoke(Projects.create, {
				project_name: 'x',
				customer: { company_id: COMPANY_ID },
				owner: { user_id: USER_ID },
				visibility: 'SECRET',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('projects.update and delete', () => {
	it('puts the id in the path and not the body', async () => {
		respond(fetchMock, PROJECT);

		await invoke(Projects.update, {
			project_id: PROJECT_ID,
			project_name: 'Acme onboarding v2',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(`/api/1.0/projects/${PROJECT_ID}`);
		expect(request.json()).toEqual({ projectName: 'Acme onboarding v2' });
	});

	it('deletes a project and reports the id', async () => {
		respondNoContent(fetchMock);

		const result = (await invoke(Projects.remove, {
			project_id: PROJECT_ID,
		})) as Awaited<ReturnType<typeof Projects.remove>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result).toEqual({ success: true, project_id: PROJECT_ID });
	});

	it('archives a project through its action path', async () => {
		respondNoContent(fetchMock);

		const result = (await invoke(Projects.archive, {
			project_id: PROJECT_ID,
		})) as Awaited<ReturnType<typeof Projects.archive>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe(`/api/1.0/projects/${PROJECT_ID}/archive`);
		expect(result.success).toBe(true);
	});
});

describe('companies', () => {
	it('lists companies with token paging', async () => {
		respond(fetchMock, COMPANY_PAGE);

		const result = (await invoke(Directory.companiesList, {
			page_size: 50,
			company_name: { cn: 'acme' },
		})) as Awaited<ReturnType<typeof Directory.companiesList>>;

		expect(lastRequest(fetchMock).path).toBe('/api/1.0/companies');
		expect(lastRequest(fetchMock).query).toEqual({
			pageSize: '50',
			'companyName.cn': 'acme',
		});
		expect(result.companies[0]?.companyName).toBe('Acme Inc');
	});

	it('reads one company by id', async () => {
		respond(fetchMock, COMPANY);

		const result = (await invoke(Directory.companiesGet, {
			company_id: COMPANY_ID,
		})) as Awaited<ReturnType<typeof Directory.companiesGet>>;

		expect(result.company.companyUrl).toBe('https://acme.example.com');
	});

	it('creates a company with its account owner', async () => {
		respond(fetchMock, COMPANY, 201);

		await invoke(Directory.companiesCreate, {
			company_name: 'Acme Inc',
			account_owner: { user_id: USER_ID },
			company_url: 'https://acme.example.com',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			companyName: 'Acme Inc',
			accountOwner: { userId: USER_ID },
			companyUrl: 'https://acme.example.com',
		});
	});

	it('rejects a company with no account owner', async () => {
		await expect(
			invoke(Directory.companiesCreate, { company_name: 'Acme Inc' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a company', async () => {
		respond(fetchMock, COMPANY);

		await invoke(Directory.companiesUpdate, {
			company_id: COMPANY_ID,
			description: 'Renamed account',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(`/api/1.0/companies/${COMPANY_ID}`);
		expect(request.json()).toEqual({ description: 'Renamed account' });
	});

	it('deletes a company', async () => {
		respondNoContent(fetchMock);

		const result = (await invoke(Directory.companiesDelete, {
			company_id: COMPANY_ID,
		})) as Awaited<ReturnType<typeof Directory.companiesDelete>>;

		expect(result).toEqual({ success: true, company_id: COMPANY_ID });
	});
});

describe('users', () => {
	it('lists users', async () => {
		respond(fetchMock, USER_PAGE);

		const result = (await invoke(Directory.usersList, {
			page_size: 50,
		})) as Awaited<ReturnType<typeof Directory.usersList>>;

		expect(lastRequest(fetchMock).path).toBe('/api/1.0/users');
		expect(result.users[0]?.email).toBe('sam@example.com');
	});

	it('reads one user by id', async () => {
		respond(fetchMock, USER);

		const result = (await invoke(Directory.usersGet, {
			user_id: USER_ID,
		})) as Awaited<ReturnType<typeof Directory.usersGet>>;

		expect(result.user.role?.roleName).toBe('Project manager');
	});
});

describe('time entries', () => {
	it('lists entries with a date filter', async () => {
		respond(fetchMock, TIME_ENTRY_PAGE);

		const result = (await invoke(TimeEntries.list, {
			date: { ge: '2026-11-01', le: '2026-11-30' },
			billable: { eq: true },
		})) as Awaited<ReturnType<typeof TimeEntries.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/1.0/time-entries');
		expect(request.query).toEqual({
			'date.ge': '2026-11-01',
			'date.le': '2026-11-30',
			'billable.eq': 'true',
		});
		expect(result.time_entries[0]?.minutes).toBe(90);
	});

	it('reads one time entry', async () => {
		respond(fetchMock, TIME_ENTRY);

		const result = (await invoke(TimeEntries.get, {
			time_entry_id: TIME_ENTRY_ID,
		})) as Awaited<ReturnType<typeof TimeEntries.get>>;

		expect(lastRequest(fetchMock).path).toBe(
			`/api/1.0/time-entries/${TIME_ENTRY_ID}`,
		);
		expect(result.time_entry.status).toBe('APPROVED');
	});

	it('creates an entry with its nested project and task', async () => {
		respond(fetchMock, TIME_ENTRY, 201);

		await invoke(TimeEntries.create, {
			date: '2026-11-10',
			minutes: 90,
			project_id: PROJECT_ID,
			task_id: TASK_ID,
			user_email: 'sam@example.com',
			billable: true,
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			date: '2026-11-10',
			minutes: 90,
			project: { projectId: PROJECT_ID },
			task: { taskId: TASK_ID },
			user: { emailId: 'sam@example.com' },
			billable: true,
		});
	});

	it('rejects an entry with no minutes', async () => {
		await expect(
			invoke(TimeEntries.create, { date: '2026-11-10' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects zero minutes, which the API would refuse', async () => {
		await expect(
			invoke(TimeEntries.create, { date: '2026-11-10', minutes: 0 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes an entry', async () => {
		respondNoContent(fetchMock);

		const result = (await invoke(TimeEntries.remove, {
			time_entry_id: TIME_ENTRY_ID,
		})) as Awaited<ReturnType<typeof TimeEntries.remove>>;

		expect(result).toEqual({
			success: true,
			time_entry_id: TIME_ENTRY_ID,
		});
	});
});

describe('page envelope', () => {
	it('fails rather than inventing an empty page when data is missing', async () => {
		respond(fetchMock, { pagination: { hasMore: false } });

		await expect(invoke(Tasks.list, {})).rejects.toThrow();
	});
});
