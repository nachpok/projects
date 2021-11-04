const bll=require('./../../1_BLL/index');
const jwt=require('jsonwebtoken');

function userController(app){
    

    //login
    app.get("/api/user/login", async (req,res)=>{
        try{
            let loginInfo = req.headers['xx-auth'];
            let password = loginInfo.substr(0,64);
            let TZ = loginInfo.substr(64);

            let result = await bll.login(tudatZehut,password);
            let token = jwt.sign({"Id":result.Id}, "secret", { expiresIn: `${60 * 60 * 1000}ms` });
            res.header('xx-auth',token);
            res.status(200).send({
///----------?? what hapens when user is in??
            });
        }catch(e){
            res.status(400).send(e);
        }
    });//

    //middleware - varify and get new token
    let secuerMiddleware=(req,res,next)=>{
        let loginInfo=req.headers['xx-auth'];
        try{
            let userInfo=jwt.verify(loginInfo,"secret");
            if(userInfo){
                let token = jwt.sign({"Id":userInfo.Id}, "secret",{expiresIn:`${60*60*1000}ms`});
                res.header('xx-auth',token);
                req.data=userInfo;
                next();
            }else{
                res.status(401).send();
            }
        }catch(e){
            res.status(401).send({"message":`${e.message}`});
        }
    };

    //add user
    app.post("/api/user/register",secuerMiddleware,  async (req,res)=>{
        try{
            let {firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword}=req.body;
            let result = await bll.register(firstName,lastName,tudatZehut,address,email,status,bookLimit,userPassword);
            res.status(201).send(result);
        }catch(e){
            res.status(400).send({"error":e.message});
        }
    });//

    //user by ID
    app.get("/api/user/info",secuerMiddleware,async (req,res)=>{
        let result=await bll.getUserById(req.data.id);
        res.status(200).send(result);
    });

    //user by TZ
    app.get("/api/user/info",secuerMiddleware,async (req,res)=>{
        let result=await bll.getUserByTZ(req.data.tudatZehut);
        res.status(200).send(result);
    });

    //user by name
    app.get("/api/user/info",secuerMiddleware,async (req,res)=>{
        let result=await bll.getUserByNmae(req.data.firstName,req.data.lastName);
        res.status(200).send(result);
    });

    //remove user
    app.get("/api/user/remove",secuerMiddleware,async(req,res)=>{
        res.removeHeader('xx-auth');
        try{
            await bll.removeUserById(req.data.id);
            res.status(204).send();
        }catch(e){
            res.status(400).send({"error":e.message});
        }
    });

    //edit user
    app.put("/api/user/edit",secuerMiddleware,async(req,res)=>{
        try{
            let result = await bll.editUser(req.data.id,req.data.firstName,req.data.lastName,req.data.tudatZehut,req.data.address,req.data.email,req.data.status,req.data.bookLimit,req.data.userPassword);
            res.status(200).send(result);
        }catch(e){
            res.status(400).send({"error":e.message});
        }
    })

}

module.exports={
    userController
}