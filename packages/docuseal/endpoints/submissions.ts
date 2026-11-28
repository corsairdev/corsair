import type { DocuSealEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DocuSealEndpointInputSchemas as Inputs,
	DocuSealEndpointOutputSchemas as Outputs,
} from './types';

export const list: DocuSealEndpoints['submissionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submissions.list',
			input: Inputs.submissionsList,
			output: Outputs.submissionsList,
		},
		input,
		({
			template_id,
			status,
			q,
			slug,
			template_folder,
			archived,
			limit,
			after,
			before,
		}) => ({
			method: 'GET',
			path: '/submissions',
			query: {
				template_id,
				status,
				q,
				slug,
				template_folder,
				archived,
				limit,
				after,
				before,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				next: result.pagination.next ?? undefined,
			}),
		},
	);

export const get: DocuSealEndpoints['submissionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submissions.get',
			input: Inputs.submissionsGet,
			output: Outputs.submissionsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/submissions/${segment(id)}` }),
		{ log: ({ id }) => ({ submissionId: id }) },
	);

export const create: DocuSealEndpoints['submissionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submissions.create',
			input: Inputs.submissionsCreate,
			output: Outputs.submissionsCreate,
		},
		input,
		({
			template_id,
			submitters,
			send_email,
			send_sms,
			order,
			completed_redirect_url,
			bcc_completed,
			reply_to,
			expire_at,
			variables,
			message,
		}) => ({
			method: 'POST',
			path: '/submissions',
			body: {
				template_id,
				submitters,
				send_email,
				send_sms,
				order,
				completed_redirect_url,
				bcc_completed,
				reply_to,
				expire_at,
				variables,
				message,
			},
		}),
		{
			log: ({ template_id }, result) => ({
				templateId: template_id,
				count: result.length,
			}),
		},
	);

export const createFromPdf: DocuSealEndpoints['submissionsCreateFromPdf'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'submissions.createFromPdf',
			input: Inputs.submissionsCreateFromPdf,
			output: Outputs.submissionsCreateFromPdf,
		},
		input,
		({
			name,
			send_email,
			send_sms,
			order,
			completed_redirect_url,
			bcc_completed,
			reply_to,
			expire_at,
			template_ids,
			documents,
			submitters,
			message,
			flatten,
			merge_documents,
			remove_tags,
		}) => ({
			method: 'POST',
			path: '/submissions/pdf',
			body: {
				name,
				send_email,
				send_sms,
				order,
				completed_redirect_url,
				bcc_completed,
				reply_to,
				expire_at,
				template_ids,
				documents,
				submitters,
				message,
				flatten,
				merge_documents,
				remove_tags,
			},
		}),
	);

export const createFromHtml: DocuSealEndpoints['submissionsCreateFromHtml'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'submissions.createFromHtml',
			input: Inputs.submissionsCreateFromHtml,
			output: Outputs.submissionsCreateFromHtml,
		},
		input,
		({
			name,
			send_email,
			send_sms,
			order,
			completed_redirect_url,
			bcc_completed,
			reply_to,
			expire_at,
			template_ids,
			documents,
			submitters,
			message,
			merge_documents,
		}) => ({
			method: 'POST',
			path: '/submissions/html',
			body: {
				name,
				send_email,
				send_sms,
				order,
				completed_redirect_url,
				bcc_completed,
				reply_to,
				expire_at,
				template_ids,
				documents,
				submitters,
				message,
				merge_documents,
			},
		}),
	);

export const createFromDocx: DocuSealEndpoints['submissionsCreateFromDocx'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'submissions.createFromDocx',
			input: Inputs.submissionsCreateFromDocx,
			output: Outputs.submissionsCreateFromDocx,
		},
		input,
		({
			name,
			send_email,
			send_sms,
			variables,
			order,
			completed_redirect_url,
			bcc_completed,
			reply_to,
			expire_at,
			template_ids,
			documents,
			submitters,
			message,
			merge_documents,
			remove_tags,
		}) => ({
			method: 'POST',
			path: '/submissions/docx',
			body: {
				name,
				send_email,
				send_sms,
				variables,
				order,
				completed_redirect_url,
				bcc_completed,
				reply_to,
				expire_at,
				template_ids,
				documents,
				submitters,
				message,
				merge_documents,
				remove_tags,
			},
		}),
	);

export const createFromEmails: DocuSealEndpoints['submissionsCreateFromEmails'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'submissions.createFromEmails',
				input: Inputs.submissionsCreateFromEmails,
				output: Outputs.submissionsCreateFromEmails,
			},
			input,
			({ template_id, emails, send_email, message }) => ({
				method: 'POST',
				path: '/submissions/emails',
				body: { template_id, emails, send_email, message },
			}),
			{
				log: ({ template_id }, result) => ({
					templateId: template_id,
					count: result.length,
				}),
			},
		);

export const update: DocuSealEndpoints['submissionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submissions.update',
			input: Inputs.submissionsUpdate,
			output: Outputs.submissionsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/submissions/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ submissionId: id }) },
	);

export const archive: DocuSealEndpoints['submissionsArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submissions.archive',
			input: Inputs.submissionsArchive,
			output: Outputs.submissionsArchive,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/submissions/${segment(id)}` }),
		{ log: ({ id }) => ({ submissionId: id }) },
	);

export const getDocuments: DocuSealEndpoints['submissionsGetDocuments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'submissions.getDocuments',
			input: Inputs.submissionsGetDocuments,
			output: Outputs.submissionsGetDocuments,
		},
		input,
		({ id, merge }) => ({
			method: 'GET',
			path: `/submissions/${segment(id)}/documents`,
			query: { merge },
		}),
		{
			log: ({ id }, result) => ({
				submissionId: id,
				count: result.documents.length,
			}),
		},
	);
