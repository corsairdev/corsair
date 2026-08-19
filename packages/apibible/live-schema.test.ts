/**
 * Parses captured live API.Bible JSON with package output schemas.
 * Skips when `.live-api/` is absent (CI / fresh clones).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ApiBibleEndpointOutputSchemas } from './endpoints/types';

const OUT = join(__dirname, '../../.live-api');
const hasCaptures = existsSync(OUT);

function load(name: string): unknown {
	return JSON.parse(readFileSync(join(OUT, `${name}.json`), 'utf8'));
}

(hasCaptures ? describe : describe.skip)(
	'live API.Bible payloads vs output schemas',
	() => {
		const cases: Array<[keyof typeof ApiBibleEndpointOutputSchemas, string]> = [
			['biblesList', 'bibles'],
			['biblesGet', 'bible_get'],
			['booksList', 'books'],
			['booksGet', 'book_get'],
			['chaptersList', 'chapters'],
			['chaptersGet', 'chapter_get'],
			['chaptersListSections', 'chapter_sections'],
			['versesList', 'verses'],
			['versesGet', 'verse_get'],
			['passagesGet', 'passage'],
			['sectionsList', 'sections_book'],
			['sectionsGet', 'section_get'],
			['searchQuery', 'search_eng'],
			['audioBiblesList', 'audio_bibles'],
			['audioBiblesGet', 'audio_bible'],
			['audioBooksList', 'audio_books'],
			['audioBooksGet', 'audio_book'],
			['audioChaptersList', 'audio_chapters'],
			['audioChaptersGet', 'audio_chapter'],
		];

		for (const [schemaKey, file] of cases) {
			it(`${schemaKey} parses ${file}.json`, () => {
				const payload = load(file);
				expect(() =>
					ApiBibleEndpointOutputSchemas[schemaKey].parse(payload),
				).not.toThrow();
			});
		}
	},
);
