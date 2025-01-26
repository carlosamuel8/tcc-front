export interface IAnaliseTurmaItem {
  Quantidade: number;
  Status: string;
}

export interface IConsolidade {
  'Código': string;
  'Gargalo': number;
  'Nome': string;
  'Supressões': number;
  'Taxa de Aprovação (%)': number;
  'Trancamentos': number;
}

export interface ITabelasResult {
  analise_turma: IAnaliseTurmaItem[],
  df_consolidado: IConsolidade[],
}

export type TVisualization = 'taxa_aprovacao' | 'gargalo' | 'supressao' | 'trancamento';
