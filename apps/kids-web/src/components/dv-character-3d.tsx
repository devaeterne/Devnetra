'use client';

import { useEffect, useRef, useState } from 'react';
import { assetRegistry } from '@devnetra/assets';
import { DvCharacter } from '@devnetra/characters';

export type DvCharacter3DProps = { label: string; animation?: 'idle' | 'celebrate' };

export function DvCharacter3D({label,animation='idle'}:DvCharacter3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state,setState] = useState<'loading'|'ready'|'fallback'>('loading');
  const source = assetRegistry['kids.robot.3d'].bundledPath;

  useEffect(() => {
    if (!source) {
      return;
    }
    let active = true;
    const container = containerRef.current;
    if (!container) return;
    let viewer: HTMLElement | undefined;
    const start = async () => {
      try {
        await import('@google/model-viewer');
        if (!active) return;
        const element = document.createElement('model-viewer');
        viewer = element;
        element.setAttribute('src', source);
        element.setAttribute('alt', label);
        element.setAttribute('camera-controls', '');
        element.setAttribute('camera-orbit', '0deg 75deg auto');
        element.setAttribute('shadow-intensity', '0.4');
        element.setAttribute('exposure', '1.2');
        element.setAttribute('interaction-prompt', 'none');
        element.setAttribute('loading', 'eager');
        element.style.width='100%';
        element.style.height='100%';
        element.style.background='transparent';
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          element.setAttribute('auto-rotate', '');
          element.setAttribute('auto-rotate-delay','2500');
          element.setAttribute('rotation-per-second', '10deg');
        }
        element.addEventListener('load', () => {if(active)setState('ready')});
        element.addEventListener('error', () => {if(active)setState('fallback')});
        container.append(element);
      } catch {
        if(active)setState('fallback');
      }
    };
    void start();
    return () => {active=false;viewer?.remove()};
  }, [source,label]);

  return <div className={'dv-mimo dv-mimo--'+animation} role="img" aria-label={label}>
    {state!=='fallback' && <div ref={containerRef} className="dv-mimo__viewer" aria-hidden="true" style={{opacity:state==='ready'?1:0}} />}
    {state!=='ready' && <div className="dv-mimo__fallback"><DvCharacter aria-label={label}/></div>}
  </div>;
}
