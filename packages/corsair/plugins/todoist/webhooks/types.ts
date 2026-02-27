export interface TodoistWebhookPayload {
	type: string;
	created_at: string;
	data: {
		[key: string]: any;
	};
}

export interface ExampleEvent extends TodoistWebhookPayload {
	type: 'example';
	data: {
		id: string;
		[key: string]: any;
	};
}

export type TodoistWebhookOutputs = {
	example: ExampleEvent;
};

export function createTodoistMatch(eventType: string) {
	return (payload: TodoistWebhookPayload) => {
		return payload.type === eventType;
	};
}

export function verifyTodoistWebhookSignature(
	request: { payload: TodoistWebhookPayload; headers: Record<string, string> },
	secret: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
