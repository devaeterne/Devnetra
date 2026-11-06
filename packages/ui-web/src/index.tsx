import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; icon?: ReactNode };
export function DvButton({variant='primary', icon, children, className='', ...props}: ButtonProps) {
  return <button className={['dv-button', 'dv-button--'+variant, className].join(' ')} {...props}>{icon}{children}</button>;
}
export function DvCard({children,className='',...props}:HTMLAttributes<HTMLElement>) {
  return <section className={'dv-card '+className} {...props}>{children}</section>;
}
export function DvProgress({value,max=100,label}: {value:number;max?:number;label:string}) {
  const percent = Math.round(Math.max(0, Math.min(100, (value/Math.max(max, 1))*100)));
  return <div className="dv-progress" role="progressbar" aria-label={label} aria-valuenow={Math.min(max,Math.max(0,value))} aria-valuemin={0} aria-valuemax={max}><div className="dv-progress__bar" style={{width:percent+'%'}} /></div>;
}
