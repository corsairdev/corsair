import type { SlackWebhooks } from '..';
import type { MessageEvent } from './types';

export const message: SlackWebhooks['message'] = async (ctx, request) => {
	const event =
		request.payload.type === 'event_callback' ? request.payload.event : null;

	if (!event || event.type !== 'message') {
		return {
			success: true,
			data: {},
		};
	}

	const messageEvent = event as MessageEvent;
	const msg = messageEvent as unknown as {
		channel?: string;
		user?: string;
		text?: string;
		ts?: string;
		thread_ts?: string;
		[key: string]: unknown;
	};

	console.log('📬 Slack Message Event:', {
		channel: msg.channel,
		user: msg.user,
		text: msg.text?.substring(0, 100),
		ts: msg.ts,
	});

	if (ctx.db.messages && msg.ts) {
		try {
			await ctx.db.messages.upsert(msg.ts, {
				...msg,
				id: msg.ts,
				type: messageEvent.type,
				channel: msg.channel || '',
				authorId: msg.user,
				createdAt: msg.ts ? new Date(parseFloat(msg.ts) * 1000) : new Date(),
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	return {
		success: true,
		data: {},
	};
};
