import type { ZohoDeskEndpoints } from '..';
import { zohoDeskCall, zohoDeskDownload } from './call';
import {
	ZohoDeskEndpointInputSchemas,
	ZohoDeskEndpointOutputSchemas,
} from './types';

function logoMediaType(fileName: string) {
	const extension = fileName.split('.').pop()?.toLowerCase();
	if (extension === 'png') return 'image/png';
	if (extension === 'gif') return 'image/gif';
	return 'image/jpeg';
}

export const list: ZohoDeskEndpoints['departmentsList'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.departments.list',
		input: ZohoDeskEndpointInputSchemas.departmentsList,
		output: ZohoDeskEndpointOutputSchemas.departmentsList,
		empty: { data: [] },
		toRequest: ({ from, limit, isEnabled, searchStr, chatStatus }) => ({
			path: '/departments',
			query: { from, limit, isEnabled, searchStr, chatStatus },
		}),
	});

export const get: ZohoDeskEndpoints['departmentsGet'] = (ctx, input) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.departments.get',
		input: ZohoDeskEndpointInputSchemas.departmentsGet,
		output: ZohoDeskEndpointOutputSchemas.departmentsGet,
		toRequest: ({ departmentId }) => ({ path: `/departments/${departmentId}` }),
	});

export const getCount: ZohoDeskEndpoints['departmentsGetCount'] = (
	ctx,
	input,
) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.departments.getCount',
		input: ZohoDeskEndpointInputSchemas.departmentsGetCount,
		output: ZohoDeskEndpointOutputSchemas.departmentsGetCount,
		toRequest: ({ isEnabled }) => ({
			path: '/departments/count',
			query: { isEnabled },
		}),
	});

export const listTeams: ZohoDeskEndpoints['departmentsListTeams'] = (
	ctx,
	input,
) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.departments.listTeams',
		input: ZohoDeskEndpointInputSchemas.departmentsListTeams,
		output: ZohoDeskEndpointOutputSchemas.departmentsListTeams,
		empty: { teams: [] },
		toRequest: ({ departmentId, from, limit, searchStr }) => ({
			path: `/departments/${departmentId}/teams`,
			query: { from, limit, searchStr },
		}),
	});

export const getLogo: ZohoDeskEndpoints['departmentsGetLogo'] = (ctx, input) =>
	zohoDeskDownload(ctx, input, {
		event: 'zohodesk.departments.getLogo',
		input: ZohoDeskEndpointInputSchemas.departmentsGetLogo,
		output: ZohoDeskEndpointOutputSchemas.departmentsGetLogo,
		toRequest: ({ departmentId, fileSize }) => ({
			path: `/departments/${departmentId}/logo`,
			query: { fileSize },
		}),
	});

export const uploadLogo: ZohoDeskEndpoints['departmentsUploadLogo'] = (
	ctx,
	input,
) =>
	zohoDeskCall(ctx, input, {
		event: 'zohodesk.departments.uploadLogo',
		input: ZohoDeskEndpointInputSchemas.departmentsUploadLogo,
		output: ZohoDeskEndpointOutputSchemas.departmentsUploadLogo,
		empty: {},
		toRequest: ({ departmentId, fileName, contentBase64 }) => ({
			method: 'POST',
			path: `/departments/${departmentId}/logo`,
			formData: {
				departmentLogo: new File(
					[Buffer.from(contentBase64, 'base64')],
					fileName,
					{ type: logoMediaType(fileName) },
				),
			},
		}),
		// Keeps the image bytes out of the event log.
		logFields: ({ departmentId, fileName }) => ({ departmentId, fileName }),
	});
