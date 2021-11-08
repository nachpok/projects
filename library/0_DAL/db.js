const mysql = require('mysql');
const userData = require('./users.json');
const bookData=require('./books.json');
const logsData=require('./logs.json');
console.log("------server restrted--------");
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Nach9943$',
    database:'library'
});


//connect to sqldb with function
function connect (){
    con.connect((err)=>{
        if(err){
            console.log('Error connecting to DB');
            console.log(err);
            return;
        }
        console.log('Connection established');
    });
}

function disconnect(){
    con.end((err)=>{
        if(err){
            console.log('Error disconnecting from DB');
            return;
        }
        console.log('Disconnected from DB');
    });
}

//run querys
 function runQuery(queryParam){
    return new Promise((resolve,reject)=>{
        con.query(queryParam,(err,res)=>
        {err?reject(err):resolve(res)})
    });
}

function runQueryWithParam(queryParam, queryValues) {
    return new Promise((resolve, reject) => {
        connection.query(queryParam, [queryValues],
            (err, res) => { err ? reject(err) : resolve(res) })
    });
}
//stringify results form sql db
function extractDbResult(res){
    return JSON.parse((JSON.stringify(res)).replace("RowDataPacket",""));
}


//check if a table exissts
async function  checkTable(tableName){
    try {
        let result = await runQuery(`select * from information_schema.tables
    WHERE table_schema = 'library' 
    AND table_name = '${tableName}'
    LIMIT 1;`);
        if(result[0]){return true;}else{ return false;}
    } catch (e) {
        throw new Error("Table dose not exisst");
    }
}

//check table, if not in db init
async function initTable(tableName,tableQuery,tableData,tableDP){
    let res = await checkTable(tableName);
    if(!res){
        runQuery(tableQuery)
        .then(runQuery(`insert into ${tableName} (${tableDP}) values ${tableData}`)); 
        console.log(`Created table: ${tableName}`);
    }
    
}
//create tables if do not exisst
//users
function initAllTables(){
    initTable(userData.tableName,userData.tableQrury,JSON.stringify(getUsersValue()).replace(/]/g,")").replace(/\[/g,"(").slice(1,-1),userData.tableDP.join(","));//
//books
    initTable(bookData.tableName,bookData.tableQrury,JSON.stringify(getBooksValue()).replace(/]/g,")").replace(/\[/g,"(").slice(1,-1),bookData.tableDP.join(","));//
//logs
    initTable(logsData.tableName,logsData.tableQrury,JSON.stringify(getLogsValue()).replace(/]/g,")").replace(/\[/g,"(").slice(1,-1),logsData.tableDP.join(","));
}

function getUsersValue(){
    let users=userData.tableData;
    return users.map((user)=>[
            user.firstName,
            user.lastName,
            user.tudatZehut,
            user.address,
            user.email,
            user.status,
            user.bookLimit,
            user.userPassword,
            user.phoneNumber
    ]);
}

function getBooksValue(){
    let books=bookData.tableData;
    return books.map((book)=>[
        book.IBAN,
        book.title,
        book.author,
        book.publisher,
        book.publishYear,
        book.status,
        book.price,
        book.dateOfPerches
    ]);
}

    function getLogsValue(){
        let logs=logsData.tableData;
        return logs.map((log)=>[
            log.userId,
            log.bookId,
            log.borrowDate,
            log.returnDate,
            log.comments
        ]);
    }
    
module.exports={
    connect,
    disconnect,
    runQuery,
    runQueryWithParam,
    extractDbResult,
    initAllTables
}




//
