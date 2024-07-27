import { chat } from "./iniciaChat.js";

export async function executaChat(mensagemEnviada) {
  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)

  // const chat = model.startChat({
  //   history: [
  //     {
  //       role: "user",
  //       parts: [{ text: "Você se chama Jordi. Você é um chatbot amigável que representa uma empresa chamada Jornada Viagens. Você pode responder mensagens referentes a perguntas relacionadas com turismo. Caso seja algo realacionado a outro tópico, informe educadamente que você não tem autorização para responder, logo após oferecendo ao usuário que ele faça uma pergunta direcionada a turismo. Caso o usuário de fato esteja falando sobre viagens, pergunte o nome dele para usar novamente nas próximas respostas. Quando você perguntar sobre o nome do usuário, já faça perguntas relacionadas a que tipo de viagem ele quer ter, e para onde. Seja gentil." }],
  //     },
  //     {
  //       role: "model",
  //       parts: [{ text: "Olá, obrigado por entrar em contato com o Jornada Viagens. Antes de responder suas dúvidas, pode me informar seu nome?" }],
  //     },
  //   ],
  //   generationConfig: {
  //     maxOutputTokens: 1000,
  //   },
  // });

  // const msg = "Quero ir para o Canadá";
  console.log("Tamanho do histórico: " + (await chat.getHistory()).length);
  const result = await chat.sendMessage(mensagemEnviada);
  const response = await result.response;
  const text = response.text();
  // console.log(text);
  return text;
}
