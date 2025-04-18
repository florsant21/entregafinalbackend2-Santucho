import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Correo electrónico enviado:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw error;
    }
  }

  async sendPurchaseConfirmation(ticket) {
    const { purchaser, code, amount, purchase_datetime, products } = ticket;

    const productList = products
      .map(
        (item) => `
  <li>${item.product.title} - Cantidad: ${item.quantity} - Precio Unitario: $${item.product.price}</li>
  `
      )
      .join("");

    const html = `
  <h1>¡Gracias por tu compra!</h1>
  <p>Hola ${purchaser},</p>
  <p>Tu compra con el código: <strong>${code}</strong> ha sido procesada exitosamente el ${new Date(
      purchase_datetime
    ).toLocaleString()}.</p>
  <h2>Detalles de la compra:</h2>
  <ul>
  ${productList}
  </ul>
  <p><strong>Total de la compra: $${amount}</strong></p>
  <p>¡Esperamos que disfrutes de tus productos!</p>
  <p>Saludos,</p>
  <p>Tu Tienda Online</p>
  `;

    return this.sendEmail(purchaser, "Confirmación de tu compra", html);
  }
}

export default new EmailService();
