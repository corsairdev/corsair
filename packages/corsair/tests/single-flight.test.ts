import { singleFlight } from '../core/auth/single-flight';

describe('singleFlight', () => {
	it('dedupes concurrent runs for the same store and key', async () => {
		const owner = {};
		let runs = 0;
		let release: (v: string) => void = () => {};
		const gate = new Promise<string>((r) => {
			release = r;
		});
		const run = () => {
			runs += 1;
			return gate;
		};

		const both = Promise.all([
			singleFlight(owner, 'k', run),
			singleFlight(owner, 'k', run),
		]);
		release('done');
		const [a, b] = await both;

		expect(runs).toBe(1);
		expect(a).toBe('done');
		expect(b).toBe('done');
	});

	it('does NOT share a flight across different stores with the same key', async () => {
		const ownerA = {};
		const ownerB = {};
		let runs = 0;
		const run = () => {
			runs += 1;
			return Promise.resolve('done');
		};

		await Promise.all([
			singleFlight(ownerA, 'k', run),
			singleFlight(ownerB, 'k', run),
		]);

		expect(runs).toBe(2);
	});

	it('clears the flight after settling so the next call runs fresh', async () => {
		const owner = {};
		let runs = 0;
		const run = () => {
			runs += 1;
			return Promise.resolve('done');
		};

		await singleFlight(owner, 'k', run);
		await singleFlight(owner, 'k', run);

		expect(runs).toBe(2);
	});
});
