import type { WorkdayContext } from '../index';
import type { WorkdayRoute } from './routes';
import type { WorkdayEndpointInput } from './types';

type CacheEntity =
	| 'workers'
	| 'jobs'
	| 'jobPostings'
	| 'jobRequisitions'
	| 'payrollInputs'
	| 'prospects'
	| 'interviews'
	| 'absenceBalances';

type CacheRule = {
	entity: CacheEntity;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const WORKERS: CacheRule = {
	entity: 'workers',
	idKeys: ['id', 'ID', 'workerId', 'worker_id'],
	listKeys: ['data', 'workers'],
	deleteInputKeys: ['id', 'ID', 'workerId'],
};

const JOBS: CacheRule = {
	entity: 'jobs',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'jobs'],
	deleteInputKeys: ['id', 'ID'],
};

const JOB_POSTINGS: CacheRule = {
	entity: 'jobPostings',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'jobPostings'],
	deleteInputKeys: ['id', 'ID'],
};

const JOB_REQUISITIONS: CacheRule = {
	entity: 'jobRequisitions',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'jobRequisitions'],
	deleteInputKeys: ['id', 'ID'],
};

const PAYROLL_INPUTS: CacheRule = {
	entity: 'payrollInputs',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'payrollInputs'],
	deleteInputKeys: ['id', 'ID'],
};

const PROSPECTS: CacheRule = {
	entity: 'prospects',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'prospects'],
	deleteInputKeys: ['id', 'ID'],
};

const INTERVIEWS: CacheRule = {
	entity: 'interviews',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'interviews'],
	deleteInputKeys: ['id', 'ID'],
};

const ABSENCE_BALANCES: CacheRule = {
	entity: 'absenceBalances',
	idKeys: ['id', 'ID'],
	listKeys: ['data', 'balances'],
	deleteInputKeys: ['id', 'ID'],
};

/**
 * Route-only rules — never blanket-map `worker` group (subresources like
 * leavesOfAbsence would poison the workers cache).
 */
const ROUTE_CACHE_RULES: Partial<Record<string, CacheRule>> = {
	// Staffing / Compensation workers
	getWorkerStaffingInformation: WORKERS,
	getWorkerInfo: WORKERS,
	getCurrentUser: WORKERS,
	getWorkersCollectionStaffing: WORKERS,
	// Staffing jobs (JobsApi.getCollection / getJobById)
	getJobById: JOBS,
	getCollectionOfJobs: JOBS,
	listJobs: JOBS,
	// Recruiting
	listJobPostings: JOB_POSTINGS,
	getJobPosting: JOB_POSTINGS,
	getMyJobPostings: JOB_REQUISITIONS,
	getProspect: PROSPECTS,
	getInterview: INTERVIEWS,
	listInterviews: INTERVIEWS,
	// Payroll
	getCollectionOfPayroll: PAYROLL_INPUTS,
	getPayrollInputInstance: PAYROLL_INPUTS,
	createPayrollInputs: PAYROLL_INPUTS,
	updateAnExistingPayroll: PAYROLL_INPUTS,
	// Absence
	listBalances: ABSENCE_BALANCES,
	getAbsenceBalance: ABSENCE_BALANCES,
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cacheItems(response: unknown, rule: CacheRule) {
	if (Array.isArray(response)) return response.filter(isRecord);
	if (!isRecord(response)) return [];

	for (const key of rule.listKeys ?? []) {
		const value = response[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	return [response];
}

function cacheEntityId(item: Record<string, unknown>, rule: CacheRule) {
	for (const key of rule.idKeys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

function cacheDeleteEntityIds(
	input: Record<string, unknown>,
	rule: CacheRule,
): string[] {
	const deleteInput = isRecord(input.body)
		? { ...input, ...input.body }
		: input;

	for (const key of rule.deleteInputKeys ?? rule.idKeys) {
		const value = deleteInput[key];
		if (typeof value === 'string' && value.length > 0) return [value];
		if (typeof value === 'number') return [String(value)];
	}
	return [];
}

export async function syncWorkdayOperationCache(
	ctx: WorkdayContext,
	route: Pick<WorkdayRoute, 'method' | 'group' | 'name' | 'riskLevel'>,
	input: WorkdayEndpointInput,
	response: unknown,
) {
	const rule = ROUTE_CACHE_RULES[route.name];
	if (!rule) return;

	const db = ctx.db as
		| Record<
				string,
				| {
						upsertByEntityId?: (
							entityId: string,
							data: Record<string, unknown>,
						) => Promise<unknown>;
						deleteByEntityId?: (entityId: string) => Promise<boolean>;
				  }
				| undefined
		  >
		| undefined;
	const client = db?.[rule.entity];
	if (!client) return;

	try {
		const isDelete =
			route.method === 'DELETE' || route.riskLevel === 'destructive';
		if (isDelete) {
			if (!client.deleteByEntityId) return;
			for (const entityId of cacheDeleteEntityIds(input, rule)) {
				await client.deleteByEntityId(entityId);
			}
			return;
		}

		if (!client.upsertByEntityId) return;

		for (const item of cacheItems(response, rule)) {
			const entityId = cacheEntityId(item, rule);
			if (!entityId) continue;
			await client.upsertByEntityId(entityId, item);
		}
	} catch (error) {
		console.warn(`[workday] Failed to sync ${rule.entity} cache:`, error);
	}
}
