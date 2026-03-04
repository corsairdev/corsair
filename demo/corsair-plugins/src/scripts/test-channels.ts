import { executePermission } from 'corsair';
import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	// const res = await executePermission(corsair, '123');

	const sdkTestChannel = await corsair
		.withTenant('default')
		.slack.db.channels.search({
			data: {
				name: 'sdk-test',
			},
		});

	const channelId = sdkTestChannel[0]?.entity_id;

	if (!channelId) {
		return;
	}

	const res = await corsair.withTenant('default').slack.api.messages.post({
		channel: channelId,
		text: 'hello',
	});
};

const main2 = async () => {
	await executePermission(corsair, '041808fb-6a56-4a8e-86c4-2d26e596fbb1');
};

main2();

// main();
