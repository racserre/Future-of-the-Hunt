import { Injectable } from '@angular/core';

export interface RecommendationItem {
  name: string;
  category: string;
  price: string;
  matchScore: number;
  reason: string;
}

export interface BuckyProfile {
  budget: string;
  interest: string;
  occasion: string;
}

@Injectable({ providedIn: 'root' })
export class BuckyRecommenderService {
  private catalog: RecommendationItem[] = [
    {
      name: 'Stackable Drawer Organizer',
      category: 'Home Organization',
      price: '$12.98',
      matchScore: 92,
      reason:
        'Perfect for tidy school supply storage and small-space organization.',
    },
    {
      name: 'Budget Snack Box',
      category: 'Grocery',
      price: '$8.50',
      matchScore: 84,
      reason: 'A strong fit for quick, affordable pantry upgrades.',
    },
    {
      name: 'Party Favor Bundle',
      category: 'Celebration',
      price: '$19.00',
      matchScore: 78,
      reason: 'Great for hosting and gifting on a modest budget.',
    },
    {
      name: 'Mini Desk Lamp',
      category: 'Home Office',
      price: '$14.88',
      matchScore: 75,
      reason: 'Helpful for study spaces and late-night prep sessions.',
    },
  ];

  getRecommendations(profile: BuckyProfile): RecommendationItem[] {
    const interestBoost = profile.interest.toLowerCase().includes('organ')
      ? 10
      : 0;
    const budgetBoost = profile.budget.includes('$10') ? 8 : 0;
    const occasionBoost = profile.occasion.toLowerCase().includes('school')
      ? 6
      : 0;

    return this.catalog
      .map((item) => ({
        ...item,
        matchScore: Math.min(
          99,
          item.matchScore + interestBoost + budgetBoost + occasionBoost,
        ),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }
}
