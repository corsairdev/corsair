import { ImgBBImage, ImgBBImageVariant, ImgBBSchema } from './schema';

describe('ImgBB schema', () => {
	it('declares a valid semver version', () => {
		expect(ImgBBSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares db schema entities aligned to ImgBB resources', () => {
		expect(Object.keys(ImgBBSchema.entities).sort()).toEqual(['images'].sort());
	});

	it('parses official ImgBB API image upload response into ImgBBImage entity', () => {
		const sampleResponse = {
			id: 'ynxMD85X',
			title: 'sample test',
			url_viewer: 'https://ibb.co/ynxMD85X',
			url: 'https://i.ibb.co/C5SXqnvz/sample-test.jpg',
			display_url: 'https://i.ibb.co/C5SXqnvz/sample-test.jpg',
			width: 100,
			height: 100,
			size: 1669,
			time: 1787519085,
			expiration: 0,
			image: {
				filename: 'sample-test.jpg',
				name: 'sample-test',
				mime: 'image/jpeg',
				extension: 'jpg',
				url: 'https://i.ibb.co/C5SXqnvz/sample-test.jpg',
			},
			thumb: {
				filename: 'sample-test.jpg',
				name: 'sample-test',
				mime: 'image/jpeg',
				extension: 'jpg',
				url: 'https://i.ibb.co/ynxMD85X/sample-test.jpg',
			},
			delete_url: 'https://ibb.co/ynxMD85X/addd08f8c95d3e255c73468657b66fdb',
		};

		const parsed = ImgBBImage.parse(sampleResponse);
		expect(parsed.id).toBe('ynxMD85X');
		expect(parsed.title).toBe('sample test');
		expect(parsed.url).toBe('https://i.ibb.co/C5SXqnvz/sample-test.jpg');
		expect(parsed.width).toBe(100);
		expect(parsed.height).toBe(100);
		expect(parsed.image?.url).toBe('https://i.ibb.co/C5SXqnvz/sample-test.jpg');
		expect(parsed.thumb?.url).toBe('https://i.ibb.co/ynxMD85X/sample-test.jpg');
	});

	it('coerces stringified numeric properties into numbers', () => {
		const stringifiedResponse = {
			id: '2ndCYJK',
			url: 'https://i.ibb.co/w04Prt6/test.gif',
			width: '800',
			height: '600',
			size: '91264',
			time: '1574431312',
			expiration: '600',
		};

		const parsed = ImgBBImage.parse(stringifiedResponse);
		expect(parsed.width).toBe(800);
		expect(parsed.height).toBe(600);
		expect(parsed.size).toBe(91264);
		expect(parsed.time).toBe(1574431312);
		expect(parsed.expiration).toBe(600);
	});

	it('parses image variants correctly', () => {
		const variant = {
			filename: 'preview.png',
			name: 'preview',
			mime: 'image/png',
			extension: 'png',
			url: 'https://i.ibb.co/xyz/preview.png',
		};

		const parsed = ImgBBImageVariant.parse(variant);
		expect(parsed.filename).toBe('preview.png');
		expect(parsed.url).toBe('https://i.ibb.co/xyz/preview.png');
	});

	it('preserves unknown extra fields due to loose schema', () => {
		const withExtra = {
			id: 'extra-123',
			url: 'https://i.ibb.co/test.jpg',
			custom_provider_flag: 'persisted',
		};

		const parsed = ImgBBImage.parse(withExtra) as Record<string, unknown>;
		expect(parsed.custom_provider_flag).toBe('persisted');
	});
});
