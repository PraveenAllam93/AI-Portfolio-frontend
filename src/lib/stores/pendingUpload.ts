/**
 * Hand-off slot for a resume picked before a session exists.
 *
 * The landing-page upload dock lets people choose a file while still anonymous,
 * but the upload wizard lives behind /app and needs a (guest) session first. The
 * file is parked here, the browser goes through /try to mint the guest session,
 * and the wizard consumes it on arrival — so the file is only ever picked once.
 *
 * In-memory and consume-once by design: a File can't be serialised to storage,
 * and a stale file must never be silently re-uploaded on a later visit.
 */
let pendingFile: File | null = null;

export function setPendingUpload(file: File) {
	pendingFile = file;
}

/** Returns the parked file (if any) and clears the slot. */
export function takePendingUpload(): File | null {
	const file = pendingFile;
	pendingFile = null;
	return file;
}

export function clearPendingUpload() {
	pendingFile = null;
}
