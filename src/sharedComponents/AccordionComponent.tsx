import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { customAccordionOption, DEFAULT_ACCORDION_STYLE } from "../models/customAccordionOption";

const AccordionComponent = React.memo(
    ({
        isExpanded,
        accordionOption,
        setExpand,
        children,
    }: {
        isExpanded: boolean;
        accordionOption: customAccordionOption;
        setExpand?: (accordionOption: customAccordionOption) => void;
        children: React.ReactNode;
    }) => {
        const [expanded, setExpanded] = useState(isExpanded);

        const onToggle = () => {
            if (!expanded && setExpand) {
                setExpand(accordionOption);
            }
            setExpanded(!expanded);
        };

        useEffect(() => {
            setExpanded(isExpanded);
        }, [isExpanded]);

        const headerBg = accordionOption?.style?.headerBg || DEFAULT_ACCORDION_STYLE.headerBg;
        const headerColor = accordionOption?.style?.headerColor || DEFAULT_ACCORDION_STYLE.headerColor;

        return (
            <>
                <Accordion
                    expanded={expanded}
                    onChange={onToggle}
                    className="nnp-border nnp-accordion shadow-none rounded-none before:hidden"
                    sx={{
                        boxShadow: 'none',
                        '&:last-of-type': {
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                        '&:first-of-type': {
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        },
                    }}
                >
                    <AccordionSummary
                        className={`
                            group
                            nnp-accordion-summary
                            ${headerBg}
                            ${headerColor}
                            nnp-header
                            hover:!bg-[var(--component-color-tertiary)]
                            hover:!text-[var(--text-color-primary)]
                            relative
                        `}
                        sx={{
                            '&.Mui-expanded': {
                                borderBottom: '1px solid var(--border-color) !important',
                            },
                        }}
                        expandIcon={
                            <span className={`nnp-accordion-toggle ${headerColor}`}>
                                {expanded ? '−' : '+'}
                            </span>
                        }
                    >
                        {accordionOption?.title}
                    </AccordionSummary>

                    <AccordionDetails className="body-font !p-0 relative">
                        {children}
                        {accordionOption?.icon && (
                            <div className="nnp-feature-icon-container">
                                <img
                                    src={`${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}${accordionOption.icon}`}
                                    alt=""
                                    className="nnp-feature-icon"
                                />
                            </div>
                        )}
                    </AccordionDetails>
                </Accordion>
            </>
        );
    }
);

export default AccordionComponent;