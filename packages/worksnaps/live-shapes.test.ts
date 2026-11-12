import { logEventFromContext } from 'corsair/core';
import { WorksnapsAPIError } from './client';
import { Assignments, Projects, Tasks, TimeEntries, Users } from './endpoints';
import {
	installFetchMock,
	invoke,
	lastRequest,
	respondText,
} from './test-support';

// Response shapes captured from the live API on 11-12 (a trial account),
// trimmed, with made-up ids and names. They differ from the Swagger examples
// in three ways that matter: empty collections carry no type attribute,
// creates and updates wrap the record in <reply>, and time entries are created
// and updated as a list.

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n';

const replyProjectXml = `${XML_HEAD}<reply>
  <status>1</status>
  <project>
    <id>5001</id>
    <name>Test project</name>
    <description>made by a test</description>
    <status>active</status>
  </project>
</reply>`;

const replyTaskXml = `${XML_HEAD}<reply>
  <status>1</status>
  <task>
    <id>7001</id>
    <name>Test task</name>
    <description>d</description>
  </task>
</reply>`;

const replyTimeEntriesXml = `${XML_HEAD}<reply>
  <status>1</status>
  <time_entries>
    <time_entry>
      <id>9001</id>
      <logged_timestamp>1794372001</logged_timestamp>
      <from_timestamp>1794372000</from_timestamp>
      <duration_in_minutes>10</duration_in_minutes>
      <type>offline</type>
      <project_id>5001</project_id>
      <user_id>42</user_id>
      <task_id>7001</task_id>
      <task_name/>
      <user_comment>a test</user_comment>
      <user_ip/>
      <activity_level>10</activity_level>
    </time_entry>
    <time_entry>
      <id>9002</id>
      <logged_timestamp>1794372601</logged_timestamp>
      <from_timestamp>1794372600</from_timestamp>
      <duration_in_minutes>10</duration_in_minutes>
      <type>offline</type>
      <project_id>5001</project_id>
      <user_id>42</user_id>
      <task_id>7001</task_id>
      <task_name/>
      <user_comment>a test</user_comment>
      <user_ip/>
      <activity_level>10</activity_level>
    </time_entry>
  </time_entries>
</reply>`;

const replyTaskAssignmentXml = `${XML_HEAD}<reply>
  <status>1</status>
  <task_assignment>
    <id>8001</id>
    <user_id>42</user_id>
    <task_id>7001</task_id>
    <activity_id>7001</activity_id>
    <project_id>5001</project_id>
  </task_assignment>
</reply>`;

const replyUserAssignmentXml = `${XML_HEAD}<reply>
  <status>1</status>
  <user_assignment>
    <id>6001</id>
    <project_id>5001</project_id>
    <user_id>42</user_id>
    <role>Manager</role>
    <flag_allow_logging_time>1</flag_allow_logging_time>
    <window_for_deleting_time>-1</window_for_deleting_time>
    <window_for_adding_offline_time>-1</window_for_adding_offline_time>
    <user_name>Test User</user_name>
    <hourly_rate>0.00</hourly_rate>
  </user_assignment>
</reply>`;

const meXml = `${XML_HEAD}<user>
  <id>42</id>
  <login>testuser</login>
  <first_name>Test</first_name>
  <last_name>User</last_name>
  <email>test@example.com</email>
  <timezone_id>14</timezone_id>
  <is_in_daylight_time>false</is_in_daylight_time>
  <api_token>not-a-real-token</api_token>
  <timezone_name>(GMT-05:00) Eastern Time (US &amp; Canada)</timezone_name>
</user>`;

const timeSummaryXml = `${XML_HEAD}<time_summary>
  <time_entry>
    <project_id>5001</project_id>
    <user_id>42</user_id>
    <task_id>7001</task_id>
    <task_name>Test task</task_name>
    <user_comment>a test</user_comment>
    <time_entry_type>offline</time_entry_type>
    <duration_in_minutes>10</duration_in_minutes>
  </time_entry>
</time_summary>`;

const managerReportXml = `${XML_HEAD}<manager_report>
  <line_item>
    <user_id>42</user_id>
    <user_name>Test User</user_name>
    <project_id>5001</project_id>
    <date>2026-11-11</date>
    <project_name>Test project</project_name>
    <task_id>7001</task_id>
    <task_name/>
    <type>offline</type>
    <duration_in_minutes>20</duration_in_minutes>
  </line_item>
</manager_report>`;

