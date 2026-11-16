import { errorHandlers, isNonIdempotentWrite } from './error-handlers';

const serverError = Object.assign(new Error('Internal Server Error'), {
	status: 500,
});
const context = (operation: string) => ({
	pluginId: 'ahrefs',
	operation,
	input: {},
	originalError: serverError,
});

describe('Ahrefs server error retries', () => {
	let warn: jest.SpyInstance;
	beforeEach(() => {
		warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	});
	afterEach(() => warn.mockRestore());

	it.each([
		'socialMedia.createPost',
		'management.createProject',
		'management.createKeywordList',
		'management.createBrandRadarReport',
		'management.addProjectKeywords',
		'management.addBrandRadarPrompts',
	])('does not retry %s after a 5xx', async (operation) => {
		expect(isNonIdempotentWrite(operation)).toBe(true);
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			serverError,
			context(operation),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it.each([
		'gsc.keywords',
		'socialMedia.updatePost',
		'management.deleteProjects',
		'brandRadar.sovOverviewEntities',
		'batchAnalysis.analyze',
		'public.domainRatingFreeBatch',
		'management.addresses',
	])('keeps retries for %s', async (operation) => {
		expect(isNonIdempotentWrite(operation)).toBe(false);
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			serverError,
			context(operation),
		);
		expect(strategy.maxRetries).toBe(2);
	});

	it('matches 5xx errors to the server handler', () => {
		expect(errorHandlers.SERVER_ERROR.match(serverError)).toBe(true);
	});
});
