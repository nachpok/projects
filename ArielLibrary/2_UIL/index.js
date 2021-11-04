const express = require('express');
const bodyParser = require('body-parser');

const user=require('./controllers/user');
//const book
//cost logs

const bll = require('./../1_BLL/index');
const app = express();

//middleware(app level not controller level)
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//middleware - within given root directory
app.use(express.static(__dirname+"/view"));

//controllers
user.userController(app);
//book
//logs

//return to defult home page
app.get("/home",(req,res)=>{
    res.status(200).sendFile(__dirname+"/view/index.html")
})

let successCallback = () =>{
    app.listen(3000,()=>{
        console.log("Server is running OK!");
    });
};

let failCallback = (err) =>{
    console.log("can not run app",err);
    process.exit();
}

switch (process.argv[2]) {
    case 'init':
        bll.connectDb().then(bll.initDB).then(successCallback).catch(failCallback); break;
    case 'drop':
        bll.dropTables()
            .then(
                () => {
                    console.log("drop with success");
                    process.exit();
                }
            )
            .catch(failCallback); break;
    default:
        bll.connectDb().then(successCallback).catch(failCallback);
}