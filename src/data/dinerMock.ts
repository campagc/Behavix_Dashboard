import { MenuItem, EcoSquadStats, Department } from '../types';

export const DEPARTMENTS: Department[] = ['DISI', 'DII', 'Psychology', 'Economics', 'Law'];

export const TODAY_MENU: MenuItem[] = [
  { id: 'm1', name: 'Macaroni Cheese', category: 'First Dish' },
  { id: 'm2', name: 'Tomato Basil Soup', category: 'First Dish' },
  { id: 'm3', name: 'Roasted Chicken Wings', category: 'Second Dish' },
  { id: 'm4', name: 'Broccoli Casserole', category: 'Second Dish', hasBounty: true },
  { id: 'm5', name: 'Lemon Tart', category: 'Dessert' },
];

export const MOCK_LEADERBOARD: EcoSquadStats[] = [
  { department: 'DISI', volume: 1240, rank: 1 },
  { department: 'DII', volume: 1180, rank: 2 },
  { department: 'Psychology', volume: 850, rank: 3 },
  { department: 'Economics', volume: 720, rank: 4 },
  { department: 'Law', volume: 430, rank: 5 },
];

export const REASON_TAGS = [
  { id: 't1', label: 'Too salty 🧂', type: 'objective' },
  { id: 't2', label: 'Too cold ❄️', type: 'objective' },
  { id: 't3', label: 'Doesn\'t taste good 😮💨', type: 'objective' },
  { id: 't4', label: 'Looks unappetizing 📸', type: 'objective' },
  { id: 't5', label: 'No appetite 🤒', type: 'subjective' },
  { id: 't6', label: 'Ordered too much 🛒', type: 'subjective' },
  { id: 't7', label: 'Rushing to class 🏃‍♂️', type: 'subjective' },
];
