# Microsoft Store MSIX packaging

This branch adds a separate Windows MSIX packaging workflow. It does not replace or modify the existing NSIS/MSI release workflow.

## Partner Center identity values

First reserve **TANSHU ONLINE** as an **MSIX or PWA app** in Partner Center. A green availability check means the name is available; complete the **Reserve product name** action to secure it. Then open the new product's **Product identity** page and copy these exact public values:

- **Package/Identity/Name** → workflow input `package_name`
- **Package/Identity/Publisher** → workflow input `publisher` (include the full `CN=` distinguished name)
- **Publisher display name** → workflow input `publisher_display_name`

Do not guess or shorten these values. They must match the MSIX product identity in Partner Center exactly. These are public identity strings, not passwords or private keys.

You can enter them directly when running the workflow, so you do not need to configure GitHub repository variables. Alternatively, configure repository variables named `MSIX_PACKAGE_NAME`, `MSIX_PUBLISHER`, and `MSIX_PUBLISHER_DISPLAY_NAME`; workflow inputs take precedence over variables.

## Run the workflow

1. Open the repository on GitHub.
2. Select **Actions** → **Windows MSIX (Microsoft Store)**.
3. Select **Run workflow**.
4. Enter the three identity values above and start the run.
5. When the run succeeds, download the `TANSHU-ONLINE-MSIX-Store` artifact.

The workflow builds the Tauri executable without generating the existing NSIS/MSI installers, initializes the manifest with Microsoft WinApp CLI, checks the desktop full-trust capability, and packages an **unsigned** x64 MSIX. Microsoft Store signs accepted MSIX packages. The unsigned artifact is for Store upload, not for direct sideload installation.

## Important Partner Center product-type distinction

The existing reserved **TANSHU ONE** listing was created as an **EXE/MSI app**. Microsoft documents EXE/MSI and MSIX as separate product submission paths. Do **not** upload this MSIX to the existing EXE/MSI submission. Keep the TANSHU ONE draft intact while creating the separate **TANSHU ONLINE** MSIX product. Do not delete the old draft unless you later decide to abandon it knowingly.

## Validation status

- The workflow definition is committed on the `feature/msix-store-package` branch.
- A successful GitHub Actions run is still required to prove the build and packaging steps work.
- Partner Center package validation and Store certification are separate steps.
- Before submission, inspect the generated manifest's capabilities, visual assets, executable entry point, and app behavior. Do not submit until those checks pass.
- The package version is now `0.1.1.0`, derived from the app version `0.1.1`. Increase this version for subsequent package rebuilds before uploading changed contents to the same submission..
