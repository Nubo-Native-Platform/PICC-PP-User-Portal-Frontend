import { FormModel, FieldConfig } from "@/models/formModel";
import { useState, useEffect } from "react";
import clsx from "clsx";

const FormComponent = ({ fields, onChange }: FormModel) => {
    const [fieldState, setFieldState] = useState<FieldConfig[]>(fields.filter((f) => f.type !== "button"));
    const [btnState, setBtnState] = useState<FieldConfig[]>(fields.filter((f) => f.type === "button"));
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFieldState(fields.filter((f) => f.type !== "button"));
        setBtnState(fields.filter((f) => f.type === "button"));
    }, [fields]);

    useEffect(() => {
        const inputs = document.querySelectorAll("form.body-font input");
        inputs.forEach((input, index) => {
            const htmlInput = input as HTMLInputElement;
            console.log(`[DEBUG_STYLE] Input #${index} - placeholder: "${htmlInput.placeholder}", computed fontFamily: "${window.getComputedStyle(htmlInput).fontFamily}", computed color: "${window.getComputedStyle(htmlInput).color}"`);
        });
    });

    const validateField = (name: string, value: any): string | null => {
        const field = fieldState.find((f) => f.name === name);
        if (!field?.validation) return null;

        const rules = field.validation;
        let error: string | null = null;

        if (rules.required && !value) {
            error =
                typeof rules.required === "string"
                    ? rules.required
                    : `${field.label} is required`;
        } else if (rules.minLength && value?.length < rules.minLength.value) {
            error = rules.minLength.message;
        } else if (
            rules.pattern &&
            rules.pattern.value instanceof RegExp &&
            !rules.pattern.value.test(value)
        ) {
            error = rules.pattern.message;
        } else if (rules.validate) {
            const formValues = fieldState.reduce(
                (acc, f) => ({ ...acc, [f.name]: f.value }),
                {}
            );
            const result = rules.validate(value, formValues);
            if (result !== true) {
                error = result as string;
            }
        }

        setErrors((prev) => ({ ...prev, [name]: error || "" }));
        return error;
    };

    const handleValueChange = (name: string, value: any) => {
        const updatedFields = fieldState.map((field) =>
            field.name === name ? { ...field, value } : field
        );
        setFieldState(updatedFields);
        onChange(name, value);
        validateField(name, value);
    };

    const handleSubmit = () => {
        let isValid = true;
        const newErrors: Record<string, string> = {};

        fieldState.forEach((field) => {
            const error = validateField(field.name, field.value);
            if (error) {
                isValid = false;
                newErrors[field.name] = error;
            }
        });

        setErrors(newErrors);
        if (isValid) {
            btnState.forEach((button) => {
                if (button.buttonType === "submit" && button.value) {
                    button.value(fieldState);
                }
            });
        }
    };

    return (
        <form
            className="w-full body-font"
            style={{ color: 'var(--text-color-tertiary)' }}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            {fieldState.map((field, index) => (
                <div className="relative mb-4" key={`field-${index}`}>
                    {/* Label */}
                    {field.type !== "link" && (
                        <label className="block font-medium text-[var(--text-color-tertiary)] mb-1">
                            {field.label}
                            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}

                    {/* Textarea */}
                    {field.type === "textarea" ? (
                        <>
                            <textarea
                                className={clsx(
                                    "border p-2 rounded-md w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    field.disabled && "bg-gray-100 cursor-not-allowed opacity-80",
                                    errors[field.name] && "border-red-500"
                                )}
                                rows={3}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={field.value as string}
                                onChange={(e) => handleValueChange(field.name, e.target.value)}
                                onBlur={(e) => validateField(field.name, e.target.value)}
                                disabled={field.disabled}
                            />
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </>
                    ) : field.type === "checkbox" && field.options ? (
                        <>
                            <div className="flex flex-col gap-2 pl-1">
                                {field.options.map((opt, i) => (
                                    <label
                                        key={`${opt.value}-${i}`}
                                        className="flex items-center gap-2 cursor-pointer text-[var(--text-color-primary)]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={Array.isArray(field.value) && field.value.includes(opt.value)}
                                            disabled={opt.disabled}
                                            onChange={(e) => {
                                                const currentValues = Array.isArray(field.value) ? [...field.value] : [];
                                                const updatedValue = e.target.checked
                                                    ? [...currentValues, opt.value]
                                                    : currentValues.filter((v) => v !== opt.value);
                                                handleValueChange(field.name, updatedValue);
                                            }}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </>
                    ) : field.type === "radio" && field.options ? (
                        <>
                            <div className="flex flex-col gap-2 pl-1">
                                {field.options.map((opt, i) => (
                                    <label
                                        key={`radio-${i}`}
                                        className="flex items-center gap-2 cursor-pointer text-[var(--text-color-primary)]"
                                    >
                                        <input
                                            type="radio"
                                            name={field.name}
                                            value={opt.value}
                                            checked={field.value === opt.value}
                                            onChange={(e) => handleValueChange(field.name, e.target.value)}
                                            onBlur={() => validateField(field.name, field.value)}
                                            disabled={field.disabled}
                                        />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </>
                    ) : field.type === "select" ? (
                        <>
                            <select
                                className={clsx(
                                    "border p-2 rounded-md w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    field.disabled && "bg-gray-100 cursor-not-allowed opacity-80",
                                    errors[field.name] && "border-red-500"
                                )}
                                value={field.value as string}
                                onChange={(e) => handleValueChange(field.name, e.target.value)}
                                onBlur={(e) => validateField(field.name, e.target.value)}
                                disabled={field.disabled}
                            >
                                <option value="" className="bg-white dark:bg-[var(--component-color-secondary)]">Select</option>
                                {field.options?.map((opt, i) => (
                                    <option key={i} value={opt.value} disabled={opt.disabled} className="bg-white dark:bg-[var(--component-color-secondary)]">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </>
                    ) : field.type === "date" ? (
                        <>
                            <input
                                type="date"
                                className={clsx(
                                    "border p-2 rounded-md w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    field.disabled && "bg-gray-100 cursor-not-allowed opacity-80",
                                    errors[field.name] && "border-red-500"
                                )}
                                value={field.value as string}
                                min={field.validation?.minDate}
                                onChange={(e) => handleValueChange(field.name, e.target.value)}
                                onBlur={(e) => validateField(field.name, e.target.value)}
                                disabled={field.disabled}
                            />
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </>
                    ) : field.type === "link" ? (
                        <div className="flex justify-end">
                            <a
                                href={field.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-sm hover:underline"
                            >
                                {field.label || "Go"}
                            </a>
                        </div>
                    ) : (
                        <>
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className={clsx(
                                    "border p-2 rounded-md w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    field.disabled && "bg-transparent cursor-not-allowed opacity-80",
                                    errors[field.name] && "border-red-500"
                                )}
                                value={field.value as string}
                                onChange={(e) => handleValueChange(field.name, e.target.value)}
                                onBlur={(e) => validateField(field.name, e.target.value)}
                                disabled={field.disabled}
                            />
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </>
                    )}
                </div>
            ))}

            {btnState.length > 0 && (
                <div className="flex justify-end gap-3 mt-6">
                    {btnState.map((button, i) => (
                        <button
                            disabled={button.disabled}
                            key={i}
                            type={button.buttonType === "submit" ? "submit" : "button"}
                            className={clsx(
                                "px-4 py-2 rounded-md font-medium text-[var(--text-color-secondary)] transition-all",
                                button.disabled ? (
                                    (button.buttonType === "submit" || button.variant === "primary" || (button.variant !== "secondary" && i % 2 === 0))
                                        ? "nnp-btn nnp-btn-primary nnp-btn-disabled cursor-not-allowed opacity-50"
                                        : "nnp-btn nnp-btn-secondary nnp-btn-disabled cursor-not-allowed opacity-50"
                                ) : (
                                    button.variant === "primary" ? "nnp-btn nnp-btn-primary cursor-pointer" : (
                                        button.variant === "secondary" ? "nnp-btn nnp-btn-secondary cursor-pointer" : (
                                            i % 2 === 0 ? "nnp-btn nnp-btn-primary cursor-pointer" : "nnp-btn nnp-btn-secondary cursor-pointer"
                                        )
                                    )
                                )
                            )}
                            onClick={() => {
                                if (button.buttonType !== "submit" && button.value) {
                                    button.value(fieldState);
                                }
                            }}
                        >
                            {button.label || "Submit"}
                        </button>
                    ))}
                </div>
            )}
        </form>
    );
};

export default FormComponent;
