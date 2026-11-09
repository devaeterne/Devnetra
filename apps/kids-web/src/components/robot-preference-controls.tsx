'use client';

import {useEffect,useState} from 'react';
import {
 clearStoredRobotPreferences,defaultStoredRobotPreferences,
 loadStoredRobotPreferences,saveStoredRobotPreferences,
 robotAgeTracks,robotExpressions,robotPalettes,
 type RobotPalette,type RobotExpression,type StoredRobotPreferences,
} from '@devnetra/characters';

const labels:Record<RobotExpression,string>={
 happy:'Happy',thinking:'Thinking',excited:'Excited',surprised:'Surprised',
 sleepy:'Sleepy',cool:'Cool',oops:'Oops',celebrate:'Celebrate',
};

export function useRobotLocalPreferences(){
 const [preferences,setPreferences]=useState<StoredRobotPreferences>(defaultStoredRobotPreferences);
 const [status,setStatus]=useState<'unsaved'|'loaded'|'saved'|'reset'|'error'>('unsaved');
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  try{
   const saved=loadStoredRobotPreferences(window.localStorage);
   if(saved){setPreferences(saved);setStatus('loaded');}
  }catch{setStatus('error');}
  setReady(true);
 },[]);
 function update(changes:Partial<StoredRobotPreferences>){
  setPreferences(current=>({...current,...changes}));
  setStatus('unsaved');
 }
 function save(){
  let ok=false;
  try{ok=saveStoredRobotPreferences(window.localStorage,preferences);}catch{ok=false;}
  setStatus(ok?'saved':'error');
  return ok;
 }
 function reset(){
  let ok=false;
  try{ok=clearStoredRobotPreferences(window.localStorage);}catch{ok=false;}
  if(ok){setPreferences(defaultStoredRobotPreferences);setStatus('reset');}
  else setStatus('error');
  return ok;
 }
 return {preferences,update,save,reset,status,ready};
}

/** Adult acknowledgement is a UI gate, not an age/identity verification service.
 * Nothing is written without an explicit, separate save click. */
export function RobotPreferenceControls({controller,locale}:{
 controller:ReturnType<typeof useRobotLocalPreferences>;
 locale:'tr'|'en';
}){
 const [adultConfirmed,setAdultConfirmed]=useState(false);
 const {preferences,update,save,reset,status,ready}=controller;
 const tr=locale==='tr';
 const messages={
  unsaved:tr?'Değişiklikler yalnızca bu oturumda.':'Changes are only for this session.',
  loaded:tr?'Bu cihazdaki ayarlar yüklendi.':'Settings loaded from this device.',
  saved:tr?'Ayarlar yalnızca bu cihaza kaydedildi.':'Settings saved on this device only.',
  reset:tr?'Yerel ayarlar silindi ve varsayılanlar geri geldi.':'Local settings cleared; defaults restored.',
  error:tr?'Tarayıcı depolama kullanılamıyor. Ayarlar kaydedilmedi.':'Browser storage unavailable; settings were not saved.',
 };
 return <section className="dv-robot-preferences" aria-label="Parent-managed robot preferences">
   <h3>{tr?'Robot kişiselleştirme':'Robot personalization'}</h3>
   <p>{tr?'Renk ve yüz ifadesini kaydetmeden deneyebilirsin. Kalıcı kayıt için bir ebeveynin onayı gerekir.':'Try colors and expressions without saving. An adult should approve any saved preference.'}</p>
   <div className="dv-ai-robot-preview__colors" role="group" aria-label="Robot color palette">
     {(Object.keys(robotPalettes) as RobotPalette[]).map(name=><button key={name} type="button" aria-pressed={preferences.palette===name} onClick={()=>update({palette:name})}>
       <span className="dv-ai-robot-preview__swatch" style={{background:robotPalettes[name].shell}}/>{name}
     </button>)}
   </div>
   <label className="dv-ai-robot-preview__label">{tr?'Yüz ifadesi':'Expression preset'}
     <select aria-label="Expression preset" value={preferences.expression} onChange={event=>update({expression:event.target.value as RobotExpression})}>
       {robotExpressions.map(value=><option key={value} value={value}>{labels[value]}</option>)}
     </select>
   </label>
   <label className="dv-ai-robot-preview__label">{tr?'Öğrenme yaş grubu':'Learning age track'}
     <select aria-label="Learning age track" value={preferences.ageTrack} onChange={event=>update({ageTrack:event.target.value as StoredRobotPreferences['ageTrack']})}>
      {robotAgeTracks.map(value=><option key={value} value={value}>{value}</option>)}
     </select>
   </label>
   <p>{tr?'Yaş grubu yalnızca gelecekteki ders uyarlaması içindir; doğum tarihi veya isim kaydedilmez.':'Age track is for future lesson adaptation; no date of birth or name is stored.'}</p>
   <label className="dv-robot-preferences__approval">
     <input type="checkbox" checked={adultConfirmed} onChange={event=>setAdultConfirmed(event.target.checked)}/>
     {tr?'Ben ebeveynim / sorumlu yetişkinim ve bu cihazda kayda izin veriyorum.':'I am a parent / responsible adult and approve saving to this device.'}
   </label>
   <div className="dv-robot-preferences__actions">
     <button type="button" disabled={!adultConfirmed||!ready} onClick={()=>{if(save())setAdultConfirmed(false)}}>{tr?'Bu cihaza kaydet':'Save on this device'}</button>
     <button type="button" disabled={!ready} onClick={()=>{reset();setAdultConfirmed(false)}}>{tr?'Yerel ayarları sıfırla':'Reset local settings'}</button>
   </div>
   <p role="status" aria-live="polite">{ready?messages[status]:(tr?'Ayarlar yükleniyor…':'Loading preferences…')}</p>
 </section>;
}
