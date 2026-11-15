import { getCurrentMemberInfo } from './endpoints/operations';

const apiKey = process.env.SHORTCUT_API_KEY;
if (!apiKey) {
	console.warn(
		'Skipping Shortcut live API tests: set SHORTCUT_API_KEY to run the read-only smoke test.',
	);
}

if (apiKey) {
	test('reads the authenticated Shortcut member profile', async () => {
		const member = await getCurrentMemberInfo({ key: apiKey }, {});
		expect(member).toBeDefined();
	});
} else {
	test.skip('reads the authenticated Shortcut member profile', () => undefined);
}
