# Windows Development Setup

This repository contains the initial Tauri 2 + React + TypeScript application shell.

## Prerequisites

On a Windows 10/11 development PC, install:

1. Node.js LTS and npm.
2. Rust stable using rustup, including the MSVC toolchain.
3. Microsoft C++ Build Tools with the Desktop development with C++ workload.
4. WebView2 Runtime (normally present on supported Windows 10/11 installations; verify on the target PC).

Follow the current official Tauri 2 Windows prerequisites before building. Exact minimum Windows versions and packaging behavior must be validated during compatibility testing.

## Run in development

From the repository root:

```powershell
npm install
npm run tauri dev
```

## Create a production build

```powershell
npm run tauri build
```

Installer output is generated under `src-tauri/target/release/bundle/`.

## Current limitations

- This is the initial dashboard and desktop-shell foundation, not a finished product.
- Tool cards currently open planned-module placeholders.
- No production photo editing, PDF processing, project persistence, printing, or customer database is implemented yet.
- Google Fonts are referenced for the preview; the application must retain a readable system-font fallback and should later bundle approved fonts for a fully offline visual experience.
- Windows 10 support must be verified on a real Windows 10 test machine before it is advertised as supported.
