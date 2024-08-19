import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

const CURRENT_WORKING_DIRECTORY = process.cwd();
const PARENT_DIRECTORY = path.resolve(CURRENT_WORKING_DIRECTORY, "..");
const PHOTOS_DIRECTORY = path.join(PARENT_DIRECTORY, 'uploads');
const DEFAULT_FOLDER = path.join(PHOTOS_DIRECTORY, 'users', 'default');
const DEFAULT_PROFILE_PICTURE = path.join(DEFAULT_FOLDER, 'profile_picture.jpg');

export class PhotoController {

    constructor() {
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
            } else {
                console.error(`Default image not found at: ${defaultImagePath}`);
            }
        }
    }

    getUserPhoto = (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const userDirectory = path.join(PHOTOS_DIRECTORY, 'users', username);

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
    }

    getPhotos = (req: express.Request, res: express.Response) => {
        const company = req.body.company;
        const username = req.body.username;
        const appointmentId = req.body.appointmentId;

        if (!company || !username || !appointmentId) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const userDirectory = path.join(PHOTOS_DIRECTORY, 'companies', company, username, appointmentId);
    
        if (!fs.existsSync(userDirectory)) {
            console.log('Directory not found');
            return res.status(404).json({ message: 'Directory not found' });
        }
    
        fs.readdir(userDirectory, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return res.status(500).json({ message: 'Error reading directory', error: err });
            }
        
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        
            const imageBlobsPromises = imageFiles.map((file) => {
                const filePath = path.join(userDirectory, file);
                return new Promise<{ name: string; blob: Buffer }>((resolve, reject) => {
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ name: file, blob: data });
                        }
                    });
                });
            });
        
            Promise.all(imageBlobsPromises)
                .then((imageBlobs) => {
                    const images = imageBlobs.map((imageBlob) => ({
                        name: imageBlob.name,
                        blob: imageBlob.blob.toString('base64'), // Convert blob to base64 string
                    }));
                    res.json({ images });
                })
                .catch((err) => {
                    res.status(500).json({ message: 'Error while retrieving images.', error: err });
                });
        });
        
    };



    savePhotos = (req: express.Request, res: express.Response) => {
        const imageBlobs = req.files as Express.Multer.File[]; // Array of files
        const imageNames = JSON.parse(req.body.imageNames);
        const company = req.body.company;
        const username = req.body.username;
        const appointmentId = req.body.appointmentId;

        // Check if all required fields are present
        if (!imageBlobs || !imageNames || !company || !username || !appointmentId) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Adjust the path to include company, username, and appointmentId
        const userDirectory = path.join(PHOTOS_DIRECTORY, 'companies', company, username, appointmentId);

        // Create the directory if it doesn't exist
        if (!fs.existsSync(userDirectory)) {
            fs.mkdirSync(userDirectory, { recursive: true });
        }

        // Save each image
        const saveImagePromises = imageBlobs.map((file, index) => {
            const imagePath = path.join(userDirectory, imageNames[index]);

            return new Promise<void>((resolve, reject) => {
                fs.writeFile(imagePath, file.buffer, (err) => {
                    if (err) {
                        console.error("Error saving image:", err);
                        reject(err);
                    } else {
                        console.log("Image saved successfully at:", imagePath);
                        resolve();
                    }
                });
            });
        });

        // Wait for all images to be saved
        Promise.all(saveImagePromises)
            .then(() => {
                res.json({ message: "All images saved successfully." });
            })
            .catch((err) => {
                res.status(500).json({ message: "Error while saving images.", error: err });
            });
    }


    savePhoto = (req: express.Request, res: express.Response) => {
        console.log(DEFAULT_PROFILE_PICTURE);

        const imageBlob = req.file?.buffer;
        const imageName = req.body.imageName;
        const username = req.body.username;

        if (!imageBlob || !imageName || !username) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userDirectory = path.join(PHOTOS_DIRECTORY, 'users', username);

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
    }
}
