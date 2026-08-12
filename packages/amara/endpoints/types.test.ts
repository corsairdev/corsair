import {
	ActivitySchema,
	AmaraEndpointInputSchemas,
	AmaraEndpointOutputSchemas,
	LanguagesListResponseSchema,
	SubtitlesResourceSchema,
	TeamSchema,
	UserSchema,
	VideoListResponseSchema,
	VideoSchema,
} from './types';

describe('input schemas', () => {
	it('requires video_url and title when creating a video', () => {
		expect(
			AmaraEndpointInputSchemas.videosCreate.safeParse({
				video_url: 'https://example.com/v.mp4',
				title: 'Meet Amara',
			}).success,
		).toBe(true);
		expect(
			AmaraEndpointInputSchemas.videosCreate.safeParse({
				title: 'Meet Amara',
			}).success,
		).toBe(false);
		expect(
			AmaraEndpointInputSchemas.videosCreate.safeParse({
				video_url: 'https://example.com/v.mp4',
			}).success,
		).toBe(false);
	});

	it('requires exactly one of user or team for messages.send', () => {
		expect(
			AmaraEndpointInputSchemas.messagesSend.safeParse({
				subject: 'Hi',
				content: 'Hello',
				user: 'alice',
			}).success,
		).toBe(true);
		expect(
			AmaraEndpointInputSchemas.messagesSend.safeParse({
				subject: 'Hi',
				content: 'Hello',
				team: 'ability',
			}).success,
		).toBe(true);
		expect(
			AmaraEndpointInputSchemas.messagesSend.safeParse({
				subject: 'Hi',
				content: 'Hello',
			}).success,
		).toBe(false);
		expect(
			AmaraEndpointInputSchemas.messagesSend.safeParse({
				subject: 'Hi',
				content: 'Hello',
				user: 'alice',
				team: 'ability',
			}).success,
		).toBe(false);
	});

	it('requires video_id for viewDetails', () => {
		expect(
			AmaraEndpointInputSchemas.videosViewDetails.safeParse({
				video_id: 'vkMyJ7Ty7JgJ',
			}).success,
		).toBe(true);
		expect(
			AmaraEndpointInputSchemas.videosViewDetails.safeParse({}).success,
		).toBe(false);
	});
});

describe('output schemas — live Amara shapes', () => {
	it('parses a video list page', () => {
		const parsed = VideoListResponseSchema.parse({
			meta: {
				previous: null,
				next: null,
				offset: 0,
				limit: 20,
				total_count: 1,
			},
			objects: [
				{
					id: 'NI1hLjBxuTpk',
					video_type: 'Y',
					primary_audio_language_code: 'en',
					title: 'SBIE 2019 Stage 1',
					description: '',
					duration: 421,
					thumbnail: 'https://example.com/t.jpg',
					created: '2019-01-25T21:42:59Z',
					team: null,
					project: null,
					all_urls: ['http://www.youtube.com/watch?v=o0vnlylsQwc'],
					metadata: {},
					languages: [
						{
							code: 'en',
							name: 'English',
							published: false,
							dir: 'ltr',
							resource_uri:
								'https://amara.org/api/videos/NI1hLjBxuTpk/languages/en/',
							subtitles_uri:
								'https://amara.org/api/videos/NI1hLjBxuTpk/languages/en/subtitles/',
						},
					],
					activity_uri: 'https://amara.org/api/videos/NI1hLjBxuTpk/activity/',
					urls_uri: 'https://amara.org/api/videos/NI1hLjBxuTpk/urls/',
					subtitle_languages_uri:
						'https://amara.org/api/videos/NI1hLjBxuTpk/languages/',
					resource_uri: 'https://amara.org/api/videos/NI1hLjBxuTpk/',
				},
			],
		});

		expect(parsed.meta?.total_count).toBe(1);
		expect(parsed.objects?.[0]?.id).toBe('NI1hLjBxuTpk');
		expect(parsed.objects?.[0]?.team).toBeNull();
	});

	it('parses a video detail object', () => {
		const parsed = VideoSchema.parse({
			id: 'vkMyJ7Ty7JgJ',
			title: 'Meet Amara',
			team: null,
			project: null,
			all_urls: ['https://www.youtube.com/watch?v=aQ-xe-GSjdA'],
			languages: [],
			metadata: {},
		});

		expect(parsed.id).toBe('vkMyJ7Ty7JgJ');
		expect(parsed.title).toBe('Meet Amara');
	});

	it('parses a subtitles resource with cue array', () => {
		const parsed = SubtitlesResourceSchema.parse({
			version_number: 1,
			sub_format: 'json',
			subtitles: [
				{
					start: 830,
					end: 3153,
					text: 'Amara makes video globally accessible',
					position: 1,
					meta: { new_paragraph: true, region: null },
				},
			],
			author: {
				id: 'jGvdcg-jNoGc32ySWS13tD-Q4SM_0sb8-rU61IYh66o',
				uri: 'https://amara.org/api/users/id$jGvdcg/',
			},
			language: { code: 'en', dir: 'ltr', name: 'English' },
			title: 'Meet Amara',
			actions_uri:
				'https://amara.org/api/videos/x/languages/en/subtitles/actions/',
		});

		expect(parsed.sub_format).toBe('json');
		expect(Array.isArray(parsed.subtitles)).toBe(true);
		expect((parsed.subtitles as { text: string }[])[0]?.text).toContain(
			'Amara',
		);
	});

	it('parses user, team, languages, and activity fixtures', () => {
		expect(
			UserSchema.parse({
				id: '67oVmk',
				username: 'bendk',
				full_name: '',
				languages: ['en', 'fr'],
				num_videos: 4,
				is_partner: false,
				created_by: null,
			}).username,
		).toBe('bendk');

		expect(
			TeamSchema.parse({
				name: 'ABILITY Magazine',
				slug: 'ability',
				type: 'default',
				is_visible: true,
				languages_uri: 'https://amara.org/api/teams/ability/languages/',
				applications_uri: null,
				tasks_uri: null,
			}).slug,
		).toBe('ability');

		expect(
			LanguagesListResponseSchema.parse({
				languages: { en: 'English', fr: 'French' },
			}).languages.en,
		).toBe('English');

		expect(
			ActivitySchema.parse({
				id: 248188,
				type: 4,
				type_name: 'version-added',
				created: '2019-01-29T22:22:48Z',
				video: 'K1TIDcoIxhir',
				video_uri: 'https://amara.org/api/videos/K1TIDcoIxhir/',
				language: 'fr',
				language_url: 'https://amara.org/api/videos/K1TIDcoIxhir/languages/fr/',
				user: {
					id: '67oVmk',
					username: 'bendk',
					uri: 'https://amara.org/api/users/id$67oVmk/',
				},
				comment: null,
				new_video_title: null,
				resource_uri: 'https://amara.org/api/activity/248188/',
			}).type_name,
		).toBe('version-added');

		expect(
			AmaraEndpointOutputSchemas.videosDeleteUrl.parse({ ok: true }).ok,
		).toBe(true);
	});
});
