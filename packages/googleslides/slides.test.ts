import { request } from 'corsair/http';
import { ElementsEndpoints, notesText, SlidesEndpoints } from './endpoints';
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

function calledUrl(index = 0): string {
	const [config, options] = mockRequest.mock.calls[index];
	return `${config.BASE}${options.url}`;
}

function calledOptions(index = 0) {
	return mockRequest.mock.calls[index][1];
}

const presentation = {
	presentationId: 'deck-1',
	title: 'Roadmap',
	slides: [
		{
			objectId: 'slide-1',
			pageElements: [{ objectId: 'el-1' }, { objectId: 'el-2' }],
			slideProperties: {
				layoutObjectId: 'layout-title',
				isSkipped: false,
				notesPage: {
					notesProperties: { speakerNotesObjectId: 'notes-shape-1' },
					pageElements: [
						{
							objectId: 'notes-shape-1',
							shape: {
								text: {
									textElements: [
										{ textRun: { content: 'Talk about growth\n' } },
									],
								},
							},
						},
						{
							objectId: 'slide-image',
							shape: { placeholder: { type: 'SLIDE_IMAGE' } },
						},
					],
				},
			},
		},
		{
			objectId: 'slide-2',
			pageElements: [],
			slideProperties: { layoutObjectId: 'layout-body' },
		},
	],
};

let ctx: GoogleSlidesContext;

beforeEach(() => {
	mockRequest.mockReset();
	ctx = makeContext();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('slides.list', () => {
	it('lists slides in array order with index, layout and element counts', async () => {
		mockRequest.mockResolvedValue(presentation);

		const result = await SlidesEndpoints.list(ctx, {
			presentationId: 'deck-1',
		});

		expect(calledUrl()).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-1',
		);
		expect(result.slides).toEqual([
			{
				objectId: 'slide-1',
				index: 0,
				layoutObjectId: 'layout-title',
				isSkipped: false,
				elementCount: 2,
				notesObjectId: 'notes-shape-1',
			},
			{
				objectId: 'slide-2',
				index: 1,
				layoutObjectId: 'layout-body',
				isSkipped: undefined,
				elementCount: 0,
				notesObjectId: undefined,
			},
		]);
	});

	it('reports an empty deck as an empty list rather than failing', async () => {
		mockRequest.mockResolvedValue({ presentationId: 'deck-1', slides: [] });

		const result = await SlidesEndpoints.list(ctx, {
			presentationId: 'deck-1',
		});
		expect(result.slides).toEqual([]);
	});
});

describe('slides.get', () => {
	it('reads one page by id', async () => {
		mockRequest.mockResolvedValue({
			objectId: 'slide-1',
			pageType: 'SLIDE',
			pageElements: [{ objectId: 'el-1' }],
		});

		const result = await SlidesEndpoints.get(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
		});

		expect(calledUrl()).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-1/pages/slide-1',
		);
		expect(result.objectId).toBe('slide-1');
	});
});