const badParametersXml = `${XML_HEAD}<reply>
  <status>0</status>
  <error_code>100004</error_code>
  <error_string>Bad parameters in request</error_string>
  <extra_info>
    <errors>
      <user_ids>
        <message>user_ids parameter has to be specified</message>
      </user_ids>
    </errors>
  </extra_info>
</reply>`;

describe('empty collections, as the live API sends them', () => {
	it.each([
		['projects', Projects.list, {}],
		['tasks', Tasks.list, { project_id: 5001 }],
		['task_assignments', Assignments.taskList, { project_id: 5001 }],
		['user_assignments', Assignments.userList, { project_id: 5001 }],
		['users', Users.list, {}],
	] as const)('reads <%s/> as an empty list', async (root, endpoint, input) => {
		respondText(fetchMock, `${XML_HEAD}<${root}/>`);

		const result = (await invoke(endpoint, input)) as Record<string, unknown>;

		expect(result[root]).toEqual([]);
	});

	it('reads an empty time-entry list', async () => {
		respondText(fetchMock, `${XML_HEAD}<time_entries/>`);

		const result = await invoke(TimeEntries.list, {
			project_id: 5001,
			user_ids: [42],
			from_timestamp: 1794372000,
			to_timestamp: 1794379200,
		});

		expect(result).toEqual({ time_entries: [] });
	});
});

