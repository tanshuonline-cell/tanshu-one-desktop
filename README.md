# TANSHU ONE

**Independent, offline-first Windows desktop software** for photo studios, document work, PDF utilities, and CSC/cyber-cafe operations.

TANSHU ONE is a standalone product. It is not an extension of TANSHU ONLINE and must not depend on that website or its services.

## Product principles

- Offline-first: core editing and utility workflows are designed to run without an internet connection.
- Local-first privacy: user files are processed on the device; no TANSHU ONLINE login, API, membership, payment, database, storage, authentication, or runtime dependency.
- Windows 10 and Windows 11 are the target platforms; compatibility must be verified through testing.
- Original premium interface: blue/cyan Home Dashboard and a clean light Photo Studio workspace.
- No Online Form Assistant, government-form filling, online-application automation, or Bank/Government Information Hub.

## Current implementation

The application shell uses Tauri 2, Rust, React, TypeScript, and Vite.

- **Photo Studio:** multi-page canvas, image/text layers, drag and resize, crop, photo presets, adjustments, undo/redo, project JSON save/open, Smart Arrange, PNG export, print preview, and DPI metadata.
- **PDF Master:** local PDF merge, page extraction, and clockwise page rotation.
- **Image & File Tools:** local image resize and JPEG/PNG/WebP export.
- **PVC & ID Studio:** basic editable ID-card front/back layout and print output.
- **Document Studio:** editable text document and print-to-PDF.
- **Resume & Career:** basic resume fields and print-to-PDF.
- **Invoice & Business:** line items, GST totals, invoice print output.
- **Education & Exam Desk:** marks and percentage summary.
- **Banking & Finance:** EMI and GST calculators.
- **Typing & Language:** typing practice with speed and accuracy estimates.
- **Cyber Cafe Manager:** local job register stored in the app's local webview storage.
- **Utility Center:** age and percentage calculators.

These are initial working workflows, not a claim that every planned professional feature is finished. Advanced PDF editing/OCR, AI background removal, advanced PVC templates, full resume templates, database-backed customer management, project library, and automated in-app updates are not yet implemented.

## Build and verification

The Windows installer workflow is in .github/workflows/windows-installer.yml. It builds NSIS and MSI packages and uploads them as GitHub Actions artifacts.

A successful CI build confirms compilation and packaging only. Before calling a release final, the installer must also be installed and launched on a real Windows 11 PC, and file saving/opening, offline behavior, printer sizing, and actual printer output must be checked. Physical printer and Windows desktop testing cannot be performed by the cloud build runner.

## Planned modules

- Photo Studio
- PVC & ID Studio
- PDF Master
- Document Studio
- Image & File Tools
- Resume & Career
- Invoice & Business Utilities
- Education & Exam Desk
- Banking & Financial Utilities
- Typing & Language
- Cyber Cafe Manager
- Utility Center
- My Projects & Files
- Settings

## Development references

See Product Scope (docs/PRODUCT_SCOPE.md), Architecture (docs/ARCHITECTURE.md), and Roadmap (docs/ROADMAP.md).
