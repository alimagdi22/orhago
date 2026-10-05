export interface ISortItem {
  title: string;
  price: string | number;
  currency: string;
  duration?: number;
  isActive: boolean;
  sortCode: number;
  showCard?: boolean;
}
