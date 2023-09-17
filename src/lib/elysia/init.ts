import { log, note, text } from '@clack/prompts';
import * as fs from 'fs/promises';

const baseConfig = {
  srcDir: 'src',
  modulesDir: 'api',
  moduleImportAlias: './api/',
  entryFile: 'index.ts',
};

export async function initializeElysiaConfig() {
  const srcDir = await text({
    message: 'Path to the source directory',
    defaultValue: './src',
    initialValue: './src',
  });

  const entryFile = await text({
    message: 'Path to the entry file',
    defaultValue: './src/index.ts',
    initialValue: './src/index.ts',
  });

  const modulesDir = await text({
    message: 'Path to the modules directory',
    defaultValue: './src/api',
    initialValue: './src/api',
  });

  const moduleImportAlias = await text({
    message: 'Module import alias',
    defaultValue: './api/',
    initialValue: './api/',
  });

  if (typeof srcDir === 'symbol' || typeof modulesDir === 'symbol') {
    throw new Error('An unknown error occurred.');
  }

  const config = {
    ...baseConfig,
    srcDir,
    entryFile,
    modulesDir,
    moduleImportAlias,
  };

  await fs.writeFile('./elysia.config.json', JSON.stringify(config, null, 2));

  log.success('Successfully initialized Elysia config.');

  return;
}
