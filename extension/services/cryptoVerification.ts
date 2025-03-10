import { Plan } from '../config/plans';

interface TransactionVerification {
    isValid: boolean;
    message: string;
    amount?: number;
    currency?: string;
}

export class CryptoVerificationService {
    private static readonly API_ENDPOINTS = {
        BNB: 'https://api.bscscan.com/api',
        ETH: 'https://api.etherscan.io/api',
        BTC: 'https://blockchain.info/rawtx/',
        USDT: 'https://api.trongrid.io/v1/transactions/',
        QANX: 'https://api.qanx.com/v1/transactions/',
        RON: 'https://api.roninchain.com/v1/transactions/'
    };

    private static readonly API_KEYS = {
        BNB: process.env.BSCSCAN_API_KEY,
        ETH: process.env.ETHERSCAN_API_KEY
    };

    public static async verifyTransaction(
        plan: Plan,
        hash: string,
        currency: string
    ): Promise<TransactionVerification> {
        try {
            const endpoint = this.API_ENDPOINTS[currency];
            if (!endpoint) {
                return {
                    isValid: false,
                    message: 'Moeda não suportada'
                };
            }

            const response = await fetch(`${endpoint}${hash}`, {
                headers: {
                    'Accept': 'application/json',
                    ...(this.API_KEYS[currency] && { 'Authorization': `Bearer ${this.API_KEYS[currency]}` })
                }
            });

            if (!response.ok) {
                return {
                    isValid: false,
                    message: 'Erro ao verificar transação'
                };
            }

            const data = await response.json();
            const verification = await this.validateTransaction(data, plan, currency);

            if (verification.isValid) {
                // Registrar a transação no backend
                await this.registerTransaction({
                    hash,
                    planId: plan.id,
                    currency,
                    amount: verification.amount,
                    userId: await this.getCurrentUserId()
                });
            }

            return verification;
        } catch (error) {
            console.error('Erro na verificação:', error);
            return {
                isValid: false,
                message: 'Erro ao processar verificação'
            };
        }
    }

    private static async validateTransaction(
        data: any,
        plan: Plan,
        currency: string
    ): Promise<TransactionVerification> {
        const targetAddress = plan.cryptoAddresses[currency];
        const requiredAmount = this.getRequiredAmount(plan.priceUSD, currency);

        switch (currency) {
            case 'BNB':
            case 'ETH':
                return this.validateEVMTransaction(data, targetAddress, requiredAmount);
            case 'BTC':
                return this.validateBitcoinTransaction(data, targetAddress, requiredAmount);
            case 'USDT':
                return this.validateUSDTTransaction(data, targetAddress, requiredAmount);
            case 'QANX':
                return this.validateQANXTransaction(data, targetAddress, requiredAmount);
            case 'RON':
                return this.validateRONTransaction(data, targetAddress, requiredAmount);
            default:
                return {
                    isValid: false,
                    message: 'Moeda não suportada'
                };
        }
    }

    private static validateEVMTransaction(
        data: any,
        targetAddress: string,
        requiredAmount: number
    ): TransactionVerification {
        if (!data.result || data.result.length === 0) {
            return {
                isValid: false,
                message: 'Transação não encontrada'
            };
        }

        const tx = data.result[0];
        const isConfirmed = parseInt(tx.confirmations) > 12;
        const isToCorrectAddress = tx.to.toLowerCase() === targetAddress.toLowerCase();
        const amount = parseFloat(tx.value) / 1e18;

        return {
            isValid: isConfirmed && isToCorrectAddress && amount >= requiredAmount,
            message: isConfirmed ? 'Transação confirmada' : 'Aguardando confirmações',
            amount,
            currency: 'BNB'
        };
    }

    private static validateBitcoinTransaction(
        data: any,
        targetAddress: string,
        requiredAmount: number
    ): TransactionVerification {
        if (!data.confirmations || data.confirmations < 6) {
            return {
                isValid: false,
                message: 'Aguardando confirmações'
            };
        }

        const outputs = data.out || [];
        const correctOutput = outputs.find((out: any) => 
            out.addr === targetAddress && 
            out.value >= requiredAmount
        );

        return {
            isValid: !!correctOutput,
            message: correctOutput ? 'Transação confirmada' : 'Valor insuficiente',
            amount: correctOutput ? correctOutput.value : 0,
            currency: 'BTC'
        };
    }

    private static validateUSDTTransaction(
        data: any,
        targetAddress: string,
        requiredAmount: number
    ): TransactionVerification {
        // Implementar validação específica para USDT
        return {
            isValid: false,
            message: 'Validação USDT não implementada'
        };
    }

    private static validateQANXTransaction(
        data: any,
        targetAddress: string,
        requiredAmount: number
    ): TransactionVerification {
        // Implementar validação específica para QANX
        return {
            isValid: false,
            message: 'Validação QANX não implementada'
        };
    }

    private static validateRONTransaction(
        data: any,
        targetAddress: string,
        requiredAmount: number
    ): TransactionVerification {
        // Implementar validação específica para RON
        return {
            isValid: false,
            message: 'Validação RON não implementada'
        };
    }

    private static getRequiredAmount(usdAmount: number, currency: string): number {
        // Implementar conversão de USD para a moeda específica
        // Usar APIs de preço em tempo real
        return usdAmount;
    }

    private static async getCurrentUserId(): Promise<string> {
        const auth = await chrome.storage.local.get('userId');
        return auth.userId;
    }

    private static async registerTransaction(transaction: {
        hash: string;
        planId: string;
        currency: string;
        amount: number;
        userId: string;
    }): Promise<void> {
        try {
            await fetch('http://localhost:3333/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAccessToken()}`
                },
                body: JSON.stringify(transaction)
            });
        } catch (error) {
            console.error('Erro ao registrar transação:', error);
        }
    }

    private static async getAccessToken(): Promise<string> {
        const auth = await chrome.storage.local.get('accessToken');
        return auth.accessToken;
    }
} 