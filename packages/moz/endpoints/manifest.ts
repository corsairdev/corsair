// Generated: one entry per Moz API method. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8): data lookups are metered reads; on-demand
// SERP collection and Moz Local actions that bill or unpublish are destructive.
import type { EndpointMetaEntry } from 'corsair/core';

const ASYNC_JOB = {
	idPath: 'async_call.id',
	status: {
		op: 'jobs.lookup',
		idArg: 'id',
		statusPath: 'async_call.status',
		done: ['complete'],
		failed: [],
	},
} as const;

export const mozMethods = {
	'anchorText.list': 'data.site.anchor-text.list',
	'competitors.fetch': 'data.site.competitor.fetch',
	'global.topDomains': 'data.global.top-domain.list',
	'global.topPages': 'data.global.top-page.list',
	'index.fetch': 'metadata.index.fetch',
	'jobs.lookup': 'async.call.lookup',
	'keywords.difficulty': 'data.keyword.metrics.difficulty.fetch',
	'keywords.generateMetrics': 'data.keyword.metrics.generate',
	'keywords.generateSerp': 'data.keyword.serp.generate',
	'keywords.intent': 'data.keyword.metrics.intent.fetch',
	'keywords.metrics': 'data.keyword.metrics.fetch',
	'keywords.metricsMultiple': 'data.keyword.metrics.fetch.multiple',
	'keywords.opportunity': 'data.keyword.metrics.opportunity.fetch',
	'keywords.priority': 'data.keyword.metrics.priority.fetch',
	'keywords.serp': 'data.keyword.serp.fetch',
	'keywords.suggestions': 'data.keyword.suggestion.list',
	'keywords.volume': 'data.keyword.metrics.volume.fetch',
	'linkingDomains.list': 'data.site.linking-domain.list',
	'linkingDomains.recentlyGained':
		'data.site.linking-domain.filter.recently-gained',
	'linkingDomains.recentlyLost':
		'data.site.linking-domain.filter.recently-lost',
	'links.filterByAnchorText': 'data.site.link.filter.anchor.text',
	'links.filterByDomain': 'data.site.link.filter.domain',
	'links.intersect': 'data.site.link.intersect.fetch',
	'links.list': 'data.site.link.list',
	'links.status': 'data.site.link.status.fetch',
	'links.statusMultiple': 'data.site.link.status.fetch.multiple',
	'local.accounts.create': 'local.account.create',
	'local.accounts.list': 'local.account.list',
	'local.accounts.lookup': 'local.account.lookup',
	'local.customFields.create': 'local.account.custom.field.create',
	'local.customFields.listForAccount':
		'local.account.custom.field.filter.account',
	'local.customFields.lookup': 'local.account.custom.field.lookup',
	'local.groups.addLocation': 'local.group.location.add',
	'local.groups.create': 'local.group.create',
	'local.groups.list': 'local.group.list',
	'local.groups.listForAccount': 'local.group.filter.account',
	'local.groups.listLocations': 'local.group.location.list',
	'local.groups.lookup': 'local.group.lookup',
	'local.groups.removeLocation': 'local.group.location.remove',
	'local.locations.cancel': 'local.location.cancel',
	'local.locations.categories': 'local.location.category.list',
	'local.locations.close': 'local.location.close',
	'local.locations.create': 'local.location.create',
	'local.locations.fieldIssues': 'local.location.network.field.issue.list',
	'local.locations.fieldStatuses': 'local.location.network.field.status.list',
	'local.locations.gbpImpressionHistory':
		'local.location.insight.gbp.impression.history.fetch',
	'local.locations.gbpImpressionTotals':
		'local.location.insight.gbp.impression.total.fetch',
	'local.locations.gbpLeadHistory':
		'local.location.insight.gbp.lead.history.fetch',
	'local.locations.levels': 'local.location.level.list',
	'local.locations.list': 'local.location.list',
	'local.locations.listByStatus': 'local.location.filter.status',
	'local.locations.listForAccount': 'local.location.filter.account',
	'local.locations.listings': 'local.location.listing.list',
	'local.locations.localGridHistory': 'local.location.local.grid.history.fetch',
	'local.locations.localGridKeywords': 'local.location.local.grid.keyword.list',
	'local.locations.lookup': 'local.location.lookup',
	'local.locations.networkStatuses': 'local.location.network.status.list',
	'local.locations.networks': 'local.location.network.list',
	'local.locations.rankingHistory': 'local.location.ranking.history.fetch',
	'local.locations.update': 'local.location.update',
	'local.locations.updateLevel': 'local.location.level.update',
	'locales.list': 'metadata.locale.list',
	'metrics.brandAuthority': 'data.site.metrics.brand.authority.fetch',
	'metrics.distributions': 'data.site.metrics.distributions.fetch',
	'metrics.fetch': 'data.site.metrics.fetch',
	'metrics.fetchMultiple': 'data.site.metrics.fetch.multiple',
	'metrics.histories': 'data.site.metrics.histories.fetch',
	'quota.lookup': 'quota.lookup',
	'rankingKeywords.count': 'data.site.ranking-keyword.count',
	'rankingKeywords.list': 'data.site.ranking-keyword.list',
	'redirects.fetch': 'data.site.redirect.fetch',
	'test.ping': 'test.ping',
	'test.pingAsync': 'test.ping.async',
	'topPages.list': 'data.site.top-page.list',
} as const;

