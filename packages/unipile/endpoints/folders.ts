import { defineOperation, noContent } from './call';

// List all Folders (GET /v2/{account_id}/folders)
export const list = defineOperation('foldersList', 'folders.list', {
	method: 'GET',
	path: '/v2/{account_id}/folders',
	query: ['offset', 'cursor', 'limit'],
});

// Create a Folder (POST /v2/{account_id}/folders)
export const create = defineOperation('foldersCreate', 'folders.create', {
	method: 'POST',
	path: '/v2/{account_id}/folders',
	body: ['name', 'parent_id', 'text_color', 'background_color'],
});

// Get a Folder (GET /v2/{account_id}/folders/{folder_id})
export const get = defineOperation('foldersGet', 'folders.get', {
	method: 'GET',
	path: '/v2/{account_id}/folders/{folder_id}',
});

// Update a Folder (PATCH /v2/{account_id}/folders/{folder_id})
export const update = defineOperation('foldersUpdate', 'folders.update', {
	method: 'PATCH',
	path: '/v2/{account_id}/folders/{folder_id}',
	body: ['name', 'parent_id', 'text_color', 'background_color'],
});

// Delete a Folder (DELETE /v2/{account_id}/folders/{folder_id})
export const remove = defineOperation(
	'foldersDelete',
	'folders.delete',
	{
		method: 'DELETE',
		path: '/v2/{account_id}/folders/{folder_id}',
	},
	noContent,
);
