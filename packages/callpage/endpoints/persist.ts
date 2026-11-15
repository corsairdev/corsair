import type { CallPageContext } from '../index';
import type {
	CallPageCall,
	CallPageManager,
	CallPageSmsMessage,
	CallPageUser,
	CallPageVoiceMessage,
	CallPageWidget,
} from '../schema/database';

// A failed cache write must never fail the API call that already succeeded.
// Safe: callers only await the write and ignore its result.
// A narrower type is not practical because each entity store returns a different row type.
async function safely(what: string, write: () => Promise<unknown>) {
	try {
		await write();
	} catch (error) {
		console.warn(`[CALLPAGE] failed to persist ${what}:`, error);
	}
}

// upsertByEntityId replaces the stored row, so a partial update must be merged
// over the stored row. Fields left undefined must not erase stored values.
function definedOnly<T extends object>(patch: T): Partial<T> {
	// Safe: filtering only drops keys, so every remaining entry keeps its type from T.
	// A narrower type is not practical because Object.fromEntries widens to an index signature.
	return Object.fromEntries(
		Object.entries(patch).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}

const messageKey = (widgetId: number, messageId: string) =>
	`${widgetId}:${messageId}`;

export async function saveUsers(
	ctx: CallPageContext,
	users: readonly CallPageUser[],
) {
	const store = ctx.db.users;
	if (!store) return;
	for (const user of users) {
		await safely(`user ${user.id}`, () =>
			store.upsertByEntityId(String(user.id), user),
		);
	}
}

export async function patchUser(
	ctx: CallPageContext,
	user: Partial<CallPageUser> & { id: number },
) {
	const store = ctx.db.users;
	if (!store) return;
	await safely(`user ${user.id}`, async () => {
		const existing = await store.findByEntityId(String(user.id));
		await store.upsertByEntityId(String(user.id), {
			...existing?.data,
			...definedOnly(user),
			id: user.id,
		});
	});
}

export async function deleteUser(ctx: CallPageContext, id: number) {
	const store = ctx.db.users;
	if (!store) return;
	await safely(`user ${id} removal`, () => store.deleteByEntityId(String(id)));
}

export async function saveManagers(
	ctx: CallPageContext,
	widgetId: number,
	managers: readonly CallPageManager[],
) {
	const store = ctx.db.managers;
	if (!store) return;
	for (const manager of managers) {
		await safely(`manager ${manager.id}`, () =>
			store.upsertByEntityId(String(manager.id), {
				...manager,
				widget_id: widgetId,
				user_id: manager.user?.id,
			}),
		);
	}
}

export async function patchManager(
	ctx: CallPageContext,
	manager: Partial<CallPageManager> & { widget_id: number; user_id: number },
) {
	const store = ctx.db.managers;
	if (!store) return;
	await safely(`manager of user ${manager.user_id}`, async () => {
		const [existing] = await store.search({
			data: { widget_id: manager.widget_id, user_id: manager.user_id },
			limit: 1,
		});
		const id = manager.id ?? existing?.data.id;
		if (id === undefined) return;
		await store.upsertByEntityId(String(id), {
			...existing?.data,
			...definedOnly(manager),
			id,
		});
	});
}

export async function deleteManager(
	ctx: CallPageContext,
	widgetId: number,
	userId: number,
) {
	const store = ctx.db.managers;
	if (!store) return;
	await safely(`manager of user ${userId} removal`, async () => {
		const rows = await store.search({
			data: { widget_id: widgetId, user_id: userId },
		});
		for (const row of rows) await store.deleteByEntityId(row.entity_id);
	});
}

export async function saveWidgets(
	ctx: CallPageContext,
	widgets: readonly CallPageWidget[],
) {
	const store = ctx.db.widgets;
	if (!store) return;
	for (const widget of widgets) {
		await safely(`widget ${widget.id}`, () =>
			store.upsertByEntityId(String(widget.id), widget),
		);
		await saveManagers(ctx, widget.id, widget.managers ?? []);
	}
}

export async function patchWidget(
	ctx: CallPageContext,
	widget: Partial<CallPageWidget> & { id: number },
) {
	const store = ctx.db.widgets;
	if (!store) return;
	await safely(`widget ${widget.id}`, async () => {
		const existing = await store.findByEntityId(String(widget.id));
		await store.upsertByEntityId(String(widget.id), {
			...existing?.data,
			...definedOnly(widget),
			id: widget.id,
		});
	});
}

export async function deleteWidget(ctx: CallPageContext, id: number) {
	const store = ctx.db.widgets;
	if (!store) return;
	await safely(`widget ${id} removal`, () =>
		store.deleteByEntityId(String(id)),
	);
}

export async function saveCalls(
	ctx: CallPageContext,
	calls: readonly CallPageCall[],
) {
	const store = ctx.db.calls;
	if (!store) return;
	for (const call of calls) {
		await safely(`call ${call.id}`, () =>
			store.upsertByEntityId(String(call.id), call),
		);
	}
}

export async function saveSmsMessages(
	ctx: CallPageContext,
	widgetId: number,
	messages: readonly CallPageSmsMessage[],
) {
	const store = ctx.db.smsMessages;
	if (!store) return;
	for (const message of messages) {
		await safely(`sms ${message.message_id}`, () =>
			store.upsertByEntityId(messageKey(widgetId, message.message_id), {
				...message,
				widget_id: widgetId,
			}),
		);
	}
}

export async function patchSmsMessage(
	ctx: CallPageContext,
	widgetId: number,
	message: Partial<CallPageSmsMessage> & { message_id: string },
) {
	const store = ctx.db.smsMessages;
	if (!store) return;
	const key = messageKey(widgetId, message.message_id);
	await safely(`sms ${message.message_id}`, async () => {
		const existing = await store.findByEntityId(key);
		await store.upsertByEntityId(key, {
			text: '',
			...existing?.data,
			...definedOnly(message),
			message_id: message.message_id,
			widget_id: widgetId,
		});
	});
}

// Reset restores the defaults, so the custom rows are dropped.
export async function deleteSmsMessages(
	ctx: CallPageContext,
	widgetId: number,
	messageId?: string,
) {
	const store = ctx.db.smsMessages;
	if (!store) return;
	await safely(`sms reset for widget ${widgetId}`, async () => {
		if (messageId) {
			await store.deleteByEntityId(messageKey(widgetId, messageId));
			return;
		}
		const rows = await store.search({ data: { widget_id: widgetId } });
		for (const row of rows) await store.deleteByEntityId(row.entity_id);
	});
}

export async function saveVoiceMessages(
	ctx: CallPageContext,
	widgetId: number,
	messages: readonly CallPageVoiceMessage[],
) {
	const store = ctx.db.voiceMessages;
	if (!store) return;
	for (const message of messages) {
		await safely(`voice message ${message.message_id}`, () =>
			store.upsertByEntityId(messageKey(widgetId, message.message_id), {
				...message,
				widget_id: widgetId,
			}),
		);
	}
}

export async function patchVoiceMessage(
	ctx: CallPageContext,
	widgetId: number,
	message: Partial<CallPageVoiceMessage> & { message_id: string },
) {
	const store = ctx.db.voiceMessages;
	if (!store) return;
	const key = messageKey(widgetId, message.message_id);
	await safely(`voice message ${message.message_id}`, async () => {
		const existing = await store.findByEntityId(key);
		await store.upsertByEntityId(key, {
			...existing?.data,
			...definedOnly(message),
			message_id: message.message_id,
			widget_id: widgetId,
		});
	});
}

// Reset restores the defaults, so the custom rows are dropped.
export async function deleteVoiceMessages(
	ctx: CallPageContext,
	widgetId: number,
	messageId?: string,
) {
	const store = ctx.db.voiceMessages;
	if (!store) return;
	await safely(`voice reset for widget ${widgetId}`, async () => {
		if (messageId) {
			await store.deleteByEntityId(messageKey(widgetId, messageId));
			return;
		}
		const rows = await store.search({ data: { widget_id: widgetId } });
		for (const row of rows) await store.deleteByEntityId(row.entity_id);
	});
}
