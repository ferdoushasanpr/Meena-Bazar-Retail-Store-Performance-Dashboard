export interface MetricCardProps {
    title: string,
    icon: string,
    value: string | number,
    visualIcon: string
}

export type EntityType = 'Customer' | 'Product' | 'Store';

export interface UpdatePayload {
    type: EntityType;
    id: string;
    data: any;
}