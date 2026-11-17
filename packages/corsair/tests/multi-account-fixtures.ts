import type { AccountSelectionError } from '../core/account-lookup';
import type { WithTenantOptions } from '../core/client';

export type NoteRow = {
	id: string;
	data: { title: string };
	account?: string;
};

type NotesClient = {
	upsertByEntityId(id: string, data: { title: string }): Promise<unknown>; // tests ignore the stored row
	list(page?: { limit?: number; offset?: number }): Promise<NoteRow[]>;
	count(): Promise<number>;
	search(query: Record<string, unknown>): Promise<NoteRow[]>; // any filter the entity store takes
	findByEntityId(id: string): Promise<NoteRow | null>;
	findIdByEntityId(id: string): Promise<string | null>;
	findManyByEntityIds(ids: string[]): Promise<NoteRow[]>;
	existsByEntityId(id: string): Promise<boolean>;
};

type DynamicPlugin = {
	api: {
		token(): Promise<string>;
		note(input?: { id: string }): Promise<unknown>; // tests ignore the result
	};
	db: { notes: NotesClient };
	accounts: {
		list(): Promise<{ id: string; ref?: string; label?: string }[]>;
	};
};

/** Plugin trees are built from runtime plugin ids, so tests view them through this shape. */
export type DynamicTenant<Id extends string> = { [K in Id]: DynamicPlugin };

export type DynamicCorsair<Id extends string> = {
	withTenant(tenantId: string, options?: WithTenantOptions): DynamicTenant<Id>;
};

/** Handler context for the test plugins' endpoints. */
export type EndpointCtx = {
	keys: { get_access_token(): Promise<string> };
	db: {
		notes: {
			upsertByEntityId(id: string, data: { title: string }): Promise<unknown>; // tests ignore the stored row
		};
	};
};

export const neverResolves = () => {
	throw new Error('expected a rejection');
};
export const asSelectionError = (e: unknown) => e as AccountSelectionError; // a caught error is unknown until narrowed

/** The plugin tree is keyed by runtime plugin ids, so it is viewed through DynamicCorsair. */
export const dynamic = <Id extends string>(corsair: unknown) =>
	corsair as DynamicCorsair<Id>;
