const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');

const execPromise = promisify(exec);

describe('Build Command', () => {
  it('should complete successfully with exit code 0', async () => {
    const cwd = path.join(__dirname, '../'); // Adjust the path as necessary
    try {
      const { stdout, stderr } = await execPromise('pnpm build', { cwd });
      expect(stderr).toBe('');
      expect(stdout).toContain('Build completed successfully'); // Adjust based on actual output
    } catch (error) {
      // If the command fails, we want to fail the test
      throw new Error(`Build command failed with exit code ${error.code}: ${error.stderr}`);
    }
  });
});

