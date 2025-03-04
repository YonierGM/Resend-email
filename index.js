import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Resend } from "resend";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // <-- Agregar esto para parsear JSON correctamente

const { RESEND_API_KEY } = process.env;
const resend = new Resend(RESEND_API_KEY);
console.log(RESEND_API_KEY);

app.post("/send", async (req, res) => {
    const { email, mensaje } = req.body; // <-- Leer los datos enviados por Angular
    if (!email || !mensaje) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    try {
      const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev",  // Debe ser un dominio verificado
          to: ["yoniermosquera55@gmail.com"],  // Tu correo donde recibirás el mensaje
          reply_to: email,  // Permite responder directamente al usuario
          subject: "Nuevo mensaje de contacto: " + email,
          html: `
              <p><strong>Correo del remitente:</strong> ${email}</p>
              <p><strong>Mensaje:</strong> ${mensaje}</p>
          `,
      });

      if (error) {
          return res.status(400).json({ error });
      }

      res.status(200).json({ data });
  } catch (err) {
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});
