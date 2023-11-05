import TelegramApi from "node-telegram-bot-api";
import sequelize from "./db/db.js";
import Test from "./models/test.js";
import cron from "node-cron";
import  { execute } from '@getvim/execute';
import shell from 'shelljs'

import { execSync }  from "child_process";


const test = 'pg_dump -h 188.225.24.228 -p 5432 -U gen_user default_db > C:/projects/backend/hackathonBot/backupsmyDump.sql'
const execRun = (cmd) => {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          if (error.code === 1) {
            // leaks present
            resolve(stdout);
          } else {
            // gitleaks error
            reject(error);
          }
        } else {
          // no leaks
          resolve(stdout);
        }
      })
    })
  }


const API_KEY_BOT = "6575266414:AAEs0X5Oxqoq8NHoAbwu479WrA2JwflMh-A";

const bot = new TelegramApi(API_KEY_BOT, { polling: true });

const start = async () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Привет, я тупо сохраняю твои сообщения",
    },
    { command: "/status", description: "Информация о состоянии базы данных" },
    { command: "/show", description: "Вывести историю сообщений" },
    { command: "/backup", description: "Вывести историю сообщений" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (msg.text === "/start") {
      cron.schedule("15,30,45,0 * * * * *", () => {
        console.log("hello");
        try {
          sequelize
            .authenticate()
            .then()
            .catch((e) => {
              console.log(e);
              bot.sendMessage(
                chatId,
                `‼️ Не удается подлючится как базе, данных! Проверьте настройки подключени или попробуйте восстановить её с контрольной точки.`
              );
            });
        } catch (error) {
          console.log(error);
        }
      });
      return bot.sendMessage(
        chatId,
        `Привет, ${msg.from.first_name} ${msg.from.last_name}! Здесь можешь проверить статус своих Баз Данных.`
      );
    }

    if (msg.text === "/status") {
      try {
        await sequelize.authenticate();
        return bot.sendMessage(chatId, `База данных доступна!`);
      } catch (error) {
        console.log(error);
        return bot.sendMessage(
          chatId,
          `‼️ Не удается подлючится как базе, данных! Проверьте настройки подключени или попробуйте восстановить её с контрольной точки.`
        );
      }
    }

    if (msg.text === "/show") {
      const info = await Test.findAll({ chatId });
      console.log(info);
      return bot.sendMessage(chatId, `Таблице Test ${info} записей!`);
    }


    
    if (msg.text === "/backup") {

        // (async () => {
        //     try {
        //       const testing = await execRun(test)
        //       console.log(testing)
        //     } catch (e) {
        //       console.log(e)
        //     }
        //     })()
        

        // const dump_result = execSync(test);
        // console.log(dump_result.toString());
        // exec("pg_dump -h 188.225.24.228 -p 5432 -U gen_user default_db > C:\projects\backend\hackathonBot\backupsmyDump.sql", (error, stdout, stderr) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         return;
        //     }
        //     if (stderr) {
        //         console.log(`stderr: ${stderr}`);
        //         return;
        //     }
        //     return bot.sendMessage(chatId, `Бэкап сохранен`);

        // });

        execute('bash pg_dump -h 188.225.24.228 -p 5432 -U gen_user default_db > C:\projects\backend\hackathonBot\backups\myDump.sql')
        .then(async () => {
            return bot.sendMessage(chatId, `Бэкап сохранен`);
        }).catch(err => {
            console.log(err);
        });
        
      }
  
    // await Test.create({chatId, text})
    return bot.sendMessage(chatId, `Сообщение сохранено.`);
  });
};



start();
