import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  EmployeeTask,
  FutureProduct,
  FutureStoreService,
  TaskStatus,
} from '../core/services/future-store.service';
import { BuckyRecommenderService } from '../core/services/bucky-recommender.service';

type ViewMode = 'intelligence' | 'shop' | 'map' | 'employee' | 'manager';
type EmployeeRole = 'associate' | 'asm' | 'sm' | 'dm';
type MessageAuthor = 'bucky' | 'customer';

interface ChatMessage {
  author: MessageAuthor;
  text: string;
  detail?: string;
  type?: 'default' | 'map' | 'truck' | 'inventory' | 'list' | 'deals';
  items?: string[];
  products?: FutureProduct[];
  recommendations?: FutureProduct[];
}

interface SscSupportRoute {
  team: string;
  specialist: string;
  channel: string;
  priority: 'Standard' | 'Priority' | 'Urgent';
  gather: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly data = inject(FutureStoreService);
  private readonly recommender = inject(BuckyRecommenderService);
  activeView: ViewMode = 'map';
  mobileMenuOpen = false;
  executiveTab: 'store' | 'district' | 'recommendations' = 'store';
  chatOpen = true;
  promptText = '';
  voiceEnabled = false;
  scanned = false;
  searchText = '';
  selectedStoreId = 'DT-CHESAPEAKE-2031';
  selectedCategory = 'Dollar Zone';
  currentProduct: FutureProduct | null = null;
  highlightedAisle = 8;
  employeeLoggedIn = false;
  employeeRole: EmployeeRole = 'associate';
  employeeId = '';
  employeePin = '';
  loginError = '';
  teamChatOpen = true;
  teamPrompt = '';
  associateDemoScene = 0;
  activeSscRoute: SscSupportRoute | null = null;
  sscCaseNumber = '';
  incidentGuide: { title: string; steps: string[]; videoTitle: string } | null =
    null;
  trainingVideoOpen = false;
  activeTaskAssistant: EmployeeTask | null = null;
  taskAssistantMode: 'working' | 'help' = 'working';
  taskEscalationMessage = '';
  employeeScanText = '';
  scannedEmployeeProduct: FutureProduct | null = null;
  employeeScanMessage = '';
  arrivalAlertsEnabled =
    localStorage.getItem('dt2031-arrival-alerts') === 'true';
  arrivalAlertMessage = '';
  arrivalWelcomeOpen = false;
  backroomSearch = '';
  teamMessages = [
    {
      author: 'bucky',
      text: 'Hi Verlaine! I’m Bucky for Associates. I can help with tasks, inventory, procedures, and connect you with the right Store Support Center team.',
    },
  ];
  demoActive = false;
  customerAccountOpen = false;
  customerLoggedIn = false;
  customerEmail = '';
  customerName = '';
  customerPreference = 'Deals & Dollar Zone';
  accountMessage = '';
  similarSearchOpen = false;
  similarSearchText = '';
  chatTyping = false;
  selectedMapDepartment = '';
  missionName = '';
  missionProductIds: string[] = [];
  shareFindOpen = false;
  shareFindCaption = '';
  shareFindProduct = 'My Dollar Tree find';
  socialThankYou = '';
  readonly socialFinds = [
    {
      art: '🍹',
      title: 'Colorful summer sippers',
      user: '@valuefindsva',
      likes: 284,
      tone: 'neon',
    },
    {
      art: '🧴',
      title: 'My skin has been loving this find',
      user: '@chesapeakebeauty',
      likes: 196,
      tone: 'beauty',
    },
    {
      art: '🍿',
      title: 'Movie-night upgrade for less',
      user: '@snackhunter',
      likes: 417,
      tone: 'snack',
    },
    {
      art: '👜',
      title: 'Beach, please — summer tote find',
      user: '@coastalvalue',
      likes: 328,
      tone: 'beach',
    },
    {
      art: '🫧',
      title: 'A little self-care shelf discovery',
      user: '@bathandbargains',
      likes: 153,
      tone: 'bath',
    },
    {
      art: '🧻',
      title: 'Modern home essentials spotted',
      user: '@organizedforless',
      likes: 221,
      tone: 'home',
    },
    {
      art: '💄',
      title: 'The cutest beauty aisle surprise',
      user: '@glowonabudget',
      likes: 506,
      tone: 'lip',
    },
    {
      art: '🌴',
      title: 'Tropical cups made for summer',
      user: '@partyfinds',
      likes: 372,
      tone: 'tropical',
    },
  ];
  readonly shoppingMissions = [
    {
      name: 'Birthday Party',
      icon: '🎉',
      productIds: ['DT1010', 'DT1011', 'DT1012', 'DT1005', 'DT1009'],
    },
    {
      name: 'Teacher Supplies',
      icon: '🏫',
      productIds: ['DT1013', 'DT1014', 'DT1015', 'DT1019'],
    },
    {
      name: 'Camping',
      icon: '🏕️',
      productIds: ['DT1007', 'DT1005', 'DT1027', 'DT1012'],
    },
    {
      name: 'New Apartment',
      icon: '🏠',
      productIds: ['DT1001', 'DT1002', 'DT1019', 'DT1020'],
    },
    {
      name: 'Movie Night',
      icon: '🍿',
      productIds: ['DT1006', 'DT1004', 'DT1008', 'DT1011'],
    },
    {
      name: 'Baby Shower',
      icon: '🍼',
      productIds: ['DT1010', 'DT1011', 'DT1024', 'DT1009'],
    },
    {
      name: 'Road Trip',
      icon: '🚗',
      productIds: ['DT1005', 'DT1007', 'DT1009', 'DT1027'],
    },
    {
      name: 'Spring Cleaning',
      icon: '🧹',
      productIds: ['DT1001', 'DT1002', 'DT1003', 'DT1021'],
    },
  ];
  demoStep = 0;
  readonly demoSteps = [
    'Ask Bucky where birthday balloons are located.',
    'Show the highlighted aisle on the store map.',
    'Ask Bucky how many balloons are in stock.',
  ];

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get('preview');
    const requestedView = urlParams.get('view');
    const isTeamPreview =
      preview === 'team' || window.location.pathname.endsWith('/team-preview');
    if (isTeamPreview) {
      this.activeView = 'employee';
      this.employeeRole = 'associate';
      this.employeeLoggedIn = true;
    } else if (requestedView === 'shop' || requestedView === 'map') {
      this.activeView = requestedView;
    }

