import { fileURLToPath } from 'node:url';
const nextConfig = {
  turbopack: { root: fileURLToPath(new URL('../../', import.meta.url)) },
  transpilePackages: ['@devnetra/core', '@devnetra/localization', '@devnetra/design-tokens'],
};
export default nextConfig;
