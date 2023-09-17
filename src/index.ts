#! /usr/bin/env node

import * as p from '@clack/prompts';
import color from 'picocolors';
import { getTool } from './util/get-tool';
import { getOption } from './util/get-option';

async function main() {
  p.intro(color.bgBlue(color.black(' RinYato CLI v1 ')));

  const tool = await getTool();

  const option = await getOption(tool);
}

main().catch(console.error);
