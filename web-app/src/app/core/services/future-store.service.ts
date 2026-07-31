import { Injectable, signal } from '@angular/core';

export type InventoryStatus =
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock'
  | 'In Backroom'
  | 'Arriving Today'
  | 'Restocking Now';

export interface FutureStore {
  storeId: string;
  name: string;
  address: string;
  city: string;
  inventoryFactor: number;
}

export interface FutureProduct {
  productId: string;
  name: string;
  image: string;
  category: string;
  price: number;
  storeId: string;
  aisle: number;
  section: string;
  shelfQuantity: number;
  backroomQuantity: number;
  totalInventory: number;
  inventoryStatus: InventoryStatus;
  lastRestocked: string;
  expectedRestock: string;
  pickupAvailable: boolean;
  dollarZone: boolean;
  rating: number;
  description: string;
}

export type TaskStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Complete'
  | 'Needs Assistance';

export interface EmployeeTask {
  taskId: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedEmployee: string;
  location: string;
  dueTime: string;
  estimatedMinutes: number;
  status: TaskStatus;
  relatedProductId?: string;
  instructions: string;
  transferQuantity?: number;
}

export interface TruckDelivery {
  truckId: string;
  distributionCenter: string;
  scheduledArrival: string;
  actualArrival: string;
  status: string;
  pallets: number;
  palletsUnloaded: number;
  estimatedCompletion: string;
  products: string[];
}

const STORES: FutureStore[] = [
  {
    storeId: 'DT-CHESAPEAKE-2031',
    name: 'Dollar Tree Future Store #2031',
    address: 'Future Store Concept Campus',
    city: 'Chesapeake, Virginia',
    inventoryFactor: 1,
  },
];

const PRODUCT_SEEDS = [
  [
    'DT1001',
    'Ultra Soft Paper Towels',
    '🧻',
    'Cleaning',
    1.25,
    6,
    'Section B, Middle Shelf',
    2,
    24,
    'Restocking Now',
    true,
    false,
  ],
  [
    'DT1002',
    'Fresh Home Cleaning Spray',
    '🧴',
    'Cleaning',
    1.25,
    6,
    'Section A, Upper Shelf',
    3,
    8,
    'Low Stock',
    true,
    false,
  ],
  [
    'DT1003',
    'Scrub Sponge 4-Pack',
    '🧽',
    'Cleaning',
    1,
    6,
    'Section C, Lower Shelf',
    18,
    20,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1004',
    'Chocolate Sandwich Cookies',
    '🍪',
    'Snacks',
    1.25,
    4,
    'Section A, Middle Shelf',
    20,
    12,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1005',
    'Sea Salt Potato Chips',
    '🥔',
    'Snacks',
    1.25,
    4,
    'Section B, Upper Shelf',
    9,
    18,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1006',
    'Movie Night Popcorn',
    '🍿',
    'Snacks',
    1,
    4,
    'Section C, Middle Shelf',
    16,
    10,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1007',
    'Spring Water 6-Pack',
    '💧',
    'Drinks',
    2.5,
    5,
    'Section A, Floor Stack',
    8,
    30,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1008',
    'Cola 2-Liter',
    '🥤',
    'Drinks',
    1.75,
    5,
    'Section B, Lower Shelf',
    18,
    96,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1009',
    'Fruit Punch Juice Boxes',
    '🧃',
    'Drinks',
    3,
    5,
    'Section C, Middle Shelf',
    4,
    6,
    'Low Stock',
    true,
    false,
  ],
  [
    'DT1010',
    'Birthday Balloon Set',
    '🎈',
    'Party Supplies',
    1.25,
    3,
    'Section C, Upper Shelf',
    6,
    18,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1011',
    'Colorful Party Cups',
    '🥤',
    'Party Supplies',
    1,
    3,
    'Section A, Middle Shelf',
    22,
    30,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1012',
    'Birthday Candle Set',
    '🕯️',
    'Party Supplies',
    1,
    3,
    'Section B, Upper Shelf',
    15,
    10,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1013',
    'Wide-Ruled School Notebook',
    '📓',
    'School Supplies',
    1,
    2,
    'Section A, Middle Shelf',
    26,
    40,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1014',
    'Washable Marker Set',
    '🖍️',
    'School Supplies',
    1.25,
    2,
    'Section B, Middle Shelf',
    8,
    15,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1015',
    'Glue Stick 4-Pack',
    '✏️',
    'School Supplies',
    1.25,
    2,
    'Section C, Upper Shelf',
    0,
    16,
    'In Backroom',
    true,
    false,
  ],
  [
    'DT1016',
    'Mint Fresh Toothpaste',
    '🪥',
    'Health',
    1.25,
    8,
    'Section A, Middle Shelf',
    10,
    4,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1017',
    'Reading Glasses',
    '👓',
    'Health',
    1,
    8,
    'Section B, Upper Shelf',
    12,
    6,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1018',
    'Daily Hand Lotion',
    '🧴',
    'Beauty',
    1.25,
    8,
    'Section C, Middle Shelf',
    0,
    0,
    'Out of Stock',
    false,
    false,
  ],
  [
    'DT1019',
    'Stackable Storage Bin',
    '🧺',
    'Home Organization',
    5,
    9,
    'Section A, Floor Display',
    14,
    48,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1020',
    'Clear Pantry Container',
    '🫙',
    'Home Organization',
    3,
    9,
    'Section B, Middle Shelf',
    7,
    14,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1021',
    'Drawer Organizer Tray',
    '🗄️',
    'Home Organization',
    1.25,
    9,
    'Section C, Lower Shelf',
    3,
    0,
    'Low Stock',
    true,
    false,
  ],
  [
    'DT1022',
    'LED Pumpkin Lantern',
    '🎃',
    'Seasonal',
    5,
    12,
    'Front Seasonal Display',
    5,
    20,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1023',
    'Harvest Window Clings',
    '🍂',
    'Seasonal',
    1,
    12,
    'Section A, Upper Shelf',
    19,
    12,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1024',
    'Holiday Gift Bags',
    '🎁',
    'Seasonal',
    1,
    12,
    'Section B, Middle Shelf',
    0,
    0,
    'Arriving Today',
    false,
    true,
  ],
  [
    'DT1025',
    'Glass Bud Vase',
    '🏺',
    'The Dollar Zone',
    1,
    1,
    'Dollar Zone, Display 2',
    14,
    22,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1026',
    'Kitchen Towel',
    '🧺',
    'The Dollar Zone',
    1,
    1,
    'Dollar Zone, Display 3',
    11,
    15,
    'In Stock',
    true,
    true,
  ],
  [
    'DT1027',
    'Alkaline Batteries 4-Pack',
    '🔋',
    'Batteries',
    1,
    8,
    'Section D, Middle Shelf',
    0,
    53,
    'In Backroom',
    true,
    true,
  ],
  [
    'DT1028',
    'Red Racer Toy Car',
    '🏎️',
    'Toys',
    1.25,
    10,
    'Section B, Middle Shelf',
    18,
    24,
    'In Stock',
    true,
    false,
  ],
  [
    'DT1029',
    'Tropical Glow Body Butter',
    '/tropical-glow-body-butter.png',
    'Beauty',
    1.25,
    8,
    'Cosmetics Wall, Shelf 2',
    12,
    20,
    'In Stock',
    true,
    false,
  ],
] as const;

