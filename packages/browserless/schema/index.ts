import {
	BrowserlessCookie,
	BrowserlessFile,
	BrowserlessHtml,
	BrowserlessScrapeGroup,
	BrowserlessScrapeMatch,
	BrowserlessScrapeResult,
	BrowserlessUnblockResult,
} from './database';

export const BrowserlessSchema = {
	version: '1.0.0',
	entities: {
		cookies: BrowserlessCookie,
		files: BrowserlessFile,
		html: BrowserlessHtml,
		scrapeGroups: BrowserlessScrapeGroup,
		scrapeMatches: BrowserlessScrapeMatch,
		scrapeResults: BrowserlessScrapeResult,
		unblockResults: BrowserlessUnblockResult,
	},
} as const;

export {
	BrowserlessCookie,
	BrowserlessFile,
	BrowserlessHtml,
	BrowserlessScrapeGroup,
	BrowserlessScrapeMatch,
	BrowserlessScrapeResult,
	BrowserlessUnblockResult,
} from './database';
