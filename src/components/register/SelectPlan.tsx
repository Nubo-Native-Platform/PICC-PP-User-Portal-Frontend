import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import PublicSvc from '@/services/PublicSvc';
import CookieService from '@/services/cookies';
import { calculateDiscount } from '@/services/Utils';

export type SelectPlanFormHandle = {
  isValid: () => boolean;
  submit: () => void;
};

export type SelectPlanFormProps = {
  formData, setFormData
}

const SelectPlanForm = forwardRef<SelectPlanFormHandle, SelectPlanFormProps>(({ formData, setFormData }, ref) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [planCompCache, setPlanCompCache] = useState<any>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const formRef = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => ({
    isValid: () => {
      if (!formRef.current) return false;
      return formRef.current.checkValidity();
    },
    submit: () => {
      if (formRef.current) {
        formRef.current.requestSubmit(); // Optional
      }
    },
  }));

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const plans = await PublicSvc.getPlans();
    console.log(plans);
    setPlans(plans);
  }

  const loadPlanComp = async (hostPlanid) => {
    if (!planCompCache[hostPlanid]) {
      const groupedPcComp: any[] = await PublicSvc.getPlanComp(hostPlanid);
      Object.keys(groupedPcComp).forEach(group => {
        groupedPcComp[group] = groupedPcComp[group].map(pc => ({
          ...pc,
          selected: pc.selectionType === "mandatory",
          monthlyPrice: (Number(pc.baseDayPrice) || 0) * 30
        }));
      });

      setPlanCompCache(prev => ({ ...prev, [hostPlanid]: groupedPcComp }));
      setFormData(prev => ({
        ...prev,
        planComps: groupedPcComp
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        planComps: [...planCompCache[hostPlanid]]
      }))
    }

  }
  const handlePlanChange = (hostPlanid) => {
    if (hostPlanid) {
      const selectedPlan = plans.find(p => p.hostPlanid == hostPlanid);
      setFormData(prev => ({ ...prev, hostPlanid, selectedPlan }))
      loadPlanComp(hostPlanid);
    } else {
      setFormData(prev => ({ ...prev, hostPlanid: "", planComps: [], selctedPlan: {} }))
    }
  }

  const updatePlanComps = (compId) => {
    setFormData(prev => {
      const updated = { ...prev.planComps };
      Object.keys(updated).forEach(group => {
        updated[group] = updated[group].map(pc =>
          pc.compId === compId ? { ...pc, selected: !pc.selected } : pc
        );
      });
      return { ...prev, planComps: updated };
    });
  }

  const viewPlanDetails = (hostPlanid) => {
    if (hostPlanid) {
      const selectedPlan = plans.find(p => p.hostPlanid == hostPlanid);
      window.open(selectedPlan?.hostPlanDtlPageLink || '', '_blank');
    }
  }

  useEffect(() => {
    let price = 0;
    let discountedPrice = 0;
    if (formData.selectedPlan) {
      price = Number(formData.selectedPlan.hostPlanBasePr) || 0;
      if (Object.keys(formData.planComps || {}).length > 0) {
        Object.values(formData.planComps || {}).forEach((group: any) => {
          group.forEach((pc: any) => {
            if (pc.selected) price += pc.monthlyPrice;
          });
        });
      }
      discountedPrice = calculateDiscount(price, formData.selectedPlan?.hostDefaultDct || 0);

    }
    setTotalPrice(Number(discountedPrice.toFixed(2)));
    setFormData(prev => ({ ...prev, totalPrice: Number(discountedPrice.toFixed(2)) }));
  }, [formData.selectedPlan, formData.planComps, formData.basePrice]);

  return (
    <form className="flex flex-col gap-2" ref={formRef}>
      <div>
        <label className="text-[var(--text-color-tertiary)] font-sm mt-1">Select Plan:</label>
        <select
          className="w-full pb-2 border-b border-[var(--border-color)] focus:outline-none font-md focus:border-[var(--text-color-tertiary)] "
          value={formData.hostPlanid}
          onChange={(e) => handlePlanChange(e.target.value)}
          required
        >
          <option value="">Select</option>
          {plans?.map((opt) => (
            <option key={opt.hostPlanid} value={opt.hostPlanid}>{opt.hostPlanName}{`: ${CookieService.getCountryCurrency()}${opt.hostPlanBasePr}`}{` [disc: ${opt.hostDefaultDct}%]`}</option>
          ))}
        </select>
        <label className="text-[var(--text-color-tertiary)] font-sm mt-1 flex justify-between">
          <span></span>
          <span className="cursor-pointer text-blue-500" onClick={() => viewPlanDetails(formData.hostPlanid)}>
            view details
          </span>
        </label>
      </div>
      {/* <div>
        <label className="text-[var(--text-color-tertiary)] font-sm mt-1">Select Plan Components</label>
        {formData.planComps.map((opt) => (
          <label key={opt.compId} className="flex items-center gap-2 cursor-pointer font-md">
            <input
              type="checkbox"
              checked={opt.selected}
              disabled={opt.selectionType === "mandatory"}
              onChange={(e) => {
                updatePlanComps(opt.compId)
              }}
            />
            {opt.compName} : ${opt.monthlyPrice}
          </label>
        ))}
      </div> */}
      <div>
        <label className="text-[var(--text-color-tertiary)] font-sm mt-1">
          Select Plan Components
        </label>

        {Object.entries(formData.planComps || {}).map(([groupName, comps]: [string, any[]]) => (
          <div key={groupName} className="mb-3">
            <h4 className="font-semibold text-[var(--text-color-primary)] mb-1">
              {groupName}
            </h4>
            {comps.map(opt => (
              <label key={opt.compId} className="flex items-center gap-2 cursor-pointer font-md">
                <input
                  type="checkbox"
                  checked={opt.selected}
                  disabled={opt.selectionType === "mandatory"}
                  onChange={() => updatePlanComps(opt.compId)}
                />
                {opt.compName} : {CookieService.getCountryCurrency()} {opt.monthlyPrice}
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <input
          type="date"
          className="w-full pb-2 border-b border-[var(--border-color)] focus:outline-none font-md focus:border-[var(--text-color-tertiary)] "
          min={(() => {
            const date = new Date();
            date.setDate(date.getDate() + 2);
            return date.toISOString().split("T")[0]; // format: YYYY-MM-DD
          })()}
          value={formData.planEffDate}
          required
          disabled
        />
        <label className="block text-[var(--text-color-tertiary)] font-sm mt-1">Plan Effective From Date*</label>
      </div>
      <div className="mt-3">
        <label className="block text-[var(--text-color-tertiary)] font-sm mt-1">Monthly Cost for Selected Components after Discount</label>
        <label className="block">{CookieService.getCountryCurrency()} {totalPrice}</label>
      </div>
    </form>
  );
});

export default SelectPlanForm;
