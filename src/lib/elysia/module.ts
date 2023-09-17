import { log, text } from '@clack/prompts';
import * as fs from 'fs/promises';

const baseTemplate = `import { Elysia } from 'elysia';


export const {{moduleName}} = new Elysia().group('{{routeName}}', app => 
  app
    // Get all
    .get('/', () => ({ hello: 'world' }))

    // Get one
    .get('/:id', ({ params }) => ({ id: params.id }))

    // Create
    .post('/', ({ body }) => ({ body }))

    // Update
    .put('/:id', ({ params, body }) => ({ id: params.id, body }))

    // Delete
    .delete('/:id', ({ params }) => ({ id: params.id }))
);
`;

export async function generateModule() {
  const name = await text({
    message: 'What is the name of the module?',
    validate: value => {
      if (!/^[a-z]*$/.test(value)) {
        return 'Module name can only contain lowercase letters.';
      }
    },
  });

  if (typeof name === 'symbol') {
    throw new Error('An unknown error occurred.');
  }

  const moduleName = name[0].toUpperCase() + name.slice(1);
  const routeName = name.toLowerCase();

  await checkAndCreateDir(`./src/api`);
  await checkAndCreateDir(`./src/api/${routeName}`);

  const template = baseTemplate
    .replace('{{moduleName}}', moduleName)
    .replace('{{routeName}}', routeName);

  try {
    await fs.writeFile(`./src/api/${routeName}/index.ts`, template);
  } catch (error) {
    log.error(`❌ Failed to generate module ${moduleName}.`);
    if (error instanceof Error) log.error(error.message);
    return;
  }

  await addModuleToEntryFile(moduleName, routeName);

  log.success(`✅ Successfully generated module ${moduleName}.`);
}

async function checkAndCreateDir(dir: string) {
  try {
    await fs.access(dir);
  } catch (error) {
    try {
      await fs.mkdir(dir);
    } catch (error) {
      log.error(`❌ Failed to create directory ${dir}.`);
      if (error instanceof Error) log.error(error.message);
      return;
    }
  }
}

async function addModuleToEntryFile(moduleName: string, routeName: string) {
  try {
    const entryFile = await fs.readFile('./src/index.ts', 'utf-8');
    const lines = entryFile.split('\n');

    const importLine = `import { ${moduleName} } from './api/${routeName}';`;
    const appLine = `.use(${moduleName})`;

    const importIndex = lines.findIndex(line => line.includes('import'));
    const appIndex = lines.findIndex(line => line.includes('.use'));

    lines.splice(importIndex + 1, 0, importLine);
    lines.splice(appIndex + 1, 0, appLine);

    await fs.writeFile('./src/index.ts', lines.join('\n'));
  } catch (error) {
    log.error(`❌ Failed to add module ${moduleName} to entry file.`);
    if (error instanceof Error) log.error(error.message);
    return;
  }
}
