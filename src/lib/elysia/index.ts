import { log } from '@clack/prompts';
import { getElysiaOption } from './options';
import { initializeElysiaConfig } from './init';
import { generateModule } from './module';

export async function elysia() {
  const option = await getElysiaOption();

  switch (option) {
    case 'module':
      await generateModule();
      break;
    case 'auth':
      log.error('Auth has not been implemented yet.');
      break;
    case 'docs':
      log.error('Docs has not been implemented yet.');
      break;
    case 'init':
      await initializeElysiaConfig();
      break;
  }
}
