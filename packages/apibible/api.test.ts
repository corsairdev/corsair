import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeApiBibleRequest } from './client';
import {
	AudioBibles,
	AudioBooks,
	AudioChapters,
	Bibles,
	Books,
	Chapters,
	Passages,
	Search,
	Sections,
	Verses,
} from './endpoints';
import { ApiBibleEndpointOutputSchemas } from './endpoints/types';
import type { ApiBibleContext, ApiBibleKeyBuilderContext } from './index';
import { apibible } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	makeApiBibleRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeApiBibleRequest);
const mockLog = jest.mocked(logEventFromContext);

const KEY = 'test-api-key';
const ctx = { key: KEY } as ApiBibleContext;

const language = {
	id: 'eng',
	name: 'English',
	nameLocal: 'English',
	script: 'Latin',
	scriptDirection: 'LTR',
};

const country = {
	id: 'GB',
	name: 'United Kingdom',
	nameLocal: 'United Kingdom',
};

const bible = {
	id: 'de4e12af7f28f599-02',
	dblId: 'de4e12af7f28f599',
	name: 'King James (Authorised) Version',
	nameLocal: 'King James Version',
	abbreviation: 'engKJV',
	abbreviationLocal: 'KJV',
	description: 'Ecumenical',
	descriptionLocal: 'Ecumenical',
	language,
	countries: [country],
	type: 'text',
	updatedAt: '2026-01-01T00:00:00.000Z',
};

const book = {
	id: 'GEN',
	bibleId: 'bible-1',
	abbreviation: 'Gen',
	name: 'Genesis',
};

const chapter = {
	id: 'GEN.1',
	bibleId: 'bible-1',
	bookId: 'GEN',
	number: '1',
	reference: 'Genesis 1',
};

const verse = {
	id: 'GEN.1.1',
	bibleId: 'bible-1',
	bookId: 'GEN',
	chapterId: 'GEN.1',
	reference: 'Genesis 1:1',
	content: '<p>In the beginning God created the heaven and the earth.</p>',
};

const section = {
	id: 'GEN.1.2',
	bibleId: 'bible-1',
	bookId: 'GEN',
	title: 'The Beginning',
};

const audioBible = {
	id: 'audio-1',
	name: 'Audio English',
	nameLocal: 'Audio English',
	abbreviation: 'aeng',
	abbreviationLocal: 'aeng',
	description: 'Dramatised',
	descriptionLocal: 'Dramatised',
	language,
	countries: [country],
	type: 'audio',
	updatedAt: '2026-01-01T00:00:00.000Z',
};

const audioBook = {
	id: 'GEN',
	bibleId: 'audio-1',
	abbreviation: 'Gen',
	name: 'Genesis',
	nameLong: 'The First Book of Moses, called Genesis',
};

const audioChapter = {
	id: 'GEN.1',
	bibleId: 'audio-1',
	bookId: 'GEN',
	chapterId: 'GEN.1',
	number: '1',
	reference: 'Genesis 1',
	resourceUrl: 'https://cdn.example.com/audio-1/GEN.1.mp3',
	expiresAt: '2026-02-01T00:00:00.000Z',
};

