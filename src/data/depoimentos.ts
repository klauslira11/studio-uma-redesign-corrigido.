// ============================================================
// DEPOIMENTOS — textos exibidos no carrossel "Histórias que
// ganham espaço".
// ------------------------------------------------------------
// COMO USAR:
// - Cada item tem: texto (obrigatório), nome, tipo, fonte
//   e link (opcionais — só aparecem quando preenchidos).
// - Os itens abaixo são APENAS EXEMPLOS DEMONSTRATIVOS
//   (conteúdo ilustrativo, sem cliente real associado).
//   Quando chegarem os depoimentos verdadeiros, APAGUE os
//   exemplos e adicione os reais com nome autorizado,
//   tipo de projeto e fonte/link da avaliação, se houver.
// - NÃO exibir "Avaliação do Google", estrelas ou nomes
//   sem uma avaliação verificável.
// ============================================================

export type Depoimento = {
  texto: string;
  nome?: string;
  tipo?: string;
  fonte?: string;
  link?: string;
};

export const depoimentos: Depoimento[] = [
  // ---- EXEMPLO DEMONSTRATIVO 1 (apagar ao receber os reais) ----
  {
    texto:
      "Eu tinha uma pasta cheia de referências, mas não conseguia explicar o que queria. A Laura e a Marina ouviram tudo com calma e foram dando forma a uma casa que finalmente parece nossa.",
  },
  // ---- EXEMPLO DEMONSTRATIVO 2 (apagar ao receber os reais) ----
  {
    texto:
      "A gente queria um espaço bonito, mas que funcionasse na rotina com as crianças. Gostei de perceber que cada escolha tinha um motivo, até nos detalhes que eu não teria pensado sozinha.",
  },
  // ---- EXEMPLO DEMONSTRATIVO 3 (apagar ao receber os reais) ----
  {
    texto:
      "O que mais me marcou foi a escuta. Elas entenderam coisas que eu ainda não sabia colocar em palavras e traduziram isso no projeto de um jeito muito sensível.",
  },
  // ---- EXEMPLO DEMONSTRATIVO 4 (apagar ao receber os reais) ----
  {
    texto:
      "Eu estava insegura com a reforma. Conversar sobre as etapas e entender as decisões do projeto me deixou muito mais tranquila para começar.",
  },
];
