"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorController = void 0;
const decorator_1 = __importDefault(require("../models/decorator"));
class DecoratorController {
    constructor() {
        this.saveDecorator = (req, res) => {
            const userId = req.body.userId;
            const companyId = req.body.companyId;
            new decorator_1.default({ userId: userId, companyId: companyId }).save().then(ok => {
                console.log("Decorator stored succesfully.");
                res.json({ message: "ok" });
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllUnemployedDecorators = (req, res) => {
            decorator_1.default.find({ companyId: "" }).then(decorators => {
                res.json({ message: JSON.stringify(decorators) });
            }).catch(err => console.log(err));
        };
    }
}
exports.DecoratorController = DecoratorController;
