# AirGuide — Blog d'affiliation automatisé sur les ventilateurs

Ce projet publie **automatiquement un article de ~2500 mots par jour** (comparatif, guide complet ou article, en rotation), optimisé SEO, avec des encarts Amazon affiliés intégrés — hébergé **gratuitement** sur GitHub Pages.

## Comment ça marche

1. Chaque jour, une **GitHub Action** (un robot programmé) se réveille et exécute `scripts/generate-article.js`.
2. Ce script appelle l'**API Claude** avec un prompt SEO détaillé (`scripts/lib/seoPrompt.js`) pour rédiger l'article du jour, en piochant dans la liste de 60 sujets (`config/topics.json`), qui boucle ensuite avec des angles différents.
3. Le script transforme la réponse en page HTML complète (balises SEO, schema.org, FAQ, encarts produits), l'ajoute à `docs/articles/`, et met à jour la page d'accueil, le sitemap et le flux RSS.
4. Le robot **commit et push** automatiquement — GitHub Pages republie le site en quelques minutes.

Tu n'as **rien à faire au quotidien**. Il te reste seulement 3 inscriptions à faire une seule fois pour tout activer.

---

## Ce qu'il te reste à faire (une seule fois)

### 1. Créer ton compte Amazon Associates (pour toucher des commissions)
1. Va sur https://partenaires.amazon.fr et inscris-toi.
2. Amazon demande un site déjà en ligne pour valider ta candidature — déploie d'abord le site (étape 3 ci-dessous) avec le tag factice, puis reviens t'inscrire une fois qu'il y a quelques articles publiés.
3. Une fois validé, tu récupères ton **tracking ID** (ex : `airguide-21`).
4. ⚠️ Amazon exige que tu génères au moins 3 ventes dans les 180 jours suivant l'inscription, sous peine de fermeture du compte — publie donc rapidement et partage tes articles.

### 2. Créer ta clé API Anthropic (pour la génération de contenu)
1. Va sur https://console.anthropic.com et crée un compte.
2. Section "API Keys" → crée une clé (commence par `sk-ant-...`).
3. Ajoute un moyen de paiement et un petit crédit (chaque article coûte quelques centimes seulement).

### 3. Déployer le site (gratuit, 10 minutes)
1. Crée un compte sur https://github.com si tu n'en as pas.
2. Crée un nouveau dépôt (ex : `ventilateur-blog`) et mets-y tout le contenu de ce dossier.
3. Dans le dépôt GitHub → **Settings → Secrets and variables → Actions** :
   - Onglet **Secrets** → "New repository secret" :
     - `ANTHROPIC_API_KEY` = ta clé Anthropic
     - `AMAZON_TAG` = ton tracking ID Amazon (ou laisse vide au début)
   - Onglet **Variables** → "New repository variable" :
     - `SITE_DOMAIN` = `https://TON-PSEUDO.github.io/ventilateur-blog`
4. Dans **Settings → Pages** : Source = "Deploy from a branch", branche `main`, dossier `/docs`.
5. Dans l'onglet **Actions** du dépôt, ouvre le workflow "Publication quotidienne d'un article" et clique sur **Run workflow** pour générer ton premier article tout de suite (sans attendre le lendemain).

Ton site sera visible sur `https://TON-PSEUDO.github.io/ventilateur-blog` en quelques minutes.

---

## Personnaliser

- **`config/site.config.js`** : nom du site, email de contact, longueur cible des articles.
- **`config/topics.json`** : la liste des 60 sujets. Ajoute/modifie librement des lignes (garde le format `{ "type", "sujet", "motCle" }`).
- **`docs/styles/main.css`** : l'identité visuelle (couleurs, typographies).
- **`.github/workflows/daily-article.yml`** : change l'heure de publication (`cron: "0 6 * * *"` = 6h UTC) ou passe à plusieurs articles/jour en dupliquant le job.

## Tester en local avant de déployer

```bash
npm install
cp .env.example .env   # puis renseigne ta vraie clé API dedans
node --env-file=.env scripts/generate-article.js
```

Ouvre ensuite `docs/index.html` dans ton navigateur pour voir le résultat.

## Important : conformité légale

- Le bandeau de transparence affilié (obligatoire chez Amazon Associates) est déjà intégré en pied de page et sur chaque article — ne le supprime pas.
- Les liens produits utilisent des **liens de recherche Amazon** (par mot-clé) plutôt que des fiches produit précises inventées : le système ne prétend jamais qu'un modèle précis a telle caractéristique s'il ne le sait pas réellement. Une fois que tu auras repéré de vrais produits que tu veux mettre en avant (avec leur ASIN), tu pourras enrichir `scripts/lib/affiliate.js` pour créer des liens directs vers ces fiches précises.
- Pense à ajouter une page "Mentions légales" avec ton statut (auto-entrepreneur, etc.) si tu déclares des revenus d'affiliation.
