
const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { uploadToDrive } = require('./utils/uploadToDrive');
const { sendEmail } = require('./utils/sendEmail');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/pedidos', upload.single('comprobante'), async (req, res) => {
  try {
    const { nombre, telefono, email, direccion, total } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Comprobante no adjunto' });
    }

    const fileUrl = await uploadToDrive(file);
    await sendEmail({ nombre, telefono, email, direccion, total, fileUrl });

    res.status(200).json({ message: 'Pedido recibido y enviado correctamente' });
  } catch (err) {
    console.error('Error al procesar pedido:', err);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
