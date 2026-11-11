import type { z } from 'zod';
import type { ImageKitContext, ImageKitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ImageKitEndpointInputSchemas as Inputs,
	ImageKitEndpointOutputSchemas as Outputs,
} from './types';

export const upload: ImageKitEndpoints['filesUpload'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.upload',
			input: Inputs.filesUpload,
			output: Outputs.filesUpload,
		},
		input,
		({
			file,
			fileName,
			folder,
			tags,
			isPrivateFile,
			isPublished,
			useUniqueFileName,
			overwriteFile,
			overwriteTags,
			overwriteAITags,
			overwriteCustomMetadata,
			customMetadata,
			description,
		}) => ({
			method: 'POST',
			// Upload lives on upload.imagekit.io under /api/v1; everything else
			// is on api.imagekit.io under /v1.
			path: '/api/v1/files/upload',
			uploadOrigin: true,
			formData: {
				file,
				fileName,
				...(folder ? { folder } : {}),
				// ImageKit takes tags as one comma-separated multipart field.
				...(tags ? { tags: tags.join(',') } : {}),
				...(isPrivateFile !== undefined
					? { isPrivateFile: String(isPrivateFile) }
					: {}),
				...(isPublished !== undefined
					? { isPublished: String(isPublished) }
					: {}),
				...(useUniqueFileName !== undefined
					? { useUniqueFileName: String(useUniqueFileName) }
					: {}),
				...(overwriteFile !== undefined
					? { overwriteFile: String(overwriteFile) }
					: {}),
				...(overwriteTags !== undefined
					? { overwriteTags: String(overwriteTags) }
					: {}),
				...(overwriteAITags !== undefined
					? { overwriteAITags: String(overwriteAITags) }
					: {}),
				...(overwriteCustomMetadata !== undefined
					? { overwriteCustomMetadata: String(overwriteCustomMetadata) }
					: {}),
				...(customMetadata
					? { customMetadata: JSON.stringify(customMetadata) }
					: {}),
				...(description ? { description } : {}),
			},
		}),
		{
			log: (parsed, result) => ({
				fileId: result.fileId,
				fileName: parsed.fileName,
				folder: parsed.folder,
			}),
		},
	);

export const list: ImageKitEndpoints['filesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.list',
			input: Inputs.filesList,
			output: Outputs.filesList,
		},
		input,
		({ type, path, searchQuery, fileType, sort, limit, skip }) => ({
			method: 'GET',
			path: '/v1/files',
			query: { type, path, searchQuery, fileType, sort, limit, skip },
			replaySafe: true,
		}),
		{
			// The list is a bare array; a 200 with a missing or truncated
			// body must fail loudly, not parse as an empty page.
			log: (_, result) => ({ count: result.length }),
		},
	);

export const getDetails: ImageKitEndpoints['filesGetDetails'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.getDetails',
			input: Inputs.filesGetDetails,
			output: Outputs.filesGetDetails,
		},
		input,
		({ fileId }) => ({
			method: 'GET',
			path: `/v1/files/${segment(fileId)}/details`,
			replaySafe: true,
		}),
	);

export const updateDetails: ImageKitEndpoints['filesUpdateDetails'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'files.updateDetails',
			input: Inputs.filesUpdateDetails,
			output: Outputs.filesUpdateDetails,
		},
		input,
		({
			fileId,
			tags,
			customCoordinates,
			customMetadata,
			description,
			removeAITags,
			isPublished,
		}) => ({
			method: 'PATCH',
			path: `/v1/files/${segment(fileId)}/details`,
			// ImageKit's update body is a oneOf: publication status is the
			// nested `publish` object and cannot mix with the detail fields.
			body: {
				...(tags !== undefined ? { tags } : {}),
				...(customCoordinates !== undefined ? { customCoordinates } : {}),
				...(customMetadata !== undefined ? { customMetadata } : {}),
				...(description !== undefined ? { description } : {}),
				...(removeAITags !== undefined ? { removeAITags } : {}),
				...(isPublished !== undefined ? { publish: { isPublished } } : {}),
			},
		}),
	);

export const remove: ImageKitEndpoints['filesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.delete',
			input: Inputs.filesDelete,
			output: Outputs.filesDelete,
		},
		input,
		({ fileId }) => ({
			method: 'DELETE',
			path: `/v1/files/${segment(fileId)}`,
		}),
		{
			// 204 has no body.
			shape: (raw) => raw ?? {},
			log: ({ fileId }) => ({ fileId }),
		},
	);

