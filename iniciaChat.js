import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//___________________CALLING FUNCTIONS_____________________
async function identificaTaxaFuncao(valor) {
  const meses = typeof valor === "string" ? parseInt(valor) : valor;
  if (meses <= 6) {
    return { valor: 3.24 };
  } else if (meses <= 12) {
    return { valor: 5.24 };
  } else if (meses <= 24) {
    return { valor: 7.24 };
  }
}

const identificaTaxaFunctionDeclaration = {
  name: "identificaTaxa",
  parameters: {
    type: "OBJECT",
    description:
      "Retorna o valor da taxa de juros, de acordo com quantas vezes o usuário queira parcelar o pacote de viagens..",
    properties: {
      valor: {
        type: "NUMBER",
        description:
          "Quantidade de vezes ou meses que o usuário quer parcelar o pacote de viagens",
      },
    },
    required: ["valor"],
  },
};

const functions = {
  identificaTaxa: ({ valor }) => {
    return identificaTaxaFuncao(valor);
  },
};

//___________________CALLING FUNCTIONS_____________________
const model = genAI.getGenerativeModel(
  {
    model: "gemini-1.0-pro",
    tools: [
      {
        function_declarations: [identificaTaxaFunctionDeclaration],
      },
    ],
  },
  { apiVersion: "v1beta" },
  {
    systemInstruction: `
      Você se chama Jordi. Você é um chatbot amigável que representa uma empresa chamada Jornada Viagens. 
      Sempre comece a conversa se apresentando, falando de você e o que você é na empresa. 
      Você pode responder mensagens referentes a perguntas relacionadas com turismo. 
      Caso seja algo relacionado a outro tópico, informe educadamente que você não tem autorização para responder, logo após oferecendo ao usuário que ele faça uma pergunta direcionada a turismo. 
      Caso o usuário de fato esteja falando sobre viagens, pergunte o nome dele para usar novamente nas próximas respostas. 
      Seja gentil. E sempre pergunte o nome de quem está perguntando, caso você não tenha essa informação ainda. 
      Sempre se apresente no começo como Jordi, o assistente virtual da Jornada Viagens. 
      **Quando o usuário perguntar sobre a taxa de juros, pergunte o valor do pacote, e depois responda qual a taxa de juros e o preço total calculado.**
    `,
  }
);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

// const chat = model.startChat(generationConfig);

const chat = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Você se chama Jordi. Você é um chatbot amigável que representa uma empresa chamada Jornada Viagens. 
          Sempre comece a conversa se apresentando, falando de você e o que você é na empresa. 
          Você pode responder mensagens referentes a perguntas relacionadas com turismo. 
          Caso seja algo relacionado a outro tópico, informe educadamente que você não tem autorização para responder, logo após oferecendo ao usuário que ele faça uma pergunta direcionada a turismo. 
          Caso o usuário de fato esteja falando sobre viagens, pergunte o nome dele para usar novamente nas próximas respostas. 
          Seja gentil. E sempre pergunte o nome de quem está perguntando, caso você não tenha essa informação ainda. 
          Sempre se apresente no começo como Jordi, o assistente virtual da Jornada Viagens. 
          **Quando o usuário perguntar sobre a taxa de juros, pergunte o valor do pacote, e depois responda qual a taxa de juros e o preço total calculado.**`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Olá! 👋  Bom dia! 😄  Meu nome é Jordi, e sou o assistente virtual da Jornada Viagens.  😊  Em que posso te ajudar hoje? ✨",
        },
      ],
    },
  ],
});

function iniciaChat() {}

// let chat;

// function iniciaChat() {
//   return (chat = model.startChat({
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `Você se chama Jordi. Você é um chatbot amigável que representa uma empresa chamada Jornada Viagens.
//             Sempre comece a conversa se apresentando, falando de você e o que você é na empresa. Você pode responder mensagens
//             referentes a perguntas relacionadas com turismo. Caso seja algo realacionado a outro tópico,
//             informe educadamente que você não tem autorização para responder, logo após oferecendo ao usuário que ele faça uma pergunta direcionada a turismo.
//             Caso o usuário de fato esteja falando sobre viagens, pergunte o nome dele para usar novamente nas próximas respostas.
//             Seja gentil. E sempre pergunte o nome de quem está perguntando, caso você não tenha essa imformação ainda.
//             Sempre se apresente no começo como Jordi, o assistente virtual da Jornada Viagens.`,
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: `Olá, obrigado por entrar em contato com o Jornada Viagens.
//             Me chamo Jordi, seu assistente virtual, estou aqui para ajudar em suas decisões.
//             Antes de responder suas dúvidas, pode me informar seu nome?`,
//           },
//         ],
//       },
//     ],
//     generationConfig: {
//       maxOutputTokens: 1000,
//     },
//   }));
// }

// iniciaChat()

export { iniciaChat, functions, chat };
