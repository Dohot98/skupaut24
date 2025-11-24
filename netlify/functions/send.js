const https = require("https");

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "Markdown",
    });

    const options = {
      hostname: "api.telegram.org",
      path: `/bot${process.env.TELEGRAM_TOKEN}/sendMessage,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (!json.ok) return reject(new Error(json.description));
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { brand, model, year, phone, name } = body;

    const text = `🚗 *Nowe zgłoszenie AutoSkup24:*
*Imię:* ${name || "--"}
*Telefon:* ${phone || "--"}
*Marka:* ${brand || "--"}
*Model:* ${model || "--"}
*Rok:* ${year || "--"}`;

    await sendTelegramMessage(text);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
