import { modalSdkLoaded } from './client';
import { modal } from './index';

describe('import cost', () => {
	it('does not load the Modal SDK until an operation runs', () => {
		const plugin = modal();
		expect(plugin.id).toBe('modal');
		expect(modalSdkLoaded()).toBe(false);
		const loaded = Object.keys(require.cache).filter((path) =>
			/node_modules[\\/](modal|@grpc|nice-grpc|protobufjs)[\\/]/.test(path),
		);
		expect(loaded).toEqual([]);
	});
});
