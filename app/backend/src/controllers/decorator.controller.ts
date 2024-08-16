import express from 'express'
import DecoratorM from '../models/decorator';

export class DecoratorController {

    saveDecorator = (req: express.Request, res: express.Response) => {
        const userId = req.body.userId;
        const companyId = req.body.companyId;
        new DecoratorM({ userId: userId, companyId: companyId }).save().then(ok => {
            console.log("Decorator stored succesfully.");
            res.json({ message: "ok" });
        }).catch(err => {
            console.log(err);
        })
    }

    getAllUnemployedDecorators = (req: express.Request, res: express.Response) => {
        DecoratorM.find({ companyId: "" }).then(
            decorators => {
                res.json({ message: JSON.stringify(decorators) });
            }
        ).catch(err => console.log(err));
    }

    getAllEmployedDecorators = (req: express.Request, res: express.Response) => {
        DecoratorM.find({ companyId: { $ne: "" } }).then(
            decorators => {
                res.json({ message: JSON.stringify(decorators) });
            }
        ).catch(err => console.log(err));
    }

    setCompanyForDecorators = async (req: express.Request, res: express.Response) => {
        const decoratorNames: string[] = req.body.decoratorNames;
        const companyName: string = req.body.companyName;

        const updatePromises = decoratorNames.map(decoratorName => {
            return DecoratorM.updateOne(
                { userId: decoratorName },
                { $set: { companyId: companyName } }
            );
        });

        Promise.all(updatePromises)
            .then(() => {
                res.json({ message: "ok" });
            })
            .catch(err => {
                console.error(err); // Log the error
                res.status(500).json({ message: "An error occurred while updating decorators." });
            });
    }


}