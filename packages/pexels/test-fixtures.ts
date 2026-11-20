/**
 * Response fixtures shaped after the Pexels API docs
 * (pexels.com/api/documentation).
 */

export const unauthorized = {
	status: 401,
	code: 'Unauthorized',
	message: 'Invalid API key',
};

export const photo = {
	id: 2014422,
	width: 4000,
	height: 6000,
	url: 'https://www.pexels.com/photo/2014422/',
	photographer: 'Jane Roe',
	photographerUrl: 'https://www.pexels.com/@jane',
	photographerId: 100,
	liked: false,
	alt: 'A mountain lake at dawn',
	src: {
		original: 'https://images.pexels.com/photos/2014422/original.jpeg',
		large2x: 'https://images.pexels.com/photos/2014422/large2x.jpeg',
		large: 'https://images.pexels.com/photos/2014422/large.jpeg',
		medium: 'https://images.pexels.com/photos/2014422/medium.jpeg',
		small: 'https://images.pexels.com/photos/2014422/small.jpeg',
		landscape: 'https://images.pexels.com/photos/2014422/landscape.jpeg',
		portrait: 'https://images.pexels.com/photos/2014422/portrait.jpeg',
		tiny: 'https://images.pexels.com/photos/2014422/tiny.jpeg',
	},
};

export const searchPhotos = {
	photos: [photo],
	page: 1,
	per_page: 1,
	total_results: 500,
	next_page: 'https://api.pexels.com/v1/search?query=nature&page=2',
};

export const curatedPhotos = {
	photos: [photo],
	page: 1,
	per_page: 1,
	total_results: 1000,
	next_page: 'https://api.pexels.com/v1/curated?page=2',
};

export const video = {
	id: 2499611,
	width: 1920,
	height: 1080,
	url: 'https://www.pexels.com/video/2499611/',
	image: 'https://images.pexels.com/videos/2499611/poster.jpg',
	duration: 12,
	user: { id: 200, name: 'John Roe', url: 'https://www.pexels.com/@john' },
	video_files: [
		{
			id: 1,
			quality: 'hd',
			file_type: 'video/mp4',
			width: 1920,
			height: 1080,
			link: 'https://videos.pexels.com/video-files/2499611/hd.mp4',
		},
	],
};

export const searchVideos = {
	videos: [video],
	page: 1,
	per_page: 1,
	total_results: 200,
	next_page: 'https://api.pexels.com/videos/search?query=waves&page=2',
};

export const popularVideos = {
	videos: [video],
	page: 1,
	per_page: 1,
	total_results: 150,
	next_page: 'https://api.pexels.com/videos/popular?page=2',
};

export const collection = {
	id: '9nkrlyb',
	title: 'Mountain landscapes',
	description: 'Best mountain shots.',
	private: false,
	itemsCount: 24,
	photosCount: 20,
	videosCount: 4,
};

export const collectionsList = {
	collections: [collection],
	page: 1,
	per_page: 1,
	total_results: 12,
	next_page: 'https://api.pexels.com/v1/collections?page=2',
};

export const collectionMedia = {
	media: [
		{ id: 2014422, type: 'Photo', photo },
		{ id: 2499611, type: 'Video', video },
	],
	page: 1,
	per_page: 2,
	total_results: 24,
	next_page: 'https://api.pexels.com/v1/collections/9nkrlyb/media?page=2',
};