describe('API.Bible endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('bibles', () => {
		it('bibles.list hits GET /bibles with language filter and logs', async () => {
			mockRequest.mockResolvedValue({ data: [bible] });

			const result = await Bibles.list(ctx, { language: 'eng' });

			expect(mockRequest).toHaveBeenCalledWith('bibles', KEY, {
				query: { language: 'eng' },
			});
			expect(ApiBibleEndpointOutputSchemas.biblesList.parse(result)).toEqual(
				result,
			);
			expect(mockLog).toHaveBeenCalledWith(
				ctx,
				'apibible.bibles.list',
				{ language: 'eng' },
				'completed',
			);
		});

		it('bibles.get hits GET /bibles/{bibleId}', async () => {
			mockRequest.mockResolvedValue({ data: bible });

			const result = await Bibles.get(ctx, { bibleId: bible.id });

			expect(mockRequest).toHaveBeenCalledWith(`bibles/${bible.id}`, KEY);
			expect(ApiBibleEndpointOutputSchemas.biblesGet.parse(result)).toEqual(
				result,
			);
			expect(mockLog).toHaveBeenCalledWith(
				ctx,
				'apibible.bibles.get',
				{ bibleId: bible.id },
				'completed',
			);
		});
	});

	describe('books', () => {
		it('books.list hits GET /bibles/{bibleId}/books', async () => {
			mockRequest.mockResolvedValue({ data: [book] });

			const result = await Books.list(ctx, { bibleId: 'bible-1' });

			expect(mockRequest).toHaveBeenCalledWith('bibles/bible-1/books', KEY);
			expect(ApiBibleEndpointOutputSchemas.booksList.parse(result)).toEqual(
				result,
			);
		});

		it('books.get hits GET /bibles/{bibleId}/books/{bookId}', async () => {
			mockRequest.mockResolvedValue({ data: book });

			const result = await Books.get(ctx, {
				bibleId: 'bible-1',
				bookId: 'GEN',
				includeChapters: true,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/books/GEN',
				KEY,
				{ query: { 'include-chapters': true } },
			);
			expect(ApiBibleEndpointOutputSchemas.booksGet.parse(result)).toEqual(
				result,
			);
		});
	});

	describe('chapters', () => {
		it('chapters.list hits GET /bibles/{bibleId}/books/{bookId}/chapters', async () => {
			mockRequest.mockResolvedValue({ data: [chapter] });

			const result = await Chapters.list(ctx, {
				bibleId: 'bible-1',
				bookId: 'GEN',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/books/GEN/chapters',
				KEY,
			);
			expect(ApiBibleEndpointOutputSchemas.chaptersList.parse(result)).toEqual(
				result,
			);
		});

		it('chapters.get maps include-* options to query params', async () => {
			mockRequest.mockResolvedValue({
				data: {
					...chapter,
					content: '<p>text</p>',
					verseCount: 31,
					next: { id: 'GEN.2', number: '2', bookId: 'GEN' },
					previous: null,
				},
				meta: { fumsToken: 'tok' },
			});

			const result = await Chapters.get(ctx, {
				bibleId: 'bible-1',
				chapterId: 'GEN.1',
				includeVerseNumbers: true,
				includeTitles: false,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/chapters/GEN.1',
				KEY,
				{
					query: {
						'include-verse-numbers': true,
						'include-titles': false,
					},
				},
			);
			expect(ApiBibleEndpointOutputSchemas.chaptersGet.parse(result)).toEqual(
				result,
			);
		});

		it('chapters.listSections hits chapter sections path', async () => {
			mockRequest.mockResolvedValue({ data: [section] });

			const result = await Chapters.listSections(ctx, {
				bibleId: 'bible-1',
				chapterId: 'GEN.1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/chapters/GEN.1/sections',
				KEY,
			);
			expect(
				ApiBibleEndpointOutputSchemas.chaptersListSections.parse(result),
			).toEqual(result);
		});
	});

	describe('verses', () => {
		it('verses.list hits GET /bibles/{bibleId}/chapters/{chapterId}/verses', async () => {
			const verseSummary = {
				id: verse.id,
				orgId: verse.id,
				bibleId: verse.bibleId,
				bookId: verse.bookId,
				chapterId: verse.chapterId,
				reference: verse.reference,
			};
			mockRequest.mockResolvedValue({ data: [verseSummary] });

			const result = await Verses.list(ctx, {
				bibleId: 'bible-1',
				chapterId: 'GEN.1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/chapters/GEN.1/verses',
				KEY,
				{ query: {} },
			);
			expect(ApiBibleEndpointOutputSchemas.versesList.parse(result)).toEqual(
				result,
			);
		});

		it('verses.get maps include-notes to a query param', async () => {
			mockRequest.mockResolvedValue({
				data: {
					...verse,
					orgId: verse.id,
					copyright: 'Public Domain',
					next: { id: 'GEN.1.2', number: '2' },
					previous: null,
				},
			});

			const result = await Verses.get(ctx, {
				bibleId: 'bible-1',
				verseId: 'GEN.1.1',
				includeNotes: true,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/verses/GEN.1.1',
				KEY,
				{ query: { 'include-notes': true } },
			);
			expect(ApiBibleEndpointOutputSchemas.versesGet.parse(result)).toEqual(
				result,
			);
		});
	});

	describe('passages', () => {
		it('passages.get hits GET /bibles/{bibleId}/passages/{passageId}', async () => {
			mockRequest.mockResolvedValue({
				data: {
					id: 'GEN.1.1-GEN.1.3',
					bibleId: 'bible-1',
					content: '<p>text</p>',
					reference: 'Genesis 1:1–3',
				},
			});

			const result = await Passages.get(ctx, {
				bibleId: 'bible-1',
				passageId: 'GEN.1.1-GEN.1.3',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/passages/GEN.1.1-GEN.1.3',
				KEY,
				{ query: {} },
			);
			expect(ApiBibleEndpointOutputSchemas.passagesGet.parse(result)).toEqual(
				result,
			);
		});
	});

	describe('sections', () => {
		it('sections.list hits GET /bibles/{bibleId}/books/{bookId}/sections', async () => {
			mockRequest.mockResolvedValue({ data: [section] });

			const result = await Sections.list(ctx, {
				bibleId: 'bible-1',
				bookId: 'GEN',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'bibles/bible-1/books/GEN/sections',
				KEY,
			);
			expect(ApiBibleEndpointOutputSchemas.sectionsList.parse(result)).toEqual(
				result,
			);
		});

		it('sections.get hits GET /bibles/{bibleId}/sections/{sectionId}', async () => {
			mockRequest.mockResolvedValue({
				data: { ...section, content: '<p>text</p>' },
			});

			const result = await Sections.get(ctx, {
				bibleId: 'bible-1',
				sectionId: section.id,
			});

			expect(mockRequest).toHaveBeenCalledWith(
				`bibles/bible-1/sections/${section.id}`,
				KEY,
				{ query: {} },
			);
			expect(ApiBibleEndpointOutputSchemas.sectionsGet.parse(result)).toEqual(
				result,
			);
		});
	});

	describe('search', () => {
		it('search.query hits GET /bibles/{bibleId}/search with query params', async () => {
			mockRequest.mockResolvedValue({
				data: {
					query: 'beginning',
					limit: 10,
					offset: 0,
					total: 1,
					verseCount: 1,
					verses: [
						{
							id: 'GEN.1.1',
							orgId: 'GEN.1.1',
							bibleId: 'bible-1',
							bookId: 'GEN',
							chapterId: 'GEN.1',
							reference: 'Genesis 1:1',
							text: 'In the beginning God created...',
						},
					],
				},
				meta: { fumsToken: 'abc' },
			});

			const result = await Search.query(ctx, {
				bibleId: 'bible-1',
				query: 'beginning',
				limit: 10,
				sort: 'canonical',
			});

			expect(mockRequest).toHaveBeenCalledWith('bibles/bible-1/search', KEY, {
				query: {
					query: 'beginning',
					limit: 10,
					offset: undefined,
					sort: 'canonical',
				},
			});
			expect(ApiBibleEndpointOutputSchemas.searchQuery.parse(result)).toEqual(
				result,
			);
		});
	});

	describe('audioBibles', () => {
		it('audioBibles.list hits GET /audio-bibles', async () => {
			mockRequest.mockResolvedValue({ data: [audioBible] });

			const result = await AudioBibles.list(ctx, { language: 'eng' });

			expect(mockRequest).toHaveBeenCalledWith('audio-bibles', KEY, {
				query: { language: 'eng' },
			});
			expect(
				ApiBibleEndpointOutputSchemas.audioBiblesList.parse(result),
			).toEqual(result);
		});

		it('audioBibles.get hits GET /audio-bibles/{audioBibleId}', async () => {
			mockRequest.mockResolvedValue({ data: audioBible });

			const result = await AudioBibles.get(ctx, { audioBibleId: 'audio-1' });

			expect(mockRequest).toHaveBeenCalledWith('audio-bibles/audio-1', KEY);
			expect(
				ApiBibleEndpointOutputSchemas.audioBiblesGet.parse(result),
			).toEqual(result);
		});
	});

	describe('audioBooks', () => {
		it('audioBooks.list hits GET /audio-bibles/{audioBibleId}/books', async () => {
			mockRequest.mockResolvedValue({ data: [audioBook] });

			const result = await AudioBooks.list(ctx, { audioBibleId: 'audio-1' });

			expect(mockRequest).toHaveBeenCalledWith(
				'audio-bibles/audio-1/books',
				KEY,
			);
			expect(
				ApiBibleEndpointOutputSchemas.audioBooksList.parse(result),
			).toEqual(result);
		});

		it('audioBooks.get hits GET /audio-bibles/{audioBibleId}/books/{bookId}', async () => {
			mockRequest.mockResolvedValue({ data: audioBook });

			const result = await AudioBooks.get(ctx, {
				audioBibleId: 'audio-1',
				bookId: 'GEN',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'audio-bibles/audio-1/books/GEN',
				KEY,
			);
			expect(ApiBibleEndpointOutputSchemas.audioBooksGet.parse(result)).toEqual(
				result,
			);
		});
	});

	describe('audioChapters', () => {
		it('audioChapters.list hits GET /audio-bibles/{audioBibleId}/books/{bookId}/chapters', async () => {
			const audioChapterSummary = {
				id: audioChapter.id,
				bibleId: audioChapter.bibleId,
				bookId: audioChapter.bookId,
				number: audioChapter.number,
				reference: audioChapter.reference,
			};
			mockRequest.mockResolvedValue({ data: [audioChapterSummary] });

			const result = await AudioChapters.list(ctx, {
				audioBibleId: 'audio-1',
				bookId: 'GEN',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'audio-bibles/audio-1/books/GEN/chapters',
				KEY,
			);
			expect(
				ApiBibleEndpointOutputSchemas.audioChaptersList.parse(result),
			).toEqual(result);
		});

		it('audioChapters.get hits GET /audio-bibles/{audioBibleId}/chapters/{chapterId}', async () => {
			mockRequest.mockResolvedValue({
				data: {
					id: audioChapter.id,
					bibleId: audioChapter.bibleId,
					bookId: audioChapter.bookId,
					number: audioChapter.number,
					reference: audioChapter.reference,
					resourceUrl: audioChapter.resourceUrl,
					expiresAt: audioChapter.expiresAt,
					next: { id: 'GEN.2', number: '2', bookId: 'GEN' },
					previous: null,
				},
			});

			const result = await AudioChapters.get(ctx, {
				audioBibleId: 'audio-1',
				chapterId: 'GEN.1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				'audio-bibles/audio-1/chapters/GEN.1',
				KEY,
			);
			expect(
				ApiBibleEndpointOutputSchemas.audioChaptersGet.parse(result),
			).toEqual(result);
		});
	});
});

describe('apibible keyBuilder authentication', () => {
	const plugin = apibible();

	it('fails through AuthMissingError instead of sending an empty api-key credential', async () => {
		// Test fakes only need the key-manager surface the keyBuilder reads.
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as ApiBibleKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the key manager is absent (no DB account)', async () => {
		const noManagerCtx = {
			authType: 'api_key',
		} as unknown as ApiBibleKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noManagerCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns the stored key when one is available', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => KEY },
		} as unknown as ApiBibleKeyBuilderContext;

		await expect(plugin.keyBuilder!(withKeyCtx, 'endpoint')).resolves.toBe(KEY);
	});
});