export type MozOperationName = keyof typeof mozMethods;

export const mozEndpointMetaMap = {
	'anchorText.list': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get data about anchor text used to link to a specified site. Costs rows per result returned.',
	},
	'competitors.fetch': {
		riskLevel: 'read',
		job: ASYNC_JOB,
		description:
			'Get the top ranking competitors for a given target site, sorted by rivalry descending. Asynchronous: answers with an async_call to poll with jobs.lookup. Draws on the mozscape rows quota.',
	},
	'global.topDomains': {
		riskLevel: 'read',
		description: 'Get the top ranking domains globally. Free (no quota).',
	},
	'global.topPages': {
		riskLevel: 'read',
		description: 'Get the top ranking pages globally. Free (no quota).',
	},
	'index.fetch': {
		riskLevel: 'read',
		description:
			'Use this endpoint to track when the index is updated with new data. Free (no quota).',
	},
	'jobs.lookup': {
		riskLevel: 'read',
		description:
			'Fetch an `async_call` by ID to retrieve the result or error. Free (no quota).',
	},
	'keywords.difficulty': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent difficulty metric for any keyword that exists in our database. Costs 1 row per call.',
	},
	'keywords.generateMetrics': {
		riskLevel: 'destructive',
		job: ASYNC_JOB,
		description:
			'Trigger on-demand collection of a SERP and return the refreshed metrics once collection is complete. Asynchronous: answers with an async_call to poll with jobs.lookup. Quota cost varies by request. Runs a fresh on-demand SERP collection, billed per call.',
	},
	'keywords.generateSerp': {
		riskLevel: 'destructive',
		job: ASYNC_JOB,
		description:
			'Trigger on-demand collection of a SERP, returning it upon completion. Asynchronous: answers with an async_call to poll with jobs.lookup. Quota cost varies by request. Runs a fresh on-demand SERP collection, billed per call.',
	},
	'keywords.intent': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent search intent scores (navigational, informational, commercial, and transactional) for any keyword that exists in our database. Costs 1 row per call.',
	},
	'keywords.metrics': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent difficulty, volume, organic CTR, priority, and/or search intent metrics for any keyword that exists in our database. Costs rows per value requested.',
	},
	'keywords.metricsMultiple': {
		riskLevel: 'read',
		description:
			'Retrieve difficulty, volume, organic CTR, priority, and search intent metrics for up to 50 keywords in a single request. Costs rows per result returned.',
	},
	'keywords.opportunity': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent organic CTR (opportunity) metric for any keyword that exists in our database. Costs 1 row per call.',
	},
	'keywords.priority': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent priority metric for any keyword that exists in our database. Costs 1 row per call.',
	},
	'keywords.serp': {
		riskLevel: 'read',
		description:
			'Retrieve the most recently collected SERP for a given query. Quota cost varies by request.',
	},
	'keywords.suggestions': {
		riskLevel: 'read',
		job: ASYNC_JOB,
		description:
			'Retrieve a list of related keyword suggestions for a given input keyword. Asynchronous: answers with an async_call to poll with jobs.lookup. Costs rows per result returned.',
	},
	'keywords.volume': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent volume metric for any keyword that exists in our database. Costs 1 row per call.',
	},
	'linkingDomains.list': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get a list of linking root domains to a target, with information about each root domain and the aggregate number of links to the target. Costs rows per result returned.',
	},
	'linkingDomains.recentlyGained': {
		riskLevel: 'read',
		description:
			'This endpoint will return information about external root domains that added new links to a target during the past 60 days. Costs rows per result returned.',
	},
	'linkingDomains.recentlyLost': {
		riskLevel: 'read',
		description:
			'This endpoint will return information about root domains that removed links to a target during the past 60 days. Costs rows per result returned.',
	},
	'links.filterByAnchorText': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get a list of links to a target where the anchor text exactly matches a particular string. Costs rows per result returned.',
	},
	'links.filterByDomain': {
		riskLevel: 'read',
		description:
			'Use this endpoint to find links pointing to a target only if they originate from a particular root domain. Costs rows per result returned.',
	},
	'links.intersect': {
		riskLevel: 'read',
		description:
			'This endpoint returns information about sites that point to two or more specified domains, or that point at some domains but not others. Quota cost varies by request.',
	},
	'links.list': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get a list of links to a target. Costs rows per result returned.',
	},
	'links.status': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get the status of a link from a source to a target. Costs 1 row per call.',
	},
	'links.statusMultiple': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get the status of multiple links from a source to a target. Costs rows per result returned.',
	},
	'local.accounts.create': {
		riskLevel: 'write',
		description:
			'Creates a new Moz Local Account. Moz Local Enterprise only. Free (no quota).',
	},
	'local.accounts.list': {
		riskLevel: 'read',
		description:
			'List all Moz Local Accounts. Moz Local Enterprise only. Free (no quota).',
	},
	'local.accounts.lookup': {
		riskLevel: 'read',
		description:
			'Lookup a specific Moz Local Account by ID. Moz Local Enterprise only. Free (no quota).',
	},
	'local.customFields.create': {
		riskLevel: 'write',
		description:
			'Creates a location custom field definition on a Moz Local Account. Moz Local Enterprise only. Free (no quota).',
	},
	'local.customFields.listForAccount': {
		riskLevel: 'read',
		description:
			'List all location custom fields for a given Moz Local Account ID. Moz Local Enterprise only. Free (no quota).',
	},
	'local.customFields.lookup': {
		riskLevel: 'read',
		description:
			'Lookup a specific custom field by ID for a Moz Local Account. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.addLocation': {
		riskLevel: 'write',
		description:
			'Add a location to a group. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.create': {
		riskLevel: 'write',
		description:
			'Creates a new group in a Moz Local Account to organize locations. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.list': {
		riskLevel: 'read',
		description:
			'List all local groups. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.listForAccount': {
		riskLevel: 'read',
		description:
			'List all groups for a given Moz Local Account ID. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.listLocations': {
		riskLevel: 'read',
		description:
			'List locations in a given group. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.lookup': {
		riskLevel: 'read',
		description:
			'Lookup a specific group by ID. Moz Local Enterprise only. Free (no quota).',
	},
	'local.groups.removeLocation': {
		riskLevel: 'write',
		description:
			'Remove a location from a group. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a specific location by ID. Moz Local Enterprise only. Free (no quota). Stops the paid listing service for the location.',
	},
	'local.locations.categories': {
		riskLevel: 'read',
		description:
			'Retrieve a list of Google category IDs that can be used for `primary_category` or `additional_categories` when creating or updating a location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.close': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Closes a location, setting its status to closed and opening status to permanently closed. Moz Local Enterprise only. Free (no quota). Marks the business permanently closed on every directory.',
	},
	'local.locations.create': {
		riskLevel: 'destructive',
		description:
			'Creates a new location. Moz Local Enterprise only. Free (no quota). Adds a billed Moz Local location.',
	},
	'local.locations.fieldIssues': {
		riskLevel: 'read',
		description:
			'Returns field-level discrepancy issues for a given location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.fieldStatuses': {
		riskLevel: 'read',
		description:
			'Returns field-level listing health data for a given location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.gbpImpressionHistory': {
		riskLevel: 'read',
		description:
			"Returns Google Business Profile keyword-impression history over time (month by month) for a location's top-performing keywords. Moz Local Enterprise only. Free (no quota).",
	},
	'local.locations.gbpImpressionTotals': {
		riskLevel: 'read',
		description:
			'Returns total Google Business Profile keyword impressions for a given location and date range, ordered from most to least impressions. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.gbpLeadHistory': {
		riskLevel: 'read',
		description:
			'Returns Google Business Profile lead history over time for a given location, bucketed by day, week, or month. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.levels': {
		riskLevel: 'read',
		description:
			'List the available levels of service for locations. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.list': {
		riskLevel: 'read',
		description: 'List all locations. Free (no quota).',
	},
	'local.locations.listByStatus': {
		riskLevel: 'read',
		description: 'List locations filtered by status. Free (no quota).',
	},
	'local.locations.listForAccount': {
		riskLevel: 'read',
		description:
			'List all active locations filtered by Moz Local Account ID. Free (no quota).',
	},
	'local.locations.listings': {
		riskLevel: 'read',
		description:
			'Returns a list of listings for a given location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.localGridHistory': {
		riskLevel: 'read',
		description:
			'Returns all Local Grid results over time for a given keyword, device, engine, and location, including every dot of each grid. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.localGridKeywords': {
		riskLevel: 'read',
		description:
			'Returns the keywords available to generate a Local Grid report on for a given location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.lookup': {
		riskLevel: 'read',
		description: 'Lookup a specific location by ID. Free (no quota).',
	},
	'local.locations.networkStatuses': {
		riskLevel: 'read',
		description:
			'Returns a list of statuses per network for a given location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.networks': {
		riskLevel: 'read',
		description:
			'Returns a list of networks for a given location. Moz Local Enterprise only. Free (no quota).',
	},
	'local.locations.rankingHistory': {
		riskLevel: 'read',
		description:
			"Returns keyword ranking position over time for a location's tracked keywords. Moz Local Enterprise only. Free (no quota).",
	},
	'local.locations.update': {
		riskLevel: 'write',
		description:
			'Update a single location. Moz Local Enterprise only. Free (no quota). Moz Local publishes the change to the business listings on every directory.',
	},
	'local.locations.updateLevel': {
		riskLevel: 'destructive',
		description:
			'Updates the tier of service for a single location. Moz Local Enterprise only. Free (no quota). Changes the billed service level.',
	},
	'locales.list': {
		riskLevel: 'read',
		description:
			'Use this endpoint to list every locale a search engine supports. Free (no quota).',
	},
	'metrics.brandAuthority': {
		riskLevel: 'read',
		description:
			'This endpoint returns a Brand Authority™ score for the provided site. Costs 1 row per call.',
	},
	'metrics.distributions': {
		riskLevel: 'read',
		description: 'Fetch Site Metrics Distributions. Costs 1 row per call.',
	},
	'metrics.fetch': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get metrics such as Domain Authority, Page Authority, Spam Score, link counts and more for one URL. Costs 1 row per call.',
	},
	'metrics.fetchMultiple': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get metrics such as Domain Authority, Page Authority, Spam Score, link counts and more about one or more URLs. Costs rows per result returned.',
	},
	'metrics.histories': {
		riskLevel: 'read',
		description:
			'Use this endpoint to get daily or monthly metric histories for a single site. Costs rows per value requested.',
	},
	'quota.lookup': {
		riskLevel: 'read',
		description:
			'Check how much quota is used/available for the current billing period, as well as additional information about the quota such as whether or not overages are enabled. Free (no quota).',
	},
	'rankingKeywords.count': {
		riskLevel: 'read',
		description:
			'Retrieve a summary of the number of keywords for which the provided query (domain, subdomain, or page) ranks in the top 50. Costs 1 row per call.',
	},
	'rankingKeywords.list': {
		riskLevel: 'read',
		description:
			'Retrieve a list of keywords for which the provided site (domain, subdomain, subfolder, or page) ranks in the top 50, along with the ranking position and the difficulty and monthly search volume for each keyword. Costs rows per result returned.',
	},
	'redirects.fetch': {
		riskLevel: 'read',
		description:
			'Use this endpoint to see the final redirect target of a page after following known redirects in the index. Costs 1 row per call.',
	},
	'test.ping': {
		riskLevel: 'read',
		description:
			'Use this endpoint to verify that your integration with the Moz JSON-RPC API works end to end, without spending any quota. Free (no quota).',
	},
	'test.pingAsync': {
		riskLevel: 'read',
		job: ASYNC_JOB,
		description:
			'Use this endpoint to verify that your integration correctly handles the asynchronous methods in the Moz JSON-RPC API, without spending any quota. Asynchronous: answers with an async_call to poll with jobs.lookup. Free (no quota).',
	},
	'topPages.list': {
		riskLevel: 'read',
		description:
			'Use this endpoint to return a list of the top pages on a target domain, sorted by descending page authority, linking root domains, or external linking pages. Costs rows per result returned.',
	},
} as const satisfies Record<MozOperationName, EndpointMetaEntry>;
