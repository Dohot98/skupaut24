exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // Забираем данные так, как называется в HTML
    const {
      marka,
      model,
      cena,
      telefon,
      miejscowosc
    } = body;

    // Формируем текст для Telegram
    const text = `
🚗 *Nowe zgłoszenie AutoSkup24:*

*Marka:* ${marka || "--"}
*Model:* ${model || "--"}
*Cena:* ${cena || "--"}
*Telefon:* ${telefon || "--"}
*Miejscowość:* ${miejscowosc || "--"}
`;

    await sendTelegramMessage(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
