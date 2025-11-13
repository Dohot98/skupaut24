// netlify/functions/send.js

exports.handler = async (event, context) => {
  try {
    // Разрешаем только POST
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

    const url = https://api.telegram.org/bot${token}/sendMessage;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    const tgBody = await tgRes.text();

    if (!tgRes.ok) {
      // Ошибка от Telegram (неправильный токен/chat_id и т.п.)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Telegram error",
          detail: tgBody,
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
