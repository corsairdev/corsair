import { createCorsair } from './base';
import type { CorsairConfig } from './index';

/**
 * Corsair initializer for configuration
 *
 * @example
 * ```ts
 * import { corsair } from "corsair";
 * import { db } from "./db";
 *
 * export const config = corsair({
 * 	dbType: "postgres",
 * 	orm: "drizzle",
 * 	framework: "nextjs",
 * 	pathToCorsairFolder: "./corsair",
 * 	apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
 * 	db: db,
 * 	connection: process.env.DATABASE_URL!,
 * 	plugins: [...],
 * });
 * ```
 */
export const corsair = <Options extends CorsairConfig<any>>(
	options: Options,
): Options => {
	return createCorsair(options);
};
