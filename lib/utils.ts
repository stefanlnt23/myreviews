import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 8.5) return 'bg-score-green';
  if (score >= 6) return 'bg-score-amber';
  return 'bg-score-red';
}

export function getCategoryStyles(category: string): string {
  switch (category) {
    case 'ACCOUNTING':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'INVOICING':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'WEBSITE BUILDER':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'PAYMENTS':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'JOB MANAGEMENT':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'INSURANCE':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
}
