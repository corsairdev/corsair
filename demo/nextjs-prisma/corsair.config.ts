import type { CorsairConfig } from "corsair";
import { config as dotenvConfig } from "dotenv";
import { db } from "./db";

dotenvConfig({ path: ".env.local" });

export const config = {
	dbType: "postgres",
	orm: "prisma",
	framework: "nextjs",
	pathToCorsairFolder: "./corsair",
	apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
	db,
	connection: process.env.DATABASE_URL!,
	plugins: {
		slack: {
			token: "",
			channels: {
				general: "id-1",
				technology: "id-2",
				"notifications-error": "id-2",
			},
		},
	},
} satisfies CorsairConfig<typeof db>;

export type Config = typeof config;
