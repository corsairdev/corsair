import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';

export const crawlerIps: AhrefsEndpoints['publicCrawlerIps'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'publicCrawlerIps',
			method: 'GET',
			path: '/public/crawler-ips',
			event: 'ahrefs.public.crawlerIps',
		},
		input,
	);

export const crawlerIpRanges: AhrefsEndpoints['publicCrawlerIpRanges'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'publicCrawlerIpRanges',
			method: 'GET',
			path: '/public/crawler-ip-ranges',
			event: 'ahrefs.public.crawlerIpRanges',
		},
		input,
	);

export const domainRatingFree: AhrefsEndpoints['publicDomainRatingFree'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'publicDomainRatingFree',
			method: 'GET',
			path: '/public/domain-rating-free',
			event: 'ahrefs.public.domainRatingFree',
			logKeys: ['target'],
		},
		input,
	);

export const domainRatingFreeBatch: AhrefsEndpoints['publicDomainRatingFreeBatch'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'publicDomainRatingFreeBatch',
				method: 'POST',
				path: '/public/domain-rating-free',
				event: 'ahrefs.public.domainRatingFreeBatch',
				bodyKeys: ['targets', 'version'],
			},
			input,
		);

export const domainRatingTopDomains: AhrefsEndpoints['publicDomainRatingTopDomains'] =
	(ctx, input) =>
		callAhrefs(
			ctx,
			{
				endpoint: 'publicDomainRatingTopDomains',
				method: 'GET',
				path: '/public/domain-rating-top-domains',
				event: 'ahrefs.public.domainRatingTopDomains',
				logKeys: ['from', 'to'],
			},
			input,
		);
