export interface Transaction {
    id: number;
    invoice_code: string;
    total_amount: number;
    payment_amount: number;
    change_amount: number;
    created_at: string;
    cashier_name: string;
}