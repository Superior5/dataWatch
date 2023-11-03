import TelegramApi from 'node-telegram-bot-api';
import sequelize from './db/db.js';
import Test from './models/test.js'
const API_KEY_BOT = '6575266414:AAEs0X5Oxqoq8NHoAbwu479WrA2JwflMh-A';


const bot = new TelegramApi(API_KEY_BOT, {polling: true});


const start = async () => {
    
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.log('Произошла ошибка при подлючении к БД', error)
    }
    
    bot.setMyCommands([
        {command: '/start', description: 'Привет, я тупо сохраняю твои сообщения'},
        {command: '/status', description: 'Информация о состоянии базы данных'},
        {command: '/show', description: 'Вывести историю сообщений'},
    ]);

    bot.on('message', async (msg)=>{

        const text = msg.text;
        const chatId = msg.chat.id;

        if(msg.text === '/start') {
            return bot.sendMessage(chatId,`Ну привет, ${msg.from.first_name} ${msg.from.last_name}! Я сохраняю твои сообщения.`);
        }

        if(msg.text === '/status') {
            const info = await Test.findAll({chatId});
            return bot.sendMessage(chatId,`Таблице Test ${info.length} записей!`);
        }

        if(msg.text === '/show') {
            const info = await Test.findAll({chatId});
            console.log(info)
            return bot.sendMessage(chatId,`Таблице Test ${info} записей!`);
        }
        
        await Test.create({chatId, text})
        return bot.sendMessage(chatId,`Сообщение сохранено.`);
    });
}


start();