

// const { Storage } = require("@google-cloud/storage");
// const storage = new Storage({

//     projectId: "sharetrack",
//     keyFilename: "sharetrack-storage-key.json",

// });

// const uploadToStorage = async (photo, folderName = "profilepictures") => {
//     try {
//         const gcs = storage.bucket("sharetrack-bucket");

//         const storagePath = `${folderName}/${photo.originalname}`; // Destination in the bucket

//         const blob = gcs.file(storagePath); // Creates a reference to the destination



//         const stream = blob.createWriteStream({
//             resumable: false,
//             metadata: {
//                 contentType: photo.mimetype,
//             },
//         });

//         return new Promise((resolve, reject) => {
//             stream.on("error", (err) => {
//                 console.error("Upload failed", err);
//                 reject(err);
//             });

//             stream.on("finish", () => {
//                 // Make the file public or get its public URL
//                 const publicUrl = `https://storage.googleapis.com/${gcs.name}/${storagePath}`;
//                 resolve(publicUrl);
//             });

//             // Write file buffer
//             stream.end(photo.buffer);
//         });
//     } catch (error) {
//         console.error("Error uploading to storage", error);
//         throw new Error(error.message);
//     }
// };

// // module.exports = uploadToStorage;
// module.exports = { uploadToStorage };
// // export{uploadToStorage};

import { Storage } from "@google-cloud/storage";

const storage = new Storage({
    projectId: "sharetrack",
    keyFilename: "sharetrack-storage-key.json",
});

const uploadToStorage = async (photo, folderName = "profilepictures") => {
    try {
        const gcs = storage.bucket("sharetrack-bucket");
        const storagePath = `${folderName}/${photo.originalname}`;
        const blob = gcs.file(storagePath);

        const stream = blob.createWriteStream({
            resumable: false,
            metadata: { contentType: photo.mimetype },
        });

        return new Promise((resolve, reject) => {
            stream.on("error", (err) => {
                console.log("Upload failed", err);
                reject(err);
            });

            stream.on("finish", () => {
                const publicUrl = `https://storage.googleapis.com/${gcs.name}/${storagePath}`;
                resolve(publicUrl);
            });

            stream.end(photo.buffer);
        });
    } catch (error) {
        console.error("Error uploading to storage", error);
        throw new Error(error.message);
    }
};

// ✅ Correct ES Module Export
export { uploadToStorage };