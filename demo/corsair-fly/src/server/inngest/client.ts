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
	'issue/reported': {
		data: {
			tenantId: string;
			title: string;
			description?: string;
		};
	};
	'resend/email': {
		data: {
			tenantId: string;
			from: string;
			to: string;
			subject: string;
			text?: string;
			html?: string;
		};
	};
	'test/event': {
		data: {
			message: string;
			timestamp: string;
		};
	};
};

export const inngest = new Inngest({
	id: 'corsair-fly-demo',
	schemas: new EventSchemas().fromRecord<Events>(),
	eventKey: process.env.INNGEST_EVENT_KEY,
});
