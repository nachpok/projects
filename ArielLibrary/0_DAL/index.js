const mySql = require('mysql');
const connectionConfig = require('./config.json');

let connection;

//connect and disconnect to db
function connect(){
    connection=mySql.createConnection(connectionConfig);
    return new Promise((resolve,reject)=>{
        connection.connect((err)=>{err?reject(err):resolve();});
    });
}
function disconnect(){
    return new Promise((resolve,reject)=>{
        connection.end((err)=>{err?reject(err):resolve();});
    });
}

//DML -data manipulation language - receive querys and run them
function runQuery(queryParam){
    return new Promise((resolve,reject)=>{
        connection.query(queryParam,(err,res)=>
        {err?reject(err):resolve(res)})
    });
}
function runQueryWithParam(queryParam,queryValues){
    return new Promise((resolve,reject)=>{
        connection.query(queryParam,[queryValues],(err,res)=>
        {err?reject(err):resolve(res)});
    });
}

function extractDbResult(res){
    return JSON.parse((JSON.stringify(res)).replace("RowDataPacket",""));
}

//export functions
module.exports={
    connect,
    disconnect,
    runQuery,
    runQueryWithParam,
    extractDbResult
}