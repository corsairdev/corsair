/**
 * No local entities. Messages, texts, calls and Slack activity arrive by the
 * second and belong to Inkbox, so every read goes to the API (or arrives as a
 * webhook event) rather than a cached copy.
 */
export const InkboxSchema = {
	version: '1.0.0',
	entities: {},
} as const;
