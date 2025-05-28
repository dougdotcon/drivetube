# TANOS: Adaptador Taproot para Trocas Orquestradas por Nostr 🔄

> TANOS é uma biblioteca que implementa trocas atômicas entre Bitcoin e Nostr, utilizando Taproot e assinaturas adaptadoras Schnorr, desenvolvida para o [MIT Bitcoin Hackathon](https://mitbitcoin.dev/).

![TANOS Logo](logo.png)

## 📋 Visão Geral

O TANOS permite trocas atômicas entre:
- 🔸 Transações Bitcoin usando endereços Taproot P2TR
- 🔸 Eventos Nostr com assinaturas Schnorr

O protocolo utiliza assinaturas adaptadoras para garantir atomicidade:
- O comprador só recebe o evento Nostr assinado se pagar com Bitcoin
- O vendedor só recebe o Bitcoin se revelar o segredo da assinatura Nostr

## 💡 Inspiração

Este projeto é inspirado no [NIP 455: Trocas Atômicas de Assinaturas](https://github.com/vstabile/nips/blob/atomic-signature-swaps/XX.md), que propõe um padrão para realizar trocas atômicas de assinaturas criptográficas via Nostr.

## ⭐ Recursos

- ✅ Assinaturas adaptadoras Schnorr compatíveis com BIP340
- ✅ Criação de endereços Taproot e gerenciamento de transações
- ✅ Criação e assinatura de eventos Nostr
- ✅ Implementação completa do protocolo de troca atômica
- ✅ Implementação pura em Go

## 🗂️ Estrutura do Projeto

O projeto está organizado nos seguintes pacotes:

```
📦 tanos
 ┣ 📂 pkg/
 ┃ ┣ 📂 adaptor/    # Implementação de assinatura adaptadora usando Schnorr
 ┃ ┣ 📂 bitcoin/    # Funcionalidades relacionadas ao Bitcoin
 ┃ ┣ 📂 crypto/     # Utilitários criptográficos comuns
 ┃ ┣ 📂 nostr/      # Funcionalidades relacionadas ao Nostr
 ┃ ┗ 📂 tanos/      # Implementação do protocolo de troca de alto nível
 ┣ 📂 examples/
 ┃ ┗ 📂 swap/       # Exemplo de implementação de uma troca completa
 ┗ 📂 flash-compliance/ # Serviço SaaS para verificação de trocas atômicas
   ┣ 📂 src/        # Código-fonte do serviço
   ┣ 📂 public/     # Arquivos estáticos para a interface web
   ┗ 📂 bin/        # Binários compilados do verificador TANOS
```

## 🚀 Como Começar

### Pré-requisitos

#### Para TANOS Core
- 🔧 Go 1.24.1 ou superior
- 🔧 Dependências do Bitcoin e Nostr

#### Para Flash Compliance
- 🔧 Node.js 18.x ou superior
- 🔧 Go 1.24.1 ou superior (para o verificador TANOS)
- 🔧 Chave de API do Google Gemini
- 🔧 Docker (opcional, para containerização)

### Instalação

```bash
git clone https://github.com/GustavoStingelin/tanos.git
cd tanos
go mod download
```

### Executando o Exemplo

```bash
go run examples/swap/main.go
```

### Executando o Flash Compliance

```bash
# Instalar dependências
cd flash-compliance
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Compilar o verificador TANOS (necessário Go 1.24.1+)
cd tanos-verifier
go build -o ../bin/tanos-verifier
cd ..

# Iniciar o serviço
npm start
```

O serviço estará disponível em http://localhost:3000.

#### Requisitos para Flash Compliance

- Node.js 18.x ou superior
- Go 1.24.1 ou superior
- Chave de API do Google Gemini (para geração de relatórios)
- Docker (opcional, para implantação containerizada)

#### Implantação com Docker

```bash
# Construir a imagem
docker build -t flash-compliance .

# Executar o contêiner
docker run -p 3000:3000 -e GEMINI_API_KEY=sua_chave_api flash-compliance
```

#### Implantação no Google Cloud Run

```bash
# Construir e enviar a imagem
gcloud builds submit --tag gcr.io/seu-projeto/flash-compliance

# Implantar no Cloud Run
gcloud run deploy flash-compliance \
  --image gcr.io/seu-projeto/flash-compliance \
  --platform managed \
  --set-env-vars GEMINI_API_KEY=sua_chave_api
```

## 🔄 Protocolo de Troca

1. **Configuração Inicial** 🎬
   - Vendedor possui uma chave privada Nostr
   - Comprador possui Bitcoin

2. **Compromisso** 📝
   - Vendedor cria e assina um evento Nostr
   - Vendedor extrai o nonce (R) da assinatura
   - Vendedor calcula o compromisso T = R + e*P

3. **Bloqueio** 🔒
   - Comprador cria uma transação Bitcoin bloqueando fundos em um endereço P2TR
   - Comprador cria uma assinatura adaptadora usando o compromisso T
   - Comprador envia a assinatura adaptadora para o vendedor

4. **Revelação** 🔓
   - Vendedor completa a assinatura adaptadora usando o segredo da assinatura Nostr
   - Vendedor transmite a transação Bitcoin com a assinatura completa

5. **Verificação** ✅
   - Comprador extrai o segredo da assinatura completa
   - Comprador verifica se o segredo corresponde ao da assinatura Nostr

## 🔐 Considerações de Segurança

### Regras de Paridade BIP340

O TANOS implementa cuidadosamente as regras de paridade BIP340 para assinaturas Schnorr:

- 🔸 Assinaturas Schnorr no BIP340 exigem que a coordenada Y do ponto nonce (R) seja par
- 🔸 Quando a coordenada Y é ímpar, o valor 's' da assinatura deve ser negado
- 🔸 Isso afeta como os segredos são extraídos das assinaturas completas

Nossa implementação gerencia automaticamente estes ajustes de paridade, garantindo:
1. Assinaturas Bitcoin válidas de acordo com BIP340
2. Segredos corretamente recuperados das assinaturas, mesmo após ajustes de paridade

### Hashes Marcados

Para maior segurança, a biblioteca utiliza hashes marcados no estilo BIP340 para todos os desafios de assinatura, garantindo que assinaturas de diferentes contextos não possam ser reutilizadas.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para detalhes.

## 🚀 Flash Compliance

O **Flash Compliance** é um serviço SaaS construído sobre o TANOS que oferece verificação de atomicidade e geração de relatórios de conformidade para trocas entre Bitcoin e Nostr. Utilizando a tecnologia de IA generativa do Google Gemini, o serviço produz relatórios detalhados e de alta qualidade para fins regulatórios e de auditoria.

![Flash Compliance](logo.png)

### 🌟 Recursos Principais

- ⚡ **Verificação ultra-rápida** de trocas atômicas Bitcoin-Nostr (< 300ms)
- 📊 **Relatórios de conformidade** gerados com Gemini AI (Flash + Deep Think)
- 🔒 **Prova criptográfica** de atomicidade da transação com validação BIP340
- 📱 **API simples** para integração com sistemas existentes
- 🚀 **Implantação serverless** para escalabilidade e confiabilidade
- 📄 **Exportação de relatórios** em formatos PDF e JSON
- 🔄 **Integração via webhook** para fluxos de trabalho automatizados

### 💰 Planos de Preços

| Plano          | Recursos                                                  | Preço              |
|----------------|----------------------------------------------------------|--------------------|
| **Free Tier**  | • 5 auditorias/mês<br>• Relatórios JSON<br>• API básica   | US$ 0              |
| **Pro**        | • 100 auditorias/mês<br>• Relatórios PDF<br>• Webhook<br>• Armazenamento de provas<br>• Suporte por email | US$ 500/mês        |
| **Enterprise** | • Auditorias ilimitadas<br>• SLAs 24×7<br>• SSO + VPC<br>• White-label<br>• Suporte dedicado<br>• Integrações personalizadas | US$ 2.000-5.000/mês|

**Extras:**
- Auditorias adicionais no plano Pro: US$ 5 por auditoria
- Taxa de configuração para Enterprise (integração SSO, white-label): US$ 10.000

### 🔍 Como Funciona

1. **Verificação de Atomicidade**
   - O serviço recebe uma transação Bitcoin e um evento Nostr
   - O núcleo TANOS verifica a atomicidade criptográfica
   - Extrai provas matemáticas (valores R, s, e, chaves públicas)

2. **Geração de Relatório com IA**
   - Gemini Flash analisa os dados e gera um relatório estruturado
   - Deep Think enriquece com linguagem natural e recomendações
   - O relatório inclui implicações regulatórias e melhores práticas

3. **Entrega e Armazenamento**
   - Relatórios disponíveis via API ou interface web
   - Exportação em PDF para documentação formal
   - Armazenamento seguro em Cloud Storage

### 🖥️ API de Verificação

```http
POST /v1/audit
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "txHex": "0200000001...",
  "nostrEvent": {
    "id": "...",
    "pubkey": "...",
    "created_at": 1234567890,
    "kind": 1,
    "tags": [],
    "content": "...",
    "sig": "..."
  }
}
```

#### Resposta

```json
{
  "success": true,
  "result": true,
  "report": {
    "reportId": "abc123...",
    "timestamp": "2025-05-20T12:34:56.789Z",
    "structuredData": { /* dados detalhados da verificação */ },
    "enhancedReport": {
      "executiveSummary": "Verificação bem-sucedida da troca atômica...",
      "technicalDetails": "A assinatura adaptadora foi validada...",
      "complianceImplications": "Esta troca atende aos requisitos...",
      "recommendations": "Armazene esta prova por pelo menos 7 anos...",
      "auditTrail": "Considere registrar esta verificação..."
    }
  }
}
```

### 📋 Casos de Uso

- **Exchanges de Criptomoedas**: Verificação de conformidade para trocas atômicas
- **Instituições Financeiras**: Documentação regulatória para transações DeFi
- **Auditores**: Evidências criptográficas para relatórios de auditoria
- **Desenvolvedores**: Integração de verificação em aplicações descentralizadas

Para mais informações, consulte a [documentação completa do Flash Compliance](flash-compliance/README.md).

## 🙏 Agradecimentos

### Tecnologias e Padrões
- BIP340 (Assinaturas Schnorr)
- BIP341 (Taproot)
- Protocolo Nostr
- [NIP 455: Trocas Atômicas de Assinaturas](https://github.com/vstabile/nips/blob/atomic-signature-swaps/XX.md)

### Ferramentas e Bibliotecas
- [btcd](https://github.com/btcsuite/btcd) - Implementação Bitcoin em Go
- [go-nostr](https://github.com/nbd-wtf/go-nostr) - Cliente Nostr para Go
- [Express](https://expressjs.com/) - Framework web para Node.js
- [Gemini AI](https://ai.google.dev/) - Modelos de IA generativa do Google

### Eventos e Comunidade
- [MIT Bitcoin Hackathon](https://mitbitcoin.dev/) - Onde o TANOS foi originalmente desenvolvido
- Comunidade Bitcoin e Nostr pelo apoio e feedback

### Contribuidores
- Equipe de desenvolvimento do TANOS
- Revisores e testadores
- Todos que contribuíram com código, ideias e feedback
