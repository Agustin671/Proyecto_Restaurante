module.exports = {
  development: {
    username: 'root',
    password: '0980',
    database: 'restaurante_db',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
