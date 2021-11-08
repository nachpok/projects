const db=require('./0_DAL/db');
const bll_books=require('./1_BLL/books');
const bll_users=require('./1_BLL/users');
const bll_logs=require('./1_BLL/logs');
const auth=require('./1_BLL/auth');

//db.connect();
//db.disconnect();
db.initAllTables();// create all tables and insert data

