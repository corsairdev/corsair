import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const createEvent = await corsair.googlecalendar.api.events.create({
		calendarId: 'primary',
		event: {
			description: 'description',
			start: {
				dateTime: '2026-02-27T09:00:00-07:00',
				timeZone: 'America/Los_Angeles',
			},
			end: {
				dateTime: '2026-02-27T09:00:00-07:30',
				timeZone: 'America/Los_Angeles',
			},
			attendees: [{ email: 'johndoe@gmail.com' }],
		},
		sendNotifications: true,
	});
};

main();
