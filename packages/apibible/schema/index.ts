import {
	ApiBibleAudioBible,
	ApiBibleAudioChapter,
	ApiBibleBible,
	ApiBibleBook,
	ApiBibleChapter,
	ApiBiblePassage,
	ApiBibleSection,
	ApiBibleVerse,
} from './database';

export const ApiBibleSchema = {
	version: '1.0.0',
	entities: {
		bibles: ApiBibleBible,
		books: ApiBibleBook,
		chapters: ApiBibleChapter,
		verses: ApiBibleVerse,
		passages: ApiBiblePassage,
		sections: ApiBibleSection,
		audioBibles: ApiBibleAudioBible,
		audioChapters: ApiBibleAudioChapter,
	},
} as const;