    const savedProfile = localStorage.getItem('dt2031-customer-profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        this.customerName = profile.name ?? '';
        this.customerEmail = profile.email ?? '';
        this.customerPreference = profile.preference ?? 'Deals & Dollar Zone';
        this.customerLoggedIn = Boolean(profile.email);
      } catch {
        localStorage.removeItem('dt2031-customer-profile');
      }
    }
  }

  readonly quickActions = [
    { label: 'Find an Item', icon: 'search', prompt: 'Where are batteries?' },
    {
      label: 'Check Store Inventory',
      icon: 'inventory_2',
      prompt: 'Is toothpaste in stock?',
    },
    {
      label: 'Show Me $1 Products',
      icon: 'sell',
      prompt: 'What products are still $1?',
    },
    {
      label: 'Party Under $20',
      icon: 'celebration',
      prompt: 'Help me plan a birthday party for under $20.',
    },
    {
      label: 'Find It on the Map',
      icon: 'map',
      prompt: 'Where can I find paper towels?',
    },
    {
      label: 'Arriving Today',
      icon: 'local_shipping',
      prompt: 'What is arriving today?',
    },
    {
      label: 'Cheaper Alternative',
      icon: 'savings',
      prompt: 'Suggest a cheaper alternative.',
    },
    {
      label: 'Similar Products',
      icon: 'swap_horiz',
      prompt: 'Is there another similar product available?',
    },
  ];

  readonly businessOutcomes = [
    {
      icon: 'trending_up',
      value: '+2.8%',
      label: 'Sales opportunity',
      detail: 'Fewer lost sales from empty shelves',
      tone: 'revenue',
    },
    {
      icon: 'schedule',
      value: '11 hrs',
      label: 'Labor returned weekly',
      detail: 'Less searching, counting, and task routing',
      tone: 'labor',
    },
    {
      icon: 'inventory_2',
      value: '97.4%',
      label: 'On-shelf availability',
      detail: 'Vision-triggered restocking closes gaps faster',
      tone: 'availability',
    },
    {
      icon: 'shield',
      value: '-14%',
      label: 'Shrink opportunity',
      detail: 'Exception-based review for authorized leaders',
      tone: 'shrink',
    },
  ];

  readonly districtStores = [
    {
      id: '2031',
      city: 'Chesapeake Future Store',
      score: 96,
      status: 'green',
      issue: 'Running normally',
    },
    {
      id: '1847',
      city: 'Virginia Beach',
      score: 81,
      status: 'yellow',
      issue: 'Paper goods stockout risk',
    },
    {
      id: '2214',
      city: 'Norfolk',
      score: 93,
      status: 'green',
      issue: 'Running normally',
    },
    {
      id: '1189',
      city: 'Suffolk',
      score: 68,
      status: 'red',
      issue: 'Truck delay affecting 3 aisles',
    },
    {
      id: '2470',
      city: 'Portsmouth',
      score: 87,
      status: 'yellow',
      issue: 'Checkout wait above target',
    },
    {
      id: '1902',
      city: 'Hampton',
      score: 95,
      status: 'green',
      issue: 'Running normally',
    },
  ];

  readonly executiveRecommendations = [
    {
      icon: 'water_drop',
      title: 'Prevent a bottled-water stockout',
      action: 'Move 3 cases to the floor by 3:30 PM.',
      value: '$420 sales protected',
      confidence: 94,
    },
    {
      icon: 'point_of_sale',
      title: 'Open Register 5 at 5:05 PM',
      action: 'Predicted rush begins at 5:14 PM.',
      value: '43% lower wait time',
      confidence: 92,
    },
    {
      icon: 'local_shipping',
      title: 'Adjust today’s receiving plan',
      action: 'Truck DT-4821 is projected 18 minutes late.',
      value: '36 labor minutes recovered',
      confidence: 89,
    },
    {
      icon: 'storefront',
      title: 'Increase cleaning allocation',
      action: 'Regional demand is 34% above last week.',
      value: '12% shipment increase',
      confidence: 91,
    },
  ];

  readonly weeklySchedule = [
    {
      day: 'Monday',
      date: 'Jul 27',
      time: '9:00 AM–5:00 PM',
      role: 'Stocking + Customer Support',
      status: 'Complete',
    },
    {
      day: 'Tuesday',
      date: 'Jul 28',
      time: '9:00 AM–5:00 PM',
      role: 'Stocking + Customer Support',
      status: 'Complete',
    },
    {
      day: 'Wednesday',
      date: 'Jul 29',
      time: '9:00 AM–5:00 PM',
      role: 'Stocking + Customer Support',
      status: 'Today',
    },
    {
      day: 'Thursday',
      date: 'Jul 30',
      time: '11:00 AM–7:00 PM',
      role: 'Sales Floor',
      status: 'Scheduled',
    },
    {
      day: 'Friday',
      date: 'Jul 31',
      time: 'Off',
      role: 'Day off',
      status: 'Off',
    },
    {
      day: 'Saturday',
      date: 'Aug 1',
      time: '8:00 AM–4:00 PM',
      role: 'Truck + Stocking',
      status: 'Scheduled',
    },
    {
      day: 'Sunday',
      date: 'Aug 2',
      time: 'Off',
      role: 'Day off',
      status: 'Off',
    },
  ];

  readonly zeroSalesByProduct: Record<
    string,
    {
      unitsToday: number;
      lastSale: string;
      zeroSalesHours: number;
      expectedDaily: number;
    }
  > = {
    DT1001: {
      unitsToday: 0,
      lastSale: 'Yesterday at 6:42 PM',
      zeroSalesHours: 17,
      expectedDaily: 12,
    },
    DT1007: {
      unitsToday: 8,
      lastSale: 'Today at 10:18 AM',
      zeroSalesHours: 0,
      expectedDaily: 14,
    },
    DT1010: {
      unitsToday: 3,
      lastSale: 'Today at 9:56 AM',
      zeroSalesHours: 0,
      expectedDaily: 7,
    },
    DT1016: {
      unitsToday: 0,
      lastSale: '2 days ago at 4:11 PM',
      zeroSalesHours: 42,
      expectedDaily: 6,
    },
    DT1019: {
      unitsToday: 1,
      lastSale: 'Today at 8:37 AM',
      zeroSalesHours: 0,
      expectedDaily: 4,
    },
  };

  readonly categories = [
    {
      name: 'Halloween',
      icon: '🎃',
      tone: 'orange',
      prompt: "I'm decorating for Halloween.",
    },
    { name: 'Toys', icon: '🚒', tone: 'blue', prompt: 'Show me toys.' },
    {
      name: 'Floral & Vases',
      icon: '🏺',
      tone: 'cream',
      prompt: 'Show me floral and vases.',
    },
    {
      name: 'Batteries',
      icon: '🔋',
      tone: 'green',
      prompt: 'Where are batteries?',
    },
    { name: 'Hardware', icon: '🧰', tone: 'navy', prompt: 'Show me hardware.' },
    {
      name: 'Dinnerware',
      icon: '🍽️',
      tone: 'gray',
      prompt: 'Show me dinnerware.',
    },
    { name: 'Health', icon: '🪥', tone: 'mint', prompt: 'Show me health.' },
    { name: 'Beauty', icon: '🧴', tone: 'pink', prompt: 'Show me beauty.' },
    {
      name: 'Storage',
      icon: '🫙',
      tone: 'aqua',
      prompt: 'Is there more storage bins?',
    },
    { name: 'Food', icon: '🌭', tone: 'yellow', prompt: 'Show me food.' },
    { name: 'Snacks', icon: '🍪', tone: 'brown', prompt: 'Show me snacks.' },
    {
      name: 'Beverages',
      icon: '💧',
      tone: 'sky',
      prompt: 'Show me beverages.',
    },
    {
      name: 'Food Storage',
      icon: '🥡',
      tone: 'mint',
      prompt: 'Show me food storage.',
    },
  ];

  readonly deals = [
    { icon: '💌', name: 'Greeting Cards', note: 'Select styles', price: '$1' },
    { icon: '🥤', name: 'Party Cups', note: '20 count', price: '$1' },
    { icon: '📓', name: 'School Notebooks', note: 'Wide ruled', price: '$1' },
    {
      icon: '🍬',
      name: 'Select Candy',
      note: 'Movie night favorites',
      price: '$1',
    },
  ];

  readonly storeSections = [
    { aisle: '1', name: 'Dollar Zone', className: 'dollar' },
    { aisle: '2', name: 'School', className: 'school' },
    { aisle: '3', name: 'Party', className: 'party' },
    { aisle: '4', name: 'Snacks', className: 'food' },
    { aisle: '5', name: 'Drinks', className: 'drinks' },
    { aisle: '6', name: 'Cleaning', className: 'home' },
    { aisle: '7', name: 'Kitchen', className: 'kitchen' },
    { aisle: '8', name: 'Health', className: 'health' },
    { aisle: '9', name: 'Storage', className: 'storage' },
    { aisle: '10', name: 'Hardware', className: 'hardware' },
    { aisle: '11', name: 'Refrigerated', className: 'cold' },
    { aisle: '12', name: 'Seasonal', className: 'seasonal' },
  ];

  readonly kpis = [
    {
      icon: 'local_shipping',
      label: 'Truck #204',
      value: 'Arrived 10:56 AM',
      tone: 'green',
    },
    { icon: 'shelves', label: 'Aisle 7', value: '92% stocked', tone: 'blue' },
    {
      icon: 'inventory_2',
      label: 'Backroom',
      value: '1,245 items waiting',
      tone: 'amber',
    },
    {
      icon: 'groups',
      label: 'Checkout wait',
      value: '2 minutes',
      tone: 'purple',
    },
  ];

  readonly initialMessages: ChatMessage[] = [
    {
      author: 'bucky',
      text: "👋 Hi! I'm Bucky. Welcome to Dollar Tree 2031.",
      detail:
        'I use Solink Vision AI to help you find products, save money, discover deals, and shop faster than ever. What can I help you find today?',
    },
  ];

  messages: ChatMessage[] = [...this.initialMessages];

  get selectedStore() {
    return (
      this.data.stores.find(
        (store) => store.storeId === this.selectedStoreId,
      ) ?? this.data.stores[0]
    );
  }

  get products(): FutureProduct[] {
    let products = this.data.productsForStore(this.selectedStoreId);
    const query = this.searchText.trim().toLowerCase();
    if (query) {
      products = products.filter((product) =>
        `${product.name} ${product.category}`.toLowerCase().includes(query),
      );
    }
    if (this.selectedCategory === 'Dollar Zone') {
      products = products.filter((product) => product.dollarZone);
    } else if (this.selectedCategory !== 'All') {
      products = products.filter(
        (product) => product.category === this.selectedCategory,
      );
    }
    return products;
  }

  get cartCount(): number {
    return Object.values(this.data.cart()).reduce(
      (sum, count) => sum + count,
      0,
    );
  }

  get cartTotal(): number {
    return Object.entries(this.data.cart()).reduce((sum, [id, quantity]) => {
      const product = this.data
        .products()
        .find((item) => item.productId === id);
      return sum + (product?.price ?? 0) * quantity;
    }, 0);
  }

  get lowStockProducts(): FutureProduct[] {
    return this.data
      .products()
      .filter((product) =>
        ['Low Stock', 'Out of Stock', 'In Backroom', 'Restocking Now'].includes(
          product.inventoryStatus,
        ),
      );
  }

  get dollarProducts(): FutureProduct[] {
    return this.data
      .productsForStore(this.selectedStoreId)
      .filter((product) => product.dollarZone);
  }

  get employeeRoleLabel(): string {
    return {
      associate: 'Sales Floor Associate',
      asm: 'Assistant Store Manager',
      sm: 'Store Manager',
      dm: 'District Manager',
    }[this.employeeRole];
  }

  get recommendedProducts(): FutureProduct[] {
    const products = this.data
      .productsForStore(this.selectedStoreId)
      .filter((product) => product.totalInventory > 0);
    const preferenceCategories: Record<string, string[]> = {
      'Deals & Dollar Zone': ['The Dollar Zone'],
      'Party Planning': ['Party Supplies', 'Snacks', 'Drinks'],
      'Home & Organization': ['Home Organization', 'Cleaning'],
      'School & Classroom': ['School Supplies'],
      'Snacks & Movie Night': ['Snacks', 'Drinks'],
      'Seasonal Finds': ['Seasonal'],
    };
    const categories = preferenceCategories[this.customerPreference] ?? [];
    const matches = products.filter((product) =>
      categories.includes(product.category),
    );
    const baseResults = (matches.length ? matches : products).slice(0, 3);

    const recommendedNames = baseResults.map((product) =>
      product.name.toLowerCase(),
    );
    const complementary = this.recommender
      .getComplementaryRecommendations(this.customerPreference)
      .map((item) => item.name)
      .filter((name) => !recommendedNames.includes(name.toLowerCase()));

    const complementaryProducts = complementary
      .map(
        (name) =>
          products.find((product) =>
            product.name.toLowerCase().includes(name.toLowerCase()),
          ) ??
          products.find((product) =>
            product.category.toLowerCase().includes('dollar'),
          ),
      )
      .filter((product): product is FutureProduct => Boolean(product));

    return [...baseResults, ...complementaryProducts].slice(0, 4);
  }

  selectCategory(category: string): void {
    const categoryMap: Record<string, string> = {
      Halloween: 'Seasonal',
      Toys: 'Toys',
      'Floral & Vases': 'Home Organization',
      Batteries: 'Batteries',
      Hardware: 'Home Organization',
      Dinnerware: 'Home Organization',
      Storage: 'Home Organization',
      Food: 'Snacks',
      Beverages: 'Drinks',
      'Food Storage': 'Home Organization',
    };
    this.selectedCategory = categoryMap[category] ?? category;
    this.searchText = '';
    document
      .querySelector('.product-catalog')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  get taskCompletion(): number {
    const tasks = this.data.tasks();
    return tasks.length
      ? Math.round(
          (tasks.filter((task) => task.status === 'Complete').length /
            tasks.length) *
            100,
        )
      : 0;
  }

  get orderedTasks(): EmployeeTask[] {
    return [...this.data.tasks()].sort((a, b) => {
      const aComplete = a.status === 'Complete' ? 1 : 0;
      const bComplete = b.status === 'Complete' ? 1 : 0;
      return aComplete - bComplete;
    });
  }

  get mapPanelProducts(): FutureProduct[] {
    const products = this.data.productsForStore(this.selectedStoreId);
    if (this.selectedMapDepartment) {
      return products
        .filter((product) => product.category === this.selectedMapDepartment)
        .slice(0, 9);
    }
    return products
      .filter((product) => product.aisle === this.highlightedAisle)
      .slice(0, 9);
  }

  get missionProducts(): FutureProduct[] {
    return this.missionProductIds
      .map((id) =>
        this.data
          .productsForStore(this.selectedStoreId)
          .find((product) => product.productId === id),
      )
      .filter((product): product is FutureProduct => Boolean(product));
  }

  get backroomResults(): FutureProduct[] {
    const query = this.backroomSearch.trim().toLowerCase();
    return this.data
      .products()
      .filter(
        (product) =>
          product.backroomQuantity > 0 &&
          (!query ||
            `${product.name} ${product.category}`
              .toLowerCase()
              .includes(query)),
      )
      .sort((a, b) => b.backroomQuantity - a.backroomQuantity)
      .slice(0, 6);
  }

  get optimizedCartRoute(): FutureProduct[] {
    const ids = Object.keys(this.data.cart());
    return ids
      .map((id) =>
        this.data
          .productsForStore(this.selectedStoreId)
          .find((product) => product.productId === id),
      )
      .filter((product): product is FutureProduct => Boolean(product))
      .sort((a, b) => a.aisle - b.aisle);
  }

  get searchSuggestions(): string[] {
    const term = this.searchText.trim().toLowerCase();
    if (!term) return [];
    const suggestions = [
      'Birthday decorations',
      'Birthday candles',
      'Birthday balloons',
      'Gift bags',
      'Party favors',
      'Wrapping paper',
      'Paper towels',
      'Paper plates',
    ];
    return suggestions
      .filter((item) => item.toLowerCase().includes(term))
      .slice(0, 6);
  }

  setView(view: ViewMode): void {
    this.mobileMenuOpen = false;
    if (
      view === 'manager' &&
      (!this.employeeLoggedIn || this.employeeRole === 'associate')
    ) {
      this.activeView = 'employee';
    } else if (view === 'employee' && !this.employeeLoggedIn) {
      this.activeView = 'employee';
    } else {
      this.activeView = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loginEmployee(): void {
    if (this.employeeId === '2031' && this.employeePin === '1234') {
      this.employeeLoggedIn = true;
      this.loginError = '';
      return;
    }
    this.loginError =
      'Use the fictional demo credentials: Employee ID 2031 and PIN 1234.';
  }

  openCustomerAccount(): void {
    this.customerAccountOpen = true;
    this.accountMessage = '';
  }

  loginCustomer(): void {
    if (!this.customerEmail.includes('@')) {
      this.accountMessage =
        'Enter a valid email address for this simulated account.';
      return;
    }
    this.customerLoggedIn = true;
    this.customerAccountOpen = false;
    localStorage.setItem(
      'dt2031-customer-profile',
      JSON.stringify({
        name: this.customerName || 'Value Shopper',
        email: this.customerEmail,
        preference: this.customerPreference,
      }),
    );
    this.messages.push({
      author: 'bucky',
      text: `Welcome${this.customerName ? `, ${this.customerName}` : ''}! Your recommendations are ready.`,
      detail: `I’ll prioritize ${this.customerPreference.toLowerCase()} while keeping your selected store and budget in mind.`,
    });
  }

  logoutCustomer(): void {
    this.customerLoggedIn = false;
    this.customerName = '';
    this.customerEmail = '';
    localStorage.removeItem('dt2031-customer-profile');
  }

  submitSocialFind(): void {
    if (!this.shareFindCaption.trim()) {
      this.socialThankYou =
        'Add a short caption before sharing your demo find.';
      return;
    }
    this.socialThankYou =
      'Your find was added to the simulated #DollarTree community wall!';
    setTimeout(() => {
      this.shareFindOpen = false;
      this.shareFindCaption = '';
      this.socialThankYou = '';
    }, 1400);
  }

  updatePreference(preference: string): void {
    this.customerPreference = preference;
    if (this.customerLoggedIn) {
      localStorage.setItem(
        'dt2031-customer-profile',
        JSON.stringify({
          name: this.customerName,
          email: this.customerEmail,
          preference,
        }),
      );
    }
  }

  logoutEmployee(): void {
    this.employeeLoggedIn = false;
    this.employeeId = '';
    this.employeePin = '';
    this.activeView = 'employee';
  }

  setAssociateRole(role: EmployeeRole): void {
    this.employeeRole = role;
    if (role !== 'associate') this.activeView = 'manager';
  }

  advanceAssociateDemo(): void {
    this.associateDemoScene = (this.associateDemoScene + 1) % 8;
  }

  goToEmployeeSection(sectionId: string): void {
    if (sectionId === 'associate-hub') this.teamChatOpen = true;
    setTimeout(() =>
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }

  selectStore(storeId: string): void {
    this.selectedStoreId = storeId;
    this.currentProduct = null;
  }

  showOnMap(product: FutureProduct): void {
    this.currentProduct = product;
    this.highlightedAisle = product.aisle;
    this.activeView = 'map';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openStoreMap(): void {
    this.mobileMenuOpen = false;
    this.activeView = 'map';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  exploreDepartment(category: string, aisle?: number): void {
    this.selectedMapDepartment = category;
    if (aisle) this.highlightedAisle = aisle;
    const first = this.data
      .productsForStore(this.selectedStoreId)
      .find(
        (product) =>
          product.category === category && (!aisle || product.aisle === aisle),
      );
    if (first) this.currentProduct = first;
  }

  exploreAisle(aisle: number): void {
    this.highlightedAisle = aisle;
    this.selectedMapDepartment = '';
    this.currentProduct =
      this.data
        .productsForStore(this.selectedStoreId)
        .find((product) => product.aisle === aisle) ?? null;
  }

  findFromMap(): void {
    const product = this.findProduct(this.searchText.toLowerCase());
    if (!product) {
      this.chatOpen = true;
      this.useQuickAction(`Help me find ${this.searchText}`);
      return;
    }
    this.currentProduct = product;
    this.highlightedAisle = product.aisle;
    this.selectedMapDepartment = product.category;
    this.messages.push({
      author: 'bucky',
      text: `I found ${product.name} in ${product.category}, Aisle ${product.aisle}.`,
      detail: `${product.section}. Estimated walk: ${24 + product.aisle * 2} seconds. The route is highlighted on the map.`,
      type: 'map',
      products: [product],
    });
  }

  takeMeThere(product: FutureProduct): void {
    this.currentProduct = product;
    this.highlightedAisle = product.aisle;
    this.selectedMapDepartment = product.category;
    this.activeView = 'map';
  }

  startMission(name: string, productIds: string[]): void {
    this.missionName = name;
    this.missionProductIds = productIds;
    const products = this.missionProducts;
    products.forEach((product) => {
      if (product.shelfQuantity > 0 && !this.data.cart()[product.productId]) {
        this.data.addToCart(product.productId);
      }
    });
    if (products[0]) this.takeMeThere(products[0]);
    this.messages.push({
      author: 'bucky',
      text: `${name} mission ready! I added ${products.length} stops and optimized them by aisle.`,
      detail: `Estimated route: ${products.length * 52 + 75} feet • About ${Math.max(2, products.length)} minutes.`,
      products,
    });
  }

  clearMission(): void {
    this.missionName = '';
    this.missionProductIds = [];
  }

  missionStopNumber(aisle: number): number {
    return (
      this.missionProducts.findIndex((product) => product.aisle === aisle) + 1
    );
  }

  addProduct(product: FutureProduct): void {
    if (this.data.addToCart(product.productId)) {
      this.messages.push({
        author: 'bucky',
        text: `${product.name} was added to your demo cart.`,
        detail: `The simulated shelf count is now ${Math.max(0, product.shelfQuantity - 1)}. Cart total: $${this.cartTotal.toFixed(2)}.`,
      });
    } else {
      this.messages.push({
        author: 'bucky',
        text: `${product.name} is not available on the shelf right now.`,
        detail:
          product.backroomQuantity > 0
            ? `There are ${product.backroomQuantity} in the backroom. I can help request a restock.`
            : `Expected restock: ${product.expectedRestock}.`,
      });
    }
    this.chatOpen = true;
  }

  askAboutProduct(product: FutureProduct): void {
    this.currentProduct = product;
    this.chatOpen = true;
    this.sendPrompt(`Is ${product.name} in stock?`);
  }

  resetDemo(): void {
    this.data.reset();
    this.messages = [...this.initialMessages];
    this.teamMessages = [this.teamMessages[0]];
    this.currentProduct = null;
    this.demoStep = 0;
    this.demoActive = false;
    this.logoutCustomer();
  }

  async startDemo(): Promise<void> {
    this.demoActive = true;
    this.demoStep = 0;
    this.activeView = 'shop';
    this.chatOpen = true;
    this.sendPrompt('Where are birthday balloons?');
    if (this.arrivalAlertsEnabled) {
      this.simulateStoreArrival();
    } else {
      await this.enableArrivalAlerts();
    }
  }

  nextDemoStep(): void {
    this.demoStep = Math.min(this.demoSteps.length - 1, this.demoStep + 1);
    const actions: Record<number, () => void> = {
      1: () => {
        const balloons = this.data
          .products()
          .find((product) => product.productId === 'DT1010');
        if (balloons) this.showOnMap(balloons);
      },
      2: () => this.sendPrompt('How many birthday balloons are in stock?'),
    };
    actions[this.demoStep]?.();
  }

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
  }

  useQuickAction(prompt: string): void {
    this.chatOpen = true;
    this.sendPrompt(prompt);
  }

  startSimilarSearch(): void {
    this.chatOpen = true;
    this.similarSearchOpen = true;
    this.similarSearchText = this.currentProduct?.name ?? '';
    this.messages.push({
      author: 'bucky',
      text: 'What product would you like an alternative for?',
      detail:
        'Type a product below—try “paper towels,” “toothpaste,” “party cups,” or “storage bins.” I’ll compare similar in-stock options.',
    });
  }

  findSimilarProducts(): void {
    const query = this.similarSearchText.trim().toLowerCase();
    if (!query) return;
    const storeProducts = this.data.productsForStore(this.selectedStoreId);
    const source =
      this.findProduct(query) ??
      storeProducts.find((product) =>
        product.category.toLowerCase().includes(query),
      );
    let matches: FutureProduct[];
    if (source) {
      this.currentProduct = source;
      matches = storeProducts
        .filter(
          (product) =>
            product.productId !== source.productId &&
            product.category === source.category &&
            product.totalInventory > 0,
        )
        .sort((a, b) => a.price - b.price)
        .slice(0, 4);
    } else {
      matches = storeProducts
        .filter(
          (product) =>
            `${product.name} ${product.category}`
              .toLowerCase()
              .includes(query) && product.totalInventory > 0,
        )
        .slice(0, 4);
    }
    this.messages.push({
      author: 'customer',
      text: `Find alternatives for ${this.similarSearchText}`,
    });
    this.messages.push({
      author: 'bucky',
      text: matches.length
        ? `I found ${matches.length} in-stock ${source?.category.toLowerCase() ?? 'matching'} alternatives.`
        : `I couldn’t find a close alternative for “${this.similarSearchText}” at this store.`,
      detail: matches.length
        ? 'Compare price and availability below, then add one or locate it on the map.'
        : 'Try a broader term like cleaning, snacks, school, party, or storage.',
      products: matches,
    });
    this.similarSearchOpen = false;
    this.similarSearchText = '';
  }

  showCategoryInChat(category: string): void {
    const matches = this.data
      .productsForStore(this.selectedStoreId)
      .filter(
        (product) =>
          product.category === category && product.totalInventory > 0,
      )
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);
    this.messages.push({
      author: 'bucky',
      text: `Here are ${matches.length} ${category.toLowerCase()} picks available at ${this.selectedStore.city}.`,
      detail:
        'Tap any item to add it, ask about stock, or open its aisle on the store map.',
      products: matches,
    });
  }

  submitPrompt(): void {
    const prompt = this.promptText.trim();
    if (!prompt) return;
    this.promptText = '';
    this.sendPrompt(prompt);
  }

  selectSuggestion(suggestion: string): void {
    this.searchText = suggestion;
    this.chatOpen = true;
    this.sendPrompt(`Find ${suggestion}`);
  }

  scanBarcode(): void {
    this.scanned = true;
  }

  addAllToCart(count = 6): void {
    const available = this.data
      .productsForStore(this.selectedStoreId)
      .filter((product) => product.shelfQuantity > 0)
      .slice(0, count);
    available.forEach((product) => this.data.addToCart(product.productId));
    this.messages.push({
      author: 'bucky',
      text: `Added ${available.length} value picks to your cart.`,
      detail: `I grouped the items together so they are easy to review. Demo cart total: $${this.cartTotal.toFixed(2)}.`,
    });
  }

  addRecommendations(products: FutureProduct[]): void {
    products
      .filter((product) => product.shelfQuantity > 0)
      .forEach((product) => this.data.addToCart(product.productId));
    this.messages.push({
      author: 'bucky',
      text: `Added ${products.length} recommended items to your demo cart.`,
      detail: `Your updated cart total is $${this.cartTotal.toFixed(2)}.`,
    });
  }

  showRecommendationRoute(products: FutureProduct[]): void {
    if (!products.length) return;
    this.missionName = 'Bucky Recommendations';
    this.missionProductIds = products.map((product) => product.productId);
    this.takeMeThere(products[0]);
  }

  findCheaperRecommendations(products: FutureProduct[]): void {
    const cheaper = this.data
      .productsForStore(this.selectedStoreId)
      .filter(
        (product) =>
          product.totalInventory > 0 &&
          products.every((item) => item.productId !== product.productId),
      )
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);
    this.messages.push({
      author: 'bucky',
      text: 'Here are lower-price options available now.',
      detail: 'Prices and inventory are simulated for this concept store.',
      products: cheaper,
    });
  }

  explainRecommendation(): void {
    this.messages.push({
      author: 'bucky',
      text: 'Why I recommended these',
      detail:
        'These suggestions complete the shopping goal you described while favoring frequently paired items, in-stock products, and lower-cost options. You stay in control of what gets added.',
    });
  }

  toggleVoice(): void {
    const browserWindow = window as any;
    const Recognition =
      browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      this.messages.push({
        author: 'bucky',
        text: 'Voice input is not available in this browser.',
        detail: 'You can still type your question below.',
      });
      return;
    }
    this.voiceEnabled = true;
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.promptText = transcript;
      this.submitPrompt();
    };
    recognition.onend = () => (this.voiceEnabled = false);
    recognition.onerror = () => (this.voiceEnabled = false);
    recognition.start();
  }

  readLastResponse(): void {
    const response = [...this.messages]
      .reverse()
      .find((message) => message.author === 'bucky');
    if (response && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(
          `${response.text} ${response.detail ?? ''}`,
        ),
      );
    }
  }

  async enableArrivalAlerts(): Promise<void> {
    if (this.arrivalAlertsEnabled) {
      this.simulateStoreArrival();
      return;
    }
    if (!('Notification' in window)) {
      this.arrivalAlertMessage =
        'Browser notifications are not supported here. The in-app arrival demo is ready.';
      this.arrivalAlertsEnabled = true;
      localStorage.setItem('dt2031-arrival-alerts', 'true');
      this.simulateStoreArrival();
      return;
    }
    const permission = await Notification.requestPermission();
    this.arrivalAlertsEnabled = permission === 'granted';
    localStorage.setItem(
      'dt2031-arrival-alerts',
      String(this.arrivalAlertsEnabled),
    );
    this.arrivalAlertMessage = this.arrivalAlertsEnabled
      ? 'Arrival alerts are on. Simulating your first store welcome now.'
      : 'Notification permission was not enabled.';
    if (this.arrivalAlertsEnabled) {
      this.simulateStoreArrival();
    } else {
      this.arrivalWelcomeOpen = true;
    }
  }

  simulateStoreArrival(): void {
    if (!this.arrivalAlertsEnabled) {
      this.arrivalAlertMessage = 'Turn on arrival alerts first.';
      return;
    }
    this.arrivalWelcomeOpen = true;
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(
        'Welcome to Dollar Tree, Mike!',
        {
          body: 'Welcome to the Store of the Future in Chesapeake. Bucky has your list, deals, and fastest route ready.',
          icon: 'favicon.svg',
        },
      );
      notification.onclick = () => {
        window.focus();
        this.arrivalWelcomeOpen = true;
        notification.close();
      };
    }
    this.arrivalAlertMessage =
      'Demo arrival detected. Bucky opened your Chesapeake welcome.';
  }

  private sendPrompt(prompt: string): void {
    this.messages.push({ author: 'customer', text: prompt });
    const normalized = prompt.toLowerCase();
    let response: ChatMessage;

    const followUpProduct =
      this.currentProduct &&
      [
        'how many',
        'where is it',
        'in the back',
        'restock',
        'show me',
        'what aisle',
        'how much',
      ].some((phrase) => normalized.includes(phrase))
        ? this.currentProduct
        : undefined;
    const product = this.findProduct(normalized) ?? followUpProduct;
    const category = this.findCategory(normalized);
    const budgetMatch = normalized.match(
      /(?:under|less than|budget(?: of)?)\s*\$?(\d+(?:\.\d{1,2})?)/,
    );
    if (!this.isDollarTreeCustomerQuestion(normalized)) {
      response = {
        author: 'bucky',
        text: 'I can only help with Dollar Tree shopping and store questions.',
        detail:
          'Ask me about products, prices, inventory, aisles, your cart, store services, returns, or shopping plans.',
      };
    } else if (
      normalized.includes('similar') ||
      normalized.includes('alternative')
    ) {
      if (this.currentProduct) {
        const alternatives = this.data
          .productsForStore(this.selectedStoreId)
          .filter(
            (item) =>
              item.category === this.currentProduct?.category &&
              item.productId !== this.currentProduct?.productId &&
              item.totalInventory > 0,
          )
          .sort((a, b) => a.price - b.price)
          .slice(0, 4);
        response = {
          author: 'bucky',
          text: alternatives.length
            ? `Here are alternatives to ${this.currentProduct.name}.`
            : `I don’t see a close in-stock alternative to ${this.currentProduct.name}.`,
          detail: alternatives.length
            ? 'These are in the same category and sorted by price.'
            : 'Open Similar Products to search for something else.',
          products: alternatives,
        };
      } else {
        response = {
          author: 'bucky',
          text: 'Tell me what item you want an alternative for.',
          detail: 'Use the Similar Products search below to enter any product.',
        };
        this.similarSearchOpen = true;
      }
    } else if (
      budgetMatch &&
      !(normalized.includes('party') || normalized.includes('birthday'))
    ) {
      const budget = Number(budgetMatch[1]);
      const candidates = this.data
        .productsForStore(this.selectedStoreId)
        .filter(
          (item) =>
            item.price <= budget &&
            item.totalInventory > 0 &&
            (!category || item.category === category),
        )
        .sort((a, b) => a.price - b.price)
        .slice(0, 4);
      response = {
        author: 'bucky',
        text: `I found ${candidates.length} available products under $${budget.toFixed(2)}.`,
        detail: `These are the best lower-price matches at ${this.selectedStore.city}.`,
        products: candidates,
      };
    } else if (product) {
      this.currentProduct = product;
      this.highlightedAisle = product.aisle;
      response = this.productResponse(product, normalized);
      const pairings = this.getProductPairings(product);
      response.detail =
        `${response.detail ?? ''} ${pairings.length ? 'Complete your trip with the recommendations below.' : ''}`.trim();
      response.products = [product];
      response.recommendations = pairings;
    } else if (category) {
      const matches = this.data
        .productsForStore(this.selectedStoreId)
        .filter((item) => item.category === category && item.totalInventory > 0)
        .sort((a, b) => a.price - b.price)
        .slice(0, 4);
      response = {
        author: 'bucky',
        text: `I found ${matches.length} available ${category.toLowerCase()} products.`,
        detail:
          'Choose one below to check stock, add it to your cart, or see it on the map.',
        products: matches,
      };
    } else if (normalized.includes('which store')) {
      response = {
        author: 'bucky',
        text: 'This concept demo uses one newly built location: Dollar Tree Future Store #2031.',
        detail:
          'A fictional store-of-the-future concept located in Chesapeake, Virginia.',
      };
    } else if (
      normalized.includes('$1') ||
      normalized.includes('dollar zone')
    ) {
      const dollarItems = this.data
        .productsForStore(this.selectedStoreId)
        .filter((item) => item.dollarZone);
      response = {
        author: 'bucky',
        text: `The Dollar Zone has ${dollarItems.length} selected $1 products at ${this.selectedStore.city}.`,
        detail:
          'The Dollar Zone is in Aisle 1 near the entrance. Not every store item costs $1.',
        type: 'deals',
        items: dollarItems.slice(0, 7).map((item) => item.name),
      };
    } else if (normalized.includes('arriving today')) {
      const arriving = this.data
        .productsForStore(this.selectedStoreId)
        .filter((item) => item.inventoryStatus === 'Arriving Today');
      response = {
        author: 'bucky',
        text: `${arriving.length} product is marked as arriving today.`,
        detail:
          arriving
            .map((item) => `${item.name}: ${item.expectedRestock}`)
            .join(' • ') || 'No arrivals are currently scheduled.',
      };
    } else if (
      normalized.includes('under $3') ||
      normalized.includes('under 3')
    ) {
      const snacks = this.data
        .productsForStore(this.selectedStoreId)
        .filter((item) => item.category === 'Snacks' && item.price < 3);
      response = {
        author: 'bucky',
        text: `I found ${snacks.length} snacks under $3.`,
        detail: snacks
          .map((item) => `${item.name} — $${item.price.toFixed(2)}`)
          .join(' • '),
        type: 'list',
        items: snacks.map((item) => item.name),
      };
    } else if (
      normalized.includes('cheaper') ||
      normalized.includes('alternative')
    ) {
      const valuePick = this.data
        .productsForStore(this.selectedStoreId)
        .filter((item) => item.totalInventory > 0)
        .sort((a, b) => a.price - b.price)[0];
      response = {
        author: 'bucky',
        text: `A lower-cost option is ${valuePick.name} for $${valuePick.price.toFixed(2)}.`,
        detail: `It is in Aisle ${valuePick.aisle} with ${valuePick.totalInventory} available. Tell me what product you want to compare for a closer match.`,
      };
    } else if (
      (normalized.includes('party') || normalized.includes('birthday')) &&
      normalized.includes('under $20')
    ) {
      response = {
        author: 'bucky',
        text: 'Complete the trip with a birthday party bundle for about $18.75.',
        detail:
          'This value-first plan covers the essentials for about eight guests and makes the trip feel complete.',
        type: 'list',
        items: [
          'Birthday balloons',
          'Party cups',
          'Candles',
          'Napkins',
          'Chips',
          'Juice boxes',
        ],
      };
    } else if (normalized.includes('batter')) {
      const complementary =
        this.recommender.getComplementaryRecommendations('batteries');
      const matchingProducts = this.data
        .productsForStore(this.selectedStoreId)
        .filter(
          (item) =>
            complementary.some((recommendation) =>
              item.name
                .toLowerCase()
                .includes(recommendation.name.toLowerCase()),
            ) && item.totalInventory > 0,
        )
        .slice(0, 3);
      response = {
        author: 'bucky',
        text: 'Batteries are in Aisle 8 near Electronics.',
        detail: `Solink sees 21 on the shelf and 53 in the backroom. Estimated walk: 42 seconds. ${complementary.map((item) => item.name).join(' • ')}`,
        type: 'map',
        items: [
          'Enter through the front',
          'Pass Aisle 4',
          'Turn right at Aisle 8',
        ],
        products: matchingProducts,
      };
    } else if (normalized.includes('chip') || normalized.includes('snack')) {
      const complementary =
        this.recommender.getComplementaryRecommendations('chips');
      const matchingProducts = this.data
        .productsForStore(this.selectedStoreId)
        .filter(
          (item) =>
            complementary.some((recommendation) =>
              item.name
                .toLowerCase()
                .includes(recommendation.name.toLowerCase()),
            ) && item.totalInventory > 0,
        )
        .slice(0, 3);
      response = {
        author: 'bucky',
        text: 'I can pair chips with quick add-ons that customers often grab together.',
        detail: complementary.map((item) => item.name).join(' • '),
        type: 'list',
        items: complementary.map((item) => item.name),
        products: matchingProducts,
      };
    } else if (normalized.includes('balloon')) {
      response = {
        author: 'bucky',
        text: 'Birthday balloons are in Party Supplies, Aisle 12.',
        detail:
          'Nearby: gift bags, tissue paper, birthday candles, and wrapping paper.',
        type: 'map',
      };
    } else if (normalized.includes('taco')) {
      response = {
        author: 'bucky',
        text: "Here's a taco-night bundle for about $11.75.",
        detail: 'Everything you need for an easy, budget-friendly dinner.',
        type: 'list',
        items: [
          'Taco shells',
          'Salsa',
          'Cheese',
          'Taco seasoning',
          'Paper plates',
          'Napkins',
        ],
      };
    } else if (normalized.includes('halloween')) {
      response = {
        author: 'bucky',
        text: 'Complete the trip with a Halloween decorating bundle for about $18.50.',
        detail:
          'A festive mix with decorations, candy, pumpkins, LED lights, treat bags, and window clings.',
        type: 'list',
        items: [
          'Decorations',
          'Candy',
          'Mini pumpkins',
          'LED lights',
          'Treat bags',
          'Window clings',
        ],
      };
    } else if (
      normalized.includes('party') ||
      normalized.includes('birthday')
    ) {
      response = {
        author: 'bucky',
        text: 'Complete the trip with a birthday list for 12 guests — estimated total $34.80.',
        detail:
          'I included decorations, tableware, snacks, drinks, candles, and gift bags so the event feels complete.',
        type: 'list',
        items: [
          'Decorations',
          'Plates & napkins',
          'Snacks & drinks',
          'Candles',
          'Gift bags',
        ],
      };
    } else if (normalized.includes('baby shower')) {
      response = {
        author: 'bucky',
        text: 'Complete the trip with a baby shower list for 20 guests — estimated total $42.25.',
        detail:
          'This list covers the table, food, games, and favors so the shower feels fully planned.',
        type: 'list',
        items: [
          'Decorations',
          'Plates',
          'Napkins',
          'Tablecloths',
          'Drinks',
          'Snacks',
          'Games',
          'Gift bags',
        ],
      };
    } else if (normalized.includes('coke')) {
      response = {
        author: 'bucky',
        text: 'Yes — Solink Vision AI detects 18 Coke products on the shelf and 96 in the backroom.',
        detail:
          'An associate is stocking in 12 minutes. Next shipment: tomorrow. Inventory confidence: 99%.',
        type: 'inventory',
      };
    } else if (normalized.includes('storage bin')) {
      response = {
        author: 'bucky',
        text: 'Yes — there are 14 storage bins on the sales floor and 48 in the backroom.',
        detail: 'A restocking cart is currently on its way to Aisle 9.',
        type: 'inventory',
      };
    } else if (normalized.includes('teacher')) {
      response = {
        author: 'bucky',
        text: 'Complete the trip with a classroom essentials bundle for about $19.25.',
        detail:
          'These are practical, high-utility supplies with strong current availability.',
        type: 'list',
        items: [
          'Folders',
          'Markers',
          'Glue',
          'Notebooks',
          'Pencils',
          'Storage bins',
          'Whiteboard supplies',
        ],
      };
    } else if (normalized.includes('surprise')) {
      response = {
        author: 'bucky',
        text: "Today's hidden Treasure Hunt finds are ready.",
        detail:
          'Unexpected bargains selected from high-rated, in-stock discoveries.',
        type: 'deals',
        items: [
          'Glass vase',
          'LED pumpkin',
          'Party cups',
          'Reading glasses',
          'Cleaning brushes',
          'Candles',
          'Storage basket',
        ],
      };
    } else if (normalized.includes('back') || normalized.includes('shelf')) {
      response = {
        author: 'bucky',
        text: 'Yes — Solink Vision AI shows 14 units on the shelf and 36 in the backroom.',
        detail:
          'An associate is stocking now. Estimated shelf availability: 15 minutes.',
        type: 'inventory',
      };
    } else if (
      normalized.includes('truck') ||
      normalized.includes('delivery')
    ) {
      response = {
        author: 'bucky',
        text: 'Delivery operations are restricted to authorized employees.',
        detail:
          'Associates, store managers, and district managers can review truck status after signing into the Employee Portal Demo.',
      };
    } else if (normalized.includes('dollar') || normalized.includes('deal')) {
      response = {
        author: 'bucky',
        text: "Today's featured $1 deals are ready.",
        detail: 'Look for the green Back to $1 shelf tags in store.',
        type: 'deals',
        items: [
          'Greeting cards',
          'Party cups',
          'Notebooks',
          'Kitchen towels',
          'Select candy',
        ],
      };
    } else if (normalized.includes('order')) {
      response = {
        author: 'bucky',
        text: 'Order DT-3184 has been processed.',
        detail:
          'This is simulated order information for the 2031 concept demo.',
      };
    } else if (normalized.includes('close') || normalized.includes('hour')) {
      response = {
        author: 'bucky',
        text: 'This demo store closes at 10:00 PM tonight.',
        detail: 'It opens tomorrow at 8:00 AM.',
      };
    } else if (normalized.includes('ebt')) {
      response = {
        author: 'bucky',
        text: 'Yes, this store accepts EBT for eligible food items.',
        detail: 'Look for the EBT eligible label on product details.',
      };
    } else if (normalized.includes('return')) {
      response = {
        author: 'bucky',
        text: 'Bring the item and your receipt to customer service.',
        detail:
          'Return eligibility depends on the item condition and store policy.',
      };
    } else if (
      normalized.includes('paper towel') ||
      normalized.includes('map')
    ) {
      response = {
        author: 'bucky',
        text: 'Paper towels are in Aisle 7, Home Care.',
        detail: 'They are 120 feet away. Follow the green route past Grocery.',
        type: 'map',
      };
    } else {
      response = {
        author: 'bucky',
        text: `I found a few value-first options for “${prompt}.”`,
        detail:
          'Try asking about an aisle, product stock, a party, today’s truck, or Dollar Deals.',
      };
    }

    this.messages.push(response);
    if (this.voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(response.text));
    }

    setTimeout(() => {
      document.querySelector('.chat-messages')?.scrollTo({
        top: 100000,
        behavior: 'smooth',
      });
    });
  }

  updateTask(task: EmployeeTask, status: string): void {
    this.data.updateTask(task.taskId, status as TaskStatus);
    if (status === 'In Progress') {
      this.activeTaskAssistant = task;
      this.taskAssistantMode = 'working';
      this.taskEscalationMessage = '';
    } else if (status === 'Needs Assistance') {
      this.activeTaskAssistant = task;
      this.taskAssistantMode = 'help';
      this.taskEscalationMessage =
        'Bucky opened help for this task. Try the guided steps or notify a leader.';
    } else if (status === 'Complete') {
      this.activeTaskAssistant = null;
      this.taskEscalationMessage = '';
    }
    this.teamMessages.push({
      author: 'bucky',
      text:
        status === 'Complete'
          ? `${task.name} is complete. I updated the simulated inventory and store KPIs.`
          : `${task.name} is now marked ${status}.`,
    });
  }

  showTaskHelp(task: EmployeeTask): void {
    this.data.updateTask(task.taskId, 'Needs Assistance');
    this.activeTaskAssistant = task;
    this.taskAssistantMode = 'help';
    this.taskEscalationMessage =
      'Tell Bucky what is blocking you, follow the instructions below, or notify a leader.';
  }

  notifyTaskLeader(role: 'SM' | 'DM'): void {
    if (!this.activeTaskAssistant) return;
    this.taskEscalationMessage = `${role === 'SM' ? 'Store Manager Morgan' : 'District Manager Taylor'} was notified about ${this.activeTaskAssistant.name}. This is a simulated escalation for the demo.`;
    this.teamMessages.push({
      author: 'bucky',
      text: this.taskEscalationMessage,
    });
  }

  closeTaskAssistant(): void {
    this.activeTaskAssistant = null;
    this.taskEscalationMessage = '';
  }

  scanEmployeeItem(simulatedProductId?: string): void {
    const value = (simulatedProductId ?? this.employeeScanText)
      .trim()
      .toLowerCase();
    const product = this.data
      .products()
      .find(
        (item) =>
          item.productId.toLowerCase() === value ||
          item.name.toLowerCase().includes(value),
      );
    if (!product) {
      this.scannedEmployeeProduct = null;
      this.employeeScanMessage =
        'Item not found. Try DT1001, DT1016, or a product name.';
      return;
    }
    this.scannedEmployeeProduct = product;
    this.employeeScanText = product.productId;
    this.employeeScanMessage = '';
  }

  get scannedSalesInsight(): {
    unitsToday: number;
    lastSale: string;
    zeroSalesHours: number;
    expectedDaily: number;
  } | null {
    if (!this.scannedEmployeeProduct) return null;
    return (
      this.zeroSalesByProduct[this.scannedEmployeeProduct.productId] ?? {
        unitsToday: 2,
        lastSale: 'Today at 9:24 AM',
        zeroSalesHours: 0,
        expectedDaily: 5,
      }
    );
  }

  submitTeamPrompt(): void {
    const prompt = this.teamPrompt.trim();
    if (!prompt) return;
    this.teamPrompt = '';
    this.sendTeamPrompt(prompt);
  }

  sendTeamPrompt(prompt: string): void {
    this.teamMessages.push({ author: 'employee', text: prompt });
    const query = prompt.toLowerCase();
    const paper = this.data
      .products()
      .find((product) => product.productId === 'DT1001')!;
    const employeeProduct = this.findProduct(query);
    let text = '';
    this.incidentGuide = null;
    this.trainingVideoOpen = false;
    const robberyQuestion =
      query.includes('robbed') ||
      query.includes('robbery') ||
      query.includes('armed person') ||
      query.includes('hold up');
    const supportRoute = this.findSscSupportRoute(query);
    if (
      query.includes('what should i do next') ||
      query.includes('what am i supposed to do')
    ) {
      text =
        'Restock paper towels in Aisle 6. There are 36 packages in the backroom. Bring 20 to Shelf 2 by 10:45 AM. It should take seven minutes.';
    } else if (
      query.includes('urgent message') ||
      query.includes('act now')
    ) {
      text =
        'You have one urgent message. Remove electric balloon pump SKU 406198 from Party and Backroom Bin P-14 now. I can guide you to both locations.';
    } else if (
      query.includes('craft refresh') ||
      query.includes('refresh the craft')
    ) {
      text =
        'Craft refresh: First, get the craft cart from Backroom Zone C. Remove discontinued items. Place the new items using the shelf picture. Take one photo, then press Complete.';
    } else if (
      query.includes('why was this task') ||
      query.includes('why this task')
    ) {
      text =
        'Solink detected a possible low shelf at 9:13 AM. Bucky checked the inventory and found 36 packages in the backroom. Confidence is 94%.';
    } else if (
      query.includes('count looks wrong') ||
      query.includes('shelf count looks wrong')
    ) {
      text =
        'Thanks. Please count the shelf once. Enter the correct number before stocking. Bucky will update the task.';
    } else if (query.includes('show the manager what solink detected')) {
      text =
        'Solink detected a possible low paper-towel shelf at 9:13 AM. Shelf estimate: 4. Backroom: 36. Confidence: 94%. Manager review is available.';
    } else if (!this.isDollarTreeEmployeeQuestion(query)) {
      this.activeSscRoute = null;
      text =
        'I can only help with Dollar Tree work, store procedures, safety, tasks, inventory, customers, schedules, and SSC support. Please ask a work-related question.';
    } else if (robberyQuestion) {
      this.incidentGuide = {
        title: 'Robbery safety response',
        videoTitle: 'Robbery Safety: Protect People First',
        steps: [
          'Stay calm. Do not argue, resist, chase, or try to be a hero.',
          'Follow demands when it is safe to do so. Protect customers and coworkers.',
          'Do not make sudden movements. Notice details only if you can do so safely.',
          'When the person has left and it is safe, move away from danger and call 911.',
          'Lock the doors only if safe, preserve the area, and do not touch items left behind.',
          'Contact the Store Manager and Asset Protection. Follow their reporting instructions.',
        ],
      };
      if (supportRoute) this.activeSscRoute = supportRoute;
      text =
        'Your safety and everyone else’s safety come first. Do not confront or chase the person. When it is safe, call 911, contact your Store Manager, and connect with Asset Protection. I opened the safety steps and training video below.';
    } else if (supportRoute) {
      this.activeSscRoute = supportRoute;
      this.sscCaseNumber = '';
      text = `I can connect you with ${supportRoute.specialist} on the ${supportRoute.team}. This is a ${supportRoute.priority.toLowerCase()} request. Before I connect you, have ${supportRoute.gather.join(', ')} ready.`;
    } else if (
      query.includes('my schedule') ||
      query.includes('work this week') ||
      query.includes('shift this week')
    ) {
      const upcoming = this.weeklySchedule.filter(
        (shift) => shift.status === 'Today' || shift.status === 'Scheduled',
      );
      text = `You have ${upcoming.length} shifts remaining this week: ${upcoming.map((shift) => `${shift.day}, ${shift.time}`).join('; ')}. Your full weekly schedule is shown on this page.`;
    } else if (
      (query.includes('zero sales') ||
        query.includes('on hand') ||
        query.includes('scan')) &&
      this.scannedEmployeeProduct
    ) {
      const insight = this.scannedSalesInsight!;
      text = `${this.scannedEmployeeProduct.name} has ${this.scannedEmployeeProduct.totalInventory} units on hand: ${this.scannedEmployeeProduct.shelfQuantity} on the shelf and ${this.scannedEmployeeProduct.backroomQuantity} in the backroom. ${insight.unitsToday === 0 ? `It has zero sales today and the last sale was ${insight.lastSale}. Verify the shelf location, price label, and item count.` : `${insight.unitsToday} sold today. The last sale was ${insight.lastSale}.`}`;
    } else if (employeeProduct) {
      const pairings = this.getProductPairings(employeeProduct);
      text = `${employeeProduct.name} is in Aisle ${employeeProduct.aisle}, ${employeeProduct.section}. We have ${employeeProduct.shelfQuantity} on the shelf and ${employeeProduct.backroomQuantity} in the backroom. ${pairings.length ? `To help the customer complete the trip, suggest ${pairings.map((item) => `${item.name} ($${item.price.toFixed(2)})`).join(', ')}.` : ''}`;
    } else if (query.includes('priority') || query.includes('stock next')) {
      text = `Stock paper towels next. Go to Aisle 6. There are ${paper.shelfQuantity} on the shelf and ${paper.backroomQuantity} in Backroom B-14. This should take about 8 minutes.`;
    } else if (query.includes('truck') || query.includes('pallet')) {
      text = `Truck ${this.data.truck.truckId} arrived at ${this.data.truck.actualArrival}. ${this.data.truck.palletsUnloaded} of ${this.data.truck.pallets} pallets are unloaded; completion is expected at ${this.data.truck.estimatedCompletion}.`;
    } else if (query.includes('low') || query.includes('attention')) {
      text = `${this.lowStockProducts.length} products need attention. Start with ${this.lowStockProducts
        .slice(0, 3)
        .map((item) => `${item.name} in Aisle ${item.aisle}`)
        .join(', ')}.`;
    } else if (query.includes('backroom')) {
      text = `${paper.name} has ${paper.backroomQuantity} units in Backroom Location B-14. Batteries have 53 units in the backroom, and storage bins have 48.`;
    } else if (query.includes('overdue')) {
      const overdue = this.data
        .tasks()
        .filter(
          (task) => task.status !== 'Complete' && task.dueTime.includes('9:'),
        );
      text = overdue.length
        ? `${overdue.length} task is overdue: ${overdue.map((task) => task.name).join(', ')}.`
        : 'No tasks are currently overdue.';
    } else if (query.includes('damaged')) {
      text =
        'Move the item to the designated damage bin, scan its product ID, select the damage reason, attach a photo in the real workflow, and notify a manager if the item is hazardous.';
    } else if (query.includes('accuracy') || query.includes('mismatch')) {
      text =
        'Three shelf-count mismatches need verification: toothpaste in Aisle 8, cleaning spray in Aisle 6, and storage trays in Aisle 9.';
    } else if (query.includes('customer')) {
      text =
        'Ask for the product name, then check shelf and backroom quantities for Future Store #2031. For unavailable items, offer a similar product or a simulated restock alert.';
    } else if (
      query.includes('how do i stock seasonal') ||
      query.includes('stock seasonal')
    ) {
      text =
        'Step 1: Bring the stocking cart. Step 2: Check the shelf label. Step 3: Put older items in front. Step 4: Fill empty spaces. Step 5: Press Complete.';
    } else if (query.includes('paper towel') && query.includes('go')) {
      text = `Paper towels go in Cleaning Supplies, Aisle 6, Section B, middle shelf. Shelf capacity is 32. Stock ${Math.min(24, paper.backroomQuantity)} more from Backroom B-14.`;
    } else {
      text = `I can help with priorities, inventory, today’s truck, overdue tasks, aisle accuracy, damaged merchandise, and customer questions.`;
    }
    this.teamMessages.push({ author: 'bucky', text });
  }

  createSscCase(): void {
    if (!this.activeSscRoute) return;
    this.sscCaseNumber = `SSC-${Math.floor(100000 + Math.random() * 900000)}`;
    this.teamMessages.push({
      author: 'bucky',
      text: `Your simulated case ${this.sscCaseNumber} is ready for the ${this.activeSscRoute.team}. A ${this.activeSscRoute.specialist} would contact the store through ${this.activeSscRoute.channel}. No real request was submitted.`,
    });
  }

  clearSscRoute(): void {
    this.activeSscRoute = null;
    this.sscCaseNumber = '';
  }

  toggleTrainingVideo(): void {
    this.trainingVideoOpen = !this.trainingVideoOpen;
  }

  private isDollarTreeCustomerQuestion(query: string): boolean {
    const terms = [
      'dollar tree',
      'product',
      'item',
      'find',
      'where',
      'aisle',
      'stock',
      'shelf',
      'backroom',
      'price',
      'cost',
      'deal',
      '$1',
      'dollar zone',
      'cart',
      'party',
      'birthday',
      'baby shower',
      'taco',
      'halloween',
      'snack',
      'drink',
      'clean',
      'battery',
      'balloon',
      'storage',
      'teacher',
      'store',
      'hour',
      'close',
      'return',
      'ebt',
      'order',
      'pickup',
      'map',
      'shop',
      'alternative',
      'similar',
      'under $',
    ];
    return (
      terms.some((term) => query.includes(term)) ||
      Boolean(this.findProduct(query)) ||
      Boolean(this.findCategory(query))
    );
  }

  private isDollarTreeEmployeeQuestion(query: string): boolean {
    const terms = [
      'dollar tree',
      'store',
      'task',
      'priority',
      'stock',
      'aisle',
      'shelf',
      'backroom',
      'inventory',
      'on hand',
      'zero sales',
      'scan',
      'item id',
      'truck',
      'pallet',
      'customer',
      'damage',
      'schedule',
      'shift',
      'manager',
      'associate',
      'ssc',
      'support',
      'asset',
      'shrink',
      'theft',
      'rob',
      'armed',
      'safety',
      'injury',
      'emergency',
      'gold',
      'register',
      'pos',
      'zebra',
      'technology',
      'payroll',
      'benefit',
      'hr',
      'shipment',
      'vendor',
      'delivery',
      'planogram',
      'policy',
    ];
    return (
      terms.some((term) => query.includes(term)) ||
      Boolean(this.findProduct(query)) ||
      Boolean(this.findCategory(query))
    );
  }

  private findSscSupportRoute(query: string): SscSupportRoute | null {
    if (
      query.includes('asset protection') ||
      query.includes('asset protect') ||
      query.includes('shrink') ||
      query.includes('theft') ||
      query.includes('robbed') ||
      query.includes('robbery') ||
      query.includes('armed person') ||
      query.includes('hold up') ||
      query.includes('register exception')
    ) {
      return {
        team: 'SSC Asset Protection Operations',
        specialist: 'Asset Protection Response Specialist',
        channel: 'the secure AP support queue',
        priority:
          query.includes('urgent') || query.includes('safety')
            ? 'Urgent'
            : 'Priority',
        gather: [
          'store number',
          'time of the event',
          'location in the store',
          'incident type',
        ],
      };
    }
    if (
      query.includes('gold score') ||
      query.includes('gold scores') ||
      query.includes('gold metric') ||
      query.includes('store score')
    ) {
      return {
        team: 'SSC GOLD Performance Support',
        specialist: 'Retail Performance Partner',
        channel: 'the operations support queue',
        priority: 'Standard',
        gather: [
          'store number',
          'scorecard period',
          'metric needing review',
          'a screenshot if available',
        ],
      };
    }
    if (
      query.includes('injury') ||
      query.includes('unsafe') ||
      query.includes('safety') ||
      query.includes('emergency')
    ) {
      return {
        team: 'SSC Safety and Risk Support',
        specialist: 'Safety Response Specialist',
        channel: 'the priority safety line',
        priority: 'Urgent',
        gather: [
          'store number',
          'exact location',
          'what happened',
          'whether anyone needs immediate help',
        ],
      };
    }
    if (
      query.includes('register') ||
      query.includes('pos') ||
      query.includes('computer') ||
      query.includes('zebra') ||
      query.includes('technology') ||
      query.includes('system down')
    ) {
      return {
        team: 'SSC Store Technology Help Desk',
        specialist: 'Store Systems Support Analyst',
        channel: 'the technology support queue',
        priority: query.includes('down') ? 'Priority' : 'Standard',
        gather: [
          'store number',
          'device or register number',
          'error message',
          'steps already tried',
        ],
      };
    }
    if (
      query.includes('payroll') ||
      query.includes('schedule') ||
      query.includes('benefit') ||
      query.includes('hr') ||
      query.includes('people support')
    ) {
      return {
        team: 'SSC People Support',
        specialist: 'People Support Advisor',
        channel: 'the confidential people-support queue',
        priority: 'Standard',
        gather: ['employee ID', 'store number', 'topic', 'dates involved'],
      };
    }
    if (
      query.includes('inventory') ||
      query.includes('shipment') ||
      query.includes('invoice') ||
      query.includes('vendor') ||
      query.includes('delivery issue')
    ) {
      return {
        team: 'SSC Inventory and Supply Chain Support',
        specialist: 'Store Inventory Support Analyst',
        channel: 'the inventory support queue',
        priority: 'Standard',
        gather: [
          'store number',
          'item or shipment number',
          'quantity expected',
          'quantity received',
        ],
      };
    }
    if (
      query.includes('ssc') ||
      query.includes('support center') ||
      query.includes('issue in the store') ||
      query.includes('store issue') ||
      query.includes('connect me') ||
      query.includes('right person')
    ) {
      return {
        team: 'SSC Store Operations Support',
        specialist: 'Store Operations Duty Specialist',
        channel: 'the store-support triage queue',
        priority: 'Standard',
        gather: [
          'store number',
          'short issue summary',
          'business impact',
          'help needed',
        ],
      };
    }
    return null;
  }

  private findProduct(query: string): FutureProduct | undefined {
    const products = this.data.productsForStore(this.selectedStoreId);
    return products.find((product) => {
      const terms = product.name
        .toLowerCase()
        .split(' ')
        .filter((term) => term.length > 3);
      return (
        query.includes(product.name.toLowerCase()) ||
        terms.some((term) => query.includes(term))
      );
    });
  }

  private getProductPairings(product: FutureProduct): FutureProduct[] {
    const rules: Array<[string[], string[]]> = [
      [['birthday', 'balloon'], ['banner', 'candle', 'plate', 'cup', 'napkin', 'tablecloth', 'gift bag']],
      [['candle'], ['plate', 'fork', 'napkin', 'balloon', 'party hat', 'lighter']],
      [['paper towel'], ['cleaning spray', 'sponge', 'trash bag', 'glove']],
      [['sponge'], ['dish soap', 'glove', 'scrub brush', 'paper towel']],
      [['cleaner', 'cleaning spray'], ['microfiber', 'spray bottle', 'glove', 'paper towel']],
      [['popcorn'], ['candy', 'soda', 'bowl', 'napkin']],
      [['chip'], ['salsa', 'cheese dip', 'soda', 'plate', 'napkin']],
      [['cookie'], ['milk', 'hot chocolate', 'gift tin', 'napkin']],
      [['water'], ['drink mix', 'sports drink', 'snack', 'cooler']],
      [['soda'], ['cup', 'ice', 'chip', 'candy', 'plate']],
      [['vase'], ['artificial flower', 'floral foam', 'ribbon', 'decorative stone']],
      [['notebook'], ['pen', 'pencil', 'highlighter', 'folder', 'sticky note']],
      [['marker'], ['poster board', 'construction paper', 'glue', 'sticker']],
      [['glue'], ['construction paper', 'craft stick', 'scissor', 'glitter']],
      [['toothpaste'], ['toothbrush', 'floss', 'mouthwash', 'travel case']],
      [['lotion', 'body butter'], ['loofah', 'razor', 'washcloth', 'cosmetic bag']],
      [['battery'], ['flashlight', 'electronics', 'storage case']],
      [['storage bin'], ['label', 'drawer organizer', 'shelf liner', 'basket']],
      [['toy car'], ['play mat', 'sticker', 'storage bin']],
      [['halloween'], ['candy', 'treat bag', 'light', 'battery', 'tablecloth']],
    ];
    const productName = product.name.toLowerCase();
    const terms =
      rules.find(([keywords]) =>
        keywords.some((keyword) => productName.includes(keyword)),
      )?.[1] ?? [];
    const available = this.data
      .productsForStore(this.selectedStoreId)
      .filter(
        (item) =>
          item.productId !== product.productId && item.totalInventory > 0,
      );
    const preferred = available.filter((item) =>
      terms.some((term) =>
        `${item.name} ${item.category}`.toLowerCase().includes(term),
      ),
    );
    return preferred.slice(0, 5);
  }

  private findCategory(query: string): string | undefined {
    const aliases: Record<string, string> = {
      clean: 'Cleaning',
      snack: 'Snacks',
      chip: 'Snacks',
      drink: 'Drinks',
      beverage: 'Drinks',
      battery: 'Batteries',
      batteries: 'Batteries',
      party: 'Party Supplies',
      school: 'School Supplies',
      teacher: 'School Supplies',
      health: 'Health',
      toothpaste: 'Health',
      beauty: 'Beauty',
      cosmetic: 'Beauty',
      toy: 'Toys',
      car: 'Toys',
      storage: 'Home Organization',
      organiz: 'Home Organization',
      seasonal: 'Seasonal',
      halloween: 'Seasonal',
      dollar: 'The Dollar Zone',
    };
    return Object.entries(aliases).find(([term]) => query.includes(term))?.[1];
  }

  inventoryClass(status: string): string {
    return status.toLowerCase().replaceAll(' ', '-');
  }

  isProductPhoto(image: string): boolean {
    return image.startsWith('/');
  }

  private productResponse(product: FutureProduct, query: string): ChatMessage {
    const location = `${product.name} is in Aisle ${product.aisle}, ${product.section}.`;
    if (
      query.includes('where') ||
      query.includes('find') ||
      query.includes('map')
    ) {
      return {
        author: 'bucky',
        text: location,
        detail: `There are ${product.shelfQuantity} on the shelf and ${product.backroomQuantity} in the backroom. Tap below for the highlighted route.`,
        type: 'map',
      };
    }
    if (product.shelfQuantity === 0 && product.backroomQuantity > 0) {
      return {
        author: 'bucky',
        text: `${product.name} is available in the backroom but the shelf is currently empty.`,
        detail: `${product.backroomQuantity} units are in backroom inventory. Status: ${product.inventoryStatus}. An associate can restock the shelf from the backroom.`,
        type: 'inventory',
      };
    }
    if (product.totalInventory === 0) {
      const alternative = this.data
        .productsForStore(this.selectedStoreId)
        .find(
          (item) =>
            item.category === product.category &&
            item.productId !== product.productId &&
            item.totalInventory > 0,
        );
      return {
        author: 'bucky',
        text: `${product.name} is currently out of stock at ${this.selectedStore.city}.`,
        detail: `Expected restock: ${product.expectedRestock}.${alternative ? ` Similar option: ${alternative.name} for $${alternative.price.toFixed(2)}.` : ''}`,
      };
    }
    return {
      author: 'bucky',
      text: `Yes! ${product.totalInventory} ${product.name} units are available at ${this.selectedStore.city}.`,
      detail: `${product.shelfQuantity} on the shelf in Aisle ${product.aisle}, ${product.section}; ${product.backroomQuantity} in the backroom. Price: $${product.price.toFixed(2)}.`,
      type: 'inventory',
    };
  }
}
