/**
 * API для работы с чатом AI-ассистента "Наканунщик"
 *
 * Реальный формат API бэкенда:
 * - URL: https://amp.kinetica.su/clientservices/kinetica/bot/
 * - Формат: { "messages": [{ "role": "bot" | "user", "content": string }] }
 */

type Message = {
  text: string;
  isBot: boolean;
};

type ApiMessage = {
  role: "bot" | "user";
  content: string;
};

// Используем прокси через веб-сервер (работает и в dev, и в production)
// В dev режиме Vite проксирует, в production нужно настроить прокси на веб-сервере
const API_URL = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

/**
 * Конвертирует внутренний формат сообщений в формат API
 */
function convertMessagesToApi(messages: Message[]): ApiMessage[] {
  return messages.map((msg) => ({
    role: msg.isBot ? "bot" : "user",
    content: msg.text,
  }));
}

/**
 * Конвертирует формат API во внутренний формат сообщений
 */
function convertApiToMessage(apiMessage: ApiMessage): Message {
  return {
    text: apiMessage.content,
    isBot: apiMessage.role === "bot",
  };
}

/**
 * Отправляет запрос к API чата и получает ответ от бота
 *
 * @param messages - Полная история сообщений в чате (включая новое сообщение пользователя)
 * @returns Promise с ответом от API или null в случае ошибки
 */
export async function sendChatMessage(
  messages: Message[]
): Promise<Message | null> {
  try {
    const apiMessages = convertMessagesToApi(messages);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: apiMessages,
      }),
    });

    let data;
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      try {
        if (contentType?.includes("application/json")) {
          data = await response.json();
        } else {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${errorText}`
          );
        }
      } catch (parseError) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      if (data && typeof data === "object") {
        const errorMessage =
          data.message || data.error || data.detail || JSON.stringify(data);
        throw new Error(`API Error: ${errorMessage}`);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text;
    }

    if (Array.isArray(data)) {
      const botMessages = data.filter((msg: ApiMessage) => msg.role === "bot");
      if (botMessages.length > 0) {
        return convertApiToMessage(botMessages[botMessages.length - 1]);
      }
    } else if (data.reply_to_user) {
      if (data.debug_error?.includes("429")) {
        return {
          text: "Извините, слишком много запросов. Подождите немного и попробуйте снова.",
          isBot: true,
        };
      }
      return {
        text: data.reply_to_user,
        isBot: true,
      };
    } else if (data.content) {
      return convertApiToMessage({ role: "bot", content: data.content });
    } else if (data.role && data.content) {
      return convertApiToMessage(data as ApiMessage);
    } else if (typeof data === "string") {
      return { text: data, isBot: true };
    }

    throw new Error("Неожиданный формат ответа от API");
  } catch (error) {
    if (error instanceof Error && !error.message.includes("429")) {
      console.error("Chat API error:", error.message);
    }
    return null;
  }
}
