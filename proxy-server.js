// server.js o index.js
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_BASE_URL = "http://localhost:4000";
// 1* llega el fetch, para iniciar handshake entre proxy y backend
// para online el base url va https://stateback-api.onrender.com
// para offline el base url va http://localhost:4000//
const API_KEY = process.env.API_KEY;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/proxy", async (req, res) => {
  try {
    const targetUrl = API_BASE_URL + req.url.replace(/^\/proxy/, "");

    const headers = {
      ...req.headers,
      host: undefined,
      "x-api-key": API_KEY,
    };

    const axiosConfig = {
      method: req.method,
      url: targetUrl,
      headers,
      data: req.body, // Axios maneja automáticamente JSON y Content-Type
      validateStatus: () => true, // Para que Axios no lance errores con status 4xx o 5xx
    };

    const apiRes = await axios(axiosConfig);

    console.log("Enviando API_KEY:", API_KEY);

    res.status(apiRes.status).json(apiRes.data);
  } catch (error) {
    console.error("Error en proxy:", error.message);
    res.status(500).json({ error: "Error interno en proxy" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy corriendo en el puerto ${PORT} `);
});
