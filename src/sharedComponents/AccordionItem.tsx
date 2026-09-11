import { customAccordionOption } from "../models/customAccordionOption";
import { Typography } from "@mui/material";
import AccordionComponent from "./AccordionComponent";
import { DashboardOptions } from "../models/dashboardOptions";
import HomeAPI from "@/services/HomeAPI";
import CookieService from "@/services/cookies";
import { useEffect, useState } from "react";
import { FeatureElement } from "@/models/apimodels/feature-element";
import { createAccordionData, createAccordionDataDevFrameWorks, formatAccordionData } from "@/services/helper";
import { accordionItemToListItemsModelDevFrameWorks } from "@/services/ModelTranslator.service";
import ListView from "./ListView";
import { ListItem } from "@/models/listItemsModel";
import { getFeatureIcon } from "@/configs/HomeConfig";

const AccordionItem = ({
    item,
    index,
    level,
    autoLoad = false,
}: {
    item: DashboardOptions;
    index: number;
    level: number;
    autoLoad?: boolean;
}) => {
    const [accordionItem, setAccordionItem] = useState<customAccordionOption | null>(null);
    const [listItems, setListItems] = useState<ListItem[] | null>(null);
    const [children, setChildren] = useState<DashboardOptions[] | null>(item.children || null);

    useEffect(() => {
        setAccordionItem(createAccordionOptions(item, index));
    }, [item, index]);

    useEffect(() => {
        if (autoLoad && !children && !listItems) {
            getAcordionDetails(item);
        }
    }, [autoLoad, children, listItems, item]);

    const createAccordionOptions = (
        item: DashboardOptions,
        index: number
    ): customAccordionOption => {
        const titleKey = item.title.trim().toLowerCase();
        const icon = getFeatureIcon(titleKey, index);
        return {
            id: item.fragment || "",
            link: item.link || "",
            title: item.title,
            summary: item.summary ? item.summary : "",
            icon: icon,
            // level=0 uses default style from DEFAULT_ACCORDION_STYLE (no override needed)
            // level>0 passes a slightly different shade for nesting
            style: level === 0
                ? undefined
                : {
                    headerBg: '!bg-[#3c4048] !border-b !border-[#696c73]',
                    headerColor: '!text-[#f2f3f5]',
                },
        };
    };

    const getAcordionDetails = async (item) => {
        if (children && children.length > 0) {
            return;
        }
        const baseData = await HomeAPI.getDetails(item.link || "");

        if (baseData && baseData[0] && baseData[0].feaName && baseData[0].feaLink) {
            const formattedChildren = formatAccordionData(baseData, {
                idField: 'feaId',
                titleField: 'feaName',
                linkField: 'feaLink',
                summaryField: 'feaSummary',
                sequenceField: 'feaSeq',
            });
            setChildren(formattedChildren);
        } else if (baseData && baseData[0] && baseData[0].elementDtlId) {
            const formattedChildren = formatAccordionData(baseData, {
                idField: 'elementDtlId',
                titleField: 'elementDtlName',
                linkField: 'elementDtlLink',
                summaryField: 'elementDtlSummary',
                sequenceField: 'elementDtlSeq',
            }).map(child => ({ ...child, isListView: true }));
            setChildren(formattedChildren);
            getElementDetails(formattedChildren, item);
        }
    };

    const getElementDetails = async (baseData, item) => {
        const username = CookieService.getUsername();
        const childElementData: FeatureElement[][] =
            await HomeAPI.getElementDetailsForkJoin(baseData, username);

        const formattedData = createAccordionDataDevFrameWorks(
            baseData,
            childElementData,
            {
                idField: 'chElementDtlId',
                titleField: 'elementDtlDesc',
                linkField: 'elementDtlURL',
                demoUrlField: 'demoUrl',
                sequenceField: 'elementDtlSeq',
            }
        );
        setListItems(accordionItemToListItemsModelDevFrameWorks(formattedData));
    };

    useEffect(() => {
        console.log(listItems);
    }, [listItems]);

    return (
        <>
            <AccordionComponent
                isExpanded={autoLoad || level === 0 ? true : false}
                accordionOption={accordionItem}
                setExpand={getAcordionDetails}
            >
                {children && children.length > 0 ? (
                    children[0]?.isListView ? (
                        listItems && listItems.length > 0 ? (
                            <div className="page-padding-medium bg-[var(--component-color-secondar)]" style={{ paddingBottom: 0 }}>
                                {listItems.map((listItemsModel, idx) => (
                                    <div key={idx}>
                                        <ListView key={idx} item={listItemsModel} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="home-empty-state">No sub-items available</div>
                        )
                    ) : (
                        children.map((option, idx) => (
                            <div key={idx}>
                                <AccordionItem item={option} index={idx} level={level + 1} />
                            </div>
                        ))
                    )
                ) : (
                    <div className="home-empty-state">No sub-items available</div>
                )}
            </AccordionComponent>
        </>
    );
};

export default AccordionItem;