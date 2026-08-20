import {
	AimlApiAssistantEntity,
	AimlApiBatchEntity,
	AimlApiModelEntity,
	AimlApiThreadEntity,
} from './database';

export const AimlApiSchema = {
	version: '1.0.0',
	entities: {
		models: AimlApiModelEntity,
		assistants: AimlApiAssistantEntity,
		threads: AimlApiThreadEntity,
		batches: AimlApiBatchEntity,
	},
} as const;
