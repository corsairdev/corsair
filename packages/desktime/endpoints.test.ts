import {
	DeskTimeEndpointInputSchemas as Inputs,
	DeskTimeEndpointOutputSchemas as Outputs,
	withAppsByProductivity,
	withBuckets,
} from './endpoints/types';
import {
	COMPANY_BODY,
	EMPLOYEE,
	EMPLOYEE_APPS_BODY,
	EMPLOYEE_APPS_FILLED_BODY,
	EMPLOYEE_ARRIVED,
	EMPLOYEE_PROJECTS_BODY,
	EMPLOYEES_BODY,
	EMPLOYEES_WEEK_BODY,
	PING_BODY,
	PROJECTS_BODY,
} from './test-fixtures';

describe('ping', () => {
	it('reads the pong timestamp', () => {
		const output = Outputs.ping.parse(PING_BODY);
		expect(output.pong).toBe('1794135987');
		expect(output.__request_time).toBe('1794135987');
	});

	it('rejects a body without a pong', () => {
		expect(() => Outputs.ping.parse({})).toThrow();
	});
});

describe('company', () => {
	it('reads the account work settings', () => {
		const output = Outputs.company.parse(COMPANY_BODY);
		expect(output.name).toBe('corsair test company');
		expect(output.work_starts).toBe('08:00:00');
		expect(output.work_ends).toBe('18:00:00');
		expect(output.timezone_identifier).toBe('Asia/Kolkata');
	});

	it('accepts work_duration as the string the API sends', () => {
		const output = Outputs.company.parse(COMPANY_BODY);
		expect(output.work_duration).toBe('28800');
	});

	it('accepts work_duration as a number too, since the type allows both', () => {
		const output = Outputs.company.parse({
			...COMPANY_BODY,
			work_duration: 28800,
		});
		expect(output.work_duration).toBe(28800);
	});

	it('keeps unknown fields, so a new setting cannot fail a call', () => {
		const output = Outputs.company.parse({ ...COMPANY_BODY, newSetting: 'x' });
		expect(output).toMatchObject({ newSetting: 'x' });
	});
});

describe('employees', () => {
	it('parses the nested date and employee-id maps', () => {
		const output = Outputs.employees.parse(withBuckets(EMPLOYEES_BODY));
		expect(Object.keys(output.employees)).toEqual(['2026-11-08']);
		expect(output.employees['2026-11-08']?.['789760']?.id).toBe(789760);
	});

	it('flattens buckets newest first for callers', () => {
		const output = Outputs.employees.parse(withBuckets(EMPLOYEES_WEEK_BODY));
		expect(output.buckets.map((bucket) => bucket.date)).toEqual([
			'2026-11-08',
			'2026-11-03',
			'2026-11-02',
		]);
	});

	it('keeps one employee per bucket on a week response', () => {
		const output = Outputs.employees.parse(withBuckets(EMPLOYEES_WEEK_BODY));
		expect(output.buckets[0]?.employees).toHaveLength(1);
		expect(output.buckets[0]?.employees[0]?.id).toBe(789760);
	});

	it('parses an empty employee set without inventing rows', () => {
		const output = Outputs.employees.parse(withBuckets({ employees: {} }));
		expect(output.buckets).toEqual([]);
	});

	it('rejects a raw body that skips the buckets step', () => {
		// The endpoint always runs withBuckets first, so a bare provider body
		// should not parse: that would mean the step was dropped.
		expect(() => Outputs.employees.parse(EMPLOYEES_BODY)).toThrow();
	});

	it('rejects an employees value that is an array instead of a map', () => {
		expect(() =>
			Outputs.employees.parse(withBuckets({ employees: [] })),
		).toThrow();
	});

	it('rejects a malformed known field such as a non-numeric id', () => {
		expect(() =>
			Outputs.employees.parse(
				withBuckets({ employees: { '2026-11-08': { '1': { id: 'abc' } } } }),
			),
		).toThrow();
	});
});

