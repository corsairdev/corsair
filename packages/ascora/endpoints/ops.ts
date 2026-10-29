import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	ascoraPathSegment,
	assertAscoraSuccess,
	makeAscoraRequest,
} from '../client';
import type { AscoraContext, AscoraEndpoints } from '../index';
import {
	AscoraEndpointInputSchemas,
	AscoraEndpointOutputSchemas,
} from './types';

async function apiKey(ctx: AscoraContext): Promise<string> {
	const key = ctx.key?.trim();
	if (!key) throw new AuthMissingError('ascora', 'api_key');
	return key;
}

function omitUndefined(
	value: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(value)) {
		if (item !== undefined) out[key] = item;
	}
	return out;
}

const EVENT_META_KEYS = [
	'customerId',
	'contactId',
	'supplierId',
	'jobNumber',
	'entityId',
	'entityType',
	'page',
	'pageSize',
] as const;

function eventMeta(input: unknown): Record<string, unknown> {
	if (input === null || typeof input !== 'object' || Array.isArray(input)) {
		return {};
	}
	const src = input as Record<string, unknown>;
	const out: Record<string, unknown> = {};
	for (const key of EVENT_META_KEYS) {
		if (src[key] !== undefined) out[key] = src[key];
	}
	return out;
}

async function parseAndLog<K extends keyof typeof AscoraEndpointOutputSchemas>(
	ctx: AscoraContext,
	event: string,
	input: unknown,
	schemaKey: K,
	payload: unknown,
): Promise<(typeof AscoraEndpointOutputSchemas)[K]['_output']> {
	assertAscoraSuccess(payload);
	const result = AscoraEndpointOutputSchemas[schemaKey].parse(payload);
	await logEventFromContext(ctx, event, eventMeta(input), 'completed');
	return result;
}

export const listCustomers: AscoraEndpoints['listCustomers'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.listCustomers.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Customers/Customers',
		{
			query: {
				Page: input.page,
				PageSize: input.pageSize,
				FilterText: input.filterText,
				CustomerType: input.customerType,
				LeadSource: input.leadSource,
				AssignedUser: input.assignedUser,
				SiteBillingType: input.siteBillingType,
				PhoneNumber: input.phoneNumber,
			},
		},
	);
	return parseAndLog(
		ctx,
		'ascora.customers.list',
		input,
		'listCustomers',
		payload,
	);
};

export const getCustomer: AscoraEndpoints['getCustomer'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.getCustomer.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		`/Customers/Customer/${ascoraPathSegment(input.customerId)}`,
	);
	return parseAndLog(
		ctx,
		'ascora.customers.get',
		input,
		'getCustomer',
		payload,
	);
};

export const upsertCustomer: AscoraEndpoints['upsertCustomer'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.upsertCustomer.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Customers/Customer',
		{
			method: 'POST',
			body: omitUndefined(input),
		},
	);
	return parseAndLog(
		ctx,
		'ascora.customers.upsert',
		input,
		'upsertCustomer',
		payload,
	);
};

export const getContact: AscoraEndpoints['getContact'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.getContact.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		`/Customers/Contact/${ascoraPathSegment(input.contactId)}`,
	);
	return parseAndLog(ctx, 'ascora.contacts.get', input, 'getContact', payload);
};

export const upsertContact: AscoraEndpoints['upsertContact'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.upsertContact.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Customers/Contact',
		{
			method: 'POST',
			body: omitUndefined(input),
		},
	);
	return parseAndLog(
		ctx,
		'ascora.contacts.upsert',
		input,
		'upsertContact',
		payload,
	);
};

export const createEnquiry: AscoraEndpoints['createEnquiry'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.createEnquiry.parse(raw);
	const payload = await makeAscoraRequest(await apiKey(ctx), '/Enquiry', {
		method: 'POST',
		body: omitUndefined(input),
	});
	return parseAndLog(
		ctx,
		'ascora.enquiries.create',
		input,
		'createEnquiry',
		payload,
	);
};

