import express from 'express'
import DecoratorM from '../models/decorator';

export class DecoratorController{

    saveDecorator = (req: express.Request, res: express.Response)=>{
        const userId = req.body.userId;
        const companyId = req.body.companyId;
        new DecoratorM({userId: userId, companyId: companyId}).save().then(ok=>{
                console.log("Decorator stored succesfully.");
                res.json({message:"ok"});
            }).catch(err=>{
                console.log(err);
            })
    }

    getAllUnemployedDecorators = (req: express.Request, res: express.Response)=>{
        DecoratorM.find({companyId: ""}).then(
            decorators=>{
                res.json({ message: JSON.stringify(decorators) });
            }
        ).catch(err=>console.log(err));
    }

}