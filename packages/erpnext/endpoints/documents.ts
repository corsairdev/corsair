import type {
	ErpnextDbDocumentsClient,
	ErpnextEndpointHandler,
	ErpnextHandlerContext,
} from './factory';
import { defineEndpoint } from './factory';

// The `documents` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `documents` prefix
// plus these object keys, so renaming a key changes the public operation id.

// Document-returning responses mirror into the stored `documents` entity so
// local searches see fetched rows. Frappe's envelopes vary per route: the
// resource API answers {data: <doc>|[...]}, the frappe.client RPC answers
// {message: <doc>|[...]|names}, and the desk load answers {docs: [...]}.
// Unknown: Frappe document payloads are provider-defined open records; only
// the identity pair (doctype, name) is required for persistence.
type ErpnextAnyDoc = Record<string, unknown>;

function docsFromEnvelope(result: unknown): ErpnextAnyDoc[] {
	// unknown: the envelope shape is provider-defined per route; the helper
	// walks the documented variants and returns the document records found.
	const docs: ErpnextAnyDoc[] = [];
	if (!result || typeof result !== 'object') return docs;
	const envelope = result as Record<string, unknown>;
	const push = (value: unknown) => {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			docs.push(value as ErpnextAnyDoc);
		}
	};
	if (envelope.data !== undefined) {
		Array.isArray(envelope.data)
			? envelope.data.forEach(push)
			: push(envelope.data);
	}
	if (envelope.message !== undefined) {
		Array.isArray(envelope.message)
			? envelope.message.forEach(push)
			: push(envelope.message);
	}
	if (envelope.docs !== undefined && Array.isArray(envelope.docs)) {
		envelope.docs.forEach(push);
	}
	return docs;
}

async function syncDocuments(
	ctx: ErpnextHandlerContext,
	result: unknown,
	doctype: unknown,
): Promise<void> {
	const db: ErpnextDbDocumentsClient | undefined = ctx.db?.documents;
	if (!db) return;
	if (typeof doctype !== 'string' || doctype.length === 0) return;
	try {
		for (const doc of docsFromEnvelope(result)) {
			const name = doc.name;
			if (typeof name === 'string' && name.length > 0) {
				// Upsert replaces the stored row, and list results carry only the
				// fields the caller selected: merge with the document a previous
				// fetch stored so a name-only list page never wipes saved fields.
				// The core ORM returns the entity row, so the document fields
				// live under `data` beside the row metadata.
				const existing = await db.findByEntityId(`${doctype}:${name}`);
				const prior =
					existing?.data && typeof existing.data === 'object'
						? (existing.data as ErpnextAnyDoc)
						: {};
				await db.upsertByEntityId(`${doctype}:${name}`, {
					doctype,
					...prior,
					...doc,
				});
			}
		}
	} catch (error) {
		console.warn('Failed to save documents to the local database:', error);
	}
}

async function removeDocument(
	ctx: ErpnextHandlerContext,
	doctype: string,
	name: string,
): Promise<void> {
	const db: ErpnextDbDocumentsClient | undefined = ctx.db?.documents;
	if (!db) return;
	try {
		await db.deleteByEntityId(`${doctype}:${name}`);
	} catch (error) {
		console.warn(
			'Failed to remove the document from the local database:',
			error,
		);
	}
}

// The base transport call for each wrapped operation.
const baseCreate = defineEndpoint('documents.create');
const baseInsert = defineEndpoint('documents.insert');
const baseSaveDocument = defineEndpoint('documents.saveDocument');
const baseSaveDocs = defineEndpoint('documents.saveDocs');
const baseInsertMany = defineEndpoint('documents.insertMany');
const baseGet = defineEndpoint('documents.get');
const baseGetClient = defineEndpoint('documents.getClient');
const baseGetWithMeta = defineEndpoint('documents.getWithMeta');
const baseList = defineEndpoint('documents.list');
const baseGetList = defineEndpoint('documents.getList');
const baseUpdate = defineEndpoint('documents.update');
const baseDelete = defineEndpoint('documents.delete');
const baseSetValue = defineEndpoint('documents.setValue');
const baseGetValue = defineEndpoint('documents.getValue');
const baseGetCount = defineEndpoint('documents.getCount');
const baseRenameDoc = defineEndpoint('documents.renameDoc');
const baseSearchLink = defineEndpoint('documents.searchLink');
const baseSubmit = defineEndpoint('documents.submit');
const baseCancel = defineEndpoint('documents.cancel');

