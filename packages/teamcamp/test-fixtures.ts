export const workspace = {
	workspaceId: '5-YTy0zgMFoXJSV4joyB5',
	workspaceName: 'test',
	createdBy: 'corsair test',
};

export const user = {
	id: 'iXH_-M_COvz453E5uQgoJ',
	name: 'corsair test',
	email: 'corsairtest00@gmail.com',
	phone: '',
	timezone: 'India Standard Time',
	dateFormat: 'DD MMM YYYY',
	profile_photo:
		'https://lh3.googleusercontent.com/a/ACg8ocIhwmIOHVaRujQXY9K6Za1XELrCroGSN6gQA8xjSvYCHMBuvA=s96-c',
	isOwner: true,
	isAdmin: true,
	lastSeen: '2026-11-10T12:34:45.461Z',
};

export const userList = [user];

// unknown: the live answer was an empty array, so there is no element shape to
export const customerList = [] as unknown[];

export const project = {
	projectId: '0uUAD4N11-tUA00rNE2EB',
	projectName: 'Corsair Probe Project',
	workspaceId: '5-YTy0zgMFoXJSV4joyB5',
	ownerId: 'iXH_-M_COvz453E5uQgoJ',
	description: null,
	projectUsers: ['iXH_-M_COvz453E5uQgoJ'],
	favoriteUsers: [],
	statusEnable: true,
	estimate: false,
	priority: false,
	status: [
		{
			Name: 'Todo',
			Type: 2,
			_id: 'ppxah6OgUcGXclowmNm8D',
			Index: 1794314740091,
			Default: true,
		},
		{
			Name: 'In Progress',
			Type: 3,
			_id: 'jAFtc3UjNS7-N-5vx90Qu',
			Index: 1794314740091,
		},
		{
			Name: 'In Review',
			Type: 4,
			_id: 'bS9P6-Tk1adUtCu-XGB4W',
			Index: 1794314740091,
		},
		{
			Name: 'Done',
			Type: 5,
			_id: 'vN7len0mJf_KViEbWGoix',
			Index: 1794314740091,
		},
	],
};

export const projectDetail = {
	projectId: 'iPSOnKVs4zSOR5-vQTK_3',
	projectName: 'Getting Started',
	workspaceId: '5-YTy0zgMFoXJSV4joyB5',
	ownerId: 'iXH_-M_COvz453E5uQgoJ',
	description: null,
	projectUsers: ['iXH_-M_COvz453E5uQgoJ'],
	favoriteUsers: ['iXH_-M_COvz453E5uQgoJ'],
	statusEnable: true,
	estimate: false,
	priority: false,
	startDate: '2026-11-10T12:35:03.114Z',
	status: project.status,
};

export const archivedProject = {
	...project,
	archived: true,
};

export const projectList = [
	{ projectId: 'iPSOnKVs4zSOR5-vQTK_3', projectName: 'Getting Started' },
];

// unknown: same as customerList: an empty live answer with no element shape.
export const groupList = [] as unknown[];

export const taskSummary = {
	taskId: 'VgPahrw0YaDq-1AnJQXSx',
	taskName: 'Connect Figma',
	status: false,
	statusId: 'gGtIVfih4xc9mVnlMByIi',
	createdAt: '2026-11-10T12:35:03.114Z',
	updatedAt: '2026-11-10T12:35:03.114Z',
	id: 'VgPahrw0YaDq-1AnJQXSx',
};

export const taskList = [taskSummary];

export const task = {
	taskId: 'HbQJf4Lc2nJv5djKH4zCU',
	taskName: 'Corsair probe',
	projectId: 'iPSOnKVs4zSOR5-vQTK_3',
	status: false,
	subscribers: [],
	groupId: null,
	group: null,
	taskUsers: [],
	description: '',
	files: [],
	labels: [],
	comments: [
		{
			_id: '8jqHIXnP5_p9_We9-qey3',
			CreatedBy: 'iXH_-M_COvz453E5uQgoJ',
			UpdatedBy: 'iXH_-M_COvz453E5uQgoJ',
			CreatedTime: '2026-11-10T12:45:42.962Z',
			UpdatedTime: '2026-11-10T12:45:42.962Z',
			Type: 17,
		},
	],
	createdBy: 'iXH_-M_COvz453E5uQgoJ',
	createdTime: '2026-11-10T12:45:42.962Z',
	updatedBy: 'iXH_-M_COvz453E5uQgoJ',
	updatedTime: '2026-11-10T12:45:42.962Z',
	links: [],
};

export const deleteMessage = 'The project has been deleted successfully.';

export const invalidKeyBody = '"Invalid API key!!!"';

export const missingProjectId = { error: 'ProjectId is required' };

export const missingTaskName = { error: 'Task Name is required.' };
