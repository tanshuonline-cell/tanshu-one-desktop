# TANSHU ONE — Proposed Architecture

> This is an initial architecture proposal, not a final technology lock. Validate the toolchain with a small Windows prototype before committing to long-term implementation.

## Proposed stack

- **Desktop shell:** Tauri 2
- **Frontend:** React + TypeScript
- **Native/core services:** Rust commands for filesystem operations, printing integration, and performance-sensitive tasks
- **Local database:** SQLite for structured metadata and application records
- **Local assets:** managed application data directory with project-relative asset references
- **Build and delivery:** signed Windows installer and a controlled update process

Tauri is the current preferred candidate because it can provide a lighter native desktop package than a bundled browser runtime. Confirm compatibility, packaging, and required Windows WebView2 behavior during the prototype phase.

## High-level layers

1. **Presentation** — dashboard, module navigation, workspaces, dialogs, and accessible controls.
2. **Application services** — project lifecycle, import/export orchestration, undo/redo, settings, and task coordination.
3. **Domain modules** — photo studio, PDF, documents, business utilities, and cyber-cafe management.
4. **Native adapters** — filesystem, image processing, printing, SQLite, and operating-system integration.
5. **Persistence** — local database, project manifests, and managed asset storage.

## Project data model direction

- A project contains one or more pages.
- A page contains ordered layers and page settings.
- A layer references an asset or editable content and stores transform, visibility, opacity, and ordering data.
- Imported assets are copied or safely managed in a project asset store; avoid relying on temporary browser object URLs.
- Save operations should be atomic where possible and support recovery after interruption.
- Use versioned project manifests and migrations so future releases can evolve file formats safely.

## Offline-first behavior

- Do not require website connectivity for startup, editing, saving, printing, or core utility workflows.
- Do not call TANSHU ONLINE endpoints.
- Future online services, if approved, must belong to TANSHU ONE independently and be clearly marked as online-only.
- Never upload photos, documents, or customer data without explicit user action and clear disclosure.

## Security and reliability

- Apply least-privilege filesystem access.
- Validate imported file types and sizes; treat file contents as untrusted.
- Keep dependencies minimal and review licenses and update history.
- Avoid logging document contents, images, credentials, or other sensitive customer data.
- Provide safe backup/recovery behavior and clear local data controls.
- Sign distributable installers and updates when release infrastructure is ready.

## Windows compatibility

- Target Windows 10 and Windows 11.
- Develop initially on Windows 11, but do not claim Windows 10 support until tested on a real supported Windows 10 environment.
- Test common DPI scaling levels, display sizes, printers, offline behavior, and file paths with spaces and non-English characters.

## Architecture decisions still to validate

- Exact minimum Windows 10 build and WebView2 distribution strategy.
- Image/PDF processing libraries and their licenses.
- Print pipeline and physical-size accuracy across printer drivers.
- Whether any advanced AI features can run locally within acceptable performance and installer size.
- Installer, signing, crash recovery, and update strategy.
