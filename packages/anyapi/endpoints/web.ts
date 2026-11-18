import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const scrape: AnyApiEndpoints['webScrape'] = (ctx, input) =>
	runSku(ctx, 'webScrape', 'web.scrape', 'web.scrape', input);
