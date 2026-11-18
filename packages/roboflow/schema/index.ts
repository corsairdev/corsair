/**
 * Roboflow is the source of truth for every workspace, project, version, model and
 * image this plugin touches. Its data changes from the web app as well as the API,
 * and an annotation or training job moves without any call from here. A cached copy
 * would present a stale dataset as current. Nothing is persisted and no entities
 * are declared.
 */
export const RoboflowSchema = {
	version: '1.0.0',
	entities: {},
} as const;
