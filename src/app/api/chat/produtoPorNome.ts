const PALAVRAS_IGNORADAS = [
  "pausar", "pause", "pausa", "reativar", "reative", "reativa", "ativar",
  "ative", "ativa", "minha", "minhas", "meu", "meus", "oferta", "ofertas",
  "produto", "produtos", "por", "favor", "quero", "gostaria", "preciso",
  "quer", "de", "da", "do", "das", "dos", "a", "o", "as", "os", "que",
  "esta", "esse", "essa", "isso", "no", "na",
];

const MARCAS_DIACRITICAS = /[̀-ͯ]/g;

export function extrairNomeCandidato(mensagem: string): string {
  const palavras = mensagem
    .toLowerCase()
    .normalize("NFD")
    .replace(MARCAS_DIACRITICAS, "")
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((palavra) => palavra && !PALAVRAS_IGNORADAS.includes(palavra));

  return palavras.join(" ").trim();
}
