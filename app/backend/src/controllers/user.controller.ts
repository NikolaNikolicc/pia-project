import express from 'express'
import UserM from '../models/user'

export class UserController{


    saveUser = (req: express.Request, res: express.Response)=>{
        console.log("uso u kontroler");
        let user = req.body;
        console.log(user);
        new UserM(user).save().then(ok=>{
                res.json({message:"ok"});
            }).catch(err=>{
                console.log(err);
            })
    }

}