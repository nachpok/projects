const dal=require('./../0_DAL/db');


async function addBook(IBAN,title,author,publisher,publishYear,status,price,dateOfPerches){
    
    try{
        let query=`insert into books (IBAN,title,author,publisher,publishYear,status,price,dateOfPerches)
        values (${IBAN},'${title}','${author}','${publisher}','${publishYear}','${status}',${price},'${dateOfPerches}') ;`;
        let res = await dal.runQuery(query).catch();
        if(res.affectedRows=1) return {"status":"book added"};
        else return {"status":"book not added"};
        
    }catch(e){
        throw new Error(e.code||e);
    }
}

async function deleteBook(bookId){
    try{
        let query=`delete from Books where bookId=${bookId};`;
        let result = await dal.runQuery(query);
        if(dal.extractDbResult(result).affectedRows==1)
            return ;
        else
            throw new Error(e.code||e);
    }catch(e){
        throw new Error(e.code||e);
    }
}

async function getBookById(bookId){
    try {
        let res =await dal.runQuery(`select * from books where bookId =${bookId};`);
        res=dal.extractDbResult(res)[0];
        if(res) return res;
        else return {"status":"bookId dose not exsisst"};
    } catch (e) {
        throw new Error(e.code||e);
    }
}

async function editBookById(bookId,IBAN,title,author,publisher,publishYear,status,price,dateOfPerchs){
    try{
        let updateInfo="";
        if(IBAN){updateInfo+=`IBAN=${IBAN},`}
        if(title){updateInfo+=`title='${title}',`}
        if(author){updateInfo+=`author='${author}',`}
        if(publisher){updateInfo+=`publisher='${publisher}',`}
        if(publishYear){updateInfo+=`publishYear='${publishYear}',`}
        if(status){updateInfo+=`status='${status}',`}
        if(price){updateInfo+=`price=${price},`}
        if(dateOfPerchs){updateInfo+=`dateOfPerchs='${dateOfPerchs}',`}
        updateInfo=updateInfo.slice(0,updateInfo.length-1);//remove comma from end of string

        let query=`UPDATE books SET ${updateInfo} WHERE bookId=${bookId};`;
        let result = await dal.runQuery(query);

        if(dal.extractDbResult(result).affectedRows==1){console.log("edit successfull"); return {"status":"success"}}
        else{throw new Error("Problem in edit process");}
    }catch(e){
        throw new Error(e.code||e);
    }
}
async function findBook(IBAN,title,author,publisher,publishYear,status,price,dateOfPerchs){
    
    try {
        
        let updateInfo="";
        if(IBAN){updateInfo+=`IBAN=${IBAN} and`}
        if(title){updateInfo+=` title='${title}' and`}
        if(author){updateInfo+=` author='${author}' and`}
        if(publisher){updateInfo+=` publisher='${publisher}' and`}
        if(publishYear){updateInfo+=` publishYear='${publishYear}' and`}
        if(status){updateInfo+=` status='${status}' and`}
        if(price){updateInfo+=` price=${price} and`}
        if(dateOfPerchs){updateInfo+=` dateOfPerchs='${dateOfPerchs}' and`}
        updateInfo=updateInfo.slice(0,updateInfo.length-3);//remove comma from end of string
        
        let query=`select * from books where ${updateInfo};`;
        let res = await dal.runQuery(query);
        if(res) return res;
        else return {"status":"book dose not exsisst"};
    } catch (e) {
        throw new Error(e.code||e);
    }
}

module.exports={
    addBook,
    deleteBook,
    getBookById,
    editBookById,
    findBook
}