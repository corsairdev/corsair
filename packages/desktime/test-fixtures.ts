/**
 * Response bodies captured from the live API on 2026-11-08 with a real key, so
 * the tests exercise the shapes DeskTime actually sends rather than the ones
 * the help-center examples show. Where the two disagree, the capture wins and
 * the difference is noted at the field.
 */

export const PING_BODY = {
	pong: '1794135987',
	__request_time: '1794135987',
};

export const COMPANY_BODY = {
	name: 'corsair test company',
	work_starts: '08:00:00',
	work_ends: '18:00:00',
	work_duration: '28800',
	working_days: 0,
	work_start_tracking: '00:00:00',
	work_stop_tracking: '23:59:59',
	timezone_identifier: 'Asia/Kolkata',
	__request_time: '1794135986',
};

/**
 * The docs show `arrived` as a timestamp and omit `work_starts`, `work_ends`,
 * `notes`, `timezone` and `activeProject`. The API sends all of them, and
 * `arrived` is the boolean false until the employee arrives.
 */
export const EMPLOYEE = {
	id: 789760,
	name: 'corsair test',
	// The captured address was a real mailbox; this one is a placeholder.
	email: 'corsair.test@example.com',
	groupId: 0,
	group: '-',
	profileUrl: 'https://desktime.com/app/employee/789760/2026-11-08',
	isOnline: false,
	arrived: false,
	left: false,
	late: false,
	onlineTime: 0,
	offlineTime: 0,
	desktimeTime: 0,
	atWorkTime: 0,
	afterWorkTime: 0,
	beforeWorkTime: 0,
	productiveTime: 0,
	productivity: 0,
	efficiency: 0,
	work_starts: false,
	work_ends: false,
	notes: [],
	timezone: 'Asia/Kolkata',
	activeProject: [],
};

/** The same employee after arriving, where the timestamps become strings. */
export const EMPLOYEE_ARRIVED = {
	...EMPLOYEE,
	isOnline: true,
	arrived: '2026-11-08 05:13:00',
	left: '2026-11-08 07:44:01',
	work_starts: '2026-11-08 05:13:00',
	work_ends: '2026-11-08 07:44:01',
	onlineTime: 8933,
	productiveTime: 5714,
	productivity: 63.98,
	efficiency: 22.67,
};

export const EMPLOYEES_BODY = {
	employees: {
		'2026-11-08': {
			'789760': EMPLOYEE,
		},
	},
	__request_time: '1794135991',
};

/** A week request returns one bucket per day, each keyed by employee id. */
export const EMPLOYEES_WEEK_BODY = {
	employees: {
		'2026-11-02': { '789760': EMPLOYEE },
		'2026-11-03': { '789760': EMPLOYEE },
		'2026-11-08': { '789760': EMPLOYEE_ARRIVED },
	},
	__request_time: '1794135994',
};

export const EMPLOYEE_APPS_BODY = {
	...EMPLOYEE,
	apps: {
		'-1': [],
		'0': [],
		'1': [],
	},
};

export const EMPLOYEE_APPS_FILLED_BODY = {
	...EMPLOYEE,
	apps: {
		'-1': [{ app: 'Safari', title: 'Docs', time: 120 }],
		'0': [{ app: 'Slack', title: 'Chat', time: 300 }],
		'1': [{ app: 'VS Code', title: 'main.ts', time: 5400 }],
	},
};

export const EMPLOYEE_PROJECTS_BODY = {
	...EMPLOYEE,
	projects: [],
};

export const PROJECTS_BODY = {
	projects: [],
	__request_time: '1794136000',
};

/** DeskTime's error envelope, which matches the HTTP status. */
export function errorBody(code: number, description: string) {
	return { error: { code, description } };
}

export const MISSING_KEY_ERROR = errorBody(401, 'API Key is missing');
export const INVALID_KEY_ERROR = errorBody(401, 'API Key is invalid');
