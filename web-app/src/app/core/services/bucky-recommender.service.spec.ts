import { TestBed } from '@angular/core/testing';
import { BuckyRecommenderService } from './bucky-recommender.service';

describe('BuckyRecommenderService', () => {
  let service: BuckyRecommenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuckyRecommenderService);
  });

  it('returns a curated recommendation list for a budget-conscious shopper', () => {
    const results = service.getRecommendations({
      budget: '$10-$25',
      interest: 'home organization',
      occasion: 'back-to-school',
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toContain('Organizer');
    expect(results[0].matchScore).toBeGreaterThan(70);
  });
});
