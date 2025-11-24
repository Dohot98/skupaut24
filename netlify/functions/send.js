exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // FormData НЕ приходит JSON-ом — это обычная строка вида:
    // "marka=vgu&model=bhgb&cena=123&telefon=111222333&miejscowosc=Krakow"
    const params = new URLSearchParams(event.body);

    const marka = params.get("marka");
    const model = params.get("model");
    const cena = params.get("cena");
    const telefon = params.get("telefon");
    const miejscowosc = params.get("miejscowosc");

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
