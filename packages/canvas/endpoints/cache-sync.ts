import type { CanvasContext } from '../index';
import type { CanvasRoute } from './routes';
import type { CanvasRequestInput } from './types';

type CacheEntity =
	| 'courses'
	| 'accounts'
	| 'users'
	| 'assignments'
	| 'enrollments';

type CacheRule = {
	entity: CacheEntity;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const COURSES: CacheRule = {
	entity: 'courses',
	idKeys: ['id', 'course_id'],
	deleteInputKeys: ['course_id', 'id'],
};

const ACCOUNTS: CacheRule = {
	entity: 'accounts',
	idKeys: ['id', 'account_id'],
	deleteInputKeys: ['account_id', 'id'],
};

const USERS: CacheRule = {
	entity: 'users',
	idKeys: ['id', 'user_id'],
	deleteInputKeys: ['user_id', 'id'],
};

const ASSIGNMENTS: CacheRule = {
	entity: 'assignments',
	idKeys: ['id', 'assignment_id'],
	deleteInputKeys: ['assignment_id', 'id'],
};

const ENROLLMENTS: CacheRule = {
	entity: 'enrollments',
	idKeys: ['id', 'enrollment_id'],
	deleteInputKeys: ['enrollment_id', 'id'],
};

/**
 * Route-only rules — never blanket-map a group (permissions/analytics/
 * notifications would poison parent entity caches).
 */
const ROUTE_CACHE_RULES: Partial<Record<string, CacheRule>> = {
	// Courses — https://canvas.instructure.com/doc/api/courses.html
	createCourse: COURSES,
	getSingleCourse: COURSES,
	getAccountCourse: COURSES,
	addCourseToFavorites: COURSES,
	// Accounts — https://canvas.instructure.com/doc/api/accounts.html
	getSingleAccount: ACCOUNTS,
	getAccountsThatUsersCanCreateCoursesIn: ACCOUNTS,
	// Users — https://canvas.instructure.com/doc/api/users.html
	getCurrentUser: USERS,
	getSingleUser: USERS,
	getUserProfile: USERS,
	editUser: USERS,
	getAllUsers: USERS,
	// Assignments — https://canvas.instructure.com/doc/api/assignments.html
	createAssignment: ASSIGNMENTS,
	getAssignment: ASSIGNMENTS,
	editAssignment: ASSIGNMENTS,
	deleteAssignment: ASSIGNMENTS,
	getAllAssignments: ASSIGNMENTS,
	// Enrollments — https://canvas.instructure.com/doc/api/enrollments.html
	createEnrollment: ENROLLMENTS,
	concludeDeactivateOrDeleteEnrollment: ENROLLMENTS,
	getEnrollmentInvitations: ENROLLMENTS,
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
	input: CanvasRequestInput,
	rule: CacheRule,
): string[] {
	const pathParams = isRecord(input.pathParams) ? input.pathParams : {};
	const body = isRecord(input.body) ? input.body : {};
	const deleteInput: Record<string, unknown> = {
		...input,
		...body,
		...pathParams,
	};

	for (const key of rule.deleteInputKeys ?? rule.idKeys) {
		const value = deleteInput[key];
		if (typeof value === 'string' && value.length > 0) return [value];
		if (typeof value === 'number') return [String(value)];
	}
	return [];
}

/** Canvas enrollment destroy task — omit/conclude/deactivate keep the row. */
function enrollmentDestroyTask(input: CanvasRequestInput): string | undefined {
	const query = isRecord(input.query) ? input.query : {};
	const body = isRecord(input.body) ? input.body : {};
	const task = query.task ?? body.task;
	if (typeof task === 'string' && task.trim()) return task.trim().toLowerCase();
	return undefined;
}

/**
 * Hard cache removal only for true deletes.
 * Enrollment DELETE concludes by default; only task=delete removes the entity.
 */
function shouldRemoveFromCache(
	route: Pick<CanvasRoute, 'method' | 'key' | 'riskLevel'>,
	input: CanvasRequestInput,
): boolean {
	if (route.key === 'concludeDeactivateOrDeleteEnrollment') {
		return enrollmentDestroyTask(input) === 'delete';
	}
	return route.method === 'DELETE' || route.riskLevel === 'destructive';
}

export async function syncCanvasOperationCache(
	ctx: CanvasContext,
	route: Pick<CanvasRoute, 'method' | 'key' | 'riskLevel'>,
	input: CanvasRequestInput,
	response: unknown,
) {
	const rule = ROUTE_CACHE_RULES[route.key];
	if (!rule) return;

	// ctx.db entity clients are dynamically keyed; assert to the upsert/delete shape used here.
	const db = ctx.db as unknown as
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
		if (shouldRemoveFromCache(route, input)) {
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
		console.warn(`[canvas] Failed to sync ${rule.entity} cache:`, error);
	}
}
