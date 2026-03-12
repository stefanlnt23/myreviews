import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 8.5) return 'bg-[#2d8a6b] text-white';
  if (score >= 7.5) return 'bg-[#d4720a] text-white';
  return 'bg-[#888888] text-white';
}

export function getCategoryStyles(category: string): string {
  switch (category) {
    case 'ACCOUNTING':
      return 'bg-[#e8f4f0] text-[#2d8a6b]';
    case 'INVOICING':
      return 'bg-[#fef3e8] text-[#d4720a]';
    case 'WEBSITE BUILDER':
      return 'bg-[#eef2fb] text-[#3a5fd9]';
    case 'PAYMENTS':
      return 'bg-[#fdf0f0] text-[#c0392b]';
    case 'JOB MANAGEMENT':
      return 'bg-[#f5f0fe] text-[#7c3aed]';
    case 'INSURANCE':
      return 'bg-[#f0f9ff] text-[#0284c7]';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}
