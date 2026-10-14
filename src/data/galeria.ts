// ============================================================
// GALERIA 2 — grade de fotos da página inicial
// ------------------------------------------------------------
// COMO USAR:
// - Para ADICIONAR uma foto: coloque o arquivo dentro de
//   src/assets/galeria2/ (jpg, jpeg, png ou webp).
// - Para RETIRAR uma foto: apague (ou mova para fora)
//   o arquivo da pasta src/assets/galeria2/.
// - Não é preciso editar este arquivo: tudo que estiver
//   na pasta aparece automaticamente, em ordem alfabética
//   (use prefixos numéricos como 01-, 02- para ordenar).
// - O título de cada foto é gerado a partir do nome do
//   arquivo (ex: 01-salao-blush.jpg vira "Salao Blush").
// - A grade mantém 3 colunas no PC e 2 no mobile,
//   independente da quantidade de fotos.
// ============================================================

export type GaleriaItem = {
  image: string;
  title: string;
};

const modulos = import.meta.glob<string>("../assets/galeria2/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

function tituloDoArquivo(caminho: string): string {
  const arquivo = caminho.split("/").pop() ?? caminho;
  const semExtensao = arquivo.replace(/\.[a-z0-9]+$/i, "");
  const semPrefixo = semExtensao.replace(/^\d+\s*[-_.]?\s*/, "");
  return semPrefixo.replace(/[-_]+/g, " ").trim() || semExtensao;
}

export const galeria: GaleriaItem[] = Object.entries(modulos)
  .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
  .map(([caminho, url]) => ({ image: url, title: tituloDoArquivo(caminho) }));
