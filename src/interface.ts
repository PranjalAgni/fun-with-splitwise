export interface IExpense {
  id: number;
  group_id?: number;
  description: string;
  details?: string;
  payment: boolean;
  creation_method: string;
  cost: string;
  currency_code: string;
  repayments: Repayment[];
  created_at: string;
  created_by: CreatedOrUpdatedBy;
  updated_at: string;
  updated_by?: CreatedOrUpdatedBy;
  category: Category;
  users: User[];
}

export interface Repayment {
  from: number;
  to: number;
  amount: string;
}

export interface CreatedOrUpdatedBy {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface User {
  user: UserMetadata;
  user_id: number;
  paid_share: string;
  owed_share: string;
  net_balance: string;
}

export interface UserMetadata {
  id: number;
  first_name: string;
  last_name?: string;
}
