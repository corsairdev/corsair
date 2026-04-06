import type { MessageEvent } from '@corsair-dev/slack';
import { EventSchemas, Inngest } from 'inngest';

type Events = {
	'slack/event': {
		data: {
			tenantId: string;
			event: MessageEvent;
		};
	};
};

export const inngest = new Inngest({
	id: 'corsair-demo',
	schemas: new EventSchemas().fromRecord<Events>(),
	eventKey: process.env.INNGEST_EVENT_KEY,
});
