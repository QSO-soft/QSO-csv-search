/* eslint-disable no-console */
import { spawn } from 'child_process';

import inquirer from 'inquirer';

const scripts = {
  search: 'search',
  update: 'update',
  encrypt: 'encrypt',
  decrypt: 'decrypt',
  testProxy: 'test-proxy',
};
const aliases = {
  runSearch: '1. Поиск в input.csv',
  runUpdate: '2. Обновление inputs.csv значениями из to-update.csv',
  runEncrypt: '3. Закодировать decrypted.txt',
  runDecrypt: '4. Декодировать encrypted.txt',
  runTestProxy: '5. Проверить прокси proxies.csv',

  exit: '0. Выйти',
};

const commandAliases = {
  [aliases.runSearch]: scripts.search,
  [aliases.runUpdate]: scripts.update,
  [aliases.runEncrypt]: scripts.encrypt,
  [aliases.runDecrypt]: scripts.decrypt,
  [aliases.runTestProxy]: scripts.testProxy,

  [aliases.exit]: 'exit',
};

const getSecretPhrase = async () => {
  const input = {
    type: 'input',
    name: 'secret',
    message: 'Введите секретную фразу для кодирования:',
    validate: (input) => {
      if (input.trim() === '') {
        return 'Secret cannot be empty';
      }
      return true;
    },
  };

  const { secret } = await inquirer.prompt(input);

  return secret;
};

const getStartMainCommand = async (projectName) => {
  const runMainCommand = `npm run ${projectName}`;

  let secret = '';
  if (projectName === 'encrypt' || projectName === 'decrypt') {
    secret = await getSecretPhrase();
  }
  return {
    command: runMainCommand,
    secret,
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
      const { command, secret } = await getStartMainCommand(scripts.search);
      selectedCommand = command;
      args = [secret];

      break;
    }
    case aliases.runUpdate: {
      const { command, secret } = await getStartMainCommand(scripts.update);
      selectedCommand = command;
      args = [secret];

      break;
    }
    case aliases.runEncrypt: {
      const { command, secret } = await getStartMainCommand(scripts.encrypt);
      selectedCommand = command;
      args = [secret];

      break;
    }
    case aliases.runDecrypt: {
      const { command, secret } = await getStartMainCommand(scripts.decrypt);
      selectedCommand = command;
      args = [secret];

      break;
    }
    case aliases.runTestProxy: {
      const { command, secret } = await getStartMainCommand(scripts.testProxy);
      selectedCommand = command;
      args = [secret];

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
      }
      // else {
      //   errMessage = errMessage
      //     .split('\n')
      //     .filter((string) => !!string)
      //     .at(-1);
      // }

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
