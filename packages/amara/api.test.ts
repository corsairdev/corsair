import { AmaraAPIError, makeAmaraRequest } from './client';
import { AmaraEndpointOutputSchemas } from './endpoints/types';

/**
 * Live contract tests — they call the real Amara API and therefore need a key.
 *
 * Run locally with:
 *   AMARA_API_KEY=... pnpm --filter @corsair-dev/amara test api.test.ts
 *
 * The suite skips itself when no key is present so a keyless local run stays green.
 */
jest.setTimeout(60_000);

const API_KEY = process.env.AMARA_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

const KNOWN_VIDEO_ID = 'vkMyJ7Ty7JgJ';
const KNOWN_VIDEO_URL = 'http://www.youtube.com/watch?v=AtmU1ZtPIlo';

describeLive('Amara API contract', () => {
	const key = API_KEY as string;

	it('users/me matches the user output schema', async () => {
		const response = await makeAmaraRequest('users/me/', key);
		const parsed = AmaraEndpointOutputSchemas.usersGetData.parse(response);
		expect(parsed.id || parsed.username).toBeTruthy();
	});

	it('languages list matches the output schema', async () => {
		const response = await makeAmaraRequest('languages/', key);
		const parsed =
			AmaraEndpointOutputSchemas.languagesListAvailable.parse(response);
		expect(typeof parsed.languages).toBe('object');
		expect(parsed.languages.en).toBe('English');
	});

	it('videos list matches the output schema', async () => {
		const response = await makeAmaraRequest('videos/', key, {
			query: { limit: 5 },
		});
		const parsed = AmaraEndpointOutputSchemas.videosList.parse(response);
		expect(Array.isArray(parsed.objects)).toBe(true);
		expect(typeof parsed.meta?.total_count).toBe('number');
	});

	it('video view details for a known video matches the schema', async () => {
		const response = await makeAmaraRequest(`videos/${KNOWN_VIDEO_ID}/`, key);
		const parsed = AmaraEndpointOutputSchemas.videosViewDetails.parse(response);
		expect(parsed.id).toBe(KNOWN_VIDEO_ID);
	});

	it('subtitle languages for a known video match the schema', async () => {
		const response = await makeAmaraRequest(
			`videos/${KNOWN_VIDEO_ID}/languages/`,
			key,
		);
		const parsed =
			AmaraEndpointOutputSchemas.videosListSubtitleLanguages.parse(response);
		expect(Array.isArray(parsed.objects)).toBe(true);
	});

	it('fetch subtitles for a known video language matches the schema', async () => {
		const languages = await makeAmaraRequest<{
			objects?: Array<{ language_code?: string }>;
		}>(`videos/${KNOWN_VIDEO_ID}/languages/`, key);

		const languageCode = languages.objects?.[0]?.language_code ?? 'en';
		const response = await makeAmaraRequest(
			`videos/${KNOWN_VIDEO_ID}/languages/${languageCode}/subtitles/`,
			key,
			{ query: { sub_format: 'json' } },
		);
		const parsed =
			AmaraEndpointOutputSchemas.videosFetchSubtitlesData.parse(response);
		expect(
			parsed.sub_format === undefined || typeof parsed.sub_format === 'string',
		).toBe(true);
	});

	it('teams list/details/languages match schemas', async () => {
		const list = AmaraEndpointOutputSchemas.teamsList.parse(
			await makeAmaraRequest('teams/', key, { query: { limit: 2 } }),
		);
		expect(Array.isArray(list.objects)).toBe(true);

		const details = AmaraEndpointOutputSchemas.teamsGetDetails.parse(
			await makeAmaraRequest('teams/ability/', key),
		);
		expect(details.slug).toBe('ability');

		const languages = AmaraEndpointOutputSchemas.teamsGetLanguages.parse(
			await makeAmaraRequest('teams/ability/languages/', key),
		);
		expect(
			typeof languages.preferred === 'string' ||
				languages.preferred === undefined,
		).toBe(true);
	});

	it('activity list/get match schemas', async () => {
		const list = AmaraEndpointOutputSchemas.activityList.parse(
			await makeAmaraRequest('activity/', key, { query: { limit: 2 } }),
		);
		expect(Array.isArray(list.objects)).toBe(true);
		const id = list.objects?.[0]?.id;
		expect(id).toBeTruthy();

		const one = AmaraEndpointOutputSchemas.activityGet.parse(
			await makeAmaraRequest(`activity/${id}/`, key),
		);
		expect(one.id).toBe(id);
	});

	it('video urls list/get and url lookup match schemas', async () => {
		const urls = AmaraEndpointOutputSchemas.videosListUrls.parse(
			await makeAmaraRequest(`videos/${KNOWN_VIDEO_ID}/urls/`, key),
		);
		expect((urls.objects?.length ?? 0) > 0).toBe(true);
		const urlId = urls.objects?.[0]?.id;
		expect(typeof urlId).toBe('number');

		const one = AmaraEndpointOutputSchemas.videosGetUrl.parse(
			await makeAmaraRequest(`videos/${KNOWN_VIDEO_ID}/urls/${urlId}/`, key),
		);
		expect(one.id).toBe(urlId);

		const byUrl = AmaraEndpointOutputSchemas.videosGetUrlDetails.parse(
			await makeAmaraRequest('videos/', key, {
				query: { video_url: KNOWN_VIDEO_URL, limit: 1 },
			}),
		);
		expect(byUrl.objects?.[0]?.id).toBe(KNOWN_VIDEO_ID);
	});

	it('subtitle language details and video activity match schemas', async () => {
		const lang =
			AmaraEndpointOutputSchemas.videosGetSubtitleLanguageDetails.parse(
				await makeAmaraRequest(`videos/${KNOWN_VIDEO_ID}/languages/en/`, key),
			);
		expect(lang.language_code).toBe('en');

		const activity = AmaraEndpointOutputSchemas.videosListActivity.parse(
			await makeAmaraRequest(`videos/${KNOWN_VIDEO_ID}/activity/`, key, {
				query: { limit: 2 },
			}),
		);
		expect(Array.isArray(activity.objects)).toBe(true);
	});

	it('users.getData accepts id$ identifiers without mangling $', async () => {
		const me = AmaraEndpointOutputSchemas.usersGetData.parse(
			await makeAmaraRequest('users/me/', key),
		);
		expect(me.id).toBeTruthy();

		const byId = AmaraEndpointOutputSchemas.usersGetData.parse(
			await makeAmaraRequest(`users/id$${me.id}/`, key),
		);
		expect(byId.id).toBe(me.id);
	});

	it('users.getActivity is available when Amara exposes it for the user', async () => {
		// Live user payloads currently omit activity_uri and /activity/ often
		// 404s for this key — still verify the path + schema when it works.
		const me = AmaraEndpointOutputSchemas.usersGetData.parse(
			await makeAmaraRequest('users/me/', key),
		);
		try {
			const activity = AmaraEndpointOutputSchemas.usersGetActivity.parse(
				await makeAmaraRequest(`users/id$${me.id}/activity/`, key, {
					query: { limit: 2 },
				}),
			);
			expect(activity.meta || Array.isArray(activity.objects)).toBeTruthy();
		} catch (error) {
			expect(String(error)).toMatch(/404|Not Found/i);
		}
	});

	it('videos.create reports team requirement clearly for this API key', async () => {
		// This Amara account requires a team on create; public teams reject us.
		let createdId: string | undefined;
		try {
			const created = AmaraEndpointOutputSchemas.videosCreate.parse(
				await makeAmaraRequest('videos/', key, {
					method: 'POST',
					body: {
						video_url: 'https://www.youtube.com/watch?v=BaW_jenozKc',
						title: 'Corsair Amara plugin smoke',
						primary_audio_language_code: 'en',
					},
				}),
			);
			createdId = created.id;
			expect(created.id).toBeTruthy();
		} catch (error) {
			expect(error).toBeInstanceOf(AmaraAPIError);
			const amaraError = error as AmaraAPIError;
			expect(amaraError.status).toBe(400);
			expect(JSON.stringify(amaraError.body ?? amaraError.message)).toMatch(
				/Team is required/i,
			);
		} finally {
			if (createdId) {
				await makeAmaraRequest(`videos/${createdId}/`, key, {
					method: 'DELETE',
				});
			}
		}
	});
});
