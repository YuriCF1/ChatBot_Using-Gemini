import { chat, functions } from "./iniciaChat.js";
import { incorporarDocumentos, incorporarPergunta } from "./embedding.js";

const documentos = await incorporarDocumentos([
  "A política de cancelamento é de 30 dias antes da viagem. Caso contrário, não faremos o reembolso",
  "Viagem para Disney 6 dias é R$ 21.325,00 - Viagem para Disney em 10 dias é R$ 25.000,00",
]);

console.log(documentos);

const functionMap = {
  //Definingo palavras chaves e associando as funções
  identificaTaxa: ["juros", "taxa de juros", "dividir", "vezes"],
};

export async function executaChat(mensagemEnviada) {
  // console.log("Tamanho do histórico: ", (await chat.getHistory()).length);
  let doc = await incorporarPergunta(mensagemEnviada, documentos);
  let prompt = await
    mensagemEnviada +
    "talvez esse trecho te ajude a formular a resposta " +
    doc.text;

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log("Response", result.response);
  console.log("RESPOSTA: ", response.text());

  let selectedFunction = null; //Verificando a existência de palavras chaves para escolher a função certa.
  for (const [functionName, keywords] of Object.entries(functionMap)) {
    for (const keyword of keywords) {
      if (mensagemEnviada.toLowerCase().includes(keyword)) {
        selectedFunction = functionName;
        break;
      }
    }
    if (selectedFunction) break;
  }

  if (result.response.functionCalls()) {
    const call = result.response
      .functionCalls()
      .find((fc) => fc.name === selectedFunction); //REFATORAR, busca de funções dinâmicas
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
            name: selectedFunction,
            response: apiResponse,
          },
        },
      ]);

      // Log the text response.
      console.log("RESPOSTA 2: ", result2.response.text());
      return result2.response.text();
    }
  } else {
    const text = response.text();
    return text;
  }
}
