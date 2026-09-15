import React from 'react';
import type { NNPModalProps } from '@/models/NNPModalProps';


const NNPModalComponent: React.FC<NNPModalProps> = ({ isOpen, onClose, title, children, width }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 overflow-hidden">
            <div className="
    bg-[var(--component-color-secondary)] text-[var(--text-color-primary)] shadow-2xl border border-[var(--border-color)]
    w-[100vw]         /* mobile */
    md:w-[60vw]       /* tablet */
    lg:[width:var(--lg-width)]   /* ✅ Desktop, forces Tailwind to apply raw width */
  "
                style={{ "--lg-width": width || "60vw" } as React.CSSProperties}>

                {/* Header band */}
                <div className="nnp-header nnp-header-highlight flex items-center justify-between px-4 py-4 border-b border-[var(--border-color)]">
                    {title && <div className="text-md font-semibold text-[var(--text-color-secondary)]">{title}</div>}
                    <button
                        onClick={onClose}
                        className="text-[var(--text-color-secondary)] hover:opacity-80 transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal content */}
                <div className="p-6 text-[var(--text-color-tertiary)] nnp-body-minus-header  max-h-[95vh]
    overflow-y-auto">
                    {children}
                </div>

            </div>


        </div>



    );
};

export default NNPModalComponent;