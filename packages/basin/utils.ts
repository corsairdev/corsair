import type {
	BasinDomain,
	BasinForm,
	BasinFormView,
	BasinFormWebhook,
	BasinProject,
	BasinSubmission,
} from './schema/database';

function toDate(value: string | undefined | null): Date | undefined {
	return value ? new Date(value) : undefined;
}

export function toFormRecord(form: {
	id?: string | number;
	uuid?: string | null;
	name?: string;
	timezone?: string;
	redirect_url?: string | null;
	use_ajax?: boolean;
	notification_emails?: string;
	autoreply?: boolean;
	created_at?: string;
	updated_at?: string;
}): BasinForm {
	return {
		id: form.id ?? '',
		uuid: form.uuid,
		name: form.name,
		timezone: form.timezone,
		redirect_url: form.redirect_url,
		use_ajax: form.use_ajax,
		notification_emails: form.notification_emails,
		autoreply: form.autoreply,
		created_at: toDate(form.created_at),
		updated_at: toDate(form.updated_at),
	};
}

export function toSubmissionRecord(submission: {
	id: string | number;
	form_id?: string | number;
	email?: string | null;
	spam?: boolean;
	read?: boolean;
	trash?: boolean;
	payload_params?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
}): BasinSubmission {
	return {
		id: submission.id,
		form_id: submission.form_id,
		email: submission.email,
		spam: submission.spam,
		read: submission.read,
		trash: submission.trash,
		payload_params: submission.payload_params,
		created_at: toDate(submission.created_at),
		updated_at: toDate(submission.updated_at),
	};
}

export function toProjectRecord(project: {
	id: string | number;
	name?: string;
	created_at?: string;
	updated_at?: string;
}): BasinProject {
	return {
		id: project.id,
		name: project.name,
		created_at: toDate(project.created_at),
		updated_at: toDate(project.updated_at),
	};
}

export function toWebhookRecord(webhook: {
	id: string | number;
	form_id?: string | number;
	name?: string;
	url?: string;
	format?: string;
	trigger_when_spam?: boolean;
	enabled?: boolean;
	created_at?: string;
	updated_at?: string;
}): BasinFormWebhook {
	return {
		id: webhook.id,
		form_id: webhook.form_id,
		name: webhook.name,
		url: webhook.url,
		format: webhook.format,
		trigger_when_spam: webhook.trigger_when_spam,
		enabled: webhook.enabled,
		created_at: toDate(webhook.created_at),
		updated_at: toDate(webhook.updated_at),
	};
}

export function toDomainRecord(domain: {
	id?: string | number;
	domain?: string;
	created_at?: string;
	updated_at?: string;
}): BasinDomain {
	return {
		id: domain.id,
		domain: domain.domain,
		created_at: toDate(domain.created_at),
		updated_at: toDate(domain.updated_at),
	};
}

export function toFormViewRecord(formView: {
	id?: string | number;
	form_id?: string | number;
	name?: string | null;
	status?: string;
	created_at?: string;
	updated_at?: string;
}): BasinFormView {
	return {
		id: formView.id,
		form_id: formView.form_id,
		name: formView.name,
		status: formView.status,
		created_at: toDate(formView.created_at),
		updated_at: toDate(formView.updated_at),
	};
}

export async function safeDbUpsert<T>(
	db:
		| { upsertByEntityId: (id: string, data: T) => Promise<unknown> }
		| undefined,
	entityId: string | number,
	data: T,
	label: string,
): Promise<void> {
	if (!db) return;
	try {
		await db.upsertByEntityId(String(entityId), data);
	} catch (error) {
		console.warn(`Failed to save ${label} to database:`, error);
	}
}

export async function safeDbDelete(
	db: { deleteByEntityId: (id: string) => Promise<unknown> } | undefined,
	entityId: string | number,
	label: string,
): Promise<void> {
	if (!db) return;
	try {
		await db.deleteByEntityId(String(entityId));
	} catch (error) {
		console.warn(`Failed to delete ${label} from database:`, error);
	}
}
