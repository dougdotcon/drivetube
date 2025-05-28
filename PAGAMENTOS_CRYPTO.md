# 💰 Sistema de Pagamentos Crypto - DriveTube

## 🔐 Integração com TANOS

O DriveTube utiliza a tecnologia **TANOS** (Adaptador Taproot para Trocas Orquestradas por Nostr) para garantir pagamentos seguros em criptomoedas.

### 🎯 Características Principais

- **Moeda**: USDT (Tether USD)
- **Redes Suportadas**: 
  - BEP20 (Binance Smart Chain) - **Padrão**
  - ERC20 (Ethereum)
- **Wallet de Recebimento**: `0xFf83fE987a944CBe235dea1277d0B7D9B7f78424`
- **Segurança**: Integração com TANOS para trocas atômicas

## 🔄 Fluxo de Pagamento

### 1. Criação da Assinatura
```typescript
// O usuário seleciona um plano
const subscription = await createSubscription({
  planId: "plan_premium_monthly",
  userId: "user_123"
})
```

### 2. Geração do Pagamento Crypto
```typescript
const cryptoPayment = await cryptoService.generateCryptoPayment({
  amount: 29.90, // Valor em BRL
  description: "Assinatura Premium - DriveTube",
  currency: "USDT",
  network: "BEP20",
  expirationMinutes: 1440 // 24 horas
})

// Retorna:
{
  walletAddress: "0xFf83fE987a944CBe235dea1277d0B7D9B7f78424",
  expectedAmount: "5.750000", // USDT (BRL convertido)
  qrCode: "data:image/png;base64...", // QR Code para pagamento
  txId: "DT1A2B3C4D5E6F7G8H9I",
  expiresAt: "2024-01-15T23:59:59Z",
  currency: "USDT",
  network: "BEP20"
}
```

### 3. Conversão de Moeda
- **Taxa de Conversão**: 1 USD = 5.20 BRL (configurável)
- **Exemplo**: Plano de R$ 29,90 = ~5.75 USDT

### 4. Verificação de Pagamento
```typescript
const status = await cryptoService.checkPaymentStatus(txId, "BEP20")
// Retorna: 'pending' | 'completed' | 'expired'
```

## 🛡️ Segurança com TANOS

### Trocas Atômicas
- **Princípio**: "Tudo ou Nada" - o pagamento só é confirmado se a assinatura for ativada
- **Tecnologia**: Assinaturas adaptadoras Schnorr + Taproot
- **Benefício**: Impossível perder dinheiro ou não receber o serviço

### Verificação Blockchain
```typescript
// Verificação automática nas redes
- BSC Scan API para BEP20
- Etherscan API para ERC20
- Confirmação de transação com memo específico
```

## 📱 Interface do Usuário

### Tela de Pagamento
```jsx
<PaymentScreen>
  <WalletInfo>
    <Address>0xFf83fE987a944CBe235dea1277d0B7D9B7f78424</Address>
    <Amount>5.750000 USDT</Amount>
    <Network>BEP20 (Binance Smart Chain)</Network>
  </WalletInfo>
  
  <QRCode src={qrCodeData} />
  
  <Instructions>
    1. Abra sua carteira crypto
    2. Escaneie o QR Code ou copie o endereço
    3. Envie exatamente 5.750000 USDT via BEP20
    4. Aguarde a confirmação (1-3 minutos)
  </Instructions>
  
  <Timer expiresAt={expirationTime} />
</PaymentScreen>
```

### Estados do Pagamento
- **Pending**: Aguardando pagamento
- **Completed**: Pagamento confirmado, assinatura ativada
- **Expired**: Tempo limite excedido (24 horas)

## 🔧 Configuração Técnica

### Variáveis de Ambiente
```bash
# Wallet para recebimento
CRYPTO_WALLET_ADDRESS="0xFf83fE987a944CBe235dea1277d0B7D9B7f78424"

# API TANOS para segurança
TANOS_API_URL="https://api.tanos.dev"

# APIs de verificação blockchain
BSC_SCAN_API_KEY="your_bscscan_api_key"
ETHERSCAN_API_KEY="your_etherscan_api_key"
```

### Estrutura do Banco de Dados
```sql
-- Tabela de pagamentos atualizada
ALTER TABLE payments ADD COLUMN network VARCHAR(10) DEFAULT 'BEP20';
ALTER TABLE payments ADD COLUMN currency VARCHAR(10) DEFAULT 'USDT';
ALTER TABLE payments ADD COLUMN expected_amount DECIMAL(18,6);
ALTER TABLE payments MODIFY COLUMN payment_method ENUM('crypto', 'pix') DEFAULT 'crypto';
```

## 🌐 Redes Suportadas

### BEP20 (Binance Smart Chain) - **Recomendado**
- **Taxa de Transação**: ~$0.20
- **Tempo de Confirmação**: 1-3 minutos
- **Estabilidade**: Alta
- **Liquidez**: Excelente

### ERC20 (Ethereum)
- **Taxa de Transação**: $5-50 (variável)
- **Tempo de Confirmação**: 2-15 minutos
- **Estabilidade**: Muito Alta
- **Liquidez**: Máxima

## 📊 Monitoramento e Analytics

### Métricas Importantes
```typescript
// Conversões por rede
const networkStats = {
  BEP20: { conversions: 85, avgTime: "2.3min" },
  ERC20: { conversions: 15, avgTime: "8.1min" }
}

// Taxa de conversão
const conversionRate = {
  initiated: 100,
  completed: 87,
  expired: 13,
  rate: "87%"
}
```

### Alertas Automáticos
- Pagamento recebido → Ativar assinatura
- Pagamento expirado → Notificar usuário
- Erro na verificação → Alerta para suporte

## 🚀 Próximas Melhorias

### Curto Prazo
- [ ] Suporte a TRC20 (TRON)
- [ ] Webhook para confirmações instantâneas
- [ ] Interface mobile otimizada

### Médio Prazo
- [ ] Suporte a outras stablecoins (USDC, BUSD)
- [ ] Pagamentos recorrentes automáticos
- [ ] Integração com carteiras populares (MetaMask, Trust Wallet)

### Longo Prazo
- [ ] Lightning Network para Bitcoin
- [ ] Pagamentos em outras criptomoedas
- [ ] Sistema de cashback em tokens próprios

## 📞 Suporte

### Para Usuários
- **Telegram**: t.me/trydrivetube
- **Email**: suporte@drivetube.com.br
- **Tempo de Resposta**: 2-4 horas

### Para Desenvolvedores
- **Documentação TANOS**: [GitHub](https://github.com/GustavoStingelin/tanos)
- **API Reference**: `/docs/api`
- **Exemplos de Código**: `/examples`

## ⚠️ Importante

1. **Sempre use a rede correta** (BEP20 ou ERC20)
2. **Envie o valor exato** em USDT
3. **Não envie outras moedas** para este endereço
4. **Guarde o txId** para rastreamento
5. **Pagamentos têm prazo de 24 horas**

---

*Sistema desenvolvido com tecnologia TANOS para máxima segurança e confiabilidade.*
