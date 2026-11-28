// Generated with endpoints/operation-types.ts from Omnisend's OpenAPI spec:
// one entry per operation in omnisend-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { omnisendSchemaEntry } from './openapi-schema';
import { createOmnisendOperation as op } from './operations';

export const omnisendEndpointsNested = {
	analytics: {
		generateReport: op('analytics.generateReport'),
		generateStatistics: op('analytics.generateStatistics'),
	},
	automations: {
		copy: op('automations.copy'),
		create: op('automations.create'),
		delete: op('automations.delete'),
		deleteSchedule: op('automations.deleteSchedule'),
		disable: op('automations.disable'),
		enable: op('automations.enable'),
		get: op('automations.get'),
		getBlockUtm: op('automations.getBlockUtm'),
		getSchedule: op('automations.getSchedule'),
		getUtm: op('automations.getUtm'),
		list: op('automations.list'),
		replaceBlocks: op('automations.replaceBlocks'),
		sendBlockTestEmail: op('automations.sendBlockTestEmail'),
		setBlockUtm: op('automations.setBlockUtm'),
		setSchedule: op('automations.setSchedule'),
		update: op('automations.update'),
	},
	batches: {
		create: op('batches.create'),
		get: op('batches.get'),
		list: op('batches.list'),
		listItems: op('batches.listItems'),
	},
	brands: {
		connect: op('brands.connect'),
		getCurrent: op('brands.getCurrent'),
	},
	campaigns: {
		cancel: op('campaigns.cancel'),
		copy: op('campaigns.copy'),
		create: op('campaigns.create'),
		delete: op('campaigns.delete'),
		get: op('campaigns.get'),
		getUtm: op('campaigns.getUtm'),
		list: op('campaigns.list'),
		restoreToDraft: op('campaigns.restoreToDraft'),
		resumeAbTest: op('campaigns.resumeAbTest'),
		selectAbTestWinner: op('campaigns.selectAbTestWinner'),
		send: op('campaigns.send'),
		sendTestEmail: op('campaigns.sendTestEmail'),
		setUtm: op('campaigns.setUtm'),
		stopAbTest: op('campaigns.stopAbTest'),
		update: op('campaigns.update'),
	},
	categories: {
		create: op('categories.create'),
		delete: op('categories.delete'),
		get: op('categories.get'),
		list: op('categories.list'),
		update: op('categories.update'),
	},
	contacts: {
		addTags: op('contacts.addTags'),
		get: op('contacts.get'),
		list: op('contacts.list'),
		removeTags: op('contacts.removeTags'),
		update: op('contacts.update'),
		updateByEmail: op('contacts.updateByEmail'),
		upsert: op('contacts.upsert'),
	},
	contentTranslations: {
		listLanguages: op('contentTranslations.listLanguages'),
	},
	emailContent: {
		get: op('emailContent.get'),
		render: op('emailContent.render'),
		replace: op('emailContent.replace'),
	},
	events: {
		defineSchema: op('events.defineSchema'),
		queryMetadata: op('events.queryMetadata'),
		send: op('events.send'),
		updateSchema: op('events.updateSchema'),
	},
	formAbSetups: {
		create: op('formAbSetups.create'),
		delete: op('formAbSetups.delete'),
		get: op('formAbSetups.get'),
		list: op('formAbSetups.list'),
		selectWinner: op('formAbSetups.selectWinner'),
		start: op('formAbSetups.start'),
	},
	formTemplates: {
		get: op('formTemplates.get'),
		list: op('formTemplates.list'),
		render: op('formTemplates.render'),
	},
	forms: {
		create: op('forms.create'),
		delete: op('forms.delete'),
		disable: op('forms.disable'),
		enable: op('forms.enable'),
		get: op('forms.get'),
		getPeriodicReport: op('forms.getPeriodicReport'),
		getReport: op('forms.getReport'),
		list: op('forms.list'),
		listAbSetupReports: op('forms.listAbSetupReports'),
		listContacts: op('forms.listContacts'),
		render: op('forms.render'),
		update: op('forms.update'),
	},
	images: {
		delete: op('images.delete'),
		get: op('images.get'),
		list: op('images.list'),
		upload: op('images.upload'),
		uploadFromUrl: op('images.uploadFromUrl'),
	},
	products: {
		create: op('products.create'),
		delete: op('products.delete'),
		get: op('products.get'),
		list: op('products.list'),
		replace: op('products.replace'),
	},
	segments: {
		create: op('segments.create'),
		delete: op('segments.delete'),
		get: op('segments.get'),
		getStatistics: op('segments.getStatistics'),
		list: op('segments.list'),
		replace: op('segments.replace'),
	},
	templates: {
		create: op('templates.create'),
		delete: op('templates.delete'),
		get: op('templates.get'),
		importFromHtml: op('templates.importFromHtml'),
		list: op('templates.list'),
		render: op('templates.render'),
		replace: op('templates.replace'),
	},
	universalLayouts: {
		create: op('universalLayouts.create'),
		delete: op('universalLayouts.delete'),
		get: op('universalLayouts.get'),
		list: op('universalLayouts.list'),
		replace: op('universalLayouts.replace'),
	},
} as const;

