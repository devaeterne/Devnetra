import {defaultRobotPreferences,parseRobotPreferences,type RobotPreferences} from './personalization.js';

/** Device-only preferences; never store identity, scores or free-text fields. */
export const robotPreferenceStorageKey='devnetra.kids.robot.preferences.v1';
export const robotAgeTracks=['6-8','9-12'] as const;
export type RobotAgeTrack=typeof robotAgeTracks[number];
export type StoredRobotPreferences=Readonly<RobotPreferences&{ageTrack:RobotAgeTrack}>;
export const defaultStoredRobotPreferences:StoredRobotPreferences={
 ...defaultRobotPreferences,ageTrack:'6-8',
};
type LocalStore=Pick<Storage,'getItem'|'setItem'|'removeItem'>;

export function parseStoredRobotPreferences(raw:unknown):StoredRobotPreferences|null {
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
 const value=raw as Record<string,unknown>;
 if(value.version!==1||value.preferences===null||typeof value.preferences!=='object'||Array.isArray(value.preferences))return null;
 const pref=value.preferences as Record<string,unknown>;
 // Invalid or partially corrupt records never silently modify user defaults.
 if(typeof pref.palette!=='string'||typeof pref.expression!=='string'
  ||typeof pref.ageTrack!=='string')return null;
 const parsed=parseRobotPreferences(pref);
 if(parsed.palette!==pref.palette||parsed.expression!==pref.expression
  ||!robotAgeTracks.includes(pref.ageTrack as RobotAgeTrack))return null;
 return {...parsed,ageTrack:pref.ageTrack as RobotAgeTrack};
}
export function loadStoredRobotPreferences(store:LocalStore):StoredRobotPreferences|null{
 try {
  const raw=store.getItem(robotPreferenceStorageKey);
  if(!raw||raw.length>1024)return null;
  return parseStoredRobotPreferences(JSON.parse(raw) as unknown);
 }catch{return null;}
}
export function saveStoredRobotPreferences(store:LocalStore,prefs:StoredRobotPreferences):boolean{
 try {
  const validated=parseStoredRobotPreferences({version:1,preferences:prefs});
  if(!validated)return false;
  // Construct a strict allowlisted schema and never serialize arbitrary objects.
  store.setItem(robotPreferenceStorageKey,JSON.stringify({version:1,preferences:{
   palette:validated.palette,expression:validated.expression,ageTrack:validated.ageTrack,
  }}));
  return true;
 }catch{return false;}
}
export function clearStoredRobotPreferences(store:LocalStore):boolean{
 try{store.removeItem(robotPreferenceStorageKey);return true;}catch{return false;}
}
