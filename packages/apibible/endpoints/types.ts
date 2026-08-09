import { z } from 'zod';

/**
 * Shared API.Bible resource shapes.
 * API.Bible wraps every response in `{ data: ... }`; list endpoints return
 * `data` as an array, single-resource endpoints return an object.
 */

const LanguageSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		nameLocal: z.string(),
		script: z.string(),
		scriptDirection: z.string(),
	})
	.loose();

const CountrySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		nameLocal: z.string(),
	})
	.loose();

/**
 * Content display options shared by text-content endpoints (chapter, verse,
 * passage, section). API.Bible reads these via `include-*` query params.
 */
const ContentDisplayOptionsSchema = z
	.object({
		includeNotes: z.boolean().optional(),
		includeTitles: z.boolean().optional(),
		includeChapterNumbers: z.boolean().optional(),
		includeVerseNumbers: z.boolean().optional(),
		includeVerseSpans: z.boolean().optional(),
	})
	.loose();

/** Shared section shape; used by section list/get and chapter sections. */
const SectionSummarySchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		bookId: z.string(),
		title: z.string(),
		intro: z.string().nullable().optional(),
	})
	.loose();

/** Catalog: API_BIBLE_GET_SUPPORTED_VERSIONS */
const BiblesListInputSchema = z.object({
	language: z.string().optional(),
});

const BibleSchema = z
	.object({
		id: z.string(),
		dblId: z.string(),
		relatedDbl: z.string().nullable().optional(),
		name: z.string(),
		nameLocal: z.string(),
		abbreviation: z.string(),
		abbreviationLocal: z.string(),
		description: z.string(),
		descriptionLocal: z.string(),
		language: LanguageSchema,
		countries: z.array(CountrySchema),
		type: z.string(),
		updatedAt: z.string(),
		audioBibles: z.array(z.unknown()).optional(),
	})
	.loose();

const BiblesListResponseSchema = z
	.object({
		data: z.array(BibleSchema),
	})
	.loose();

export type BiblesListInput = z.infer<typeof BiblesListInputSchema>;
export type BiblesListResponse = z.infer<typeof BiblesListResponseSchema>;
export type Bible = z.infer<typeof BibleSchema>;

/** Catalog: API_BIBLE_GET_BIBLE */
const BiblesGetInputSchema = z.object({
	bibleId: z.string().min(1),
});

const BiblesGetResponseSchema = z
	.object({
		data: BibleSchema,
	})
	.loose();

export type BiblesGetInput = z.infer<typeof BiblesGetInputSchema>;
export type BiblesGetResponse = z.infer<typeof BiblesGetResponseSchema>;

/** Catalog: API_BIBLE_GET_ALL_BOOKS */
const BooksListInputSchema = z.object({
	bibleId: z.string().min(1),
});

const BookSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		abbreviation: z.string(),
		name: z.string(),
		nameLong: z.string().optional(),
	})
	.loose();

const BooksListResponseSchema = z
	.object({
		data: z.array(BookSchema),
	})
	.loose();

export type BooksListInput = z.infer<typeof BooksListInputSchema>;
export type BooksListResponse = z.infer<typeof BooksListResponseSchema>;
export type Book = z.infer<typeof BookSchema>;

/** Catalog: API_BIBLE_GET_BOOK */
const BooksGetInputSchema = z.object({
	bibleId: z.string().min(1),
	bookId: z.string().min(1),
});

const BooksGetResponseSchema = z
	.object({
		data: BookSchema,
	})
	.loose();

export type BooksGetInput = z.infer<typeof BooksGetInputSchema>;
export type BooksGetResponse = z.infer<typeof BooksGetResponseSchema>;

/** Catalog: API_BIBLE_LIST_CHAPTERS */
const ChaptersListInputSchema = z.object({
	bibleId: z.string().min(1),
	bookId: z.string().min(1),
});

const ChapterSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		bookId: z.string(),
		number: z.string(),
		reference: z.string(),
	})
	.loose();

const ChaptersListResponseSchema = z
	.object({
		data: z.array(ChapterSchema),
	})
	.loose();

export type ChaptersListInput = z.infer<typeof ChaptersListInputSchema>;
export type ChaptersListResponse = z.infer<typeof ChaptersListResponseSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;

/** Catalog: API_BIBLE_GET_CHAPTER */
const ChaptersGetInputSchema = ContentDisplayOptionsSchema.extend({
	bibleId: z.string().min(1),
	chapterId: z.string().min(1),
});

