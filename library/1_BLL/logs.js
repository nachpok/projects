//need to add to findLog a option to search sub string of comment

const dal=require('./../0_DAL/db'); 
const Users=require('./users');
const Books=require('./books');

async function getLogById(logId){
    try{
        let res = await dal.runQuery(`select * from logs where logId=${logId};`);
        res=dal.extractDbResult(res)[0];
        if(res) return res;
        else return {"logId":null,"status":"log dose not exsisst"};
    }catch(e){
        throw new Error(e.code||e);
    }
}

//need to add to findLog a option to search sub string of comment
async function findLog(userId,bookId,borrowDate,returnDate,comment){
    try{
        let logInfo="";
        if(userId){logInfo+=`userId=${userId} and`}
        if(bookId){logInfo+=` bookId=${bookId} and`}
        if(borrowDate){logInfo+=` borrowDate='${borrowDate}' and`}
        if(returnDate){logInfo+=` returnDate='${returnDate}' and`}
        if(comment){logInfo+=` comment='${comment}' and`}
        logInfo=logInfo.slice(0,logInfo.length-3);// remove the and

        let query =`select * from logs where ${logInfo};`;
        let res = await dal.runQuery(query);
        if(res) return res;
        else return {"status":"log dose not exsisst"};

    }catch(e){
        throw new Error(e.code||e);
    }
}

async function addLog(userId,bookId,borrowDate,comment){
    try {
        let user=null;
        let book=null;
        let query1="";
        let query2="";
        let res1=null;
        let res2=null;
     if(userId){
        user =await Users.getUserById(userId);
        if(user.userId){user=userId;}
        else{ user=null; console.log("user dose not exisst"); return {"status":"error with userId"}};
    }
    if(bookId){
        book=await Books.getBookById(bookId);
        if(book.bookId){
            if(book.status != 'avilable') return {"status":"book not avilable"};
            book=bookId;
        }
        else {book=null; console.log("book dose not exisst");return {"status":"error with userbookId"}};
    }
    if(user && book){
        query1=`insert into logs (userId,bookId,borrowDate,comment) values (${userId},${bookId},'${borrowDate}','${comment}');`;
        res1= await dal.runQuery(query1);
        query2=`update books set status ='lent' where bookId=${bookId};`;
        res2=await dal.runQuery(query2);
        if(dal.extractDbResult(res1).affectedRows=1 ){return {"status":"log added"};}
        else{return {"status":"error with adding log"}}
    }
    } catch (e) {
        throw new Error(e.code||e);
    }
    
}

async function updateLog(logId,returnDate,comment){
    try {
        let tempLog=await getLogById(logId);
        let query1=`update logs set returnDate = ${returnDate} where logId = ${logId};`;
        let query2="";
        
        if(tempLog.logId && !tempLog.returnDate){//make shure that log exissts and book was not allready returnd
            query2=`update books set status = 'avilable' where bookId=${tempLog.bookId};`;
            let res1 = await dal.runQuery(query1);
            let res2 = await dal.runQuery(query2);
            console.log("res1: ",dal.extractDbResult(res1));
            console.log("res2: ",dal.extractDbResult(res2));
            if (dal.extractDbResult(res1)==1 && dal.extractDbResult(res2)==1){
                return {"status":"return successful"}
            }else{
                return {"status":"error with return"}
            }
        }else{
            return {"status":"error with return"}
        }
    } catch (e) {
        throw new Error(e.code||e);
    }
}


module.exports={
    getLogById,
    addLog,
    findLog,
    updateLog
}