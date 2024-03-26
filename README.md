<img src='qso-soft.png'/>

# Usage overview | QSO-soft
## Steps to set up script:

1. Установить [VisualStudio Code](https://code.visualstudio.com/) или Sublime Text или любую другую IDE

2. Установка node, npm, git
2.1. Устанавливаем Node +, если версия ниже 20й - https://nodejs.org/en/download, либо - https://github.com/coreybutler/nvm-windows
2.2. Устанавливаем Git, если еще не установлен - https://gitforwindows.org/ (всё по умолчанию выбирайте)
2.3. Устанавливаем его глобально
```bash
npm install npm -g
npm install typescript -g
```

3. После установки Git у вас должен появиться bash в выборе терминалов в VS Code (на стрелочку нажмите снизу в терминале и там будет Git Bash). Используем обязательно его или zsh! Главное, не powershell!

4. Проверяем версию Node, NPM и NVM.
```bash
node -v && git -v && npm -v
# v20.8.0 (не обязательно прям цифра в цифру, главное чтобы была версия выше v20)
# git version 2.42.0 (все равно на версию)
# 9.8.1 (все равно на версию)
```

5. Переходим на рабочий стол
```bash
cd ./<путь на рабочий стол>
```

6. Клонируем репозиторий и выполняем логин в GitHub, так как это приватный репозиторий
```bash
git clone https://github.com/QSO-soft/QSO-csv-search
```

7. Переходим в папку с проектом
```bash
cd QSO-csv-search
```

8. Устанавливаем нужные зависимости
```bash
npm i
```

9.  Подготавливаем файлы к работе
```bash
npm run prepare-files
```

10. Заполняем [src/data/input.csv](src/data/input.csv) файл с любой датой, с которой будет производиться поиск, при этом первую строку (хедера) так-же можно заменить на желаемые
11. Заполняем [src/data/search.csv](src/data/search.csv) файл с полями и значениями, которые будут найдены в `input.csv`, при этом `field_to_search` можно оставлять пустыми, кроме самого первого значение, тогда поле будет браться именно с него ([Пример](src/data/search.example.csv))

12. npm start

13. Смотрим результат в [src/data/output.csv](src/data/output.csv)
