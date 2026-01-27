import type { ResendWebhooks } from '..';
import type {
	EmailBouncedEvent,
	EmailClickedEvent,
	EmailComplainedEvent,
	EmailDeliveredEvent,
	EmailFailedEvent,
	EmailOpenedEvent,
	EmailReceivedEvent,
	EmailSentEvent,
} from './types';
import { createResendMatch } from './types';

export const emailSent: ResendWebhooks['emailSent'] = {
	match: createResendMatch('email.sent'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailSentEvent;

		console.log('📧 Resend Email Sent Event:', {
			email_id: event.data.email_id,
			from: event.data.from,
			to: event.data.to,
		});

		if (ctx.db.emails && event.data.email_id) {
			try {
				await ctx.db.emails.upsert(event.data.email_id, {
					id: event.data.email_id,
					from: event.data.from,
					to: event.data.to,
					subject: event.data.subject,
					created_at: event.data.created_at,
				});
			} catch (error) {
				console.warn('Failed to save email to database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};

export const emailDelivered: ResendWebhooks['emailDelivered'] = {
	match: createResendMatch('email.delivered'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailDeliveredEvent;

		console.log('✅ Resend Email Delivered Event:', {
			email_id: event.data.email_id,
		});

		return {
			success: true,
			data: {},
		};
	},
};

export const emailBounced: ResendWebhooks['emailBounced'] = {
	match: createResendMatch('email.bounced'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailBouncedEvent;

		console.log('❌ Resend Email Bounced Event:', {
			email_id: event.data.email_id,
			bounce_type: event.data.bounce_type,
		});

		return {
			success: true,
			data: {},
		};
	},
};

export const emailOpened: ResendWebhooks['emailOpened'] = {
	match: createResendMatch('email.opened'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailOpenedEvent;

		console.log('👁️ Resend Email Opened Event:', {
			email_id: event.data.email_id,
		});

		return {
			success: true,
			data: {},
		};
	},
};

export const emailClicked: ResendWebhooks['emailClicked'] = {
	match: createResendMatch('email.clicked'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailClickedEvent;

		console.log('🖱️ Resend Email Clicked Event:', {
			email_id: event.data.email_id,
			link: event.data.link,
		});

		return {
			success: true,
			data: {},
		};
	},
};

export const emailComplained: ResendWebhooks['emailComplained'] = {
	match: createResendMatch('email.complained'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailComplainedEvent;

		console.log('⚠️ Resend Email Complained Event:', {
			email_id: event.data.email_id,
		});

		return {
			success: true,
			data: {},
		};
	},
};

export const emailFailed: ResendWebhooks['emailFailed'] = {
	match: createResendMatch('email.failed'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailFailedEvent;

		console.log('💥 Resend Email Failed Event:', {
			email_id: event.data.email_id,
			error: event.data.error,
		});

		return {
			success: true,
			data: {},
		};
	},
};

export const emailReceived: ResendWebhooks['emailReceived'] = {
	match: createResendMatch('email.received'),

	handler: async (ctx, request) => {
		const event = request.payload as EmailReceivedEvent;

		console.log('📬 Resend Email Received Event:', {
			email_id: event.data.email_id,
		});

		if (ctx.db.emails && event.data.email_id) {
			try {
				await ctx.db.emails.upsert(event.data.email_id, {
					id: event.data.email_id,
					from: event.data.from,
					to: event.data.to,
					subject: event.data.subject,
					created_at: event.data.created_at,
				});
			} catch (error) {
				console.warn('Failed to save email to database:', error);
			}
		}

		return {
			success: true,
			data: {},
		};
	},
};
