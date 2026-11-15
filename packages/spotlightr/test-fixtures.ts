/**
 * Shapes from the live API. Spotlightr documents almost no response bodies, so
 * the fixtures below are deliberately minimal: the metrics body is a real
 * response (note the "completitionRate" spelling), and the rest carry only the
 * fields the plugin's schemas promise.
 */

/** Copied from `GET /api/video/metrics` with a bogus key, which still answered. */
export const videoMetrics = {
	loads: 16,
	watched: 0,
	plays: 0,
	playRate: 0,
	completitionRate: 0,
	shares: 0,
};

export const video = {
	id: 1357835,
	name: 'Product tour',
	videoGroup: 42,
	created: '2026-04-01T10:00:00Z',
	views: 120,
};

export const videoList = [video, { ...video, id: 1357836, name: 'Onboarding' }];

export const group = { id: 42, name: 'Marketing' };
export const groupList = [group];

/** `createVideo` documents this exactly: the new video's watch URL. */
export const createdVideoUrl =
	'https://brookerfieldrenewable.cdn.spotlightr.com/watch/MTM1NzgzNQ==';

export const view = {
	id: 9001,
	customViewerID: 'jane@acme.com',
	percentWatched: 62,
	created: '2026-05-01T09:00:00Z',
};

export const viewList = [view, { ...view, id: 9002, percentWatched: 4 }];

export const domain = { domain: 'acme.com' };
export const domainList = [domain];

export const accessRecord = { id: 555, email: 'jane@acme.com' };

/** The two 401 texts, which are JSON strings and differ only in wording. */
export const unauthorized = 'Unauthorized.';
export const missingToken = 'Missing token.';

/** An HTML error page, which the web server returns for some failures. */
export const htmlError = '<!DOCTYPE html>\n<html><body>500</body></html>';
