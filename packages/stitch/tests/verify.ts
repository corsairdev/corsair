import { stitch } from '../index';
import { StitchAPIError } from '../client';

async function verify() {
  console.log('Verifying Stitch Plugin...');

  const plugin = stitch({ key: 'test-key' });

  if (plugin.id !== 'stitch') {
    throw new Error('Plugin ID mismatch');
  }
  console.log('✅ Plugin ID verified');

  if (!plugin.endpoints.projects || !plugin.endpoints.screens || !plugin.endpoints.designSystems) {
    throw new Error('Missing endpoints');
  }
  console.log('✅ Endpoints verified');

  // Test error handler
  if (!plugin.errorHandlers || !plugin.errorHandlers.stitch) {
    throw new Error('Missing error handler');
  }

  const errorHandler = plugin.errorHandlers.stitch;
  const mockError = new StitchAPIError('Rate limit', 429);

  if (!errorHandler.match(mockError)) {
    throw new Error('Error handler match failed');
  }

  const strategy = await errorHandler.handler(mockError);
  if (strategy.maxRetries !== 3) {
    throw new Error('Error handler strategy failed');
  }
  console.log('✅ Error handler verified');

  console.log('Stitch Plugin Verification Successful!');
}

verify().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
