import type { OmnisendEndpoints } from '..';
import { call } from './call';
import {
	cursorPageQuery,
	offsetPageQuery,
	segment,
	withCursor,
	withNextOffset,
} from './call';
import {
	OmnisendEndpointInputSchemas as Inputs,
	OmnisendEndpointOutputSchemas as Outputs,
} from './types';

// Groups cut from the 108-operation spec, per the plugin scope: analytics,
// automations, brands, contentTranslations, images, layouts, segments and the
// forms family. `POST /forms/{id}/enable`, `/disable` and `/render` are
// documented but the live gateway answers 404 "Endpoint not found" for all
// three, so the whole forms group was left out rather than ship routes that
// cannot run.
//
// Omnisend sends no inbound webhooks, so there is nothing to receive.

/**
 * The contact body keys, dropped when unset.
 *
 * Tags REPLACE on every contact write: any tag not sent is removed. The
 * per-tag routes are `contacts.addTags` and `contacts.removeTags`.
 */
// unknown: assembled request body; each key was validated by the input schema.
function contactBody(
	fields: Record<string, unknown>, // unknown: one helper serves every contact write.
): Record<string, unknown> {
	const keys = [
		'firstName',
		'lastName',
		'gender',
		'birthdate',
		'address',
		'city',
		'state',
		'country',
		'countryCode',
		'postalCode',
		'createdAt',
		'identifiers',
		'tags',
		'customProperties',
		'trackingConsents',
	];
	const body: Record<string, unknown> = {};
	for (const key of keys) {
		if (fields[key] !== undefined) body[key] = fields[key];
	}
	return body;
}

// ── contacts ────────────────────────────────────────────────────────────────

export const contactsList: OmnisendEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/contacts',
			query: {
				...cursorPageQuery(parsed),
				sort: parsed.sort,
				direction: parsed.direction,
				email: parsed.email,
				phone: parsed.phone,
				status: parsed.status,
				segmentID: parsed.segmentID,
				tag: parsed.tag,
				updatedAtFrom: parsed.updatedAtFrom,
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({
				count: result.contacts.length,
				nextCursor: result.nextCursor ?? undefined,
			}),
		},
	);

export const contactsGet: OmnisendEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/contacts/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ contactId: result.id }) },
	);

// POST /contacts is a natural upsert on the identifiers: 201 created, 200
// updated. Tags REPLACE, so a partial `tags` array deletes the rest.
export const contactsUpsert: OmnisendEndpoints['contactsUpsert'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.upsert',
			input: Inputs.contactsUpsert,
			output: Outputs.contactsUpsert,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/contacts',
			body: contactBody(parsed),
		}),
		{ log: (_, result) => ({ contactId: result.id }) },
	);

export const contactsUpdate: OmnisendEndpoints['contactsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/contacts/${segment(parsed.id)}`,
			// Tags REPLACE on this route too.
			body: contactBody(parsed),
		}),
		{ log: (parsed) => ({ contactId: parsed.id }) },
	);

export const contactsUpdateByEmail: OmnisendEndpoints['contactsUpdateByEmail'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'contacts.updateByEmail',
				input: Inputs.contactsUpdateByEmail,
				output: Outputs.contactsUpdateByEmail,
			},
			input,
			(parsed) => ({
				method: 'PATCH',
				path: '/api/contacts',
				query: { email: parsed.email },
				// Tags REPLACE on this route too.
				body: contactBody(parsed),
			}),
			{ log: (parsed) => ({ email: parsed.email }) },
		);

/**
 * Both tag routes answer 202 with no body: the tagging is queued, so the tags
 * on a contact read back unchanged for a while.
 */
export const contactsAddTags: OmnisendEndpoints['contactsAddTags'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.addTags',
			input: Inputs.contactsAddTags,
			output: Outputs.contactsAddTags,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/contacts/tags',
			body: {
				contactIDs: parsed.contactIDs,
				emails: parsed.emails,
				phones: parsed.phones,
				segmentID: parsed.segmentID,
				tags: parsed.tags,
			},
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ tags: parsed.tags.length }) },
	);

