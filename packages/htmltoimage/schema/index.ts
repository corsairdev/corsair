import { HtmlToImageAccount, HtmlToImageRender } from './database';

export const HtmlToImageSchema = {
	version: '1.0.0',
	entities: {
		accounts: HtmlToImageAccount,
		renders: HtmlToImageRender,
	},
} as const;
