import type { PasscreatorEndpoints } from '..';
import { call } from './call';
import {
	PasscreatorEndpointInputSchemas as Inputs,
	PasscreatorEndpointOutputSchemas as Outputs,
} from './types';

export const create: PasscreatorEndpoints['passesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.create',
			input: Inputs.passesCreate,
			output: Outputs.passesCreate,
		},
		input,
		({ passtemplate, properties }) => ({
			method: 'POST',
			path: '/api/pass',
			query: { passtemplate, zapierStyle: true },
			body: properties,
		}),
		{
			// unknown: the created pass object carries provider-defined fields
			// beyond the schema's anchors.
			shape: (raw) => raw as Record<string, unknown>,
			log: (_, pass) => ({
				passUid: pass.identifier ?? undefined,
			}),
		},
	);

export const list: PasscreatorEndpoints['passesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.list',
			input: Inputs.passesList,
			output: Outputs.passesList,
		},
		input,
		({ templateUid, ...query }) => ({
			method: 'GET',
			path: `/api/pass/list/${encodeURIComponent(templateUid)}`,
			query,
		}),
		{ log: (_, passes) => ({ count: passes.length }) },
	);

export const get: PasscreatorEndpoints['passesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.get',
			input: Inputs.passesGet,
			output: Outputs.passesGet,
		},
		input,
		({ passUid, includeFieldMapping, appConfigurationId }) => ({
			method: 'GET',
			path: `/api/pass/${encodeURIComponent(passUid)}`,
			query: { includeFieldMapping, appConfigurationId },
		}),
		{
			// unknown: the pass object carries provider-defined fields.
			shape: (raw) => raw as Record<string, unknown>,
			log: (_, pass) => ({ passUid: pass.identifier ?? undefined }),
		},
	);

export const update: PasscreatorEndpoints['passesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.update',
			input: Inputs.passesUpdate,
			output: Outputs.passesUpdate,
		},
		input,
		({ passUid, properties, voided }) => ({
			method: 'PUT',
			path: `/api/pass/${encodeURIComponent(passUid)}`,
			query: { zapierStyle: true },
			body: { ...properties, ...(voided === undefined ? {} : { voided }) },
		}),
		{
			// The API answers 204 with no body; anything else is a failure the
			// caller must see rather than a fabricated success.
			shape: (raw, { passUid }) => {
				if (raw !== undefined && raw !== null && raw !== '') {
					throw new Error(
						`Passcreator passes.update: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { passUid, success: true };
			},
			log: (_, result) => ({ passUid: result.passUid }),
		},
	);

export const remove: PasscreatorEndpoints['passesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.delete',
			input: Inputs.passesDelete,
			output: Outputs.passesDelete,
		},
		input,
		({ passUid }) => ({
			method: 'DELETE',
			path: `/api/pass/${encodeURIComponent(passUid)}`,
		}),
		{ log: ({ passUid }, result) => ({ passUid, success: result.success }) },
	);

export const search: PasscreatorEndpoints['passesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.search',
			input: Inputs.passesSearch,
			output: Outputs.passesSearch,
		},
		input,
		({ templateUid, searchTerm }) => ({
			method: 'GET',
			path: `/api/pass/search/${encodeURIComponent(templateUid)}/${encodeURIComponent(searchTerm)}`,
		}),
		{ log: (_, passes) => ({ count: passes.length }) },
	);

export const uris: PasscreatorEndpoints['passesUris'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'passes.uris',
			input: Inputs.passesUris,
			output: Outputs.passesUris,
		},
		input,
		({ passUid }) => ({
			method: 'GET',
			path: `/api/pass/geturis/${encodeURIComponent(passUid)}`,
		}),
		{ log: () => ({}) },
	);

export const statistics: PasscreatorEndpoints['passesStatistics'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'passes.statistics',
			input: Inputs.passesStatistics,
			output: Outputs.passesStatistics,
		},
		input,
		({ templateUid, timeFrame, day }) => ({
			method: 'GET',
			path: `/api/pass/statistics/${encodeURIComponent(templateUid)}`,
			query: { timeFrame, day },
		}),
		{ log: () => ({}) },
	);

export const activeHistory: PasscreatorEndpoints['passesActiveHistory'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'passes.activeHistory',
			input: Inputs.passesActiveHistory,
			output: Outputs.passesActiveHistory,
		},
		input,
		({ templateUid, day }) => ({
			method: 'GET',
			path: day
				? `/api/pass/statistics/${encodeURIComponent(templateUid)}/activehistory/${encodeURIComponent(day)}`
				: `/api/pass/statistics/${encodeURIComponent(templateUid)}/activehistory`,
		}),
		{ log: () => ({}) },
	);

export const enableDownload: PasscreatorEndpoints['passesEnableDownload'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'passes.enableDownload',
			input: Inputs.passesEnableDownload,
			output: Outputs.passesEnableDownload,
		},
		input,
		({ passUid }) => ({
			method: 'POST',
			path: `/api/pass/${encodeURIComponent(passUid)}/enabledownload`,
		}),
		{
			shape: (raw, { passUid }) => {
				if (raw !== undefined && raw !== null && raw !== '') {
					throw new Error(
						`Passcreator passes.enableDownload: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { passUid, success: true };
			},
			log: (_, result) => ({ passUid: result.passUid }),
		},
	);

export const pushNotification: PasscreatorEndpoints['passesPushNotification'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'passes.pushNotification',
				input: Inputs.passesPushNotification,
				output: Outputs.passesPushNotification,
			},
			input,
			({ passUid, message }) => ({
				method: 'POST',
				path: `/api/pass/${encodeURIComponent(passUid)}/sendpushnotification`,
				body: { message },
			}),
			{ log: (_, result) => ({ success: result.success }) },
		);

export const sendEmail: PasscreatorEndpoints['passesSendEmail'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'passes.sendEmail',
			input: Inputs.passesSendEmail,
			output: Outputs.passesSendEmail,
		},
		input,
		({ passUid, email }) => ({
			method: 'POST',
			path: `/api/pass/deliver/${encodeURIComponent(passUid)}/email/${encodeURIComponent(email)}`,
		}),
		{ log: (_, result) => ({ success: result.success }) },
	);
