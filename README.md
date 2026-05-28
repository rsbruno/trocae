<p align="center">
  <strong style="font-size: 1.75rem; letter-spacing: 0.35em;">TROCAË</strong><br />
  <sub>álbum digital · copa do mundo 2026</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

> **Trocae** é um app web para montar e navegar um álbum de figurinhas da Copa do Mundo 2026.  
> O front é React + Vite; os dados oficiais de grupos e seleções vivem em JSON versionado e são sincronizados com o **Firestore** via seed.

<table>
<tr>
<td width="50%" valign="top">

### Neste README

| | |
|---|---|
| [Pré-requisitos](#pré-requisitos) | Node 20+, pnpm, projeto Firebase |
| [Rodar o projeto](#rodar-o-projeto) | instalação, dev, build |
| [Firebase](#configurar-o-firebase) | app web, seed, Firestore |
| [Estrutura](#estrutura-do-projeto) | pastas e responsabilidades |
| [Dados](#dados-e-seed) | JSON, coleções, referências |
| [Scripts](#scripts-disponíveis) | comandos do dia a dia |

</td>
<td width="50%" valign="top">

### Visão rápida

```
pnpm install
cp .env.example .env
# preencher Firebase (ver seção abaixo)
pnpm db:seed
pnpm dev
```

Abre **http://localhost:5173**

</td>
</tr>
</table>

---

## Pré-requisitos

| Ferramenta | Versão sugerida |
|------------|-----------------|
| [Node.js](https://nodejs.org/) | 20 LTS ou superior |
| [pnpm](https://pnpm.io/) | 9+ |
| Conta [Firebase](https://console.firebase.google.com/) | projeto com Firestore ativo |

---

## Rodar o projeto

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd trocae
pnpm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` conforme a seção [Configurar o Firebase](#configurar-o-firebase).

### 3. (Opcional) Popular o Firestore

Se o app for ler dados do Firebase, rode o seed depois de configurar a service account:

```bash
pnpm db:seed
```

### 4. Subir o ambiente de desenvolvimento

```bash
pnpm dev
```

| Ambiente | URL |
|----------|-----|
| Desenvolvimento | http://localhost:5173 |
| Preview da build | `pnpm build && pnpm preview` → http://localhost:4173 |

---

## Configurar o Firebase

O projeto usa **dois caminhos** de credencial, cada um com um papel:

| Uso | SDK | Variáveis |
|-----|-----|-----------|
| App React (navegador) | `firebase` (cliente) | `FIREBASE_*` do console |
| Script `pnpm db:seed` | `firebase-admin` | `FIREBASE_SERVICE_ACCOUNT_PATH` |

### Passo 1 — Criar o projeto

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. **Adicionar projeto** (ou use um existente).
3. Em **Build → Firestore Database**, crie o banco (modo **produção** ou **teste** para desenvolvimento).

### Passo 2 — Registrar o app Web

1. Na visão geral do projeto → **Adicionar app** → ícone **Web** (`</>`).
2. Copie o objeto `firebaseConfig` exibido.
3. Cole os valores no `.env`:

```env
FIREBASE_API_KEY=sua_api_key
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> `FIREBASE_MEASUREMENT_ID` é opcional (Analytics).

O Vite expõe variáveis com prefixo `FIREBASE_` e `VITE_` — não é necessário renomear para `VITE_FIREBASE_*`.

### Passo 3 — Service account (somente para o seed)

O script de seed ignora as regras do Firestore e precisa de uma **chave de administrador**:

1. **Configurações do projeto** (engrenagem) → **Contas de serviço**.
2. **Gerar nova chave privada** → salve o JSON na raiz do repo, por exemplo:

   `firebase-service-account.json`

3. No `.env`:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**Nunca commite** esse arquivo. Ele já está listado no `.gitignore`.

### Passo 4 — Regras do Firestore (app)

O seed usa Admin SDK. O **app no browser** obedece às regras. Para desenvolvimento, você pode liberar leitura (ajuste conforme sua necessidade de segurança):

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

Em produção, restrinja leitura/escrita com autenticação.

### Passo 5 — Rodar o seed

```bash
pnpm db:seed
```

Saída esperada:

```text
[groups] 12 documentos (12 criados, 0 atualizados)
[teams] 48 documentos (48 criados, 0 atualizados)
```

Rodar de novo **atualiza** documentos existentes e **não altera** o `createdAt` original.

---

## Dados e seed

### Arquivos locais

```
src/database/
├── seed.ts              # sincroniza JSON → Firestore
└── 2026/
    ├── groups.json      # 12 grupos (A–L)
    └── teams.json       # 48 seleções
```

Cada arquivo `.json` na pasta `2026/` vira uma **coleção** no Firestore com o **mesmo nome** (sem extensão).

### Modelo no Firestore

| Coleção | Documento | Campos principais |
|---------|-----------|-------------------|
| `groups` | `{id}` do JSON | `name`, `code`, `order`, `createdAt` |
| `teams` | `{id}` do JSON | `name`, `fifaCode`, `groupRef`, cores, `createdAt`, … |

**Referências:** em `teams`, o campo `groupRef` é gravado como `DocumentReference` apontando para `groups/{id}` — não como string solta.

**Timestamps:** `createdAt` é definido apenas na **primeira criação** do documento.

### Ordem do seed

1. `groups.json` (referências precisam existir antes)
2. `teams.json`

Novos `.json` em `2026/` são detectados automaticamente; campos terminados em `Ref` podem ser mapeados em `referenceFieldCollections` dentro de `seed.ts`.

---

## Estrutura do projeto

```
src/
├── @types/                 # tipos Group, Team, TeamSeed, …
├── components/v2026/       # figurinhas (normal, extra)
├── database/               # seeds e JSON da edição 2026
├── infra/firebase/
│   ├── config.ts           # getFirebaseConfig() — app
│   ├── client.ts           # getFirebaseApp(), getFirestoreClient()
│   └── admin.ts            # getAdminFirestore() — seed
├── pages/                  # rotas TanStack Router
├── routes/                 # árvore gerada do router
├── lib/                    # utilitários (ex.: tailwind variants)
└── styles/                 # CSS global
```

| Caminho | Responsabilidade |
|---------|------------------|
| `src/main.tsx` | bootstrap React + inicialização Firebase |
| `src/pages/album/$id/$pais/` | página de figurinha por álbum/país |
| `src/infra/firebase/config.ts` | lê `FIREBASE_*` do ambiente |
| `src/database/seed.ts` | upsert Admin SDK a partir dos JSON |

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | servidor de desenvolvimento (Vite + HMR) |
| `pnpm build` | checagem TypeScript + build de produção |
| `pnpm preview` | serve a pasta `dist/` localmente |
| `pnpm db:seed` | sincroniza `src/database/2026/*.json` → Firestore |
| `pnpm lint:fix` | ESLint com correção automática |
| `pnpm format` | Prettier em TS/TSX/JSON |

### Git hooks (Husky)

Após `pnpm install`, o script `prepare` registra os hooks em `.husky/_` (`core.hooksPath`).

| Hook | O que roda |
|------|------------|
| **pre-commit** | `pnpm format` → `pnpm lint:fix` → `git add .` |
| **pre-push** | `pnpm build` |

Para pular os hooks em um comando pontual:

```bash
HUSKY=0 git commit -m "mensagem"
HUSKY=0 git push
```

---

## Stack

- **React 19** + **TypeScript**
- **Vite 8** — bundler e dev server
- **TanStack Router** — roteamento file-based em `src/pages/`
- **Tailwind CSS 4** — estilos utilitários
- **Firebase** — Firestore no app; Admin SDK no seed
- **Base UI** + **Lucide** — componentes e ícones

---

## Solução de problemas

<details>
<summary><strong>permission-denied</strong> ao rodar <code>pnpm db:seed</code></summary>

O seed estava usando o SDK cliente (respeita regras). Confirme que `FIREBASE_SERVICE_ACCOUNT_PATH` aponta para um JSON válido e que o arquivo não foi commitado por engano.

</details>

<details>
<summary><strong>Variável de ambiente ausente</strong> no app</summary>

Verifique se o `.env` está na raiz do projeto e se todas as chaves `FIREBASE_*` obrigatórias estão preenchidas. Reinicie o `pnpm dev` após alterar o `.env`.

</details>

<details>
<summary><strong>groupRef</strong> não resolve no seed</summary>

Garanta que `groups.json` foi sincronizado antes de `teams.json`. O seed já ordena os arquivos nessa sequência.

</details>

---

<p align="center">
  <sub>edição 2026 · feito para quem ainda cola figurinha na capa do álbum</sub>
</p>
