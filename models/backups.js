import sequelize from '../db/db.js';
import { DataTypes } from 'sequelize';


const Backup = sequelize.define('backup', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    title: {type: DataTypes.STRING },
    chatId: {type: DataTypes.STRING },
});


export default Backup;