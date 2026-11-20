export const GOOGLE_SUBSCRIBE_PLUGINS = [
	'gmail',
	'googledrive',
	'googlecalendar',
	'googlesheets',
] as const;

export type GoogleSubscribePlugin = (typeof GOOGLE_SUBSCRIBE_PLUGINS)[number];
