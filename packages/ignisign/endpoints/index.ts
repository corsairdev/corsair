import { ApplicationsEndpoints } from './applications';
import { BareSignaturesEndpoints } from './bare-signatures';
import { DocumentsEndpoints } from './documents';
import { LogCapsulesEndpoints } from './log-capsules';
import { ProofsEndpoints } from './proofs';
import { SealEndpoints } from './seal';
import { SignatureRequestsEndpoints } from './signature-requests';
import { SignaturesEndpoints } from './signatures';
import { SignerProfilesEndpoints } from './signer-profiles';
import { SignersEndpoints } from './signers';

export const ignisignEndpointsNested = {
	applications: ApplicationsEndpoints,
	bareSignatures: BareSignaturesEndpoints,
	documents: DocumentsEndpoints,
	logCapsules: LogCapsulesEndpoints,
	proofs: ProofsEndpoints,
	seal: SealEndpoints,
	signatureRequests: SignatureRequestsEndpoints,
	signatures: SignaturesEndpoints,
	signerProfiles: SignerProfilesEndpoints,
	signers: SignersEndpoints,
} as const;

export { ApplicationsEndpoints } from './applications';
export { BareSignaturesEndpoints } from './bare-signatures';
export { DocumentsEndpoints } from './documents';
export { LogCapsulesEndpoints } from './log-capsules';
export { ProofsEndpoints } from './proofs';
export { SealEndpoints } from './seal';
export { SignatureRequestsEndpoints } from './signature-requests';
export { SignaturesEndpoints } from './signatures';
export { SignerProfilesEndpoints } from './signer-profiles';
export { SignersEndpoints } from './signers';
export * from './types';
