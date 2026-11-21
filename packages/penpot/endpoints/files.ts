import type { PenpotEndpoints } from '..';
import { call, shapeDeleted } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

export const get: PenpotEndpoints['filesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.get',
			input: Inputs.filesGet,
			output: Outputs.filesGet,
		},
		input,
		() => 'get-file',
		{
			body: ({ id }) => ({ id }),
			log: (_, file) => ({ fileId: file.id ?? undefined }),
		},
	);

export const create: PenpotEndpoints['filesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.create',
			input: Inputs.filesCreate,
			output: Outputs.filesCreate,
		},
		input,
		() => 'create-file',
		{
			body: (input) => input,
			log: (_, file) => ({ fileId: file.id ?? undefined }),
		},
	);

export const remove: PenpotEndpoints['filesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.delete',
			input: Inputs.filesDelete,
			output: Outputs.filesDelete,
		},
		input,
		() => 'delete-file',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ fileId: result.id }),
		},
	);

export const duplicate: PenpotEndpoints['filesDuplicate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.duplicate',
			input: Inputs.filesDuplicate,
			output: Outputs.filesDuplicate,
		},
		input,
		() => 'duplicate-file',
		{
			body: (input) => input,
			log: (_, file) => ({ fileId: file.id ?? undefined }),
		},
	);

export const rename: PenpotEndpoints['filesRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.rename',
			input: Inputs.filesRename,
			output: Outputs.filesRename,
		},
		input,
		() => 'rename-file',
		{
			body: (input) => input,
			log: (_, file) => ({ fileId: file.id ?? undefined }),
		},
	);

export const snapshotsList: PenpotEndpoints['filesSnapshotsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.snapshotsList',
			input: Inputs.filesSnapshotsList,
			output: Outputs.filesSnapshotsList,
		},
		input,
		() => 'get-file-snapshots',
		{
			body: ({ fileId }) => ({ fileId }),
			log: (_, snapshots) => ({ count: snapshots.length }),
		},
	);

export const snapshotsCreate: PenpotEndpoints['filesSnapshotsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.snapshotsCreate',
			input: Inputs.filesSnapshotsCreate,
			output: Outputs.filesSnapshotsCreate,
		},
		input,
		() => 'create-file-snapshot',
		{
			body: (input) => input,
			log: (_, snapshot) => ({ snapshotId: snapshot.id ?? undefined }),
		},
	);

export const snapshotsDelete: PenpotEndpoints['filesSnapshotsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.snapshotsDelete',
			input: Inputs.filesSnapshotsDelete,
			output: Outputs.filesSnapshotsDelete,
		},
		input,
		() => 'delete-file-snapshot',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ snapshotId: result.id }),
		},
	);

export const shareLinkCreate: PenpotEndpoints['filesShareLinkCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.shareLinkCreate',
			input: Inputs.filesShareLinkCreate,
			output: Outputs.filesShareLinkCreate,
		},
		input,
		() => 'create-share-link',
		{
			// The RPC requires both audiences.
			body: ({ fileId, pages, whoComment, whoInspect }) => ({
				fileId,
				pages,
				whoComment: whoComment ?? 'team',
				whoInspect: whoInspect ?? 'team',
			}),
			log: (_, link) => ({ shareLinkId: link.id ?? undefined }),
		},
	);

export const shareLinkDelete: PenpotEndpoints['filesShareLinkDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.shareLinkDelete',
			input: Inputs.filesShareLinkDelete,
			output: Outputs.filesShareLinkDelete,
		},
		input,
		() => 'delete-share-link',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ shareLinkId: result.id }),
		},
	);
