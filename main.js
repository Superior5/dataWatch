import TelegramApi from "node-telegram-bot-api";
import sequelize from "./db/db.js";
import Test from "./models/test.js";
import Backup from "./models/backups.js";
import cron from "node-cron";
import  { execute } from '@getvim/execute';

import { API_KEY_BOT, PGPASSWORD, HOST, PORT } from "./config.js";


const bot = new TelegramApi(API_KEY_BOT, { polling: true });

const start = async () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Ну-с, начали!",
    },
    { command: "/test", description: "Добавим немного данных БД!" },
    
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    await sequelize.authenticate()
    await sequelize.sync();

    if (text === "/start") {
      cron.schedule("15,30,45,0 * * * * *", () => {
    
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

      return ( bot.sendMessage(
        chatId,
        `Привет, ${msg.from.first_name} ${msg.from.last_name}! База данных в полном порядке!.`
      ),
      bot.sendMessage(chatId, 'Можешь выбрать действия 👇', {
            reply_markup: {
                keyboard: [
                    ['Выбрать бекап', 'Создать бекап'],
                    ['Получить информацию']
                ]
            }
        })
      );
    }

    if (text === "/status") {
      try {
        await sequelize.authenticate();
        await sequelize.sync();
        return bot.sendMessage(chatId, `База данных доступна!`);
      } catch (error) {
        console.log(error);
        return bot.sendMessage(
          chatId,
          `‼️ Не удается подлючится как базе, данных! Проверьте настройки подключени или попробуйте восстановить её с контрольной точки.`
        );
      }
    }

    if (text === "/show") {
      const info = await Test.findAll({ chatId });
      console.log(info);
      return bot.sendMessage(chatId, `Таблице Test ${info} записей!`);
    }


    
    if (text === "Создать бекап") {
        
        const date = new Date();
        const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}:${date.getMinutes()}`
        const fileName = `database-backup-${currentDate}.sql`;
        await Backup.create({
            title: fileName,
            chatId
        })

        const test = `PGPASSWORD="&I_?gr-~e^#_s8" pg_dump -h 188.225.24.228 -p 5432 -U gen_user default_db > backups/${fileName}`

        execute(test)
        .then(async () => {
            return bot.sendMessage(chatId, `Бэкап сохранен`);
        }).catch(err => {
            console.log(err);

            bot.sendMessage(chatId, `Что-то пошло не так!`);

        });
        
    }


    if (text === "Выбрать бекап") {
        
        const backups = await Backup.findAll({chatId });

        let keyboards = []

        for(let item of backups) {
            console.log(item.dataValues.title)
            keyboards.push([{
                text: item.dataValues.title,
                callback_data: item.dataValues.title,
            }])
        }
        console.log(keyboards)
        bot.sendMessage(chatId, 'Выберите бекап 👇', {
            reply_markup: {
                inline_keyboard: keyboards
            }
        })

        
        const date = new Date();
        const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}:${date.getMinutes()}`
        const fileName = `database-backup-${currentDate}.sql`;
        // await Backups.create({
        //     title: fileName,
        //     chatId
        // })

        // const test = `PGPASSWORD=${PGPASSWORD} pg_dump -h ${HOST} -p ${PORT} -U gen_user default_db > backups/${fileName}`

        // execute(test)
        // .then(async () => {
        //     return bot.sendMessage(chatId, `Бэкап сохранен`);
        // }).catch(err => {
        //     console.log(err);
        // });
        // return bot.sendMessage(chatId, `Бэкап от ${currentDate} сохранен!`);
    }

    bot.on('callback_query', (query) => {
        console.log(query.data)
    })
  });
};



start();
