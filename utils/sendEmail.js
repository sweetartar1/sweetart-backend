
const nodemailer = require('nodemailer');

async function sendEmail({ nombre, telefono, email, direccion, total, fileUrl }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: 'Nuevo pedido de SweetArt',
    html: `
      <h3>Nuevo pedido recibido</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Dirección:</strong> ${direccion}</p>
      <p><strong>Total:</strong> ${total}</p>
      <p><strong>Comprobante:</strong> <a href="${fileUrl}" target="_blank">Ver archivo</a></p>
    `
  });
}

module.exports = { sendEmail };
