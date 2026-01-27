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
	'github/star': {
		data: {
			tenantId: string;
			sender: {
				login: string;
				name?: string;
				email?: string | null;
			};
			repository: {
				full_name: string;
			};
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
};

export const inngest = new Inngest({
	id: 'corsair-demo',
	schemas: new EventSchemas().fromRecord<Events>(),
	eventKey: process.env.INNGEST_EVENT_KEY,
});
