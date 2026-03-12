import { track, identify } from './events';
import { created as annotationCreated, updated as annotationUpdated } from './annotations';
import { alert } from './monitors';
import { computed } from './cohorts';
import { exposure } from './experiments';

export const EventWebhooks = { track, identify };
export const AnnotationWebhooks = { created: annotationCreated, updated: annotationUpdated };
export const MonitorWebhooks = { alert };
export const CohortWebhooks = { computed };
export const ExperimentWebhooks = { exposure };

export * from './types';
