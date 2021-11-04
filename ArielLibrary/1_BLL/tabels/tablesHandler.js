const dal = require ('./../../0_DAL/index');

const {Books}={...require('./books')};
const {Users}={...require('./users')};
const {Logs}={...require('./bookLog')};

class TableHandler{
    static async getTableCols(tableName){
        let res = await dal.runQuery(`SELECT COLUMN_NAME 
                             FROM INFORMATION_SCHEMA.COLUMNS 
                             WHERE table_name = '${tableName}' AND table_schema = 'ariellibrary';`);
        return dal.extractDbResult(res).map(e => e.COLUMN_NAME);
    }

    static initDatabase(){
        return new Promise(
            (resolve,reject)=>{
                TableHandler.createAllTables()
                .then(TableHandler.insertAllTables)
                .then(resolve)
                .catch(reject)
            }
        );
    }
    static createAllTables(){
        return Promise.all([
            Books.createTable(),
            Users.createTable()
        ]).then(Logs.createTable());
    }

    static dropAllTables(){
        return dal.connect()
            .then(()=>dal.runQuery('SET FOREGIN_KEY_CHECKS = 0'))
            .then(
                ()=>Promise.all([
                Books.dropTable(),
                Users.dropTable(),
                Logs.dropTable()
            ])
            )
            .then(()=>dal.runQuery('set foreign_key_checks = 1'))
    }

    static insertAllTables(){
        return Books.insertTable()
        .then(Users.insertTable())
        .then(Logs.insertTable())
    }

}

module.exports={TableHandler};