const INITIAL_TASKS: EmployeeTask[] = [
  {
    taskId: 'TASK-401',
    name: 'Restock paper towels',
    priority: 'High',
    assignedEmployee: 'Verlaine',
    location: 'Aisle 6',
    dueTime: '10:15 AM',
    estimatedMinutes: 8,
    status: 'Not Started',
    relatedProductId: 'DT1001',
    transferQuantity: 18,
    instructions:
      'Get the case from Backroom B-14. Put older items in front. Confirm the shelf count.',
  },
  {
    taskId: 'TASK-402',
    name: 'Help with seasonal display',
    priority: 'High',
    assignedEmployee: 'Verlaine',
    location: 'Front Display',
    dueTime: '11:00 AM',
    estimatedMinutes: 15,
    status: 'In Progress',
    relatedProductId: 'DT1022',
    instructions: 'Move LED pumpkins to the front seasonal display.',
  },
  {
    taskId: 'TASK-403',
    name: 'Check toothpaste shelf count',
    priority: 'Medium',
    assignedEmployee: 'Verlaine',
    location: 'Aisle 8',
    dueTime: '11:30 AM',
    estimatedMinutes: 5,
    status: 'Not Started',
    relatedProductId: 'DT1016',
    instructions: 'Count the items. Compare the count with Bucky.',
  },
  {
    taskId: 'TASK-404',
    name: 'Unload Pallet 4',
    priority: 'High',
    assignedEmployee: 'Receiving Team',
    location: 'Loading Area',
    dueTime: '9:25 AM',
    estimatedMinutes: 12,
    status: 'In Progress',
    instructions: 'Scan each case before moving it to Backroom Zone C.',
  },
  {
    taskId: 'TASK-405',
    name: 'Fix price label',
    priority: 'Medium',
    assignedEmployee: 'Verlaine',
    location: 'Aisle 9',
    dueTime: '1:00 PM',
    estimatedMinutes: 4,
    status: 'Not Started',
    relatedProductId: 'DT1019',
    instructions: 'Replace the old label with the current $5.00 price.',
  },
  {
    taskId: 'TASK-406',
    name: 'Clean checkout area',
    priority: 'Low',
    assignedEmployee: 'Verlaine',
    location: 'Checkout',
    dueTime: '2:30 PM',
    estimatedMinutes: 10,
    status: 'Not Started',
    instructions: 'Clear the counter. Check the floor. Refill bags.',
  },
  {
    taskId: 'TASK-407',
    name: 'Help customer in Party',
    priority: 'Medium',
    assignedEmployee: 'Verlaine',
    location: 'Aisle 3',
    dueTime: '10:05 AM',
    estimatedMinutes: 6,
    status: 'Complete',
    relatedProductId: 'DT1010',
    instructions: 'Help find birthday balloons and tableware.',
  },
];

