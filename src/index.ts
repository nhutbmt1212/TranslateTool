#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { Translator } from './translator.js';
import * as readline from 'readline';

const program = new Command();
const translator = new Translator();

// Cấu hình CLI
program
  .name('translate-tool')
  .description('Ứng dụng dịch thuật bằng TypeScript')
  .version('1.0.0');

// Lệnh dịch đơn giản
program
  .command('translate')
  .alias('t')
  .description('Dịch văn bản')
  .argument('<text>', 'Văn bản cần dịch')
  .option('-t, --to <lang>', 'Ngôn ngữ đích (mặc định: en)', 'en')
  .option('-f, --from <lang>', 'Ngôn ngữ nguồn (tự động phát hiện nếu không chỉ định)')
  .action(async (text: string, options: { to: string; from?: string }) => {
    try {
      console.log(chalk.blue('\n🔄 Đang dịch...\n'));
      
      const result = await translator.translate(text, options.to, options.from);
      
      console.log(chalk.gray(`Từ: ${result.from} → ${result.to}`));
      console.log(chalk.yellow(`\n📝 Văn bản gốc:`));
      console.log(chalk.white(result.originalText));
      console.log(chalk.green(`\n✨ Bản dịch:`));
      console.log(chalk.bold.green(result.text));
      console.log();
    } catch (error) {
      console.error(chalk.red('❌ Lỗi:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Lệnh chế độ tương tác
program
  .command('interactive')
  .alias('i')
  .description('Chế độ tương tác - dịch nhiều lần')
  .option('-t, --to <lang>', 'Ngôn ngữ đích mặc định (mặc định: en)', 'en')
  .action(async (options: { to: string }) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(chalk.blue('\n🌍 Chế độ dịch tương tác'));
    console.log(chalk.gray('Nhập "exit" hoặc "quit" để thoát\n'));

    const askQuestion = () => {
      rl.question(
        chalk.cyan(`Dịch sang ${options.to} (hoặc nhập "to:<lang>" để đổi ngôn ngữ): `),
        async (input: string) => {
          if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log(chalk.blue('\n👋 Tạm biệt!'));
            rl.close();
            return;
          }

          // Kiểm tra nếu muốn đổi ngôn ngữ đích
          if (input.startsWith('to:')) {
            const newLang = input.substring(3).trim();
            options.to = newLang;
            console.log(chalk.green(`✓ Đã đổi ngôn ngữ đích thành: ${newLang}\n`));
            askQuestion();
            return;
          }

          if (!input.trim()) {
            askQuestion();
            return;
          }

          try {
            console.log(chalk.blue('\n🔄 Đang dịch...'));
            const result = await translator.translate(input, options.to);
            
            console.log(chalk.gray(`[${result.from} → ${result.to}]`));
            console.log(chalk.green(`✨ ${result.text}\n`));
          } catch (error) {
            console.error(chalk.red('❌ Lỗi:'), error instanceof Error ? error.message : error);
            console.log();
          }

          askQuestion();
        }
      );
    };

    askQuestion();
  });

// Lệnh xem danh sách ngôn ngữ
program
  .command('languages')
  .alias('langs')
  .description('Hiển thị danh sách ngôn ngữ được hỗ trợ')
  .action(() => {
    const languages = translator.getSupportedLanguages();
    console.log(chalk.blue('\n📚 Các ngôn ngữ được hỗ trợ:\n'));
    
    for (const [code, name] of Object.entries(languages)) {
      console.log(chalk.cyan(`  ${code.padEnd(5)} - ${name}`));
    }
    console.log();
  });

// Nếu không có lệnh nào được chỉ định, hiển thị help
if (process.argv.length === 2) {
  program.help();
}

program.parse();

