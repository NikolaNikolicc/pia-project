"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.getAllEmployedDecorators = (req, res) => {
            decorator_1.default.find({ companyId: { $ne: "" } }).then(decorators => {
                res.json({ message: JSON.stringify(decorators) });
            }).catch(err => console.log(err));
        };
        this.setCompanyForDecorators = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const decoratorNames = req.body.decoratorNames;
            const companyName = req.body.companyName;
            const updatePromises = decoratorNames.map(decoratorName => {
                return decorator_1.default.updateOne({ userId: decoratorName }, { $set: { companyId: companyName } });
            });
            Promise.all(updatePromises)
                .then(() => {
                res.json({ message: "ok" });
            })
                .catch(err => {
                console.error(err); // Log the error
                res.status(500).json({ message: "An error occurred while updating decorators." });
            });
        });
    }
}
exports.DecoratorController = DecoratorController;
