
import { Member, Transaction, ChurchEvent, Payroll, FinancialAccount, AuditLog, TaxConfig, Unit, Asset, EmployeeLeave } from './types';

export const MOCK_UNITS: Unit[] = [
  { id: 'u-sede', name: 'ADJPA - Sede Mundial', cnpj: '00.123.456/0001-99', address: 'Rua das Nações, 1000', city: 'São Paulo', state: 'SP', isHeadquarter: true },
  { id: 'u-filial1', name: 'ADJPA - Unidade Leste', cnpj: '00.123.456/0002-88', address: 'Av. Brasil, 500', city: 'São Paulo', state: 'SP', isHeadquarter: false },
];

export const MOCK_ASSETS: Asset[] = [
  { 
    id: 'ast1', 
    unitId: 'u-sede', 
    description: 'Imóvel Sede Mundial', 
    category: 'IMÓVEL', 
    acquisitionDate: '2010-01-15', 
    acquisitionValue: 2500000, 
    currentValue: 3800000, 
    depreciationRate: 0, 
    location: 'Templo Principal', 
    condition: 'BOM', 
    assetNumber: 'AD-0001' 
  },
  { 
    id: 'ast2', 
    unitId: 'u-sede', 
    description: 'Console Digital Behringer X32', 
    category: 'SOM_LUZ', 
    acquisitionDate: '2022-03-10', 
    acquisitionValue: 18500, 
    currentValue: 15000, 
    depreciationRate: 10, 
    location: 'Cabine de Som', 
    condition: 'NOVO', 
    assetNumber: 'AD-0042' 
  },
];

