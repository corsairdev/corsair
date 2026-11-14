import { check as authCheck } from './auth';
import * as javascript from './javascript';
import * as pages from './pages';
import * as pdf from './pdf';
import * as scrape from './scrape';
import * as screenshot from './screenshot';

export const AuthEndpoints = {
	check: authCheck,
};

export const Pdf = {
	fromHtml: pdf.fromHtml,
	fromMarkdown: pdf.fromMarkdown,
};

export const Screenshot = {
	capture: screenshot.capture,
};

export const Javascript = {
	run: javascript.run,
	runBinary: javascript.runBinary,
};

export const Scrape = {
	page: scrape.page,
	agent: scrape.agent,
};

export const Pages = {
	list: pages.list,
	create: pages.create,
	update: pages.update,
	remove: pages.remove,
};

export * from './types';
