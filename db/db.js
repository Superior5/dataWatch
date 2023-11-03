import { Sequelize } from 'sequelize';

export default new Sequelize(
    "postgresql://gen_user:z%5CGMh1Q-%2BdC%3B4w@188.225.44.61:5432/default_db",
    {
        host: '188.225.44.61',
        port: '5432',
        dialect: 'postgres',
    }
)



