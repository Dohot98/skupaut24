const https = require("https");

// функция отправки в Telegram
function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      chat_id: process.env.TG_CHAT_ID,
      text,
    });

    const options = {
      hostname: "api.telegram.org",
      path: /bot${process.env.TG_TOKEN}/sendMessage,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

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

// основной handler, КОТОРЫЙ ОБРАБАТЫВАЕТ ФОРМУ
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { brand, model, year, phone, name } = body;

    const text =
      Новая заявка с сайта AutoSkup24:\n\n +
      Имя: ${name || "-"}\n +
      Телефон: ${phone || "-"}\n +
      Марка: ${brand || "-"}\n +
      Модель: ${model || "-"}\n +
      Год: ${year || "-"};

    await sendTelegramMessage(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
};
