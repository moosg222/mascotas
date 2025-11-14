import { Resend } from "resend";
import "dotenv/config";



const resend = new Resend(process.env.RESEND_API_KEY);

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "CARGADA" : "VACÍA");

export default async function sendEmail(to, subject, htmlContent) {
  try {
    const result = await resend.emails.send({
      from: "<no-reply@resend.dev>",
      to:[to,"moosg222@gmail.com"] ,
      subject,
      html: htmlContent,
    });

    console.log("Correo enviado:", result);
    return result;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
}
