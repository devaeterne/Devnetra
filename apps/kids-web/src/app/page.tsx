import { ageBands } from '@devnetra/core';
import { translate } from '@devnetra/localization';
import { DvButton } from '@devnetra/ui-web';
import { DvIcon } from '@devnetra/icons';
import { DvCharacter3D } from '../components/dv-character-3d';

export default function Home() {
  const locale = 'en' as const;
  return <main className="dv-hero"><section className="dv-hero__panel">
    <div>
      <span className="dv-eyebrow">{translate(locale,'eyebrow')}</span>
      <h1 className="dv-title">{translate(locale,'title')}</h1>
      <p className="dv-subtitle">{translate(locale,'welcome')}</p>
      <div className="dv-actions"><DvButton icon={<DvIcon name="play" size={20}/>} type="button" disabled>{translate(locale,'comingSoon')}</DvButton></div>
      <p className="dv-track">{translate(locale,'tracks',{bands:ageBands.join(' / ')})}</p>
    </div>
    <div><DvCharacter3D label={translate(locale,'robotName')}/></div>
  </section></main>;
}
