/**
 * Risk level and description per operation. `destructive` (R8): sends a
 * message or call to a person, spends credit on a send, ends a live call, or
 * deletes a template. Number lookups only spend prepaid credit on a read and
 * stay `read`, as the plugin rules ask for metered reads.
 */
export const moceanEndpointMeta = {
	'sms.send': {
		riskLevel: 'destructive',
		description:
			'Send an SMS to up to 500 receivers, charged per destination; the response has a status and msgid per receiver',
	},
	'sms.status': {
		riskLevel: 'read',
		description:
			"Read a sent message's final status (success, failed, expired, pending or not found) and the credit it took",
	},
	'sms.reportConversion': {
		riskLevel: 'write',
		description:
			'Tell Mocean whether a sent SMS reached the user (conversion tracking for OTP routes)',
	},
	'account.balance': {
		riskLevel: 'read',
		description: 'Read the account credit balance',
	},
	'account.pricing': {
		riskLevel: 'read',
		description:
			'List per-destination prices for SMS, number lookup or verify, optionally for one MCC/MNC pair',
	},
	'verify.request': {
		riskLevel: 'destructive',
		description:
			'Send a verification code by SMS, charged per attempt; keep the reqid for check and resend',
	},
	'verify.requestTelegram': {
		riskLevel: 'destructive',
		description:
			'Send a verification code to a Telegram chat through your bot; keep the reqid for check',
	},
	'verify.resend': {
		riskLevel: 'destructive',
		description:
			'Resend the code of a verify request by SMS, charged per attempt',
	},
	'verify.check': {
		riskLevel: 'write',
		description:
			'Check the code a user gave you against a verify request; Mocean allows three wrong attempts',
	},
	'lookup.request': {
		riskLevel: 'read',
		description:
			"Look up a number's original and current carrier and porting status, paid from prepaid credit; synchronous without a callback URL",
	},
	'voice.dial': {
		riskLevel: 'destructive',
		description:
			'Call one or more numbers and run a Mocean Command flow (say, play, collect, record, dial), charged per call',
	},
	'voice.hangup': {
		riskLevel: 'destructive',
		description: 'Hang up a call in progress',
	},
	'voice.recording': {
		riskLevel: 'read',
		description: 'Download the audio recording of a call',
	},
	'whatsapp.send': {
		riskLevel: 'destructive',
		description:
			'Send a WhatsApp message (text, media, template, interactive, location or contacts) from your business number',
	},
	'whatsapp.downloadMedia': {
		riskLevel: 'read',
		description: 'Download media a WhatsApp user sent to your business number',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List WhatsApp message templates, filtered by name, status, category or language',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one WhatsApp message template',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create a WhatsApp message template and submit it to Meta for review',
	},
	'templates.edit': {
		riskLevel: 'write',
		description: 'Edit a WhatsApp message template; Meta reviews it again',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a WhatsApp message template, every language of it or one by ID; cannot be undone',
	},
} as const;