export const omnisendEndpointSchemas = {
	'analytics.generateReport': omnisendSchemaEntry('analytics.generateReport'),
	'analytics.generateStatistics': omnisendSchemaEntry(
		'analytics.generateStatistics',
	),
	'automations.copy': omnisendSchemaEntry('automations.copy'),
	'automations.create': omnisendSchemaEntry('automations.create'),
	'automations.delete': omnisendSchemaEntry('automations.delete'),
	'automations.deleteSchedule': omnisendSchemaEntry(
		'automations.deleteSchedule',
	),
	'automations.disable': omnisendSchemaEntry('automations.disable'),
	'automations.enable': omnisendSchemaEntry('automations.enable'),
	'automations.get': omnisendSchemaEntry('automations.get'),
	'automations.getBlockUtm': omnisendSchemaEntry('automations.getBlockUtm'),
	'automations.getSchedule': omnisendSchemaEntry('automations.getSchedule'),
	'automations.getUtm': omnisendSchemaEntry('automations.getUtm'),
	'automations.list': omnisendSchemaEntry('automations.list'),
	'automations.replaceBlocks': omnisendSchemaEntry('automations.replaceBlocks'),
	'automations.sendBlockTestEmail': omnisendSchemaEntry(
		'automations.sendBlockTestEmail',
	),
	'automations.setBlockUtm': omnisendSchemaEntry('automations.setBlockUtm'),
	'automations.setSchedule': omnisendSchemaEntry('automations.setSchedule'),
	'automations.update': omnisendSchemaEntry('automations.update'),
	'batches.create': omnisendSchemaEntry('batches.create'),
	'batches.get': omnisendSchemaEntry('batches.get'),
	'batches.list': omnisendSchemaEntry('batches.list'),
	'batches.listItems': omnisendSchemaEntry('batches.listItems'),
	'brands.connect': omnisendSchemaEntry('brands.connect'),
	'brands.getCurrent': omnisendSchemaEntry('brands.getCurrent'),
	'campaigns.cancel': omnisendSchemaEntry('campaigns.cancel'),
	'campaigns.copy': omnisendSchemaEntry('campaigns.copy'),
	'campaigns.create': omnisendSchemaEntry('campaigns.create'),
	'campaigns.delete': omnisendSchemaEntry('campaigns.delete'),
	'campaigns.get': omnisendSchemaEntry('campaigns.get'),
	'campaigns.getUtm': omnisendSchemaEntry('campaigns.getUtm'),
	'campaigns.list': omnisendSchemaEntry('campaigns.list'),
	'campaigns.restoreToDraft': omnisendSchemaEntry('campaigns.restoreToDraft'),
	'campaigns.resumeAbTest': omnisendSchemaEntry('campaigns.resumeAbTest'),
	'campaigns.selectAbTestWinner': omnisendSchemaEntry(
		'campaigns.selectAbTestWinner',
	),
	'campaigns.send': omnisendSchemaEntry('campaigns.send'),
	'campaigns.sendTestEmail': omnisendSchemaEntry('campaigns.sendTestEmail'),
	'campaigns.setUtm': omnisendSchemaEntry('campaigns.setUtm'),
	'campaigns.stopAbTest': omnisendSchemaEntry('campaigns.stopAbTest'),
	'campaigns.update': omnisendSchemaEntry('campaigns.update'),
	'categories.create': omnisendSchemaEntry('categories.create'),
	'categories.delete': omnisendSchemaEntry('categories.delete'),
	'categories.get': omnisendSchemaEntry('categories.get'),
	'categories.list': omnisendSchemaEntry('categories.list'),
	'categories.update': omnisendSchemaEntry('categories.update'),
	'contacts.addTags': omnisendSchemaEntry('contacts.addTags'),
	'contacts.get': omnisendSchemaEntry('contacts.get'),
	'contacts.list': omnisendSchemaEntry('contacts.list'),
	'contacts.removeTags': omnisendSchemaEntry('contacts.removeTags'),
	'contacts.update': omnisendSchemaEntry('contacts.update'),
	'contacts.updateByEmail': omnisendSchemaEntry('contacts.updateByEmail'),
	'contacts.upsert': omnisendSchemaEntry('contacts.upsert'),
	'contentTranslations.listLanguages': omnisendSchemaEntry(
		'contentTranslations.listLanguages',
	),
	'emailContent.get': omnisendSchemaEntry('emailContent.get'),
	'emailContent.render': omnisendSchemaEntry('emailContent.render'),
	'emailContent.replace': omnisendSchemaEntry('emailContent.replace'),
	'events.defineSchema': omnisendSchemaEntry('events.defineSchema'),
	'events.queryMetadata': omnisendSchemaEntry('events.queryMetadata'),
	'events.send': omnisendSchemaEntry('events.send'),
	'events.updateSchema': omnisendSchemaEntry('events.updateSchema'),
	'formAbSetups.create': omnisendSchemaEntry('formAbSetups.create'),
	'formAbSetups.delete': omnisendSchemaEntry('formAbSetups.delete'),
	'formAbSetups.get': omnisendSchemaEntry('formAbSetups.get'),
	'formAbSetups.list': omnisendSchemaEntry('formAbSetups.list'),
	'formAbSetups.selectWinner': omnisendSchemaEntry('formAbSetups.selectWinner'),
	'formAbSetups.start': omnisendSchemaEntry('formAbSetups.start'),
	'formTemplates.get': omnisendSchemaEntry('formTemplates.get'),
	'formTemplates.list': omnisendSchemaEntry('formTemplates.list'),
	'formTemplates.render': omnisendSchemaEntry('formTemplates.render'),
	'forms.create': omnisendSchemaEntry('forms.create'),
	'forms.delete': omnisendSchemaEntry('forms.delete'),
	'forms.disable': omnisendSchemaEntry('forms.disable'),
	'forms.enable': omnisendSchemaEntry('forms.enable'),
	'forms.get': omnisendSchemaEntry('forms.get'),
	'forms.getPeriodicReport': omnisendSchemaEntry('forms.getPeriodicReport'),
	'forms.getReport': omnisendSchemaEntry('forms.getReport'),
	'forms.list': omnisendSchemaEntry('forms.list'),
	'forms.listAbSetupReports': omnisendSchemaEntry('forms.listAbSetupReports'),
	'forms.listContacts': omnisendSchemaEntry('forms.listContacts'),
	'forms.render': omnisendSchemaEntry('forms.render'),
	'forms.update': omnisendSchemaEntry('forms.update'),
	'images.delete': omnisendSchemaEntry('images.delete'),
	'images.get': omnisendSchemaEntry('images.get'),
	'images.list': omnisendSchemaEntry('images.list'),
	'images.upload': omnisendSchemaEntry('images.upload'),
	'images.uploadFromUrl': omnisendSchemaEntry('images.uploadFromUrl'),
	'products.create': omnisendSchemaEntry('products.create'),
	'products.delete': omnisendSchemaEntry('products.delete'),
	'products.get': omnisendSchemaEntry('products.get'),
	'products.list': omnisendSchemaEntry('products.list'),
	'products.replace': omnisendSchemaEntry('products.replace'),
	'segments.create': omnisendSchemaEntry('segments.create'),
	'segments.delete': omnisendSchemaEntry('segments.delete'),
	'segments.get': omnisendSchemaEntry('segments.get'),
	'segments.getStatistics': omnisendSchemaEntry('segments.getStatistics'),
	'segments.list': omnisendSchemaEntry('segments.list'),
	'segments.replace': omnisendSchemaEntry('segments.replace'),
	'templates.create': omnisendSchemaEntry('templates.create'),
	'templates.delete': omnisendSchemaEntry('templates.delete'),
	'templates.get': omnisendSchemaEntry('templates.get'),
	'templates.importFromHtml': omnisendSchemaEntry('templates.importFromHtml'),
	'templates.list': omnisendSchemaEntry('templates.list'),
	'templates.render': omnisendSchemaEntry('templates.render'),
	'templates.replace': omnisendSchemaEntry('templates.replace'),
	'universalLayouts.create': omnisendSchemaEntry('universalLayouts.create'),
	'universalLayouts.delete': omnisendSchemaEntry('universalLayouts.delete'),
	'universalLayouts.get': omnisendSchemaEntry('universalLayouts.get'),
	'universalLayouts.list': omnisendSchemaEntry('universalLayouts.list'),
	'universalLayouts.replace': omnisendSchemaEntry('universalLayouts.replace'),
} satisfies RequiredPluginEndpointSchemas<typeof omnisendEndpointsNested>;

