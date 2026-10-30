import type {
	MailtrapContactEntity,
	MailtrapContactFieldEntity,
	MailtrapContactListEntity,
	MailtrapEmailTemplateEntity,
	MailtrapInboxEntity,
	MailtrapProjectEntity,
	MailtrapSendingDomainEntity,
} from '../schema/database';
import type {
	MailtrapContact,
	MailtrapContactField,
	MailtrapContactList,
	MailtrapEmailTemplate,
	MailtrapInbox,
	MailtrapProject,
	MailtrapSendingDomain,
} from './types';

/**
 * Minimal structural view of a Corsair entity store. Only the two operations
 * the Mailtrap endpoints need are declared, so the helpers below stay usable
 * whatever else the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local
 * mirror could not be written. Failures are warned about and swallowed.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[MAILTRAP] failed to cache ${what}:`, error);
	}
}

/** Mirrors a contact into the local cache. */
export async function cacheContact(
	store: EntityStore<MailtrapContactEntity> | undefined,
	contact: MailtrapContact | undefined | null,
) {
	if (!store || !contact?.id) return;
	await safely(
		() =>
			store.upsertByEntityId(contact.id, {
				id: contact.id,
				email: contact.email,
				created_at:
					contact.created_at != null ? new Date(contact.created_at) : null,
				updated_at:
					contact.updated_at != null ? new Date(contact.updated_at) : null,
				list_ids: contact.list_ids,
				status: contact.status,
				fields: contact.fields,
			}),
		`contact ${contact.id}`,
	);
}

/** Mirrors a contact list into the local cache. */
export async function cacheContactList(
	store: EntityStore<MailtrapContactListEntity> | undefined,
	list: MailtrapContactList | undefined | null,
) {
	if (!store || list?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(list.id), {
				id: list.id,
				name: list.name,
			}),
		`contact list ${list.id}`,
	);
}

/** Mirrors a contact field into the local cache. */
export async function cacheContactField(
	store: EntityStore<MailtrapContactFieldEntity> | undefined,
	field: MailtrapContactField | undefined | null,
) {
	if (!store || field?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(field.id), {
				id: field.id,
				name: field.name,
				merge_tag: field.merge_tag,
				data_type: field.data_type,
			}),
		`contact field ${field.id}`,
	);
}

/** Mirrors an email template into the local cache. */
export async function cacheEmailTemplate(
	store: EntityStore<MailtrapEmailTemplateEntity> | undefined,
	template: MailtrapEmailTemplate | undefined | null,
) {
	if (!store || template?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(template.id), {
				id: template.id,
				uuid: template.uuid,
				name: template.name,
				subject: template.subject,
				category: template.category,
				body_html: template.body_html,
				body_text: template.body_text,
				created_at: template.created_at ? new Date(template.created_at) : null,
				updated_at: template.updated_at ? new Date(template.updated_at) : null,
			}),
		`email template ${template.id}`,
	);
}

/** Mirrors a sending domain into the local cache. */
export async function cacheSendingDomain(
	store: EntityStore<MailtrapSendingDomainEntity> | undefined,
	domain: MailtrapSendingDomain | undefined | null,
) {
	if (!store || domain?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(domain.id), {
				id: domain.id,
				domain_name: domain.domain_name,
				demo: domain.demo,
				inbound_enabled: domain.inbound_enabled,
				inbound_verified: domain.inbound_verified,
				open_tracking_enabled: domain.open_tracking_enabled,
				click_tracking_enabled: domain.click_tracking_enabled,
			}),
		`sending domain ${domain.id}`,
	);
}

/** Mirrors a project into the local cache. */
export async function cacheProject(
	store: EntityStore<MailtrapProjectEntity> | undefined,
	project: MailtrapProject | undefined | null,
) {
	if (!store || project?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(project.id), {
				id: project.id,
				name: project.name,
			}),
		`project ${project.id}`,
	);
}

/**
 * Mirrors a sandbox inbox into the local cache.
 *
 * Deliberately drops `password`/`username` — see the schema module doc for
 * why the SMTP credentials Mailtrap returns on every inbox read are not
 * worth persisting into a local cache.
 */
export async function cacheInbox(
	store: EntityStore<MailtrapInboxEntity> | undefined,
	inbox: MailtrapInbox | undefined | null,
) {
	if (!store || inbox?.id == null) return;
	await safely(
		() =>
			store.upsertByEntityId(String(inbox.id), {
				id: inbox.id,
				name: inbox.name,
				status: inbox.status,
				email_username: inbox.email_username,
				project_id: inbox.project_id,
				domain: inbox.domain,
				sent_messages_count: inbox.sent_messages_count,
				emails_count: inbox.emails_count,
				emails_unread_count: inbox.emails_unread_count,
			}),
		`inbox ${inbox.id}`,
	);
}

/**
 * Drops a cached record after the provider confirmed the delete.
 *
 * This takes only the delete half of the store: referencing the upsert
 * signature here would make the parameter invariant in the entity type and
 * reject the concrete per-entity clients.
 */
type DeletableStore = {
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/** Drops a cached record once the provider confirmed the delete. */
export async function evictEntity(
	store: DeletableStore | undefined,
	id: string,
	what: string,
) {
	const remove = store?.deleteByEntityId;
	if (!remove || !id) return;
	await safely(() => remove(id), `${what} ${id}`);
}
