export declare function verifyHmacSignature(payload: string | Buffer, secret: string, signature: string, algorithm?: 'sha256' | 'sha1'): boolean;
export declare function verifyHmacSignatureWithPrefix(payload: string | Buffer, secret: string, signature: string, prefix: string, algorithm?: 'sha256' | 'sha1'): boolean;
export declare function verifyHmacSha256Signature(payload: string, secret: string, timestamp: string, signature: string, maxAgeSeconds?: number): boolean;
export declare function verifySlackSignature(payload: string, secret: string, timestamp: string, signature: string, maxAgeSeconds?: number): boolean;
//# sourceMappingURL=webhook-utils.d.ts.map