# 🍆 Eggplant Logs | AI Audit Log & Governance Platform

> **O "Cinto de Segurança" para a IA Generativa corporativa.** O **Eggplant Logs** é uma plataforma de governança e auditoria (SaaS B2B) projetada para empresas que utilizam modelos de Inteligência Artificial (OpenAI, Anthropic, etc.), mas precisam de controle total sobre segurança, conformidade (LGPD) e custos.

---

## 📋 O Problema que Resolvemos
Empresas estão integrando IA em seus fluxos, mas enfrentam três grandes desafios:
1. **Falta de Visibilidade:** Não sabem quem está perguntando o quê para a IA.
2. **Risco de Conformidade:** Dados sensíveis sendo enviados para modelos públicos.
3. **Gestão de Custos:** Dificuldade em rastrear o gasto granular por chave de API ou departamento.

## 🚀 A Solução
O Eggplant Logs atua como um **Proxy Inteligente** entre o usuário e o provedor de IA.

- **Backend (NestJS):** Uma API robusta que intercepta a requisição, valida a presença de dados sensíveis via Regex e Regras Customizadas, registra o log no **PostgreSQL** e gerencia o roteamento para a OpenAI.
- **Frontend (React):** Um Dashboard de alto nível estilo **SOC (Security Operations Center)** com métricas em tempo real, auditoria detalhada e gestão de chaves.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Vite.
- **Backend:** NestJS (Node.js), Prisma ORM.
- **Banco de Dados:** PostgreSQL (Agregações nativas para alta performance).
- **Infraestrutura:** Docker & Docker Compose.
- **Segurança:** Filtros de sensibilidade de dados e Proxy de chaves de API.

---

## 🧠 Diferenciais de Engenharia 

### 📊 Performance & Escalabilidade de Dados
Diferente de abordagens iniciantes que utilizam `.reduce()` ou `.map()` no Node.js para calcular métricas, o Eggplant Logs delega o trabalho pesado ao **PostgreSQL**.
- Utilizamos **Agregações de Banco de Dados** (`count`, `sum`, `avg`) para garantir que o dashboard carregue instantaneamente, mesmo com milhões de registros de logs.
- Implementação de `Promise.all` para chamadas paralelas ao banco, reduzindo o tempo de resposta da API.

### 🛡️ Filtro de LGPD & Segurança
- O sistema analisa o corpo da mensagem antes de enviá-la ao provedor de IA.
- Se um dado sensível for detectado, o log é marcado com um alerta de risco no dashboard, permitindo auditoria imediata.

### 📐 Arquitetura de UI Escalável
- **Sidebar Navigation:** Escolhida como padrão de ouro para SaaS B2B, permitindo o crescimento horizontal da plataforma (novas funcionalidades como "Políticas de Segurança" ou "Alertas" podem ser adicionadas sem quebrar o layout).

---

## 💻 Como Executar

1. **Clonar o repositório**
   ```bash
   git clone [https://github.com/seu-usuario/eggplant-logs.git](https://github.com/seu-usuario/eggplant-logs.git)