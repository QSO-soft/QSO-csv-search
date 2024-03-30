/* eslint-disable no-console */
import { spawn } from 'child_process';

import inquirer from 'inquirer';

const scripts = {
  search: 'search',
  update: 'update',
};
const aliases = {
  runSearch: '1. Поиск в input.csv',
  runUpdate: '2. Обновление inputs.csv значениями из to-update.csv',

  exit: '0. Выйти',
};

const commandAliases = {
  [aliases.runSearch]: scripts.search,
  [aliases.runUpdate]: scripts.update,

  [aliases.exit]: 'exit',
};

const getStartMainCommand = async (projectName) => {
  const runMainCommand = `npm run ${projectName}`;

  return {
    command: runMainCommand,
  };
};

(async () => {
  const aliasChoices = Object.keys(commandAliases);

  const questions = [
    {
      type: 'list',
      name: 'alias',
      message: 'Выберите скрипт для выполнения:',
      choices: aliasChoices,
    },
  ];

  const { alias } = await inquirer.prompt(questions);
  const selectedAlias = alias;
  let selectedCommand = commandAliases[selectedAlias];
  let args = [];

  switch (selectedAlias) {
    case aliases.runSearch: {
      const { command } = await getStartMainCommand(scripts.search);
      selectedCommand = command;
      break;
    }
    case aliases.runUpdate: {
      const { command } = await getStartMainCommand(scripts.update);
      selectedCommand = command;
      break;
    }

    default:
      break;
  }

  const commandProcess = spawn(selectedCommand, args, {
    shell: true,
  });

  // Отображаем вывод команды
  commandProcess.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  let errorCalled = false;
  // Отображаем ошибки (если есть)
  commandProcess.stderr.on('data', (data) => {
    if (!errorCalled) {
      let errMessage = data.toString();

      if (errMessage.includes('triggerUncaughtException')) {
        errMessage =
          'Unknown error occurred: please, call "tsc" command to see the problem or compare global.js with global.example.js';
      } else {
        errMessage = errMessage
          .split('\n')
          .filter((string) => !!string)
          .at(-1);
      }

      process.stderr.write(
        `\x1b[31m${errMessage}\x1b[0m
`
      );
      errorCalled = true;
    }
  });

  // Завершаем выполнение команды и выводим код завершения
  commandProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`Скрипт успешно выполнен: ${selectedCommand}`);
    } else {
      console.error(`Ошибка выполнения скрипта: ${selectedCommand}`);
    }
  });
})();
