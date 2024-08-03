"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoController = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const CURRENT_WORKING_DIRECTORY = process.cwd();
const PARENT_DIRECTORY = path.resolve(CURRENT_WORKING_DIRECTORY, "..");
const PHOTOS_DIRECTORY = path.join(PARENT_DIRECTORY, 'uploads');
const DEFAULT_FOLDER = path.join(PHOTOS_DIRECTORY, 'default');
const DEFAULT_PROFILE_PICTURE = path.join(DEFAULT_FOLDER, 'profile_picture.jpg');
class PhotoController {
    constructor() {
        this.getUserPhoto = (req, res) => {
            const username = req.body.username;
            const userDirectory = path.join(PHOTOS_DIRECTORY, username);
            if (!fs.existsSync(userDirectory)) {
                console.error(`User directory not found: ${userDirectory}`);
                return res.status(404).json({ message: 'User not found' });
            }
            const files = fs.readdirSync(userDirectory);
            const profilePictureFile = files.find(file => file.includes('profile_picture'));
            if (!profilePictureFile) {
                console.error('Profile picture not found for user:', username);
                return res.status(404).json({ message: 'Profile picture not found' });
            }
            const profilePicturePath = path.join(userDirectory, profilePictureFile);
            const imageBlob = fs.readFileSync(profilePicturePath);
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename=${profilePictureFile}`,
            });
            res.end(imageBlob, 'binary');
        };
        this.savePhoto = (req, res) => {
            var _a;
            console.log(DEFAULT_PROFILE_PICTURE);
            const imageBlob = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
            const imageName = req.body.imageName;
            const username = req.body.username;
            if (!imageBlob || !imageName || !username) {
                console.log('Missing required fields');
                return res.status(400).json({ message: 'Missing required fields' });
            }
            const userDirectory = path.join(PHOTOS_DIRECTORY, username);
            if (!fs.existsSync(userDirectory)) {
                fs.mkdirSync(userDirectory, { recursive: true });
            }
            const imagePath = path.join(userDirectory, 'profile_picture.' + imageName);
            fs.writeFile(imagePath, imageBlob, (err) => {
                if (err) {
                    console.error("Error saving image:", err);
                    return res.status(500).json({ message: "Error while saving image." });
                }
                console.log("Image saved successfully at:", imagePath);
                res.json({ message: "ok" });
            });
        };
        // Ensure the parent directory for photos exists
        if (!fs.existsSync(PHOTOS_DIRECTORY)) {
            fs.mkdirSync(PHOTOS_DIRECTORY, { recursive: true });
        }
        // Ensure the default folder exists
        if (!fs.existsSync(DEFAULT_FOLDER)) {
            fs.mkdirSync(DEFAULT_FOLDER, { recursive: true });
        }
        // Ensure the default profile picture exists
        if (!fs.existsSync(DEFAULT_PROFILE_PICTURE)) {
            const defaultImagePath = path.join(CURRENT_WORKING_DIRECTORY, 'src', 'assets', 'profile_picture.jpg');
            if (fs.existsSync(defaultImagePath)) {
                const defaultImageBlob = fs.readFileSync(defaultImagePath);
                fs.writeFileSync(DEFAULT_PROFILE_PICTURE, defaultImageBlob);
                console.log(`Default profile picture saved at: ${DEFAULT_PROFILE_PICTURE}`);
            }
            else {
                console.error(`Default image not found at: ${defaultImagePath}`);
            }
        }
    }
}
exports.PhotoController = PhotoController;
