/**
 * Google Ads data is read through GAQL, which returns whatever the query
 * selects at the moment it runs. Nothing is mirrored locally, so there are no
 * entities: a stored row would go stale as soon as a campaign changed.
 */
export const GoogleAdsSchema = {
	version: '1.0.0',
	entities: {},
} as const;
