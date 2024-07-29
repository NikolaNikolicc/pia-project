import express from 'express'
import UserM from '../models/user'

export class UserController{


    saveUser = (req: express.Request, res: express.Response)=>{
        let user = req.body;
        new UserM(user).save().then(ok=>{
                console.log("User stored succesfully.");
                res.json({message:"ok"});
            }).catch(err=>{
                console.log(err);
            })
    }

}