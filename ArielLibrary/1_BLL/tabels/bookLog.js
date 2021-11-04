const dal = require('../../0_DAL/index');

class BookLog{
    static creatTable(){
        return dal.runQuery(`
        create table BookLog(
            id serial primary key ,
            userId int not null,
            bookId int not null,
            borrowDate date not null,
            returnDate date ,
            comments text
        )
        `);
    }

    static dropTable(){
        return dal.runQuery('drop table if exists BookLog;');
    }

    static insertTable(){
        return dal.runQueryWithParam("insert into BookLog (userId,bookId,borrowDate,returnDate,comments) value?",BookLog.getValues());
    }

    static getValues(){
        let bookLog = require('./logData.json');
        return bookLog.map((log)=>[
            bookLog.userId,
            bookLog.bookId,
            bookLog.borrowDate,
            bookLog.returnDate,
            bookLog.comments
        ]);
    }

    static async findLogByBook(bookId){
        try{
            let query= `select * from BookLog where bookId = ${bookId};`;
            let result = await dal.runQueryWithParam(query);
            let logInfo=dal.extractDbResult(result)[0];
            return (logInfo);
        }catch(e){
            throw new Error(e.code||e);
        }
    }

    static async findLogByUser(userId){
        try{
            let query= `select * from BookLog where userId = ${userId};`;
            let result = await dal.runQueryWithParam(query);
            let logInfo=dal.extractDbResult(result)[0];
            return (logInfo);
        }catch(e){
            throw new Error(e.code||e);
        }
    }

    static async findLog(id){
        try{
            let query= `select * from BookLog where id = ${id};`;
            let result = await dal.runQueryWithParam(query);
            let logInfo=dal.extractDbResult(result)[0];
            return (logInfo);
        }catch(e){
            throw new Error(e.code||e);
        }
    }
}

module.exports={BookLog}