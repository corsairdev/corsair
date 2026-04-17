import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const execPromise = promisify(exec);

describe('Build Command', () => {
  it('should complete successfully with exit code 0', async () => {
    const cwd = path.join(__dirname, '../'); // Adjust the path as necessary
    try {
      const { stdout, stderr } = await execPromise('pnpm build', { cwd });
      const { stdout, stderr } = await execPromise('pnpm build', { cwd });
      // Turbo writes progress to stderr; just verify the process exits cleanly
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      // If execPromise didn't throw, exit code was 0 — that's sufficient
    } catch (error) {
      // If the command fails, we want to fail the test
      throw new Error(`Build command failed with exit code ${error.code}: ${error.stderr}`);
    }
  });
});

