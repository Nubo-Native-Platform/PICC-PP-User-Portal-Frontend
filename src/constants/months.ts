export interface MonthConfig {
    id: number;
    month: string;  // Full name
    alias: string;  // Short form
}

export const MONTHS: MonthConfig[] = [
    { id: 1, month: 'January', alias: 'JAN' },
    { id: 2, month: 'February', alias: 'FEB' },
    { id: 3, month: 'March', alias: 'MAR' },
    { id: 4, month: 'April', alias: 'APR' },
    { id: 5, month: 'May', alias: 'MAY' },
    { id: 6, month: 'June', alias: 'JUN' },
    { id: 7, month: 'July', alias: 'JUL' },
    { id: 8, month: 'August', alias: 'AUG' },
    { id: 9, month: 'September', alias: 'SEP' },
    { id: 10, month: 'October', alias: 'OCT' },
    { id: 11, month: 'November', alias: 'NOV' },
    { id: 12, month: 'December', alias: 'DEC' },
];