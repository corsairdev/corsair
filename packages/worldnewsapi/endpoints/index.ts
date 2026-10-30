import { extractNews } from './extract-news';
import { extractNewsLinks } from './extract-news-links';
import { getGeoCoordinates } from './get-geo-coordinates';
import { newsWebsiteToRssFeed } from './news-website-to-rss-feed';
import { searchNews } from './search-news';
import { searchNewsSources } from './search-news-sources';
import { topNews } from './top-news';

export const News = {
	topNews,
	extractNews,
	extractNewsLinks,
	getGeoCoordinates,
	newsWebsiteToRssFeed,
	searchNewsSources,
	searchNews,
};
