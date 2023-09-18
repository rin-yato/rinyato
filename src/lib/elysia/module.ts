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

    const appDeclaration = lines.find(line =>
      line.startsWith('const app = new Elysia()'),
    );

    const isOneLine =
      appDeclaration &&
      (appDeclaration.endsWith(';') || appDeclaration.includes('.listen'));

    const importLine = `import { ${moduleName} } from './api/${routeName}';`;
    const useLine = `.use(${moduleName})`;

    const importIndex = lines.findLastIndex(line => line.includes('import'));

    // add the import line after the last import line
    lines.splice(importIndex + 1, 0, importLine);

    if (isOneLine) {
      const separated = appDeclaration.split('.');
      const lastUseIndex = separated.findLastIndex(line => line.includes('use'));
      let newAppDeclaration = '';
      if (lastUseIndex === -1) {
        // add the use line after the app declaration
        newAppDeclaration = separated
          .map((line, index) => (index === 0 ? line + useLine : line))
          .join('.');
      } else {
        newAppDeclaration = separated
          .map((line, index) =>
            index === lastUseIndex ? line + useLine : line,
          )
          .join('.');
      }

      lines.splice(
        lines.findIndex(line => line === appDeclaration),
        1,
        newAppDeclaration,
      );
    } else {
      // add the use line after the last use line
      const useIndex = lines.findLastIndex(line => line.includes('.use'));
      lines.splice(useIndex + 1, 0, useLine);
    }

    await fs.writeFile('./src/index.ts', lines.join('\n'));
  } catch (error) {
    log.error(`❌ Failed to add module ${moduleName} to entry file.`);
    if (error instanceof Error) log.error(error.message);
    return;
  }
}
