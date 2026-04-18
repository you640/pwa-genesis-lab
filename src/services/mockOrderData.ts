import { Order, CartItem } from '../types';

const mockCartItems: CartItem[] = [
    {
        product: {
            id: '429',
            name: 'Boldelad 250 mg/ml (Boldenone Undecylenate) 10ml vial',
            price: 39,
            category: 'Boldenone undecylenate',
            description: 'Unleash a new level of endurance and achieve rock-solid, quality muscle with Boldelad 250.',
            imageUrl: 'http://isteroidi.it/img/p/8/9/6/896.jpg',
            inStock: true,
            manufacturer: 'Generic Labs'
        },
        quantity: 2,
    },
    {
        product: {
            id: '74',
            name: 'Danabol Balkan Pharma (10 mg/tab) 60 tabs',
            price: 31,
            category: 'Methandienone Injection',
            description: 'The king of oral mass builders. Danabol from Balkan Pharma is a high-potency Methandienone (Dianabol).',
            imageUrl: 'http://isteroidi.it/img/p/8/8/88.jpg',
            inStock: true,
            manufacturer: 'Balkan Pharma'
        },
        quantity: 1,
    }
];

export const mockOrders: Order[] = [
    {
        id: 'FORGE-A1B2C3',
        items: mockCartItems,
        total: (39 * 2) + 31,
        shippingAddress: '123 Iron St, Gainsville, USA',
        status: 'Delivered',
        date: '2024-07-10T10:00:00Z',
    },
    {
        id: 'FORGE-D4E5F6',
        items: [mockCartItems[0]],
        total: 39 * 2,
        shippingAddress: '123 Iron St, Gainsville, USA',
        status: 'Shipped',
        date: '2024-07-25T14:30:00Z',
    },
    {
        id: 'FORGE-G7H8I9',
        items: [mockCartItems[1]],
        total: 31,
        shippingAddress: '123 Iron St, Gainsville, USA',
        status: 'Processing',
        date: new Date().toISOString(),
    },
    {
        id: 'FORGE-J1K2L3',
        items: [mockCartItems[0], mockCartItems[1]],
        total: (39 * 2) + 31 - (10.9), // 10% discount
        shippingAddress: '123 Iron St, Gainsville, USA',
        status: 'Cancelled',
        date: '2024-06-15T09:00:00Z',
        discountApplied: { code: 'FORGE10', percentage: 10 }
    }
];
