// require('dotenv').config(); 
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.SUPABASE_CONNECTION_STRING, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: false
// });

// module.exports = sequelize;
require('dotenv').config(); 
const { Sequelize } = require('sequelize');

const
      host = process.env.DB_HOST,
      password = String(process.env.DB_PASSWORD),
      port = process.env.DB_PORT;

const sequelize = new Sequelize(`postgres://postgres:${password}@${host}:${port}/postgres`, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = sequelize;

