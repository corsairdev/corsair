import { request } from 'corsair/http';
import { BatchEndpoints, ElementsEndpoints } from './endpoints';
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

function sentBody(index = 0) {
	// unknown: the raw body as the mocked transport received it; each test asserts
	// on the one request shape it sent.
	return mockRequest.mock.calls[index][1].body as SentBody;
}

const elementProperties = {
	pageObjectId: 'slide-1',
	size: {
		width: { magnitude: 3000000 },
		height: { magnitude: 1500000 },
	},
};

let ctx: GoogleSlidesContext;

beforeEach(() => {
	mockRequest.mockReset();
	ctx = makeContext();
});

describe('elements.createShape', () => {
	it('creates a text box and returns the new object id', async () => {
		mockRequest.mockResolvedValue({
			presentationId: 'deck-1',
			replies: [{ createShape: { objectId: 'shape-new' } }],
		});

		const result = await ElementsEndpoints.createShape(ctx, {
			presentationId: 'deck-1',
			shapeType: 'TEXT_BOX',
			elementProperties,
		});

		expect(sentBody().requests).toEqual([
			{
				createShape: {
					shapeType: 'TEXT_BOX',
					elementProperties: {
						pageObjectId: 'slide-1',
						size: {
							width: { magnitude: 3000000 },
							height: { magnitude: 1500000 },
						},
					},
				},
			},
		]);
		expect(result).toEqual({ presentationId: 'deck-1', objectId: 'shape-new' });
	});

	it('requires a width and height before sending', async () => {
		await expect(
			ElementsEndpoints.createShape(ctx, {
				presentationId: 'deck-1',
				shapeType: 'RECTANGLE',
				elementProperties: {
					pageObjectId: 'slide-1',
					size: { width: { magnitude: 100 } },
				},
			}),
		).rejects.toThrow(/both width and height/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a shape type outside the supported set', async () => {
		await expect(
			ElementsEndpoints.createShape(ctx, {
				presentationId: 'deck-1',
				shapeType: 'STAR_32' as never,
				elementProperties,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('elements.createImage', () => {
	it('creates an image from a URL', async () => {
		mockRequest.mockResolvedValue({
			replies: [{ createImage: { objectId: 'image-1' } }],
		});

		const result = await ElementsEndpoints.createImage(ctx, {
			presentationId: 'deck-1',
			url: 'https://example.test/logo.png',
			elementProperties,
		});

		expect(sentBody().requests).toEqual([
			{
				createImage: {
					url: 'https://example.test/logo.png',
					elementProperties: {
						pageObjectId: 'slide-1',
						size: {
							width: { magnitude: 3000000 },
							height: { magnitude: 1500000 },
						},
					},
				},
			},
		]);
		expect(result.objectId).toBe('image-1');
	});

	it('rejects a URL longer than the documented 2 KB limit', async () => {
		await expect(
			ElementsEndpoints.createImage(ctx, {
				presentationId: 'deck-1',
				url: `https://example.test/${'a'.repeat(2100)}`,
				elementProperties,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('elements.createTable', () => {
	it('creates a table with the requested rows and columns', async () => {
		mockRequest.mockResolvedValue({
			replies: [{ createTable: { objectId: 'table-1' } }],
		});

		const result = await ElementsEndpoints.createTable(ctx, {
			presentationId: 'deck-1',
			rows: 3,
			columns: 4,
			elementProperties,
		});

		expect(sentBody().requests).toEqual([
			{
				createTable: {
					rows: 3,
					columns: 4,
					elementProperties: {
						pageObjectId: 'slide-1',
						size: {
							width: { magnitude: 3000000 },
							height: { magnitude: 1500000 },
						},
					},
				},
			},
		]);
		expect(result.objectId).toBe('table-1');
	});

	it('strips scale and shear, which a table transform rejects', async () => {
		mockRequest.mockResolvedValue({
			replies: [{ createTable: { objectId: 'table-1' } }],
		});

		await ElementsEndpoints.createTable(ctx, {
			presentationId: 'deck-1',
			rows: 1,
			columns: 1,
			elementProperties: {
				...elementProperties,
				transform: {
					translateX: 100,
					translateY: 200,
					scaleX: 2,
					scaleY: 2,
					shearX: 0.5,
					unit: 'EMU',
				},
			},
		});

		expect(sentBody().requests).toEqual([
			{
				createTable: {
					rows: 1,
					columns: 1,
					elementProperties: {
						pageObjectId: 'slide-1',
						size: {
							width: { magnitude: 3000000 },
							height: { magnitude: 1500000 },
						},
						transform: { translateX: 100, translateY: 200, unit: 'EMU' },
					},
				},
			},
		]);
	});

	it('rejects a table with no rows or columns', async () => {
		await expect(
			ElementsEndpoints.createTable(ctx, {
				presentationId: 'deck-1',
				rows: 0,
				columns: 2,
				elementProperties,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('elements.setAltText', () => {
	it('sets the title and description', async () => {
		mockRequest.mockResolvedValue({ presentationId: 'deck-1', replies: [{}] });

		const result = await ElementsEndpoints.setAltText(ctx, {
			presentationId: 'deck-1',
			objectId: 'image-1',
			title: 'Logo',
			description: 'Company logo',
		});

		expect(sentBody().requests).toEqual([
			{
				updatePageElementAltText: {
					objectId: 'image-1',
					title: 'Logo',
					description: 'Company logo',
				},
			},
		]);
		expect(result.replyCount).toBe(1);
	});
});

describe('elements.updateTransform', () => {
	it('defaults to RELATIVE so a translate adds to the current position', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		await ElementsEndpoints.updateTransform(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			transform: { translateX: 100, translateY: 200 },
		});

		expect(sentBody().requests).toEqual([
			{
				updatePageElementTransform: {
					objectId: 'shape-1',
					transform: { translateX: 100, translateY: 200 },
					applyMode: 'RELATIVE',
				},
			},
		]);
	});

	it('sends ABSOLUTE when the caller asks to replace the transform', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		await ElementsEndpoints.updateTransform(ctx, {
			presentationId: 'deck-1',
			objectId: 'shape-1',
			transform: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 },
			applyMode: 'ABSOLUTE',
		});

		const first = sentBody().requests?.[0] as {
			updatePageElementTransform: { applyMode: string };
		};
		expect(first.updatePageElementTransform.applyMode).toBe('ABSOLUTE');
	});
});

describe('elements.zOrder', () => {
	it('brings elements to the front', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		await ElementsEndpoints.zOrder(ctx, {
			presentationId: 'deck-1',
			objectIds: ['a', 'b'],
			operation: 'BRING_TO_FRONT',
		});

		expect(sentBody().requests).toEqual([
			{
				updatePageElementsZOrder: {
					pageElementObjectIds: ['a', 'b'],
					operation: 'BRING_TO_FRONT',
				},
			},
		]);
	});

	it('rejects an unsupported z-order operation', async () => {
		await expect(
			ElementsEndpoints.zOrder(ctx, {
				presentationId: 'deck-1',
				objectIds: ['a'],
				operation: 'BRING_EVERYTHING' as never,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('elements.group', () => {
	it('groups two elements and returns the group id', async () => {
		mockRequest.mockResolvedValue({
			replies: [{ groupObjects: { objectId: 'group-1' } }],
		});

		const result = await ElementsEndpoints.group(ctx, {
			presentationId: 'deck-1',
			objectIds: ['a', 'b'],
		});

		expect(sentBody().requests).toEqual([
			{ groupObjects: { childrenObjectIds: ['a', 'b'] } },
		]);
		expect(result.groupObjectId).toBe('group-1');
	});

	it('rejects a group of one element', async () => {
		await expect(
			ElementsEndpoints.group(ctx, {
				presentationId: 'deck-1',
				objectIds: ['a'],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('elements.ungroup', () => {
	it('ungroups by group id', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		await ElementsEndpoints.ungroup(ctx, {
			presentationId: 'deck-1',
			objectIds: ['group-1'],
		});

		expect(sentBody().requests).toEqual([
			{ ungroupObjects: { objectIds: ['group-1'] } },
		]);
	});
});

describe('batch.update', () => {
	it('sends raw requests and returns the positional replies', async () => {
		mockRequest.mockResolvedValue({
			presentationId: 'deck-1',
			replies: [{}, { replaceAllText: { occurrencesChanged: 2 } }],
		});

		const result = await BatchEndpoints.update(ctx, {
			presentationId: 'deck-1',
			requests: [
				{ mergeTableCells: { objectId: 'table-1', tableRange: {} } },
				{
					replaceAllText: {
						containsText: { text: 'a' },
						replaceText: 'b',
					},
				},
			],
		});

		expect(mockRequest.mock.calls[0][1].url).toBe(
			'/presentations/deck-1:batchUpdate',
		);
		expect(sentBody().requests).toHaveLength(2);
		expect(result.replies).toHaveLength(2);
	});

	it('passes a write control when given one', async () => {
		mockRequest.mockResolvedValue({ replies: [] });

		await BatchEndpoints.update(ctx, {
			presentationId: 'deck-1',
			requests: [{ createSlide: {} }],
			writeControl: { requiredRevisionId: 'rev-9' },
		});

		expect(sentBody().writeControl).toEqual({ requiredRevisionId: 'rev-9' });
	});

	it('omits write control when the caller gave none', async () => {
		mockRequest.mockResolvedValue({ replies: [] });

		await BatchEndpoints.update(ctx, {
			presentationId: 'deck-1',
			requests: [{ createSlide: {} }],
		});

		expect(sentBody().writeControl).toBeUndefined();
	});

	it('rejects an empty batch, which the API would refuse', async () => {
		await expect(
			BatchEndpoints.update(ctx, {
				presentationId: 'deck-1',
				requests: [],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
