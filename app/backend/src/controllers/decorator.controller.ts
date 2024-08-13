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

    setCompanyForDecorators = async (req: express.Request, res: express.Response) => {
        try {
            const decoratorNames: string[] = req.body.decoratorNames;
            const companyName: string = req.body.companyName; // corrected typo
    
            // Use Promise.all to handle all asynchronous update operations
            await Promise.all(decoratorNames.map(async (decoratorName) => {
                await DecoratorM.updateOne(
                    { userId: decoratorName },
                    { $set: { companyId: companyName } }
                );
            }));
    
            res.json({ message: "ok" });
        } catch (err) {
            console.error(err); // Log the error
            res.status(500).json({ message: "An error occurred while updating decorators." });
        }
    }
    

}