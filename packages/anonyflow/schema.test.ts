import { AnonyflowSchema } from './schema';
import { anonyflow } from './index';
import * as http from 'corsair/http';

// 1. Mock the HTTP client using Jest instead of Vitest
jest.mock('corsair/http', () => ({
    ...jest.requireActual('corsair/http'),
    request: jest.fn(),
}));

describe('Anonyflow schema', () => {
    it('declares a semver version', () => {
        expect(AnonyflowSchema.version).toBeDefined();
        expect(AnonyflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('declares an entities map', () => {
        expect(typeof AnonyflowSchema.entities).toBe('object');
        expect(AnonyflowSchema.entities).not.toBeNull();
        expect(Array.isArray(Object.keys(AnonyflowSchema.entities))).toBe(true);
        for (const entity of Object.values(AnonyflowSchema.entities)) {
            expect(entity).toBeDefined();
        }
    });
});

// Per .github/PLUGIN_PR_RULES.md (R2)
describe('Anonyflow endpoints', () => {
    it('executes the anonymize endpoint correctly', async () => {
        const mockRequest = http.request as jest.Mock;
        
        // We tell the fake HTTP client what to return when called
        mockRequest.mockResolvedValueOnce({
            anonymized_text: 'My name is [PERSON]'
        });

        const plugin = anonyflow({ key: 'test-secret-key' });

        // We simulate the context Corsair passes to endpoints
        const ctx = {
            authType: 'api_key',
            keys: { get_api_key: async () => 'test-secret-key' }
        } as any;

        // 2. We use '!' to tell TS endpoints exists, and 'as any' to bypass strict input types
        const result = await plugin.endpoints!.core.anonymize(ctx, {
            text: 'My name is Athish',
            entities: ['person']
        } as any);

        // We assert that your endpoint correctly returned the mocked data
        expect(result).toEqual({ anonymized_text: 'My name is [PERSON]' });
        expect(mockRequest).toHaveBeenCalled();
    });
});