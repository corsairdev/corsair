import type { AccountSelectionError } from '../core/account-lookup';
import type { WithTenantOptions } from '../core/client';

export type NoteRow = {
	id: string;
	data: { title: string };
	account?: string;
};

type NotesClient = {
	upsertByEntityId(id: string, data: { title: string }): Promise<unknown>;
	list(page?: { limit?: number; offset?: number }): Promise<NoteRow[]>;
	count(): Promise<number>;
	search(query: Record<string, unknown>): Promise<NoteRow[]>;
	findByEntityId(id: string): Promise<NoteRow | null>;
	findIdByEntityId(id: string): Promise<string | null>;
	findManyByEntityIds(ids: string[]): Promise<NoteRow[]>;
	existsByEntityId(id: string): Promise<boolean>;
};

type DynamicPlugin = {
	api: {
		token(): Promise<string>;
		note(input?: { id: string }): Promise<unknown>;
	};
	db: { notes: NotesClient };
	accounts: {
		list(): Promise<{ id: string; ref?: string; label?: string }[]>;
	};
};

export type DynamicTenant<Id extends string> = { [K in Id]: DynamicPlugin };

export type DynamicCorsair<Id extends string> = {
	withTenant(tenantId: string, options?: WithTenantOptions): DynamicTenant<Id>;
};

export type EndpointCtx = {
	keys: { get_access_token(): Promise<string> };
	db: {
		notes: {
			upsertByEntityId(id: string, data: { title: string }): Promise<unknown>;
		};
	};
};

export const neverResolves = () => {
	throw new Error('expected a rejection');
};
export const asSelectionError = (e: unknown) => e as AccountSelectionError;

export const dynamic = <Id extends string>(corsair: unknown) =>
	corsair as DynamicCorsair<Id>;
