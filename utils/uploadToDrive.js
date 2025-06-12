
const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');
const fs = require('fs');
// DEBUG: verificar acceso al archivo secreto
try {
  const secretPath = '/etc/secrets/sweetart-backend-3a324d82e72c.json';
  const exists = fs.existsSync(secretPath);
  console.log('🔍 ¿El archivo secreto existe?', exists);

  if (exists) {
    const content = fs.readFileSync(secretPath, 'utf-8');
    console.log('✅ Se pudo leer el archivo secreto.');
    JSON.parse(content); // Esto valida que sea JSON válido
    console.log('✅ El archivo secreto es un JSON válido.');
  }
} catch (error) {
  console.error('❌ Error al leer el archivo secreto:', error.message);
}

const auth = new google.auth.GoogleAuth({
  keyFile: '/etc/secrets/sweetart-backend-3a324d82e72c.json',
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
      parents: ['1iqs8wC2ErV5LUc20IQB1h2k425BUkkW2'],
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
