import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Checkbox } from "@mui/material";
import { EnvFeature, FeatureElement, ElementDetail, ChildElementDtl } from "@/models/envfeatures";
import CookieService from "@/services/cookies";

interface EnvironmentalFeaturesProps {
  data: EnvFeature[];
  onSelect?: (id: string, seq: number) => void;
  showCheckboxes?: boolean;
  hideheader?: boolean;
  onUpdate?: () => void;
}

export interface EnvironmentalFeaturesRef {
  getEnvFeatures: () => EnvFeature[];
}

// Helper functions to get leaf nodes
const getDetailLeaves = (detail: ElementDetail): ChildElementDtl[] => {
  return detail.childElementDtls || [];
};

const getElementLeaves = (el: FeatureElement): ChildElementDtl[] => {
  if (!el.elementDetails) return [];
  return el.elementDetails.flatMap(getDetailLeaves);
};

const getFeatureLeaves = (feature: EnvFeature): ChildElementDtl[] => {
  if (!feature.featureElements) return [];
  return feature.featureElements.flatMap(getElementLeaves);
};

const getAllTreeLeaves = (features: EnvFeature[]): ChildElementDtl[] => {
  return features.flatMap(getFeatureLeaves);
};

// Checkbox state calculation helper (checked, indeterminate)
const getCheckState = (leaves: ChildElementDtl[]) => {
  if (!leaves || leaves.length === 0) return { checked: false, indeterminate: false };
  const assignedCount = leaves.filter((leaf) => leaf.assigned).length;
  const checked = assignedCount === leaves.length;
  const indeterminate = assignedCount > 0 && assignedCount < leaves.length;
  return { checked, indeterminate };
};

const EnvironmentalFeatures = forwardRef<
  EnvironmentalFeaturesRef,
  EnvironmentalFeaturesProps