export const contactsRemoveTags: OmnisendEndpoints['contactsRemoveTags'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.removeTags',
			input: Inputs.contactsRemoveTags,
			output: Outputs.contactsRemoveTags,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: '/api/contacts/tags',
			body: {
				contactIDs: parsed.contactIDs,
				emails: parsed.emails,
				phones: parsed.phones,
				segmentID: parsed.segmentID,
				tags: parsed.tags,
			},
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ tags: parsed.tags.length }) },
	);

// ── campaigns ───────────────────────────────────────────────────────────────

export const campaignsList: OmnisendEndpoints['campaignsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/campaigns',
			query: {
				...cursorPageQuery(parsed),
				sort: parsed.sort,
				direction: parsed.direction,
				status: parsed.status,
				nameContains: parsed.nameContains,
				channel: parsed.channel,
				type: parsed.type,
				parentCampaignID: parsed.parentCampaignID,
				createdAtFrom: parsed.createdAtFrom,
				createdAtTo: parsed.createdAtTo,
				updatedAtFrom: parsed.updatedAtFrom,
				updatedAtTo: parsed.updatedAtTo,
				view: parsed.view,
				include: parsed.include,
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({
				count: result.campaigns.length,
				nextCursor: result.nextCursor ?? undefined,
			}),
		},
	);

export const campaignsGet: OmnisendEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/campaigns/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ campaignId: result.id }) },
	);

export const campaignsCreate: OmnisendEndpoints['campaignsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/campaigns',
			body: parsed,
		}),
		{ log: (_, result) => ({ campaignId: result.id }) },
	);

export const campaignsUpdate: OmnisendEndpoints['campaignsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.update',
			input: Inputs.campaignsUpdate,
			output: Outputs.campaignsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/campaigns/${segment(parsed.id)}`,
			// Only drafts accept updates; started campaigns answer 409.
			body: {
				name: parsed.name,
				language: parsed.language,
				content: parsed.content,
				audience: parsed.audience,
				sendingSettings: parsed.sendingSettings,
			},
		}),
		{ log: (parsed) => ({ campaignId: parsed.id }) },
	);

export const campaignsRemove: OmnisendEndpoints['campaignsRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.delete',
			input: Inputs.campaignsRemove,
			output: Outputs.campaignsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/campaigns/${segment(parsed.id)}`,
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ campaignId: parsed.id }) },
	);

// A send cannot be undone and answers 402 when the audience exceeds the
// brand's billing tier, which no retry can fix.
export const campaignsSend: OmnisendEndpoints['campaignsSend'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.send',
			input: Inputs.campaignsSend,
			output: Outputs.campaignsSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/api/campaigns/${segment(parsed.id)}/send`,
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ campaignId: parsed.id }) },
	);

export const campaignsCancel: OmnisendEndpoints['campaignsCancel'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.cancel',
			input: Inputs.campaignsCancel,
			output: Outputs.campaignsCancel,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/api/campaigns/${segment(parsed.id)}/cancel`,
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ campaignId: parsed.id }) },
	);

