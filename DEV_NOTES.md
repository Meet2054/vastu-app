# Developer Notes

## Project Structure

- `electron/`: Main process code (Node.js).
- `src/`: Renderer process code (React).
  - `components/`: UI components.
  - `lib/`: Utilities and domain logic.
  - `assets/`: Static assets.

## Commands

- `npm run dev`: Start Vite dev server (web only).
- `npm run dev:electron`: Start Vite + Electron.
- `npm run build`: Build for production (web + electron).
- `npm run electron:build`: Build only main process.

## Configuration

- `tailwind.config.js`: Tailwind CSS configuration.
- `tsconfig.electron.json`: TS config for Electron main process.
- `vite.config.ts`: Vite config.

## Data & Mappings

- Deity and zone mappings will be located in `src/lib/vastu-data`.
- Report templates will be in `src/components/report`.

## Report Generation

- Reports are generated using `react-pdf` (TBD) or browser print for PDF.
- DOCX generation uses `docxtemplater` (TBD).