export const create: ErpnextEndpointHandler<'documents.create'> = async (
	ctx,
	input,
) => {
	const result = await baseCreate(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

export const insert: ErpnextEndpointHandler<'documents.insert'> = async (
	ctx,
	input,
) => {
	const result = await baseInsert(ctx, input);
	await syncDocuments(ctx, result, input.body.doc.doctype);
	return result;
};

export const saveDocument: ErpnextEndpointHandler<
	'documents.saveDocument'
> = async (ctx, input) => {
	const result = await baseSaveDocument(ctx, input);
	await syncDocuments(ctx, result, input.body.doc.doctype);
	return result;
};

export const saveDocs: ErpnextEndpointHandler<'documents.saveDocs'> = async (
	ctx,
	input,
) => {
	const result = await baseSaveDocs(ctx, input);
	await syncDocuments(ctx, result, input.body.doc.doctype);
	return result;
};

export const insertMany: ErpnextEndpointHandler<
	'documents.insertMany'
> = async (ctx, input) => {
	const result = await baseInsertMany(ctx, input);
	// The RPC answers the created document names in order; pair each name
	// with the submitted document so every row persists under its identity.
	const db = ctx.db?.documents;
	const message = (result as { message?: unknown }).message;
	if (db && Array.isArray(message)) {
		try {
			for (let i = 0; i < message.length; i++) {
				const doc = input.body.docs[i];
				const name = message[i];
				if (doc && typeof name === 'string' && name.length > 0) {
					await db.upsertByEntityId(`${doc.doctype}:${name}`, {
						...doc,
						name,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save documents to the local database:', error);
		}
	}
	return result;
};

export const get: ErpnextEndpointHandler<'documents.get'> = async (
	ctx,
	input,
) => {
	const result = await baseGet(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

export const getClient: ErpnextEndpointHandler<'documents.getClient'> = async (
	ctx,
	input,
) => {
	const result = await baseGetClient(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

export const getWithMeta: ErpnextEndpointHandler<
	'documents.getWithMeta'
> = async (ctx, input) => {
	const result = await baseGetWithMeta(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

export const list: ErpnextEndpointHandler<'documents.list'> = async (
	ctx,
	input,
) => {
	const result = await baseList(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

export const getList: ErpnextEndpointHandler<'documents.getList'> = async (
	ctx,
	input,
) => {
	const result = await baseGetList(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

export const update: ErpnextEndpointHandler<'documents.update'> = async (
	ctx,
	input,
) => {
	const result = await baseUpdate(ctx, input);
	await syncDocuments(ctx, result, input.doctype);
	return result;
};

// `delete` is a reserved word and cannot name a const, so the handler binding
// carries the action meaning while the tree key below stays the provider's
// `delete` operation id. A successful delete removes the stored row so local
// search stops returning deleted documents.
export const deleteDocument: ErpnextEndpointHandler<
	'documents.delete'
> = async (ctx, input) => {
	const result = await baseDelete(ctx, input);
	await removeDocument(ctx, input.doctype, input.name);
	return result;
};

export const setValue: ErpnextEndpointHandler<'documents.setValue'> = async (
	ctx,
	input,
) => {
	const result = await baseSetValue(ctx, input);
	await syncDocuments(ctx, result, input.body.doctype);
	return result;
};

export const getValue: ErpnextEndpointHandler<'documents.getValue'> = async (
	ctx,
	input,
) => baseGetValue(ctx, input);

export const getCount: ErpnextEndpointHandler<'documents.getCount'> = async (
	ctx,
	input,
) => baseGetCount(ctx, input);

export const renameDoc: ErpnextEndpointHandler<'documents.renameDoc'> = async (
	ctx,
	input,
) => {
	const result = await baseRenameDoc(ctx, input);
	// The rename moves the primary identifier: drop the stored row under the
	// old name; the next fetch persists the document under the new one.
	await removeDocument(ctx, input.body.doctype, input.body.old_name);
	return result;
};

export const searchLink: ErpnextEndpointHandler<
	'documents.searchLink'
> = async (ctx, input) => baseSearchLink(ctx, input);

export const submit: ErpnextEndpointHandler<'documents.submit'> = async (
	ctx,
	input,
) => {
	const result = await baseSubmit(ctx, input);
	await syncDocuments(ctx, result, input.body.doc.doctype);
	return result;
};

export const cancel: ErpnextEndpointHandler<'documents.cancel'> = async (
	ctx,
	input,
) => {
	const result = await baseCancel(ctx, input);
	await syncDocuments(ctx, result, input.body.doctype);
	return result;
};

export const endpoints = {
	create,
	insert,
	saveDocument,
	saveDocs,
	insertMany,
	get,
	getClient,
	getWithMeta,
	list,
	getList,
	update,
	delete: deleteDocument,
	setValue,
	getValue,
	getCount,
	renameDoc,
	searchLink,
	submit,
	cancel,
} as const;
