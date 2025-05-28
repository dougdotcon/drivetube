import crypto from 'crypto'
import axios from 'axios'

interface CryptoPaymentData {
  amount: number
  description: string
  expirationMinutes?: number
  payerName?: string
  payerEmail?: string
  currency?: 'USDT' | 'BTC' | 'ETH'
  network?: 'BEP20' | 'ERC20' | 'TRC20'
}

interface CryptoPaymentResponse {
  walletAddress: string
  qrCode: string
  txId: string
  expiresAt: Date
  amount: number
  currency: string
  network: string
  expectedAmount: string
  tanosSession?: string
}

export class CryptoPaymentService {
  private readonly walletAddress: string
  private readonly tanosApiUrl: string
  private readonly blockchainApiKey: string
  
  // Taxas de conversão USD para BRL (simuladas - em produção usar API real)
  private readonly usdToBrlRate: number = 5.20

  constructor() {
    this.walletAddress = process.env.CRYPTO_WALLET_ADDRESS || '0xFf83fE987a944CBe235dea1277d0B7D9B7f78424'
    this.tanosApiUrl = process.env.TANOS_API_URL || 'https://api.tanos.dev'
    this.blockchainApiKey = process.env.BLOCKCHAIN_API_KEY || ''
  }

  /**
   * Gera um pagamento em criptomoeda (USDT)
   */
  async generateCryptoPayment(data: CryptoPaymentData): Promise<CryptoPaymentResponse> {
    try {
      // Definir moeda e rede padrão
      const currency = data.currency || 'USDT'
      const network = data.network || 'BEP20'
      
      // Gerar ID único para a transação
      const txId = this.generateTxId()
      
      // Converter valor BRL para USDT
      const usdAmount = data.amount / this.usdToBrlRate
      const expectedAmount = usdAmount.toFixed(6) // USDT tem 6 decimais
      
      // Gerar QR Code para pagamento
      const qrCodeData = this.generateCryptoQRCode({
        address: this.walletAddress,
        amount: expectedAmount,
        currency,
        network,
        memo: `DriveTube-${txId}`
      })

      // Integração com TANOS para segurança adicional
      let tanosSession = null
      try {
        tanosSession = await this.createTanosSession({
          amount: expectedAmount,
          currency,
          network,
          description: data.description,
          txId
        })
      } catch (tanosError) {
        console.warn('TANOS não disponível, usando modo direto:', tanosError)
      }

      return {
        walletAddress: this.walletAddress,
        qrCode: qrCodeData,
        txId,
        expiresAt: new Date(Date.now() + (data.expirationMinutes || 1440) * 60 * 1000),
        amount: data.amount,
        currency,
        network,
        expectedAmount,
        tanosSession: tanosSession?.id
      }
    } catch (error) {
      console.error('Erro ao gerar pagamento crypto:', error)
      
      // Em caso de erro, usar modo simulado
      return this.generateMockCryptoPayment(data)
    }
  }

  /**
   * Verifica o status de um pagamento crypto
   */
  async checkPaymentStatus(txId: string, network: string = 'BEP20'): Promise<'pending' | 'completed' | 'expired'> {
    try {
      // Verificar na blockchain usando API
      const status = await this.checkBlockchainTransaction(txId, network)
      
      if (status) {
        return 'completed'
      }

      // Verificar se expirou (24 horas)
      const createdAt = this.extractTimestampFromTxId(txId)
      const now = Date.now()
      const expirationTime = 24 * 60 * 60 * 1000 // 24 horas
      
      if (now - createdAt > expirationTime) {
        return 'expired'
      }

      return 'pending'
    } catch (error) {
      console.error('Erro ao verificar status do pagamento crypto:', error)
      return 'pending'
    }
  }

