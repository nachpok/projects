const dal =require('./../0_DAL/index');
const Users=require('./tabels/users');
const Books=require('./tabels/books');
const Logs=require('./tabels/bookLog');
const TableHandler=require('./tabels/tablesHandler');
//dal functions
function connectDb(){
    return dal.connect();
}

function disconnectDb(){
    return dal.disconnect();
}

function initDB(){
    return TablesHandler.initDatabase();
}

function dropTables(){
    return TableHandler.dropAllTables();
}
//users.js functions
function register(firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword){
    return Users.addUser(firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword);
}

function login(tudatZehut,password){
    return Users.login(tudatZehut,password);
}

function getUserById(id){
    return Users.getUserById(id);
}

function getUserByTZ(TZ){
    return Users.getUserByTZ(TZ);
}

function getUserByName(firstName,lastName){
    return Users.getUserByName(firstName,lastName);
}

function removeUserById(id){
    return Users.deleteUser(id);
}

function editUser(id,firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword){
    return Users.editUser(id,firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword);
}

//Books functions
function addBook(IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs){
    return Books.addBook(IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs);
}

function deleteBook(id){
    return deleteBook(id);
}

function editBook(id,IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs){
    return Books.editBookById(id,IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs); 
}

function findBookById(id){
    return Books.findBookById(id);
}

function findBook(id,IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs){
    return Books.findBook(id,IBAN,title,auther,publisher,publishDate,status,price,dateOfPerchs);
}

//logs function
function findBookById(id){
    return Logs.findLog(id);
}

function findLogByUser(userId){
    return Logs.findLogByUser(userId);
}

function findLogByBook(bookId){
    return Logs.findLogByBook(bookId);
}

module.exports={     
    connectDb,
    disconnectDb,
    initDB,
    dropTables,

    register,
    login,
    getUserById,
    getUserByTZ,
    getUserByName,
    removeUserById,
    editUser,

    addBook,
    deleteBook,
    editBook,
    findBookById,
    findBook,
    
    findBookById,
    findLogByUser,
    findLogByBook
}



