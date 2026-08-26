export interface DocusignWebhookEvent {
	event: string;
	apiVersion?: string;
	uri?: string;
	retryCount?: number;
	configurationId?: string;
	generatedDateTime?: string;
	data?: Record<string, any>;
}
