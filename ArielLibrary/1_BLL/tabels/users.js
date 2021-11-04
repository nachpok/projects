//user db, create/ find(by id/tz/name) / add/ remove/ edit users

const dal = require('./../../0_DAL/index');

class User{

    static createTable(){
        return dal.runQuery(`
        create table Users(
            id serial primary key,
            firstName nvarchar(20) NOT NULL,
            lastName nvarchar(20) NOT NULL,
            tudatZehut nvarchar(9) NOT NULL,
            address nvarchar(30) NOT NULL,
            email nvarchar(30) NOT NULL,
            status enum ('user','admin') NOT NULL,
            bookLimit int unsigned NOT NULL,
            userPassword nvarchar(64),
            phoneNumber nvarchar(10)
        );
        `);
    }

    static dropTable(){
        return dal.runQuery('drop table if exists Users;');
    }

    static async insertTable(){
        let res =await dal.runQueryWithParam(`
        insert into Users
        (firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword,phoneNumber)
        values ?`,
        User.getValues());
    }

    static getValues(){
        let users = require('./usersData.json');
        return users.map((user)=>
        [
            user.firstName,
            user.lastName,
            user.tudatZehut,
            user.address,
            user.email,
            user.status,
            user.bookLimit,
            user.userPassword,
            user.phoneNumber
        ]
        );
    }
    
    //used for login
    static getUser(tudatZehut,password){
        return dal.runQuery(`SELECT * FROM Users WHERE tudatZehut='${tudatZehut}' and UserPassword='${password}'`);
    }

    static async getUserById(id){
        try{
            let result=await dal.runQuery(`select * from Users where id=${id};`);
            let userInfo=dal.extractDbResult(result)[0];

            return{
                "id":id,
                "firstName":userInfo.firstName,
                "lastName":userInfo.lastName,
                "tudatZehut":userInfo.tudatZehut,
                "adderss":userInfo.address,
                "email":userInfo.email,
                "status":userInfo.status,
                "bookLimit":userInfo.bookLimit,
                "userPassword":userInfo.userPassword,
                "phoneNumber":userInfo.phoneNumber
            };
        }catch(e){
            return null;
        }
    }

    static async getUserByName(firstName,lastName){
        try{
            let result=await dal.runQuery(`select * from Users where firstName=${firstName} AND lastName=${lastName};`);
            let userInfo=dal.extractDbResult(result)[0];

            return{
                "id":userInfo.id,
                "firstName":userInfo.firstName,
                "lastName":userInfo.lastName,
                "tudatZehut":userInfo.tudatZehut,
                "adderss":userInfo.address,
                "email":userInfo.email,
                "status":userInfo.status,
                "bookLimit":userInfo.bookLimit,
                "userPassword":userInfo.userPassword,
                "phoneNumber":userInfo.phoneNumber
            };
        }catch(e){
            return null;
        }
    }

    static async getUserByTZ(tudatZehut){
        try{
            let result=await dal.runQuery(`select * from Users where tudatZehut=${tudatZehut} ;`);
            let userInfo=dal.extractDbResult(result)[0];

            return{
                "id":userInfo.id,
                "firstName":userInfo.firstName,
                "lastName":userInfo.lastName,
                "tudatZehut":userInfo.tudatZehut,
                "adderss":userInfo.address,
                "email":userInfo.email,
                "status":userInfo.status,
                "bookLimit":userInfo.bookLimit,
                "userPassword":userInfo.userPassword,
                "phoneNumber":userInfo.phoneNumber
            };
        }catch(e){
            return null;
        }
    }

    static async  addUser(firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword){
        try{
            let query=`insert into Users (firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword,phoneNumber)
            values ('${firstName}','${lastName}','${tudatZehut}','${address}','${email}','${status}','${bookLimit}','${userPassword}',${userPassword});`;
            let result = await dal.runQueryWithParam(query);
            if(dal.extractDbResult(result).effectedRows==1)
              return {"status":"register success"};
            else
              throw new Error("problem in register process");
        }catch(e){
            throw new Error (e.code||e);
        }
    }

    static async deleteUser(id){
        try{
            let query=`delete from Users where id = ${id}`;
            let result = await dal.runQueryWithParam(query);
            if(dal.extractDbResult(result).effectedRows==1)
             return;
            else
             throw new Error ("Problem deleteing user");
        }catch(e){
            throw new Error(e.code||e);
        }
    }

    static async login(tudatZehut,userPassword){
        try{
            let res=await User.getUser(tudatZehut,userPassword);
            return(dal.extractDbResult(res)[0]);
        }catch(e){
            throw new Error("password or name dose not match");
        }
    }

    static async editUserById(id,firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword){
        try{
            let updateInfo="";
            if(firstName){updateInfo+=`firstName=${firstName},`;}
            if(lastName){updateInfo+=`lastName=${lastName},`;}
            if(tudatZehut){updateInfo+=`tudatZehut=${tudatZehut},`;}
            if(address){updateInfo+=`address=${address},`;}
            if(email){updateInfo+=`email=${email},`;}
            if(status){updateInfo+=`status=${status},`;}
            if(bookLimit){updateInfo+=`bookLimit=${bookLimit},`;}
            if(userPassword){updateInfo+=`userPassword=${userPassword},`;}
            updateInfo=updateInfo.slice(0,updateInfo.length-1);//remove comma from end of string

            let query=`UPDATE Users SET ${updateInfo} WHERE id=${id};`;
            let result = await dal.runQueryWithParam(query);

            if(dal.extractDbResult(result).affectedRows==1){return await User.getUserById(id);}
            else{throw new Error("Problem in edit process");}
        }catch(e){
            throw new Error(e.code||e);
        }
    }


}

module.exports={User}