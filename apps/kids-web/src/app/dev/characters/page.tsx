import { CharacterPlayground } from '../../../components/character-playground';
import { notFound } from 'next/navigation';
export const metadata={title:'Devnetra | Character Playground'};
export default function CharactersPage(){
  if(process.env.NODE_ENV!=='development')notFound();
  return <CharacterPlayground/>;
}
