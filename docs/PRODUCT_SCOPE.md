# TANSHU ONE — Product Scope

## Vision

Build a premium, independent Windows desktop suite for photo studios, CSC/cyber-cafe operators, small businesses, students, and the general public. The product should combine practical tools in one coherent desktop application while remaining usable offline for core workflows.

## Audiences

- Photo studio operators and print shops
- CSC and cyber-cafe operators
- Small businesses and service counters
- Students, job seekers, and general public users

## Modules

1. **Photo Studio** — multi-page canvas, multi-layer image editing, crop, move, resize, rotate, opacity, background/color adjustments, print layouts, and export.
2. **PVC & ID Studio** — front/back card composition, alignment, photo placement, and print-sheet layout.
3. **PDF Master** — merge, split, reorder, rotate, compress where feasible, and export PDF files.
4. **Document Studio** — common document creation, page layout, and print preparation.
5. **Image & File Tools** — resize, convert, compress, batch process, and inspect supported files.
6. **Resume & Career** — CV, resume, and biodata creation.
7. **Invoice & Business Utilities** — invoices, receipts, quotations, estimates, and rate lists.
8. **Education & Exam Desk** — study, typing, and exam-preparation utilities; no government application automation.
9. **Banking & Financial Utilities** — calculators and general financial utility tools; not a bank/government information hub.
10. **Typing & Language** — typing practice and language/input utilities.
11. **Cyber Cafe Manager** — customer/job records, work logs, token slips, and operational utilities.
12. **Utility Center** — useful everyday offline utilities.
13. **My Projects & Files** — local project organization and recent files.
14. **Settings** — application preferences, storage, privacy, printing, and updates.

## Photo Studio interaction requirements

- Multiple independent pages in one project.
- Multiple image and text layers per page.
- Select, move, crop, resize, rotate, adjust opacity, duplicate, rename, hide/show, reorder, and delete layers.
- Page-size presets including common photo-print sizes and A-series paper, plus custom dimensions.
- Zoom with Ctrl+mouse-wheel; normal wheel scrolling is confined to the canvas when the pointer is over it.
- Left and right sidebars scroll independently; the central workspace remains fixed.
- Print-size and DPI-aware output, with print preview and export.
- Project save/reopen must preserve assets and layer/page relationships, not merely store broken temporary browser URLs.

## Design direction

- Home Dashboard: retain the established blue/cyan visual direction.
- Photo Studio: clean, bright, white/light workspace, taking inspiration from the public TANSHU Photo Studio tool's visual language without copying its implementation.
- Premium graphite/neutral chrome, restrained accents, thin professional transform outlines and handles.
- Transform sliders should be slim, readable, and use distinct restrained accent colors.
- Original TANSHU ONE design; do not clone Photoshop or another product.

## Independence and privacy requirements

- No runtime dependency or integration with TANSHU ONLINE.
- No shared website login, membership, payment, API, database, storage, authentication, or service.
- Website may be consulted read-only as design/feature reference only.
- Core workflows should work offline wherever technically feasible.
- Any future cloud/AI feature must use TANSHU ONE's own infrastructure, clearly indicate when internet is required, and never upload user content silently.
- Store user projects locally and explain storage locations and backup behavior.

## Explicitly out of scope

- Online Form Assistant
- Government form filling or online application automation
- Bank/Government Information Hub
- Any integration with TANSHU ONLINE

## Quality attributes

- Reliable on Windows 10 and Windows 11, subject to real compatibility testing.
- Responsive on common desktop/laptop resolutions and Windows display scaling.
- Safe file handling, recovery from interrupted work, and clear error messages.
- Accessible keyboard navigation and understandable controls.
- No unnecessary telemetry; diagnostics must avoid sensitive user content.
