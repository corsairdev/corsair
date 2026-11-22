// Response shapes taken from Listen Notes' mock server (listen-api-test.listennotes.com), which serves
// the same structure as the production API. Trimmed; no personal data.
import {
	CuratedGetResponseSchema,
	GenresListResponseSchema,
	PodcastsGetBestInputSchema,
} from './endpoints/types';

describe('Listen Notes response shapes from the mock server', () => {
	it('accepts curated-list podcasts with null publisher and country', () => {
		const response = {
			id: 'SDFKduyJ47r',
			title: '16 Brilliant Indian Podcasts',
			total: 1,
			podcasts: [
				{
					id: 'b9aa8bbb9e3c426980275b8b052a1215',
					title: 'Sixth World Radio',
					publisher: null,
					image: 'https://cdn-images-1.listennotes.com/podcasts/example.jpg',
					country: null,
					email: null,
					website: 'http://ishaanlalit.com/sixthworldradio',
					language: 'English',
					listen_score: null,
					listen_score_global_rank: null,
					genre_ids: [67, 99, 127, 131, 133],
				},
			],
		};
		const parsed = CuratedGetResponseSchema.parse(response);
		expect(parsed.podcasts[0]?.publisher).toBeNull();
		expect(parsed.podcasts[0]?.country).toBeNull();
	});

	it('takes a numeric genre id from genres.list in podcasts.getBest', () => {
		const genres = GenresListResponseSchema.parse({
			genres: [{ id: 93, name: 'Business', parent_id: 67 }],
		});
		const genreId = genres.genres[0]?.id;
		expect(
			PodcastsGetBestInputSchema.safeParse({ genre_id: genreId }).success,
		).toBe(true);
		expect(
			PodcastsGetBestInputSchema.safeParse({ genre_id: '93' }).success,
		).toBe(true);
		expect(
			PodcastsGetBestInputSchema.safeParse({ genre_id: 'business' }).success,
		).toBe(false);
	});
});
