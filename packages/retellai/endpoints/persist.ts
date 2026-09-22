import type { RetellCall, RetellChat } from './types';

type Store<T> = { upsertByEntityId: (id: string, data: T) => Promise<unknown> };

async function persist<T>(store: Store<T> | undefined, id: string, data: T) {
	if (!store) return;
	try {
		await store.upsertByEntityId(id, data);
	} catch (error) {
		console.warn(`[RETELL] failed to cache ${id}:`, error);
	}
}

export function cacheCall(
	store: Store<RetellCall> | undefined,
	call: RetellCall,
) {
	return persist(store, call.call_id, call);
}

export function cacheChat(
	store: Store<RetellChat> | undefined,
	chat: RetellChat,
) {
	return persist(store, chat.chat_id, chat);
}
