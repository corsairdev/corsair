import {
	created as annotationCreated,
	updated as annotationUpdated,
} from './annotations';
import { computed } from './cohorts';
import { identify, track } from './events';
import { exposure } from './experiments';
import { alert } from './monitors';

export const EventWebhooks = { track, identify };
export const AnnotationWebhooks = {
	created: annotationCreated,
	updated: annotationUpdated,
};
export const MonitorWebhooks = { alert };
export const CohortWebhooks = { computed };
export const ExperimentWebhooks = { exposure };

export * from './types';
