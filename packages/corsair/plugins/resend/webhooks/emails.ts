import { logEventFromContext } from '../../utils/events';
import type { ResendWebhooks } from '..';
import { createResendMatch } from './types';

export const emailSent: ResendWebhooks['emailSent'] = {
	match: createResendMatch('email.sent'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.sent') {
			return {
				success: true,
				data: undefined,
			};
		}

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

		await logEventFromContext(
			ctx,
			'resend.webhook.emailSent',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailDelivered: ResendWebhooks['emailDelivered'] = {
	match: createResendMatch('email.delivered'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.delivered') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('✅ Resend Email Delivered Event:', {
			email_id: event.data.email_id,
		});

		await logEventFromContext(
			ctx,
			'resend.webhook.emailDelivered',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailBounced: ResendWebhooks['emailBounced'] = {
	match: createResendMatch('email.bounced'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.bounced') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('❌ Resend Email Bounced Event:', {
			email_id: event.data.email_id,
			bounce_type: event.data.bounce_type,
		});

		await logEventFromContext(
			ctx,
			'resend.webhook.emailBounced',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailOpened: ResendWebhooks['emailOpened'] = {
	match: createResendMatch('email.opened'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.opened') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('👁️ Resend Email Opened Event:', {
			email_id: event.data.email_id,
		});

		await logEventFromContext(
			ctx,
			'resend.webhook.emailOpened',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailClicked: ResendWebhooks['emailClicked'] = {
	match: createResendMatch('email.clicked'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.clicked') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('🖱️ Resend Email Clicked Event:', {
			email_id: event.data.email_id,
			link: event.data.link,
		});

		await logEventFromContext(
			ctx,
			'resend.webhook.emailClicked',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailComplained: ResendWebhooks['emailComplained'] = {
	match: createResendMatch('email.complained'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.complained') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('⚠️ Resend Email Complained Event:', {
			email_id: event.data.email_id,
		});

		await logEventFromContext(
			ctx,
			'resend.webhook.emailComplained',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailFailed: ResendWebhooks['emailFailed'] = {
	match: createResendMatch('email.failed'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.failed') {
			return {
				success: true,
				data: undefined,
			};
		}

		console.log('💥 Resend Email Failed Event:', {
			email_id: event.data.email_id,
			error: event.data.error,
		});

		await logEventFromContext(
			ctx,
			'resend.webhook.emailFailed',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const emailReceived: ResendWebhooks['emailReceived'] = {
	match: createResendMatch('email.received'),

	handler: async (ctx, request) => {
		const event = request.payload;

		if (event.type !== 'email.received') {
			return {
				success: true,
				data: undefined,
			};
		}

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

		await logEventFromContext(
			ctx,
			'resend.webhook.emailReceived',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
