import type { SignwellEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const list: SignwellEndpoints['bulkSendsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bulkSends.list',
			input: Inputs.bulkSendsList,
			output: Outputs.bulkSendsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/bulk_sends', query }),
		{
			log: (_, result) => ({
				count: result.bulk_sends.length,
				page: result.current_page,
			}),
		},
	);

export const get: SignwellEndpoints['bulkSendsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bulkSends.get',
			input: Inputs.bulkSendsGet,
			output: Outputs.bulkSendsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/v1/bulk_sends/${segment(id)}` }),
		{
			log: ({ id }, result) => ({
				bulkSendId: id,
				status: result.status,
			}),
		},
	);

export const getDocuments: SignwellEndpoints['bulkSendsGetDocuments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'bulkSends.getDocuments',
			input: Inputs.bulkSendsGetDocuments,
			output: Outputs.bulkSendsGetDocuments,
		},
		input,
		({ id, limit, page }) => ({
			method: 'GET',
			path: `/v1/bulk_sends/${segment(id)}/documents`,
			query: { limit, page },
		}),
		{
			log: ({ id }, result) => ({
				bulkSendId: id,
				count: result.documents.length,
				page: result.current_page,
			}),
		},
	);

export const create: SignwellEndpoints['bulkSendsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bulkSends.create',
			input: Inputs.bulkSendsCreate,
			output: Outputs.bulkSendsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/bulk_sends', body }),
		{
			log: (parsed, result) => ({
				bulkSendId: result.id,
				status: result.status ?? undefined,
				templates: parsed.template_ids.length,
			}),
		},
	);

export const getCsvTemplate: SignwellEndpoints['bulkSendsGetCsvTemplate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'bulkSends.getCsvTemplate',
			input: Inputs.bulkSendsGetCsvTemplate,
			output: Outputs.bulkSendsGetCsvTemplate,
		},
		input,
		({ template_ids }) => ({
			method: 'GET',
			path: '/v1/bulk_sends/csv_template',
			// SignWell reads the ids as repeated `template_ids[]` parameters, not
			// as one comma-separated value, which is what an array becomes here.
			query: { 'template_ids[]': template_ids },
		}),
		{
			log: ({ template_ids }, result) => ({
				templates: template_ids.length,
				bytes: result.data.length,
			}),
		},
	);

export const validateCsv: SignwellEndpoints['bulkSendsValidateCsv'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'bulkSends.validateCsv',
			input: Inputs.bulkSendsValidateCsv,
			output: Outputs.bulkSendsValidateCsv,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/bulk_sends/validate_csv', body }),
		{
			log: (parsed) => ({ templates: parsed.template_ids.length }),
		},
	);
