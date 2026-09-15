import { customAccordionOption } from "@/models/customAccordionOption";
import { useEffect, useState } from "react";
import AccordionComponent from "./AccordionComponent";
import { Typography } from "@mui/material";

const AccordionDataComponent = ({
    id,
    title,
    data,
    styles,
    getDetails,
}: {
    id: string;
    title: string;
    data: any[];
    styles: React.CSSProperties;
    getDetails: (id: string, option: customAccordionOption) => void;
}) => {
    const [allAccordionOption, setAllAccordionOptions] = useState<customAccordionOption[] | undefined>(undefined);

    useEffect(() => {
        if (data) {
            setAllAccordionOptions(data);
        }
    }, [data]);

    return (
        <>
            {allAccordionOption && <>
                <div
                    className="home-subsection-title pb-[var(--nnp-padding-small)]"
                    // style={{ color: '#2799CC' }}
                >
                    {title}
                </div>
                {allAccordionOption.map((option, index) => (
                    <div key={index} className="home-overview-item">
                        <AccordionComponent
                            isExpanded={false}
                            accordionOption={option}
                            setExpand={() => getDetails(id, option)}
                        >
                            {option.data
                                ? <div className="home-overview-content" style={{ height: styles.height ?? 'auto' }}>
                                    {option.element
                                        ? <option.element id={option.id} data={option.data as []} />
                                        : <Typography>{option.summary}</Typography>
                                    }
                                  </div>
                                : <div className="home-empty-state">No Data Found</div>
                            }
                        </AccordionComponent>
                    </div>
                ))}
            </>}
        </>
    );
};

export default AccordionDataComponent;