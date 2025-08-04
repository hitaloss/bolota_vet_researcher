import { Request, Response } from "express";
import { searchArticles } from "../services/pubmed.service";

async function searchPubmedHandlerController(
  request: Request,
  response: Response
) {
  const { medicamento, especie } = request.query;

  if (!medicamento || !especie) {
    return response.status(400).json({
      error: "Parâmetros 'medicamento' e 'especie' são obrigatórios.",
    });
  }

  const articles = await searchArticles(
    medicamento as string,
    especie as string
  );

  response.status(200).json(articles);
}

export default searchPubmedHandlerController;
