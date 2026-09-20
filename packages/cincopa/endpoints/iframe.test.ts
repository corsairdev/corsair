import { getUploadIframe } from './general';

describe('Cincopa general.getUploadIframe', () => {
	it('fetches HTML and returns the iframe URL', async () => {
		const html =
			"<iframe src='https://api.cincopa.com/v2/upload.iframe'></iframe>";
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(html, { status: 200 }),
		);

		const result = await getUploadIframe(
			{ key: 'test-api-token' } as never,
			{ fid: 'fid-1' },
		);

		expect(fetchSpy).toHaveBeenCalled();
		expect(result.html).toBe(html);
		expect(result.url).toContain('upload.iframe');
		expect(result.url).toContain('fid=fid-1');
		fetchSpy.mockRestore();
	});
});
