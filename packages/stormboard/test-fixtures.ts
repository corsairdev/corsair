// Fixtures built from the documented response examples in the route
// catalog served at https://api.stormboard.com/json.

export const idea = {
	id: 1000000,
	storm: { id: 49999, title: 'Play Storm' },
	x: 541,
	y: 172,
	z: 40,
	color: 'yellow',
	lock: 0,
	comments: 2,
	votes: 9,
	data: { text: 'This is an idea. Like it?' },
	type: 'text',
	task: {},
};

export const storm = {
	admin: 1,
	key: 'storm99',
	title: 'Some Clever Title',
	description: '',
	votesperadmin: -1,
	votesperuser: 10,
	avatars: 1,
	ideacreator: 0,
	chatlocked: 0,
	palette: 'standard',
	closed: false,
	favorite: 0,
	id: 49999,
	activity: 0,
	team: { id: 1 },
};

export const stormListItem = {
	id: 49999,
	type: 'storm',
	bg: '/images/storm-link-bg.png',
	title: 'Enterprise Storm',
	user_id: 5,
	admin: 1,
	favorite: 0,
	palette: 'standard',
	closed: false,
	team: { id: 1 },
	activity: 0,
};

export const stormsPage = {
	hasmore: false,
	storms: [stormListItem],
};

export const participant = {
	firstname: 'James',
	lastname: 'Dean',
	email: 'james.dean@fake.com',
	ideas: 27,
	comments: 12,
	votes: 7,
	lastactivity: '2014-03-01T20:32:56+00:00',
};

export const connector = {
	id: 9999,
	from: 1000,
	to: 1001,
	label: 'Depends On',
	style: { color: 'pink', fromEndType: '', toEndType: 'arrow' },
	points: [],
};

export const comment = {
	id: 1234,
	comment: 'My awesome comment',
	idea: { id: 1000 },
	user: { id: 999, name: 'James Dean' },
};

export const chatMessage = {
	isnew: true,
	storm: 1234,
	user: { id: 999, name: 'James Dean' },
	created: '2021-01-01T12:00:00+00:00',
	msg: 'Example Chat Message 1',
};

export const tag = {
	id: 1,
	name: 'Integration ID',
	type: 'default',
	status: 'active',
};

export const task = {
	assignees: [{ id: 1, name: 'James Dean', av: '{avatar-url}' }],
	date: { due: '2020-01-01', completed: '2020-01-02' },
	status: 'assigned',
};

export const profile = {
	auth: { api_key: 'apikeyabc123' },
	id: 5,
	firstname: 'James',
	lastname: 'Dean',
	username: 'james.dean',
	email: 'james.dean@fake.com',
	plan: 'Team',
	team: { id: '1', name: 'My Team' },
	notifications: {
		dailyemail: '0',
		newstormuser: '1',
		newsletter: '1',
	},
};

/** A Personal-plan profile as the live API answers it (11-20, trimmed). */
export const livePersonalProfile = {
	auth: { api_key: 'apikeyabc123' },
	id: 1944623,
	firstname: 'Corsair',
	lastname: 'PluginTest',
	username: 'cptest',
	email: 'test@example.com',
	plan: 'Personal',
	team: false,
	notifications: {
		dailyemail: 0,
		newstormuser: 0,
		newsletter: 0,
		commentmentions: 1,
	},
};

/** POST /ideas/connector as the live API answers it (11-20, trimmed). */
export const liveConnectorSaved = {
	message: 'Idea Connector saved',
	connector: {
		id: 2236243,
		from: 22221652,
		to: 22221653,
		label: 'corsair-plugin-test',
		style: { color: 'default', fromEndType: '', toEndType: 'arrow' },
		points: [],
		data: [],
		from_uuid: '1e7accc2-fb9b-4003-b98c-1924fe7f6c72',
		to_uuid: 'b155f49a-f298-4a90-aaa8-7ce78b42ad00',
	},
	status: 200,
};

/** GET /storms/{id}/template as the live API answers it (11-20, trimmed). */
export const liveTemplate = {
	template: [
		{
			index: 'abcdef123456',
			name: 'Section 1',
			description: '',
			character: '1',
			color: '#3bafda',
			type: 'default',
			subsections: [],
		},
	],
	status: 200,
};

export const authKey = {
	key: 'apikeyabc123',
	created: '2014-01-01T18:00:00+00:00',
	expires: 'never',
};

/** Auth failure, verified live on every route without a key. */
export const noAuth = {
	error: 'No authentication method set, it is required for this endpoint',
};

/** Validation failure, verified live on POST /users. */
export const validationFailed = {
	status: 400,
	message: 'First name cannot be blank',
};
