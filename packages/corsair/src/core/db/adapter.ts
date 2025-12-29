export type CorsairDBAdapter = {
	/**
	 * A stable identifier for the adapter (e.g. "drizzle", "prisma", "kysely").
	 */
	id: string;

	/**
	 * The underlying database client/connection (adapter-specific).
	 */
	client: unknown;

	/**
	 * Adapter-specific configuration (e.g. provider/dialect).
	 */
	options?: Record<string, any> | undefined;

	/**
	 * Optional: let a DB adapter generate schema/migrations code.
	 * Mirrors Better Auth’s `adapter.createSchema` hook.
	 */
	createSchema?: (
		options: any,
		file?: string,
	) => Promise<{ code: string; path: string; overwrite?: boolean }>;

	/**
	 * Optional hook: run migrations / ensure tables.
	 *
	 * This is intentionally vague for now; adapters can evolve this surface.
	 */
	migrate?: (args: { schema: Record<string, any> }) => Promise<void>;
};
