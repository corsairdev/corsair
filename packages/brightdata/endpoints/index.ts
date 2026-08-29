import * as AccountModule from './account';
import * as ScraperModule from './scraper';
import * as SerpModule from './serp';
import * as WebUnlockerModule from './web-unlocker';

export const WebUnlockerEndpoints = WebUnlockerModule;
export const SerpEndpoints = SerpModule;
export const ScraperEndpoints = ScraperModule;
export const AccountEndpoints = AccountModule;

export * from './types';
