//book db - get/ add/ remove/ edit/ find by title/id...
const dal = require('./../../0_DAL/index');

class Book{

    static createTable(){
        return dal.runQuery(`
        create table Books(
            id serial primary key,
            IBAN navarchar(13),
            title nvarchar(100) not null,
            auther nvarchar(100) not null,
            publisher nvarchar(20) not null,
            publishDate date not null,
            status enum ("buyList","orderd","avilable","lent","decommissinde"),
            price decimal(3,2) not null,
            dateOfPerches date not null
        );
        `);
    }

    static dropTable(){
        return dal.runQuery('drop table if exists Books;');
    }

    static async insertTable(){
        let res = await dal.runQueryWithParam(`
        INSERT INTO Books
        (IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs)
        VALUES ?`,
        Book.getValues());
    }

    static async getValues(){
        let books = require('./booksData.json');
        return books.map((book)=>
        [
            book.IBAN,
            book.title,
            book.auther,
            book.publisher,
            book.publishDate,
            book.status,
            book.price,
            book.dateOfPerches
        ]
        );
    }

    static async addBook(IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs){
      try{
        let query=`insert into Books (IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs)
        values ('${IBAN}','${title}','${auther}','${publisher}','${publishDate}','${status}','${price}','${dateOfPerchs}',);`;
        let result=await dal.runQueryWithParam(query);
        if(dal.extractDbResult(result).affectedRows==1)
                return {"status":"register success"};
        else
                throw new Error("Problem in regiter process");
      }catch(e){
        throw new Error(e.code||e);
      }
    }

    static async deleteBook(id){
        try{
            let query=`delete from Books where id=${id};`;
            let result = await dal.runQueryWithParam(query);
            if(dal.extractDbResult(result).affectedRows==1)
                return;
            else
                throw new Error(e.code||e);
        }catch(e){
            throw new Error(e.code||e);
        }
    }

    static async editBookById(id,IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs){
        try{
            let updateInfo="";
            if(IBAN){updateInfo+=`IBAN=${IBAN},`}
            if(title){updateInfo+=`title=${title},`}
            if(auther){updateInfo+=`auther=${auther},`}
            if(publisher){updateInfo+=`publisher=${publisher},`}
            if(publishDate){updateInfo+=`publishDate=${publishDate},`}
            if(status){updateInfo+=`status=${status},`}
            if(price){updateInfo+=`price=${price},`}
            if(dateOfPerchs){updateInfo+=`dateOfPerchs=${dateOfPerchs},`}
            updateInfo=updateInfo.slice(0,updateInfo.length-1);//remove comma from end of string

            let query=`UPDATE Books SET ${updateInfo} WHERE id=${id};`;
            let result = await dal.runQueryWithParam(query);

            if(dal.extractDbResult(result).affectedRows==1){return await User.getUserById(id);}
            else{throw new Error("Problem in edit process");}
        }catch(e){
            throw new Error(e.code||e);
        }
    }
    
    static async findBookById(id){
        try{
        let query =`select * from Books where id=${id};`;
        let result = await dal.runQueryWithParam(query);
        let bookInfo=dal.extractDbResult(result)[0];
            return bookInfo;
        }catch(e){
            throw new Error(e.code||e); 
        }
    }
    //will only give one result!!! do not
    static async findBook(id,IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs){
        try{
            let updateInfo="";
            if(id){updateInfo+=`id=${id} and`}
            if(IBAN){updateInfo+=`IBAN=${IBAN} and`}
            if(title){updateInfo+=`title=${title} and`}
            if(auther){updateInfo+=`auther=${auther} and`}
            if(publisher){updateInfo+=`publisher=${publisher} and`}
            if(publishDate){updateInfo+=`publishDate=${publishDate}, and`}
            if(status){updateInfo+=`status=${status} and`}
            if(price){updateInfo+=`price=${price} and`}
            if(dateOfPerchs){updateInfo+=`dateOfPerchs=${dateOfPerchs} and`}
            updateInfo=updateInfo.slice(0,updateInfo.length-4);//remove comma from end of string

            let query = `SELECT * from Books WHERE ${updateInfo};`;
            let result = await dal.runQueryWithParam(query);
            let bookInfo=dal.extractDbResult(result)[0];
            return{
                "id":id,
                "IBAN":bookInfo.IBAN,
                "title":bookInfo.title,
                "author":bookInfo.auther,
                "publisher":bookInfo.publisher,
                "publishDate":bookInfo.publishDate,
                "stasus":bookInfo.stasus,
                "price":bookInfo.price,
                "dateOfPerches":bookInfo.dateOfPerches
            }
        }catch(e){
            throw new Error(e.code||e);
        }
    }
}

module.exports={Book}