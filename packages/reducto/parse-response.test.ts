import { ReductoEndpointOutputSchemas } from './endpoints/types';

// Shape of a real /parse response for a one-page text PDF (2026-10-26): blocks
// with no chart carry `chart_data: null`, and `ocr` is null unless requested.
// `chartData` and `ocr` are `unknown` on purpose: the tests pass values the
// schema must reject (a string for chart_data), which a stricter type would not
// let them write.
function parseResponse(chartData: unknown, ocr: unknown) {
	const block = (type: string, content: string, top: number) => ({
		type,
		content,
		bbox: { left: 0.1, top, width: 0.8, height: 0.05, page: 1 },
		confidence: 'high',
		image_url: null,
		chart_data: chartData,
	});
	return {
		job_id: 'job-1',
		duration: 1.4,
		usage: { num_pages: 1, credits: 1 },
		result: {
			type: 'full',
			chunks: [
				{
					content: 'Lorem ipsum',
					embed: 'Lorem ipsum',
					enriched: null,
					enrichment_success: false,
					blocks: [
						block('Title', 'Sample PDF', 0.1),
						block('Text', 'Lorem ipsum', 0.2),
					],
				},
			],
			ocr,
			custom: null,
		},
		pdf_url: null,
		studio_link: null,
	};
}

// `unknown` because this checks raw response bodies, which is exactly what the
// schema exists to validate; typing them as the parsed shape would assume the answer.
const parse = (body: unknown) =>
	ReductoEndpointOutputSchemas.parse.safeParse(body).success;

describe('Reducto parse response', () => {
	it('accepts null chart_data on blocks and a null ocr', () => {
		expect(parse(parseResponse(null, null))).toBe(true);
	});

	it('still accepts chart data and OCR words when present', () => {
		const ocr = {
			words: [
				{
					text: 'Lorem',
					bbox: { left: 0.1, top: 0.2, width: 0.1, height: 0.02, page: 1 },
				},
			],
		};
		expect(parse(parseResponse(['a,b', '1,2'], ocr))).toBe(true);
	});

	it('rejects a chart_data that is not a list', () => {
		expect(parse(parseResponse('a,b', null))).toBe(false);
	});
});
