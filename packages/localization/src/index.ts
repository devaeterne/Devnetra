export const localizationContractVersion = '1.0.0' as const;
export const messages = {
  en: { kids: { eyebrow:'A world of curiosity', title:'Think, play, create!', welcome:'Learn to think and code!', start:'Start exploring', comingSoon:'Challenges coming soon', tracks:'For ages {bands}', robotName:'Mimo the robot' } },
  tr: { kids: { eyebrow:'Merak dolu bir dünya', title:'Düşün, oyna, üret!', welcome:'Düşünmeyi ve kodlamayı öğren!', start:'Keşfetmeye başla', comingSoon:'Görevler yakında', tracks:'{bands} yaş grupları için', robotName:'Robot Mimo' } },
} as const;
export type Locale = keyof typeof messages;
export function translate(locale:Locale,key:keyof typeof messages.en.kids, params:Record<string,string>={}) {
  const template: string = messages[locale].kids[key];
  return template.replace(/\{(\w+)\}/g,(_,name:string)=>params[name]??'{'+name+'}');
}
