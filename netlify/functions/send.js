// netlify/functions/send.js

const https = require("https");

function sendTelegramMessage(token, chatId, text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: chatId,
      text,
    });

    const options = {
      hostname: "api.telegram.org",
      path: /bot${token}/sendMessage,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const data = JSON.parse(event.body || "{}");

    const {
      marka,
      model,
      rok_produkcji,
      paliwo,
      cena,
      telefon,
      miejscowosc,
      opis,
    } = data;

    const token = process.env.TG_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!token || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Bot is not configured" }),
      };
    }

    const text =
      "🚗 Nowe zgłoszenie Skup Aut 24/7\n\n" +
      (marka ? Marka: ${marka}\n : "") +
      (model ? Model: ${model}\n : "") +
      (rok_produkcji ? Rok: ${rok_produkcji}\n : "") +
      (paliwo ? Paliwo: ${paliwo}\n : "") +
      (cena ? Cena oczekiwana: ${cena} PLN\n : "") +
      (telefon ? Telefon: ${telefon}\n : "") +
      (miejscowosc ? Miejscowość: ${miejscowosc}\n : "") +
      (opis ? Dodatkowe info: ${opis}\n : "");

    const tgRes = await sendTelegramMessage(token, chatId, text);

    if (tgRes.statusCode < 200 || tgRes.statusCode >= 300) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Telegram error",
          detail: tgRes.body,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        detail: String(err),
      }),
    };
  }
};
