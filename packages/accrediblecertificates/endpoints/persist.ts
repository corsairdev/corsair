import type { AccredibleCredentialEntity } from '../schema/database';
import type { Credential } from './types';

/**
 * Minimal structural view of a Corsair entity store. Only the operation this
 * plugin needs is declared, so the helper stays usable whatever else the
 * concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/** Mirrors a credential into the local cache. Failures never fail the call. */
export async function cacheCredential(
	store: EntityStore<AccredibleCredentialEntity> | undefined,
	credential: Credential | undefined | null,
) {
	if (!store || credential?.id === undefined || credential.id === null) return;
	const id = String(credential.id);
	if (!id) return;

	try {
		await store.upsertByEntityId(id, {
			id,
			name: credential.name,
			description: credential.description,
			group_name: credential.group_name,
			group_id: credential.group_id,
			issued_on: credential.issued_on,
			expired_on: credential.expired_on,
			complete: credential.complete,
			approve: credential.approve,
			private: credential.private,
			grade: credential.grade,
			url: credential.url,
			encoded_id: credential.encoded_id,
			course_link: credential.course_link,
			seo_image: credential.seo_image,
			custom_attributes: credential.custom_attributes,
			recipient_id: credential.recipient?.id,
			recipient_name: credential.recipient?.name,
			recipient_email: credential.recipient?.email,
			issuer_id: credential.issuer?.id,
			issuer_name: credential.issuer?.name,
		});
	} catch (error) {
		console.warn(`[ACCREDIBLE] failed to cache credential ${id}:`, error);
	}
}