describe('slides.create', () => {
	it('creates a slide from a predefined layout and reads back the applied layout', async () => {
		mockRequest
			.mockResolvedValueOnce({
				presentationId: 'deck-1',
				replies: [{ createSlide: { objectId: 'slide-new' } }],
			})
			.mockResolvedValueOnce({
				objectId: 'slide-new',
				slideProperties: { layoutObjectId: 'layout-body-applied' },
			});

		const result = await SlidesEndpoints.create(ctx, {
			presentationId: 'deck-1',
			layout: 'TITLE_AND_BODY',
			insertionIndex: 1,
		});

		expect(calledUrl(0)).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-1:batchUpdate',
		);
		expect(calledOptions(0).method).toBe('POST');
		expect(calledOptions(0).body).toEqual({
			requests: [
				{
					createSlide: {
						insertionIndex: 1,
						slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
					},
				},
			],
		});
		expect(result).toEqual({
			presentationId: 'deck-1',
			slideObjectId: 'slide-new',
			insertionIndex: 1,
			layoutObjectId: 'layout-body-applied',
		});
	});

	it('prefers a layout id over a predefined name and defaults to BLANK', async () => {
		mockRequest
			.mockResolvedValueOnce({ replies: [{ createSlide: { objectId: 's1' } }] })
			.mockResolvedValueOnce({ objectId: 's1', slideProperties: {} });

		await SlidesEndpoints.create(ctx, {
			presentationId: 'deck-1',
			layoutId: 'layout-custom',
		});
		expect((calledOptions(0).body as SentBody).requests).toEqual([
			{
				createSlide: {
					slideLayoutReference: { layoutId: 'layout-custom' },
				},
			},
		]);

		mockRequest
			.mockResolvedValueOnce({ replies: [{ createSlide: { objectId: 's2' } }] })
			.mockResolvedValueOnce({ objectId: 's2', slideProperties: {} });

		await SlidesEndpoints.create(ctx, { presentationId: 'deck-1' });
		expect((calledOptions(2).body as SentBody).requests).toEqual([
			{
				createSlide: {
					slideLayoutReference: { predefinedLayout: 'BLANK' },
				},
			},
		]);
	});

	it('fails when the reply carries no slide id', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		await expect(
			SlidesEndpoints.create(ctx, { presentationId: 'deck-1' }),
		).rejects.toThrow(/no objectId/);
	});

	it('rejects a layout both by id and by name only when neither resolves', async () => {
		await expect(
			SlidesEndpoints.create(ctx, {
				presentationId: 'deck-1',
				layout: 'NOT_A_LAYOUT' as never,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('slides.duplicate', () => {
	it('duplicates by object id and returns the copy id', async () => {
		// The page-type check reads the slide first.
		mockRequest
			.mockResolvedValueOnce({ objectId: 'slide-1', pageType: 'SLIDE' })
			.mockResolvedValueOnce({
				replies: [{ duplicateObject: { objectId: 'slide-copy' } }],
			});

		const result = await SlidesEndpoints.duplicate(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			objectIds: { 'slide-1': 'slide-copy' },
		});

		expect(calledOptions(1).body).toEqual({
			requests: [
				{
					duplicateObject: {
						objectId: 'slide-1',
						objectIds: { 'slide-1': 'slide-copy' },
					},
				},
			],
		});
		expect(result.objectId).toBe('slide-copy');
	});
});

describe('slides.remove', () => {
	it('deletes the object and reports it removed', async () => {
		mockRequest
			.mockResolvedValueOnce({ objectId: 'slide-1', pageType: 'SLIDE' })
			.mockResolvedValueOnce({ replies: [{}] });

		const result = await SlidesEndpoints.remove(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
		});

		expect(calledOptions(1).body).toEqual({
			requests: [{ deleteObject: { objectId: 'slide-1' } }],
		});
		expect(result).toEqual({
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			removed: true,
		});
	});
});

describe('slides.move', () => {
	it('moves slides to the insertion index', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		await SlidesEndpoints.move(ctx, {
			presentationId: 'deck-1',
			slideObjectIds: ['slide-3'],
			insertionIndex: 0,
		});

		expect(calledOptions().body).toEqual({
			requests: [
				{
					updateSlidesPosition: {
						slideObjectIds: ['slide-3'],
						insertionIndex: 0,
					},
				},
			],
		});
	});

	it('requires at least one slide and an index that is not negative', async () => {
		await expect(
			SlidesEndpoints.move(ctx, {
				presentationId: 'deck-1',
				slideObjectIds: [],
				insertionIndex: 0,
			}),
		).rejects.toThrow();
		await expect(
			SlidesEndpoints.move(ctx, {
				presentationId: 'deck-1',
				slideObjectIds: ['slide-1'],
				insertionIndex: -1,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('slides.setSkipped', () => {
	it('sets isSkipped through a field mask', async () => {
		mockRequest.mockResolvedValue({ replies: [{}] });

		const result = await SlidesEndpoints.setSkipped(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			isSkipped: true,
		});

		expect(calledOptions().body).toEqual({
			requests: [
				{
					updateSlideProperties: {
						objectId: 'slide-1',
						slideProperties: { isSkipped: true },
						fields: 'isSkipped',
					},
				},
			],
		});
		expect(result.isSkipped).toBe(true);
	});
});

describe('slides.getThumbnail', () => {
	it('passes dotted query keys flat, which is what Google reads', async () => {
		mockRequest.mockResolvedValue({
			contentUrl: 'https://lh3.googleusercontent.com/thumb',
			width: 1600,
			height: 900,
		});

		const result = await SlidesEndpoints.getThumbnail(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			size: 'LARGE',
		});

		expect(calledUrl()).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-1/pages/slide-1/thumbnail',
		);
		expect(calledOptions().query).toEqual({
			'thumbnailProperties.thumbnailSize': 'LARGE',
			'thumbnailProperties.mimeType': 'PNG',
		});
		expect(result.width).toBe(1600);
		expect(result.expiresInMinutes).toBe(30);
	});

	it('omits the size when the caller did not ask for one', async () => {
		mockRequest.mockResolvedValue({ contentUrl: 'https://example.test/t.png' });

		await SlidesEndpoints.getThumbnail(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
		});

		expect(calledOptions().query).toEqual({
			'thumbnailProperties.mimeType': 'PNG',
		});
	});

	it('rejects an unsupported size before sending', async () => {
		await expect(
			SlidesEndpoints.getThumbnail(ctx, {
				presentationId: 'deck-1',
				slideObjectId: 'slide-1',
				size: 'HUGE' as never,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('slides.getNotes', () => {
	it('reads the notes shape and strips the trailing newline Google adds', async () => {
		mockRequest.mockResolvedValue(presentation.slides[0]);

		const result = await SlidesEndpoints.getNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
		});

		expect(calledUrl()).toBe(
			'https://slides.googleapis.com/v1/presentations/deck-1/pages/slide-1',
		);
		expect(result.notes).toBe('Talk about growth');
		expect(result.notesObjectId).toBe('notes-shape-1');
	});

	it('reports no notes as an empty string, not a missing field', async () => {
		mockRequest.mockResolvedValue({ objectId: 'slide-2', slideProperties: {} });

		const result = await SlidesEndpoints.getNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-2',
		});

		expect(result.notes).toBe('');
		expect(result.notesObjectId).toBeUndefined();
	});
});

describe('slides.setNotes', () => {
	it('deletes the old notes before inserting, so text is replaced not appended', async () => {
		mockRequest
			.mockResolvedValueOnce(presentation.slides[0])
			.mockResolvedValueOnce({ replies: [{}, {}] });

		const result = await SlidesEndpoints.setNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			notes: 'New notes',
		});

		expect(calledOptions(1).body).toEqual({
			requests: [
				{
					deleteText: { objectId: 'notes-shape-1', textRange: { type: 'ALL' } },
				},
				{ insertText: { objectId: 'notes-shape-1', text: 'New notes' } },
			],
		});
		expect(result.notes).toBe('New notes');
	});

	it('inserts without a delete when the slide had no notes', async () => {
		mockRequest
			.mockResolvedValueOnce({
				objectId: 'slide-1',
				slideProperties: {
					notesPage: {
						notesProperties: { speakerNotesObjectId: 'notes-shape-1' },
					},
				},
			})
			.mockResolvedValueOnce({ replies: [{}] });

		await SlidesEndpoints.setNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			notes: 'First notes',
		});

		expect(calledOptions(1).body).toEqual({
			requests: [
				{ insertText: { objectId: 'notes-shape-1', text: 'First notes' } },
			],
		});
	});

	it('clears notes with only a delete request', async () => {
		mockRequest
			.mockResolvedValueOnce(presentation.slides[0])
			.mockResolvedValueOnce({ replies: [{}] });

		const result = await SlidesEndpoints.setNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			notes: '',
		});

		expect(calledOptions(1).body).toEqual({
			requests: [
				{
					deleteText: { objectId: 'notes-shape-1', textRange: { type: 'ALL' } },
				},
			],
		});
		expect(result.notes).toBe('');
	});

	it('explains the missing notes shape instead of writing to an undefined id', async () => {
		mockRequest.mockResolvedValue({ objectId: 'slide-1', slideProperties: {} });

		await expect(
			SlidesEndpoints.setNotes(ctx, {
				presentationId: 'deck-1',
				slideObjectId: 'slide-1',
				notes: 'x',
			}),
		).rejects.toThrow(/no speaker notes shape/);
		// Only the read went out; the write was never attempted.
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('sends nothing when setting notes to the value it already has and empty', async () => {
		mockRequest.mockResolvedValueOnce({
			objectId: 'slide-1',
			slideProperties: {
				notesPage: {
					notesProperties: { speakerNotesObjectId: 'notes-shape-1' },
				},
			},
		});

		await SlidesEndpoints.setNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			notes: '',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('notesText', () => {
	it('ignores a non-text placeholder on the notes page', () => {
		const text = notesText({
			notesProperties: { speakerNotesObjectId: 'body' },
			pageElements: [
				{ objectId: 'image', shape: { placeholder: { type: 'SLIDE_IMAGE' } } },
				{
					objectId: 'body',
					shape: {
						text: { textElements: [{ textRun: { content: 'hello\n' } }] },
					},
				},
			],
		});
		expect(text).toBe('hello');
	});

	it('returns an empty string for a page with no elements', () => {
		expect(notesText({})).toBe('');
	});
});

describe('notes that hold only blank lines', () => {
	const blankNotesPage = {
		objectId: 'slide-1',
		slideProperties: {
			notesPage: {
				notesProperties: { speakerNotesObjectId: 'notes-shape-1' },
				pageElements: [
					{
						objectId: 'notes-shape-1',
						shape: {
							text: { textElements: [{ textRun: { content: '\n\n' } }] },
						},
					},
				],
			},
		},
	};

	it('reads blank-line notes as an empty string', () => {
		expect(notesText(blankNotesPage.slideProperties.notesPage)).toBe('\n');
	});

	it('still clears them, because the shape holds content', async () => {
		mockRequest
			.mockResolvedValueOnce(blankNotesPage)
			.mockResolvedValueOnce({ replies: [{}] });

		await SlidesEndpoints.setNotes(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
			notes: '',
		});

		// Stripping every trailing newline would make this look empty and skip the
		// delete, leaving the blank lines in the deck.
		expect(calledOptions(1).body).toEqual({
			requests: [
				{
					deleteText: { objectId: 'notes-shape-1', textRange: { type: 'ALL' } },
				},
			],
		});
	});

	it('removes only the single newline Google appends', () => {
		const page = (content: string) => ({
			notesProperties: { speakerNotesObjectId: 'body' },
			pageElements: [
				{
					objectId: 'body',
					shape: { text: { textElements: [{ textRun: { content } }] } },
				},
			],
		});

		expect(notesText(page('line\n'))).toBe('line');
		// A newline the user typed as the last character survives one round trip.
		expect(notesText(page('line\n\n'))).toBe('line\n');
	});
});

describe('slide-only operations verify the page type', () => {
	it('refuses to remove a shape through the slide delete', async () => {
		// A shape shares the id namespace with a slide, so the only difference the
		// guard can see is the page type Google reports for it.
		mockRequest.mockResolvedValueOnce({ objectId: 'shape-1' });

		await expect(
			SlidesEndpoints.remove(ctx, {
				presentationId: 'deck-1',
				slideObjectId: 'shape-1',
			}),
		).rejects.toThrow(/not a slide/i);
		// Only the type check went out; no delete was sent.
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('refuses to duplicate a shape', async () => {
		mockRequest.mockResolvedValueOnce({
			objectId: 'shape-1',
			pageType: 'NOTES',
		});

		await expect(
			SlidesEndpoints.duplicate(ctx, {
				presentationId: 'deck-1',
				slideObjectId: 'shape-1',
			}),
		).rejects.toThrow(/NOTES, not a slide/);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('proceeds when the page really is a slide', async () => {
		mockRequest
			.mockResolvedValueOnce({ objectId: 'slide-1', pageType: 'SLIDE' })
			.mockResolvedValueOnce({ replies: [{}] });

		const result = await SlidesEndpoints.remove(ctx, {
			presentationId: 'deck-1',
			slideObjectId: 'slide-1',
		});
		expect(result.removed).toBe(true);
	});
});

describe('size rules per element kind', () => {
	it('still requires both dimensions for a shape', async () => {
		await expect(
			ElementsEndpoints.createShape(ctx, {
				presentationId: 'deck-1',
				shapeType: 'TEXT_BOX',
				elementProperties: { pageObjectId: 'slide-1' },
			}),
		).rejects.toThrow(/both width and height/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts an image with no size, which Google defaults', async () => {
		mockRequest.mockResolvedValue({
			replies: [{ createImage: { objectId: 'image-1' } }],
		});

		const result = await ElementsEndpoints.createImage(ctx, {
			presentationId: 'deck-1',
			url: 'https://example.test/logo.png',
			elementProperties: { pageObjectId: 'slide-1' },
		});

		expect(result.objectId).toBe('image-1');
	});

	it('accepts a table with no size, which Google auto-sizes', async () => {
		mockRequest.mockResolvedValue({
			replies: [{ createTable: { objectId: 'table-1' } }],
		});

		const result = await ElementsEndpoints.createTable(ctx, {
			presentationId: 'deck-1',
			rows: 2,
			columns: 2,
			elementProperties: { pageObjectId: 'slide-1' },
		});

		expect(result.objectId).toBe('table-1');
	});

	it('rejects a half-specified size on an image', async () => {
		await expect(
			ElementsEndpoints.createImage(ctx, {
				presentationId: 'deck-1',
				url: 'https://example.test/logo.png',
				elementProperties: {
					pageObjectId: 'slide-1',
					size: { width: { magnitude: 100 } },
				},
			}),
		).rejects.toThrow(/both width and height, or neither/);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