export const MOCK_LEAVES: EmployeeLeave[] = [
  {
    id: 'lv1',
    unitId: 'u-sede',
    employeeId: 'p1',
    employeeName: 'Ricardo Oliveira Ramos',
    type: 'VACATION',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: 'SCHEDULED',
    observations: 'Férias regulares período 23/24'
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
  ratRate: 0.03 
};

export const MOCK_ACCOUNTS: FinancialAccount[] = [
  { id: 'acc1', unitId: 'u-sede', name: 'Caixa Sede', type: 'CASH', currentBalance: 3250.00 },
  { id: 'acc2', unitId: 'u-sede', name: 'Bradesco - Geral', type: 'BANK', currentBalance: 85400.00 },
  { id: 'acc3', unitId: 'u-filial1', name: 'Itaú - Construção', type: 'BANK', currentBalance: 120000.00 },
];

export const MOCK_MEMBERS: Member[] = [
  { 
    id: '1', 
    unitId: 'u-sede',
    name: 'João Silva', 
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    email: 'joao@email.com', 
    phone: '(11) 98888-7777',
    whatsapp: '(11) 98888-7777',
    profession: 'Engenheiro Civil',
    role: 'MEMBER', 
    status: 'ACTIVE', 
    birthDate: '1985-05-15',
    gender: 'M',
    maritalStatus: 'MARRIED',
    conversionDate: '2010-03-20',
    baptismDate: '2010-06-15',
    isTithable: true,
    isRegularGiver: true,
    participatesCampaigns: false,
    contributions: [
      { id: 'c1', value: 500, date: '2024-05-01', type: 'TITHE' },
      { id: 'c2', value: 450, date: '2024-04-02', type: 'TITHE' },
      { id: 'c3', value: 50, date: '2024-04-15', type: 'OFFERING' }
    ],
    address: {
      zipCode: '01234-567',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP'
    },
    avatar: 'https://i.pravatar.cc/150?u=1' 
  },
  { 
    id: '2', 
    unitId: 'u-filial1',
    name: 'Maria Oliveira', 
    cpf: '987.654.321-11',
    rg: '22.333.444-5',
    email: 'maria@email.com', 
    phone: '(11) 97777-6666',
    role: 'MEMBER', 
    status: 'ACTIVE', 
    birthDate: '1992-08-20',
    gender: 'F',
    maritalStatus: 'SINGLE',
    isTithable: true,
    isRegularGiver: false,
    participatesCampaigns: true,
    contributions: [],
    address: { zipCode: '04567-890', street: 'Av. Paulista', number: '1000', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' },
    avatar: 'https://i.pravatar.cc/150?u=2' 
  },
  { 
    id: '3', 
    unitId: 'u-sede',
    name: 'Carlos Alberto', 
    cpf: '444.555.666-77',
    rg: '11.222.333-4',
    email: 'carlos@email.com', 
    phone: '(11) 96666-5555',
    role: 'VISITOR', 
    status: 'ACTIVE', 
    birthDate: '1980-01-10',
    gender: 'M',
    maritalStatus: 'DIVORCED',
    isTithable: false,
    isRegularGiver: false,
    participatesCampaigns: false,
    contributions: [],
    address: { zipCode: '01234-567', street: 'Rua das Palmeiras', number: '45', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' },
    avatar: 'https://i.pravatar.cc/150?u=3' 
  }
];

export const MOCK_PAYROLL: Payroll[] = [
  { 
    id: 'p1', 
    unitId: 'u-sede',
    matricula: '2024001', 
    employeeName: 'Ricardo Oliveira Ramos', 
    cpf: '222.333.444-55',
    rg: '22.333.444-5',
    pis: '120.44556.77-8',
    ctps: '0054321/0001',
    cargo: 'Pastor Auxiliar',
    funcao: 'Ministério Pastoral',
    departamento: 'Eclesiástico',
    cbo: '2631-05',
    data_admissao: '2021-01-10',
    birthDate: '1978-08-22',
    tipo_contrato: 'CLT',
    jornada_trabalho: '44h semanais',
    regime_trabalho: 'PRESENCIAL',
    salario_base: 4500,
    tipo_salario: 'MENSAL',
    he50_qtd: 10,
    he100_qtd: 0,
    dsr_ativo: true,
    adic_noturno_qtd: 0,
    insalubridade_grau: 'NONE',
    periculosidade_ativo: false,
    comissoes: 0,
    gratificacoes: 500,
    premios: 0,
    ats_percentual: 5,
    auxilio_moradia: 800,
    arredondamento: 0,
    dependentes_qtd: 2,
    dependentes_lista: [
      { id: 'd1', name: 'Enzo Oliveira', birthDate: '2018-05-20', relationship: 'FILHO', cpf: '999.888.777-66' },
      { id: 'd1b', name: 'Beatriz Oliveira', birthDate: '2020-03-12', relationship: 'FILHO', cpf: '999.777.666-55' }
    ],
    is_pcd: false,
    tipo_deficiencia: '',
    blood_type: 'O+',
    emergency_contact: '(11) 98877-6655 (Esposa)',
    vt_ativo: true,
    vale_transporte_total: 220,
    va_ativo: true,
    vale_alimentacao: 600,
    vr_ativo: false,
    vale_refeicao: 0,
    ps_ativo: true,
    plano_saude_colaborador: 420,
    po_ativo: false,
    plano_saude_dependentes: 0,
    vale_farmacia: 0,
    seguro_vida: 25,
    banco: 'Itaú',
    codigo_banco: '341',
    agencia: '0101',
    conta: '12345-6',
    tipo_conta: 'CORRENTE',
    titular: 'Ricardo Oliveira Ramos',
    chave_pix: 'ricardo@pastoral.com',
    month: '05',
    year: '2024',
    faltas: 0,
    atrasos: 0,
    adiantamento: 0,
    pensao_alimenticia: 0,
    consignado: 0,
    outros_descontos: 0,
    coparticipacoes: 0,
    inss: 480.50,
    fgts_retido: 400,
    irrf: 245.30,
    fgts_patronal: 400,
    inss_patronal: 1150,
    rat: 150,
    terceiros: 150,
    total_proventos: 5000,
    total_descontos: 725.80,
    salario_liquido: 4274.20,
    status: 'ACTIVE',
    cnh_numero: '12345678901',
    cnh_categoria: 'B',
    cnh_vencimento: '2025-05-15',
    address: {
      zipCode: '01234-567',
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP'
    }
  },
  { 
    id: 'p2', 
    unitId: 'u-sede',
    matricula: '2024002', 
    employeeName: 'Juliana Mendes Santana', 
    cpf: '333.444.555-66',
    rg: '33.444.555-6',
    pis: '130.55667.88-9',
    ctps: '0065432/0002',
    cargo: 'Secretária Administrativa',
    funcao: 'Secretariado',
    departamento: 'Administrativo',
    cbo: '4110-05',
    data_admissao: '2022-03-15',
    birthDate: '1995-11-30',
    tipo_contrato: 'CLT',
    jornada_trabalho: '44h semanais',
    regime_trabalho: 'PRESENCIAL',
    salario_base: 2800,
    tipo_salario: 'MENSAL',
    he50_qtd: 0,
    he100_qtd: 0,
    dsr_ativo: true,
    adic_noturno_qtd: 0,
    insalubridade_grau: 'NONE',
    periculosidade_ativo: false,
    comissoes: 0,
    gratificacoes: 0,
    premios: 0,
    ats_percentual: 2,
    auxilio_moradia: 0,
    arredondamento: 0,
    dependentes_qtd: 0,
    dependentes_lista: [],
    is_pcd: false,
    tipo_deficiencia: '',
    blood_type: 'A+',
    emergency_contact: '(11) 97766-5544 (Mãe)',
    vt_ativo: true,
    vale_transporte_total: 180,
    va_ativo: true,
    vale_alimentacao: 500,
    vr_ativo: true,
    vale_refeicao: 350,
    ps_ativo: true,
    plano_saude_colaborador: 280,
    po_ativo: false,
    plano_saude_dependentes: 0,
    vale_farmacia: 50,
    seguro_vida: 20,
    banco: 'Bradesco',
    codigo_banco: '237',
    agencia: '1234',
    conta: '54321-0',
    tipo_conta: 'CORRENTE',
    titular: 'Juliana Mendes Santana',
    chave_pix: '333.444.555-66',
    month: '05',
    year: '2024',
    faltas: 0,
    atrasos: 0,
    adiantamento: 0,
    pensao_alimenticia: 0,
    consignado: 0,
    outros_descontos: 0,
    coparticipacoes: 0,
    inss: 250.00,
    fgts_retido: 224,
    irrf: 0,
    fgts_patronal: 224,
    inss_patronal: 560,
    rat: 84,
    terceiros: 84,
    total_proventos: 2856,
    total_descontos: 250,
    salario_liquido: 2606,
    status: 'ACTIVE',
    address: {
      zipCode: '04567-890',
      street: 'Av. Paulista',
      number: '500',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP'
    }
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', unitId: 'u-sede', description: 'Dízimo João Silva', amount: 500, date: '2024-05-01', competencyDate: '2024-05-01', type: 'INCOME', category: 'TITHE', costCenter: 'cc1', accountId: 'acc2', memberId: '1', status: 'PAID', isConciliated: true, operationNature: 'nat6' },
  { id: 't2', unitId: 'u-sede', description: 'Energia Elétrica Templo', amount: 850, date: '2024-05-10', competencyDate: '2024-05-10', type: 'EXPENSE', category: 'UTILITIES', costCenter: 'cc1', accountId: 'acc2', status: 'PAID', isConciliated: true, operationNature: 'nat1' },
  { id: 't3', unitId: 'u-sede', description: 'Oferta Culto de Domingo', amount: 1200, date: '2024-05-12', competencyDate: '2024-05-12', type: 'INCOME', category: 'OFFERING', costCenter: 'cc2', accountId: 'acc1', status: 'PAID', isConciliated: true, operationNature: 'nat6' },
  { id: 't4', unitId: 'u-filial1', description: 'Aluguel Unidade Leste', amount: 3500, date: '2024-05-05', competencyDate: '2024-05-05', type: 'EXPENSE', category: 'RENT', costCenter: 'cc1', accountId: 'acc3', status: 'PAID', isConciliated: true, operationNature: 'nat1' },
  { id: 't5', unitId: 'u-sede', description: 'Compra de Som - Microfones', amount: 2800, date: '2024-05-15', competencyDate: '2024-05-15', type: 'EXPENSE', category: 'EQUIPMENT', costCenter: 'cc4', accountId: 'acc2', status: 'PAID', isConciliated: true, operationNature: 'nat2' },
];

export const MOCK_AUDIT: AuditLog[] = [
  { id: 'a1', unitId: 'u-sede', userId: 'u1', userName: 'Anderson Lima', action: 'CREATE_PAYROLL', entity: 'Payroll', date: '2024-05-15 14:30', ip: '127.0.0.1' },
];

export const MOCK_EVENTS: ChurchEvent[] = [
  {
    id: 'e1',
    unitId: 'u-sede',
    title: 'Culto de Celebração',
    description: 'Culto dominical com louvor e palavra de esperança.',
    date: '2024-06-19',
    time: '18:00',
    location: 'Templo Sede',
    attendeesCount: 250,
    type: 'SERVICE'
  }
];
