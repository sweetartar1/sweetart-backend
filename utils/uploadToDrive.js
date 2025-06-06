
const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../sweetart-backend-3a324d82e72c.json'),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function uploadToDrive(file) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer);

  const response = await drive.files.create({
    requestBody: {
      name: file.originalname,
      mimeType: file.mimetype,
      parents: [process.env.DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: file.mimetype,
      body: bufferStream,
    },
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const fileUrl = `https://drive.google.com/file/d/${response.data.id}/view`;
  return fileUrl;
}

module.exports = { uploadToDrive };
