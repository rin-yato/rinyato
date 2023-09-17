import { select } from '@clack/prompts';

export const elysiaOptions = [
  {
    label: 'Generate a new module',
    value: 'module',
  },
  {
    label: 'Add Auth with Lucia',
    value: 'auth',
  },
  {
    label: 'Generate Docs',
    value: 'docs',
  },
  {
    lable: 'Initialize Config',
    value: 'init',
    hint: 'This will initialize the config file for Elysia.',
  },
] as const;

export async function getElysiaOption() {
  const option = await select({
    message: 'What do you want to do with Elysia?',
    maxItems: 1,
    initialValue: 'module',
    options: elysiaOptions.map(option => option),
  });

  if (typeof option === 'symbol') {
    throw new Error('An unknown error occurred.');
  }

  return option as (typeof elysiaOptions)[number]['value'];
}
