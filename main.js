import TelegramApi from 'node-telegram-bot-api';
import sequelize from './db/db.js';
import Test from './models/test.js'
import cron from 'node-cron';
const API_KEY_BOT = '6575266414:AAEs0X5Oxqoq8NHoAbwu479WrA2JwflMh-A';


const bot = new TelegramApi(API_KEY_BOT, {polling: true});



const start = async () => {
    
    
    bot.setMyCommands([
        {command: '/start', description: 'Привет, я тупо сохраняю твои сообщения'},
        {command: '/status', description: 'Информация о состоянии базы данных'},
        {command: '/show', description: 'Вывести историю сообщений'},
    ]);


    bot.on('message', async (msg)=>{

        const text = msg.text;
        const chatId = msg.chat.id;

        


        if(msg.text === '/start') {
            return bot.sendMessage(chatId,`Привет, ${msg.from.first_name} ${msg.from.last_name}! Здесь можешь проверить статус своих Баз Данных.`);
        }

        if(msg.text === '/status') {
            try {
                await sequelize.authenticate();
                return bot.sendMessage(chatId,`База данных доступна!`);
              } catch (error) {
                console.log(error)
                return bot.sendMessage(chatId,`‼️ Не удается подлючится как базе, данных! Проверьте настройки подключени или попробуйте восстановить её с контрольной точки.`);
            }
        }

        if(msg.text === '/show') {
            const info = await Test.findAll({chatId});
            console.log(info)
            return bot.sendMessage(chatId,`Таблице Test ${info} записей!`);
        }
        

   
        // await Test.create({chatId, text})
        return bot.sendMessage(chatId,`Сообщение сохранено.`);
    });
}


start();