export const campaignsCopy: OmnisendEndpoints['campaignsCopy'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.copy',
			input: Inputs.campaignsCopy,
			output: Outputs.campaignsCopy,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/api/campaigns/${segment(parsed.id)}/copy`,
		}),
		{ log: (_, result) => ({ campaignId: result.id }) },
	);

export const campaignsRestoreToDraft: OmnisendEndpoints['campaignsRestoreToDraft'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'campaigns.restoreToDraft',
				input: Inputs.campaignsRestoreToDraft,
				output: Outputs.campaignsRestoreToDraft,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `/api/campaigns/${segment(parsed.id)}/restoreToDraft`,
			}),
			{ shape: () => ({ accepted: true }), log: (parsed) => ({ campaignId: parsed.id }) },
		);

export const campaignsSendTestEmail: OmnisendEndpoints['campaignsSendTestEmail'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'campaigns.sendTestEmail',
				input: Inputs.campaignsSendTestEmail,
				output: Outputs.campaignsSendTestEmail,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `/api/campaigns/${segment(parsed.id)}/test-email`,
				body: { recipients: parsed.recipients },
			}),
			{ shape: () => ({ accepted: true }), log: (parsed) => ({ campaignId: parsed.id }) },
		);

export const campaignsGetUtm: OmnisendEndpoints['campaignsGetUtm'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.getUtm',
			input: Inputs.campaignsGetUtm,
			output: Outputs.campaignsGetUtm,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/campaigns/${segment(parsed.id)}/utm`,
		}),
		{ log: (parsed) => ({ campaignId: parsed.id }) },
	);

export const campaignsSetUtm: OmnisendEndpoints['campaignsSetUtm'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.setUtm',
			input: Inputs.campaignsSetUtm,
			output: Outputs.campaignsSetUtm,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/api/campaigns/${segment(parsed.id)}/utm`,
			body: { tags: parsed.tags, variants: parsed.variants },
		}),
		{ log: (parsed) => ({ campaignId: parsed.id }) },
	);

// ── events ──────────────────────────────────────────────────────────────────

// The route answers 202 and queues the event; there is no read-back. Events
// are append-only: nothing can delete or cancel one, and automations email
// real customers.
export const eventsSend: OmnisendEndpoints['eventsSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.send',
			input: Inputs.eventsSend,
			output: Outputs.eventsSend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/events',
			body: {
				eventName: parsed.eventName,
				eventVersion: parsed.eventVersion,
				eventTime: parsed.eventTime,
				eventID: parsed.eventID,
				origin: parsed.origin,
				contact: parsed.contact,
				properties: parsed.properties,
			},
		}),
		{
			shape: () => ({ accepted: true }),
			log: (parsed) => ({ event: parsed.eventName }),
		},
	);

export const eventsQueryMetadata: OmnisendEndpoints['eventsQueryMetadata'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.queryMetadata',
			input: Inputs.eventsQueryMetadata,
			output: Outputs.eventsQueryMetadata,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/event-metadata/query',
			body: {
				category: parsed.category,
				events: parsed.events,
				origins: parsed.origins,
				includeProperties: parsed.includeProperties,
				excludeCustomEvents: parsed.excludeCustomEvents,
			},
		}),
		{
			log: (_, result) => ({ count: result.events.length }),
		},
	);

export const eventsDefineSchema: OmnisendEndpoints['eventsDefineSchema'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.defineSchema',
			input: Inputs.eventsDefineSchema,
			output: Outputs.eventsDefineSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/event-metadata',
			body: {
				name: parsed.name,
				origin: parsed.origin,
				displayName: parsed.displayName,
				properties: parsed.properties,
			},
		}),
		{ log: (parsed) => ({ event: parsed.name }) },
	);

// PUT merges: only the property keys present change, and none are deleted.
export const eventsUpdateSchema: OmnisendEndpoints['eventsUpdateSchema'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.updateSchema',
			input: Inputs.eventsUpdateSchema,
			output: Outputs.eventsUpdateSchema,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: '/api/event-metadata',
			body: {
				name: parsed.name,
				origin: parsed.origin,
				displayName: parsed.displayName,
				properties: parsed.properties,
			},
		}),
		{ log: (parsed) => ({ event: parsed.name }) },
	);

// ── products ────────────────────────────────────────────────────────────────

export const productsList: OmnisendEndpoints['productsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/products',
			query: {
				...offsetPageQuery(parsed),
				sort: parsed.sort,
				titleContains: parsed.titleContains,
			},
		}),
		{
			shape: (raw) => withNextOffset(raw),
			log: (_, result) => ({
				count: result.products.length,
				nextOffset: result.nextOffset ?? undefined,
			}),
		},
	);

export const productsGet: OmnisendEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/products/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ productId: result.id }) },
	);

export const productsCreate: OmnisendEndpoints['productsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.create',
			input: Inputs.productsCreate,
			output: Outputs.productsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/products',
			body: parsed,
		}),
		{ log: (_, result) => ({ productId: result.id }) },
	);

export const productsReplace: OmnisendEndpoints['productsReplace'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.replace',
			input: Inputs.productsReplace,
			output: Outputs.productsReplace,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/api/products/${segment(parsed.id)}`,
			// The body's id is the same field as the path id, so the two can
			// never disagree.
			body: parsed,
		}),
		{ log: (parsed) => ({ productId: parsed.id }) },
	);