export const listQuotes: AscoraEndpoints['listQuotes'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.listQuotes.parse(raw);
	const payload = await makeAscoraRequest(await apiKey(ctx), '/Quotes/Quotes', {
		query: {
			Page: input.page,
			PageSize: input.pageSize,
			FilterText: input.filterText,
			QuoteStatus: input.quoteStatus,
			JobType: input.jobType,
			AssignedUser: input.assignedUser,
			CustomerName: input.customerName,
			StartDate: input.startDate,
			EndDate: input.endDate,
		},
	});
	return parseAndLog(ctx, 'ascora.quotes.list', input, 'listQuotes', payload);
};

export const getLabourRoles: AscoraEndpoints['getLabourRoles'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.getLabourRoles.parse(raw ?? {});
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Quotes/LabourRoles',
	);
	return parseAndLog(
		ctx,
		'ascora.quotes.labourRoles',
		input,
		'getLabourRoles',
		payload,
	);
};

export const getStandardSections: AscoraEndpoints['getStandardSections'] =
	async (ctx, raw) => {
		const input = AscoraEndpointInputSchemas.getStandardSections.parse(
			raw ?? {},
		);
		const payload = await makeAscoraRequest(
			await apiKey(ctx),
			'/Quotes/StandardSections',
		);
		return parseAndLog(
			ctx,
			'ascora.quotes.standardSections',
			input,
			'getStandardSections',
			payload,
		);
	};

export const getStandardStages: AscoraEndpoints['getStandardStages'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.getStandardStages.parse(raw ?? {});
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Quotes/StandardStages',
	);
	return parseAndLog(
		ctx,
		'ascora.quotes.standardStages',
		input,
		'getStandardStages',
		payload,
	);
};

export const listSupplies: AscoraEndpoints['listSupplies'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.listSupplies.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Inventory/Supplies',
		{
			query: {
				Page: input.page,
				PageSize: input.pageSize,
				FilterText: input.filterText,
				FavouriteOnly: input.favouriteOnly,
				CategoryOneId: input.categoryOneId,
				CategoryTwoId: input.categoryTwoId,
			},
		},
	);
	return parseAndLog(
		ctx,
		'ascora.inventory.supplies',
		input,
		'listSupplies',
		payload,
	);
};

export const listKits: AscoraEndpoints['listKits'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.listKits.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Inventory/Kits',
		{
			query: {
				Page: input.page,
				PageSize: input.pageSize,
				FilterText: input.filterText,
				FavouriteOnly: input.favouriteOnly,
				CategoryOneId: input.categoryOneId,
				CategoryTwoId: input.categoryTwoId,
			},
		},
	);
	return parseAndLog(ctx, 'ascora.inventory.kits', input, 'listKits', payload);
};

export const listCategories: AscoraEndpoints['listCategories'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.listCategories.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Inventory/Categories',
		{
			query: {
				Page: input.page,
				PageSize: input.pageSize,
				FilterText: input.filterText,
				ParentOnly: input.parentOnly,
				CategoryNumber: input.categoryNumber,
			},
		},
	);
	return parseAndLog(
		ctx,
		'ascora.inventory.categories',
		input,
		'listCategories',
		payload,
	);
};

export const getJob: AscoraEndpoints['getJob'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.getJob.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		`/Jobs/Job/${ascoraPathSegment(input.jobNumber)}`,
	);
	return parseAndLog(ctx, 'ascora.jobs.get', input, 'getJob', payload);
};

export const listJobs: AscoraEndpoints['listJobs'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.listJobs.parse(raw);
	const payload = await makeAscoraRequest(await apiKey(ctx), '/Jobs/Jobs', {
		query: {
			Page: input.page,
			PageSize: input.pageSize,
			JobStatus: input.jobStatus,
			JobType: input.jobType,
			AssignedUser: input.assignedUser,
			StartDate: input.startDate,
			EndDate: input.endDate,
			IncludeChildJobs: input.includeChildJobs,
		},
	});
	return parseAndLog(ctx, 'ascora.jobs.list', input, 'listJobs', payload);
};

