export interface Beverage {
    id: string;
    name: string;
    description?: string | null;
    price: string;
    imageUrl?: string | null;
    createdAt: string;   
    updatedAt: string;    
}

export interface OrderItem {
    id: string;           
    beverageId: string;
    quantity: number;
    price: string;
    orderId: string;   
}

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    totalPrice: string;
    createdAt: string;
    updatedAt: string; 
    orderItems: OrderItem[];
}

export interface OrderRequest {
    customerName: string;
    customerEmail: string;
    items: {
        beverageId: string;
        quantity: number;
    }[];
}