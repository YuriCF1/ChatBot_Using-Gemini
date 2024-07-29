import { chat, functions, iniciaChat } from "./iniciaChat.js";

export async function executaChat(mensagemEnviada) {
  // if (!chat) {
  //   throw new Error("Chat não inicializado.");
  // }

  const result = await chat.sendMessage(mensagemEnviada);
  const response = result.response;

  console.log("Response", result.response);
  if (result.response.functionCalls()) {
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
      return result2.response.text();
    }
  } else {
    const text = response.text();
    return text;
  }
}
