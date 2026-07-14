import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { siteConfig } from "../config/site.config.js";
import topics from "../config/topics.json" with { type: "json" };
import { construirePrompt } from "./lib/seoPrompt.js";
import { injecterEncartsAffilies } from "./lib/affiliate.js";
import { pageArticle, pageAccueil, fluxRSS, sitemapXML } from "./lib/template.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const STATE_FILE = path.join(ROOT, "data", "state.json");
const ARTICLES_FILE = path.join(ROOT, "data", "articles.json");

function chargerJSON(fichier, defaut) {
  try {
    return JSON.parse(fs.readFileSync(fichier, "utf-8"));
  } catch {
    return defaut;
  }
}

function sauvegarderJSON(fichier, data) {
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  fs.writeFileSync(fichier, JSON.stringify(data, null, 2), "utf-8");
}

async function genererArticleDuJour() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "\n❌ ANTHROPIC_API_KEY manquante. Ajoute-la comme secret GitHub (Settings > Secrets and variables > Actions) ou en variable d'environnement locale.\n"
    );
    process.exit(1);
  }

  const state = chargerJSON(STATE_FILE, { compteurJour: 0 });
  const articles = chargerJSON(ARTICLES_FILE, []);

  const index = state.compteurJour % topics.length;
  const sujetDuJour = topics[index];
  const sujetsDejaTraites = articles.filter((a) => a.sujetOrigine === sujetDuJour.sujet).map((a) => a.titreSEO);

  console.log(`📝 Génération de l'article du jour : [${sujetDuJour.type}] ${sujetDuJour.sujet}`);

  const client = new Anthropic();
  const prompt = construirePrompt({ ...sujetDuJour, sujetsDejaTraites });

  const reponse = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const texte = reponse.content.find((b) => b.type === "text")?.text ?? "";
  let data;
  try {
    const nettoye = texte.replace(/^```json\s*|```\s*$/g, "").trim();
    data = JSON.parse(nettoye);
  } catch (e) {
    console.error("❌ Impossible de parser la réponse JSON du modèle :", e.message);
    console.error(texte.slice(0, 500));
    process.exit(1);
  }

  // Anti-doublon de slug
  let slug = data.slug;
  let n = 2;
  while (articles.some((a) => a.slug === slug)) {
    slug = `${data.slug}-${n}`;
    n++;
  }

  const maintenant = new Date();
  const article = {
    ...data,
    slug,
    type: sujetDuJour.type,
    sujetOrigine: sujetDuJour.sujet,
    date: maintenant.toISOString(),
    dateAffichage: maintenant.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    contenuHTML: injecterEncartsAffilies(data.contenuHTML),
  };

  // Écriture de la page article
  fs.mkdirSync(path.join(DOCS, "articles"), { recursive: true });
  fs.writeFileSync(path.join(DOCS, "articles", `${slug}.html`), pageArticle(article), "utf-8");

  // Mise à jour des données + pages globales
  articles.unshift(article);
  sauvegarderJSON(ARTICLES_FILE, articles);
  sauvegarderJSON(STATE_FILE, { compteurJour: state.compteurJour + 1 });

  fs.writeFileSync(path.join(DOCS, "index.html"), pageAccueil(articles), "utf-8");
  fs.writeFileSync(path.join(DOCS, "rss.xml"), fluxRSS(articles), "utf-8");
  fs.writeFileSync(path.join(DOCS, "sitemap.xml"), sitemapXML(articles), "utf-8");

  console.log(`✅ Article publié : /articles/${slug}.html`);
}

genererArticleDuJour().catch((e) => {
  console.error("❌ Erreur pendant la génération :", e);
  process.exit(1);
});
