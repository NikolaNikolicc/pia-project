import express from 'express'
import { DecoratorController } from '../controllers/decorator.controller';

const decoratorRouter = express.Router();

decoratorRouter.route('/saveDecorator').post(
    (req, res)=> new DecoratorController().saveDecorator(req, res)
);

decoratorRouter.route('/getAllUnemployedDecorators').post(
    (req, res)=> new DecoratorController().getAllUnemployedDecorators(req, res)
);

decoratorRouter.route('/setCompanyForDecorators').post(
    (req, res)=> new DecoratorController().setCompanyForDecorators(req, res)
);

export default decoratorRouter;