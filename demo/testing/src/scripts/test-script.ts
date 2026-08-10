import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

const main = async () => {
	if (process.env.AYRSHARE_API_KEY) {
		const schedule = await corsair.ayrshare.autoSchedule.set({
			schedule: ['13:05Z', '20:14Z'],
			title: 'corsair-test',
			daysOfWeek: [1, 3],
		});
		console.log('Ayrshare schedule set:', schedule.title);
		console.log('Ayrshare schedules:', await corsair.ayrshare.autoSchedule.list({}));
		console.log('Ayrshare history:', await corsair.ayrshare.posts.history({ lastRecords: 10 }));
		if (process.env.AYRSHARE_TEST_POST_ID) {
			console.log('Ayrshare post deleted:', await corsair.ayrshare.posts.delete({
				id: process.env.AYRSHARE_TEST_POST_ID,
				markManualDeleted: process.env.AYRSHARE_MARK_MANUAL_DELETED === 'true',
			}));
		}
	}
	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
