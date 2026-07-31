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

  it('recommends complementary items for chip and battery shoppers', () => {
    const chipResults = service.getComplementaryRecommendations('bag of chips');
    const batteryResults = service.getComplementaryRecommendations('batteries');

    expect(chipResults.length).toBeGreaterThan(0);
    expect(
      chipResults.some((item) => item.name.toLowerCase().includes('chip')),
    ).toBeTrue();
    expect(
      chipResults.some(
        (item) =>
          item.name.toLowerCase().includes('cola') ||
          item.name.toLowerCase().includes('bag clips'),
      ),
    ).toBeTrue();

    expect(batteryResults.length).toBeGreaterThan(0);
    expect(
      batteryResults.some((item) =>
        item.name.toLowerCase().includes('battery'),
      ),
    ).toBeTrue();
    expect(
      batteryResults.some((item) =>
        item.name.toLowerCase().includes('flashlight'),
      ),
    ).toBeTrue();
  });
});
