import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { generateTemplate } from '../utils/template-generator.js';
import { validateProjectName } from '../utils/validate.js';

export interface ProjectConfig {
	projectName: string;
	orm: 'prisma' | 'drizzle';
	ide: 'cursor' | 'claude' | 'other';
	installDependencies: boolean;
	initGit: boolean;
	typescript: boolean;
}

export async function createProject(
	projectName?: string,
	options?: any,
): Promise<void> {
	console.log(
		chalk.cyan(`
╔═══════════════════════════════╗
║       🏴‍☠️ Create Corsair        ║
║   Next.js + PostgreSQL + ORM  ║
╚═══════════════════════════════╝
`),
	);

	const config = await promptForConfig(projectName, options);

	console.log(chalk.blue('\n📦 Creating your Corsair project...\n'));

	const projectPath = path.resolve(process.cwd(), config.projectName);

	// Validate project directory
	if (fs.existsSync(projectPath)) {
		const { overwrite } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'overwrite',
				message: `Directory ${config.projectName} already exists. Overwrite?`,
				default: false,
			},
		]);

		if (!overwrite) {
			console.log(chalk.yellow('Project creation cancelled.'));
			return;
		}

		await fs.remove(projectPath);
	}

	const spinner = ora('Generating project files...').start();

	try {
		// Generate the template
		await generateTemplate(projectPath, config);
		spinner.succeed('Project files generated!');

		if (config.installDependencies) {
			const installSpinner = ora('Installing dependencies...').start();
			try {
				await execa('pnpm', ['install'], { cwd: projectPath });
				installSpinner.succeed('Dependencies installed!');
			} catch (error) {
				installSpinner.fail('Failed to install dependencies');
				console.log(
					chalk.yellow(
						'You can install dependencies manually with: pnpm install',
					),
				);
			}
		}

		if (config.initGit) {
			const gitSpinner = ora('Initializing git repository...').start();
			try {
				await execa('git', ['init'], { cwd: projectPath });
				await execa('git', ['add', '.'], { cwd: projectPath });
				await execa(
					'git',
					['commit', '-m', 'Initial commit from create-corsair'],
					{ cwd: projectPath },
				);
				gitSpinner.succeed('Git repository initialized!');
			} catch (error) {
				gitSpinner.fail('Failed to initialize git repository');
				console.log(
					chalk.yellow('You can initialize git manually with: git init'),
				);
			}
		}

		// Success message
		console.log(chalk.green('\n✅ Project created successfully!\n'));
		console.log(chalk.blue('Next steps:'));
		console.log(chalk.gray(`  cd ${config.projectName}`));
		if (!config.installDependencies) {
			console.log(chalk.gray('  pnpm install'));
		}
		console.log(chalk.gray('  cp .env.example .env.local'));
		console.log(chalk.gray('  # Configure your DATABASE_URL in .env.local'));
		console.log(chalk.gray('pnpm db:generate'));
		console.log(chalk.gray('pnpm db:migrate'));
		console.log(chalk.gray('pnpm db:push'));
		console.log(chalk.gray('pnpm dev'));

		console.log(chalk.cyan('\n🏴‍☠️ Happy coding with Corsair!'));
	} catch (error) {
		spinner.fail('Failed to create project');
		throw error;
	}
}

async function promptForConfig(
	projectName?: string,
	options?: any,
): Promise<ProjectConfig> {
	const questions: any[] = [];

	// Project name
	if (!projectName) {
		questions.push({
			type: 'input',
			name: 'projectName',
			message: 'What is your project named?',
			default: 'my-corsair-app',
			validate: validateProjectName,
		});
	}

	// ORM choice (if not specified via options)
	if (!options?.prisma && !options?.drizzle) {
		questions.push({
			type: 'list',
			name: 'orm',
			message: 'Which ORM would you like to use?',
			choices: [
				{ name: '🟢 Drizzle (Recommended)', value: 'drizzle' },
				{ name: '🔷 Prisma', value: 'prisma' },
			],
			default: 'drizzle',
		});
	}

	// IDE choice (if not specified via options)
	if (!options?.ide) {
		questions.push({
			type: 'list',
			name: 'ide',
			message: 'Which AI IDE/assistant are you using?',
			choices: [
				{ name: '🖱️  Cursor', value: 'cursor' },
				{ name: '🤖 Claude', value: 'claude' },
				{ name: '📝 Other', value: 'other' },
			],
			default: 'cursor',
		});
	}

	// Additional options (only ask if not provided via flags)
	if (!options?.skipInstall && options?.skipInstall !== true) {
		questions.push({
			type: 'confirm',
			name: 'installDependencies',
			message: 'Would you like us to run pnpm install?',
			default: true,
		});
	}

	if (!options?.skipGit && options?.skipGit !== true) {
		questions.push({
			type: 'confirm',
			name: 'initGit',
			message: 'Initialize a new git repository?',
			default: true,
		});
	}

	const answers = await inquirer.prompt(questions);

	return {
		projectName: projectName || answers.projectName,
		orm: options?.prisma
			? 'prisma'
			: options?.drizzle
				? 'drizzle'
				: answers.orm,
		ide: options?.ide || answers.ide || 'cursor',
		installDependencies: options?.skipInstall
			? false
			: (answers.installDependencies ?? true),
		initGit: options?.skipGit ? false : (answers.initGit ?? true),
		typescript: true, // Always use TypeScript
	};
}
