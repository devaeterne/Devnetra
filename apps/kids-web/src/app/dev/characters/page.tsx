import { RobotStudio } from '../../../components/robot-studio';
import { notFound } from 'next/navigation';
export const metadata={title:'Devnetra | Character Studio'};
export default function CharactersPage(){
 if(process.env.NODE_ENV!=='development')notFound();
 return <RobotStudio/>;
}
