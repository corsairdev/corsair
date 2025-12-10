#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { createProject } from './create-project.js';

const program = new Command();

program
	.name('create-corsair')
	.description('Create a new Corsair project with Next.js')
	.version('0.1.0')
	.argument('[project-name]', 'name of the project to create')
	.option('-p, --prisma', 'use Prisma as the ORM')
	.option('-d, --drizzle', 'use Drizzle as the ORM')
	.option('--ide <ide>', 'AI IDE/assistant (cursor, claude, other)')
	.option('--skip-install', 'skip package installation')
	.option('--skip-git', 'skip git initialization')
	.action(async (projectName, options) => {
		try {
			await createProject(projectName, options);
		} catch (error) {
			console.error(chalk.red('Error creating project:'), error);
			process.exit(1);
		}
	});

program.parse();
