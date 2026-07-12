import React, { useState } from "react";
import { Calculator, Activity, Percent, Info, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

interface ToolCalculatorProps {
  toolId: string;
  onRecordHistory: (summary: string, excerpt?: string) => void;
  favorites?: any[];
  onToggleFavorite?: (id: string) => void;
  onTriggerNotification?: (title: string, desc: string) => void;
  onSelectTool?: (id: string | null) => void;
}

export default function ToolCalculator({
  toolId,
  onRecordHistory,
  favorites = [],
  onToggleFavorite,
  onTriggerNotification,
  onSelectTool,
}: ToolCalculatorProps) {
  // 1. EMI Loan States
  const [loanAmount, setLoanAmount] = useState<number>(15000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [tenure, setTenure] = useState<number>(36); // months
  
  // 2. BMI States
  const [bmiUnit, setBmiUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState<number>(70); // kg or lbs
  const [height, setHeight] = useState<number>(175); // cm or inches

  // 3. Percentage States
  const [pctNum1, setPctNum1] = useState<number>(15);
  const [pctNum2, setPctNum2] = useState<number>(250);
  const [propNum1, setPropNum1] = useState<number>(45);
  const [propNum2, setPropNum2] = useState<number>(180);
  const [changeNum1, setChangeNum1] = useState<number>(120);
  const [changeNum2, setChangeNum2] = useState<number>(150);

  // --- 1. LOAN COMPUTATIONS ---
  const calculateLoanEMI = () => {
    const P = loanAmount;
    const r = (interestRate / 12) / 100;
    const n = tenure;

    if (r === 0) {
      const emi = P / n;
      const totalPayable = P;
      return { emi, totalInterest: 0, totalPayable };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;

    return {
      emi: isNaN(emi) ? 0 : emi,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      totalPayable: isNaN(totalPayable) ? 0 : totalPayable,
    };
  };

  const { emi, totalInterest, totalPayable } = calculateLoanEMI();

  // --- 2. BMI COMPUTATIONS ---
  const calculateBMI = () => {
    if (weight <= 0 || height <= 0) return { bmi: 0, category: "Invalid input", color: "text-neutral-500" };
    
    let bmi = 0;
    if (bmiUnit === "metric") {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    } else {
      bmi = (weight / (height * height)) * 703;
    }

    let category = "Normal";
    let color = "text-emerald-400";
    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-sky-400";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Healthy / Normal Weight";
      color = "text-emerald-400";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      color = "text-amber-400";
    } else {
      category = "Obese Zone";
      color = "text-red-400";
    }

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      color,
    };
  };

  const { bmi, category: bmiCategory, color: bmiColor } = calculateBMI();

  // --- 3. PERCENTAGE COMPUTATIONS ---
  const pctResult1 = (pctNum1 / 100) * pctNum2;
  const pctResult2 = propNum2 !== 0 ? (propNum1 / propNum2) * 100 : 0;
  const pctResult3 = changeNum1 !== 0 ? ((changeNum2 - changeNum1) / changeNum1) * 100 : 0;

  return (
    <div id="calculator-tool-container" className="space-y-6">
      {/* 1. EMI LOAN CALCULATOR */}
      {toolId === "calculator-loan" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Loan Parameters</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Principal Amount</span>
                  <span className="text-white font-semibold">${loanAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="500"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-neutral-950 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Interest Rate (Annual %)</span>
                  <span className="text-white font-semibold">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-neutral-950 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Loan Tenure (Months)</span>
                  <span className="text-white font-semibold">{tenure} mos</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={tenure}
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-neutral-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                onRecordHistory(`Calculated EMI Loan Details`, `$${loanAmount} principal at ${interestRate}%`);
                alert("Amortization summary logged in browser session successfully.");
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
            >
              Export Amortization Ledger
            </button>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Monthly EMI Ledger</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-850 text-center">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Monthly EMI</span>
                <p className="text-lg md:text-xl font-bold font-mono text-indigo-400 mt-1">
                  ${emi.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-850 text-center">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Total Interest</span>
                <p className="text-lg md:text-xl font-bold font-mono text-amber-500 mt-1">
                  ${totalInterest.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-850 text-center">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Total Payable</span>
                <p className="text-lg md:text-xl font-bold font-mono text-white mt-1">
                  ${totalPayable.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Proportion visualization bar */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-400">Principal vs Interest Proportion</span>
              <div className="h-3.5 w-full bg-neutral-950 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-indigo-600" 
                  style={{ width: `${(loanAmount / totalPayable) * 100}%` }}
                  title="Principal Proportion"
                />
                <div 
                  className="h-full bg-amber-500" 
                  style={{ width: `${(totalInterest / totalPayable) * 100}%` }}
                  title="Cumulative Interest"
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-indigo-600" /> Principal ({(loanAmount / totalPayable * 100).toFixed(0)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-amber-500" /> Cumulative Interest ({(totalInterest / totalPayable * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HEALTHY BMI CALCULATOR */}
      {toolId === "calculator-bmi" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800/60">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Body Parameters</h3>
              </div>
              
              <div className="flex gap-1.5 p-0.5 bg-neutral-950 border border-neutral-850 rounded">
                <button
                  type="button"
                  onClick={() => setBmiUnit("metric")}
                  className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded ${bmiUnit === "metric" ? "bg-indigo-600 text-white" : "text-neutral-500 hover:text-white"}`}
                >
                  Metric
                </button>
                <button
                  type="button"
                  onClick={() => setBmiUnit("imperial")}
                  className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded ${bmiUnit === "imperial" ? "bg-indigo-600 text-white" : "text-neutral-500 hover:text-white"}`}
                >
                  Imperial
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">
                  Weight ({bmiUnit === "metric" ? "kg" : "lbs"})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400">
                  Height ({bmiUnit === "metric" ? "cm" : "inches"})
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Your Health Zone</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-950/80 border border-neutral-850 rounded-xl">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Computed Body Mass Index</span>
                  <p className={`text-2xl font-bold font-mono mt-1 ${bmiColor}`}>
                    {bmi || "0.0"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Category Zone</span>
                  <p className={`text-sm font-semibold mt-1 ${bmiColor}`}>{bmiCategory}</p>
                </div>
              </div>
            </div>

            {/* Health Scale Graphic */}
            <div className="space-y-2 pt-2">
              <div className="h-2 w-full rounded-full bg-neutral-950 overflow-hidden flex relative">
                {/* Underweight Zone */}
                <div className="h-full bg-sky-400 w-[25%]" title="Underweight" />
                {/* Healthy Zone */}
                <div className="h-full bg-emerald-400 w-[25%]" title="Healthy Zone" />
                {/* Overweight Zone */}
                <div className="h-full bg-amber-400 w-[25%]" title="Overweight" />
                {/* Obese Zone */}
                <div className="h-full bg-red-400 w-[25%]" title="Obese" />

                {/* Arrow pointer matching BMI position */}
                {bmi > 0 && (
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-white border border-black shadow"
                    style={{ left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between text-[8px] md:text-[10px] text-neutral-500 font-mono uppercase tracking-wide">
                <span>Underweight (&lt;18.5)</span>
                <span>Healthy (18.5 - 25)</span>
                <span>Overweight (25 - 30)</span>
                <span>Obese (&gt;30)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SMART PERCENTAGE TOOL */}
      {toolId === "calculator-percentage" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/60">
            <Percent className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Smart Percentage Calculators</h3>
          </div>

          <div className="space-y-4 divide-y divide-neutral-850">
            {/* Calculation 1: What is X% of Y? */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-300">
                <span>What is</span>
                <input
                  type="number"
                  value={pctNum1}
                  onChange={(e) => setPctNum1(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-neutral-950 border border-neutral-800 rounded p-1 text-center font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span>% of</span>
                <input
                  type="number"
                  value={pctNum2}
                  onChange={(e) => setPctNum2(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-neutral-950 border border-neutral-800 rounded p-1 text-center font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span>?</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ArrowRight className="w-4 h-4 text-neutral-500 hidden md:block" />
                <div className="px-4 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-emerald-400 font-mono font-bold text-xs md:text-sm min-w-[80px] text-center">
                  {pctResult1.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Calculation 2: X is what percentage of Y? */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 py-2">
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-300">
                <input
                  type="number"
                  value={propNum1}
                  onChange={(e) => setPropNum1(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-neutral-950 border border-neutral-800 rounded p-1 text-center font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span>is what percentage of</span>
                <input
                  type="number"
                  value={propNum2}
                  onChange={(e) => setPropNum2(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-neutral-950 border border-neutral-800 rounded p-1 text-center font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span>?</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ArrowRight className="w-4 h-4 text-neutral-500 hidden md:block" />
                <div className="px-4 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-indigo-400 font-mono font-bold text-xs md:text-sm min-w-[80px] text-center">
                  {pctResult2.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Calculation 3: Percentage increase/decrease */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 py-2">
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-300">
                <span>What is the percentage change from</span>
                <input
                  type="number"
                  value={changeNum1}
                  onChange={(e) => setChangeNum1(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-neutral-950 border border-neutral-800 rounded p-1 text-center font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span>to</span>
                <input
                  type="number"
                  value={changeNum2}
                  onChange={(e) => setChangeNum2(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-neutral-950 border border-neutral-800 rounded p-1 text-center font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span>?</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ArrowRight className="w-4 h-4 text-neutral-500 hidden md:block" />
                <div className={`px-4 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg font-mono font-bold text-xs md:text-sm min-w-[80px] text-center ${pctResult3 >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {pctResult3 >= 0 ? "+" : ""}{pctResult3.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