export const productsRemove: OmnisendEndpoints['productsRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.delete',
			input: Inputs.productsRemove,
			output: Outputs.productsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/products/${segment(parsed.id)}`,
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ productId: parsed.id }) },
	);

// ── categories ──────────────────────────────────────────────────────────────

export const categoriesList: OmnisendEndpoints['categoriesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: Inputs.categoriesList,
			output: Outputs.categoriesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/product-categories',
			query: { ...offsetPageQuery(parsed), sort: parsed.sort },
		}),
		{
			shape: (raw) => withNextOffset(raw),
			log: (_, result) => ({ count: result.categories.length }),
		},
	);

export const categoriesGet: OmnisendEndpoints['categoriesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.get',
			input: Inputs.categoriesGet,
			output: Outputs.categoriesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/product-categories/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ categoryId: result.categoryID ?? undefined }) },
	);

export const categoriesCreate: OmnisendEndpoints['categoriesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.create',
			input: Inputs.categoriesCreate,
			output: Outputs.categoriesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/product-categories',
			body: { categoryID: parsed.categoryID, title: parsed.title },
		}),
		{ log: (parsed) => ({ categoryId: parsed.categoryID }) },
	);

export const categoriesUpdate: OmnisendEndpoints['categoriesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.update',
			input: Inputs.categoriesUpdate,
			output: Outputs.categoriesUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/product-categories/${segment(parsed.id)}`,
			body: { title: parsed.title },
		}),
		{ log: (parsed) => ({ categoryId: parsed.id }) },
	);

export const categoriesRemove: OmnisendEndpoints['categoriesRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'categories.delete',
			input: Inputs.categoriesRemove,
			output: Outputs.categoriesRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/product-categories/${segment(parsed.id)}`,
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ categoryId: parsed.id }) },
	);

// ── templates ───────────────────────────────────────────────────────────────

export const templatesList: OmnisendEndpoints['templatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: Inputs.templatesList,
			output: Outputs.templatesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/email-templates',
			query: {
				...cursorPageQuery(parsed),
				sort: parsed.sort,
				direction: parsed.direction,
				nameContains: parsed.nameContains,
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({
				count: result.templates.length,
				nextCursor: result.nextCursor ?? undefined,
			}),
		},
	);

export const templatesGet: OmnisendEndpoints['templatesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: Inputs.templatesGet,
			output: Outputs.templatesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/email-templates/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ templateId: result.id }) },
	);

export const templatesCreate: OmnisendEndpoints['templatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.create',
			input: Inputs.templatesCreate,
			output: Outputs.templatesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/email-templates',
			body: {
				name: parsed.name,
				sections: parsed.sections,
				generalSettings: parsed.generalSettings,
			},
		}),
		{ log: (_, result) => ({ templateId: result.id }) },
	);

export const templatesReplace: OmnisendEndpoints['templatesReplace'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.replace',
			input: Inputs.templatesReplace,
			output: Outputs.templatesReplace,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/api/email-templates/${segment(parsed.id)}`,
			// A full replace: fields omitted drop to their defaults.
			body: {
				name: parsed.name,
				sections: parsed.sections,
				generalSettings: parsed.generalSettings,
			},
		}),
		{ log: (parsed) => ({ templateId: parsed.id }) },
	);

