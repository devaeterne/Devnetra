export * from './ai-robot-contract.js';
export * from './personalization.js';
export * from './animation.js';
import type { HTMLAttributes } from 'react';
import { assetRegistry } from '@devnetra/assets';
import { DvIcon } from '@devnetra/icons';

export const characterRegistry = {
  'kids.robot': {
    titleKey: 'kids.robotName',
    model: 'kids.robot.3d',
    fallback: 'kids.robot.fallback',
    animations: ['idle','wave','think','happy','celebrate','walk','blink','oops','sleep'] as const,
  },
} as const;
export type CharacterId = keyof typeof characterRegistry;
export function DvCharacter({character='kids.robot',animation='idle',className='',...props}:HTMLAttributes<HTMLDivElement> & {character?:CharacterId;animation?:'idle'|'celebrate'}) {
  const meta = characterRegistry[character];
  const useFallback = !assetRegistry[meta.model].bundledPath;
  return <div role="img" aria-label="Friendly robot mascot" className={['dv-character',animation==='celebrate'?'dv-character--celebrate':'',className].join(' ')} data-asset-fallback={useFallback} {...props}>
    <div className="dv-character__antenna" aria-hidden="true"/>
    <div className="dv-character__head" aria-hidden="true"><div className="dv-character__eye"/><div className="dv-character__eye"/><span className="dv-character__smile"/></div>
    <div className="dv-character__body" aria-hidden="true"><DvIcon name="star" size={24} strokeWidth={3}/></div>
    <div className="dv-character__shadow" aria-hidden="true"/>
  </div>;
}
