import type { TallyForm, TallySubmission, TallyWorkspace } from './schema/database';

/**
 * Serializes workspace IDs for `GET /forms` query (OpenAPI `style: form`, `explode: true`).
 * Example: `["a", "b c"]` → `workspaceIds=a&workspaceIds=b%20c`
 */
export function buildFormsListWorkspaceQuerySegment(
	workspaceIds: string[],
): string {
	return workspaceIds
		.map((id) => `workspaceIds=${encodeURIComponent(id)}`)
		.join('&');
}

function toDate(value: string | undefined | null): Date | undefined {
	return value ? new Date(value) : undefined;
}

export function toFormRecord(form: {
	id: string;
	name?: string;
	status?: string;
	workspaceId?: string | null;
	createdAt?: string;
	updatedAt?: string;
}): TallyForm {
	return {
		id: form.id,
		name: form.name,
		status: form.status,
		workspaceId: form.workspaceId,
		createdAt: toDate(form.createdAt),
		updatedAt: toDate(form.updatedAt),
	};
}

export function toWorkspaceRecord(workspace: {
	id: string;
	name?: string;
	createdAt?: string;
	updatedAt?: string;
}): TallyWorkspace {
	return {
		id: workspace.id,
		name: workspace.name,
		createdAt: toDate(workspace.createdAt),
		updatedAt: toDate(workspace.updatedAt),
	};
}

export function toSubmissionRecord(submission: {
	id: string;
	formId?: string;
	respondentId?: string | null;
	isCompleted?: boolean;
	createdAt?: string;
	fields?: unknown[];
}): TallySubmission {
	return {
		id: submission.id,
		formId: submission.formId,
		respondentId: submission.respondentId,
		isCompleted: submission.isCompleted,
		createdAt: toDate(submission.createdAt),
		fields: submission.fields as Record<string, unknown>[] | undefined,
	};
}

export async function safeDbUpsert<T>(
	db: { upsertByEntityId: (id: string, data: T) => Promise<unknown> } | undefined,
	entityId: string,
	data: T,
	label: string,
): Promise<void> {
	if (!db) return;
	try {
		await db.upsertByEntityId(entityId, data);
	} catch (error) {
		console.warn(`Failed to save ${label} to database:`, error);
	}
}

export async function safeDbDelete(
	db: { deleteByEntityId: (id: string) => Promise<unknown> } | undefined,
	entityId: string,
	label: string,
): Promise<void> {
	if (!db) return;
	try {
		await db.deleteByEntityId(entityId);
	} catch (error) {
		console.warn(`Failed to delete ${label} from database:`, error);
	}
}