const ChapterContentSchema = ChapterSchema.extend({
	content: z.string(),
	copyright: z.string().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
}).loose();

const ChaptersGetResponseSchema = z
	.object({
		data: ChapterContentSchema,
	})
	.loose();

export type ChaptersGetInput = z.infer<typeof ChaptersGetInputSchema>;
export type ChaptersGetResponse = z.infer<typeof ChaptersGetResponseSchema>;

/** Catalog: API_BIBLE_LIST_CHAPTER_SECTIONS */
const ChaptersListSectionsInputSchema = z.object({
	bibleId: z.string().min(1),
	chapterId: z.string().min(1),
});

const ChaptersListSectionsResponseSchema = z
	.object({
		data: z.array(SectionSummarySchema),
	})
	.loose();

export type ChaptersListSectionsInput = z.infer<
	typeof ChaptersListSectionsInputSchema
>;
export type ChaptersListSectionsResponse = z.infer<
	typeof ChaptersListSectionsResponseSchema
>;

/** Catalog: API_BIBLE_LIST_VERSES */
const VersesListInputSchema = ContentDisplayOptionsSchema.extend({
	bibleId: z.string().min(1),
	chapterId: z.string().min(1),
});

const VerseSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		bookId: z.string(),
		chapterId: z.string(),
		reference: z.string(),
		content: z.string(),
	})
	.loose();

const VersesListResponseSchema = z
	.object({
		data: z.array(VerseSchema),
	})
	.loose();

export type VersesListInput = z.infer<typeof VersesListInputSchema>;
export type VersesListResponse = z.infer<typeof VersesListResponseSchema>;
export type Verse = z.infer<typeof VerseSchema>;

/** Catalog: API_BIBLE_GET_VERSE */
const VersesGetInputSchema = ContentDisplayOptionsSchema.extend({
	bibleId: z.string().min(1),
	verseId: z.string().min(1),
});

const VersesGetResponseSchema = z
	.object({
		data: VerseSchema,
	})
	.loose();

export type VersesGetInput = z.infer<typeof VersesGetInputSchema>;
export type VersesGetResponse = z.infer<typeof VersesGetResponseSchema>;

/** Catalog: API_BIBLE_GET_PASSAGE */
const PassagesGetInputSchema = ContentDisplayOptionsSchema.extend({
	bibleId: z.string().min(1),
	passageId: z.string().min(1),
});

const PassageContentSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		content: z.string(),
		reference: z.string(),
		copyright: z.string().optional(),
		ot: z.unknown().optional(),
		nt: z.unknown().optional(),
	})
	.loose();

const PassagesGetResponseSchema = z
	.object({
		data: PassageContentSchema,
	})
	.loose();

export type PassagesGetInput = z.infer<typeof PassagesGetInputSchema>;
export type PassagesGetResponse = z.infer<typeof PassagesGetResponseSchema>;

/** Catalog: API_BIBLE_GET_SECTIONS */
const SectionsListInputSchema = z.object({
	bibleId: z.string().min(1),
	bookId: z.string().min(1),
});

const SectionsListResponseSchema = z
	.object({
		data: z.array(SectionSummarySchema),
	})
	.loose();

export type SectionsListInput = z.infer<typeof SectionsListInputSchema>;
export type SectionsListResponse = z.infer<typeof SectionsListResponseSchema>;

/** Catalog: API_BIBLE_GET_SECTION */
const SectionsGetInputSchema = ContentDisplayOptionsSchema.extend({
	bibleId: z.string().min(1),
	sectionId: z.string().min(1),
});

const SectionContentSchema = SectionSummarySchema.extend({
	content: z.string(),
	copyright: z.string().optional(),
}).loose();

const SectionsGetResponseSchema = z
	.object({
		data: SectionContentSchema,
	})
	.loose();

export type SectionsGetInput = z.infer<typeof SectionsGetInputSchema>;
export type SectionsGetResponse = z.infer<typeof SectionsGetResponseSchema>;

/** Catalog: API_BIBLE_SEARCH_VERSES */
const SearchQueryInputSchema = z.object({
	bibleId: z.string().min(1),
	query: z.string().min(1),
	limit: z.number().int().min(1).max(500).optional(),
	offset: z.number().int().min(0).optional(),
	sort: z.enum(['relevance', 'canonical', 'usfm']).optional(),
});

const SearchResultSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		bookId: z.string(),
		chapterId: z.string(),
		reference: z.string(),
		content: z.string(),
	})
	.loose();

const SearchResponseSchema = z
	.object({
		data: z.array(SearchResultSchema),
		meta: z
			.object({
				fums: z.string().optional(),
				fumsId: z.string().optional(),
				fumsJsInclude: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type SearchQueryInput = z.infer<typeof SearchQueryInputSchema>;
export type SearchQueryResponse = z.infer<typeof SearchResponseSchema>;

/** Catalog: API_BIBLE_LIST_AUDIO_BIBLES */
const AudioBiblesListInputSchema = z.object({
	language: z.string().optional(),
});

const AudioBibleSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		nameLocal: z.string(),
		abbreviation: z.string(),
		abbreviationLocal: z.string(),
		description: z.string(),
		descriptionLocal: z.string(),
		language: LanguageSchema,
		countries: z.array(CountrySchema),
		type: z.string(),
		updatedAt: z.string(),
		copyright: z.string().optional(),
	})
	.loose();

const AudioBiblesListResponseSchema = z
	.object({
		data: z.array(AudioBibleSchema),
	})
	.loose();

export type AudioBiblesListInput = z.infer<typeof AudioBiblesListInputSchema>;
export type AudioBiblesListResponse = z.infer<
	typeof AudioBiblesListResponseSchema
>;
export type AudioBible = z.infer<typeof AudioBibleSchema>;

/** Catalog: API_BIBLE_GET_AUDIO_BIBLE */
const AudioBiblesGetInputSchema = z.object({
	audioBibleId: z.string().min(1),
});

const AudioBiblesGetResponseSchema = z
	.object({
		data: AudioBibleSchema,
	})
	.loose();

export type AudioBiblesGetInput = z.infer<typeof AudioBiblesGetInputSchema>;
export type AudioBiblesGetResponse = z.infer<
	typeof AudioBiblesGetResponseSchema
>;

/** Catalog: API_BIBLE_LIST_AUDIO_BOOKS */
const AudioBooksListInputSchema = z.object({
	audioBibleId: z.string().min(1),
});

const AudioBookSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		abbreviation: z.string(),
		name: z.string(),
		nameLong: z.string().optional(),
	})
	.loose();

const AudioBooksListResponseSchema = z
	.object({
		data: z.array(AudioBookSchema),
	})
	.loose();

export type AudioBooksListInput = z.infer<typeof AudioBooksListInputSchema>;
export type AudioBooksListResponse = z.infer<
	typeof AudioBooksListResponseSchema
>;
export type AudioBook = z.infer<typeof AudioBookSchema>;

/** Catalog: API_BIBLE_GET_AUDIO_BOOK */
const AudioBooksGetInputSchema = z.object({
	audioBibleId: z.string().min(1),
	bookId: z.string().min(1),
});

const AudioBooksGetResponseSchema = z
	.object({
		data: AudioBookSchema,
	})
	.loose();

export type AudioBooksGetInput = z.infer<typeof AudioBooksGetInputSchema>;
export type AudioBooksGetResponse = z.infer<typeof AudioBooksGetResponseSchema>;

/** Catalog: API_BIBLE_LIST_AUDIO_CHAPTERS */
const AudioChaptersListInputSchema = z.object({
	audioBibleId: z.string().min(1),
	bookId: z.string().min(1),
});

const AudioChapterSchema = z
	.object({
		id: z.string(),
		bibleId: z.string(),
		bookId: z.string(),
		chapterId: z.string(),
		number: z.string(),
		reference: z.string(),
		resourceUrl: z.string(),
		expiresAt: z.string(),
	})
	.loose();

const AudioChaptersListResponseSchema = z
	.object({
		data: z.array(AudioChapterSchema),
	})
	.loose();

export type AudioChaptersListInput = z.infer<
	typeof AudioChaptersListInputSchema
>;
export type AudioChaptersListResponse = z.infer<
	typeof AudioChaptersListResponseSchema
>;
export type AudioChapter = z.infer<typeof AudioChapterSchema>;

/** Catalog: API_BIBLE_GET_AUDIO_CHAPTER */
const AudioChaptersGetInputSchema = z.object({
	audioBibleId: z.string().min(1),
	chapterId: z.string().min(1),
});

const AudioChaptersGetResponseSchema = z
	.object({
		data: AudioChapterSchema,
	})
	.loose();

