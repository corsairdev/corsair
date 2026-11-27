import { ApiError } from 'corsair/http';
// Type-only: erased at build time, so importing the plugin never loads the SDK.
import type * as ModalSdk from 'modal';

export type ModalSdkModule = typeof ModalSdk;
export type ModalSdkClient = ModalSdk.ModalClient;

/** What a Modal account stores: a token pair and, optionally, an environment. */
export type ModalCredentials = {
	tokenId: string;
	tokenSecret: string;
	/** Modal environment; when empty the workspace's default environment is used. */
	environment?: string;
};

/** What every operation receives: the loaded SDK and a client for one account. */
export type ModalRuntime = {
	sdk: ModalSdkModule;
	client: ModalSdkClient;
	/** The environment this call runs in, or undefined for the workspace default. */
	environment: string | undefined;
};

let sdkPromise: Promise<ModalSdkModule> | undefined;
let sdkLoader: () => Promise<ModalSdkModule> = () => import('modal');

/**
 * Load the Modal SDK the first time an operation runs. It pulls in gRPC and
 * protobuf (several MB), so the plugin keeps it off the import path.
 */
export function loadModalSdk(): Promise<ModalSdkModule> {
	sdkPromise ??= sdkLoader().catch((error: unknown) => {
		sdkPromise = undefined;
		throw error;
	});
	return sdkPromise;
}

/** Tests swap the SDK for a fake; pass undefined to restore the real one. */
export function setModalSdkLoader(
	loader: (() => Promise<ModalSdkModule>) | undefined,
): void {
	sdkLoader = loader ?? (() => import('modal'));
	sdkPromise = undefined;
}

/** True once the SDK module has been requested (used by the import-cost test). */
export function modalSdkLoaded(): boolean {
	return sdkPromise !== undefined;
}

const MODAL_GRPC_BASE = 'grpc://api.modal.com';

/**
 * Build a client from one account's credentials. Token id, secret and
 * environment are always passed explicitly: the SDK would otherwise read
 * MODAL_TOKEN_ID / MODAL_TOKEN_SECRET / MODAL_ENVIRONMENT or ~/.modal.toml of
 * the host process, which belong to the server, not to the tenant.
 */
export function createModalClient(
	sdk: ModalSdkModule,
	credentials: ModalCredentials,
): ModalSdkClient {
	const environment = credentials.environment || undefined;
	const client = new sdk.ModalClient({
		tokenId: credentials.tokenId,
		tokenSecret: credentials.tokenSecret,
		environment,
		logLevel: 'warn',
	});
	// With no environment the constructor keeps the host profile's one
	// (MODAL_ENVIRONMENT or ~/.modal.toml). Clear it so the server default
	// applies instead; environmentName() reads this field on every call.
	const profile = client.profile as { environment?: string };
	profile.environment = environment;
	return client;
}

/**
 * Run one operation with a client made for it and closed after it, so gRPC
 * channels never outlive the call or leak between accounts.
 */
export async function withModal<T>(
	credentials: ModalCredentials,
	operation: string,
	fn: (runtime: ModalRuntime) => Promise<T>,
): Promise<T> {
	const sdk = await loadModalSdk();
	let client: ModalSdkClient | undefined;
	try {
		client = createModalClient(sdk, credentials);
		return await fn({
			sdk,
			client,
			environment: credentials.environment || undefined,
		});
	} catch (error) {
		throw toModalApiError(error, operation, sdk);
	} finally {
		client?.close();
	}
}

// gRPC status codes (https://grpc.github.io/grpc/core/md_doc_statuscodes.html)
const GRPC_TO_HTTP: Record<number, number> = {
	1: 499, // CANCELLED
	2: 500, // UNKNOWN
	3: 400, // INVALID_ARGUMENT
	4: 504, // DEADLINE_EXCEEDED
	5: 404, // NOT_FOUND
	6: 409, // ALREADY_EXISTS
	7: 403, // PERMISSION_DENIED
	8: 429, // RESOURCE_EXHAUSTED
	9: 409, // FAILED_PRECONDITION
	10: 409, // ABORTED
	11: 400, // OUT_OF_RANGE
	12: 501, // UNIMPLEMENTED
	13: 500, // INTERNAL
	14: 503, // UNAVAILABLE
	15: 500, // DATA_LOSS
	16: 401, // UNAUTHENTICATED
};

// The SDK's own error classes, by name (instanceof would need the SDK loaded).
const SDK_ERROR_STATUS: Record<string, number> = {
	NotFoundError: 404,
	AlreadyExistsError: 409,
	ConflictError: 409,
	InvalidError: 400,
	ResourceExhaustedError: 429,
	QueueFullError: 429,
	QueueEmptyError: 404,
	TimeoutError: 504,
	FunctionTimeoutError: 504,
	SandboxTimeoutError: 504,
	RemoteError: 502,
	ExecutionError: 500,
	InternalFailure: 503,
	ClientClosedError: 500,
	SnapshotCreationError: 500,
	SandboxFilesystemNotFoundError: 404,
	SandboxFilesystemPathAlreadyExistsError: 409,
	SandboxFilesystemDirectoryNotEmptyError: 409,
	SandboxFilesystemIsADirectoryError: 400,
	SandboxFilesystemNotADirectoryError: 400,
	SandboxFilesystemFileTooLargeError: 413,
	SandboxFilesystemPermissionError: 403,
	SandboxFilesystemError: 400,
};

function sdkErrorName(error: Error, sdk: ModalSdkModule | undefined): string {
	if (sdk) {
		// Subclasses first: SandboxFilesystemNotFoundError extends SandboxFilesystemError.
		for (const name of Object.keys(SDK_ERROR_STATUS)) {
			const ctor = (sdk as unknown as Record<string, unknown>)[name];
			if (typeof ctor === 'function' && error instanceof ctor) return name;
		}
	}
	return error.constructor?.name || error.name;
}

function grpcCode(error: unknown): number | undefined {
	if (typeof error !== 'object' || error === null) return undefined;
	const code = (error as { code?: unknown }).code;
	return typeof code === 'number' &&
		'details' in (error as Record<string, unknown>)
		? code
		: undefined;
}

/**
 * Turn an SDK or gRPC failure into core's ApiError, so the plugin's error
 * handlers and core see an HTTP-like status (404, 409, 429, 401, ...). The
 * request carries only the operation name: never the tokens or the input.
 */
export function toModalApiError(
	error: unknown,
	operation: string,
	sdk?: ModalSdkModule,
): unknown {
	if (error instanceof ApiError) return error;
	if (!(error instanceof Error)) return error;
	const code = grpcCode(error);
	const name = sdkErrorName(error, sdk);
	const status =
		code !== undefined ? (GRPC_TO_HTTP[code] ?? 500) : SDK_ERROR_STATUS[name];
	if (status === undefined) return error;
	const url = `${MODAL_GRPC_BASE}/${operation}`;
	const message =
		code !== undefined
			? ((error as { details?: string }).details ?? error.message)
			: error.message;
	const apiError = new ApiError(
		{ method: 'POST', url },
		{
			url,
			ok: false,
			status,
			statusText: name,
			body: { error: name, ...(code !== undefined ? { grpcCode: code } : {}) },
		},
		`Modal ${operation} failed (${name}): ${message}`,
	);
	return apiError;
}