export const omnisendEndpointMeta = {
	'analytics.generateReport': {
		riskLevel: 'read',
		description:
			'Generate report. Returns aggregated marketing analytics grouped by message send date. Covers delivery, engagement, and revenue attribution metrics for campaigns and automations. Supports optional dimensions (timestamp, channel, activity), filters, and up to 4 queries per request.',
	},
	'analytics.generateStatistics': {
		riskLevel: 'read',
		description:
			'Generate report. Returns aggregated marketing analytics grouped by event date (when opens, clicks, orders actually occurred). Covers delivery, engagement, revenue attribution, and audience growth metrics. Requires a timestamp dimension.',
	},
	'automations.copy': {
		riskLevel: 'write',
		description:
			"Copy automation workflow. Create a copy of an existing automation workflow. The copy is always created in a disabled state, regardless of the source automation's status. The request body is optional. When provided, you can specify a custom name for the copy.",
	},
	'automations.create': {
		riskLevel: 'write',
		description:
			'Create automation workflow. Create a new automation workflow.',
	},
	'automations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete automation workflow. Delete a single automation workflow by ID. This operation is idempotent — deleting a non-existent automation returns a success response. Cannot be undone.',
	},
	'automations.deleteSchedule': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete automation workflow schedule. Remove the scheduled start and end of an automation workflow. isEnabled is not changed. This operation is idempotent — deleting a schedule that does not exist returns a success response. Cannot be undone.',
	},
	'automations.disable': {
		riskLevel: 'write',
		description:
			'Disable automation workflow. Disable an automation workflow. Once disabled, the workflow stops accepting new trigger events. Use contactsInWorkflow to control what happens to contacts currently progressing through the workflow: - keep: contacts remain and continue through the remaining blocks until completion.',
	},
	'automations.enable': {
		riskLevel: 'destructive',
		description:
			'Enable automation workflow. Enable an automation workflow. Once enabled, the workflow starts processing trigger events in real time. The request body is optional. Use enrollExisting to also enroll contacts who already qualify at the time of enabling. An enabled automation emails or texts contacts on its own whenever its trigger fires.',
	},
	'automations.get': {
		riskLevel: 'read',
		description:
			'Get automation workflow. Get a single automation workflow by ID.',
	},
	'automations.getBlockUtm': {
		riskLevel: 'read',
		description:
			'Get UTM tags for an automation block. Retrieve UTM tracking tags for a specific send-action block. Missing or cleared tags are returned with their default values.',
	},
	'automations.getSchedule': {
		riskLevel: 'read',
		description:
			'Get automation workflow schedule. Get the scheduled start and end of an automation workflow. Returns 204 No Content when the workflow has no schedule.',
	},
	'automations.getUtm': {
		riskLevel: 'read',
		description:
			"Get aggregated UTM tags for all blocks. Retrieve UTM tracking tags for all send-action blocks in an automation. Each block's tags include default-value synthesis for missing fields.",
	},
	'automations.list': {
		riskLevel: 'read',
		description:
			'List automation workflows. List automation workflows with filtering, sorting, and cursor-based pagination.',
	},
	'automations.replaceBlocks': {
		riskLevel: 'write',
		description:
			'Replace automation workflow blocks. Replace the full block tree for an automation workflow. Blocks identified by id are updated in place. Blocks identified by temporaryID are created as new blocks. Existing blocks not included in this array are removed. Enabled automations cannot be restructured.',
	},
	'automations.sendBlockTestEmail': {
		riskLevel: 'destructive',
		description:
			'Send test email. Send the saved email content of a specific email block as a test email to up to 5 recipients. The email is rendered and delivered asynchronously. Sends a real email to the given addresses.',
	},
	'automations.setBlockUtm': {
		riskLevel: 'write',
		description:
			'Update UTM tags for an automation block. Set UTM tracking tags for a specific send-action block. All three tag fields are replaced atomically. Send an empty string to clear a field — the next read will return its default value.',
	},
	'automations.setSchedule': {
		riskLevel: 'write',
		description:
			'Save automation workflow schedule. Schedule when an automation workflow is enabled (startAt), disabled (endAt), or both. The request replaces the whole schedule. Saving a schedule does not change isEnabled. - startAt can be set only for a disabled workflow. At startAt the workflow is enabled the same way as with the enable action.',
	},
	'automations.update': {
		riskLevel: 'write',
		description:
			'Patch automation workflow. Partially update an automation workflow. Only the fields provided in the request body are updated. Enabled automations cannot be patched. Disable the automation via POST /automations/{id}/disable, make changes, then re-enable via POST /automations/{id}/enable when ready.',
	},
	'batches.create': {
		riskLevel: 'destructive',
		job: {
			idPath: 'batchID',
			status: {
				op: 'batches.get',
				idArg: 'batchID',
				statusPath: 'status',
				done: ['finished'],
				failed: ['stopped'],
			},
		},
		description:
			'Queue up to 100 contact, product, category or event writes that Omnisend applies one by one, and read the batch back with batches.get until it is finished or stopped. An events batch can start automations that message customers, like events.send.',
	},
	'batches.get': {
		riskLevel: 'read',
		description:
			'Read a batch status and counts; pending and inProgress mean it still runs, finished and stopped mean it ended.',
	},
	'batches.list': {
		riskLevel: 'read',
		description:
			'Page the batches for one endpoint; categories batches cannot be listed.',
	},
	'batches.listItems': {
		riskLevel: 'read',
		description: 'Read the per-item requests, responses and errors of a batch.',
	},
	'brands.connect': {
		riskLevel: 'write',
		description:
			"Connect brand. With this endpoint you can connect your site to Omnisend. Note it's only possible to connect store with oAuth flow. Links the brand to an ecommerce platform; meant for platform apps.",
	},
	'brands.getCurrent': {
		riskLevel: 'read',
		description:
			"Get information about brand. With this endpoint you can get brand's information.",
	},
	'campaigns.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a scheduled, paused or started-email campaign; sent campaigns cannot be canceled.',
	},
	'campaigns.copy': {
		riskLevel: 'write',
		description: 'Duplicate a campaign as a new draft.',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a campaign; a regular email campaign needs a template id, and creating with no verified sender answers 422.',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a campaign; it cannot be restored.',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			'Read one campaign by id, with its content and sending settings.',
	},
	'campaigns.getUtm': {
		riskLevel: 'read',
		description: 'Read the UTM tags stamped on a campaign links.',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'Page the campaigns, filtered by status, channel, type, name or dates.',
	},
	'campaigns.restoreToDraft': {
		riskLevel: 'write',
		description: 'Move a scheduled campaign back to draft.',
	},
	'campaigns.resumeAbTest': {
		riskLevel: 'destructive',
		description:
			'Resume A/B test. Resume a stopped A/B test. Automatic winner selection becomes eligible to pick this campaign again. Available only while the campaign is in stopped status. Sending to the test audience starts again.',
	},
	'campaigns.selectAbTestWinner': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Select A/B test winner. Manually pick a variant as the winner. The chosen variant is routed into the send pipeline immediately. Sends the chosen variant to the rest of the audience.',
	},
	'campaigns.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send a draft campaign to its audience. This cannot be undone, and it answers 402 when the audience exceeds the billing tier. Sends the campaign to its whole audience; it cannot be undone.',
	},
	'campaigns.sendTestEmail': {
		riskLevel: 'destructive',
		description:
			'Render a campaign and email it to 1-5 addresses. Omnisend sends to exactly the addresses given, so use internal test inboxes, not customers.',
	},
	'campaigns.setUtm': {
		riskLevel: 'write',
		description:
			'Set the UTM tags stamped on a campaign links. Send tags for a regular campaign or variants for an A/B test campaign, not both.',
	},
	'campaigns.stopAbTest': {
		riskLevel: 'write',
		description:
			'Stop A/B test. Halt the A/B test winner-selection phase. While stopped, automatic winner selection no longer considers this campaign until it is resumed. Available only while the campaign is in started status.',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description:
			'Change a draft campaign; started or scheduled campaigns answer 409.',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a product category under your own category ID.',
	},
	'categories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a product category.',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Read one product category by your own category ID.',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'Page the product categories.',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Rename a product category.',
	},
	'contacts.addTags': {
		riskLevel: 'write',
		description:
			'Queue tags onto up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags appear shortly after.',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact by id, with its identifiers and consents.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'Page the brand contacts, filtered by email, phone, status, segment or tag.',
	},
	'contacts.removeTags': {
		riskLevel: 'destructive',
		description:
			'Queue tag removal for up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags disappear shortly after.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Change a contact by id; sent tags replace the existing ones, so removing one tag means sending the rest.',
	},
	'contacts.updateByEmail': {
		riskLevel: 'write',
		description:
			'Change the contact an email address matches; sent tags replace the existing ones.',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description:
			'Create a contact, or update the one an identifier already matches; sent tags replace the existing ones.',
	},
	'contentTranslations.listLanguages': {
		riskLevel: 'read',
		description:
			"Get store languages. Returns the languages available for the store's content together with the store's default language.",
	},
	'emailContent.get': {
		riskLevel: 'read',
		description: 'Read the content of a campaign email by id.',
	},
	'emailContent.render': {
		riskLevel: 'read',
		description:
			'Render a campaign email to its HTML for preview; nothing is sent and no state changes.',
	},
	'emailContent.replace': {
		riskLevel: 'write',
		description:
			'Replace a campaign email content in full; omitted fields drop to their defaults.',
	},
	'events.defineSchema': {
		riskLevel: 'write',
		description:
			'Declare a custom event schema and its property types; a type, once declared, cannot change.',
	},
	'events.queryMetadata': {
		riskLevel: 'read',
		description:
			'List the event schemas the brand knows, per category, with their declared property types.',
	},
	'events.send': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Record an event for a contact, which creates or updates that contact and can trigger automations that email real customers. The event is queued (202) and append-only: it cannot be edited, read back or deleted. Omnisend\'s events guide asks for an origin on every event: use "api" unless your integration has its own origin.',
	},
	'events.updateSchema': {
		riskLevel: 'write',
		description:
			'Merge changes into an event schema; the properties present change and none are deleted, and a declared type cannot change.',
	},
	'formAbSetups.create': {
		riskLevel: 'write',
		description:
			"Create a form A/B setup. Create a draft form A/B setup from an existing popup, flyout or fullscreen form. Only those display types are eligible; the source form becomes the setup's main form and its two variants start as identical copies that can be edited independently afterward.",
	},
	'formAbSetups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a form A/B setup. Delete a single form A/B setup by ID. Only draft form A/B setups can be deleted; enabled or completed setups cannot. Deleting a non-existent form A/B setup succeeds (idempotent).',
	},
	'formAbSetups.get': {
		riskLevel: 'read',
		description:
			'Get a form A/B setup. Get a single form A/B setup by ID, including its main form, variant forms with their weights, status, lifecycle timestamps, and the auto-close policy configured when the test was started (if any).',
	},
	'formAbSetups.list': {
		riskLevel: 'read',
		description:
			'List form A/B setups. List form A/B setups with sorting and cursor-based pagination support. Each setup includes the auto-close policy configured when the test was started (if any).',
	},
	'formAbSetups.selectWinner': {
		riskLevel: 'write',
		description:
			'Select a form A/B setup winner. Select a winning variant for a form A/B setup by its version form ID. A winner can only be selected for an enabled (started) setup; selecting one concludes the test in favor of the chosen variant.',
	},
	'formAbSetups.start': {
		riskLevel: 'write',
		description:
			'Start a form A/B setup. Start a form A/B test by ID. Launches the A/B setup so its variants begin serving to visitors according to their weights, moving the setup to enabled status. Starting a form A/B setup that has already been started returns a conflict.',
	},
	'formTemplates.get': {
		riskLevel: 'read',
		description: 'Get template. Get a single form template by ID.',
	},
	'formTemplates.list': {
		riskLevel: 'read',
		description:
			"List form templates. List form templates with sorting, filtering and cursor-based pagination support. Only templates available in the brand's library are returned, each with its full content and brand assets applied.",
	},
	'formTemplates.render': {
		riskLevel: 'read',
		description:
			'Render a form template. Render a single form template by ID and return its display steps as HTML.',
	},
	'forms.create': {
		riskLevel: 'write',
		description:
			'Create form. Create a form with its full content and styling. New forms start in draft status and are not shown to visitors until enabled via POST /forms/{formID}/enable. Choosing a display type: - popup — modal centered over the page that dims the background.',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete form. Delete a single form by ID. Forms can be deleted in any state (draft, enabled, disabled). Deleting a non-existent form succeeds (idempotent). When the form owns an A/B test setup, the setup and its version forms are deleted as well. Cannot be undone.',
	},
	'forms.disable': {
		riskLevel: 'write',
		description:
			'Disable form. Disable a single form by ID. Disabling stops serving the form to visitors and moves it to disabled status; the form and its content are preserved and can be enabled again later. Disabling an already disabled form succeeds (idempotent).',
	},
	'forms.enable': {
		riskLevel: 'write',
		description:
			'Enable form. Enable a single form by ID. Enabling publishes the form and starts serving it to visitors according to its targeting rules; the form moves to enabled status. Enabling an already enabled form succeeds (idempotent).',
	},
	'forms.get': {
		riskLevel: 'read',
		description:
			'Get form. Get a single form by ID, including its content, styling, targeting rules, and status. When the form is part of an A/B test, abSetupID and abStatus identify the setup it belongs to.',
	},
	'forms.getPeriodicReport': {
		riskLevel: 'read',
		description:
			'Get form periodic report. Get a time series of form performance statistics within a date range.',
	},
	'forms.getReport': {
		riskLevel: 'read',
		description:
			'Get form report. Get aggregated performance statistics for a single form within a date range. The response contains statistics (totals across all devices) and statisticsByDevice, the same counters split into the desktop, mobile, and tablet buckets. Device buckets with no activity in the range are omitted.',
	},
	'forms.list': {
		riskLevel: 'read',
		description:
			'List forms. List forms with sorting and cursor-based pagination support.',
	},
	'forms.listAbSetupReports': {
		riskLevel: 'read',
		description:
			'List A/B setup reports for a form. Returns the results of the A/B tests of the given form. Each report covers one A/B setup and contains the period it ran for (startedAt, and completedAt once it finished), the winning version, and per-version statistics.',
	},
	'forms.listContacts': {
		riskLevel: 'read',
		description:
			'Get form submitted contacts. Get the contacts that signed up through the given form, most recent first by default, together with the values they submitted (email, phone, name, address fields, discount code, and custom properties). Pagination: results are cursor-based.',
	},
	'forms.render': {
		riskLevel: 'read',
		description:
			'Render a form. Render a single form by ID and return its display steps as HTML. The form is rendered from its current stored content without enabling it or serving it to visitors, so the response can be used to preview how the form will look.',
	},
	'forms.update': {
		riskLevel: 'write',
		description:
			'Update form. Partially update a form. Only the fields present in the request body are changed; omitted fields are left unchanged. Nested objects must be sent complete, as they fully replace the stored value. Sending null for an optional field clears it, while sending null for a mandatory field is rejected.',
	},
	'images.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete image. With this endpoint you can delete an image by ID. Cannot be undone.',
	},
	'images.get': {
		riskLevel: 'read',
		description:
			'Get image. With this endpoint you can get a single image by ID.',
	},
	'images.list': {
		riskLevel: 'read',
		description:
			'List images. With this endpoint you can get a paginated list of images for a brand.',
	},
	'images.upload': {
		riskLevel: 'write',
		description:
			'Upload image file. With this endpoint you can upload an image file directly from your computer. File Requirements: - Supported formats: JPEG, PNG, GIF, WebP - Maximum file size: 5MB. Sends the file as multipart form data.',
	},
	'images.uploadFromUrl': {
		riskLevel: 'write',
		description:
			'Upload image by URL. With this endpoint you can upload an image from a publicly accessible URL. If the name is not provided, the filename will be extracted from the URL.',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Create a catalog product with at least one variant; prices are floats in the store currency.',
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a product from the catalog.',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Read one product by your own product ID, with its variants and prices.',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'Page the catalog products, filtered by title or dates.',
	},
	'products.replace': {
		riskLevel: 'write',
		description:
			'Replace a product in full; omitted fields drop to their defaults.',
	},
	'segments.create': {
		riskLevel: 'write',
		description: 'Create segment. Creates a new segment. (POST /segments)',
	},
	'segments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete segment. Permanently deletes a segment by its unique identifier. The segment must not be in a building state to be deleted. If the segment is currently being built, a 409 Conflict error is returned. Cannot be undone.',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Get segment. Returns a segment by its unique identifier.',
	},
	'segments.getStatistics': {
		riskLevel: 'read',
		description:
			'Get segment statistics. Returns statistics for a segment, including the total number of matching contacts. Returns 409 Conflict (segment-building) while the segment is building; retry once it is ready.',
	},
	'segments.list': {
		riskLevel: 'read',
		description:
			'List segments. List segments with sorting and cursor-based pagination support.',
	},
	'segments.replace': {
		riskLevel: 'write',
		description:
			'Update segment. Updates an existing segment by ID. The segment must not be in a building state to be updated. If the segment is currently being built, a 409 Conflict error is returned.',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create an email template with a name and editor sections.',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an email template.',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one email template by id, with its sections and styles.',
	},
	'templates.importFromHtml': {
		riskLevel: 'write',
		description:
			'Import raw HTML, up to 1 MB, as a new email template Omnisend converts to editor sections.',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'Page the email templates, filtered by name.',
	},
	'templates.render': {
		riskLevel: 'read',
		description:
			'Render a template to its HTML for preview; nothing is sent and no state changes.',
	},
	'templates.replace': {
		riskLevel: 'write',
		description:
			'Replace an email template in full; omitted fields drop to their defaults.',
	},
	'universalLayouts.create': {
		riskLevel: 'write',
		description:
			'Create universal layout. With this endpoint you can create a new universal layout.',
	},
	'universalLayouts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete universal layout. With this endpoint you can delete a universal layout by ID. Cannot be undone.',
	},
	'universalLayouts.get': {
		riskLevel: 'read',
		description:
			'Get universal layout. With this endpoint you can get a universal layout by ID.',
	},
	'universalLayouts.list': {
		riskLevel: 'read',
		description:
			'Get universal layouts. With this endpoint you can get a paginated list of universal layouts. Sorting: Items are returned in descending order by creation time (newest first). This is based on the internal document ID which contains a timestamp.',
	},
	'universalLayouts.replace': {
		riskLevel: 'write',
		description:
			'Update universal layout. With this endpoint you can update (fully replace) a universal layout by ID.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof omnisendEndpointsNested>;
