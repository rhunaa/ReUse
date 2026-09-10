const VERSAO_API = "2021-06-14";

function credenciais() {
  const apiKey = process.env.WATSON_ASSISTANT_API_KEY;
  const url = process.env.WATSON_ASSISTANT_URL;
  const assistantId = process.env.WATSON_ASSISTANT_ID;
  if (!apiKey || !url || !assistantId) {
    throw new Error(
      "Configuração do Watson Assistant ausente. Defina WATSON_ASSISTANT_API_KEY, WATSON_ASSISTANT_URL e WATSON_ASSISTANT_ID.",
    );
  }
  return { apiKey, url, assistantId };
}

function cabecalhoAutorizacao(apiKey: string) {
  const token = Buffer.from(`apikey:${apiKey}`).toString("base64");
  return `Basic ${token}`;
}

export async function criarSessaoWatson(): Promise<string> {
  const { apiKey, url, assistantId } = credenciais();

  const resposta = await fetch(
    `${url}/v2/assistants/${assistantId}/sessions?version=${VERSAO_API}`,
    {
      method: "POST",
      headers: {
        Authorization: cabecalhoAutorizacao(apiKey),
        "Content-Type": "application/json",
      },
    },
  );

  if (!resposta.ok) {
    throw new Error(`Falha ao criar sessão do Watson (${resposta.status})`);
  }

  const dados = await resposta.json();
  return dados.session_id as string;
}

export type RespostaWatson = {
  texto: string;
  intent: string | null;
  confianca: number;
};

export async function enviarMensagemWatson(
  sessionId: string,
  mensagem: string,
): Promise<RespostaWatson> {
  const { apiKey, url, assistantId } = credenciais();

  const resposta = await fetch(
    `${url}/v2/assistants/${assistantId}/sessions/${sessionId}/message?version=${VERSAO_API}`,
    {
      method: "POST",
      headers: {
        Authorization: cabecalhoAutorizacao(apiKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { message_type: "text", text: mensagem },
      }),
    },
  );

  if (!resposta.ok) {
    throw new Error(`Falha ao enviar mensagem ao Watson (${resposta.status})`);
  }

  const dados = await resposta.json();

  const texto = (dados.output?.generic ?? [])
    .filter((item: { response_type: string }) => item.response_type === "text")
    .map((item: { text: string }) => item.text)
    .join(" ");

  const primeiraIntencao = dados.output?.intents?.[0];

  return {
    texto: texto || "Desculpe, não entendi. Pode reformular?",
    intent: primeiraIntencao?.intent ?? null,
    confianca: primeiraIntencao?.confidence ?? 0,
  };
}
