import type { CorsairPluginContext } from 'corsair/core';
import type { ScreenshotOneSchema } from './schema';

// Options stay off this type. Wiring them here pulls the endpoint tree back
// into the schema and TypeScript collapses `db` to an empty map.
export type ScreenshotOneContext = CorsairPluginContext<
	typeof ScreenshotOneSchema
>;
