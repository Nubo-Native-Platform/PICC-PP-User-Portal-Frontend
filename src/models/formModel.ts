export interface FieldConfig {
    label: string;
    name: string;
    type?: "text" | "email" | "textarea" | "checkbox" | "select" | "date" | "radio" | "link" | "button";
    value?: any;
    options?: string[] | { label: string; value: string, selectionType?: "mandatory" | "optional", price?: number }[];
    multiple?: boolean;
    validation?: any;
    buttonType?: 'update' | 'submit' | 'reset'; // for button fields
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    placeholder?: string;
}

export interface FormModel {
    fields: FieldConfig[];
    // submitText?: string; // Optional submit button text
    onChange: (name: string, value: string | string[]) => void;
    // onSubmit: (fields: FieldConfig[]) => void; // ✅ Accepts argument
}