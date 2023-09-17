import { select } from '@clack/prompts';

export type Tool = (typeof tools)[number];

export const tools = ['Elysia', 'Shadcn', 'Tailwind'] as const;

export async function getTool(): Promise<Tool> {
  const tool = await select({
    message: 'What do you want to do?',
    initialValue: 'Elysia' as Tool,
    maxItems: 1,
    options: tools.map(tool => ({ label: tool, value: tool })),
  });

  if (typeof tool === 'symbol') {
    throw new Error('An unknown error occurred.');
  }

  return tool;
}
