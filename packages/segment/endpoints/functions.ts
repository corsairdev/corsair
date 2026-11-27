import type { SegmentContext, SegmentEndpoints } from '..';
import { paginationQuery, pathSegment } from '../client';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const list: SegmentEndpoints['functionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'functions.list',
			input: Inputs.functionsList,
			output: Outputs.functionsList,
		},
		input,
		({ resourceType, count, cursor }) => ({
			method: 'GET',
			path: '/functions',
			query: { resourceType, ...paginationQuery(count, cursor) },
		}),
		{ log: (_, result) => ({ count: result.data.functions.length }) },
	);

export const get: SegmentEndpoints['functionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'functions.get',
			input: Inputs.functionsGet,
			output: Outputs.functionsGet,
		},
		input,
		({ functionId }) => ({
			method: 'GET',
			path: `/functions/${pathSegment(functionId)}`,
		}),
		{ log: ({ functionId }, result) => ({ functionId, found: Boolean(result.data.function) }) },
	);

export const listVersions: SegmentEndpoints['functionsListVersions'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'functions.listVersions',
			input: Inputs.functionsListVersions,
			output: Outputs.functionsListVersions,
		},
		input,
		({ functionId, count, cursor }) => ({
			method: 'GET',
			path: `/functions/${pathSegment(functionId)}/versions`,
			query: paginationQuery(count, cursor),
		}),
		{ log: ({ functionId }, result) => ({ functionId, count: result.data.versions.length }) },
	);

export const getVersion: SegmentEndpoints['functionsGetVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'functions.getVersion',
			input: Inputs.functionsGetVersion,
			output: Outputs.functionsGetVersion,
		},
		input,
		({ functionId, versionId }) => ({
			method: 'GET',
			path: `/functions/${pathSegment(functionId)}/versions/${pathSegment(versionId)}`,
		}),
		{ log: ({ functionId, versionId }) => ({ functionId, versionId }) },
	);

export const create: SegmentEndpoints['functionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'functions.create',
			input: Inputs.functionsCreate,
			output: Outputs.functionsCreate,
		},
		input,
		({ code, displayName, resourceType, settings, logoUrl, description }) => ({
			method: 'POST',
			path: '/functions',
			body: { code, displayName, resourceType, settings, logoUrl, description },
		}),
		{ log: (_, result) => ({ functionId: result.data.function.id ?? '' }) },
	);

export const update: SegmentEndpoints['functionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'functions.update',
			input: Inputs.functionsUpdate,
			output: Outputs.functionsUpdate,
		},
		input,
		({ functionId, code, displayName, settings, logoUrl, description }) => ({
			method: 'PATCH',
			path: `/functions/${pathSegment(functionId)}`,
			body: { code, displayName, settings, logoUrl, description },
		}),
		{ log: ({ functionId }) => ({ functionId }) },
	);

// Deploys the latest saved code; takes no body.
export const deploy: SegmentEndpoints['functionsDeploy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'functions.deploy',
			input: Inputs.functionsDeploy,
			output: Outputs.functionsDeploy,
		},
		input,
		({ functionId }) => ({
			method: 'POST',
			path: `/functions/${pathSegment(functionId)}/deploy`,
		}),
		{ log: ({ functionId }) => ({ functionId }) },
	);

// POST to the versions collection restores the version named in the body.
export const restoreVersion: SegmentEndpoints['functionsRestoreVersion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'functions.restoreVersion',
			input: Inputs.functionsRestoreVersion,
			output: Outputs.functionsRestoreVersion,
		},
		input,
		({ functionId, versionId }) => ({
			method: 'POST',
			path: `/functions/${pathSegment(functionId)}/versions`,
			body: { versionId },
		}),
		{ log: ({ functionId, versionId }) => ({ functionId, versionId }) },
	);

export const remove: SegmentEndpoints['functionsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'functions.delete',
			input: Inputs.functionsDelete,
			output: Outputs.functionsDelete,
		},
		input,
		({ functionId }) => ({
			method: 'DELETE',
			path: `/functions/${pathSegment(functionId)}`,
		}),
		{ log: ({ functionId }) => ({ functionId }) },
	);
