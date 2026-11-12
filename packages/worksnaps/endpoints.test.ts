import { logEventFromContext } from 'corsair/core';
import { WorksnapsAPIError } from './client';
import { Assignments, Projects, Tasks, TimeEntries, Users } from './endpoints';
import {
	meXml,
	projectReportXml,
	projectsXml,
	projectXml,
	summaryReportXml,
	taskAssignmentsXml,
	taskAssignmentXml,
	tasksXml,
	taskXml,
	timeEntriesXml,
	timeEntryXml,
	userAssignmentsXml,
	userAssignmentXml,
	usersXml,
	userXml,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respondEmpty,
	respondText,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('projects', () => {
	it('lists projects, parsing the Rails array', async () => {
		respondText(fetchMock, projectsXml);

		const result = (await invoke(Projects.list, {})) as {
			projects?: { id: number; name: string }[];
		};

		expect(result.projects).toHaveLength(2);
		expect(result.projects?.[0]).toMatchObject({
			id: 3456,
			name: 'Acme storefront',
		});
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/api/projects.xml');
	});

	it('coerces a nil description to null', async () => {
		respondText(fetchMock, projectsXml);

		const result = (await invoke(Projects.list, {})) as {
			projects?: { description?: string | null }[];
		};

		// The second project has `nil="true"`, which the parser turns into null.
		expect(result.projects?.[1]?.description).toBeNull();
	});

	it('asks for user assignments', async () => {
		respondText(fetchMock, projectsXml);

		await invoke(Projects.list, { include_user_assignment: true });

		expect(lastRequest(fetchMock).query.include_user_assignment).toBe('1');
	});

	it('reads one project', async () => {
		respondText(fetchMock, projectXml);

		const result = (await invoke(Projects.get, { project_id: 3456 })) as {
			project?: { id: number; name: string };
		};

		expect(result.project).toMatchObject({ id: 3456, name: 'Acme storefront' });
		expect(lastRequest(fetchMock).path).toBe('/api/projects/3456.xml');
	});

	it('creates a project with an XML body', async () => {
		respondText(fetchMock, projectXml);

		await invoke(Projects.create, {
			name: 'Acme storefront',
			description: 'Front-end work',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/projects.xml');
		expect(sent.rawBody).toBe(
			'<project><name>Acme storefront</name><description>Front-end work</description></project>',
		);
	});

	it('updates a project, sending only the fields given', async () => {
		respondText(fetchMock, projectXml);

		await invoke(Projects.update, { project_id: 3456, name: 'Renamed' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/projects/3456.xml');
		// The description is omitted rather than cleared.
		expect(sent.rawBody).toBe('<project><name>Renamed</name></project>');
	});

	it('states what a delete did', async () => {
		respondEmpty(fetchMock);

		await expect(
			invoke(Projects.remove, { project_id: 3456 }),
		).resolves.toEqual({ id: 3456, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});

	it('surfaces a 401, which carries no body', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

		await expect(invoke(Projects.list, {})).rejects.toBeInstanceOf(
			WorksnapsAPIError,
		);
	});
});

describe('tasks', () => {
	it('lists the tasks in a project', async () => {
		respondText(fetchMock, tasksXml);

		const result = (await invoke(Tasks.list, { project_id: 3456 })) as {
			tasks?: { id: number }[];
		};

		expect(result.tasks).toHaveLength(1);
		expect(lastRequest(fetchMock).path).toBe('/api/projects/3456/tasks.xml');
	});

	it('reads one task', async () => {
		respondText(fetchMock, taskXml);

		const result = (await invoke(Tasks.get, {
			project_id: 3456,
			task_id: 78,
		})) as { task?: { id: number; name: string } };

		expect(result.task).toMatchObject({ id: 78, name: 'Build the cart' });
		expect(lastRequest(fetchMock).path).toBe('/api/projects/3456/tasks/78.xml');
	});

	it('creates a task', async () => {
		respondText(fetchMock, taskXml);

		await invoke(Tasks.create, {
			project_id: 3456,
			name: 'Build the cart',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.rawBody).toBe('<task><name>Build the cart</name></task>');
	});

	it('updates a task', async () => {
		respondText(fetchMock, taskXml);

		await invoke(Tasks.update, {
			project_id: 3456,
			task_id: 78,
			name: 'Renamed',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/projects/3456/tasks/78.xml');
	});

	it('deletes a task', async () => {
		respondEmpty(fetchMock);

		await expect(
			invoke(Tasks.remove, { project_id: 3456, task_id: 78 }),
		).resolves.toEqual({ id: 78, deleted: true });
	});
});

describe('time entries', () => {
	it('lists the time on a project, summing the minutes', async () => {
		respondText(fetchMock, timeEntriesXml);

		const result = (await invoke(TimeEntries.list, {
			project_id: 3456,
			user_ids: [12],
			from_timestamp: 1717232400,
			to_timestamp: 1717318800,
		})) as {
			time_entries?: { id: number; duration_in_minutes: number }[];
		};

		expect(result.time_entries).toHaveLength(2);
		// The duration arrives as a typed string and is coerced to a number.
		expect(result.time_entries?.[0]?.duration_in_minutes).toBe(90);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'worksnaps.timeEntries.list',
			{ count: 2, minutes: 120 },
			'completed',
		);
	});

	it('sends the time range as Unix seconds', async () => {
		respondText(fetchMock, timeEntriesXml);

		await invoke(TimeEntries.list, {
			project_id: 3456,
			user_ids: [12],
			from_timestamp: 1717232400,
			to_timestamp: 1717318800,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.query.from_timestamp).toBe('1717232400');
		expect(sent.query.to_timestamp).toBe('1717318800');
	});

	it('refuses a timestamp off the 10-minute grid', async () => {
		await expect(
			invoke(TimeEntries.list, {
				project_id: 3456,
				user_ids: [12],
				from_timestamp: 1717232700,
				to_timestamp: 1717318800,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists one user time on a project', async () => {
		respondText(fetchMock, timeEntriesXml);

		await invoke(TimeEntries.byUser, {
			project_id: 3456,
			user_id: 12,
			from_timestamp: 1717232400,
			to_timestamp: 1717318800,
		});

		expect(lastRequest(fetchMock).path).toBe(
			'/api/projects/3456/users/12/time_entries.xml',
		);
	});

	it('reads one entry, asking for full-resolution screenshots', async () => {
		respondText(fetchMock, timeEntryXml);

		const result = (await invoke(TimeEntries.get, {
			project_id: 3456,
			time_entry_id: 901,
			full_resolution_url: true,
		})) as { time_entry?: { id: number } };

		expect(result.time_entry?.id).toBe(901);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/projects/3456/time_entries/901.xml');
		// The docs also show this as a separate route with the flag in the path;
		// it is a query parameter, which is the same request.
		expect(sent.query.full_resolution_url).toBe('1');
	});

	it('logs time with an XML body', async () => {
		respondText(fetchMock, timeEntriesXml, 201);

		await invoke(TimeEntries.create, {
			project_id: 3456,
			task_id: 78,
			from_timestamp: 1717232400,
			duration_in_minutes: 90,
			user_comment: 'Worked on the cart',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/projects/3456/time_entries.xml');
		expect(sent.rawBody).toBe(
			'<time_entry><task_id>78</task_id><from_timestamp>1717232400</from_timestamp><duration_in_minutes>90</duration_in_minutes><user_comment>Worked on the cart</user_comment></time_entry>',
		);
	});

	it('rejects a non-positive duration', async () => {
		await expect(
			invoke(TimeEntries.create, {
				project_id: 3456,
				task_id: 78,
				from_timestamp: 1717232400,
				duration_in_minutes: 0,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('moves a time entry to another task', async () => {
		respondText(fetchMock, timeEntriesXml);

		await invoke(TimeEntries.update, {
			project_id: 3456,
			time_entry_id: 901,
			task_id: 79,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.rawBody).toBe('<time_entry><task_id>79</task_id></time_entry>');
	});

	it('deletes a time entry', async () => {
		respondEmpty(fetchMock);

		await expect(
			invoke(TimeEntries.remove, { project_id: 3456, time_entry_id: 901 }),
		).resolves.toEqual({ id: 901, deleted: true });
	});
});

describe('assignments', () => {
	it('lists task assignments', async () => {
		respondText(fetchMock, taskAssignmentsXml);

		// unknown: only the length is asserted; the row shape belongs to the XML
		// decoder and is covered by its own suites.
		const result = (await invoke(Assignments.taskList, {
			project_id: 3456,
		})) as { task_assignments?: unknown[] };

		expect(result.task_assignments).toHaveLength(1);
		expect(lastRequest(fetchMock).path).toBe(
			'/api/projects/3456/task_assignments.xml',
		);
	});

	it('assigns a user to a task', async () => {
		respondText(fetchMock, taskAssignmentXml);

		await invoke(Assignments.taskCreate, {
			project_id: 3456,
			task_id: 78,
			user_id: 12,
		});

		expect(lastRequest(fetchMock).rawBody).toBe(
			'<task_assignment><task_id>78</task_id><user_id>12</user_id></task_assignment>',
		);
	});

	it('removes a task assignment', async () => {
		respondEmpty(fetchMock);

		await expect(
			invoke(Assignments.taskRemove, {
				project_id: 3456,
				task_assignment_id: 55,
			}),
		).resolves.toEqual({ id: 55, deleted: true });
	});

	it('lists project members with their roles and rates', async () => {
		respondText(fetchMock, userAssignmentsXml);

		const result = (await invoke(Assignments.userList, {
			project_id: 3456,
		})) as {
			user_assignments?: {
				role?: string;
				hourly_rate?: number;
				flag_allow_logging_time?: boolean;
			}[];
		};

		expect(result.user_assignments?.[0]).toMatchObject({
			role: 'member',
			hourly_rate: 45.5,
			flag_allow_logging_time: true,
		});
	});

	it('reads one membership', async () => {
		respondText(fetchMock, userAssignmentXml);

		const result = (await invoke(Assignments.userGet, {
			project_id: 3456,
			user_assignment_id: 21,
		})) as { user_assignment?: { role?: string } };

		expect(result.user_assignment?.role).toBe('member');
	});

	it('adds a member with a role and rate', async () => {
		respondText(fetchMock, userAssignmentXml);

		await invoke(Assignments.userCreate, {
			project_id: 3456,
			user_id: 12,
			role: 'member',
			hourly_rate: 45.5,
			flag_allow_logging_time: true,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.rawBody).toContain('<role>member</role>');
		expect(sent.rawBody).toContain('<hourly_rate>45.5</hourly_rate>');
		expect(sent.rawBody).toContain(
			'<flag_allow_logging_time>1</flag_allow_logging_time>',
		);
	});

	it('updates a membership', async () => {
		respondText(fetchMock, userAssignmentXml);

		await invoke(Assignments.userUpdate, {
			project_id: 3456,
			user_assignment_id: 21,
			hourly_rate: 50,
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/projects/3456/user_assignments/21.xml');
	});

});

describe('users and reports', () => {
	it('reads the account behind the token', async () => {
		respondText(fetchMock, meXml);

		const result = (await invoke(Users.me, {})) as {
			user?: { login?: string };
		};

		// The document roots at <user>, which the plugin keeps as the key.
		expect(result.user?.login).toBe('jordan');
		expect(lastRequest(fetchMock).path).toBe('/api/me.xml');
	});

	it('lists users, logging only the count', async () => {
		respondText(fetchMock, usersXml);

		// unknown: only the length is asserted; the row shape is covered elsewhere.
		const result = (await invoke(Users.list, {})) as { users?: unknown[] };

		expect(result.users).toHaveLength(1);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'worksnaps.users.list',
			{ count: 1 },
			'completed',
		);
	});

	it('reads one user', async () => {
		respondText(fetchMock, userXml);

		const result = (await invoke(Users.get, { user_id: 12 })) as {
			user?: { login?: string };
		};

		expect(result.user?.login).toBe('jordan');
	});

	it('drops api_token from users.get, users.list and users.update', async () => {
		const withToken = userXml.replace(
			'</user>',
			'  <api_token>not-a-real-token</api_token>\n</user>',
		);
		const listWithToken = usersXml.replace(
			'  </user>',
			'    <api_token>not-a-real-token</api_token>\n  </user>',
		);

		respondText(fetchMock, withToken);
		const got = await invoke(Users.get, { user_id: 12 });
		respondText(fetchMock, listWithToken);
		const listed = await invoke(Users.list, {});
		respondText(fetchMock, withToken);
		const updated = await invoke(Users.update, {
			user_id: 12,
			first_name: 'Jordan',
		});

		for (const result of [got, listed, updated]) {
			expect(JSON.stringify(result)).not.toContain('not-a-real-token');
		}
		expect((listed as { users?: unknown[] }).users).toHaveLength(1);
	});

	it('creates a user without logging the password', async () => {
		respondText(fetchMock, userXml);

		await invoke(Users.create, {
			login: 'jordan',
			email: 'jordan@acme.example',
			first_name: 'Jordan',
			last_name: 'Ruiz',
			password: 'correct horse battery',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.rawBody).toContain(
			'<password>correct horse battery</password>',
		);
		// The password is in the request and must never reach the event log.
		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(JSON.stringify(logged)).not.toContain('correct horse');
		expect(logged).not.toHaveProperty('password');
	});

	it('updates a user', async () => {
		respondText(fetchMock, userXml);

		await invoke(Users.update, { user_id: 12, first_name: 'Jordan' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/api/users/12.xml');
	});

	it('reads a project report', async () => {
		respondText(fetchMock, projectReportXml);

		const result = (await invoke(Users.projectReport, {
			project_id: 3456,
			user_ids: [12],
			from_timestamp: 1717232400,
			to_timestamp: 1717318800,
		})) as { time_summary?: { duration_in_minutes?: number }[] };

		expect(result.time_summary?.[0]?.duration_in_minutes).toBe(2400);
		expect(lastRequest(fetchMock).path).toBe('/api/projects/3456/reports');
	});

	it('reads a summary report', async () => {
		respondText(fetchMock, summaryReportXml);

		const result = (await invoke(Users.summaryReport, {
			from_date: '2024-06-01',
			to_date: '2024-06-07',
		})) as { manager_report?: { duration_in_minutes?: number }[] };

		expect(result.manager_report?.[0]?.duration_in_minutes).toBe(9800);
		expect(lastRequest(fetchMock).path).toBe('/api/summary_reports');
	});
});
