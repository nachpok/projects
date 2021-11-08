const dal=require('./../0_DAL/db'); 


async function getUserById(userId){
    try {
        let res = await dal.runQuery(`select * from users where userId=${userId};`);
        res=dal.extractDbResult(res)[0];
        if(res) return res;
        else return {"status":"userId dose not exsisst"};
    } catch (e) {
        throw new Error(e.code||e);
    }
}

async function addUser(firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword,phoneNumber){
    try {
        let query=`insert into users (firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword,phoneNumber)
        values ('${firstName}','${lastName}','${tudatZehut}','${address}','${email}','${status}','${bookLimit}','${userPassword}','${phoneNumber}');`;
        let res = await dal.runQuery(query);
        if(dal.extractDbResult(res).affectedRows==1){console.log("user added"); return {"status":"success"}}
        else throw new Error("NOT adding user!");
    } catch (e) {
        throw new Error(e.code||e);
    }
}

async function deleteUser(userId){
    try{
        let query=`delete from users where userId=${userId};`;
        let res=await dal.runQuery(query);
        if(dal.extractDbResult(res).affectedRows==1)
        return {"status":"user deleted"};
    else
        throw new Error(e.code||e);
    } catch (e) {
        throw new Error(e.code||e);
    }
}

async function editUserById(userId,firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword,phoneNumber){
    try {
        let updateInfo="";
        if(firstName){updateInfo+=` firstName='${firstName}',`}
        if(lastName){updateInfo+=` lastName='${lastName}',`}
        if(tudatZehut){updateInfo+=` tudatZehut='${tudatZehut}',`}
        if(address){updateInfo+=` address='${address}',`}
        if(email){updateInfo+=` email='${email}',`}
        if(status){updateInfo+=` status='${status}',`}
        if(bookLimit){updateInfo+=` bookLimit= '${bookLimit}',`}
        if(userPassword){updateInfo+=` userPassword='${userPassword}',`}
        if(phoneNumber){updateInfo+=` phoneNumber='${phoneNumber}',`}
        updateInfo=updateInfo.slice(0,updateInfo.length-1);//remove comma from end of string

        let query=`UPDATE users SET ${updateInfo} WHERE userId=${userId};`;
        let result = await dal.runQuery(query);

        if(dal.extractDbResult(result).affectedRows==1){console.log("edit successfull"); return {"status":"success"}}
        else{throw new Error("Problem in edit process");}
    } catch (e) {
        throw new Error(e.code||e);
    }
}

async function findUser(userId,firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword,phoneNumber){
    try {let updateInfo="";
        if(userId){updateInfo+=`userId=${userId} and`}
        if(firstName){updateInfo+=` firstName='${firstName}' and`}
        if(lastName){updateInfo+=` lastName='${lastName}' and`}
        if(tudatZehut){updateInfo+=` tudatZehut='${tudatZehut}' and`}
        if(address){updateInfo+=` address='${address}' and`}
        if(email){updateInfo+=` email='${email}' and`}
        if(status){updateInfo+=` status='${status}' and`}
        if(bookLimit){updateInfo+=` bookLimit= '${bookLimit}' and`}
        if(userPassword){updateInfo+=` userPassword='${userPassword}' and`}
        if(phoneNumber){updateInfo+=` phoneNumber='${phoneNumber}' and`}
        updateInfo=updateInfo.slice(0,updateInfo.length-3);//remove "and" from end of string

        let query=`select * from users where ${updateInfo};`;
        let res = await dal.runQuery(query);
        res=dal.extractDbResult(res);
        
        if(res.length==1) return res;
        else { return {"status":"input dose not match a user"}}
    }catch(e){
        throw new Error(e.code||e);
    }
}

module.exports={
    getUserById,
    addUser,
    deleteUser,
    editUserById,
    findUser
}
