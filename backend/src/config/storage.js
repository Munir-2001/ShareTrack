// import { Storage } from "@google-cloud/storage";

// const storage = new Storage({
//     projectId: "sharetrack",
//     keyFilename: "sharetrack-storage-key.json",
// });

// const uploadToStorage = async (photo, folderName = "profilepictures") => {
//     try {
//         const gcs = storage.bucket("sharetrack-bucket");
//         const storagePath = `${folderName}/${photo.originalname}`;
//         const blob = gcs.file(storagePath);

//         const stream = blob.createWriteStream({
//             resumable: false,
//             metadata: { contentType: photo.mimetype },
//         });

//         return new Promise((resolve, reject) => {
//             stream.on("error", (err) => {
//                 console.log("Upload failed", err);
//                 reject(err);
//             });

//             stream.on("finish", () => {
//                 const publicUrl = `https://storage.googleapis.com/${gcs.name}/${storagePath}`;
//                 resolve(publicUrl);
//             });

//             stream.end(photo.buffer);
//         });
//     } catch (error) {
//         console.error("Error uploading to storage", error);
//         throw new Error(error.message);
//     }
// };

// // ✅ Correct ES Module Export
// export { uploadToStorage };
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
    type: "service_account",
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GCP_CLIENT_EMAIL,
    client_id: process.env.GCP_CLIENT_ID,
    auth_uri: process.env.GCP_AUTH_URI,
    token_uri: process.env.GCP_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
    universe_domain: process.env.GCP_UNIVERSE_DOMAIN,
};

const storage = new Storage({
    projectId: serviceAccount.project_id,
    credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
    }
});

const uploadToStorage = async (photo, folderName = "profilepictures") => {
    try {
        const gcs = storage.bucket(process.env.GCS_BUCKET_NAME);
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

export { uploadToStorage };
