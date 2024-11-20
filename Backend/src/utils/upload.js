const bucket = require('../config/FirebaseConfig.js');
const { format } = require('util');
const {v4: uuidv4} = require('uuid');

class upload{
    async uploadFile(fileName, fileBuffer, contentType) {
        try {
            fileName = `${uuidv4()}-${fileName}`;
            const blob = bucket.file(fileName);
    
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType
                }
            });
            
            blobStream.on('error', (err) => {
                console.error('Error in uploadFile:', err);
                throw new Error(`Failed to upload file to Firebase Storage: ${err.message}`);
            });

            blobStream.end(fileBuffer);
    
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
            
            return publicUrl;
    
        } catch (err) {
            console.error('Error in uploadFile:', err);
            throw new Error(`Failed to upload file to Firebase Storage: ${err.message}`);
        }
    }
    

    async deleteFile(fileUrl){
        try {
        const fileName = decodeURIComponent(fileUrl.split('/').pop().split('?')[0]);
        const file = bucket.file(fileName);
    
        await file.delete();
        console.log(`File ${fileName} deleted successfully.`);
        } catch (err) {
        console.error(`Failed to delete file: ${err.message}`);
        }
    }
}

module.exports = new upload;
