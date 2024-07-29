import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//___________________CALLING FUNCTIONS_____________________
async function identificaTaxaFuncao(valor) {
  const meses = typeof valor === "string" ? parseInt(valor) : valor;
  if (meses <= 6) {
    return {valor: 3};
  } else if (meses <= 12) {
    return {valor: 15};
  } else if (meses <= 24) {
    return {valor: 7};
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

const generativeModel = genAI.getGenerativeModel(
  {
    model: "gemini-1.5-flash",
    tools: {
      functionDeclarations: [identificaTaxaFunctionDeclaration],
    },
  },
  { apiVersion: "v1beta" }
);

const chat = generativeModel.startChat();

// function iniciaChat() {
//   chat = generativeModel.startChat({
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
//   });
// }

let prompt =
  "Quero saber a taxa de Juros deividzinho o pacote em oito vezes";

const result = await chat.sendMessage(prompt);
const response = result.response;

// console.log("RESPONSE", response); // Verifique o conteúdo da resposta
console.log("Response", result.response);
// console.log("Result", result.response.functionCalls()[0]);
const call = result.response.functionCalls()[0];
if (call) {
  // Call the executable function named in the function call
  // with the arguments specified in the function call and
  // let it call the hypothetical API.
  const apiResponse = await functions[call.name](call.args);

  // Send the API response back to the model so it can generate
  // a text response that can be displayed to the user.
  const result2 = await chat.sendMessage([
    {
      functionResponse: {
        name: "identificaTaxa",
        response: apiResponse,
      },
    },
  ]);

  // Log the text response.
  console.log(result2.response.text());
}

console.log("Rodou");

function iniciaChat() {

}

// export { chat, iniciaChat, functions };
