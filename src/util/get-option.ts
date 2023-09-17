import { log } from '@clack/prompts';
import { Tool } from './get-tool';
import { elysia } from '../lib/elysia';

export async function getOption(tool: Tool) {
  switch (tool) {
    case 'Elysia':
      return await elysia();
    case 'Shadcn':
      log.error('Shadcn is not yet implemented.');
      break;
    case 'Tailwind':
      log.error('Tailwind is not yet implemented.');
      break;
  }
}
