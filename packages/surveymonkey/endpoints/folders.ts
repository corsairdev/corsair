import type { SurveymonkeyEndpoints } from '..';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

export const list: SurveymonkeyEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ page, per_page }) => ({
			method: 'GET',
			path: '/survey_folders',
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'survey folder list'),
				data: unwrapList(raw, 'survey folder list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

/**
 * A folder is created from a lowercase `title`. The reference's example sends
 * `Title`, but the live API ignores it and names the folder "New Folder".
 */
export const create: SurveymonkeyEndpoints['foldersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.create',
			input: Inputs.foldersCreate,
			output: Outputs.foldersCreate,
		},
		input,
		({ title }) => ({
			method: 'POST',
			path: '/survey_folders',
			body: { title },
		}),
		{
			log: (_, result) => ({ folderId: result.id }),
		},
	);
