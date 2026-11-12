import { logEventFromContext } from 'corsair/core';
import { makeRocketlaneRequest } from '../client';
import type { RocketlaneEndpoints } from '../index';
import {
	RocketlaneEndpointInputSchemas as In,
	RocketlaneEndpointOutputSchemas as Out,
} from './types';

export const getInvoicePayments: RocketlaneEndpoints['getInvoicePayments'] =
	async (ctx, input) => {
		input = In.getInvoicePayments.parse(input);
		const response = Out.getInvoicePayments.parse(
			await makeRocketlaneRequest(
				`1.0/invoices/${encodeURIComponent(String(input.invoiceId))}/payments`,
				ctx.key,
				{
					method: 'GET',
					query: { pageSize: input['pageSize'], pageToken: input['pageToken'] },
				},
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.invoices.getInvoicePayments',
			input,
			'completed',
		);
		return response;
	};

export const getInvoiceLineItems: RocketlaneEndpoints['getInvoiceLineItems'] =
	async (ctx, input) => {
		input = In.getInvoiceLineItems.parse(input);
		const response = Out.getInvoiceLineItems.parse(
			await makeRocketlaneRequest(
				`1.0/invoices/${encodeURIComponent(String(input.invoiceId))}/lines`,
				ctx.key,
				{
					method: 'GET',
					query: { pageSize: input['pageSize'], pageToken: input['pageToken'] },
				},
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.invoices.getInvoiceLineItems',
			input,
			'completed',
		);
		return response;
	};

export const getInvoice: RocketlaneEndpoints['getInvoice'] = async (
	ctx,
	input,
) => {
	input = In.getInvoice.parse(input);
	const response = Out.getInvoice.parse(
		await makeRocketlaneRequest(
			`1.0/invoices/${encodeURIComponent(String(input.invoiceId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.invoices.getInvoice',
		input,
		'completed',
	);
	return response;
};

export const searchInvoices: RocketlaneEndpoints['searchInvoices'] = async (
	ctx,
	input,
) => {
	input = In.searchInvoices.parse(input);
	const response = Out.searchInvoices.parse(
		await makeRocketlaneRequest(`1.0/invoices`, ctx.key, {
			method: 'GET',
			query: {
				'dateOfIssue.eq': input['dateOfIssue.eq'],
				'dateOfIssue.gt': input['dateOfIssue.gt'],
				'dateOfIssue.ge': input['dateOfIssue.ge'],
				'dateOfIssue.lt': input['dateOfIssue.lt'],
				'dateOfIssue.le': input['dateOfIssue.le'],
				'dueDate.eq': input['dueDate.eq'],
				'dueDate.gt': input['dueDate.gt'],
				'dueDate.ge': input['dueDate.ge'],
				'dueDate.lt': input['dueDate.lt'],
				'dueDate.le': input['dueDate.le'],
				'amount.eq': input['amount.eq'],
				'amount.gt': input['amount.gt'],
				'amount.ge': input['amount.ge'],
				'amount.lt': input['amount.lt'],
				'amount.le': input['amount.le'],
				'amountOutstanding.eq': input['amountOutstanding.eq'],
				'amountOutstanding.gt': input['amountOutstanding.gt'],
				'amountOutstanding.ge': input['amountOutstanding.ge'],
				'amountOutstanding.lt': input['amountOutstanding.lt'],
				'amountOutstanding.le': input['amountOutstanding.le'],
				'amountPaid.eq': input['amountPaid.eq'],
				'amountPaid.gt': input['amountPaid.gt'],
				'amountPaid.ge': input['amountPaid.ge'],
				'amountPaid.lt': input['amountPaid.lt'],
				'amountPaid.le': input['amountPaid.le'],
				'amountWrittenOff.eq': input['amountWrittenOff.eq'],
				'amountWrittenOff.gt': input['amountWrittenOff.gt'],
				'amountWrittenOff.ge': input['amountWrittenOff.ge'],
				'amountWrittenOff.lt': input['amountWrittenOff.lt'],
				'amountWrittenOff.le': input['amountWrittenOff.le'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'companyId.eq': input['companyId.eq'],
				'companyId.oneOf': input['companyId.oneOf'],
				'companyId.noneOf': input['companyId.noneOf'],
				'invoiceNumber.eq': input['invoiceNumber.eq'],
				'invoiceNumber.cn': input['invoiceNumber.cn'],
				'invoiceNumber.nc': input['invoiceNumber.nc'],
				'status.eq': input['status.eq'],
				'status.oneOf': input['status.oneOf'],
				'status.noneOf': input['status.noneOf'],
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.invoices.searchInvoices',
		input,
		'completed',
	);
	return response;
};

export const getCompany: RocketlaneEndpoints['getCompany'] = async (
	ctx,
	input,
) => {
	input = In.getCompany.parse(input);
	const response = Out.getCompany.parse(
		await makeRocketlaneRequest(
			`1.0/companies/${encodeURIComponent(String(input.companyId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.companies.getCompany',
		input,
		'completed',
	);
	return response;
};

export const updateCompany: RocketlaneEndpoints['updateCompany'] = async (
	ctx,
	input,
) => {
	input = In.updateCompany.parse(input);
	const response = Out.updateCompany.parse(
		await makeRocketlaneRequest(
			`1.0/companies/${encodeURIComponent(String(input.companyId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.companies.updateCompany',
		input,
		'completed',
	);
	return response;
};

export const deleteCompany: RocketlaneEndpoints['deleteCompany'] = async (
	ctx,
	input,
) => {
	input = In.deleteCompany.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/companies/${encodeURIComponent(String(input.companyId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.companies.deleteCompany',
		input,
		'completed',
	);
	return response;
};

export const createCompanyNote: RocketlaneEndpoints['createCompanyNote'] =
	async (ctx, input) => {
		input = In.createCompanyNote.parse(input);
		const response = Out.createCompanyNote.parse(
			await makeRocketlaneRequest(
				`1.0/companies/${encodeURIComponent(String(input.companyId))}/add-notes`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.companies.createCompanyNote',
			input,
			'completed',
		);
		return response;
	};

export const getAllCompanies: RocketlaneEndpoints['getAllCompanies'] = async (
	ctx,
	input,
) => {
	input = In.getAllCompanies.parse(input);
	const response = Out.getAllCompanies.parse(
		await makeRocketlaneRequest(`1.0/companies`, ctx.key, {
			method: 'GET',
			query: {
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'companyName.eq': input['companyName.eq'],
				'companyName.cn': input['companyName.cn'],
				'companyName.nc': input['companyName.nc'],
				'companyUrl.eq': input['companyUrl.eq'],
				'companyUrl.cn': input['companyUrl.cn'],
				'companyUrl.nc': input['companyUrl.nc'],
				'accountOwner.eq': input['accountOwner.eq'],
				'accountOwner.oneOf': input['accountOwner.oneOf'],
				'accountOwner.noneOf': input['accountOwner.noneOf'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.companies.getAllCompanies',
		input,
		'completed',
	);
	return response;
};

export const createCompany: RocketlaneEndpoints['createCompany'] = async (
	ctx,
	input,
) => {
	input = In.createCompany.parse(input);
	const response = Out.createCompany.parse(
		await makeRocketlaneRequest(`1.0/companies`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.companies.createCompany',
		input,
		'completed',
	);
	return response;
};

export const getAllResourceAllocations: RocketlaneEndpoints['getAllResourceAllocations'] =
	async (ctx, input) => {
		input = In.getAllResourceAllocations.parse(input);
		const response = Out.getAllResourceAllocations.parse(
			await makeRocketlaneRequest(`1.0/resource-allocations`, ctx.key, {
				method: 'GET',
				query: {
					startDate: input['startDate'],
					endDate: input['endDate'],
					pageSize: input['pageSize'],
					pageToken: input['pageToken'],
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
					sortBy: input['sortBy'],
					sortOrder: input['sortOrder'],
					match: input['match'],
					'memberId.eq': input['memberId.eq'],
					'memberId.oneOf': input['memberId.oneOf'],
					'memberId.noneOf': input['memberId.noneOf'],
					'projectId.eq': input['projectId.eq'],
					'projectId.oneOf': input['projectId.oneOf'],
					'projectId.noneOf': input['projectId.noneOf'],
					'placeholderId.eq': input['placeholderId.eq'],
					'placeholderId.oneOf': input['placeholderId.oneOf'],
					'placeholderId.noneOf': input['placeholderId.noneOf'],
				},
			}),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.resource_allocations.getAllResourceAllocations',
			input,
			'completed',
		);
		return response;
	};

export const getAllTimeoffs: RocketlaneEndpoints['getAllTimeoffs'] = async (
	ctx,
	input,
) => {
	input = In.getAllTimeoffs.parse(input);
	const response = Out.getAllTimeoffs.parse(
		await makeRocketlaneRequest(`1.0/time-offs`, ctx.key, {
			method: 'GET',
			query: {
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'startDate.gt': input['startDate.gt'],
				'startDate.eq': input['startDate.eq'],
				'startDate.lt': input['startDate.lt'],
				'startDate.ge': input['startDate.ge'],
				'startDate.le': input['startDate.le'],
				'endDate.gt': input['endDate.gt'],
				'endDate.eq': input['endDate.eq'],
				'endDate.lt': input['endDate.lt'],
				'endDate.ge': input['endDate.ge'],
				'endDate.le': input['endDate.le'],
				'type.eq': input['type.eq'],
				'type.oneOf': input['type.oneOf'],
				'type.noneOf': input['type.noneOf'],
				'userId.eq': input['userId.eq'],
				'userId.oneOf': input['userId.oneOf'],
				'userId.noneOf': input['userId.noneOf'],
				'emailId.eq': input['emailId.eq'],
				'emailId.oneOf': input['emailId.oneOf'],
				'emailId.noneOf': input['emailId.noneOf'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_offs.getAllTimeoffs',
		input,
		'completed',
	);
	return response;
};

export const createTimeoff: RocketlaneEndpoints['createTimeoff'] = async (
	ctx,
	input,
) => {
	input = In.createTimeoff.parse(input);
	const response = Out.createTimeoff.parse(
		await makeRocketlaneRequest(`1.0/time-offs`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_offs.createTimeoff',
		input,
		'completed',
	);
	return response;
};

export const getTimeoff: RocketlaneEndpoints['getTimeoff'] = async (
	ctx,
	input,
) => {
	input = In.getTimeoff.parse(input);
	const response = Out.getTimeoff.parse(
		await makeRocketlaneRequest(
			`1.0/time-offs/${encodeURIComponent(String(input.timeOffId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_offs.getTimeoff',
		input,
		'completed',
	);
	return response;
};

export const deleteTimeoff: RocketlaneEndpoints['deleteTimeoff'] = async (
	ctx,
	input,
) => {
	input = In.deleteTimeoff.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/time-offs/${encodeURIComponent(String(input.timeOffId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_offs.deleteTimeoff',
		input,
		'completed',
	);
	return response;
};

export const getField: RocketlaneEndpoints['getField'] = async (ctx, input) => {
	input = In.getField.parse(input);
	const response = Out.getField.parse(
		await makeRocketlaneRequest(
			`1.0/fields/${encodeURIComponent(String(input.fieldId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.fields.getField',
		input,
		'completed',
	);
	return response;
};

export const updateField: RocketlaneEndpoints['updateField'] = async (
	ctx,
	input,
) => {
	input = In.updateField.parse(input);
	const response = Out.updateField.parse(
		await makeRocketlaneRequest(
			`1.0/fields/${encodeURIComponent(String(input.fieldId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.fields.updateField',
		input,
		'completed',
	);
	return response;
};

export const deleteField: RocketlaneEndpoints['deleteField'] = async (
	ctx,
	input,
) => {
	input = In.deleteField.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/fields/${encodeURIComponent(String(input.fieldId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.fields.deleteField',
		input,
		'completed',
	);
	return response;
};

export const updateFieldOption: RocketlaneEndpoints['updateFieldOption'] =
	async (ctx, input) => {
		input = In.updateFieldOption.parse(input);
		const response = Out.updateFieldOption.parse(
			await makeRocketlaneRequest(
				`1.0/fields/${encodeURIComponent(String(input.fieldId))}/update-option`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.fields.updateFieldOption',
			input,
			'completed',
		);
		return response;
	};

export const addFieldOption: RocketlaneEndpoints['addFieldOption'] = async (
	ctx,
	input,
) => {
	input = In.addFieldOption.parse(input);
	const response = Out.addFieldOption.parse(
		await makeRocketlaneRequest(
			`1.0/fields/${encodeURIComponent(String(input.fieldId))}/add-option`,
			ctx.key,
			{ method: 'POST', query: {}, body: input.body },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.fields.addFieldOption',
		input,
		'completed',
	);
	return response;
};

export const getAllFields: RocketlaneEndpoints['getAllFields'] = async (
	ctx,
	input,
) => {
	input = In.getAllFields.parse(input);
	const response = Out.getAllFields.parse(
		await makeRocketlaneRequest(`1.0/fields`, ctx.key, {
			method: 'GET',
			query: {
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'updatedAt.gt': input['updatedAt.gt'],
				'updatedAt.eq': input['updatedAt.eq'],
				'updatedAt.lt': input['updatedAt.lt'],
				'updatedAt.ge': input['updatedAt.ge'],
				'updatedAt.le': input['updatedAt.le'],
				'objectType.eq': input['objectType.eq'],
				'fieldType.eq': input['fieldType.eq'],
				'enabled.eq': input['enabled.eq'],
				'private.eq': input['private.eq'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.fields.getAllFields',
		input,
		'completed',
	);
	return response;
};

export const createField: RocketlaneEndpoints['createField'] = async (
	ctx,
	input,
) => {
	input = In.createField.parse(input);
	const response = Out.createField.parse(
		await makeRocketlaneRequest(`1.0/fields`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.fields.createField',
		input,
		'completed',
	);
	return response;
};

export const getTimeEntry: RocketlaneEndpoints['getTimeEntry'] = async (
	ctx,
	input,
) => {
	input = In.getTimeEntry.parse(input);
	const response = Out.getTimeEntry.parse(
		await makeRocketlaneRequest(
			`1.0/time-entries/${encodeURIComponent(String(input.timeEntryId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_entries.getTimeEntry',
		input,
		'completed',
	);
	return response;
};

export const updateTimeEntry: RocketlaneEndpoints['updateTimeEntry'] = async (
	ctx,
	input,
) => {
	input = In.updateTimeEntry.parse(input);
	const response = Out.updateTimeEntry.parse(
		await makeRocketlaneRequest(
			`1.0/time-entries/${encodeURIComponent(String(input.timeEntryId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_entries.updateTimeEntry',
		input,
		'completed',
	);
	return response;
};

export const deleteTimeEntry: RocketlaneEndpoints['deleteTimeEntry'] = async (
	ctx,
	input,
) => {
	input = In.deleteTimeEntry.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/time-entries/${encodeURIComponent(String(input.timeEntryId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_entries.deleteTimeEntry',
		input,
		'completed',
	);
	return response;
};

export const getAllTimeEntries: RocketlaneEndpoints['getAllTimeEntries'] =
	async (ctx, input) => {
		input = In.getAllTimeEntries.parse(input);
		const response = Out.getAllTimeEntries.parse(
			await makeRocketlaneRequest(`1.0/time-entries`, ctx.key, {
				method: 'GET',
				query: {
					pageSize: input['pageSize'],
					pageToken: input['pageToken'],
					includeFields: input['includeFields'],
					sortBy: input['sortBy'],
					sortOrder: input['sortOrder'],
					match: input['match'],
					'date.gt': input['date.gt'],
					'date.eq': input['date.eq'],
					'date.lt': input['date.lt'],
					'date.ge': input['date.ge'],
					'date.le': input['date.le'],
					'project.eq': input['project.eq'],
					'projectId.eq': input['projectId.eq'],
					'task.eq': input['task.eq'],
					'taskId.eq': input['taskId.eq'],
					'taskId.oneOf': input['taskId.oneOf'],
					'taskId.noneOf': input['taskId.noneOf'],
					'projectPhase.eq': input['projectPhase.eq'],
					'category.eq': input['category.eq'],
					'user.eq': input['user.eq'],
					'emailId.eq': input['emailId.eq'],
					'emailId.cn': input['emailId.cn'],
					'emailId.nc': input['emailId.nc'],
					'sourceType.eq': input['sourceType.eq'],
					'activityName.eq': input['activityName.eq'],
					'activityName.cn': input['activityName.cn'],
					'activityName.nc': input['activityName.nc'],
					'approvalStatus.eq': input['approvalStatus.eq'],
					'submittedBy.eq': input['submittedBy.eq'],
					'submittedAt.eq': input['submittedAt.eq'],
					'submittedAt.gt': input['submittedAt.gt'],
					'submittedAt.ge': input['submittedAt.ge'],
					'submittedAt.lt': input['submittedAt.lt'],
					'submittedAt.le': input['submittedAt.le'],
					'approvedBy.eq': input['approvedBy.eq'],
					'approvedAt.eq': input['approvedAt.eq'],
					'approvedAt.gt': input['approvedAt.gt'],
					'approvedAt.ge': input['approvedAt.ge'],
					'approvedAt.lt': input['approvedAt.lt'],
					'approvedAt.le': input['approvedAt.le'],
					'rejectedBy.eq': input['rejectedBy.eq'],
					'rejectedAt.eq': input['rejectedAt.eq'],
					'rejectedAt.gt': input['rejectedAt.gt'],
					'rejectedAt.ge': input['rejectedAt.ge'],
					'rejectedAt.lt': input['rejectedAt.lt'],
					'rejectedAt.le': input['rejectedAt.le'],
					'billable.eq': input['billable.eq'],
					'includeDeleted.eq': input['includeDeleted.eq'],
					'createdAt.gt': input['createdAt.gt'],
					'createdAt.eq': input['createdAt.eq'],
					'createdAt.lt': input['createdAt.lt'],
					'createdAt.ge': input['createdAt.ge'],
					'createdAt.le': input['createdAt.le'],
					'updatedAt.gt': input['updatedAt.gt'],
					'updatedAt.eq': input['updatedAt.eq'],
					'updatedAt.lt': input['updatedAt.lt'],
					'updatedAt.ge': input['updatedAt.ge'],
					'updatedAt.le': input['updatedAt.le'],
				},
			}),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.time_entries.getAllTimeEntries',
			input,
			'completed',
		);
		return response;
	};

export const createTimeEntry: RocketlaneEndpoints['createTimeEntry'] = async (
	ctx,
	input,
) => {
	input = In.createTimeEntry.parse(input);
	const response = Out.createTimeEntry.parse(
		await makeRocketlaneRequest(`1.0/time-entries`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.time_entries.createTimeEntry',
		input,
		'completed',
	);
	return response;
};

export const searchTimeEntries: RocketlaneEndpoints['searchTimeEntries'] =
	async (ctx, input) => {
		input = In.searchTimeEntries.parse(input);
		const response = Out.searchTimeEntries.parse(
			await makeRocketlaneRequest(`1.0/time-entries/search`, ctx.key, {
				method: 'GET',
				query: {
					pageSize: input['pageSize'],
					pageToken: input['pageToken'],
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
					sortBy: input['sortBy'],
					sortOrder: input['sortOrder'],
					match: input['match'],
					'date.gt': input['date.gt'],
					'date.eq': input['date.eq'],
					'date.lt': input['date.lt'],
					'date.ge': input['date.ge'],
					'date.le': input['date.le'],
					'project.eq': input['project.eq'],
					'task.eq': input['task.eq'],
					'projectPhase.eq': input['projectPhase.eq'],
					'category.eq': input['category.eq'],
					'user.eq': input['user.eq'],
					'sourceType.eq': input['sourceType.eq'],
					'activityName.eq': input['activityName.eq'],
					'activityName.cn': input['activityName.cn'],
					'activityName.nc': input['activityName.nc'],
					'approvalStatus.eq': input['approvalStatus.eq'],
				},
			}),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.time_entries.searchTimeEntries',
			input,
			'completed',
		);
		return response;
	};

export const getTimeEntryCategories: RocketlaneEndpoints['getTimeEntryCategories'] =
	async (ctx, input) => {
		input = In.getTimeEntryCategories.parse(input);
		const response = Out.getTimeEntryCategories.parse(
			await makeRocketlaneRequest(`1.0/time-entries/categories`, ctx.key, {
				method: 'GET',
				query: { pageSize: input['pageSize'], pageToken: input['pageToken'] },
			}),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.time_entries.getTimeEntryCategories',
			input,
			'completed',
		);
		return response;
	};

export const getSpaceDocument: RocketlaneEndpoints['getSpaceDocument'] = async (
	ctx,
	input,
) => {
	input = In.getSpaceDocument.parse(input);
	const response = Out.getSpaceDocument.parse(
		await makeRocketlaneRequest(
			`1.0/space-documents/${encodeURIComponent(String(input.spaceDocumentId))}`,
			ctx.key,
			{ method: 'GET', query: {} },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.space_documents.getSpaceDocument',
		input,
		'completed',
	);
	return response;
};

export const updateSpaceDocument: RocketlaneEndpoints['updateSpaceDocument'] =
	async (ctx, input) => {
		input = In.updateSpaceDocument.parse(input);
		const response = Out.updateSpaceDocument.parse(
			await makeRocketlaneRequest(
				`1.0/space-documents/${encodeURIComponent(String(input.spaceDocumentId))}`,
				ctx.key,
				{ method: 'PUT', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.space_documents.updateSpaceDocument',
			input,
			'completed',
		);
		return response;
	};

export const deleteSpaceDocument: RocketlaneEndpoints['deleteSpaceDocument'] =
	async (ctx, input) => {
		input = In.deleteSpaceDocument.parse(input);
		const response = undefined;
		await makeRocketlaneRequest(
			`1.0/space-documents/${encodeURIComponent(String(input.spaceDocumentId))}`,
			ctx.key,
			{ method: 'DELETE', query: {} },
		);
		await logEventFromContext(
			ctx,
			'rocketlane.space_documents.deleteSpaceDocument',
			input,
			'completed',
		);
		return response;
	};

export const getAllSpaceDocuments: RocketlaneEndpoints['getAllSpaceDocuments'] =
	async (ctx, input) => {
		input = In.getAllSpaceDocuments.parse(input);
		const response = Out.getAllSpaceDocuments.parse(
			await makeRocketlaneRequest(`1.0/space-documents`, ctx.key, {
				method: 'GET',
				query: {
					projectId: input['projectId'],
					pageSize: input['pageSize'],
					pageToken: input['pageToken'],
					sortBy: input['sortBy'],
					sortOrder: input['sortOrder'],
					match: input['match'],
					'spaceDocumentName.eq': input['spaceDocumentName.eq'],
					'spaceDocumentName.cn': input['spaceDocumentName.cn'],
					'spaceDocumentName.nc': input['spaceDocumentName.nc'],
					'createdAt.gt': input['createdAt.gt'],
					'createdAt.eq': input['createdAt.eq'],
					'createdAt.lt': input['createdAt.lt'],
					'createdAt.ge': input['createdAt.ge'],
					'createdAt.le': input['createdAt.le'],
					'updatedAt.gt': input['updatedAt.gt'],
					'updatedAt.eq': input['updatedAt.eq'],
					'updatedAt.lt': input['updatedAt.lt'],
					'updatedAt.ge': input['updatedAt.ge'],
					'updatedAt.le': input['updatedAt.le'],
					'spaceId.eq': input['spaceId.eq'],
				},
			}),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.space_documents.getAllSpaceDocuments',
			input,
			'completed',
		);
		return response;
	};

export const createSpaceDocument: RocketlaneEndpoints['createSpaceDocument'] =
	async (ctx, input) => {
		input = In.createSpaceDocument.parse(input);
		const response = Out.createSpaceDocument.parse(
			await makeRocketlaneRequest(`1.0/space-documents`, ctx.key, {
				method: 'POST',
				query: {},
				body: input.body,
			}),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.space_documents.createSpaceDocument',
			input,
			'completed',
		);
		return response;
	};

export const updateBudgetMilestoneRevenueRecognitionConfigs: RocketlaneEndpoints['updateBudgetMilestoneRevenueRecognitionConfigs'] =
	async (ctx, input) => {
		input = In.updateBudgetMilestoneRevenueRecognitionConfigs.parse(input);
		const response = Out.updateBudgetMilestoneRevenueRecognitionConfigs.parse(
			await makeRocketlaneRequest(
				`1.0/budgets/${encodeURIComponent(String(input.budgetId))}/milestone-revenue-recognition-configs`,
				ctx.key,
				{
					method: 'PUT',
					query: {
						includeFields: input['includeFields'],
						includeAllFields: input['includeAllFields'],
					},
					body: input.body,
				},
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.budgets.updateBudgetMilestoneRevenueRecognitionConfigs',
			input,
			'completed',
		);
		return response;
	};

export const updateBudgetManualRevenueRecognitionConfigs: RocketlaneEndpoints['updateBudgetManualRevenueRecognitionConfigs'] =
	async (ctx, input) => {
		input = In.updateBudgetManualRevenueRecognitionConfigs.parse(input);
		const response = Out.updateBudgetManualRevenueRecognitionConfigs.parse(
			await makeRocketlaneRequest(
				`1.0/budgets/${encodeURIComponent(String(input.budgetId))}/manual-revenue-recognition-configs`,
				ctx.key,
				{
					method: 'PUT',
					query: {
						includeFields: input['includeFields'],
						includeAllFields: input['includeAllFields'],
					},
					body: input.body,
				},
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.budgets.updateBudgetManualRevenueRecognitionConfigs',
			input,
			'completed',
		);
		return response;
	};

export const getBudget: RocketlaneEndpoints['getBudget'] = async (
	ctx,
	input,
) => {
	input = In.getBudget.parse(input);
	const response = Out.getBudget.parse(
		await makeRocketlaneRequest(
			`1.0/budgets/${encodeURIComponent(String(input.budgetId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.budgets.getBudget',
		input,
		'completed',
	);
	return response;
};

export const updateBudget: RocketlaneEndpoints['updateBudget'] = async (
	ctx,
	input,
) => {
	input = In.updateBudget.parse(input);
	const response = Out.updateBudget.parse(
		await makeRocketlaneRequest(
			`1.0/budgets/${encodeURIComponent(String(input.budgetId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.budgets.updateBudget',
		input,
		'completed',
	);
	return response;
};

export const deleteBudget: RocketlaneEndpoints['deleteBudget'] = async (
	ctx,
	input,
) => {
	input = In.deleteBudget.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/budgets/${encodeURIComponent(String(input.budgetId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.budgets.deleteBudget',
		input,
		'completed',
	);
	return response;
};

export const searchBudgets: RocketlaneEndpoints['searchBudgets'] = async (
	ctx,
	input,
) => {
	input = In.searchBudgets.parse(input);
	const response = Out.searchBudgets.parse(
		await makeRocketlaneRequest(`1.0/budgets`, ctx.key, {
			method: 'GET',
			query: {
				'budgetId.eq': input['budgetId.eq'],
				'budgetId.oneOf': input['budgetId.oneOf'],
				'budgetId.noneOf': input['budgetId.noneOf'],
				'projectId.eq': input['projectId.eq'],
				'projectId.oneOf': input['projectId.oneOf'],
				'projectId.noneOf': input['projectId.noneOf'],
				'status.eq': input['status.eq'],
				'status.oneOf': input['status.oneOf'],
				'status.noneOf': input['status.noneOf'],
				'billingType.eq': input['billingType.eq'],
				'billingType.oneOf': input['billingType.oneOf'],
				'billingType.noneOf': input['billingType.noneOf'],
				'revenueRecognitionType.eq': input['revenueRecognitionType.eq'],
				'revenueRecognitionType.oneOf': input['revenueRecognitionType.oneOf'],
				'revenueRecognitionType.noneOf': input['revenueRecognitionType.noneOf'],
				'budgetAmount.eq': input['budgetAmount.eq'],
				'budgetAmount.gt': input['budgetAmount.gt'],
				'budgetAmount.ge': input['budgetAmount.ge'],
				'budgetAmount.lt': input['budgetAmount.lt'],
				'budgetAmount.le': input['budgetAmount.le'],
				'budgetHours.eq': input['budgetHours.eq'],
				'budgetHours.gt': input['budgetHours.gt'],
				'budgetHours.ge': input['budgetHours.ge'],
				'budgetHours.lt': input['budgetHours.lt'],
				'budgetHours.le': input['budgetHours.le'],
				'budgetName.eq': input['budgetName.eq'],
				'budgetName.cn': input['budgetName.cn'],
				'budgetName.nc': input['budgetName.nc'],
				'startDate.eq': input['startDate.eq'],
				'startDate.gt': input['startDate.gt'],
				'startDate.ge': input['startDate.ge'],
				'startDate.lt': input['startDate.lt'],
				'startDate.le': input['startDate.le'],
				'endDate.eq': input['endDate.eq'],
				'endDate.gt': input['endDate.gt'],
				'endDate.ge': input['endDate.ge'],
				'endDate.lt': input['endDate.lt'],
				'endDate.le': input['endDate.le'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'companyId.eq': input['companyId.eq'],
				'companyId.oneOf': input['companyId.oneOf'],
				'companyId.noneOf': input['companyId.noneOf'],
				'isDefault.eq': input['isDefault.eq'],
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.budgets.searchBudgets',
		input,
		'completed',
	);
	return response;
};

export const createBudget: RocketlaneEndpoints['createBudget'] = async (
	ctx,
	input,
) => {
	input = In.createBudget.parse(input);
	const response = Out.createBudget.parse(
		await makeRocketlaneRequest(`1.0/budgets`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.budgets.createBudget',
		input,
		'completed',
	);
	return response;
};

export const getTask: RocketlaneEndpoints['getTask'] = async (ctx, input) => {
	input = In.getTask.parse(input);
	const response = Out.getTask.parse(
		await makeRocketlaneRequest(
			`1.0/tasks/${encodeURIComponent(String(input.taskId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.tasks.getTask',
		input,
		'completed',
	);
	return response;
};

export const updateTask: RocketlaneEndpoints['updateTask'] = async (
	ctx,
	input,
) => {
	input = In.updateTask.parse(input);
	const response = Out.updateTask.parse(
		await makeRocketlaneRequest(
			`1.0/tasks/${encodeURIComponent(String(input.taskId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.tasks.updateTask',
		input,
		'completed',
	);
	return response;
};

export const deleteTask: RocketlaneEndpoints['deleteTask'] = async (
	ctx,
	input,
) => {
	input = In.deleteTask.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/tasks/${encodeURIComponent(String(input.taskId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.tasks.deleteTask',
		input,
		'completed',
	);
	return response;
};

export const removeFollowersFromTask: RocketlaneEndpoints['removeFollowersFromTask'] =
	async (ctx, input) => {
		input = In.removeFollowersFromTask.parse(input);
		const response = Out.removeFollowersFromTask.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/remove-followers`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.removeFollowersFromTask',
			input,
			'completed',
		);
		return response;
	};

export const removeDependenciesFromTask: RocketlaneEndpoints['removeDependenciesFromTask'] =
	async (ctx, input) => {
		input = In.removeDependenciesFromTask.parse(input);
		const response = Out.removeDependenciesFromTask.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/remove-dependencies`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.removeDependenciesFromTask',
			input,
			'completed',
		);
		return response;
	};

export const removeAssigneesFromTask: RocketlaneEndpoints['removeAssigneesFromTask'] =
	async (ctx, input) => {
		input = In.removeAssigneesFromTask.parse(input);
		const response = Out.removeAssigneesFromTask.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/remove-assignees`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.removeAssigneesFromTask',
			input,
			'completed',
		);
		return response;
	};

export const moveTaskToGivenPhase: RocketlaneEndpoints['moveTaskToGivenPhase'] =
	async (ctx, input) => {
		input = In.moveTaskToGivenPhase.parse(input);
		const response = Out.moveTaskToGivenPhase.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/move-phase`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.moveTaskToGivenPhase',
			input,
			'completed',
		);
		return response;
	};

export const addFollowersToTask: RocketlaneEndpoints['addFollowersToTask'] =
	async (ctx, input) => {
		input = In.addFollowersToTask.parse(input);
		const response = Out.addFollowersToTask.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/add-followers`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.addFollowersToTask',
			input,
			'completed',
		);
		return response;
	};

export const addDependenciesToTask: RocketlaneEndpoints['addDependenciesToTask'] =
	async (ctx, input) => {
		input = In.addDependenciesToTask.parse(input);
		const response = Out.addDependenciesToTask.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/add-dependencies`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.addDependenciesToTask',
			input,
			'completed',
		);
		return response;
	};

export const addAssigneeToTask: RocketlaneEndpoints['addAssigneeToTask'] =
	async (ctx, input) => {
		input = In.addAssigneeToTask.parse(input);
		const response = Out.addAssigneeToTask.parse(
			await makeRocketlaneRequest(
				`1.0/tasks/${encodeURIComponent(String(input.taskId))}/add-assignees`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.tasks.addAssigneeToTask',
			input,
			'completed',
		);
		return response;
	};

export const getAllTasks: RocketlaneEndpoints['getAllTasks'] = async (
	ctx,
	input,
) => {
	input = In.getAllTasks.parse(input);
	const response = Out.getAllTasks.parse(
		await makeRocketlaneRequest(`1.0/tasks`, ctx.key, {
			method: 'GET',
			query: {
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'startDate.gt': input['startDate.gt'],
				'startDate.eq': input['startDate.eq'],
				'startDate.lt': input['startDate.lt'],
				'startDate.ge': input['startDate.ge'],
				'startDate.le': input['startDate.le'],
				'dueDate.gt': input['dueDate.gt'],
				'dueDate.eq': input['dueDate.eq'],
				'dueDate.lt': input['dueDate.lt'],
				'dueDate.ge': input['dueDate.ge'],
				'dueDate.le': input['dueDate.le'],
				'startDateActual.gt': input['startDateActual.gt'],
				'startDateActual.eq': input['startDateActual.eq'],
				'startDateActual.lt': input['startDateActual.lt'],
				'startDateActual.ge': input['startDateActual.ge'],
				'startDateActual.le': input['startDateActual.le'],
				'dueDateActual.gt': input['dueDateActual.gt'],
				'dueDateActual.eq': input['dueDateActual.eq'],
				'dueDateActual.lt': input['dueDateActual.lt'],
				'dueDateActual.ge': input['dueDateActual.ge'],
				'dueDateActual.le': input['dueDateActual.le'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'updatedAt.gt': input['updatedAt.gt'],
				'updatedAt.eq': input['updatedAt.eq'],
				'updatedAt.lt': input['updatedAt.lt'],
				'updatedAt.ge': input['updatedAt.ge'],
				'updatedAt.le': input['updatedAt.le'],
				'projectId.eq': input['projectId.eq'],
				'phaseId.eq': input['phaseId.eq'],
				'taskName.eq': input['taskName.eq'],
				'taskName.cn': input['taskName.cn'],
				'taskName.nc': input['taskName.nc'],
				'effortInMinutes.eq': input['effortInMinutes.eq'],
				'effortInMinutes.gt': input['effortInMinutes.gt'],
				'effortInMinutes.lt': input['effortInMinutes.lt'],
				'progress.eq': input['progress.eq'],
				'progress.gt': input['progress.gt'],
				'progress.lt': input['progress.lt'],
				'includeArchive.eq': input['includeArchive.eq'],
				'task.status.eq': input['task.status.eq'],
				'task.status.oneOf': input['task.status.oneOf'],
				'task.status.noneOf': input['task.status.noneOf'],
				'project.status.eq': input['project.status.eq'],
				'project.status.oneOf': input['project.status.oneOf'],
				'project.status.noneOf': input['project.status.noneOf'],
				'externalReferenceId.eq': input['externalReferenceId.eq'],
				'assignee.userId.eq': input['assignee.userId.eq'],
				'assignee.userId.oneOf': input['assignee.userId.oneOf'],
				'assignee.userId.noneOf': input['assignee.userId.noneOf'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.tasks.getAllTasks',
		input,
		'completed',
	);
	return response;
};

export const createTask: RocketlaneEndpoints['createTask'] = async (
	ctx,
	input,
) => {
	input = In.createTask.parse(input);
	const response = Out.createTask.parse(
		await makeRocketlaneRequest(`1.0/tasks`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.tasks.createTask',
		input,
		'completed',
	);
	return response;
};

export const getCustomRevenueRecognitionConfig: RocketlaneEndpoints['getCustomRevenueRecognitionConfig'] =
	async (ctx, input) => {
		input = In.getCustomRevenueRecognitionConfig.parse(input);
		const response = Out.getCustomRevenueRecognitionConfig.parse(
			await makeRocketlaneRequest(
				`1.0/custom-revenue-recognition-configs/${encodeURIComponent(String(input.customRevenueRecognitionConfigId))}`,
				ctx.key,
				{ method: 'GET', query: {} },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.custom_revenue_recognition_configs.getCustomRevenueRecognitionConfig',
			input,
			'completed',
		);
		return response;
	};

export const getAllCustomRevenueRecognitionConfigs: RocketlaneEndpoints['getAllCustomRevenueRecognitionConfigs'] =
	async (ctx, input) => {
		input = In.getAllCustomRevenueRecognitionConfigs.parse(input);
		const response = Out.getAllCustomRevenueRecognitionConfigs.parse(
			await makeRocketlaneRequest(
				`1.0/custom-revenue-recognition-configs`,
				ctx.key,
				{
					method: 'GET',
					query: {
						pageSize: input['pageSize'],
						pageToken: input['pageToken'],
						sortBy: input['sortBy'],
						sortOrder: input['sortOrder'],
						match: input['match'],
						'customRevenueRecognitionConfigName.eq':
							input['customRevenueRecognitionConfigName.eq'],
						'customRevenueRecognitionConfigName.cn':
							input['customRevenueRecognitionConfigName.cn'],
						'customRevenueRecognitionConfigName.nc':
							input['customRevenueRecognitionConfigName.nc'],
						'billingType.eq': input['billingType.eq'],
						'billingType.oneOf': input['billingType.oneOf'],
						'billingType.noneOf': input['billingType.noneOf'],
					},
				},
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.custom_revenue_recognition_configs.getAllCustomRevenueRecognitionConfigs',
			input,
			'completed',
		);
		return response;
	};

export const getProject: RocketlaneEndpoints['getProject'] = async (
	ctx,
	input,
) => {
	input = In.getProject.parse(input);
	const response = Out.getProject.parse(
		await makeRocketlaneRequest(
			`1.0/projects/${encodeURIComponent(String(input.projectId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.getProject',
		input,
		'completed',
	);
	return response;
};

export const updateProject: RocketlaneEndpoints['updateProject'] = async (
	ctx,
	input,
) => {
	input = In.updateProject.parse(input);
	const response = Out.updateProject.parse(
		await makeRocketlaneRequest(
			`1.0/projects/${encodeURIComponent(String(input.projectId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.updateProject',
		input,
		'completed',
	);
	return response;
};

export const deleteProject: RocketlaneEndpoints['deleteProject'] = async (
	ctx,
	input,
) => {
	input = In.deleteProject.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/projects/${encodeURIComponent(String(input.projectId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.deleteProject',
		input,
		'completed',
	);
	return response;
};

export const unassignPlaceholders: RocketlaneEndpoints['unassignPlaceholders'] =
	async (ctx, input) => {
		input = In.unassignPlaceholders.parse(input);
		const response = Out.unassignPlaceholders.parse(
			await makeRocketlaneRequest(
				`1.0/projects/${encodeURIComponent(String(input.projectId))}/unassign-placeholders`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.projects.unassignPlaceholders',
			input,
			'completed',
		);
		return response;
	};

export const removeMembers: RocketlaneEndpoints['removeMembers'] = async (
	ctx,
	input,
) => {
	input = In.removeMembers.parse(input);
	const response = Out.removeMembers.parse(
		await makeRocketlaneRequest(
			`1.0/projects/${encodeURIComponent(String(input.projectId))}/remove-members`,
			ctx.key,
			{ method: 'POST', query: {}, body: input.body },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.removeMembers',
		input,
		'completed',
	);
	return response;
};

export const importTemplate: RocketlaneEndpoints['importTemplate'] = async (
	ctx,
	input,
) => {
	input = In.importTemplate.parse(input);
	const response = Out.importTemplate.parse(
		await makeRocketlaneRequest(
			`1.0/projects/${encodeURIComponent(String(input.projectId))}/import-template`,
			ctx.key,
			{ method: 'POST', query: {}, body: input.body },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.importTemplate',
		input,
		'completed',
	);
	return response;
};

export const assignPlaceholders: RocketlaneEndpoints['assignPlaceholders'] =
	async (ctx, input) => {
		input = In.assignPlaceholders.parse(input);
		const response = Out.assignPlaceholders.parse(
			await makeRocketlaneRequest(
				`1.0/projects/${encodeURIComponent(String(input.projectId))}/assign-placeholders`,
				ctx.key,
				{ method: 'POST', query: {}, body: input.body },
			),
		);
		await logEventFromContext(
			ctx,
			'rocketlane.projects.assignPlaceholders',
			input,
			'completed',
		);
		return response;
	};

export const archiveProject: RocketlaneEndpoints['archiveProject'] = async (
	ctx,
	input,
) => {
	input = In.archiveProject.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/projects/${encodeURIComponent(String(input.projectId))}/archive`,
		ctx.key,
		{ method: 'POST', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.archiveProject',
		input,
		'completed',
	);
	return response;
};

export const addMembers: RocketlaneEndpoints['addMembers'] = async (
	ctx,
	input,
) => {
	input = In.addMembers.parse(input);
	const response = Out.addMembers.parse(
		await makeRocketlaneRequest(
			`1.0/projects/${encodeURIComponent(String(input.projectId))}/add-members`,
			ctx.key,
			{ method: 'POST', query: {}, body: input.body },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.addMembers',
		input,
		'completed',
	);
	return response;
};

export const getAllProjects: RocketlaneEndpoints['getAllProjects'] = async (
	ctx,
	input,
) => {
	input = In.getAllProjects.parse(input);
	const response = Out.getAllProjects.parse(
		await makeRocketlaneRequest(`1.0/projects`, ctx.key, {
			method: 'GET',
			query: {
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'startDate.gt': input['startDate.gt'],
				'startDate.eq': input['startDate.eq'],
				'startDate.lt': input['startDate.lt'],
				'startDate.ge': input['startDate.ge'],
				'startDate.le': input['startDate.le'],
				'dueDate.gt': input['dueDate.gt'],
				'dueDate.eq': input['dueDate.eq'],
				'dueDate.lt': input['dueDate.lt'],
				'dueDate.ge': input['dueDate.ge'],
				'dueDate.le': input['dueDate.le'],
				'startDateActual.gt': input['startDateActual.gt'],
				'startDateActual.eq': input['startDateActual.eq'],
				'startDateActual.lt': input['startDateActual.lt'],
				'startDateActual.ge': input['startDateActual.ge'],
				'startDateActual.le': input['startDateActual.le'],
				'dueDateActual.gt': input['dueDateActual.gt'],
				'dueDateActual.eq': input['dueDateActual.eq'],
				'dueDateActual.lt': input['dueDateActual.lt'],
				'dueDateActual.ge': input['dueDateActual.ge'],
				'dueDateActual.le': input['dueDateActual.le'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'updatedAt.gt': input['updatedAt.gt'],
				'updatedAt.eq': input['updatedAt.eq'],
				'updatedAt.lt': input['updatedAt.lt'],
				'updatedAt.ge': input['updatedAt.ge'],
				'updatedAt.le': input['updatedAt.le'],
				'annualizedRecurringRevenue.eq': input['annualizedRecurringRevenue.eq'],
				'annualizedRecurringRevenue.gt': input['annualizedRecurringRevenue.gt'],
				'annualizedRecurringRevenue.lt': input['annualizedRecurringRevenue.lt'],
				'projectFee.eq': input['projectFee.eq'],
				'projectFee.gt': input['projectFee.gt'],
				'projectFee.lt': input['projectFee.lt'],
				'customerId.eq': input['customerId.eq'],
				'customerId.oneOf': input['customerId.oneOf'],
				'customerId.noneOf': input['customerId.noneOf'],
				'teamMemberId.eq': input['teamMemberId.eq'],
				'teamMemberId.oneOf': input['teamMemberId.oneOf'],
				'teamMemberId.noneOf': input['teamMemberId.noneOf'],
				'companyId.eq': input['companyId.eq'],
				'companyId.oneOf': input['companyId.oneOf'],
				'companyId.noneOf': input['companyId.noneOf'],
				'projectName.eq': input['projectName.eq'],
				'projectName.cn': input['projectName.cn'],
				'projectName.nc': input['projectName.nc'],
				'inferredProgress.eq': input['inferredProgress.eq'],
				'contractType.eq': input['contractType.eq'],
				'contractType.oneOf': input['contractType.oneOf'],
				'contractType.noneOf': input['contractType.noneOf'],
				'budgetedHours.gt': input['budgetedHours.gt'],
				'budgetedHours.eq': input['budgetedHours.eq'],
				'budgetedHours.lt': input['budgetedHours.lt'],
				'budgetedHours.ge': input['budgetedHours.ge'],
				'allocatedHours.le': input['allocatedHours.le'],
				'allocatedHours.gt': input['allocatedHours.gt'],
				'allocatedHours.eq': input['allocatedHours.eq'],
				'allocatedHours.lt': input['allocatedHours.lt'],
				'allocatedHours.ge': input['allocatedHours.ge'],
				'customersInvited.gt': input['customersInvited.gt'],
				'customersInvited.eq': input['customersInvited.eq'],
				'customersInvited.lt': input['customersInvited.lt'],
				'customersInvited.ge': input['customersInvited.ge'],
				'customersInvited.le': input['customersInvited.le'],
				'customersJoined.gt': input['customersJoined.gt'],
				'customersJoined.eq': input['customersJoined.eq'],
				'customersJoined.lt': input['customersJoined.lt'],
				'customersJoined.ge': input['customersJoined.ge'],
				'customersJoined.le': input['customersJoined.le'],
				'includeArchive.eq': input['includeArchive.eq'],
				'status.eq': input['status.eq'],
				'status.oneOf': input['status.oneOf'],
				'status.noneOf': input['status.noneOf'],
				'externalReferenceId.eq': input['externalReferenceId.eq'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.getAllProjects',
		input,
		'completed',
	);
	return response;
};

export const createProject: RocketlaneEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	input = In.createProject.parse(input);
	const response = Out.createProject.parse(
		await makeRocketlaneRequest(`1.0/projects`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.createProject',
		input,
		'completed',
	);
	return response;
};

export const getPlaceholders: RocketlaneEndpoints['getPlaceholders'] = async (
	ctx,
	input,
) => {
	input = In.getPlaceholders.parse(input);
	const response = Out.getPlaceholders.parse(
		await makeRocketlaneRequest(
			`1.0/projects/${encodeURIComponent(String(input.projectId))}/get-placeholders`,
			ctx.key,
			{
				method: 'POST',
				query: { limit: input.limit, pageToken: input.pageToken },
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.projects.getPlaceholders',
		input,
		'completed',
	);
	return response;
};

export const getPhase: RocketlaneEndpoints['getPhase'] = async (ctx, input) => {
	input = In.getPhase.parse(input);
	const response = Out.getPhase.parse(
		await makeRocketlaneRequest(
			`1.0/phases/${encodeURIComponent(String(input.phaseId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.phases.getPhase',
		input,
		'completed',
	);
	return response;
};

export const updatePhase: RocketlaneEndpoints['updatePhase'] = async (
	ctx,
	input,
) => {
	input = In.updatePhase.parse(input);
	const response = Out.updatePhase.parse(
		await makeRocketlaneRequest(
			`1.0/phases/${encodeURIComponent(String(input.phaseId))}`,
			ctx.key,
			{
				method: 'PUT',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
				body: input.body,
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.phases.updatePhase',
		input,
		'completed',
	);
	return response;
};

export const deletePhase: RocketlaneEndpoints['deletePhase'] = async (
	ctx,
	input,
) => {
	input = In.deletePhase.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/phases/${encodeURIComponent(String(input.phaseId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.phases.deletePhase',
		input,
		'completed',
	);
	return response;
};

export const getAllPhases: RocketlaneEndpoints['getAllPhases'] = async (
	ctx,
	input,
) => {
	input = In.getAllPhases.parse(input);
	const response = Out.getAllPhases.parse(
		await makeRocketlaneRequest(`1.0/phases`, ctx.key, {
			method: 'GET',
			query: {
				projectId: input['projectId'],
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'startDate.gt': input['startDate.gt'],
				'startDate.eq': input['startDate.eq'],
				'startDate.lt': input['startDate.lt'],
				'startDate.ge': input['startDate.ge'],
				'startDate.le': input['startDate.le'],
				'dueDate.gt': input['dueDate.gt'],
				'dueDate.eq': input['dueDate.eq'],
				'dueDate.lt': input['dueDate.lt'],
				'dueDate.ge': input['dueDate.ge'],
				'dueDate.le': input['dueDate.le'],
				'startDateActual.gt': input['startDateActual.gt'],
				'startDateActual.eq': input['startDateActual.eq'],
				'startDateActual.lt': input['startDateActual.lt'],
				'startDateActual.ge': input['startDateActual.ge'],
				'startDateActual.le': input['startDateActual.le'],
				'dueDateActual.gt': input['dueDateActual.gt'],
				'dueDateActual.eq': input['dueDateActual.eq'],
				'dueDateActual.lt': input['dueDateActual.lt'],
				'dueDateActual.ge': input['dueDateActual.ge'],
				'dueDateActual.le': input['dueDateActual.le'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'updatedAt.gt': input['updatedAt.gt'],
				'updatedAt.eq': input['updatedAt.eq'],
				'updatedAt.lt': input['updatedAt.lt'],
				'updatedAt.ge': input['updatedAt.ge'],
				'updatedAt.le': input['updatedAt.le'],
				'phaseName.eq': input['phaseName.eq'],
				'phaseName.cn': input['phaseName.cn'],
				'phaseName.nc': input['phaseName.nc'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.phases.getAllPhases',
		input,
		'completed',
	);
	return response;
};

export const createPhase: RocketlaneEndpoints['createPhase'] = async (
	ctx,
	input,
) => {
	input = In.createPhase.parse(input);
	const response = Out.createPhase.parse(
		await makeRocketlaneRequest(`1.0/phases`, ctx.key, {
			method: 'POST',
			query: {
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
			},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.phases.createPhase',
		input,
		'completed',
	);
	return response;
};

export const getUser: RocketlaneEndpoints['getUser'] = async (ctx, input) => {
	input = In.getUser.parse(input);
	const response = Out.getUser.parse(
		await makeRocketlaneRequest(
			`1.0/users/${encodeURIComponent(String(input.userId))}`,
			ctx.key,
			{
				method: 'GET',
				query: {
					includeFields: input['includeFields'],
					includeAllFields: input['includeAllFields'],
				},
			},
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.users.getUser',
		input,
		'completed',
	);
	return response;
};

export const getAllUsers: RocketlaneEndpoints['getAllUsers'] = async (
	ctx,
	input,
) => {
	input = In.getAllUsers.parse(input);
	const response = Out.getAllUsers.parse(
		await makeRocketlaneRequest(`1.0/users`, ctx.key, {
			method: 'GET',
			query: {
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				includeFields: input['includeFields'],
				includeAllFields: input['includeAllFields'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'firstName.eq': input['firstName.eq'],
				'firstName.cn': input['firstName.cn'],
				'firstName.nc': input['firstName.nc'],
				'lastName.eq': input['lastName.eq'],
				'lastName.cn': input['lastName.cn'],
				'lastName.nc': input['lastName.nc'],
				'email.eq': input['email.eq'],
				'email.cn': input['email.cn'],
				'email.nc': input['email.nc'],
				'status.eq': input['status.eq'],
				'status.oneOf': input['status.oneOf'],
				'status.noneOf': input['status.noneOf'],
				'type.eq': input['type.eq'],
				'type.oneOf': input['type.oneOf'],
				'roleId.eq': input['roleId.eq'],
				'roleId.oneOf': input['roleId.oneOf'],
				'roleId.noneOf': input['roleId.noneOf'],
				'permissionId.eq': input['permissionId.eq'],
				'permissionId.oneOf': input['permissionId.oneOf'],
				'permissionId.noneOf': input['permissionId.noneOf'],
				'capacityInMinutes.eq': input['capacityInMinutes.eq'],
				'capacityInMinutes.gt': input['capacityInMinutes.gt'],
				'capacityInMinutes.ge': input['capacityInMinutes.ge'],
				'capacityInMinutes.lt': input['capacityInMinutes.lt'],
				'capacityInMinutes.le': input['capacityInMinutes.le'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'updatedAt.gt': input['updatedAt.gt'],
				'updatedAt.eq': input['updatedAt.eq'],
				'updatedAt.lt': input['updatedAt.lt'],
				'updatedAt.ge': input['updatedAt.ge'],
				'updatedAt.le': input['updatedAt.le'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.users.getAllUsers',
		input,
		'completed',
	);
	return response;
};

export const getSpace: RocketlaneEndpoints['getSpace'] = async (ctx, input) => {
	input = In.getSpace.parse(input);
	const response = Out.getSpace.parse(
		await makeRocketlaneRequest(
			`1.0/spaces/${encodeURIComponent(String(input.spaceId))}`,
			ctx.key,
			{ method: 'GET', query: {} },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.spaces.getSpace',
		input,
		'completed',
	);
	return response;
};

export const updateSpace: RocketlaneEndpoints['updateSpace'] = async (
	ctx,
	input,
) => {
	input = In.updateSpace.parse(input);
	const response = Out.updateSpace.parse(
		await makeRocketlaneRequest(
			`1.0/spaces/${encodeURIComponent(String(input.spaceId))}`,
			ctx.key,
			{ method: 'PUT', query: {}, body: input.body },
		),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.spaces.updateSpace',
		input,
		'completed',
	);
	return response;
};

export const deleteSpace: RocketlaneEndpoints['deleteSpace'] = async (
	ctx,
	input,
) => {
	input = In.deleteSpace.parse(input);
	const response = undefined;
	await makeRocketlaneRequest(
		`1.0/spaces/${encodeURIComponent(String(input.spaceId))}`,
		ctx.key,
		{ method: 'DELETE', query: {} },
	);
	await logEventFromContext(
		ctx,
		'rocketlane.spaces.deleteSpace',
		input,
		'completed',
	);
	return response;
};

export const getAllSpaces: RocketlaneEndpoints['getAllSpaces'] = async (
	ctx,
	input,
) => {
	input = In.getAllSpaces.parse(input);
	const response = Out.getAllSpaces.parse(
		await makeRocketlaneRequest(`1.0/spaces`, ctx.key, {
			method: 'GET',
			query: {
				projectId: input['projectId'],
				pageSize: input['pageSize'],
				pageToken: input['pageToken'],
				sortBy: input['sortBy'],
				sortOrder: input['sortOrder'],
				match: input['match'],
				'spaceName.eq': input['spaceName.eq'],
				'spaceName.cn': input['spaceName.cn'],
				'spaceName.nc': input['spaceName.nc'],
				'createdAt.gt': input['createdAt.gt'],
				'createdAt.eq': input['createdAt.eq'],
				'createdAt.lt': input['createdAt.lt'],
				'createdAt.ge': input['createdAt.ge'],
				'createdAt.le': input['createdAt.le'],
				'updatedAt.gt': input['updatedAt.gt'],
				'updatedAt.eq': input['updatedAt.eq'],
				'updatedAt.lt': input['updatedAt.lt'],
				'updatedAt.ge': input['updatedAt.ge'],
				'updatedAt.le': input['updatedAt.le'],
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.spaces.getAllSpaces',
		input,
		'completed',
	);
	return response;
};

export const createSpace: RocketlaneEndpoints['createSpace'] = async (
	ctx,
	input,
) => {
	input = In.createSpace.parse(input);
	const response = Out.createSpace.parse(
		await makeRocketlaneRequest(`1.0/spaces`, ctx.key, {
			method: 'POST',
			query: {},
			body: input.body,
		}),
	);
	await logEventFromContext(
		ctx,
		'rocketlane.spaces.createSpace',
		input,
		'completed',
	);
	return response;
};
