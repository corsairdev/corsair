/** Runs the live smoke suite offline with account-token project requirements. */
jest.mock('./endpoints/endpoints', () => ({
	projectsList: jest.fn(async () => ({ projects: [{ id: 17 }] })),
	itemsList: jest.fn(async () => ({ items: [{ id: 8, project_id: 17 }] })),
	itemsGet: jest.fn(async () => ({ item: { id: 8 } })),
	deploysList: jest.fn(async (_ctx: never, input: { project_id?: number }) => {
		if (input.project_id !== 17) {
			throw new Error('Account-token deploy reads require project_id');
		}
		return { deploys: [] };
	}),
}));

const previousEnv = process.env;
process.env = { ...previousEnv, ROLLBAR_ACCESS_TOKEN: 'offline-account-token' };
try {
	// Register the real smoke tests, using the endpoint stubs above.
	require('./api.test');
} finally {
	process.env = previousEnv;
}
