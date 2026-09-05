export type NangoIntegrationEntry = {
	id: string;
	name: string;
	hasOperations: boolean;
	operationCount: number;
};

export type NangoIntegrationsCatalog = {
	generatedAt: string;
	stats: {
		total: number;
		withOperations: number;
		withoutOperations: number;
		percentWithoutOperations: number;
	};
	integrations: NangoIntegrationEntry[];
};
