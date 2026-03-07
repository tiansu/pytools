#!/usr/bin/env node

/**
 * PyTools CLI - Python 开发工具集
 * 提供代码格式化、检查、依赖管理、虚拟环境管理等功能
 * @created 2026-03-07
 */

import { program } from 'commander';
import chalk from 'chalk';
import { execa } from 'execa';

// 工具函数：执行Python命令
async function runPythonCommand(cmd, args, options = {}) {
  try {
    const { stdout, stderr } = await execa(cmd, args, { 
      ...options,
      stdio: 'inherit' 
    });
    return { success: true, stdout, stderr };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      stderr: error.stderr 
    };
  }
}

// 格式化命令处理
async function handleFormat(path, options) {
  console.log(chalk.blue(`📝 格式化 Python 代码: ${path}`));
  
  const formatter = options.formatter || 'black';
  const args = [path];
  
  if (formatter === 'black') {
    return await runPythonCommand('black', args);
  } else if (formatter === 'autopep8') {
    return await runPythonCommand('autopep8', ['--in-place', '--aggressive', path]);
  } else {
    console.log(chalk.red(`❌ 不支持的格式化工具: ${formatter}`));
    return { success: false, error: 'Unsupported formatter' };
  }
}

// 代码检查命令处理
async function handleLint(path, options) {
  console.log(chalk.blue(`🔍 检查 Python 代码: ${path}`));
  
  const linter = options.linter || 'pylint';
  const args = [path];
  
  if (linter === 'pylint') {
    return await runPythonCommand('pylint', args);
  } else if (linter === 'flake8') {
    return await runPythonCommand('flake8', args);
  } else {
    console.log(chalk.red(`❌ 不支持的检查工具: ${linter}`));
    return { success: false, error: 'Unsupported linter' };
  }
}

// 依赖管理命令处理
async function handleDeps(action, packageName, options) {
  console.log(chalk.blue(`📦 依赖管理: ${action} ${packageName || ''}`));
  
  switch (action) {
    case 'list':
      return await runPythonCommand('pip', ['list']);
    case 'install':
      if (!packageName) {
        return { success: false, error: '需要指定包名' };
      }
      return await runPythonCommand('pip', ['install', packageName]);
    case 'update':
      return await runPythonCommand('pip', ['install', '--upgrade', packageName || 'pip']);
    case 'remove':
      if (!packageName) {
        return { success: false, error: '需要指定包名' };
      }
      return await runPythonCommand('pip', ['uninstall', '-y', packageName]);
    default:
      console.log(chalk.red(`❌ 不支持的操作: ${action}`));
      return { success: false, error: 'Unsupported action' };
  }
}

// 虚拟环境管理命令处理
async function handleVenv(action, name, options) {
  console.log(chalk.blue(`🐍 虚拟环境管理: ${action} ${name || ''}`));
  
  switch (action) {
    case 'create':
      if (!name) {
        return { success: false, error: '需要指定环境名称' };
      }
      return await runPythonCommand('python3', ['-m', 'venv', name]);
    case 'activate':
      console.log(chalk.yellow('ℹ️ 激活虚拟环境:'));
      console.log(chalk.gray(`  source ${name}/bin/activate`));
      console.log(chalk.gray(`  # 或 Windows: ${name}\\Scripts\\activate`));
      return { success: true, message: '请手动执行激活命令' };
    case 'delete':
      if (!name) {
        return { success: false, error: '需要指定环境名称' };
      }
      return await runPythonCommand('rm', ['-rf', name]);
    case 'list':
      // 列出当前目录下的虚拟环境
      const { execaSync } = await import('execa');
      const { stdout } = execaSync('ls', ['-d', '*/']);
      console.log(chalk.cyan('虚拟环境列表:'));
      console.log(stdout);
      return { success: true };
    default:
      console.log(chalk.red(`❌ 不支持的操作: ${action}`));
      return { success: false, error: 'Unsupported action' };
  }
}

// 执行脚本命令处理
async function handleRun(script, scriptArgs, options) {
  console.log(chalk.blue(`▶️ 执行 Python 脚本: ${script}`));
  
  const args = [script];
  if (scriptArgs) {
    args.push(...scriptArgs.split(' '));
  }
  
  return await runPythonCommand('python3', args);
}

// 配置 CLI 命令
program
  .name('pytools')
  .description('Python 开发工具集\n提供代码格式化、检查、依赖管理、虚拟环境管理、脚本执行等功能')
  .version('1.0.0');

// format 命令
program
  .command('format <path>')
  .description('格式化 Python 代码')
  .option('-f, --formatter <tool>', '格式化工具: black 或 autopep8', 'black')
  .action(handleFormat);

// lint 命令
program
  .command('lint <path>')
  .description('检查 Python 代码质量')
  .option('-l, --linter <tool>', '检查工具: pylint 或 flake8', 'pylint')
  .action(handleLint);

// deps 命令
program
  .command('deps <action> [package]')
  .description('管理 Python 项目依赖')
  .action(handleDeps);

// venv 命令
program
  .command('venv <action> [name]')
  .description('管理 Python 虚拟环境')
  .action(handleVenv);

// run 命令
program
  .command('run <script> [args]')
  .description('执行 Python 脚本')
  .action(handleRun);

// 解析命令行参数
program.parse();