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
async function safely(what: string, write: () => Promise<unknown>) {
	try {
		await write();
	} catch (error) {
		console.warn(`[CALLPAGE] failed to persist ${what}:`, error);
	}
}

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
			}),
		);
	}
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
			store.upsertByEntityId(`${widgetId}:${message.message_id}`, {
				...message,
				widget_id: widgetId,
			}),
		);
	}
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
			store.upsertByEntityId(`${widgetId}:${message.message_id}`, {
				...message,
				widget_id: widgetId,
			}),
		);
	}
}