export const bulkDelete: ImageKitEndpoints['filesBulkDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.bulkDelete',
			input: Inputs.filesBulkDelete,
			output: Outputs.filesBulkDelete,
		},
		input,
		({ fileIds }) => ({
			method: 'POST',
			path: '/v1/files/batch/deleteByFileIds',
			body: { fileIds },
		}),
		{
			// 200 and 207 share the { successfullyDeletedFileIds, errors } shape.
			log: (parsed, result) => ({
				requested: parsed.fileIds.length,
				deleted: result.successfullyDeletedFileIds.length,
				failed: result.errors?.length ?? 0,
			}),
		},
	);

export const copy: ImageKitEndpoints['filesCopy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.copy',
			input: Inputs.filesCopy,
			output: Outputs.filesCopy,
		},
		input,
		({ sourceFilePath, destinationPath, includeFileVersions }) => ({
			method: 'POST',
			path: '/v1/files/copy',
			body: { sourceFilePath, destinationPath, includeFileVersions },
		}),
		{
			// 204 carries an empty-object body; an empty answer is fine too.
			shape: (raw) => raw ?? {},
			log: ({ sourceFilePath, destinationPath }) => ({
				sourceFilePath,
				destinationPath,
			}),
		},
	);

export const move: ImageKitEndpoints['filesMove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.move',
			input: Inputs.filesMove,
			output: Outputs.filesMove,
		},
		input,
		({ sourceFilePath, destinationPath }) => ({
			method: 'POST',
			path: '/v1/files/move',
			body: { sourceFilePath, destinationPath },
		}),
		{
			shape: (raw) => raw ?? {},
			log: ({ sourceFilePath, destinationPath }) => ({
				sourceFilePath,
				destinationPath,
			}),
		},
	);

export const rename: ImageKitEndpoints['filesRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'files.rename',
			input: Inputs.filesRename,
			output: Outputs.filesRename,
		},
		input,
		({ filePath, newFileName, purgeCache }) => ({
			method: 'PUT',
			path: '/v1/files/rename',
			body: { filePath, newFileName, purgeCache },
		}),
		{
			log: ({ filePath, newFileName }, result) => ({
				filePath,
				newFileName,
				purgeRequestId: result.purgeRequestId ?? undefined,
			}),
		},
	);

// addTags, removeTags and removeAITags share one request and answer shape;
// only the endpoint path and the tag field name differ.
function bulkTags<Input extends z.ZodType>(
	ctx: ImageKitContext,
	operation: { event: string; path: string; input: Input },
	// unknown: raw caller input, parsed by call().
	input: unknown,
	toBody: (parsed: z.output<Input>) => Record<string, unknown>,
) {
	return call(
		ctx,
		{
			event: operation.event,
			input: operation.input,
			output: Outputs.filesAddTags,
		},
		input,
		(parsed: z.output<Input>) => ({
			method: 'POST',
			path: operation.path,
			body: toBody(parsed),
		}),
		{
			log: (_, result) => ({
				updated: result.successfullyUpdatedFileIds.length,
				failed: result.errors?.length ?? 0,
			}),
		},
	);
}

export const addTags: ImageKitEndpoints['filesAddTags'] = (ctx, input) =>
	bulkTags(
		ctx,
		{
			event: 'files.addTags',
			path: '/v1/files/addTags',
			input: Inputs.filesAddTags,
		},
		input,
		({ fileIds, tags }) => ({ fileIds, tags }),
	);

export const removeTags: ImageKitEndpoints['filesRemoveTags'] = (ctx, input) =>
	bulkTags(
		ctx,
		{
			event: 'files.removeTags',
			path: '/v1/files/removeTags',
			input: Inputs.filesRemoveTags,
		},
		input,
		({ fileIds, tags }) => ({ fileIds, tags }),
	);

export const removeAITags: ImageKitEndpoints['filesRemoveAITags'] = (
	ctx,
	input,
) =>
	bulkTags(
		ctx,
		{
			event: 'files.removeAITags',
			path: '/v1/files/removeAITags',
			input: Inputs.filesRemoveAITags,
		},
		input,
		({ fileIds, AITags }) => ({ fileIds, AITags }),
	);
