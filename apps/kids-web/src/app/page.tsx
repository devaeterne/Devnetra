import { ageBands } from '@devnetra/core';
import { messages } from '@devnetra/localization';
export default function Home() {return <main><h1>Devnetra Kids</h1><p>{messages.en.kids.welcome}</p><p>Learning tracks: {ageBands.join(' / ')}</p></main>}
