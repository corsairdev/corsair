export const MailerLiteSchema = {
	version: '1.0.0',
	// No stored entities: every MailerLite operation is a direct API call and
	// none of the 16 operations feeds a sync that a local copy would serve.
	entities: {},
} as const;