export type AudioChaptersGetInput = z.infer<typeof AudioChaptersGetInputSchema>;
export type AudioChaptersGetResponse = z.infer<
	typeof AudioChaptersGetResponseSchema
>;

// ── Endpoint input/output maps ────────────────────────────────────────────────

export type ApiBibleEndpointInputs = {
	biblesList: BiblesListInput;
	biblesGet: BiblesGetInput;
	booksList: BooksListInput;
	booksGet: BooksGetInput;
	chaptersList: ChaptersListInput;
	chaptersGet: ChaptersGetInput;
	chaptersListSections: ChaptersListSectionsInput;
	versesList: VersesListInput;
	versesGet: VersesGetInput;
	passagesGet: PassagesGetInput;
	sectionsList: SectionsListInput;
	sectionsGet: SectionsGetInput;
	searchQuery: SearchQueryInput;
	audioBiblesList: AudioBiblesListInput;
	audioBiblesGet: AudioBiblesGetInput;
	audioBooksList: AudioBooksListInput;
	audioBooksGet: AudioBooksGetInput;
	audioChaptersList: AudioChaptersListInput;
	audioChaptersGet: AudioChaptersGetInput;
};

export type ApiBibleEndpointOutputs = {
	biblesList: BiblesListResponse;
	biblesGet: BiblesGetResponse;
	booksList: BooksListResponse;
	booksGet: BooksGetResponse;
	chaptersList: ChaptersListResponse;
	chaptersGet: ChaptersGetResponse;
	chaptersListSections: ChaptersListSectionsResponse;
	versesList: VersesListResponse;
	versesGet: VersesGetResponse;
	passagesGet: PassagesGetResponse;
	sectionsList: SectionsListResponse;
	sectionsGet: SectionsGetResponse;
	searchQuery: SearchQueryResponse;
	audioBiblesList: AudioBiblesListResponse;
	audioBiblesGet: AudioBiblesGetResponse;
	audioBooksList: AudioBooksListResponse;
	audioBooksGet: AudioBooksGetResponse;
	audioChaptersList: AudioChaptersListResponse;
	audioChaptersGet: AudioChaptersGetResponse;
};

export const ApiBibleEndpointInputSchemas = {
	biblesList: BiblesListInputSchema,
	biblesGet: BiblesGetInputSchema,
	booksList: BooksListInputSchema,
	booksGet: BooksGetInputSchema,
	chaptersList: ChaptersListInputSchema,
	chaptersGet: ChaptersGetInputSchema,
	chaptersListSections: ChaptersListSectionsInputSchema,
	versesList: VersesListInputSchema,
	versesGet: VersesGetInputSchema,
	passagesGet: PassagesGetInputSchema,
	sectionsList: SectionsListInputSchema,
	sectionsGet: SectionsGetInputSchema,
	searchQuery: SearchQueryInputSchema,
	audioBiblesList: AudioBiblesListInputSchema,
	audioBiblesGet: AudioBiblesGetInputSchema,
	audioBooksList: AudioBooksListInputSchema,
	audioBooksGet: AudioBooksGetInputSchema,
	audioChaptersList: AudioChaptersListInputSchema,
	audioChaptersGet: AudioChaptersGetInputSchema,
} as const;

export const ApiBibleEndpointOutputSchemas = {
	biblesList: BiblesListResponseSchema,
	biblesGet: BiblesGetResponseSchema,
	booksList: BooksListResponseSchema,
	booksGet: BooksGetResponseSchema,
	chaptersList: ChaptersListResponseSchema,
	chaptersGet: ChaptersGetResponseSchema,
	chaptersListSections: ChaptersListSectionsResponseSchema,
	versesList: VersesListResponseSchema,
	versesGet: VersesGetResponseSchema,
	passagesGet: PassagesGetResponseSchema,
	sectionsList: SectionsListResponseSchema,
	sectionsGet: SectionsGetResponseSchema,
	searchQuery: SearchResponseSchema,
	audioBiblesList: AudioBiblesListResponseSchema,
	audioBiblesGet: AudioBiblesGetResponseSchema,
	audioBooksList: AudioBooksListResponseSchema,
	audioBooksGet: AudioBooksGetResponseSchema,
	audioChaptersList: AudioChaptersListResponseSchema,
	audioChaptersGet: AudioChaptersGetResponseSchema,
} as const;
