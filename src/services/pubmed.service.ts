import axios from "axios";
import { parseStringPromise } from "xml2js";

const esearch = async (
  medicamento: string,
  especie: string
): Promise<string[]> => {
  const term = `(${medicamento}[Title/Abstract]) AND (${especie}[Title/Abstract])`;

  try {
    const { data } = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
      {
        params: {
          db: "pubmed",
          term,
          retmode: "json",
          retmax: 5,
        },
      }
    );
    return data.esearchresult.idlist;
  } catch (error) {
    return [];
  }
};

const efetch = async (pmids: string[]): Promise<any> => {
  try {
    const { data } = await axios.get(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
      {
        params: { db: "pubmed", id: pmids.join(","), retmode: "xml" },
      }
    );

    return parseStringPromise(data);
  } catch (error) {
    return null;
  }
};

const parseArticles = (articles: any[]) => {
  if (!articles || articles.length === 0) {
    return [];
  }
  return articles.map((article) => {
    const citation = article.MedlineCitation[0];
    const pmid = citation.PMID[0]._;

    const titleNode = citation.Article[0].ArticleTitle[0];
    let title = "Sem título";
    if (typeof titleNode === "string") {
      title = titleNode;
    } else if (typeof titleNode === "object" && titleNode._) {
      title = titleNode._;
    }

    const abstractNode = citation.Article[0].Abstract?.[0]?.AbstractText?.[0];
    let abstract = "Sem resumo";
    if (abstractNode) {
      if (typeof abstractNode === "string") {
        abstract = abstractNode;
      } else if (typeof abstractNode === "object" && abstractNode._) {
        abstract = abstractNode._;
      }
    }

    return { title, abstract, link: `https://pubmed.ncbi.nlm.nih.gov/${pmid}` };
  });
};

export const searchArticles = async (
  medicamento: string,
  especie: string
): Promise<any[]> => {
  const pmids = await esearch(medicamento, especie);

  if (!pmids || pmids.length === 0) {
    return [];
  }
  const parsedXml = await efetch(pmids);
  const articlesToParse = parsedXml?.PubmedArticleSet?.PubmedArticle || [];
  return parseArticles(articlesToParse);
};
