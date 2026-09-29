export type IntegrationRiskLevel = 'read' | 'write' | 'destructive';

export type IntegrationCapabilityAction = {
	id: string;
	label: string;
	description?: string;
	popular?: boolean;
	riskLevel?: IntegrationRiskLevel;
};

export type IntegrationCapabilityGroup = {
	resource: string;
	resourceLabel: string;
	actions: IntegrationCapabilityAction[];
};

export type IntegrationFaqItem = {
	id: string;
	question: string;
	answer: string;
};

export type IntegrationPageContent = {
	id: string;
	displayName: string;
	blurb: string;
	popularOperationIds: string[];
	faqs: IntegrationFaqItem[];
};

export type IntegrationPluginData = {
	id: string;
	displayName: string;
	description: string;
	counts: {
		api: number;
		webhooks: number;
		db: number;
	};
	operations: IntegrationCapabilityGroup[];
	triggers: IntegrationCapabilityGroup[];
};

export type IntegrationDetailData = IntegrationPageContent &
	IntegrationPluginData;
