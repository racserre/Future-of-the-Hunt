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
      category: 'Snacks',
      price: '$8.50',
      matchScore: 84,
      reason: 'A practical add-on for snack runs and quick pantry restocks.',
    },
    {
      name: 'Party Favor Bundle',
      category: 'Party Supplies',
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
    {
      name: 'Assorted Potato Chips',
      category: 'Snacks',
      price: '$1.25',
      matchScore: 90,
      reason: 'A natural companion for soda, lunchboxes, and movie night.',
    },
    {
      name: 'Cola 2-Liter Bottle',
      category: 'Drinks',
      price: '$1.75',
      matchScore: 88,
      reason: 'Pairs well with chips for convenience-store style snack runs.',
    },
    {
      name: 'Bag Clips 4-Pack',
      category: 'Home Organization',
      price: '$1.00',
      matchScore: 86,
      reason: 'A practical add-on for keeping opened snack bags fresh.',
    },
    {
      name: 'Alkaline Batteries 4-Pack',
      category: 'The Dollar Zone',
      price: '$1.00',
      matchScore: 90,
      reason:
        'A dependable everyday essential for remotes, toys, and small electronics.',
    },
    {
      name: 'Flashlight',
      category: 'The Dollar Zone',
      price: '$3.00',
      matchScore: 89,
      reason:
        'Great to pair with batteries for emergencies, camping, or home use.',
    },
    {
      name: 'AA Battery Pack',
      category: 'The Dollar Zone',
      price: '$2.50',
      matchScore: 87,
      reason:
        'Useful when customers need a quick battery refill for household devices.',
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

  getComplementaryRecommendations(searchTerm: string): RecommendationItem[] {
    const normalized = searchTerm.toLowerCase();

    if (normalized.includes('battery') || normalized.includes('batteries')) {
      return this.catalog
        .filter(
          (item) =>
            item.name.toLowerCase().includes('battery') ||
            item.name.toLowerCase().includes('flashlight') ||
            item.category.toLowerCase().includes('dollar zone'),
        )
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
    }

    if (
      normalized.includes('chip') ||
      normalized.includes('chips') ||
      normalized.includes('snack')
    ) {
      return this.catalog
        .filter(
          (item) =>
            item.name.toLowerCase().includes('chip') ||
            item.name.toLowerCase().includes('cola') ||
            item.name.toLowerCase().includes('clip') ||
            item.category.toLowerCase().includes('snack') ||
            item.category.toLowerCase().includes('drink'),
        )
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
    }

    return this.catalog.slice(0, 3);
  }
}