export const searchJobs: AscoraEndpoints['searchJobs'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.searchJobs.parse(raw);
	const payload = await makeAscoraRequest(await apiKey(ctx), '/Jobs/Jobs', {
		query: {
			Page: input.page,
			PageSize: input.pageSize,
			FilterText: input.filterText,
			CustomerName: input.customerName,
			JobStatus: 'ALL',
		},
	});
	return parseAndLog(ctx, 'ascora.jobs.search', input, 'searchJobs', payload);
};

export const listSuppliers: AscoraEndpoints['listSuppliers'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.listSuppliers.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Suppliers/Suppliers',
		{
			query: {
				Page: input.page,
				PageSize: input.pageSize,
				SupplierName: input.supplierName,
				SupplierNumber: input.supplierNumber,
				BusinessNumber: input.businessNumber,
			},
		},
	);
	return parseAndLog(
		ctx,
		'ascora.suppliers.list',
		input,
		'listSuppliers',
		payload,
	);
};

export const getSupplier: AscoraEndpoints['getSupplier'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.getSupplier.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		`/Suppliers/Supplier/${ascoraPathSegment(input.supplierId)}`,
	);
	return parseAndLog(
		ctx,
		'ascora.suppliers.get',
		input,
		'getSupplier',
		payload,
	);
};

export const upsertSupplier: AscoraEndpoints['upsertSupplier'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.upsertSupplier.parse(raw);
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		'/Suppliers/Supplier',
		{
			method: 'POST',
			body: omitUndefined(input),
		},
	);
	return parseAndLog(
		ctx,
		'ascora.suppliers.upsert',
		input,
		'upsertSupplier',
		payload,
	);
};

export const listSupplierInvoices: AscoraEndpoints['listSupplierInvoices'] =
	async (ctx, raw) => {
		const input = AscoraEndpointInputSchemas.listSupplierInvoices.parse(raw);
		const payload = await makeAscoraRequest(
			await apiKey(ctx),
			'/SupplierInvoices/SupplierInvoices',
			{
				query: {
					Page: input.page,
					PageSize: input.pageSize,
					SupplierName: input.supplierName,
					TrackingNumber: input.trackingNumber,
					ToBeSentToAccounting: input.toBeSentToAccounting,
					InvoiceDateStart: input.invoiceDateStart,
					InvoiceDateEnd: input.invoiceDateEnd,
				},
			},
		);
		return parseAndLog(
			ctx,
			'ascora.supplierInvoices.list',
			input,
			'listSupplierInvoices',
			payload,
		);
	};

export const createNote: AscoraEndpoints['createNote'] = async (ctx, raw) => {
	const input = AscoraEndpointInputSchemas.createNote.parse(raw);
	const payload = await makeAscoraRequest(await apiKey(ctx), '/Notes/Note', {
		method: 'POST',
		body: omitUndefined(input),
	});
	return parseAndLog(ctx, 'ascora.notes.create', input, 'createNote', payload);
};

export const uploadAttachment: AscoraEndpoints['uploadAttachment'] = async (
	ctx,
	raw,
) => {
	const input = AscoraEndpointInputSchemas.uploadAttachment.parse(raw);
	const bytes = Buffer.from(input.fileBase64, 'base64');
	const file = new File([bytes], input.fileName, {
		type: input.contentType ?? 'application/octet-stream',
	});
	const payload = await makeAscoraRequest(
		await apiKey(ctx),
		`/Attachments/${ascoraPathSegment(input.entityType)}/${ascoraPathSegment(input.entityId)}`,
		{
			method: 'POST',
			formData: { file },
		},
	);
	return parseAndLog(
		ctx,
		'ascora.attachments.upload',
		{ entityType: input.entityType, entityId: input.entityId },
		'uploadAttachment',
		payload,
	);
};
