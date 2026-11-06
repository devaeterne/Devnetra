import type { ReactNode } from 'react';
import '@devnetra/design-tokens/styles.css';
import '@devnetra/ui-web/styles.css';
import '@devnetra/characters/styles.css';
import './globals.css';

export default function RootLayout({children}:{children:ReactNode}) {
  return <html lang="en"><body data-dv-theme="kids">{children}</body></html>;
}
