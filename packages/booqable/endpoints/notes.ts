import type { BooqableEndpoint } from './factory';
import { executeBooqableOperation, getRoute } from './factory';

const listNotesRoute = getRoute('listNotes');
export const listNotes: BooqableEndpoint = async (ctx, input = {}) => {
	return executeBooqableOperation(ctx, input, listNotesRoute);
};

export const NotesEndpoints = {
	listNotes,
};
