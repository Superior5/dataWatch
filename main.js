import TelegramApi from "node-telegram-bot-api";
import sequelize from "./db/db.js";
import Test from "./models/test.js";
import cron from "node-cron";
import  { execute } from '@getvim/execute';


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
        
        const date = new Date();
        const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}|${date.getHours()}:${date.getMinutes()}`

        const fileName = `database-backup-${currentDate}`;

        const test = `PGPASSWORD="&I_?gr-~e^#_s8" pg_dump -h 188.225.24.228 -p 5432 -U gen_user default_db > ${fileName}.sql`


        execute(test)
        .then(async () => {
            return bot.sendMessage(chatId, `Бэкап сохранен`);
        }).catch(err => {
            console.log(err);
        });
        
      }
  });
};



start();
