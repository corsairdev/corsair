import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	const res = await corsair.whatsapp.api.phoneNumbers.get({
		phoneNumberId: 'test-phone-id',
	});
	console.log('WhatsApp phone number response:', res);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
