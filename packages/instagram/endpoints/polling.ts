function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function poll<T>(
    fn: () => Promise<T>,
    condition: (result: T) => boolean,
    intervalMs: number,
    timeoutMs: number
): Promise<T> {
    const start = Date.now();

    while(true) {
        const result = await fn();

        if (condition(result)) {
            return result;
        }

        if (Date.now() - start > timeoutMs) {
            throw new Error('Polling timed out');
        }

        await sleep(intervalMs);
    }
}