>(({ data, onSelect, showCheckboxes = false, hideheader, onUpdate }, ref) => {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [openElements, setOpenElements] = useState<string[]>([]);
  const [openDetails, setOpenDetails] = useState<string[]>([]);
  const [envFeatures, setEnvFeatures] = useState<EnvFeature[]>([]);
  const [selectedId, setSelectedId] = useState<{ id: string; seq: number }>({
    id: "__header__",
    seq: 0,
  });

  const toggle = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    id: string
  ) => {
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    onSelect?.(selectedId.id, selectedId.seq);
  }, [selectedId]);

  useEffect(() => {
    setEnvFeatures(data);
  }, [data]);

  // ✅ Expose method to parent
  useImperativeHandle(ref, () => ({
    getEnvFeatures: () => envFeatures,
  }));

  // Toggle handlers for parent checkboxes
  const toggleDetailCheck = (detailId: string, targetChecked: boolean) => {
    setEnvFeatures((prev) =>
      prev.map((f) => ({
        ...f,
        featureElements: f.featureElements?.map((el) => ({
          ...el,
          elementDetails: el.elementDetails?.map((d) =>
            d.elementDtlId === detailId
              ? {
                  ...d,
                  childElementDtls: d.childElementDtls?.map((c) => ({
                    ...c,
                    assigned: targetChecked,
                  })),
                }
              : d
          ),
        })),
      }))
    );
  };

  const toggleElementCheck = (elementId: string, targetChecked: boolean) => {
    setEnvFeatures((prev) =>
      prev.map((f) => ({
        ...f,
        featureElements: f.featureElements?.map((el) =>
          el.elementId === elementId
            ? {
                ...el,
                elementDetails: el.elementDetails?.map((d) => ({
                  ...d,
                  childElementDtls: d.childElementDtls?.map((c) => ({
                    ...c,
                    assigned: targetChecked,
                  })),
                })),
              }
            : el
        ),
      }))
    );
  };

  const toggleFeatureCheck = (feaId: string, targetChecked: boolean) => {
    setEnvFeatures((prev) =>
      prev.map((f) =>
        f.feaId === feaId
          ? {
              ...f,
              featureElements: f.featureElements?.map((el) => ({
                ...el,
                elementDetails: el.elementDetails?.map((d) => ({
                  ...d,
                  childElementDtls: d.childElementDtls?.map((c) => ({
                    ...c,
                    assigned: targetChecked,
                  })),
                })),
              })),
            }
          : f
      )
    );
  };

  const toggleAllTreeCheck = (targetChecked: boolean) => {
    setEnvFeatures((prev) =>
      prev.map((f) => ({
        ...f,
        featureElements: f.featureElements?.map((el) => ({
          ...el,
          elementDetails: el.elementDetails?.map((d) => ({
            ...d,
            childElementDtls: d.childElementDtls?.map((c) => ({
              ...c,
              assigned: targetChecked,
            })),
          })),
        })),
      }))
    );
  };

  const allTreeLeaves = getAllTreeLeaves(envFeatures);
  const allTreeCheckState = getCheckState(allTreeLeaves);

  return (
    <div className="w-full h-[60vh] font-nm flex flex-col">
      {/* Top Header Toolbar with Select All */}
      {showCheckboxes && allTreeLeaves.length > 0 && (
        <div className="flex items-center px-4 py-2 bg-[var(--component-color-secondary)] border-b border-[var(--border-color)] text-sm font-semibold sticky top-0 z-10">
          <Checkbox
            size="small"
            className="mr-2"
            checked={allTreeCheckState.checked}
            indeterminate={allTreeCheckState.indeterminate}
            sx={{ padding: 0 }}
            onChange={(e) => toggleAllTreeCheck(e.target.checked)}
          />
          <span className="cursor-pointer select-none" onClick={() => toggleAllTreeCheck(!allTreeCheckState.checked)}>
            Select All Permissions
          </span>
        </div>
      )}

      {/* Feature List */}
      <div className="flex-1 overflow-y-auto pr-2">
        <ul className="space-y-1">
          {[...envFeatures]
            .sort((a, b) => parseInt(a.feaSeq || '0') - parseInt(b.feaSeq || '0'))
            .map((feature) => {
              const featureLeaves = getFeatureLeaves(feature);
              const featureState = getCheckState(featureLeaves);

              return (
                <li key={feature.feaId}>
                  {/* Feature Level 1 */}
                  <div className="flex items-center hover:bg-[var(--component-color-tertiary)] pl-4 py-2 pr-2">
                    {showCheckboxes && featureLeaves.length > 0 && (
                      <Checkbox
                        size="small"
                        className="mr-2 shrink-0"
                        checked={featureState.checked}
                        indeterminate={featureState.indeterminate}
                        sx={{ padding: 0 }}
                        onChange={(e) => toggleFeatureCheck(feature.feaId, e.target.checked)}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        toggle(openGroups, setOpenGroups, feature.feaId);
                        setSelectedId({ id: feature.feaId, seq: 1 });
                      }}
                      className="w-full flex justify-between items-center text-left font-semibold"
                    >
                      <span>{feature.feaName}</span>
                      {openGroups.includes(feature.feaId) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  </div>

                  {/* Feature Elements Level 2 */}
                  {openGroups.includes(feature.feaId) &&
                    feature.featureElements && (
                      <ul>
                        {[...feature.featureElements]
                          .sort((a, b) => parseInt(a.feaSeq || '0') - parseInt(b.feaSeq || '0'))
                          .map((el) => {
                            const elLeaves = getElementLeaves(el);
                            const elState = getCheckState(elLeaves);

                            return (
                              <li key={el.elementId}>
                                <div className="flex items-center hover:bg-[var(--component-color-tertiary)] pl-8 py-2 pr-2">
                                  {showCheckboxes && elLeaves.length > 0 && (
                                    <Checkbox
                                      size="small"
                                      className="mr-2 shrink-0"
                                      checked={elState.checked}
                                      indeterminate={elState.indeterminate}
                                      sx={{ padding: 0 }}
                                      onChange={(e) => toggleElementCheck(el.elementId, e.target.checked)}
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (el.elementDetails) {
                                        toggle(openElements, setOpenElements, el.elementId);
                                      }
                                      setSelectedId({ id: el.elementId, seq: 2 });
                                    }}
                                    className="w-full flex justify-between items-center text-left"
                                  >
                                    <span>{el.elementName}</span>
                                    {el.elementDetails &&
                                      (openElements.includes(el.elementId) ? (
                                        <ChevronDown size={16} />
                                      ) : (
                                        <ChevronRight size={16} />
                                      ))}
                                  </button>
                                </div>

                                {/* Element Details Level 3 */}
                                {openElements.includes(el.elementId) &&
                                  el.elementDetails && (
                                    <ul>
                                      {[...el.elementDetails]
                                        .sort((a, b) => parseInt(a.elementDtlSeq || '0') - parseInt(b.elementDtlSeq || '0'))
                                        .map((detail) => {
                                          const detailLeaves = getDetailLeaves(detail);
                                          const detailState = getCheckState(detailLeaves);

                                          return (
                                            <li key={detail.elementDtlId}>
                                              <div className="flex items-center hover:bg-[var(--component-color-tertiary)] pl-12 py-2 pr-2">
                                                {showCheckboxes && detailLeaves.length > 0 && (
                                                  <Checkbox
                                                    size="small"
                                                    className="mr-2 shrink-0"
                                                    checked={detailState.checked}
                                                    indeterminate={detailState.indeterminate}
                                                    sx={{ padding: 0 }}
                                                    onChange={(e) => toggleDetailCheck(detail.elementDtlId, e.target.checked)}
                                                  />
                                                )}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    if (detail.childElementDtls) {
                                                      toggle(
                                                        openDetails,
                                                        setOpenDetails,
                                                        detail.elementDtlId
                                                      );
                                                    }
                                                    setSelectedId({
                                                      id: detail.elementDtlId,
                                                      seq: 3,
                                                    });
                                                  }}
                                                  className="w-full flex justify-between items-center text-left"
                                                >
                                                  <span>{detail.elementDtlName}</span>
                                                  {detail.childElementDtls &&
                                                    (openDetails.includes(detail.elementDtlId) ? (
                                                      <ChevronDown size={16} />
                                                    ) : (
                                                      <ChevronRight size={16} />
                                                    ))}
                                                </button>
                                              </div>

                                              {/* Child Elements Level 4 */}
                                              {openDetails.includes(detail.elementDtlId) &&
                                                detail.childElementDtls && (
                                                  <ul>
                                                    {[...detail.childElementDtls]
                                                      .sort((a, b) => parseInt(a.elementDtlSeq || '0') - parseInt(b.elementDtlSeq || '0'))
                                                      .map((child) => (
                                                        <li key={child.chElementDtlId}>
                                                          <div className="flex items-center pl-16 py-2 transition-colors hover:underline">
                                                            {showCheckboxes && (
                                                              <Checkbox
                                                                id={child.chElementDtlId}
                                                                className="mr-2 shrink-0"
                                                                checked={child.assigned}
                                                                sx={{ padding: 0 }}
                                                                onChange={(_, checked) => {
                                                                  setEnvFeatures((prev) =>
                                                                    prev.map((f) => ({
                                                                      ...f,
                                                                      featureElements:
                                                                        f.featureElements?.map(
                                                                          (el2) => ({
                                                                            ...el2,
                                                                            elementDetails:
                                                                              el2.elementDetails?.map(
                                                                                (detail2) => ({
                                                                                  ...detail2,
                                                                                  childElementDtls:
                                                                                    detail2.childElementDtls?.map(
                                                                                      (c) =>
                                                                                        c.chElementDtlId ===
                                                                                        child.chElementDtlId
                                                                                          ? {
                                                                                              ...c,
                                                                                              assigned:
                                                                                                checked,
                                                                                            }
                                                                                          : c
                                                                                    ),
                                                                                })
                                                                              ),
                                                                          })
                                                                        ),
                                                                    }))
                                                                  );
                                                                }}
                                                              />
                                                            )}
                                                            <label
                                                              htmlFor={child.chElementDtlId}
                                                              className="cursor-pointer select-none flex-1 pl-2"
                                                            >
                                                              {child.elementDtlDesc}
                                                            </label>
                                                          </div>
                                                        </li>
                                                      ))}
                                                  </ul>
                                                )}
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  )}
                              </li>
                            );
                          })}
                      </ul>
                    )}
                </li>
              );
            })}
        </ul>
      </div>

      {onUpdate && (
        <div className="flex justify-end mt-4 mr-4 shrink-0 border-t border-[var(--border-color)] pt-3 bg-[var(--component-color-secondary)] sticky bottom-0">
          <button
            type="button"
            onClick={() => { onUpdate() }}
            className="nnp-btn nnp-btn-primary"
          >
            Update Access
          </button>
        </div>
      )}
    </div>
  );
});

export default EnvironmentalFeatures;
