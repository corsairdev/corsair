import { get as audioBiblesGet, list as audioBiblesList } from './audio-bibles';
import { get as audioBooksGet, list as audioBooksList } from './audio-books';
import {
	get as audioChaptersGet,
	list as audioChaptersList,
} from './audio-chapters';
import { get as biblesGet, list as biblesList } from './bibles';
import { get as booksGet, list as booksList } from './books';
import {
	get as chaptersGet,
	list as chaptersList,
	listSections as chaptersListSections,
} from './chapters';
import { get as passagesGet } from './passages';
import { query as searchQuery } from './search';
import { get as sectionsGet, list as sectionsList } from './sections';
import { get as versesGet, list as versesList } from './verses';

export const Bibles = {
	list: biblesList,
	get: biblesGet,
};

export const Books = {
	list: booksList,
	get: booksGet,
};

export const Chapters = {
	list: chaptersList,
	get: chaptersGet,
	listSections: chaptersListSections,
};

export const Verses = {
	list: versesList,
	get: versesGet,
};

export const Passages = {
	get: passagesGet,
};

export const Sections = {
	list: sectionsList,
	get: sectionsGet,
};

export const Search = {
	query: searchQuery,
};

export const AudioBibles = {
	list: audioBiblesList,
	get: audioBiblesGet,
};

export const AudioBooks = {
	list: audioBooksList,
	get: audioBooksGet,
};

export const AudioChapters = {
	list: audioChaptersList,
	get: audioChaptersGet,
};

export * from './types';