describe('employee', () => {
	it('accepts the boolean false DeskTime sends before an arrival', () => {
		// The help-center example shows a timestamp here. The API sends `false`,
		// which a plain string schema would reject on every fresh day.
		const output = Outputs.employeeBasic.parse(EMPLOYEE);
		expect(output.arrived).toBe(false);
		expect(output.left).toBe(false);
		expect(output.work_starts).toBe(false);
		expect(output.work_ends).toBe(false);
	});

	it('reads a running project sent as one object instead of a list', () => {
		// Only the empty array was ever captured. If a running project arrives
		// as a bare object, it must not fail the read.
		const output = Outputs.employeeBasic.parse({
			...EMPLOYEE,
			activeProject: { project_id: 67973, project_title: 'Blue Book' },
		});
		expect(output.activeProject).toEqual({
			project_id: 67973,
			project_title: 'Blue Book',
		});
	});

	it('still reads a running project sent as a list', () => {
		const output = Outputs.employeeBasic.parse({
			...EMPLOYEE,
			activeProject: [{ project: 'Blue Book', task: 'Cover' }],
		});
		expect(output.activeProject).toEqual([
			{ project: 'Blue Book', task: 'Cover' },
		]);
	});

	it('does not fail a whole employee list over one running project', () => {
		const output = Outputs.employees.parse(
			withBuckets({
				employees: {
					'2026-11-08': {
						'1': { ...EMPLOYEE, id: 1 },
						'2': {
							...EMPLOYEE,
							id: 2,
							activeProject: { project_id: 67973 },
						},
					},
				},
			}),
		);
		expect(output.buckets[0]?.employees).toHaveLength(2);
	});

	it('reads a note row whose values are not all strings', () => {
		const output = Outputs.employeeBasic.parse({
			...EMPLOYEE,
			notes: [{ id: 12, note: 'left early' }],
		});
		expect(output.notes).toEqual([{ id: 12, note: 'left early' }]);
	});

	it('rejects an active project that is neither a list nor an object', () => {
		expect(() =>
			Outputs.employeeBasic.parse({ ...EMPLOYEE, activeProject: 'nope' }),
		).toThrow();
	});

	it('accepts timestamps once the employee has arrived', () => {
		const output = Outputs.employeeBasic.parse(EMPLOYEE_ARRIVED);
		expect(output.arrived).toBe('2026-11-08 05:13:00');
		expect(output.productivity).toBe(63.98);
	});

	it('reads the camelCase fields exactly as sent', () => {
		const output = Outputs.employeeBasic.parse(EMPLOYEE);
		expect(output.groupId).toBe(0);
		expect(output.isOnline).toBe(false);
		expect(output.onlineTime).toBe(0);
		expect(output.profileUrl).toContain('desktime.com');
	});

	it('reads the snake_case fields alongside the camelCase ones', () => {
		const output = Outputs.employeeBasic.parse(EMPLOYEE);
		expect(output.timezone).toBe('Asia/Kolkata');
		expect(output.notes).toEqual([]);
		expect(output.activeProject).toEqual([]);
	});

	it('requires an id, since every other field is optional', () => {
		expect(() => Outputs.employeeBasic.parse({ name: 'x' })).toThrow();
	});
});

describe('employee.apps', () => {
	it('relabels the productivity keys', () => {
		const output = Outputs.employeeApps.parse(
			withAppsByProductivity(EMPLOYEE_APPS_FILLED_BODY),
		);
		expect(output.apps_by_productivity?.productive?.[0]?.app).toBe('VS Code');
		expect(output.apps_by_productivity?.neutral?.[0]?.app).toBe('Slack');
		expect(output.apps_by_productivity?.unrated?.[0]?.app).toBe('Safari');
	});

	it('keeps the raw apps map under its original keys', () => {
		const output = Outputs.employeeApps.parse(
			withAppsByProductivity(EMPLOYEE_APPS_FILLED_BODY),
		);
		expect(output.apps?.['-1']?.[0]?.app).toBe('Safari');
		expect(output.apps?.['1']?.[0]?.app).toBe('VS Code');
	});

	it('handles the empty arrays the API sends on an idle day', () => {
		const output = Outputs.employeeApps.parse(
			withAppsByProductivity(EMPLOYEE_APPS_BODY),
		);
		expect(output.apps_by_productivity?.productive).toEqual([]);
		expect(output.apps_by_productivity?.neutral).toEqual([]);
	});

	it('leaves the labelled map undefined when apps is absent', () => {
		const output = Outputs.employeeApps.parse(withAppsByProductivity(EMPLOYEE));
		expect(output.apps_by_productivity).toBeUndefined();
	});
});

