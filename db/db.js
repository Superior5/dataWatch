import { Sequelize } from 'sequelize';

export default new Sequelize(
    "postgresql://gen_user:%26I_%3Fgr-~e%5E%23_s8@188.225.24.228:5432/default_db",
    {
        host: '188.225.44.61',
        port: '5432',
        dialect: 'postgres',
        logging: function (str) {
            console.log(str)
        }
    
    }
)



