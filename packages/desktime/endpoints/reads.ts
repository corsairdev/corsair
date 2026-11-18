import type { DeskTimeEndpoints } from '..';
import { call } from './call';
import {
	DeskTimeEndpointInputSchemas as Inputs,
	DeskTimeEndpointOutputSchemas as Outputs,
	withAppsByProductivity,
	withBuckets,
} from './types';

/**
 * Reads the account settings: work hours, the tracking window and the timezone.
 */
export const company: DeskTimeEndpoints['company'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.get',
			input: Inputs.company,
			output: Outputs.company,
		},
		input,
		() => ({ action: 'company' }),
		{
			// The company name is the account's own, not a person's, so it is safe
			// to log. Nothing else here identifies anyone.
			log: (_, result) => ({ companyName: result.name ?? undefined }),
		},
	);

/**
 * Checks that the API answers.
 *
 * DeskTime serves this without a key, but the Corsair runtime resolves the
 * account key before invoking any endpoint, so a configured key is still
 * required to reach it. It is useful as the cheapest way to confirm a key
 * works and the service is up.
 */
export const ping: DeskTimeEndpoints['ping'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ping.get',
			input: Inputs.ping,
			output: Outputs.ping,
		},
		input,
		() => ({ action: 'ping' }),
		{
			log: (_, result) => ({ pong: result.pong }),
		},
	);

/** Lists every employee, nested by date and then by employee id. */
export const employees: DeskTimeEndpoints['employees'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'employees.list',
			input: Inputs.employees,
			output: Outputs.employees,
		},
		input,
		(parsed) => ({
			action: 'employees',
			query: { date: parsed.date, period: parsed.period },
		}),
		{
			shape: (raw) =>
				withBuckets(
					raw as {
						employees: Record<string, Record<string, never>>;
					},
				),
			log: (_, result) => ({
				buckets: result.buckets.length,
				employees: result.buckets.reduce(
					(total, bucket) => total + bucket.employees.length,
					0,
				),
			}),
		},
	);

/** Reads one employee's day: work times, tracked time and productivity. */
export const employeeBasic: DeskTimeEndpoints['employeeBasic'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'employee.basic',
			input: Inputs.employeeBasic,
			output: Outputs.employeeBasic,
		},
		input,
		(parsed) => ({
			action: 'employee/basic',
			query: { id: parsed.id, date: parsed.date },
		}),
		{
			log: (_, result) => ({ employeeId: result.id }),
		},
	);

/** Reads the apps an employee used on a day, grouped by productivity class. */
export const employeeApps: DeskTimeEndpoints['employeeApps'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'employee.apps',
			input: Inputs.employeeApps,
			output: Outputs.employeeApps,
		},
		input,
		(parsed) => ({
			action: 'employee/apps',
			query: { id: parsed.id, date: parsed.date },
		}),
		{
			shape: (raw) =>
				withAppsByProductivity(
					raw as { apps?: Record<string, never[]> | null },
				),
			log: (_, result) => ({
				employeeId: result.id,
				productiveApps: result.apps_by_productivity?.productive?.length ?? 0,
			}),
		},
	);

/** Reads the projects an employee tracked time against on a day. */
export const employeeProjects: DeskTimeEndpoints['employeeProjects'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'employee.projects',
			input: Inputs.employeeProjects,
			output: Outputs.employeeProjects,
		},
		input,
		(parsed) => ({
			action: 'employee/projects',
			query: { id: parsed.id, date: parsed.date },
		}),
		{
			log: (_, result) => ({
				employeeId: result.id,
				projects: result.projects?.length ?? 0,
			}),
		},
	);

/** Lists the account's projects. */
export const list: DeskTimeEndpoints['projects'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projects,
			output: Outputs.projects,
		},
		input,
		() => ({ action: 'projects' }),
		{
			log: (_, result) => ({ count: result.projects.length }),
		},
	);
