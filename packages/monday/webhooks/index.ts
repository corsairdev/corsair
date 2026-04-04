import { challenge } from './challenge';
import { itemCreated } from './item-created';
import { columnValueChanged } from './column-value-changed';
import { statusChanged } from './status-changed';

export const ChallengeWebhooks = {
	challenge,
};

export const ItemWebhooks = {
	itemCreated,
};

export const ColumnWebhooks = {
	columnValueChanged,
};

export const StatusWebhooks = {
	statusChanged,
};

export * from './types';
