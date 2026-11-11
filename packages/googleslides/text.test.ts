import { request } from 'corsair/http';
import { TextEndpoints } from './endpoints';
import type { GoogleSlidesContext } from './index';
import type { SentBody } from './test-helpers';
import { makeContext } from './test-helpers';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function requestsSent(index = 0) {
	return (mockRequest.mock.calls[index][1].body as SentBody).requests;
}

let ctx: GoogleSlidesContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ presentationId: 'deck-1', replies: [{}] });
	ctx = makeContext();
});

describe('text.insert', () => {
	it('inserts at an index into a shape', async () => {
		const result = await TextEndpoints.insert(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			text: 'Hello',
			insertionIndex: 0,
		});

		expect(requestsSent()).toEqual([
			{ insertText: { objectId: 'shape-1', text: 'Hello', insertionIndex: 0 } },
		]);
		expect(result.replyCount).toBe(1);
	});

	it('targets a table cell when one is named', async () => {
		await TextEndpoints.insert(ctx, {
			presentationId: 'deck-1',
			objectId: 'table-1',
			text: 'Cell',
			cellLocation: { rowIndex: 1, columnIndex: 2 },
		});

		expect(requestsSent()).toEqual([
			{
				insertText: {
					objectId: 'table-1',
					text: 'Cell',
					cellLocation: { rowIndex: 1, columnIndex: 2 },
				},
			},
		]);
	});

	it('rejects empty text and a negative insertion index', async () => {
		await expect(
			TextEndpoints.insert(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				text: '',
			}),
		).rejects.toThrow();
		await expect(
			TextEndpoints.insert(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				text: 'x',
				insertionIndex: -2,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('text.replaceAll', () => {
	it('reports the number of occurrences changed', async () => {
		mockRequest.mockResolvedValue({
			presentationId: 'deck-1',
			replies: [{ replaceAllText: { occurrencesChanged: 4 } }],
		});

		const result = await TextEndpoints.replaceAll(ctx, {
			presentationId: 'deck-1',
			find: 'Q3',
			replace: 'Q4',
		});

		expect(requestsSent()).toEqual([
			{
				replaceAllText: {
					containsText: { text: 'Q3' },
					replaceText: 'Q4',
				},
			},
		]);
		expect(result.occurrencesChanged).toBe(4);
	});

	it('passes case, regex and page limits through', async () => {
		await TextEndpoints.replaceAll(ctx, {
			presentationId: 'deck-1',
			find: 'v\\d+',
			replace: 'version',
			matchCase: true,
			searchByRegex: true,
			pageObjectIds: ['slide-1'],
		});

		expect(requestsSent()).toEqual([
			{
				replaceAllText: {
					containsText: { text: 'v\\d+', matchCase: true, searchByRegex: true },
					replaceText: 'version',
					pageObjectIds: ['slide-1'],
				},
			},
		]);
	});

	it('allows an empty replacement, which deletes the matches', async () => {
		await TextEndpoints.replaceAll(ctx, {
			presentationId: 'deck-1',
			find: 'draft',
			replace: '',
		});

		expect(requestsSent()).toEqual([
			{
				replaceAllText: {
					containsText: { text: 'draft' },
					replaceText: '',
				},
			},
		]);
	});
});

describe('text.delete', () => {
	it('deletes a fixed range', async () => {
		await TextEndpoints.delete(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			textRange: { type: 'FIXED_RANGE', startIndex: 0, endIndex: 5 },
		});

		expect(requestsSent()).toEqual([
			{
				deleteText: {
					objectId: 'shape-1',
					textRange: { type: 'FIXED_RANGE', startIndex: 0, endIndex: 5 },
				},
			},
		]);
	});

	it('rejects FIXED_RANGE without both indexes', async () => {
		await expect(
			TextEndpoints.delete(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				textRange: { type: 'FIXED_RANGE', startIndex: 0 },
			}),
		).rejects.toThrow(/both startIndex and endIndex/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an end index before the start index', async () => {
		await expect(
			TextEndpoints.delete(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				textRange: { type: 'FIXED_RANGE', startIndex: 5, endIndex: 5 },
			}),
		).rejects.toThrow(/greater than startIndex/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts ALL without indexes', async () => {
		await TextEndpoints.delete(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			textRange: { type: 'ALL' },
		});
		expect(requestsSent()).toEqual([
			{ deleteText: { objectId: 'shape-1', textRange: { type: 'ALL' } } },
		]);
	});
});

describe('text.updateStyle', () => {
	it('sends a comma separated field mask matching the style keys', async () => {
		await TextEndpoints.updateStyle(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			textRange: { type: 'ALL' },
			style: { bold: true, fontSize: { magnitude: 24, unit: 'PT' } },
			fields: ['bold', 'fontSize'],
		});

		expect(requestsSent()).toEqual([
			{
				updateTextStyle: {
					objectId: 'shape-1',
					textRange: { type: 'ALL' },
					style: { bold: true, fontSize: { magnitude: 24, unit: 'PT' } },
					fields: 'bold,fontSize',
				},
			},
		]);
	});

	it('rejects a field that names a property absent from style', async () => {
		await expect(
			TextEndpoints.updateStyle(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				textRange: { type: 'ALL' },
				style: { bold: true },
				fields: ['bold', 'italic'],
			}),
		).rejects.toThrow(/italic is listed in fields but absent from style/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty field mask', async () => {
		await expect(
			TextEndpoints.updateStyle(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				textRange: { type: 'ALL' },
				style: {},
				fields: [],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('text.createBullets', () => {
	it('defaults to the documented bullet preset by omitting it', async () => {
		await TextEndpoints.createBullets(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			textRange: { type: 'ALL' },
		});

		expect(requestsSent()).toEqual([
			{
				createParagraphBullets: {
					objectId: 'shape-1',
					textRange: { type: 'ALL' },
				},
			},
		]);
	});

	it('sends a chosen preset', async () => {
		await TextEndpoints.createBullets(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			textRange: { type: 'ALL' },
			bulletPreset: 'NUMBERED_DIGIT_NESTED',
		});

		expect(requestsSent()).toEqual([
			{
				createParagraphBullets: {
					objectId: 'shape-1',
					textRange: { type: 'ALL' },
					bulletPreset: 'NUMBERED_DIGIT_NESTED',
				},
			},
		]);
	});

	it('rejects an unsupported preset', async () => {
		await expect(
			TextEndpoints.createBullets(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				textRange: { type: 'ALL' },
				bulletPreset: 'BULLET_STARS' as never,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('text.removeBullets', () => {
	it('deletes paragraph bullets for a range', async () => {
		await TextEndpoints.removeBullets(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			textRange: { type: 'FROM_START_INDEX', startIndex: 2 },
		});

		expect(requestsSent()).toEqual([
			{
				deleteParagraphBullets: {
					objectId: 'shape-1',
					textRange: { type: 'FROM_START_INDEX', startIndex: 2 },
				},
			},
		]);
	});

	it('rejects FROM_START_INDEX without a start index', async () => {
		await expect(
			TextEndpoints.removeBullets(ctx, {
				presentationId: 'deck-1',
				objectId: 'shape-1',
				textRange: { type: 'FROM_START_INDEX' },
			}),
		).rejects.toThrow(/startIndex is required/);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
