import { gongRequest } from '../client';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';
import type { GongLibraryInputs, GongLibraryOutputs } from './library-types';

async function run<K extends keyof GongLibraryInputs>(
	ctx: GongFamilyContext,
	path: string,
	input: GongLibraryInputs[K],
): Promise<GongLibraryOutputs[K]> {
	const credentials = gongCredentials(ctx);
	return gongRequest<GongLibraryOutputs[K]>({
		baseUrl: ctx.options.baseUrl,
		credentials,
		method: 'GET',
		path,
		query: input,
	});
}
export const getLibraryStructure = (
	ctx: GongFamilyContext,
	input: GongLibraryInputs['getLibraryStructure'],
) => run<'getLibraryStructure'>(ctx, '/v2/library/folders', input);
export const getCallsInSpecificFolder = (
	ctx: GongFamilyContext,
	input: GongLibraryInputs['getCallsInSpecificFolder'],
) => run<'getCallsInSpecificFolder'>(ctx, '/v2/library/folder-content', input);
