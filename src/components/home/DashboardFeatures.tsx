import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardOptions } from "@/models/dashboardOptions";
import AccordionItem from "@/sharedComponents/AccordionItem";

const DashboardFeatures = ({ options }: { options: DashboardOptions[] }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const activeOption = useMemo(() => options?.[activeTab] ?? options?.[0], [options, activeTab]);
  const activeChildren = activeOption?.children ?? [];

  useEffect(() => {
    setActiveTab(0);
  }, [options]);

  /* ── scroll-shadow indicators ─────────────────────────────────────── */
  const updateScrollIndicators = () => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollIndicators();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollIndicators, { passive: true });
    const ro = new ResizeObserver(updateScrollIndicators);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollIndicators);
      ro.disconnect();
    };
  }, [options]);

  /* Scroll the active tab into view when it changes */
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const activeEl = el.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    activeEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activeTab]);

return (
    <section className="home-utilities">
        <div className="home-section-title">Platform Utilities</div>
        {options && options.length > 0 && (
            <div style={{ width: '100%' }}>  {/* ← single alignment wrapper */}
                <div className="home-tab-strip-wrapper" style={{ position: "relative" }}>
                    {/* ...fade overlays unchanged... */}
                    <div
                        ref={stripRef}
                        className="home-tab-strip"
                        role="tablist"
                        aria-label="Platform utilities categories"
                    >
                        {options.map((option, index) => {
                            const isActive = index === activeTab;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    className={`home-tab ${isActive ? "home-tab-active" : ""}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    {option.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Panel sits flush below — same width, no extra padding */}
                <div className="home-tab-panel" role="tabpanel">
                    {activeChildren.length > 0 ? (
                        <div className="home-tab-panel-grid">
                            {activeChildren.map((child, index) => (
                                <div key={child.id || index} className="home-tab-card-wrap">
                                    <AccordionItem item={child} index={index} level={0} autoLoad={true} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="home-empty-state home-empty-state-panel">No Data Found</div>
                    )}
                </div>
            </div>
        )}
    </section>
);
};

export default DashboardFeatures;