import { EventSchemas, Inngest } from 'inngest';

type IntegrationDeadlineEvent = {
	data: {
		statusId: string;
		integrationId: string;
		userId: string;
		slug: string;
	};
};

type Events = {
	'integration/claim.created': IntegrationDeadlineEvent;
	'integration/issue.linked': IntegrationDeadlineEvent;
	'integration/pr.linked': IntegrationDeadlineEvent;
};

export const inngest = new Inngest({
	id: 'corsair-www',
	schemas: new EventSchemas().fromRecord<Events>(),
	eventKey: process.env.INNGEST_EVENT_KEY,
});

export type { Events };