describe('creates and updates, which answer inside <reply>', () => {
	it('returns the created project', async () => {
		respondText(fetchMock, replyProjectXml, 201);

		const result = await invoke(Projects.create, { name: 'Test project' });

		expect(result).toMatchObject({
			project: { id: 5001, name: 'Test project', status: 'active' },
		});
	});

	it('returns the updated project', async () => {
		respondText(fetchMock, replyProjectXml);

		const result = await invoke(Projects.update, {
			project_id: 5001,
			description: 'made by a test',
		});

		expect(result).toMatchObject({ project: { id: 5001 } });
	});

	it('returns the created task', async () => {
		respondText(fetchMock, replyTaskXml, 201);

		const result = await invoke(Tasks.create, {
			project_id: 5001,
			name: 'Test task',
		});

		expect(result).toMatchObject({ task: { id: 7001, name: 'Test task' } });
	});

	it('returns every 10-minute entry a create made', async () => {
		respondText(fetchMock, replyTimeEntriesXml, 201);

		const result = (await invoke(TimeEntries.create, {
			project_id: 5001,
			task_id: 7001,
			from_timestamp: 1794372000,
			duration_in_minutes: 20,
			user_comment: 'a test',
		})) as { time_entries: { id: number; duration_in_minutes: number }[] };

		expect(result.time_entries.map((entry) => entry.id)).toEqual([9001, 9002]);
		expect(lastRequest(fetchMock).rawBody).toBe(
			'<time_entry><task_id>7001</task_id><from_timestamp>1794372000</from_timestamp><duration_in_minutes>20</duration_in_minutes><user_comment>a test</user_comment></time_entry>',
		);
	});

	it('returns the updated time entries', async () => {
		respondText(fetchMock, replyTimeEntriesXml);

		const result = (await invoke(TimeEntries.update, {
			project_id: 5001,
			time_entry_id: 9001,
			user_comment: 'edited',
		})) as { time_entries: { id: number }[] };

		expect(result.time_entries[0]?.id).toBe(9001);
		expect(lastRequest(fetchMock).rawBody).toBe(
			'<time_entry><user_comment>edited</user_comment></time_entry>',
		);
	});

	it('rejects a duration or start on an update, which the API answers with a 400', async () => {
		await expect(
			invoke(TimeEntries.update, {
				project_id: 5001,
				time_entry_id: 9001,
				duration_in_minutes: 20,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns the created task assignment', async () => {
		respondText(fetchMock, replyTaskAssignmentXml, 201);

		const result = await invoke(Assignments.taskCreate, {
			project_id: 5001,
			task_id: 7001,
			user_id: 42,
		});

		expect(result).toMatchObject({ task_assignment: { id: 8001 } });
	});

	it('returns the updated membership and sends the flag as 1 or 0', async () => {
		respondText(fetchMock, replyUserAssignmentXml);

		const result = await invoke(Assignments.userUpdate, {
			project_id: 5001,
			user_assignment_id: 6001,
			flag_allow_logging_time: true,
		});

		expect(result).toMatchObject({
			user_assignment: { id: 6001, flag_allow_logging_time: true },
		});
		expect(lastRequest(fetchMock).rawBody).toBe(
			'<user_assignment><flag_allow_logging_time>1</flag_allow_logging_time></user_assignment>',
		);
	});
});

describe('time-entry filters the API requires', () => {
	it('sends user_ids and the Unix timestamps on a project list', async () => {
		respondText(fetchMock, `${XML_HEAD}<time_entries/>`);

		await invoke(TimeEntries.list, {
			project_id: 5001,
			user_ids: [42, 43],
			from_timestamp: 1794372000,
			to_timestamp: 1794379200,
		});

		expect(lastRequest(fetchMock).query).toEqual({
			user_ids: '42;43',
			from_timestamp: '1794372000',
			to_timestamp: '1794379200',
		});
	});

	it('refuses a project list without user_ids', async () => {
		await expect(
			invoke(TimeEntries.list, {
				project_id: 5001,
				from_timestamp: 1794372000,
				to_timestamp: 1794379200,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a per-user list without the time range', async () => {
		await expect(
			invoke(TimeEntries.byUser, { project_id: 5001, user_id: 42 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('reports', () => {
	it('asks for a time summary by name and reads its entries', async () => {
		respondText(fetchMock, timeSummaryXml);

		const result = (await invoke(Users.projectReport, {
			project_id: 5001,
			user_ids: [42],
			from_timestamp: 1794372000,
			to_timestamp: 1794379200,
		})) as { time_summary: { duration_in_minutes: number }[] };

		expect(result.time_summary[0]?.duration_in_minutes).toBe(10);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/projects/5001/reports');
		expect(sent.query).toEqual({
			name: 'time_summary',
			user_ids: '42',
			from_timestamp: '1794372000',
			to_timestamp: '1794379200',
		});
	});

	it('asks for the manager report by date and reads its line items', async () => {
		respondText(fetchMock, managerReportXml);

		const result = (await invoke(Users.summaryReport, {
			from_date: '2026-11-10',
			to_date: '2026-11-12',
			timezone_offset: 0,
			project_ids: [5001],
		})) as { manager_report: { duration_in_minutes: number }[] };

		expect(result.manager_report[0]?.duration_in_minutes).toBe(20);
		expect(lastRequest(fetchMock).query).toEqual({
			name: 'manager_report',
			from_date: '2026-11-10',
			to_date: '2026-11-12',
			timezone_offset: '0',
			project_ids: '5001',
		});
	});
});

describe('the account behind the token', () => {
	it('does not return the API token', async () => {
		respondText(fetchMock, meXml);

		const result = (await invoke(Users.me, {})) as {
			user: Record<string, unknown>;
		};

		expect(result.user.id).toBe(42);
		expect(result.user).not.toHaveProperty('api_token');
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'not-a-real-token',
		);
	});
});

describe('errors', () => {
	it('puts the API error string and its reasons in the message', async () => {
		respondText(fetchMock, badParametersXml, 400);

		const error = (await invoke(Assignments.taskList, {
			project_id: 5001,
		}).catch((caught: unknown) => caught)) as WorksnapsAPIError;

		expect(error).toBeInstanceOf(WorksnapsAPIError);
		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'Worksnaps 400: Bad parameters in request (user_ids parameter has to be specified)',
		);
		expect(error.body).toBe(badParametersXml);
	});

	it('fails rather than return nothing when the expected root is missing', async () => {
		respondText(fetchMock, `${XML_HEAD}<unexpected><id>1</id></unexpected>`);

		await expect(invoke(Projects.get, { project_id: 5001 })).rejects.toThrow();
	});
});

describe('archived projects', () => {
	it('restores an archived project through an update', async () => {
		respondText(fetchMock, replyProjectXml);

		await invoke(Projects.update, { project_id: 5001, status: 'active' });

		expect(lastRequest(fetchMock).rawBody).toBe(
			'<project><status>active</status></project>',
		);
	});
});

describe('updates with nothing to change', () => {
	it('refuses a project update with no fields', async () => {
		await expect(
			invoke(Projects.update, { project_id: 5001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a task update with no fields', async () => {
		await expect(
			invoke(Tasks.update, { project_id: 5001, task_id: 7001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
