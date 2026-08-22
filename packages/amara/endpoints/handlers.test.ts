import { makeAmaraRequest } from '../client';
import type { AmaraContext } from '../index';
import * as Activity from './activity';
import * as Languages from './languages';
import * as Messages from './messages';
import * as Teams from './teams';
import * as Users from './users';
import * as Videos from './videos';

jest.mock('../client', () => ({
	makeAmaraRequest: jest.fn(),
	compactQuery: jest.requireActual('../client').compactQuery,
	encodeAmaraPathSegment:
		jest.requireActual('../client').encodeAmaraPathSegment,
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeAmaraRequest as jest.MockedFunction<
	typeof makeAmaraRequest
>;

function ctx(): AmaraContext {
	return { key: 'k', options: {} } as unknown as AmaraContext;
}

beforeEach(() => {
	mockRequest.mockReset();
});

const video = {
	id: 'v1',
	title: 't',
	resource_uri: 'https://amara.org/api/videos/v1/',
};
const url = {
	id: 9,
	url: 'https://example.com/v.mp4',
	primary: true,
	resource_uri: 'https://amara.org/api/videos/v1/urls/9/',
};
const lang = {
	language_code: 'en',
	name: 'English',
	resource_uri: 'https://amara.org/api/videos/v1/languages/en/',
};
const subs = {
	sub_format: 'json',
	subtitles: [],
	resource_uri: 'https://amara.org/api/videos/v1/languages/en/subtitles/',
};
const note = { body: 'n', created: '2026-01-01T00:00:00Z' };
const page = { meta: { total_count: 0 }, objects: [] };
const activity = {
	id: 1,
	type: 1,
	resource_uri: 'https://amara.org/api/activity/1/',
};

describe('all Amara endpoint handlers', () => {
	it('videos.list / viewDetails / create / update', async () => {
		mockRequest.mockResolvedValueOnce(page);
		await Videos.list(ctx(), { limit: 2 });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/', 'k', {
			query: { limit: 2 },
		});

		mockRequest.mockResolvedValueOnce(video);
		await Videos.viewDetails(ctx(), { video_id: 'v1' });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/', 'k');

		mockRequest.mockResolvedValueOnce(video);
		await Videos.create(ctx(), {
			video_url: 'https://example.com/v.mp4',
			title: 't',
		});
		expect(mockRequest).toHaveBeenLastCalledWith('videos/', 'k', {
			method: 'POST',
			body: { video_url: 'https://example.com/v.mp4', title: 't' },
		});

		mockRequest.mockResolvedValueOnce(video);
		await Videos.update(ctx(), { video_id: 'v1', title: 'u' });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/', 'k', {
			method: 'PUT',
			body: { title: 'u' },
		});
	});

	it('videos urls: list / add / get / delete / makePrimary / getUrlDetails', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [url] });
		await Videos.listUrls(ctx(), { video_id: 'v1' });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/urls/', 'k', {
			query: {},
		});

		mockRequest.mockResolvedValueOnce(url);
		await Videos.addUrl(ctx(), {
			video_id: 'v1',
			url: 'https://example.com/v.mp4',
			primary: true,
		});
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/urls/', 'k', {
			method: 'POST',
			body: { url: 'https://example.com/v.mp4', primary: true },
		});

		mockRequest.mockResolvedValueOnce(url);
		await Videos.getUrl(ctx(), { video_id: 'v1', url_id: 9 });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/urls/9/', 'k');

		mockRequest.mockResolvedValueOnce({ ok: true });
		await Videos.deleteUrl(ctx(), { video_id: 'v1', url_id: 9 });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/urls/9/', 'k', {
			method: 'DELETE',
		});

		mockRequest.mockResolvedValueOnce(url);
		await Videos.makeUrlPrimary(ctx(), {
			video_id: 'v1',
			url_id: 9,
			primary: true,
		});
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/urls/9/', 'k', {
			method: 'PUT',
			body: { primary: true },
		});

		mockRequest.mockResolvedValueOnce({ objects: [video] });
		await Videos.getUrlDetails(ctx(), {
			url: 'https://example.com/v.mp4',
		});
		expect(mockRequest).toHaveBeenLastCalledWith('videos/', 'k', {
			query: { video_url: 'https://example.com/v.mp4', limit: 1 },
		});
	});

	it('videos subtitle languages / subtitles / actions / notes', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [lang] });
		await Videos.listSubtitleLanguages(ctx(), { video_id: 'v1' });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/languages/', 'k', {
			query: {},
		});

		mockRequest.mockResolvedValueOnce(lang);
		await Videos.getSubtitleLanguageDetails(ctx(), {
			video_id: 'v1',
			language_code: 'en',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/',
			'k',
		);

		mockRequest.mockResolvedValueOnce(lang);
		await Videos.createSubtitleLanguage(ctx(), {
			video_id: 'v1',
			language_code: 'fr',
		});
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/languages/', 'k', {
			method: 'POST',
			body: { language_code: 'fr' },
		});

		mockRequest.mockResolvedValueOnce(lang);
		await Videos.updateSubtitleLanguage(ctx(), {
			video_id: 'v1',
			language_code: 'en',
			subtitles_complete: true,
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/',
			'k',
			{ method: 'PUT', body: { subtitles_complete: true } },
		);

		mockRequest.mockResolvedValueOnce(subs);
		await Videos.fetchSubtitlesData(ctx(), {
			video_id: 'v1',
			language_code: 'en',
			format: 'srt',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/subtitles/',
			'k',
			{ query: { sub_format: 'srt' } },
		);

		mockRequest.mockResolvedValueOnce(subs);
		await Videos.createSubtitles(ctx(), {
			video_id: 'v1',
			language_code: 'en',
			subtitles: '1\n00:00:00,000 --> 00:00:01,000\nhi\n',
			sub_format: 'srt',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/subtitles/',
			'k',
			{
				method: 'POST',
				body: {
					subtitles: '1\n00:00:00,000 --> 00:00:01,000\nhi\n',
					sub_format: 'srt',
				},
			},
		);

		mockRequest.mockResolvedValueOnce([
			{ action: 'publish', label: 'Publish' },
		]);
		await Videos.listSubtitleActions(ctx(), {
			video_id: 'v1',
			language_code: 'en',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/subtitles/actions/',
			'k',
		);

		mockRequest.mockResolvedValueOnce({ ok: true });
		await Videos.performSubtitleAction(ctx(), {
			video_id: 'v1',
			language_code: 'en',
			action: 'publish',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/subtitles/actions/',
			'k',
			{ method: 'POST', body: { action: 'publish' } },
		);

		mockRequest.mockResolvedValueOnce({ objects: [note] });
		await Videos.listSubtitleNotes(ctx(), {
			video_id: 'v1',
			language_code: 'en',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/subtitles/notes/',
			'k',
			{ query: {} },
		);

		mockRequest.mockResolvedValueOnce(note);
		await Videos.addSubtitleNote(ctx(), {
			video_id: 'v1',
			language_code: 'en',
			body: 'n',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'videos/v1/languages/en/subtitles/notes/',
			'k',
			{ method: 'POST', body: { body: 'n' } },
		);
	});

	it('videos.listActivity', async () => {
		mockRequest.mockResolvedValueOnce({ objects: [activity] });
		await Videos.listActivity(ctx(), { video_id: 'v1', limit: 1 });
		expect(mockRequest).toHaveBeenLastCalledWith('videos/v1/activity/', 'k', {
			query: { limit: 1 },
		});
	});

	it('users / teams / activity / languages / messages', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 'u1',
			username: 'me',
			resource_uri: 'https://amara.org/api/users/id$u1/',
		});
		await Users.getData(ctx(), { identifier: 'id$u1' });
		expect(mockRequest).toHaveBeenLastCalledWith('users/id$u1/', 'k');

		mockRequest.mockResolvedValueOnce({ objects: [activity] });
		await Users.getActivity(ctx(), { identifier: 'id$u1', limit: 2 });
		expect(mockRequest).toHaveBeenLastCalledWith('users/id$u1/activity/', 'k', {
			query: { limit: 2 },
		});

		mockRequest.mockResolvedValueOnce({ objects: [{ slug: 'ability' }] });
		await Teams.list(ctx(), { limit: 1 });
		expect(mockRequest).toHaveBeenLastCalledWith('teams/', 'k', {
			query: { limit: 1 },
		});

		mockRequest.mockResolvedValueOnce({
			slug: 'ability',
			name: 'ABILITY Magazine',
		});
		await Teams.getDetails(ctx(), { slug: 'ability' });
		expect(mockRequest).toHaveBeenLastCalledWith('teams/ability/', 'k');

		mockRequest.mockResolvedValueOnce({
			preferred: 'https://amara.org/api/teams/ability/languages/preferred/',
			blacklisted: 'https://amara.org/api/teams/ability/languages/blacklisted/',
		});
		await Teams.getLanguages(ctx(), { slug: 'ability' });
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/languages/',
			'k',
		);

		// Teams Projects
		mockRequest.mockResolvedValueOnce({
			objects: [{ slug: 'proj1', name: 'Project 1' }],
		});
		await Teams.listProjects(ctx(), { team_slug: 'ability', limit: 5 });
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/projects/',
			'k',
			{ query: { limit: 5 } },
		);

		mockRequest.mockResolvedValueOnce({
			slug: 'proj1',
			name: 'Project 1',
		});
		await Teams.getProject(ctx(), {
			team_slug: 'ability',
			project_slug: 'proj1',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/projects/proj1/',
			'k',
		);

		mockRequest.mockResolvedValueOnce({
			slug: 'proj1',
			name: 'Project 1',
		});
		await Teams.createProject(ctx(), {
			team_slug: 'ability',
			slug: 'proj1',
			name: 'Project 1',
			description: 'desc',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/projects/',
			'k',
			{
				method: 'POST',
				body: { slug: 'proj1', name: 'Project 1', description: 'desc' },
			},
		);

		mockRequest.mockResolvedValueOnce({
			slug: 'proj1',
			name: 'Project 1 Updated',
		});
		await Teams.updateProject(ctx(), {
			team_slug: 'ability',
			project_slug: 'proj1',
			name: 'Project 1 Updated',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/projects/proj1/',
			'k',
			{
				method: 'PUT',
				body: { name: 'Project 1 Updated' },
			},
		);

		mockRequest.mockResolvedValueOnce({ ok: true });
		await Teams.deleteProject(ctx(), {
			team_slug: 'ability',
			project_slug: 'proj1',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/projects/proj1/',
			'k',
			{
				method: 'DELETE',
			},
		);

		// Teams Members
		mockRequest.mockResolvedValueOnce({
			objects: [{ user: 'alice', role: 'manager' }],
		});
		await Teams.listMembers(ctx(), { team_slug: 'ability', limit: 10 });
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/members/',
			'k',
			{ query: { limit: 10 } },
		);

		mockRequest.mockResolvedValueOnce({
			user: 'alice',
			role: 'manager',
		});
		await Teams.getMember(ctx(), {
			team_slug: 'ability',
			username: 'alice',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/members/alice/',
			'k',
		);

		mockRequest.mockResolvedValueOnce({
			user: 'bob',
			role: 'contributor',
		});
		await Teams.addMember(ctx(), {
			team_slug: 'ability',
			user: 'bob',
			role: 'contributor',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/members/',
			'k',
			{
				method: 'POST',
				body: { user: 'bob', role: 'contributor' },
			},
		);

		mockRequest.mockResolvedValueOnce({
			user: 'bob',
			role: 'manager',
		});
		await Teams.updateMember(ctx(), {
			team_slug: 'ability',
			username: 'bob',
			role: 'manager',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/members/bob/',
			'k',
			{
				method: 'PUT',
				body: { role: 'manager' },
			},
		);

		mockRequest.mockResolvedValueOnce({ ok: true });
		await Teams.removeMember(ctx(), {
			team_slug: 'ability',
			username: 'bob',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/members/bob/',
			'k',
			{
				method: 'DELETE',
			},
		);

		// Teams Tasks
		mockRequest.mockResolvedValueOnce({
			objects: [{ id: 12, type: 'Translate', priority: 1 }],
		});
		await Teams.listTasks(ctx(), {
			team_slug: 'ability',
			type: 'Translate',
		});
		expect(mockRequest).toHaveBeenLastCalledWith('teams/ability/tasks/', 'k', {
			query: { type: 'Translate' },
		});

		mockRequest.mockResolvedValueOnce({
			id: 12,
			type: 'Translate',
			priority: 1,
		});
		await Teams.getTask(ctx(), {
			team_slug: 'ability',
			task_id: 12,
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/tasks/12/',
			'k',
		);

		// Teams Applications
		mockRequest.mockResolvedValueOnce({
			objects: [{ id: 99, status: 'pending' }],
		});
		await Teams.listApplications(ctx(), {
			team_slug: 'ability',
			status: 'pending',
		});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'teams/ability/applications/',
			'k',
			{ query: { status: 'pending' } },
		);

		mockRequest.mockResolvedValueOnce({ objects: [activity] });
		await Activity.list(ctx(), { limit: 1, type: 9 });
		expect(mockRequest).toHaveBeenLastCalledWith('activity/', 'k', {
			query: { limit: 1, type: 9 },
		});

		mockRequest.mockResolvedValueOnce(activity);
		await Activity.get(ctx(), { activity_id: 1 });
		expect(mockRequest).toHaveBeenLastCalledWith('activity/1/', 'k');

		mockRequest.mockResolvedValueOnce({ languages: { en: 'English' } });
		await Languages.listAvailable(ctx(), {});
		expect(mockRequest).toHaveBeenLastCalledWith('languages/', 'k');

		mockRequest.mockResolvedValueOnce({});
		await Messages.send(ctx(), {
			subject: 'Hi',
			content: 'Hello',
			user: 'alice',
		});
		expect(mockRequest).toHaveBeenLastCalledWith('message/', 'k', {
			method: 'POST',
			body: { subject: 'Hi', content: 'Hello', user: 'alice' },
		});
	});
});
