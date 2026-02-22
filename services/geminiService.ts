
import { GoogleGenAI } from "@google/genai";

interface CacheEntry {
  response: string;
  timestamp: number;
}

export class GeminiService {
  private readonly CACHE_KEY_PREFIX = 'adjpa_gemini_cache_';
  private readonly BLOCKED_KEY = 'adjpa_gemini_blocked_until';
  private readonly CACHE_EXPIRATION = 1000 * 60 * 60 * 4; // 4 horas

  constructor() {}

  private getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  public getBlockedTimeRemaining(): number {
    const blockedUntil = Number(sessionStorage.getItem(this.BLOCKED_KEY) || 0);
    const now = Date.now();
    return Math.max(0, Math.ceil((blockedUntil - now) / 1000));
  }

  public isQuotaBlocked(): boolean {
    return this.getBlockedTimeRemaining() > 0;
  }

  private setQuotaBlock(seconds: number = 60) {
    const until = Date.now() + (seconds * 1000);
    sessionStorage.setItem(this.BLOCKED_KEY, until.toString());
  }

  private wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async callWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
    const remaining = this.getBlockedTimeRemaining();
    if (remaining > 0) {
      throw { status: 429, message: `Cota excedida. Tente em ${remaining}s.` };
    }

    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        const status = error?.status || 
                       error?.error?.code || 
                       (error?.message?.includes('429') ? 429 : 0);
        
        if (status === 429) {
          // Bloqueio progressivo: 1min, depois 3min, etc.
          this.setQuotaBlock(60 * (i + 1)); 
          const delay = Math.pow(2, i) * 2000 + Math.random() * 1000;
          console.warn(`[Gemini] Cota 429 detectada. Tentativa ${i + 1}/${maxRetries}. Bloqueio ativado.`);
          if (i < maxRetries - 1) {
            await this.wait(delay);
            continue;
          }
        }
        throw error;
      }
    }
    throw lastError;
  }

  private handleApiError(error: any): string {
    const message = error?.message || "";
    const code = error?.status || error?.error?.code || (message.includes('429') ? 429 : 0);

    if (code === 429 || message.includes('quota') || message.includes('limit')) {
      const remaining = this.getBlockedTimeRemaining();
      return `LIMITE_EXCEDIDO: O limite de uso gratuito foi atingido. Sistema em modo de espera (${remaining || 60}s).`;
    }
    
    if (code === 401 || code === 403 || message.includes('API_KEY_INVALID')) {
      return "ERRO_AUTENTICACAO: Chave de API inválida ou sem permissão.";
    }

    return `ERRO_GENERICO: Serviço de IA temporariamente indisponível (Erro ${code || 'Desconhecido'}).`;
  }

  private getPersistentCache(key: string): string | null {
    try {
      const stored = sessionStorage.getItem(this.CACHE_KEY_PREFIX + key);
      if (!stored) return null;
      const entry: CacheEntry = JSON.parse(stored);
      if (Date.now() - entry.timestamp > this.CACHE_EXPIRATION) {
        sessionStorage.removeItem(this.CACHE_KEY_PREFIX + key);
        return null;
      }
      return entry.response;
    } catch {
      return null;
    }
  }

  private setPersistentCache(key: string, response: string) {
    try {
      const entry: CacheEntry = { response, timestamp: Date.now() };
      sessionStorage.setItem(this.CACHE_KEY_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      console.warn("Erro ao salvar cache persistente:", e);
    }
  }

  private getCacheKey(method: string, data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return `${method}_${hash}`;
  }

  async analyzeChurchHealth(data: any) {
    const cacheKey = this.getCacheKey('analyzeChurchHealth', data);
    const cached = this.getPersistentCache(cacheKey);

    if (cached) return cached;

    const ai = this.getClient();
    if (!ai) return "ERRO_CONFIGURACAO: API Key não configurada.";

    const prompt = `Como um consultor especializado em crescimento de igrejas, analise os seguintes dados e forneça 3 insights estratégicos curtos (máximo 2 frases cada) em português:
    Membros: ${data.totalMembers}
    Ativos: ${data.activeMembers}
    Receita: R$ ${data.monthlyRevenue}
    Despesas: R$ ${data.monthlyExpenses}`;

    try {
      const result = await this.callWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
        return response.text || "Sem insights disponíveis no momento.";
      });

      if (result && !result.includes('LIMITE_EXCEDIDO') && !result.includes('ERRO_')) {
        this.setPersistentCache(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async generatePastoralResponse(topic: string) {
    const ai = this.getClient();
    if (!ai) return "ERRO_CONFIGURACAO: API Key não encontrada.";

    try {
      return await this.callWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Escreva um curto devocional ou mensagem pastoral sobre o tema: ${topic}. Seja encorajador e bíblico. Use um tom acolhedor em português.`,
        });
        return response.text || "Não foi possível gerar a mensagem pastoral.";
      }, 1);
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

export const geminiService = new GeminiService();
