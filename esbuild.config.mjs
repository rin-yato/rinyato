import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: 'dist',
  tsconfig: 'tsconfig.json',
  platform: 'node',
});

console.log('✅ Build complete!');
