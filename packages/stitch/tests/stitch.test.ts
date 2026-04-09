import { stitch } from '../index';

describe('Stitch Plugin', () => {
  it('should initialize with correct id', () => {
    const plugin = stitch({ key: 'test-key' });
    expect(plugin.id).toBe('stitch');
  });

  it('should have the correct endpoints', () => {
    const plugin = stitch({ key: 'test-key' });
    expect(plugin.endpoints?.projects).toBeDefined();
    expect(plugin.endpoints?.screens).toBeDefined();
    expect(plugin.endpoints?.designSystems).toBeDefined();
  });
});
