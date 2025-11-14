import brevo from "@getbrevo/brevo";
import "dotenv/config";

export default async function sendEmail(to, subject, htmlContent) {
  try {
    // Configurar cliente Brevo API
    const client = new brevo.TransactionalEmailsApi();
    client.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // Payload del correo
    const emailData = {
      sender: {
        name: "Adopta tu Mascota",
        email: "no-reply@adopta-mascota.com", // No necesita dominio verificado
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    const response = await client.sendTransacEmail(emailData);
    console.log("Correo enviado correctamente:", response.messageId);

    return response;
  } catch (error) {
    console.error("Error enviando correo con Brevo:", error);
    throw error;
  }
}
