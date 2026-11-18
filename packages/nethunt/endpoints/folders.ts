import type { NethuntEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	NethuntEndpointInputSchemas as Inputs,
	NethuntEndpointOutputSchemas as Outputs,
} from './types';

/**
 * NetHunt has two folder lists: every readable folder and the writable subset.
 * Both return `{ id, name }`, and the id is what every record route takes.
 */
export const list: NethuntEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ writable }) => ({
			method: 'GET',
			path: writable
				? '/zapier/triggers/writable-folder'
				: '/zapier/triggers/readable-folder',
		}),
		{
			// The provider answers a bare array.
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(`Expected a NetHunt folder array, got ${typeof raw}`);
				}
				return { folders: raw };
			},
			log: (_, result) => ({ count: result.folders.length }),
		},
	);

/**
 * Lists the field names a folder has. They are user-defined, so this is the
 * only way to know what a create or update may write.
 */
export const fields: NethuntEndpoints['foldersFields'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.fields',
			input: Inputs.foldersFields,
			output: Outputs.foldersFields,
		},
		input,
		({ folderId }) => ({
			method: 'GET',
			path: `/zapier/triggers/folder-field/${segment(folderId)}`,
		}),
		{
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error(`Expected a NetHunt field array, got ${typeof raw}`);
				}
				return { fields: raw };
			},
			log: ({ folderId }, result) => ({
				folderId,
				fields: result.fields.length,
			}),
		},
	);
