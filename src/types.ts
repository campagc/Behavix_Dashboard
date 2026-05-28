export type Department = 'DISI' | 'DII' | 'Psychology' | 'Economics' | 'Law';

export type RewardType = 'points' | 'espresso' | 'dessert' | 'golden_ticket';

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  earnedAt: number;
  expiresAt: number | null; // 48h validity for rare+
  value: number; 
}

export interface UserProfile {
  email: string | null;
  department: Department | null;
  streak: number;
  points: number;
  pityCounter: number;
  inventory: Reward[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  hasBounty?: boolean;
}

export interface DishSelection {
  categoryId: string;
  categoryName: string;
  name: string;
}

export interface DishAmount extends DishSelection {
  amountLeft: 'None' | 'Less than half' | 'More than half' | 'Everything';
}

export interface EcoSquadStats {
  department: string;
  volume: number;
  rank: number;
}
