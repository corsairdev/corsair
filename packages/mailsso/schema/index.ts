// Mails.so keeps no records worth syncing: a validation is a stateless lookup,
// and a batch job is read back from the API by id.
export const MailssoSchema = {
	version: '1.0.0',
	entities: {},
} as const;
