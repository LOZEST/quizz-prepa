export const PROTOCOL_VERSION=1;
export const SCHEMA_VERSION=3;
export const MAX_OPERATION_BYTES=256_000;
export const OPERATION_TYPES=Object.freeze(['append-event','upsert-entity','delete-entity','supersede-event','upload-test-draft','finalize-test-result','update-preference']);
export const SYNC_ERROR_CODES=Object.freeze(['NETWORK_OFFLINE','AUTH_INVALID','ENDPOINT_INVALID','PROTOCOL_MISMATCH','SCHEMA_MISMATCH','PAYLOAD_TOO_LARGE','CHECKSUM_INVALID','SERVER_CONFLICT','DRIVE_UNAVAILABLE','QUOTA_EXCEEDED','APPS_SCRIPT_ERROR','LOCAL_STORAGE_ERROR','REMOTE_DATA_CORRUPTED']);

export class SyncError extends Error{constructor(code,message,details={}){super(message);this.name='SyncError';this.code=SYNC_ERROR_CODES.includes(code)?code:'APPS_SCRIPT_ERROR';this.details=details}}
