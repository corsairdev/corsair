import { EventSchemas, Inngest } from 'inngest';

type Events = {
	'slack/event': {
		data: {
			tenantId: string;
			event: any;
			rawBody: any;
		};
	};
	'linear/event': {
		data: {
			tenantId: string;
			event: any;
			rawBody: any;
		};
	};
};

export const inngest = new Inngest({
	id: 'corsair-demo',
	schemas: new EventSchemas().fromRecord<Events>(),
});
