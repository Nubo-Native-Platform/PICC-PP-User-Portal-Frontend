// src/shared/types/inputconfig.ts

export type BaseField = {
    name: string;
    label?: string;
    type: string; // 'text', 'select', 'datetime', 'textarea', 'groupSelect', 'groupTextButton', etc.
    placeholder?: string;
    validation?: any;
    options?: { label: string; value: string }[] | string[];
    optionUrl?: string;
    storeFormat?: 'unix' | 'iso' | string;
    displayFormat?: string;
    triggerName?: string; // ✅ for button label in text+button group
    status?: 'available' | 'taken' | ''; // ✅ for username availability status
    width?: string; // e.g., '100%', '50%'
    buttonType?: 'update' | 'submit' | 'reset'; // for button fields
    disabled?: boolean;
};

export type DynamicGroupField = {
    name: string;
    label: string;
    type: 'dynamicGroup';
    options: { label: string; value: string; childForm: BaseField[] }[];
};

export type InputConfig = (BaseField | DynamicGroupField)[];