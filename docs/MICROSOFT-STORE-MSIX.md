# Microsoft Store MSIX packaging

This branch adds a separate Windows MSIX packaging workflow. It does not replace or modify the existing NSIS/MSI release workflow.

## Required repository variables

Before running **Actions → Windows MSIX (Microsoft Store) → Run workflow**, add these repository variables under **Settings → Secrets and variables → Actions → Variables**:

- `MSIX_PACKAGE_NAME`: exact **Package/Identity/Name** from Partner Center → TANSHU ONE → Product management → Product identity.
- `MSIX_PUBLISHER`: exact **Package/Identity/Publisher** from the same page (copy the complete distinguished name, including `CN=`).
- `MSIX_PUBLISHER_DISPLAY_NAME`: exact publisher display name associated with the Store account.

These are public package identity values, not passwords or private keys. Do not guess them: the package identity and publisher must match Partner Center exactly.

The workflow builds the Tauri executable, creates a manifest using WinApp CLI, substitutes the exact Store identity values, and packages an **unsigned** x64 MSIX. Microsoft Store signs accepted MSIX packages. The unsigned artifact is for Store upload, not for direct sideload installation.

## Important

- The current Tauri app version is 0.1.0. A Store package version must be four numeric components, so this workflow uses 0.1.0.0.
- The workflow is intentionally separate from the existing EXE/MSI packaging.
- A successful workflow run is only a packaging result. Partner Center package validation and Store certification are still required.
- Before production submission, review the generated manifest's capabilities, visual assets, executable entry point, and app behavior. Do not submit until those checks pass.