  /**
   * Cria uma sessão TANOS para segurança adicional
   */
  private async createTanosSession(data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.tanosApiUrl}/v1/sessions`,
        {
          type: 'crypto_payment',
          amount: data.amount,
          currency: data.currency,
          network: data.network,
          description: data.description,
          txId: data.txId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Erro ao criar sessão TANOS:', error)
      throw error
    }
  }

  /**
   * Gera um ID único para a transação
   */
  private generateTxId(): string {
    const timestamp = Date.now().toString(36)
    const random = crypto.randomBytes(8).toString('hex')
    return `DT${timestamp}${random}`.toUpperCase()
  }

  /**
   * Gera QR Code para pagamento crypto
   */
  private generateCryptoQRCode(data: {
    address: string
    amount: string
    currency: string
    network: string
    memo: string
  }): string {
    // Formato padrão para QR codes de criptomoeda
    const qrData = {
      address: data.address,
      amount: data.amount,
      currency: data.currency,
      network: data.network,
      memo: data.memo
    }
    
    // Em produção, usar uma biblioteca de QR code real
    return `data:image/png;base64,${Buffer.from(JSON.stringify(qrData)).toString('base64')}`
  }

  /**
   * Verifica transação na blockchain
   */
  private async checkBlockchainTransaction(txId: string, network: string): Promise<boolean> {
    try {
      // Simular verificação na blockchain
      // Em produção, usar APIs como BSCScan, Etherscan, etc.
      
      if (!this.blockchainApiKey) {
        // Modo simulado
        return false
      }

      let apiUrl = ''
      switch (network) {
        case 'BEP20':
          apiUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${this.walletAddress}&apikey=${this.blockchainApiKey}`
          break
        case 'ERC20':
          apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${this.walletAddress}&apikey=${this.blockchainApiKey}`
          break
        default:
          return false
      }

      const response = await axios.get(apiUrl)
      const transactions = response.data.result || []
      
      // Verificar se existe transação com o memo/txId
      return transactions.some((tx: any) => 
        tx.input && tx.input.includes(txId)
      )
    } catch (error) {
      console.error('Erro ao verificar blockchain:', error)
      return false
    }
  }

  /**
   * Extrai timestamp do txId
   */
  private extractTimestampFromTxId(txId: string): number {
    try {
      // Extrair timestamp do formato DT{timestamp}{random}
      const timestampPart = txId.substring(2, 10) // Remove 'DT' e pega os próximos 8 chars
      return parseInt(timestampPart, 36)
    } catch (error) {
      return Date.now() // Fallback para agora
    }
  }

  /**
   * Gera um pagamento crypto simulado para desenvolvimento/teste
   */
  private generateMockCryptoPayment(data: CryptoPaymentData): CryptoPaymentResponse {
    const txId = this.generateTxId()
    const currency = data.currency || 'USDT'
    const network = data.network || 'BEP20'
    
    // Converter valor BRL para USDT
    const usdAmount = data.amount / this.usdToBrlRate
    const expectedAmount = usdAmount.toFixed(6)
    
    // Gerar QR Code simulado
    const qrCode = this.generateCryptoQRCode({
      address: this.walletAddress,
      amount: expectedAmount,
      currency,
      network,
      memo: `DriveTube-${txId}`
    })
    
    return {
      walletAddress: this.walletAddress,
      qrCode,
      txId,
      expiresAt: new Date(Date.now() + (data.expirationMinutes || 1440) * 60 * 1000),
      amount: data.amount,
      currency,
      network,
      expectedAmount
    }
  }

  /**
   * Valida endereço de wallet
   */
  static validateWalletAddress(address: string, network: string = 'BEP20'): boolean {
    // Validação básica para endereços Ethereum/BSC
    if (network === 'BEP20' || network === 'ERC20') {
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    }
    
    // Adicionar validações para outras redes conforme necessário
    return false
  }

  /**
   * Formata valor em USDT para exibição
   */
  static formatUSDT(amount: string): string {
    const num = parseFloat(amount)
    return `${num.toFixed(6)} USDT`
  }

  /**
   * Converte BRL para USDT usando taxa atual
   */
  convertBrlToUsdt(brlAmount: number): number {
    return brlAmount / this.usdToBrlRate
  }

  /**
   * Converte USDT para BRL usando taxa atual
   */
  convertUsdtToBrl(usdtAmount: number): number {
    return usdtAmount * this.usdToBrlRate
  }

  /**
   * Obtém informações sobre redes suportadas
   */
  static getSupportedNetworks(): Array<{
    name: string
    code: string
    currency: string
    decimals: number
    blockTime: number
  }> {
    return [
      {
        name: 'Binance Smart Chain',
        code: 'BEP20',
        currency: 'USDT',
        decimals: 6,
        blockTime: 3 // segundos
      },
      {
        name: 'Ethereum',
        code: 'ERC20',
        currency: 'USDT',
        decimals: 6,
        blockTime: 15 // segundos
      }
    ]
  }
}
