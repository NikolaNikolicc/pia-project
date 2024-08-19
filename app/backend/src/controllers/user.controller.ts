import express from 'express'
import UserM from '../models/user'
import { PhotoController } from './photo.controller';

export class UserController{
    getAllPendingUsers = (req: express.Request, res: express.Response)=> {
        UserM.find({pendingApproval: 0}).then(
            ok=>res.json({message: JSON.stringify(ok)})
        )
    }

    getAllOwners = (req: express.Request, res: express.Response)=> {
        UserM.find({pendingApproval: 1, userType: 0}).then(
            ok=>res.json({message: JSON.stringify(ok)})
        )
    }

    getAllDecorators = (req: express.Request, res: express.Response)=> {
        UserM.find({pendingApproval: 1, userType: 2}).then(
            ok=>res.json({message: JSON.stringify(ok)})
        )
    }

    updateUserStatus = (req: express.Request, res: express.Response)=> {
        const user = JSON.parse(req.body.user);
        UserM.updateOne({username: user.username},
            {$set: {pendingApproval: user.pendingApproval, comment: user.comment, blockingAppointment: user.blockingAppointment}}
        ).then(
            ok=>res.json({message: "ok"})
        ).catch(err=>{
            console.log(err);
            res.json({message: "error"});
        })
    }

    saveProfileUpdate = (req: express.Request, res: express.Response)=> {
        const user = JSON.parse(req.body.user);
        UserM.updateOne({username: user.username},
            {$set: {name: user.name, surname: user.surname, address: user.address, phone: user.phone, email: user.email, creditCard: user.creditCard}}
        ).then(
            ok=>res.json({message: "ok"})
        ).catch(err=>{
            console.log(err);
            res.json({message: "error"});
        })
    }

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

    getInfoForThisUsernames = async (req: express.Request, res: express.Response)=>{
        try {
            const usernames: string[] = JSON.parse(req.body.usernames);
            const users = await Promise.all(
                usernames.map(async (username) => {
                    try {
                        const user = await UserM.findOne({ username: username });
                        return user ? user : null;
                    } catch (err) {
                        console.log(`User ${username} not found in database.`);
                        return null;
                    }
                })
            );
    
            // Filter out null values in case some users were not found
            const filteredUsers = users.filter(user => user !== null);
    
            res.json({ message: JSON.stringify(filteredUsers) });
        } catch (err) {
            console.error("An error occurred:", err);
            res.status(500).json({ message: "An error occurred while fetching users." });
        }
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