describe('employee.projects', () => {
	it('reads the projects array', () => {
		const output = Outputs.employeeProjects.parse(EMPLOYEE_PROJECTS_BODY);
		expect(output.projects).toEqual([]);
	});

	it('reads a populated project row, so a real day cannot fail parsing', () => {
		const output = Outputs.employeeProjects.parse({
			...EMPLOYEE,
			projects: [{ project: 'Website redesign', task: 'Homepage', time: 5400 }],
		});
		expect(output.projects).toHaveLength(1);
		expect(output.projects?.[0]?.project).toBe('Website redesign');
		expect(output.projects?.[0]?.time).toBe(5400);
	});

	it('rejects a projects value that is not a list', () => {
		expect(() =>
			Outputs.employeeProjects.parse({ ...EMPLOYEE, projects: 'nope' }),
		).toThrow();
	});
});

describe('projects', () => {
	it('reads an empty project list', () => {
		const output = Outputs.projects.parse(PROJECTS_BODY);
		expect(output.projects).toEqual([]);
	});

	it('reads a project row', () => {
		const output = Outputs.projects.parse({
			projects: [{ id: 1, name: 'Website redesign' }],
		});
		expect(output.projects[0]?.name).toBe('Website redesign');
	});

	it('rejects a body with no projects key', () => {
		expect(() => Outputs.projects.parse({})).toThrow();
	});

	it('declares the tasks and creation dates the reference documents', () => {
		// The row from https://help.desktime.com/hc/en-us/articles/25495195415453.
		const output = Outputs.projects.parse({
			projects: [
				{
					id: 104211,
					name: 'Meeting with the clients',
					created_at: '1539883088',
					created_at_iso: '2018-10-18T17:18:08+00:00',
					tasks: [
						{
							id: 2907131,
							name: 'Meeting with the clients task',
							created_at: '1629201786',
							created_at_iso: '2021-08-17T12:03:06+00:00',
						},
					],
				},
			],
		});
		expect(output.projects[0]?.tasks?.[0]?.name).toBe(
			'Meeting with the clients task',
		);
		expect(output.projects[0]?.created_at_iso).toBe(
			'2018-10-18T17:18:08+00:00',
		);

		// The fields have to be in the schema, not only passed through, or the
		// API reference and get_schema never mention that tasks exist.
		const row = Outputs.projects.shape.projects.element.shape;
		expect(Object.keys(row).sort()).toEqual([
			'created_at',
			'created_at_iso',
			'id',
			'name',
			'tasks',
		]);
		expect(
			Object.keys(row.tasks.unwrap().unwrap().element.shape).sort(),
		).toEqual(['created_at', 'created_at_iso', 'id', 'name']);
	});

	it('rejects a task list that is not a list', () => {
		expect(() =>
			Outputs.projects.parse({ projects: [{ id: 1, tasks: 'nope' }] }),
		).toThrow();
	});
});

describe('input validation', () => {
	it('accepts each documented period', () => {
		for (const period of ['day', 'week', 'month'] as const) {
			expect(() => Inputs.employees.parse({ period })).not.toThrow();
		}
	});

	it('rejects a period outside the documented set', () => {
		expect(() => Inputs.employees.parse({ period: 'quarter' })).toThrow();
	});

	it('accepts an ISO date', () => {
		expect(() => Inputs.employees.parse({ date: '2026-11-08' })).not.toThrow();
	});

	it('rejects a date in another format', () => {
		expect(() => Inputs.employees.parse({ date: '08/11/2026' })).toThrow();
	});

	it('rejects an impossible calendar date, which DeskTime would silently ignore', () => {
		expect(() => Inputs.employees.parse({ date: '2026-13-01' })).toThrow();
		expect(() => Inputs.employees.parse({ date: '2026-02-30' })).toThrow();
	});

	it('accepts a real leap day', () => {
		expect(() => Inputs.employees.parse({ date: '2024-02-29' })).not.toThrow();
	});

	it('rejects a non-positive or fractional employee id', () => {
		expect(() => Inputs.employeeBasic.parse({ id: 0 })).toThrow();
		expect(() => Inputs.employeeBasic.parse({ id: 1.5 })).toThrow();
	});

	it('allows omitting the employee id, which defaults to the key owner', () => {
		expect(() => Inputs.employeeBasic.parse({})).not.toThrow();
	});
});
