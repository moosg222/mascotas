import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(to, subject, htmlContent) {
  try {
    const result = await resend.emails.send({
      from: "Adopta tu Mascota <moosg222@gmail.com>",
      to,
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
