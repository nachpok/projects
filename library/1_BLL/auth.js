//login: verifyUser(tz,pass)->token
//check token: openToken(token)->{pass,tz,id}
//re-token: createToken(pass,tz,id)->token

const bll_users=require('./users');
const {SHA256} =require ('crypto-js');
const jwt = require('jsonwebtoken');

function incript(password){//whene registers
    return SHA256(password).toString()
}

async function verifyUser(tz,pass){//first authentication - return token or null
    if(pass.length<62){pass=incript(pass);}//avoid reincripting
    let user=await bll_users.findUser(null,null,null,tz,null,null,null,null,pass,null);
    if(user.status=="input dose not match a user") {console.log(user.status); return {"tudatZehut":null,"password":null,userId:null}}
    let token=createToken(pass,tz,user.userId);
    return token;  
}

function openToken(token){//every authentection first and repeeting
        token=  jwt.verify(token,'mysecret');
        return token;
}

function createToken(pass,tz,id){
    return jwt.sign({password:pass,tudatZehut:tz,userId:id},'mysecret',{expiresIn:`600000ms`});
}
async function test(){
    let tz=123456789;
    let pass=incript("123456");
    let token = await verifyUser(tz,pass);
    console.log("user data to token: \n" ,token);
    let oToken = await openToken(token);
    console.log("decript token: \n",oToken);
    
}

module.exports={
    verifyUser,
    openToken,
    createToken
}


