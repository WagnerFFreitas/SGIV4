
export type UserRole = 'ADMIN' | 'SECRETARY' | 'TREASURER' | 'PASTOR' | 'RH' | 'DP' | 'FINANCEIRO' | 'DEVELOPER';

export interface UserAuth {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  unitId: string;
}

export interface Unit {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  isHeadquarter: boolean;
}

export interface Asset {
  id: string;
  unitId: string;
  description: string;
  category: 'IMÓVEL' | 'VEÍCULO' | 'SOM_LUZ' | 'INSTRUMENTO' | 'MÓVEL' | 'INFORMÁTICA' | 'OUTROS';
  acquisitionDate: string;
  acquisitionValue: number;
  currentValue: number;
  depreciationRate: number;
  location: string;
  condition: 'NOVO' | 'BOM' | 'REGULAR' | 'PRECÁRIO';
  assetNumber: string;
  observations?: string;
}

export type LeaveType = 'VACATION' | 'MEDICAL' | 'MATERNITY' | 'PATERNITY' | 'MILITARY' | 'WEDDING' | 'BEREAVEMENT' | 'UNPAID';

export interface EmployeeLeave {
  id: string;
  unitId: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  cid10?: string;
  doctorName?: string;
  crm?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  observations?: string;
  attachmentUrl?: string;
}

export interface MemberContribution {
  id: string;
  value: number;
  date: string;
  type: 'TITHE' | 'OFFERING' | 'CAMPAIGN';
  description?: string;
}

export interface Dependent {
  id: string;
  name: string;
  birthDate: string;
  relationship: 'FILHO' | 'CONJUGE' | 'PAI' | 'MAE' | 'OUTRO';
  cpf?: string;
}

// Added missing FinancialAccount interface
export interface FinancialAccount {
  id: string;
  unitId: string;
  name: string;
  type: 'CASH' | 'BANK';
  currentBalance: number;
}

// Added missing Transaction interface
export interface Transaction {
  id: string;
  unitId: string;
  description: string;
  amount: number;
  date: string;
  competencyDate: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  costCenter: string;
  accountId: string;
  memberId?: string;
  status: 'PAID' | 'PENDING';
  isConciliated?: boolean;
  operationNature: string;
  projectId?: string;
  createdAt?: string;
  paymentMethod?: 'PIX' | 'CASH' | 'CREDIT_CARD';
  providerName?: string;
}

// Added missing ChurchEvent interface
export interface ChurchEvent {
  id: string;
  unitId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  type: 'SERVICE' | 'MEETING' | 'EVENT';
}

// Added missing AuditLog interface
export interface AuditLog {
  id: string;
  unitId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  date: string;
  ip: string;
}

// Added missing TaxConfig interface
export interface TaxConfig {
  inssBrackets: { limit: number; rate: number }[];
  irrfBrackets: { limit: number; rate: number; deduction: number }[];
  fgtsRate: number;
  patronalRate: number;
  ratRate: number;
  terceirosRate: number;
}

export interface Member {
  id: string;
  unitId: string;
  name: string;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profession?: string;
  role: 'MEMBER' | 'VISITOR' | 'VOLUNTEER' | 'STAFF' | 'LEADER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  
  // Filiação
  fatherName?: string;
  motherName?: string;

  // Emergência e Saúde
  bloodType?: string;
  emergencyContact?: string;
  
  // Vida Cristã
  conversionDate?: string;
  conversionPlace?: string;
  baptismDate?: string;
  baptismChurch?: string;
  baptizingPastor?: string;
  holySpiritBaptism?: 'SIM' | 'NAO';
  
  // Formação e Status
  membershipDate?: string;
  churchOfOrigin?: string;
  discipleshipCourse?: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  biblicalSchool?: 'ATIVO' | 'INATIVO' | 'NAO_FREQUENTA';
  
  // Ministérios e Cargos
  mainMinistry?: string;
  ministryRole?: string;
  otherMinistries?: string[];
  ecclesiasticalPosition?: string;
  consecrationDate?: string;

  // Financeiro Individual
  isTithable: boolean;
  isRegularGiver: boolean;
  participatesCampaigns: boolean;
  contributions: MemberContribution[];
  
  // Dados de RH / Pagamento
  bank?: string;
  bankAgency?: string;
  bankAccount?: string;
  pixKey?: string;
  dependents?: Dependent[];

  birthDate: string;
  gender: 'M' | 'F' | 'OTHER';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  spouseName?: string;
  marriageDate?: string;
  spiritualGifts?: string;
  cellGroup?: string;
  
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  
  observations?: string;
  specialNeeds?: string;
  talents?: string;
  tags?: string[];
  familyId?: string;
  avatar: string;
}

export interface Payroll {
  id: string;
  unitId: string;
  membro_id?: string;
  matricula: string;
  employeeName: string;
  email?: string;
  cpf: string;
  rg: string;
  pis: string;
  ctps: string;
  titulo_eleitor?: string;
  reservista?: string;
  aso_data?: string;
  blood_type?: string;
  emergency_contact?: string;
  cargo: string;
  funcao: string;
  departamento: string;
  cbo: string;
  data_admissao: string;
  data_demissao?: string;
  birthDate: string;
  tipo_contrato: 'CLT' | 'PJ' | 'VOLUNTARIO' | 'TEMPORARIO';
  jornada_trabalho: string;
  regime_trabalho: 'PRESENCIAL' | 'HIBRIDO' | 'REMOTO';
  salario_base: number;
  tipo_salario: 'MENSAL' | 'HORISTA' | 'COMISSIONADO';
  sindicato?: string;
  convencao_coletiva?: string;
  he50_qtd: number;
  he100_qtd: number;
  dsr_ativo: boolean;
  adic_noturno_qtd: number;
  insalubridade_grau: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  periculosidade_ativo: boolean;
  comissoes: number;
  gratificacoes: number;
  premios: number;
  ats_percentual: number;
  auxilio_moradia: number;
  arredondamento: number;
  dependentes_qtd: number;
  dependentes_lista?: Dependent[];
  is_pcd: boolean;
  tipo_deficiencia: string;
  banco: string;
  codigo_banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'CORRENTE' | 'POUPANCA';
  titular: string;
  chave_pix: string;
  vt_ativo: boolean;
  vale_transporte_total: number;
  va_ativo: boolean;
  vale_alimentacao: number;
  vr_ativo: boolean;
  vale_refeicao: number;
  ps_ativo: boolean;
  plano_saude_colaborador: number;
  po_ativo: boolean;
  plano_saude_dependentes: number;
  vale_farmacia: number;
  seguro_vida: number;
  faltas: number;
  atrasos: number;
  adiantamento: number;
  pensao_alimenticia: number;
  consignado: number;
  outros_descontos: number;
  coparticipacoes: number;
  inss: number;
  fgts_retido: number;
  irrf: number;
  fgts_patronal: number;
  inss_patronal: number;
  rat: number;
  terceiros: number;
  month: string;
  year: string;
  total_proventos: number;
  total_descontos: number;
  salario_liquido: number;
  status: 'PAID' | 'PENDING' | 'ACTIVE' | 'INACTIVE';
  cnh_numero?: string;
  cnh_categoria?: string;
  cnh_vencimento?: string;
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}
