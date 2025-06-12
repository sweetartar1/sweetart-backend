const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // ✅ ahora bien cerrada y arriba
require('dotenv').config();

const { uploadToDrive } = require('./utils/uploadToDrive');
const { sendEmail } = require('./utils/sendEmail');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ ahora sí funciona correctamente
// --- 2. BLOQUE AGREGADO PARA LA CONFIGURACIÓN DE CORS ---
// Esto le da permiso a tu frontend para que pueda comunicarse con este backend.
const corsOptions = {
  // El origen es la URL donde vive tu frontend.
  // Tu resumen indicaba que el sitio está en 'https://sweetartar1.github.io/sweetart-front/',
  // el origen correcto para CORS es sin la ruta, de esta manera:
  origin: 'https://sweetartar1.github.io' 
};
app.use(cors(corsOptions));
// --- FIN DEL BLOQUE AGREGADO ---


// Middleware (Esto ya lo tenías)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de multer (Esto ya lo tenías)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Tu backend en Render recibe aquí los datos del formulario 
app.post('/pedidos', upload.single('comprobante'), async (req, res) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;
    const total = req.body.total_pedido;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Comprobante no adjunto' });
    }

    // Lógica para subir a Drive y enviar email (Esto ya lo tenías)
    const fileUrl = await uploadToDrive(file); //
    await sendEmail({ nombre, telefono, email, direccion, total, fileUrl }); //

    res.status(200).json({ message: 'Pedido recibido y enviado correctamente' });
  } catch (err) {
    console.error('Error al procesar pedido:', err);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});