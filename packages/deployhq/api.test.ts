import { runDeployHQOperation } from './endpoints/runtime';

const apiKey = process.env.DEPLOYHQ_API_KEY;
const username = process.env.DEPLOYHQ_USERNAME;
const accountSubdomain = process.env.DEPLOYHQ_ACCOUNT;
const liveTest = apiKey && username && accountSubdomain ? it : it.skip;

describe('DeployHQ live API smoke test', () => {
	liveTest('reads account details with HTTP Basic authentication', async () => {
		const result = await runDeployHQOperation(
			'account.getAccount',
			{},
			{ apiKey, username, accountSubdomain },
		);
		expect(result).toBeDefined();
	});
});
