import type { CapsuleCrmContext } from '../index';
import { matchCapsuleCrmEvent } from './types';

function restHook(event: string) {
	return {
		match: matchCapsuleCrmEvent(event),
		handler: async (
			_ctx: CapsuleCrmContext,
			_request: { payload: unknown },
		) => ({
			success: true as const,
			data: { success: true },
		}),
	};
}

export const partyCreated = restHook('party/created');
export const partyUpdated = restHook('party/updated');
export const partyDeleted = restHook('party/deleted');
export const kaseCreated = restHook('kase/created');
export const kaseUpdated = restHook('kase/updated');
export const kaseDeleted = restHook('kase/deleted');
export const kaseClosed = restHook('kase/closed');
export const kaseMoved = restHook('kase/moved');
export const opportunityCreated = restHook('opportunity/created');
export const opportunityUpdated = restHook('opportunity/updated');
export const opportunityDeleted = restHook('opportunity/deleted');
export const opportunityClosed = restHook('opportunity/closed');
export const opportunityMoved = restHook('opportunity/moved');
export const taskCreated = restHook('task/created');
export const taskUpdated = restHook('task/updated');
export const taskCompleted = restHook('task/completed');
export const userCreated = restHook('user/created');
export const userUpdated = restHook('user/updated');
export const userDeleted = restHook('user/deleted');
