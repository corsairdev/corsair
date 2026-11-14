import { runDeployHQOperation } from './endpoints/runtime';

const apiKey = process.env.DEPLOYHQ_API_KEY;
const username = process.env.DEPLOYHQ_USERNAME;
const accountSubdomain = process.env.DEPLOYHQ_ACCOUNT;
const missing = [
	['DEPLOYHQ_API_KEY', apiKey],
	['DEPLOYHQ_USERNAME', username],
	['DEPLOYHQ_ACCOUNT', accountSubdomain],
]
	.filter(([, value]) => !value)
	.map(([name]) => name);
if (missing.length > 0)
	console.warn(
		`Skipping DeployHQ live test: ${missing.join(', ')} not set, so no live request runs.`,
	);
const liveTest = missing.length === 0 ? it : it.skip;

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
