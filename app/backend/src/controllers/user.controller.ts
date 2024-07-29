import express from 'express'
import UserM from '../models/user'
import { PhotoController } from './photo.controller';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export class UserController{

    constructor(){
        new PhotoController(); // in case first user doesn't want to upload photo we need to create default directory by creating photo controller and its constructor
    }

    changePassword = (req: express.Request, res: express.Response)=>{
        let user = req.body;
        UserM.updateOne({username: user.username},
            {$set: {password: user.password}}
        ).then(
            ok=>res.json({message: "ok"})
        ).catch(err=>{
            console.log(err);
            res.json({message: "error"});
        })
    }

    login = (req: express.Request, res: express.Response)=>{
        let user = req.body;
        console.log(user);

        UserM.findOne({username: user.username, password: user.password, userType: user.userType}).then(
            user=>{
                if(user){
                    res.json({message: JSON.stringify(user)})
                }else{
                    res.json({message: "User with this username has not been found."})
                }
            }
        ).catch(err=>{
            console.log(err);
            res.json({message: "User with this username has not been found."});
        });
    }

    getUserByUsername = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        UserM.findOne({username: username}).then(
            user=>{
                if(user){
                    res.json({message: JSON.stringify(user)})
                }else{
                    res.json({message: "User with this username has not been found."})
                }
            }
        ).catch(err=>console.log(err));
    }

    getUserByEmail = (req: express.Request, res: express.Response)=>{
        let email = req.body.email;
        UserM.findOne({email: email}).then(
            user=>{
                if(user){
                    res.json({message: JSON.stringify(user)})
                }else{
                    res.json({message: "User with this email has not been found."})
                }
            }
        ).catch(err=>console.log(err));
    }

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