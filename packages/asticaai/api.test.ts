import { request } from 'corsair/http';
import { AnalyzeAudio, ReadText } from './endpoints';
import type { AsticaAiEndpointOutputs } from './endpoints/types';
import type { AsticaAiContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const TEST_API_KEY = 'test-api-key';
const TEST_CONTEXT = { key: TEST_API_KEY } as unknown as AsticaAiContext;

describe('Astica AI API endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('readText sends the OCR request and returns the response', async () => {
		const mockResponse: AsticaAiEndpointOutputs['readText'] = {
			readResult: {
				content: 'Detected text',
				pages: [],
			},
		};
		mockRequest.mockResolvedValueOnce(mockResponse);

		const response = await ReadText.read(TEST_CONTEXT, {
			input: 'https://www.astica.org/inputs/analyze_3.jpg',
			modelVersion: '2.5_full',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://vision.astica.ai',
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/describe',
				body: {
					input: 'https://www.astica.org/inputs/analyze_3.jpg',
					modelVersion: '2.5_full',
					visionParams: 'text_read',
					tkn: TEST_API_KEY,
				},
			}),
		);
		expect(response).toEqual(mockResponse);
	});

	it('analyzeAudio sends the transcription request and returns the response', async () => {
		const mockResponse = {
			status: 'success',
			text: 'Transcribed audio',
		};
		mockRequest.mockResolvedValueOnce(mockResponse);

		const response = await AnalyzeAudio.analyze(TEST_CONTEXT, {
			input: 'https://astica.ai/example/asticaListen_sample.wav',
			modelVersion: '1.0_full',
			doStream: 0,
			low_priority: 0,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://listen.astica.ai',
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/transcribe',
				body: {
					input: 'https://astica.ai/example/asticaListen_sample.wav',
					modelVersion: '1.0_full',
					doStream: 0,
					low_priority: 0,
					tkn: TEST_API_KEY,
				},
			}),
		);
		expect(response).toEqual(mockResponse);
	});

	it('converts a failed API request into AsticaAiAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('API request failed'));

		await expect(
			ReadText.read(TEST_CONTEXT, {
				input: 'https://www.astica.org/inputs/analyze_3.jpg',
				modelVersion: '2.5_full',
			}),
		).rejects.toThrow('API request failed');
	});
});
