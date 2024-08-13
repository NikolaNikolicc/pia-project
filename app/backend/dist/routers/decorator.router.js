"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const decorator_controller_1 = require("../controllers/decorator.controller");
const decoratorRouter = express_1.default.Router();
decoratorRouter.route('/saveDecorator').post((req, res) => new decorator_controller_1.DecoratorController().saveDecorator(req, res));
decoratorRouter.route('/getAllUnemployedDecorators').post((req, res) => new decorator_controller_1.DecoratorController().getAllUnemployedDecorators(req, res));
decoratorRouter.route('/setCompanyForDecorators').post((req, res) => new decorator_controller_1.DecoratorController().setCompanyForDecorators(req, res));
decoratorRouter.route('/getAllEmployedDecorators').post((req, res) => new decorator_controller_1.DecoratorController().getAllEmployedDecorators(req, res));
exports.default = decoratorRouter;
