import sequelize from '../db/db.js';
import { DataTypes } from 'sequelize';


const Test = sequelize.define('test', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    text: {type: DataTypes.STRING },
    chatId: {type: DataTypes.STRING },
});


export default Test;