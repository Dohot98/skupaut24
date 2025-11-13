export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const data = JSON.parse(event.body || "{}");

    const {
      name,
      phone,
      car,
      year,
      mileage,
      message,
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
      🚗 Новая заявка Skup Aut 24/7\n\n +
      (name ? Имя: ${name}\n : "") +
      (phone ? Телефон: ${phone}\n : "") +
      (car ? Авто: ${car}\n : "") +
      (year ? Год: ${year}\n : "") +
      (mileage ? Пробег: ${mileage}\n : "") +
      (message ? Комментарий: ${message}\n : "");

    const url = https://api.telegram.org/bot${token}/sendMessage;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
