import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm, Controller, type UseFormReturn, type Control, UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import clsx from 'clsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import type { BaseField, DynamicGroupField, InputConfig } from '@/models/NNPFormModel';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

type RefType = {
    setError: UseFormSetError<any>;
    clearErrors: UseFormClearErrors<any>;
};

type Props = {
    inputs: InputConfig;
    layout?: 'single' | 'double';
    onSubmit?: (formattedData: any) => void;
    defaultValues?: Record<string, any>;
    formMethods?: UseFormReturn<any>;
    control?: Control<any>;
    editable?: boolean;
    onTrigger?: (name: string, value: any) => void;
};

const DynamicForm = forwardRef<RefType, Props>(({
    inputs,
    layout = 'single',
    onSubmit,
    defaultValues,
    formMethods,
    control: externalControl,
    editable = true,
    onTrigger,
}, ref) => {
    const internalForm = useForm({
        mode: 'onChange',
        defaultValues,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, touchedFields },
        reset,
        control: internalControl,
        watch,
        setError,
        clearErrors,
    } = formMethods || internalForm;

    useImperativeHandle(ref, () => ({
        setError,
        clearErrors,
    }));

    const control = externalControl || internalControl;
    const values = watch();

    const [staticFields, setStaticFields] = useState<BaseField[]>([]);
    const [dynamicGroups, setDynamicGroups] = useState<DynamicGroupField[]>([]);
    const [formSubmitButton, setFormSubmitButton] = useState<BaseField | null>(null);
    const [groupSelections, setGroupSelections] = useState<Record<string, string>>({});
    const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
    const [selectedGroups, setSelectedGroups] = useState<
        { groupName: string; value: string; label: string; fields: BaseField[]; collapsed: boolean }[]
    >([]);

    useEffect(() => {
        const dynamics = inputs.filter(i => i.type === 'dynamicGroup') as DynamicGroupField[];
        const statics = inputs.filter(i => i.type !== 'dynamicGroup' && i.type !== 'button') as BaseField[];
        const submitBtn = inputs.find(i => i.type === 'button' && i.buttonType === 'submit') as BaseField | undefined;
        setStaticFields(statics);
        setDynamicGroups(dynamics);
        setFormSubmitButton(submitBtn ?? null);

    }, [inputs]);

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    useEffect(() => {
        if (defaultValues && dynamicGroups.length > 0) {
            reset(defaultValues);
            const dynamicStates = dynamicGroups.flatMap(group => {
                const values = defaultValues[group.name];
                if (!Array.isArray(values)) return [];
                return values
                    .map((entry: any) => {
                        const option = group.options.find(opt => opt.value === entry.name);
                        return option
                            ? { groupName: group.name, value: option.value, label: option.label, fields: option.childForm, collapsed: false }
                            : null;
                    })
                    .filter(Boolean);
            });
            setSelectedGroups(dynamicStates as any);
        }
    }, [defaultValues, dynamicGroups, reset]);

    const getLayoutClass = () =>
        layout === 'double' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4';

    const handleAddGroup = (groupName: string) => {
        const group = dynamicGroups.find(g => g.name === groupName);
        const selected = groupSelections[groupName];
        if (!group || !selected) return;
        const option = group.options.find(o => o.value === selected);
        if (!option) return;
        setSelectedGroups(prev => [...prev, { groupName, value: option.value, label: option.label, fields: option.childForm, collapsed: false }]);
        setGroupSelections(prev => ({ ...prev, [groupName]: '' }));
    };

    const handleRemoveGroup = (groupName: string, value: string) => {
        setSelectedGroups(prev => prev.filter(g => !(g.groupName === groupName && g.value === value)));
    };

    const toggleCollapse = (groupName: string, value: string) => {
        setSelectedGroups(prev =>
            prev.map(g => (g.groupName === groupName && g.value === value ? { ...g, collapsed: !g.collapsed } : g))
        );
    };

    const formatDateValue = (val: any, storeFormat?: string) => {
        if (!val) return '';
        if (storeFormat === 'unix') return dayjs(val).valueOf();
        if (storeFormat === 'iso') return dayjs(val).toISOString();
        return dayjs(val).format(storeFormat || 'YYYY-MM-DDTHH:mm:ss');
    };

    const togglePasswordVisibility = (fieldName: string) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName],
        }));
    };

    const renderField = (field: BaseField, fieldName?: string) => {
        const name = fieldName || field.name;
        const errorObj = errors as any;
        const currentValue = values?.[name];

        if (!editable) {
            let displayVal = currentValue ?? '';
            if (field.type === 'datetime' && displayVal) {
                displayVal = dayjs(displayVal).format(field.displayFormat || 'YYYY-MM-DD HH:mm');
            }
            if (field.type === 'select') {
                const opt = (field.options || []).find(
                    (o: any) => (typeof o === 'string' ? o === displayVal : o.value === displayVal)
                );
                displayVal = typeof opt === 'string' ? opt : opt?.label || displayVal;
            }
            return <span className="text-gray-800">{displayVal || '-'}</span>;
        }

        if (field.type === 'groupTextButton') {
            const status = field.status || '';
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            autoComplete="off"
                            {...register(name, field.validation)}
                            placeholder={field.placeholder}
                            disabled={!editable || field.disabled}
                            className={clsx(
                                "border p-2 rounded flex-1 border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]",
                                errorObj[name] && errorObj[name].type !== 'success' && "border-red-500"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const val = (control._formValues as any)?.[name];
                                if (typeof onTrigger === "function") {
                                    onTrigger(field.name, val);
                                }
                            }}
                            disabled={!(control._formValues as any)?.[name] || field.disabled}
                            className={clsx(
                                'px-4 py-2 rounded text-[var(--text-color-secondary)]',
                                (control._formValues as any)?.[name] && !field.disabled
                                    ? 'bg-[var(--component-color-highlight)] hover:opacity-90 cursor-pointer'
                                    : 'bg-[var(--component-color-highlight)] opacity-50 cursor-not-allowed'
                            )}
                        >
                            {field.triggerName || "Go"}
                        </button>
                    </div>

                    {errorObj[name] && errorObj[name].type === 'success' && (
                        <span className="text-sm text-green-600">
                            {errorObj[name].message}
                        </span>
                    )}
                </div>
            );
        }

        if (field.type === 'textarea') {
            const isCredentialTextarea = name === 'administrativeAccess' || name === 'userAccess';
            return (
                <textarea
                    {...register(name, field.validation)}
                    placeholder={field.placeholder}
                    disabled={!editable || field.disabled}
                    rows={isCredentialTextarea ? 8 : 4}
                    className={clsx(
                        'border p-2 rounded w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]',
                        isCredentialTextarea ? 'min-h-[10rem]' : 'min-h-[6rem]',
                        errorObj[name] && 'border-red-500'
                    )}
                />
            );
        }

        if (field.type === 'select') {
            return (
                <select
                    {...register(name, field.validation)}
                    className={clsx('border p-2 rounded w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]', errorObj[name] && 'border-red-500')}
                >
                    <option value="" className="bg-white dark:bg-[var(--component-color-secondary)]">Select</option>
                    {(field.options || []).map((opt: any, idx: number) =>
                        typeof opt === 'string' ? (
                            <option key={idx} value={opt} className="bg-white dark:bg-[var(--component-color-secondary)]">
                                {opt}
                            </option>
                        ) : (
                            <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white dark:bg-[var(--component-color-secondary)]">
                                {opt.label}
                            </option>
                        )
                    )}
                </select>
            );
        }

        if (field.type === 'datetime') {
            return (
                <Controller
                    name={name}
                    control={control}
                    rules={field.validation}
                    render={({ field: rhfField }) => (
                        <DesktopDateTimePicker
                            disabled={!editable}
                            value={rhfField.value ? dayjs(rhfField.value) : null}
                            onChange={(newValue: any) =>
                                rhfField.onChange(formatDateValue(newValue, field.storeFormat))
                            }
                            format={field.displayFormat || 'YYYY-MM-DD HH:mm'}
                            slotProps={{
                                textField: { fullWidth: true, error: !!errorObj[name] },
                            }}
                        />
                    )}
                />
            );
        }

        if (field.type === 'password') {
            const isVisible = passwordVisibility[name] || false;
            return (
                <div className="relative">
                    <input
                        type={isVisible ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register(name, {
                            ...field.validation,
                            validate: (value) => {
                                if (typeof field.validation?.validate === "function") {
                                    return field.validation.validate(value, watch());
                                }
                                return true;
                            }
                        })}
                        placeholder={field.placeholder}
                        disabled={!editable}
                        className={clsx(
                            'border p-2 rounded w-full pr-10 border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]',
                            editable ? 'border rounded' : 'bg-transparent border-0',
                            errorObj[name] && 'border-red-500'
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => togglePasswordVisibility(name)}
                        disabled={!editable}
                        className="absolute right-2 h-full transform -translate-y-1/2 p-1 text-[var(--text-color-tertiary)] hover:opacity-80 cursor-pointer"
                    >
                        {isVisible ? (
                            <VisibilityOutlinedIcon style={{ fontSize: 'var(--font-size-md)' }} />
                        ) : (
                            <VisibilityOffOutlinedIcon style={{ fontSize: 'var(--font-size-md)' }} />
                        )}
                    </button>
                </div>
            );
        }

        if (field.type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    {...register(fieldName || field.name)}
                    className="h-4 w-4 accent-blue-600 cursor-pointer"
                />
            );
        }

        return (
            <input
                type={field.type}
                autoComplete="off"
                {...register(name, {
                    ...field.validation,

                    // ✅ Added cross-field validation logic
                    validate: (value) => {
                        if (typeof field.validation?.validate === "function") {
                            return field.validation.validate(value, watch());
                        }
                        return true;
                    }
                })}

                placeholder={field.placeholder}
                disabled={!editable || field.disabled}
                className={clsx(
                    'p-2 w-full border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]',
                    editable ? 'border rounded' : 'bg-transparent border-0',
                    errorObj[name] && 'border-red-500'
                )}
            />
        );
    };

    const handleFormSubmit = (data: Record<string, any>) => {
        if (!onSubmit) return;
        let result: Record<string, any> = {};

        staticFields.forEach(field => {
            result[field.name] = data[field.name];
        });

        dynamicGroups.forEach(group => {
            const entries = selectedGroups.filter(g => g.groupName === group.name);
            if (entries.length) {
                result[group.name] = entries.map(entry => {
                    const args: Record<string, any>[] = [];
                    entry.fields.forEach(field => {
                        const val = data?.[group.name]?.[entry.value]?.[field.name];
                        if (val !== undefined && val !== '') {
                            args.push({ [field.name]: val });
                        }
                    });
                    return { name: entry.value, args };
                });
            }
        });

        result = { ...data, ...result };
        onSubmit(result);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off" className="w-full space-y-4 body-font" style={{ color: 'var(--text-color-tertiary)' }}>
                <div className={getLayoutClass()}>
                    {staticFields.map(input => (
                        <div key={input.name} className="flex flex-col gap-1">
                            <label className="font-medium text-[var(--text-color-tertiary)]">
                                {input.label}
                                {input.validation?.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderField(input)}
                            {editable && errors[input.name] && errors[input.name].type !== 'success' && (
                                <span className="text-red-500 text-sm">{(errors as any)[input.name]?.message}</span>
                            )}
                        </div>
                    ))}
                </div>

                {dynamicGroups.map(group => {
                    const availableOptions = group.options.filter(
                        opt => !selectedGroups.find(sel => sel.groupName === group.name && sel.value === opt.value)
                    );

                    return (
                        <div key={group.name} className="mt-6">
                            <label className="block font-medium mb-1">{group.label}</label>

                            {editable && (
                                <div className="flex items-center gap-4">
                                    <select
                                        value={groupSelections[group.name] || ''}
                                        onChange={e => setGroupSelections(prev => ({ ...prev, [group.name]: e.target.value }))}
                                        className="border p-2 rounded w-64 border-[var(--text-color-tertiary)] bg-transparent text-[var(--text-color-primary)] dark:text-[#cccccc]"
                                    >
                                        <option value="" className="bg-white dark:bg-[var(--component-color-secondary)]">Select Option</option>
                                        {availableOptions.map(opt => (
                                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[var(--component-color-secondary)]">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleAddGroup(group.name)}
                                        disabled={!groupSelections[group.name]}
                                        className={clsx(
                                            'px-4 py-2 rounded text-[var(--text-color-secondary)]',
                                            groupSelections[group.name]
                                                ? 'bg-[var(--component-color-highlight)] hover:opacity-90 cursor-pointer'
                                                : 'bg-[var(--component-color-highlight)] opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            {selectedGroups
                                .filter(g => g.groupName === group.name)
                                .map(({ value, label, fields, collapsed }) => (
                                    <div
                                        key={`${group.name}-${value}`}
                                        className={clsx(
                                            'mt-4 relative overflow-hidden',
                                            editable ? 'border border-[gainsboro] dark:border-[#5e5e5e] rounded shadow-sm bg-white dark:bg-[var(--component-color-secondary)]' : 'p-2'
                                        )}
                                    >
                                        {editable && (
                                            <div className="flex justify-between items-center bg-[var(--component-color-highlight)] text-[var(--text-color-secondary)] p-2 px-4 mb-4">
                                                <h4 className="font-semibold text-white">{label}</h4>
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCollapse(group.name, value)}
                                                        className="text-white text-sm hover:underline cursor-pointer"
                                                    >
                                                        {collapsed ? 'Expand' : 'Collapse'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveGroup(group.name, value)}
                                                        className="text-red-200 hover:text-red-100 font-semibold"
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {!editable && (
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-semibold">{label}</h4>
                                            </div>
                                        )}

                                        {!collapsed &&
                                            fields.map(field => {
                                                const fieldName = `${group.name}.${value}.${field.name}`;
                                                return (
                                                    <div key={fieldName} className="mb-4">
                                                        <label className="block mb-1">{field.label}</label>
                                                        {renderField(field, fieldName)}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ))}
                        </div>
                    );
                })}

                {editable && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!isValid}
                            className={clsx(
                                'px-4 py-2 rounded text-[var(--text-color-secondary)]',
                                !isValid
                                    ? 'bg-[var(--component-color-highlight)] opacity-50 cursor-not-allowed'
                                    : 'bg-[var(--component-color-highlight)] hover:opacity-90 cursor-pointer'
                            )}
                        >
                            {formSubmitButton?.label || 'Submit'}
                        </button>
                    </div>
                )}
            </form>
        </LocalizationProvider>
    );
});

export default DynamicForm;
