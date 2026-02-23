
import { Member, Transaction, ChurchEvent, Payroll, FinancialAccount, AuditLog, TaxConfig, Unit, Asset, EmployeeLeave } from './types';

export const MOCK_UNITS: Unit[] = [
  { id: 'u-sede', name: 'ADJPA - Sede Mundial', cnpj: '00.123.456/0001-99', address: 'Rua das Nações, 1000', city: 'São Paulo', state: 'SP', isHeadquarter: true },
  { id: 'u-filial1', name: 'ADJPA - Unidade Leste', cnpj: '00.123.456/0002-88', address: 'Av. Brasil, 500', city: 'São Paulo', state: 'SP', isHeadquarter: false },
];

export const MOCK_MEMBERS: Member[] = [
  { 
    id: 'M1', 
    unitId: 'u-sede', 
    name: 'Ricardo Alcantara Lima', 
    cpf: '123.456.789-10', 
    rg: '12.345.678-1', 
    email: 'ricardo@email.com', 
    phone: '(11) 98888-1111', 
    role: 'LEADER', 
    status: 'ACTIVE', 
    birthDate: '1980-05-14', 
    gender: 'M', 
    maritalStatus: 'MARRIED', 
    ecclesiasticalPosition: 'Presbítero', 
    fatherName: 'Manoel Alcantara', 
    motherName: 'Maria José de Lima', 
    bloodType: 'A+', 
    emergencyContact: '(11) 97777-6666 (Esposa)', 
    baptismDate: '1998-10-12', 
    isTithable: true, 
    isRegularGiver: true, 
    participatesCampaigns: true, 
    contributions: [], 
    address: { zipCode: '01234-567', street: 'Rua Principal', number: '100', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }, 
    avatar: 'https://ui-avatars.com/api/?name=Ricardo+Alcantara&background=003399&color=fff&bold=true',
    tags: ['Liderança', 'Dizimista Fiel']
  },
  { 
    id: 'M2', 
    unitId: 'u-sede', 
    name: 'Cláudia Regina Souza Oliveira', 
    cpf: '222.333.444-55', 
    rg: '22.333.444-2', 
    email: 'claudia@email.com', 
    phone: '(11) 98888-2222', 
    role: 'VOLUNTEER', 
    status: 'ACTIVE', 
    birthDate: '1985-08-20', 
    gender: 'F', 
    maritalStatus: 'MARRIED', 
    ecclesiasticalPosition: 'Diaconisa', 
    fatherName: 'Antônio de Souza', 
    motherName: 'Regina Oliveira Souza', 
    bloodType: 'O-', 
    emergencyContact: '(11) 95555-4444 (Irmã)', 
    baptismDate: '2005-01-15', 
    isTithable: true, 
    isRegularGiver: true, 
    participatesCampaigns: false, 
    contributions: [], 
    address: { zipCode: '04567-890', street: 'Rua das Palmeiras', number: '250', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' }, 
    avatar: 'https://ui-avatars.com/api/?name=Claudia+Regina&background=003399&color=fff&bold=true',
    tags: ['Intercessão', 'Visitante Frequente']
  },
  { 
    id: 'M3', 
    unitId: 'u-sede', 
    name: 'Marcos Vinicius Silva', 
    cpf: '333.444.555-66', 
    rg: '33.444.555-3', 
    email: 'marcos@email.com', 
    phone: '(11) 98888-3333', 
    role: 'MEMBER', 
    status: 'ACTIVE', 
    birthDate: '1992-03-10', 
    gender: 'M', 
    maritalStatus: 'SINGLE', 
    ecclesiasticalPosition: 'Membro', 
    fatherName: 'Carlos Silva', 
    motherName: 'Sônia Vinicius Silva', 
    bloodType: 'B+', 
    emergencyContact: '(11) 93333-2222 (Mãe)', 
    baptismDate: '2015-06-22', 
    isTithable: true, 
    isRegularGiver: false, 
    participatesCampaigns: true, 
    contributions: [], 
    address: { zipCode: '01234-000', street: 'Av. Paulista', number: '1500', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP' }, 
    avatar: 'https://ui-avatars.com/api/?name=Marcos+Vinicius&background=003399&color=fff&bold=true'
  },
  { 
    id: 'M4', 
    unitId: 'u-sede', 
    name: 'Ana Beatriz Costa', 
    cpf: '444.555.666-77', 
    rg: '44.555.666-4', 
    email: 'ana.beatriz@email.com', 
    phone: '(11) 98888-4444', 
    role: 'MEMBER', 
    status: 'ACTIVE', 
    birthDate: '1995-11-05', 
    gender: 'F', 
    maritalStatus: 'SINGLE', 
    ecclesiasticalPosition: 'Membro', 
    fatherName: 'João Costa', 
    motherName: 'Maria Costa', 
    bloodType: 'AB+', 
    emergencyContact: '(11) 94444-3333 (Pai)', 
    baptismDate: '2018-04-10', 
    isTithable: true, 
    isRegularGiver: true, 
    participatesCampaigns: true, 
    contributions: [], 
    address: { zipCode: '05678-123', street: 'Rua das Flores', number: '42', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP' }, 
    avatar: 'https://ui-avatars.com/api/?name=Ana+Beatriz&background=003399&color=fff&bold=true'
  },
  { 
    id: 'M5', 
    unitId: 'u-filial1', 
    name: 'Paulo Roberto Almeida', 
    cpf: '555.666.777-88', 
    rg: '55.666.777-5', 
    email: 'paulo.roberto@email.com', 
    phone: '(11) 98888-5555', 
    role: 'LEADER', 
    status: 'ACTIVE', 
    birthDate: '1975-02-28', 
    gender: 'M', 
    maritalStatus: 'MARRIED', 
    ecclesiasticalPosition: 'Pastor Auxiliar', 
    fatherName: 'José Almeida', 
    motherName: 'Lúcia Almeida', 
    bloodType: 'O+', 
    emergencyContact: '(11) 95555-4444 (Esposa)', 
    baptismDate: '1990-09-07', 
    isTithable: true, 
    isRegularGiver: true, 
    participatesCampaigns: true, 
    contributions: [], 
    address: { zipCode: '08901-234', street: 'Av. das Américas', number: '1000', neighborhood: 'Barra', city: 'São Paulo', state: 'SP' }, 
    avatar: 'https://ui-avatars.com/api/?name=Paulo+Roberto&background=003399&color=fff&bold=true'
  },
  { 
    id: 'M6', 
    unitId: 'u-filial1', 
    name: 'Juliana Martins Ferreira', 
    cpf: '666.777.888-99', 
    rg: '66.777.888-6', 
    email: 'juliana.martins@email.com', 
    phone: '(11) 98888-6666', 
    role: 'VOLUNTEER', 
    status: 'ACTIVE', 
    birthDate: '1988-07-15', 
    gender: 'F', 
    maritalStatus: 'DIVORCED', 
    ecclesiasticalPosition: 'Líder de Louvor', 
    fatherName: 'Roberto Ferreira', 
    motherName: 'Sandra Martins', 
    bloodType: 'A-', 
    emergencyContact: '(11) 96666-5555 (Mãe)', 
    baptismDate: '2008-11-20', 
    isTithable: true, 
    isRegularGiver: true, 
    participatesCampaigns: false, 
    contributions: [], 
    address: { zipCode: '09012-345', street: 'Rua do Sol', number: '77', neighborhood: 'Vila Madalena', city: 'São Paulo', state: 'SP' }, 
    avatar: 'https://ui-avatars.com/api/?name=Juliana+Martins&background=003399&color=fff&bold=true'
  }
];

export const MOCK_PAYROLL: Payroll[] = [
  { 
    id: 'p1', unitId: 'u-sede', matricula: '2024001', employeeName: 'Jefferson Araújo', email: 'jefferson@adjpa.com.br', cpf: '111.222.333-44', rg: '11.222.333-1', pis: '123.45678.90-1', ctps: '12345/001', cargo: 'Pastor Presidente', funcao: 'Gestão Eclesiástica', departamento: 'Eclesiástico', cbo: '2631-05', data_admissao: '2010-01-01', birthDate: '1970-04-12', tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL', salario_base: 8500, tipo_salario: 'MENSAL', he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0, insalubridade_grau: 'NONE', periculosidade_ativo: false, comissoes: 0, gratificacoes: 1000, premios: 0, ats_percentual: 10, auxilio_moradia: 1500, arredondamento: 0, dependentes_qtd: 0, is_pcd: false, tipo_deficiencia: '', banco: 'Bradesco', codigo_banco: '237', agencia: '1234', conta: '55667-8', tipo_conta: 'CORRENTE', titular: 'Jefferson Araújo', chave_pix: '111.222.333-44', vt_ativo: false, vale_transporte_total: 0, va_ativo: true, vale_alimentacao: 800, vr_ativo: true, vale_refeicao: 600, ps_ativo: true, plano_saude_colaborador: 500, po_ativo: false, plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 50, faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0, consignado: 0, outros_descontos: 0, coparticipacoes: 0, inss: 900, fgts_retido: 680, irrf: 1200, fgts_patronal: 680, inss_patronal: 1700, rat: 100, terceiros: 100, month: '05', year: '2024', total_proventos: 11000, total_descontos: 2100, salario_liquido: 8900, status: 'ACTIVE', address: { zipCode: '01234-567', street: 'Rua das Graças', number: '1', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }
  },
  { 
    id: 'p2', unitId: 'u-sede', matricula: '2024002', employeeName: 'Luciana Silva Oliveira', email: 'luciana@adjpa.com.br', cpf: '222.333.444-55', rg: '22.333.444-2', pis: '234.56789.01-2', ctps: '23456/002', cargo: 'Secretária Executiva', funcao: 'Administração', departamento: 'Administrativo', cbo: '2523-05', data_admissao: '2015-03-15', birthDate: '1985-08-20', tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL', salario_base: 3500, tipo_salario: 'MENSAL', he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0, insalubridade_grau: 'NONE', periculosidade_ativo: false, comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 5, auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 1, is_pcd: false, tipo_deficiencia: '', banco: 'Itaú', codigo_banco: '341', agencia: '5678', conta: '12345-6', tipo_conta: 'CORRENTE', titular: 'Luciana Silva Oliveira', chave_pix: '222.333.444-55', vt_ativo: true, vale_transporte_total: 200, va_ativo: true, vale_alimentacao: 600, vr_ativo: true, vale_refeicao: 400, ps_ativo: true, plano_saude_colaborador: 300, po_ativo: true, plano_saude_dependentes: 150, vale_farmacia: 0, seguro_vida: 30, faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0, consignado: 0, outros_descontos: 0, coparticipacoes: 0, inss: 350, fgts_retido: 280, irrf: 150, fgts_patronal: 280, inss_patronal: 700, rat: 50, terceiros: 50, month: '05', year: '2024', total_proventos: 3675, total_descontos: 1030, salario_liquido: 2645, status: 'ACTIVE', address: { zipCode: '04567-890', street: 'Rua das Palmeiras', number: '250', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' }
  },
  { 
    id: 'p3', unitId: 'u-sede', matricula: '2024003', employeeName: 'Carlos Eduardo Santos', email: 'carlos@adjpa.com.br', cpf: '333.444.555-66', rg: '33.444.555-3', pis: '345.67890.12-3', ctps: '34567/003', cargo: 'Zelador', funcao: 'Manutenção', departamento: 'Patrimônio', cbo: '5141-20', data_admissao: '2018-07-10', birthDate: '1978-11-25', tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL', salario_base: 2200, tipo_salario: 'MENSAL', he50_qtd: 10, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0, insalubridade_grau: 'LOW', periculosidade_ativo: false, comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0, auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 2, is_pcd: false, tipo_deficiencia: '', banco: 'Caixa', codigo_banco: '104', agencia: '9012', conta: '34567-8', tipo_conta: 'POUPANCA', titular: 'Carlos Eduardo Santos', chave_pix: '333.444.555-66', vt_ativo: true, vale_transporte_total: 150, va_ativo: true, vale_alimentacao: 500, vr_ativo: false, vale_refeicao: 0, ps_ativo: false, plano_saude_colaborador: 0, po_ativo: false, plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 20, faltas: 0, atrasos: 0, adiantamento: 500, pensao_alimenticia: 0, consignado: 0, outros_descontos: 0, coparticipacoes: 0, inss: 200, fgts_retido: 176, irrf: 0, fgts_patronal: 176, inss_patronal: 440, rat: 30, terceiros: 30, month: '05', year: '2024', total_proventos: 2532, total_descontos: 870, salario_liquido: 1662, status: 'ACTIVE', address: { zipCode: '01234-000', street: 'Av. Paulista', number: '1500', neighborhood: 'Jardins', city: 'São Paulo', state: 'SP' }
  },
  { 
    id: 'p4', unitId: 'u-sede', matricula: '2024004', employeeName: 'Mariana Costa', email: 'mariana@adjpa.com.br', cpf: '444.555.666-77', rg: '44.555.666-4', pis: '456.78901.23-4', ctps: '45678/004', cargo: 'Assistente Financeiro', funcao: 'Finanças', departamento: 'Financeiro', cbo: '4131-10', data_admissao: '2020-02-01', birthDate: '1990-05-18', tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'HIBRIDO', salario_base: 3000, tipo_salario: 'MENSAL', he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0, insalubridade_grau: 'NONE', periculosidade_ativo: false, comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0, auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 0, is_pcd: false, tipo_deficiencia: '', banco: 'Santander', codigo_banco: '033', agencia: '3456', conta: '78901-2', tipo_conta: 'CORRENTE', titular: 'Mariana Costa', chave_pix: '444.555.666-77', vt_ativo: true, vale_transporte_total: 180, va_ativo: true, vale_alimentacao: 600, vr_ativo: true, vale_refeicao: 400, ps_ativo: true, plano_saude_colaborador: 250, po_ativo: false, plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 25, faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0, consignado: 0, outros_descontos: 0, coparticipacoes: 0, inss: 280, fgts_retido: 240, irrf: 50, fgts_patronal: 240, inss_patronal: 600, rat: 40, terceiros: 40, month: '05', year: '2024', total_proventos: 3000, total_descontos: 785, salario_liquido: 2215, status: 'ACTIVE', address: { zipCode: '05678-123', street: 'Rua das Flores', number: '42', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP' }
  },
  { 
    id: 'p5', unitId: 'u-filial1', matricula: '2024005', employeeName: 'Roberto Alves', email: 'roberto@adjpa.com.br', cpf: '555.666.777-88', rg: '55.666.777-5', pis: '567.89012.34-5', ctps: '56789/005', cargo: 'Músico', funcao: 'Louvor', departamento: 'Ministério de Louvor', cbo: '2626-10', data_admissao: '2021-09-15', birthDate: '1982-12-05', tipo_contrato: 'PJ', jornada_trabalho: '20h', regime_trabalho: 'PRESENCIAL', salario_base: 4000, tipo_salario: 'MENSAL', he50_qtd: 0, he100_qtd: 0, dsr_ativo: false, adic_noturno_qtd: 0, insalubridade_grau: 'NONE', periculosidade_ativo: false, comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0, auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 0, is_pcd: false, tipo_deficiencia: '', banco: 'Nubank', codigo_banco: '260', agencia: '0001', conta: '1234567-8', tipo_conta: 'CORRENTE', titular: 'Roberto Alves', chave_pix: '555.666.777-88', vt_ativo: false, vale_transporte_total: 0, va_ativo: false, vale_alimentacao: 0, vr_ativo: false, vale_refeicao: 0, ps_ativo: false, plano_saude_colaborador: 0, po_ativo: false, plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 0, faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0, consignado: 0, outros_descontos: 0, coparticipacoes: 0, inss: 0, fgts_retido: 0, irrf: 0, fgts_patronal: 0, inss_patronal: 0, rat: 0, terceiros: 0, month: '05', year: '2024', total_proventos: 4000, total_descontos: 0, salario_liquido: 4000, status: 'ACTIVE', address: { zipCode: '08901-234', street: 'Av. das Américas', number: '1000', neighborhood: 'Barra', city: 'São Paulo', state: 'SP' }
  },
  { 
    id: 'p6', unitId: 'u-filial1', matricula: '2024006', employeeName: 'Fernanda Lima', email: 'fernanda@adjpa.com.br', cpf: '666.777.888-99', rg: '66.777.888-6', pis: '678.90123.45-6', ctps: '67890/006', cargo: 'Professora Infantil', funcao: 'Educação', departamento: 'Ministério Infantil', cbo: '2311-05', data_admissao: '2022-01-20', birthDate: '1993-03-30', tipo_contrato: 'CLT', jornada_trabalho: '30h', regime_trabalho: 'PRESENCIAL', salario_base: 2500, tipo_salario: 'MENSAL', he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0, insalubridade_grau: 'NONE', periculosidade_ativo: false, comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0, auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 1, is_pcd: false, tipo_deficiencia: '', banco: 'Inter', codigo_banco: '077', agencia: '0001', conta: '9876543-2', tipo_conta: 'CORRENTE', titular: 'Fernanda Lima', chave_pix: '666.777.888-99', vt_ativo: true, vale_transporte_total: 120, va_ativo: true, vale_alimentacao: 400, vr_ativo: false, vale_refeicao: 0, ps_ativo: true, plano_saude_colaborador: 200, po_ativo: false, plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 20, faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0, consignado: 0, outros_descontos: 0, coparticipacoes: 0, inss: 220, fgts_retido: 200, irrf: 0, fgts_patronal: 200, inss_patronal: 500, rat: 35, terceiros: 35, month: '05', year: '2024', total_proventos: 2500, total_descontos: 560, salario_liquido: 1940, status: 'ACTIVE', address: { zipCode: '09012-345', street: 'Rua do Sol', number: '77', neighborhood: 'Vila Madalena', city: 'São Paulo', state: 'SP' }
  }
];

export const OPERATION_NATURES = [
  { id: 'nat1', name: 'Despesa Operacional' },
  { id: 'nat2', name: 'Investimento / Ativo Imobilizado' },
  { id: 'nat3', name: 'Impostos e Contribuições' },
  { id: 'nat4', name: 'Transferências entre Contas' },
  { id: 'nat5', name: 'Ajuste de Saldo / Correção' },
  { id: 'nat6', name: 'Receita Ordinária' },
  { id: 'nat7', name: 'Receita Extraordinária' },
];

export const CHURCH_PROJECTS = [
  { id: 'prj1', name: 'Reforma do Santuário 2024' },
  { id: 'prj2', name: 'Congresso Geral de Missões' },
  { id: 'prj3', name: 'Aquisição de Novos Equipamentos Som' },
  { id: 'prj4', name: 'Projeto Social Mãos Amigas' },
];

export const COST_CENTERS = [
  { id: 'cc1', name: 'Administrativo' },
  { id: 'cc2', name: 'Missões e Evangelismo' },
  { id: 'cc3', name: 'Ministério Infantil' },
  { id: 'cc4', name: 'Ministério de Louvor' },
  { id: 'cc5', name: 'Patrimônio / Obras' },
  { id: 'cc6', name: 'Ação Social' },
  { id: 'cc7', name: 'Educação Teológica' },
];

export const DEFAULT_TAX_CONFIG: TaxConfig = {
  inssBrackets: [
    { limit: 1412.00, rate: 0.075 },
    { limit: 2666.68, rate: 0.090 },
    { limit: 4000.03, rate: 0.120 },
    { limit: 7786.02, rate: 0.140 }
  ],
  irrfBrackets: [
    { limit: 2259.20, rate: 0.000, deduction: 0.00 },
    { limit: 2826.65, rate: 0.075, deduction: 169.44 },
    { limit: 3751.05, rate: 0.150, deduction: 381.44 },
    { limit: 4664.68, rate: 0.225, deduction: 662.77 },
    { limit: Infinity, rate: 0.275, deduction: 896.00 }
  ],
  fgtsRate: 0.08,
  patronalRate: 0.20,
  ratRate: 0.03,
  terceirosRate: 0.058
};

export const MOCK_ACCOUNTS: FinancialAccount[] = [
  { id: 'acc1', unitId: 'u-sede', name: 'Caixa Sede', type: 'CASH', currentBalance: 3250.00 },
  { id: 'acc2', unitId: 'u-sede', name: 'Bradesco - Geral', type: 'BANK', currentBalance: 85400.00 },
  { id: 'acc3', unitId: 'u-filial1', name: 'Itaú - Construção', type: 'BANK', currentBalance: 120000.00 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', unitId: 'u-sede', description: 'Dízimo Ricardo Alcantara', amount: 850, date: '2024-05-01', competencyDate: '2024-05-01', type: 'INCOME', category: 'TITHE', costCenter: 'cc1', accountId: 'acc2', memberId: 'm1', status: 'PAID', isConciliated: true, operationNature: 'nat6' },
  { id: 't2', unitId: 'u-sede', description: 'Conta de Energia Templo Sede', amount: 1250.40, date: '2024-05-10', competencyDate: '2024-05-10', type: 'EXPENSE', category: 'UTILITIES', costCenter: 'cc1', accountId: 'acc2', status: 'PAID', isConciliated: true, operationNature: 'nat1' },
  { id: 't3', unitId: 'u-sede', description: 'Oferta Especial Missões', amount: 2500, date: '2024-05-12', competencyDate: '2024-05-12', type: 'INCOME', category: 'OFFERING', costCenter: 'cc2', accountId: 'acc1', status: 'PAID', isConciliated: true, operationNature: 'nat6' },
];

export const MOCK_AUDIT: AuditLog[] = [
  { id: 'a1', unitId: 'u-sede', userId: 'dev', userName: 'Desenvolvedor Master', action: 'SYSTEM_UPGRADE', entity: 'System', date: '2024-05-20 10:00', ip: '127.0.0.1' },
];

export const MOCK_EVENTS: ChurchEvent[] = [
  { id: 'e1', unitId: 'u-sede', title: 'Culto da Família', description: 'Culto especial com as famílias.', date: '2024-06-20', time: '19:00', location: 'Templo Sede', attendeesCount: 400, type: 'SERVICE' }
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'ast1', unitId: 'u-sede', description: 'Imóvel Sede', category: 'IMÓVEL', acquisitionDate: '2010-01-15', acquisitionValue: 2500000, currentValue: 3800000, depreciationRate: 0, location: 'Templo Principal', condition: 'BOM', assetNumber: 'AD-0001' }
];

export const MOCK_LEAVES: EmployeeLeave[] = [
  { id: 'lv1', unitId: 'u-sede', employeeId: 'p2', employeeName: 'Luciana Silva Oliveira', type: 'VACATION', startDate: '2024-12-01', endDate: '2024-12-30', status: 'SCHEDULED', observations: 'Férias regulares' }
];