export const templatesRemove: OmnisendEndpoints['templatesRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.delete',
			input: Inputs.templatesRemove,
			output: Outputs.templatesRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/email-templates/${segment(parsed.id)}`,
		}),
		{ shape: () => ({ accepted: true }), log: (parsed) => ({ templateId: parsed.id }) },
	);

export const templatesImportFromHtml: OmnisendEndpoints['templatesImportFromHtml'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'templates.importFromHtml',
				input: Inputs.templatesImportFromHtml,
				output: Outputs.templatesImportFromHtml,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/api/email-templates/import',
				body: { name: parsed.name, html: parsed.html },
			}),
			{ log: (_, result) => ({ templateId: result.id }) },
		);

// Renders preview HTML only; no provider state changes.
export const templatesRender: OmnisendEndpoints['templatesRender'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.render',
			input: Inputs.templatesRender,
			output: Outputs.templatesRender,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/api/email-templates/${segment(parsed.id)}/render`,
		}),
		{ log: (parsed) => ({ templateId: parsed.id }) },
	);

// ── emailContent ────────────────────────────────────────────────────────────

export const emailContentGet: OmnisendEndpoints['emailContentGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emailContent.get',
			input: Inputs.emailContentGet,
			output: Outputs.emailContentGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/email-content/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ contentId: result.id }) },
	);

export const emailContentReplace: OmnisendEndpoints['emailContentReplace'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emailContent.replace',
			input: Inputs.emailContentReplace,
			output: Outputs.emailContentReplace,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/api/email-content/${segment(parsed.id)}`,
			// A full replace: fields omitted drop to their defaults.
			body: {
				sections: parsed.sections,
				generalSettings: parsed.generalSettings,
			},
		}),
		{ log: (parsed) => ({ contentId: parsed.id }) },
	);

export const emailContentRender: OmnisendEndpoints['emailContentRender'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'emailContent.render',
			input: Inputs.emailContentRender,
			output: Outputs.emailContentRender,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/api/email-content/${segment(parsed.id)}/render`,
		}),
		{ log: (parsed) => ({ contentId: parsed.id }) },
	);

// ── batches ─────────────────────────────────────────────────────────────────

// The batch runs asynchronously; poll batches.get until status is finished or
// stopped. There is no cancel.
export const batchesCreate: OmnisendEndpoints['batchesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'batches.create',
			input: Inputs.batchesCreate,
			output: Outputs.batchesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/batches',
			body: {
				endpoint: parsed.endpoint,
				method: parsed.method,
				items: parsed.items,
				origin: parsed.origin,
			},
		}),
		{ log: (_, result) => ({ batchId: result.batchID, items: result.totalCount ?? undefined }) },
	);

export const batchesList: OmnisendEndpoints['batchesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'batches.list',
			input: Inputs.batchesList,
			output: Outputs.batchesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/batches',
			query: {
				endpoint: parsed.endpoint,
				...offsetPageQuery(parsed),
				status: parsed.status,
				dateFrom: parsed.dateFrom,
				dateTo: parsed.dateTo,
			},
		}),
		{
			shape: (raw) => withNextOffset(raw),
			log: (_, result) => ({ count: result.batches.length }),
		},
	);

export const batchesGet: OmnisendEndpoints['batchesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'batches.get',
			input: Inputs.batchesGet,
			output: Outputs.batchesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/batches/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ batchId: result.batchID ?? undefined }) },
	);

export const batchesListItems: OmnisendEndpoints['batchesListItems'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'batches.listItems',
			input: Inputs.batchesListItems,
			output: Outputs.batchesListItems,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/batches/${segment(parsed.id)}/items`,
		}),
		{ log: (_, result) => ({ batchId: result.batchID ?? undefined }) },
	);
