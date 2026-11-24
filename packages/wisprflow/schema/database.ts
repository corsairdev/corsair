import type { z } from 'zod';
import { TranscriptionSchema } from '../endpoints/types';

export const WisprFlowTranscription = TranscriptionSchema;

export type WisprFlowTranscription = z.infer<typeof WisprFlowTranscription>;
