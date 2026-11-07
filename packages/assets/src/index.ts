export type AssetLicense = 'CC0' | 'ISC' | 'MIT' | 'original' | 'Sketchfab-Standard';
export type AssetStatus = 'available' | 'planned';
export interface AssetEntry {
  readonly id: string;
  readonly source: string;
  readonly sourceUrl: string;
  readonly license: AssetLicense;
  readonly format: 'glb'|'webp'|'svg'|'css';
  readonly version: string;
  readonly status: AssetStatus;
  readonly bundledPath: string | null;
  readonly fallback: string;
}
export const assetRegistry = {
  'kids.robot.3d': {
    id: 'kids.robot.3d',
    source: 'Devnetra original Mimo mascot — parametric source included',
    sourceUrl: 'https://devnetra.dev',
    license: 'CC0', format: 'glb', version: '1.1.0',
    status: 'available', bundledPath: '/assets/characters/devnetra-mimo.glb', fallback: 'kids.robot.fallback',
  },
  'kids.robot.ai-robot': {
    id: 'kids.robot.ai-robot',
    source: 'AI Robot by Noores — Sketchfab model',
    sourceUrl: 'https://sketchfab.com/3d-models/ai-robot-f7c4e4dcd1594e3e92b2d35a4ec8a93a',
    license: 'Sketchfab-Standard', format: 'glb', version: '1.0.0',
    status: 'available', bundledPath: '/assets/characters/ai-robot.glb', fallback: 'kids.robot.fallback',
  },
  'kids.robot.fallback': {
    id: 'kids.robot.fallback',
    source: 'Devnetra original CSS illustration',
    sourceUrl: 'https://devnetra.dev',
    license: 'original', format: 'css', version: '1.0.0',
    status: 'available', bundledPath: null, fallback: 'kids.robot.fallback',
  },
} as const satisfies Record<string,AssetEntry>;
export type AssetId = keyof typeof assetRegistry;
