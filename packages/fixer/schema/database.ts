import { z } from 'zod';

/**
 * Cached exchange rate snapshot for one (base, date) pair.
 * https://docs.apilayer.com/fixer/docs/api-documentation?utm_source=FixerHomePage&utm_medium=Referral
 */
export const FixerRateSnapshotEntity = z.object({
	/** Official `base`. Base currency the rates are quoted against. */
	base: z.string(),
	/** Official `date`. Date the rates apply to, YYYY-MM-DD. */
	date: z.string(),
	/** Official `timestamp`. Unix timestamp of when the rates were collected. */
	timestamp: z.number(),
	/** Official `rates`. Map of currency code to exchange rate against base. */
	rates: z.record(z.string(), z.number()),
	captured_at: z.coerce.date(),
});
export type FixerRateSnapshotEntity = z.infer<typeof FixerRateSnapshotEntity>;
