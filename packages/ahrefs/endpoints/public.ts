import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type {
	PublicCrawlerIpRangesResponse,
	PublicCrawlerIpsResponse,
	PublicDomainRatingFreeBatchResponse,
	PublicDomainRatingFreeResponse,
	PublicDomainRatingTopDomainsResponse,
} from './types';

export const crawlerIps: AhrefsEndpoints['publicCrawlerIps'] = (ctx, input) =>
	callAhrefs<PublicCrawlerIpsResponse>(
		ctx,
		{
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
	callAhrefs<PublicCrawlerIpRangesResponse>(
		ctx,
		{
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
	callAhrefs<PublicDomainRatingFreeResponse>(
		ctx,
		{
			method: 'GET',
			path: '/public/domain-rating-free',
			event: 'ahrefs.public.domainRatingFree',
			logKeys: ['target'],
		},
		input,
	);

export const domainRatingFreeBatch: AhrefsEndpoints['publicDomainRatingFreeBatch'] =
	(ctx, input) =>
		callAhrefs<PublicDomainRatingFreeBatchResponse>(
			ctx,
			{
				method: 'POST',
				path: '/public/domain-rating-free',
				event: 'ahrefs.public.domainRatingFreeBatch',
				bodyKeys: ['targets', 'version'],
			},
			input,
		);

export const domainRatingTopDomains: AhrefsEndpoints['publicDomainRatingTopDomains'] =
	(ctx, input) =>
		callAhrefs<PublicDomainRatingTopDomainsResponse>(
			ctx,
			{
				method: 'GET',
				path: '/public/domain-rating-top-domains',
				event: 'ahrefs.public.domainRatingTopDomains',
				logKeys: ['from', 'to'],
			},
			input,
		);