const TRUCK: TruckDelivery = {
  truckId: 'DT-4821',
  distributionCenter: 'Chesapeake Regional Distribution Center',
  scheduledArrival: '8:30 AM',
  actualArrival: '8:42 AM',
  status: 'Unloading',
  pallets: 10,
  palletsUnloaded: 8,
  estimatedCompletion: '9:35 AM',
  products: [
    'Paper towels',
    'Gift bags',
    'Cleaning spray',
    'Juice boxes',
    'Seasonal décor',
  ],
};

@Injectable({ providedIn: 'root' })
export class FutureStoreService {
  private readonly storageKey = 'dt2031-demo-state-v7';
  readonly stores = STORES;
  readonly truck = TRUCK;
  readonly products = signal<FutureProduct[]>([]);
  readonly tasks = signal<EmployeeTask[]>([]);
  readonly cart = signal<Record<string, number>>({});

  constructor() {
    this.load();
  }

  productsForStore(storeId: string): FutureProduct[] {
    return this.products().map((product) => ({ ...product, storeId }));
  }

  addToCart(productId: string): boolean {
    const product = this.products().find(
      (item) => item.productId === productId,
    );
    if (!product || product.shelfQuantity < 1) return false;
    this.products.update((items) =>
      items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              shelfQuantity: item.shelfQuantity - 1,
              totalInventory: item.totalInventory - 1,
              inventoryStatus: this.statusFor(
                item.shelfQuantity - 1,
                item.backroomQuantity,
                item.inventoryStatus,
              ),
            }
          : item,
      ),
    );
    this.cart.update((cart) => ({
      ...cart,
      [productId]: (cart[productId] ?? 0) + 1,
    }));
    this.save();
    return true;
  }

  updateTask(taskId: string, status: TaskStatus): void {
    const task = this.tasks().find((item) => item.taskId === taskId);
    if (!task) return;
    const wasComplete = task.status === 'Complete';
    this.tasks.update((tasks) =>
      tasks.map((item) =>
        item.taskId === taskId ? { ...item, status } : item,
      ),
    );
    if (
      status === 'Complete' &&
      !wasComplete &&
      task.relatedProductId &&
      task.transferQuantity
    ) {
      this.products.update((products) =>
        products.map((product) => {
          if (product.productId !== task.relatedProductId) return product;
          const moved = Math.min(
            task.transferQuantity ?? 0,
            product.backroomQuantity,
          );
          return {
            ...product,
            shelfQuantity: product.shelfQuantity + moved,
            backroomQuantity: product.backroomQuantity - moved,
            totalInventory: product.totalInventory,
            inventoryStatus: 'In Stock',
            lastRestocked: 'Just now by Verlaine',
          };
        }),
      );
    }
    this.save();
  }

  reset(): void {
    localStorage.removeItem(this.storageKey);
    this.load(true);
  }

  private load(force = false): void {
    const saved = !force ? localStorage.getItem(this.storageKey) : null;
    if (saved) {
      try {
        const state = JSON.parse(saved);
        this.products.set(state.products);
        this.tasks.set(state.tasks);
        this.cart.set(state.cart ?? {});
        return;
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }
    this.products.set(
      PRODUCT_SEEDS.map((seed) => {
        const [
          productId,
          name,
          image,
          category,
          price,
          aisle,
          section,
          shelfQuantity,
          backroomQuantity,
          inventoryStatus,
          pickupAvailable,
          dollarZone,
        ] = seed;
        return {
          productId,
          name,
          image,
          category,
          price,
          storeId: 'DT-CHESAPEAKE-2031',
          aisle,
          section,
          shelfQuantity,
          backroomQuantity,
          totalInventory: shelfQuantity + backroomQuantity,
          inventoryStatus: inventoryStatus as InventoryStatus,
          lastRestocked: shelfQuantity
            ? 'Today at 9:15 AM'
            : 'Yesterday at 4:20 PM',
          expectedRestock:
            inventoryStatus === 'Out of Stock'
              ? 'Wednesday at 8:30 AM'
              : inventoryStatus === 'Arriving Today'
                ? 'Today by 11:30 AM'
                : 'No additional delivery needed',
          pickupAvailable,
          dollarZone,
          rating: 4.2 + (Number(productId.slice(-1)) % 7) / 10,
          description: `Reliable ${category.toLowerCase()} value selected for the 2031 concept store.`,
        } satisfies FutureProduct;
      }),
    );
    this.tasks.set(structuredClone(INITIAL_TASKS));
    this.cart.set({});
    this.save();
  }

  private statusFor(
    shelf: number,
    backroom: number,
    fallback: InventoryStatus,
  ): InventoryStatus {
    if (shelf === 0 && backroom === 0)
      return fallback === 'Arriving Today' ? 'Arriving Today' : 'Out of Stock';
    if (shelf === 0 && backroom > 0) return 'In Backroom';
    if (shelf + backroom < 5) return 'Low Stock';
    return fallback === 'Restocking Now' ? 'Restocking Now' : 'In Stock';
  }

  private save(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        products: this.products(),
        tasks: this.tasks(),
        cart: this.cart(),
      }),
    );
  }
}
