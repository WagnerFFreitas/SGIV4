
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Member, Payroll, Transaction, FinancialAccount, Unit, Asset, EmployeeLeave } from '../types';
import { MOCK_UNITS, MOCK_MEMBERS, MOCK_TRANSACTIONS, MOCK_ACCOUNTS } from '../constants';

// O Supabase URL e Anon Key devem ser fornecidos no ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Inicialização segura: evita crash se as chaves não existirem
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export class DatabaseService {
  private isConfigured(): boolean {
    return !!supabase;
  }

  // Unidades
  async getUnits(): Promise<Unit[]> {
    if (!this.isConfigured()) {
      console.info("ADJPA ERP: Usando modo de demonstração (Unidades)");
      return MOCK_UNITS;
    }
    const { data, error } = await supabase!.from('units').select('*');
    if (error) throw error;
    return data || [];
  }

  // Membros
  async getMembers(unitId?: string): Promise<Member[]> {
    if (!this.isConfigured()) {
      console.info("ADJPA ERP: Usando modo de demonstração (Membros)");
      return MOCK_MEMBERS.filter(m => !unitId || m.unitId === unitId);
    }
    let query = supabase!.from('members').select('*');
    if (unitId) query = query.eq('unit_id', unitId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async saveMember(member: Partial<Member>): Promise<void> {
    if (!this.isConfigured()) {
      console.warn("Supabase não configurado. Alteração não persistida na nuvem.");
      return;
    }
    const { error } = await supabase!.from('members').upsert(member);
    if (error) throw error;
  }

  // Financeiro
  async getTransactions(unitId?: string): Promise<Transaction[]> {
    if (!this.isConfigured()) {
      console.info("ADJPA ERP: Usando modo de demonstração (Financeiro)");
      return MOCK_TRANSACTIONS.filter(t => !unitId || t.unitId === unitId);
    }
    let query = supabase!.from('transactions').select('*');
    if (unitId) query = query.eq('unit_id', unitId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async saveTransaction(transaction: Partial<Transaction>): Promise<void> {
    if (!this.isConfigured()) return;
    const { error } = await supabase!.from('transactions').upsert(transaction);
    if (error) throw error;
  }

  // Contas
  async getAccounts(unitId?: string): Promise<FinancialAccount[]> {
    if (!this.isConfigured()) {
      return MOCK_ACCOUNTS.filter(a => !unitId || a.unitId === unitId);
    }
    let query = supabase!.from('accounts').select('*');
    if (unitId) query = query.eq('unit_id', unitId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const dbService = new DatabaseService();
