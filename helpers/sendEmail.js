import nodemailer from "nodemailer";
import "dotenv/config";

export default async function sendEmail(to, subject, htmlContent) {
  // Configuración del transportador SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Cambiar según tu proveedor
    port: 587, // 465 para SSL
    secure: false, // true si es puerto 465
    auth: {
      user: process.env.EMAIL_USER, // Tu correo
      pass: process.env.EMAIL_PASS, // Contraseña de aplicación (Gmail)
    },
  });

  // Configuración del mensaje
  const mailOptions = {
    from: `Adopta mascotas<${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent, // Puedes enviar HTML o texto plano
  };

  // Enviar email
  const info = await transporter.sendMail(mailOptions);
  console.log("Correo enviado: %s", info.messageId);
  return info;
}
