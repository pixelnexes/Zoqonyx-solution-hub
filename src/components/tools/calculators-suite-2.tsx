"use client";

import * as React from "react";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  Clock,
  PieChart,
  Briefcase,
  Coins,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Download,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// ==========================================
// 1. SIP WEALTH CALCULATOR (sip-investment-calculator)
// Formula: M = P * ((1 + i)^n - 1) / i * (1 + i)
// ==========================================
export function SipInvestmentCalculatorTool() {
  const [monthlyInvestment, setMonthlyInvestment] = React.useState<number>(10000);
  const [expectedReturnRate, setExpectedReturnRate] = React.useState<number>(12);
  const [tenureYears, setTenureYears] = React.useState<number>(10);
  const [copied, setCopied] = React.useState(false);

  const results = React.useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const annualRate = Number(expectedReturnRate) || 0;
    const nYears = Number(tenureYears) || 0;

    const i = annualRate / 100 / 12;
    const n = nYears * 12;
    const investedAmount = P * n;

    let maturityValue = 0;
    if (i > 0 && n > 0) {
      maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      maturityValue = investedAmount;
    }

    const estimatedWealthGain = Math.max(0, maturityValue - investedAmount);

    // Year by year breakdown
    const yearlyBreakdown = [];
    let curInvested = 0;
    for (let yr = 1; yr <= Math.min(nYears, 30); yr++) {
      const months = yr * 12;
      curInvested = P * months;
      const curValue = i > 0 ? P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i) : curInvested;
      yearlyBreakdown.push({
        year: yr,
        invested: Math.round(curInvested),
        value: Math.round(curValue),
        wealthGain: Math.round(Math.max(0, curValue - curInvested)),
      });
    }

    return {
      investedAmount: Math.round(investedAmount),
      estimatedWealthGain: Math.round(estimatedWealthGain),
      maturityValue: Math.round(maturityValue),
      yearlyBreakdown,
    };
  }, [monthlyInvestment, expectedReturnRate, tenureYears]);

  const copySummary = () => {
    const text = `SIP Investment Summary:\nMonthly SIP: $${monthlyInvestment.toLocaleString()}\nTenure: ${tenureYears} Years\nExpected Annual Return: ${expectedReturnRate}%\nTotal Invested: $${results.investedAmount.toLocaleString()}\nEstimated Returns: $${results.estimatedWealthGain.toLocaleString()}\nTotal Maturity Value: $${results.maturityValue.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5 bg-card p-5 rounded-xl border border-border shadow-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Investment Parameters</span>
            </h3>
            <p className="text-xs text-muted-foreground">Calculate potential compound growth of monthly systematic investments.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <Label htmlFor="sip-amount" className="font-medium text-foreground">Monthly Investment ($)</Label>
                <span className="font-mono font-bold text-teal-600">${monthlyInvestment.toLocaleString()}</span>
              </div>
              <Input
                id="sip-amount"
                type="number"
                min={100}
                max={1000000}
                step={500}
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                className="font-mono text-sm"
              />
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <Label htmlFor="sip-rate" className="font-medium text-foreground">Expected Annual Return (%)</Label>
                <span className="font-mono font-bold text-teal-600">{expectedReturnRate}%</span>
              </div>
              <Input
                id="sip-rate"
                type="number"
                min={1}
                max={30}
                step={0.5}
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Math.max(0, Number(e.target.value)))}
                className="font-mono text-sm"
              />
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <Label htmlFor="sip-years" className="font-medium text-foreground">Investment Tenure (Years)</Label>
                <span className="font-mono font-bold text-teal-600">{tenureYears} Years</span>
              </div>
              <Input
                id="sip-years"
                type="number"
                min={1}
                max={40}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                className="font-mono text-sm"
              />
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={copySummary}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Summary!" : "Copy Investment Summary"}</span>
          </Button>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Total Invested</span>
              <p className="text-xl sm:text-2xl font-semibold text-slate-900 font-mono">
                ${results.investedAmount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500">Your total capital</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-emerald-700">Estimated Gains</span>
              <p className="text-xl sm:text-2xl font-semibold text-emerald-700 font-mono">
                +${results.estimatedWealthGain.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600">Compound interest earned</p>
            </div>

            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-teal-800">Total Maturity Value</span>
              <p className="text-xl sm:text-2xl font-semibold text-teal-900 font-mono">
                ${results.maturityValue.toLocaleString()}
              </p>
              <p className="text-[11px] text-teal-700">Future estimated corpus</p>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-600">Capital Ratio</span>
              <span className="text-emerald-700">
                {results.maturityValue > 0
                  ? Math.round((results.estimatedWealthGain / results.maturityValue) * 100)
                  : 0}
                % Returns
              </span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-slate-700 h-full transition-all duration-300"
                style={{
                  width: `${
                    results.maturityValue > 0
                      ? (results.investedAmount / results.maturityValue) * 100
                      : 100
                  }%`,
                }}
                title="Invested Capital"
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    results.maturityValue > 0
                      ? (results.estimatedWealthGain / results.maturityValue) * 100
                      : 0
                  }%`,
                }}
                title="Compound Growth"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                Invested: ${results.investedAmount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Gains: ${results.estimatedWealthGain.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Year-by-year table */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase font-mono">
              Year-by-Year Growth Projection
            </h4>
            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10.5px] border-b">
                  <tr>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Total Invested</th>
                    <th className="py-2 px-3">Wealth Gain</th>
                    <th className="py-2 px-3">Portfolio Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {results.yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-900">Year {row.year}</td>
                      <td className="py-2 px-3 text-slate-600">${row.invested.toLocaleString()}</td>
                      <td className="py-2 px-3 text-emerald-600">+${row.wealthGain.toLocaleString()}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">${row.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. MORTGAGE REFINANCE CALCULATOR (mortgage-refinance-calculator)
// ==========================================
export function MortgageRefinanceCalculatorTool() {
  const [currentBalance, setCurrentBalance] = React.useState<number>(350000);
  const [currentInterestRate, setCurrentInterestRate] = React.useState<number>(6.5);
  const [remainingYears, setRemainingYears] = React.useState<number>(25);

  const [newInterestRate, setNewInterestRate] = React.useState<number>(4.8);
  const [newTermYears, setNewTermYears] = React.useState<number>(20);
  const [closingCosts, setClosingCosts] = React.useState<number>(5000);

  const calcEmi = (P: number, annualRate: number, years: number) => {
    if (P <= 0 || years <= 0) return 0;
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const results = React.useMemo(() => {
    const curP = Number(currentBalance) || 0;
    const curRate = Number(currentInterestRate) || 0;
    const curYears = Number(remainingYears) || 1;

    const newRate = Number(newInterestRate) || 0;
    const newYears = Number(newTermYears) || 1;
    const costs = Number(closingCosts) || 0;

    const curMonthly = calcEmi(curP, curRate, curYears);
    const newMonthly = calcEmi(curP, newRate, newYears);

    const monthlySavings = curMonthly - newMonthly;

    const totalCurPayments = curMonthly * (curYears * 12);
    const totalCurInterest = Math.max(0, totalCurPayments - curP);

    const totalNewPayments = newMonthly * (newYears * 12);
    const totalNewInterest = Math.max(0, totalNewPayments - curP);

    const lifetimeInterestSaved = totalCurInterest - totalNewInterest;
    const netSavings = lifetimeInterestSaved - costs;

    // Break-even in months: closing costs / monthly savings
    let breakEvenMonths = 0;
    if (monthlySavings > 0) {
      breakEvenMonths = Math.ceil(costs / monthlySavings);
    }

    return {
      curMonthly: Math.round(curMonthly),
      newMonthly: Math.round(newMonthly),
      monthlySavings: Math.round(monthlySavings),
      totalCurInterest: Math.round(totalCurInterest),
      totalNewInterest: Math.round(totalNewInterest),
      lifetimeInterestSaved: Math.round(lifetimeInterestSaved),
      netSavings: Math.round(netSavings),
      breakEvenMonths,
    };
  }, [currentBalance, currentInterestRate, remainingYears, newInterestRate, newTermYears, closingCosts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Loan */}
        <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span>Current Mortgage Details</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Current Remaining Loan Balance ($)</Label>
              <Input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Current Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={currentInterestRate}
                onChange={(e) => setCurrentInterestRate(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Remaining Term (Years)</Label>
              <Input
                type="number"
                value={remainingYears}
                onChange={(e) => setRemainingYears(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border text-xs space-y-1">
              <span className="text-slate-500">Current Monthly Payment:</span>
              <p className="text-lg font-bold text-slate-900 font-mono">${results.curMonthly.toLocaleString()}/mo</p>
              <span className="text-slate-400 text-[10px]">Total remaining interest: ${results.totalCurInterest.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Refinanced Loan */}
        <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-xl border border-teal-200/80 shadow-xs">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold text-teal-800 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-teal-600" />
              <span>New Refinance Loan Options</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">New Interest Rate (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={newInterestRate}
                onChange={(e) => setNewInterestRate(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">New Loan Term (Years)</Label>
              <Input
                type="number"
                value={newTermYears}
                onChange={(e) => setNewTermYears(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Estimated Closing Costs ($)</Label>
              <Input
                type="number"
                value={closingCosts}
                onChange={(e) => setClosingCosts(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs space-y-1">
              <span className="text-teal-700">New Monthly Payment:</span>
              <p className="text-lg font-bold text-teal-900 font-mono">${results.newMonthly.toLocaleString()}/mo</p>
              <span className="text-teal-600 text-[10px]">Total new interest: ${results.totalNewInterest.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Monthly Cash Flow</span>
          <p className={`text-2xl font-semibold font-mono ${results.monthlySavings >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {results.monthlySavings >= 0 ? `+$${results.monthlySavings.toLocaleString()}` : `-$${Math.abs(results.monthlySavings).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-slate-500">
            {results.monthlySavings >= 0 ? "Saved every month" : "Higher payment per month"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Break-Even Period</span>
          <p className="text-2xl font-semibold text-slate-900 font-mono">
            {results.monthlySavings > 0 ? `${results.breakEvenMonths} Months` : "N/A"}
          </p>
          <p className="text-[11px] text-slate-500">To recoup closing costs</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Lifetime Net Savings</span>
          <p className={`text-2xl font-semibold font-mono ${results.netSavings >= 0 ? "text-teal-600" : "text-rose-600"}`}>
            {results.netSavings >= 0 ? `+$${results.netSavings.toLocaleString()}` : `-$${Math.abs(results.netSavings).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-slate-500">After accounting for closing costs</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. RETIREMENT CORPUS CALCULATOR (retirement-corpus-calculator)
// ==========================================
export function RetirementCorpusCalculatorTool() {
  const [currentAge, setCurrentAge] = React.useState<number>(30);
  const [retirementAge, setRetirementAge] = React.useState<number>(60);
  const [lifeExpectancy, setLifeExpectancy] = React.useState<number>(85);
  const [monthlyExpenseToday, setMonthlyExpenseToday] = React.useState<number>(4000);
  const [inflationRate, setInflationRate] = React.useState<number>(5.5);
  const [postRetireReturn, setPostRetireReturn] = React.useState<number>(8.0);

  const results = React.useMemo(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const yearsInRetire = Math.max(1, lifeExpectancy - retirementAge);

    const inf = inflationRate / 100;
    const r = postRetireReturn / 100;

    // Monthly expense at retirement
    const monthlyAtRetire = monthlyExpenseToday * Math.pow(1 + inf, yearsToRetire);
    const annualExpenseAtRetire = monthlyAtRetire * 12;

    // Real rate of return post-retirement
    const realRate = (r - inf) / (1 + inf);

    let corpusRequired = 0;
    if (Math.abs(realRate) < 0.0001) {
      corpusRequired = annualExpenseAtRetire * yearsInRetire;
    } else {
      corpusRequired = annualExpenseAtRetire * ((1 - Math.pow(1 + realRate, -yearsInRetire)) / realRate);
    }

    return {
      yearsToRetire,
      yearsInRetire,
      monthlyAtRetire: Math.round(monthlyAtRetire),
      annualExpenseAtRetire: Math.round(annualExpenseAtRetire),
      corpusRequired: Math.round(Math.max(0, corpusRequired)),
    };
  }, [currentAge, retirementAge, lifeExpectancy, monthlyExpenseToday, inflationRate, postRetireReturn]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Retirement Goals & Timeline</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Current Age</Label>
                <Input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label>Retirement Age</Label>
                <Input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Life Expectancy (Years)</Label>
              <Input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label>Current Monthly Expenses ($)</Label>
              <Input
                type="number"
                value={monthlyExpenseToday}
                onChange={(e) => setMonthlyExpenseToday(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Est. Inflation Rate (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label>Post-Retire Return (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={postRetireReturn}
                  onChange={(e) => setPostRetireReturn(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
            <span className="text-xs uppercase font-mono font-bold text-teal-800">Target Retirement Nest Egg</span>
            <p className="text-3xl sm:text-4xl font-semibold text-slate-900 font-mono">
              ${results.corpusRequired.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600">
              Required capital at age {retirementAge} to sustain {results.yearsInRetire} retirement years without depleting funds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Expense At Retirement</span>
              <p className="text-xl font-semibold text-slate-900 font-mono">
                ${results.monthlyAtRetire.toLocaleString()}/mo
              </p>
              <p className="text-[11px] text-slate-500">Inflation-adjusted equivalent of ${monthlyExpenseToday.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Retirement Span</span>
              <p className="text-xl font-semibold text-slate-900 font-mono">
                {results.yearsInRetire} Years
              </p>
              <p className="text-[11px] text-slate-500">Years {retirementAge} to {lifeExpectancy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. FREELANCE HOURLY RATE CALCULATOR (freelance-hourly-rate-calculator)
// ==========================================
export function FreelanceHourlyRateCalculatorTool() {
  const [desiredAnnualIncome, setDesiredAnnualIncome] = React.useState<number>(90000);
  const [annualBusinessExpenses, setAnnualBusinessExpenses] = React.useState<number>(12000);
  const [taxRatePercent, setTaxRatePercent] = React.useState<number>(25);
  const [vacationWeeks, setVacationWeeks] = React.useState<number>(4);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = React.useState<number>(25);

  const results = React.useMemo(() => {
    const netIncome = Number(desiredAnnualIncome) || 0;
    const expenses = Number(annualBusinessExpenses) || 0;
    const taxRate = (Number(taxRatePercent) || 0) / 100;

    // Gross revenue required to clear net after taxes & business expenses
    // gross = (net / (1 - taxRate)) + expenses
    const grossNeeded = (netIncome / Math.max(0.01, 1 - taxRate)) + expenses;

    const workingWeeks = Math.max(1, 52 - (Number(vacationWeeks) || 0));
    const totalBillableHours = workingWeeks * (Number(billableHoursPerWeek) || 1);

    const hourlyRate = grossNeeded / totalBillableHours;
    const dayRate = hourlyRate * 8;
    const monthlyBilling = grossNeeded / 12;

    return {
      grossNeeded: Math.round(grossNeeded),
      totalBillableHours,
      hourlyRate: Math.round(hourlyRate),
      dayRate: Math.round(dayRate),
      monthlyBilling: Math.round(monthlyBilling),
      workingWeeks,
    };
  }, [desiredAnnualIncome, annualBusinessExpenses, taxRatePercent, vacationWeeks, billableHoursPerWeek]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span>Income & Expense Targets</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Target Annual Take-Home (Net Pay $)</Label>
              <Input
                type="number"
                value={desiredAnnualIncome}
                onChange={(e) => setDesiredAnnualIncome(Number(e.target.value))}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label>Annual Business Expenses ($)</Label>
              <Input
                type="number"
                value={annualBusinessExpenses}
                onChange={(e) => setAnnualBusinessExpenses(Number(e.target.value))}
                className="font-mono text-sm"
              />
              <span className="text-[10.5px] text-muted-foreground">Software, hosting, hardware, accounting</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Tax Reserve (%)</Label>
                <Input
                  type="number"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label>Time Off (Weeks)</Label>
                <Input
                  type="number"
                  value={vacationWeeks}
                  onChange={(e) => setVacationWeeks(Number(e.target.value))}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Billable Hours Per Week</Label>
              <Input
                type="number"
                value={billableHoursPerWeek}
                onChange={(e) => setBillableHoursPerWeek(Number(e.target.value))}
                className="font-mono text-sm"
              />
              <span className="text-[10.5px] text-muted-foreground">Excludes marketing, admin, and invoicing</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-teal-800">Minimum Hourly Rate</span>
              <p className="text-3xl font-semibold text-teal-950 font-mono">${results.hourlyRate}/hr</p>
              <p className="text-[11px] text-teal-700">Based on {results.totalBillableHours} billable hours/yr</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">Standard Day Rate</span>
              <p className="text-3xl font-semibold text-slate-900 font-mono">${results.dayRate}/day</p>
              <p className="text-[11px] text-slate-500">Equivalent to 8 billable hours</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
            <span className="font-semibold text-slate-700">Financial Breakdown</span>
            <div className="space-y-1.5 font-mono text-[11.5px]">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Gross Annual Revenue Needed:</span>
                <span className="font-bold text-slate-900">${results.grossNeeded.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Target Monthly Invoicing:</span>
                <span className="font-bold text-slate-900">${results.monthlyBilling.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Working Weeks Per Year:</span>
                <span className="font-bold text-slate-900">{results.workingWeeks} Weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. CRYPTO ASSET ALLOCATION & P&L CALCULATOR (crypto-portfolio-tracker)
// ==========================================
export function CryptoPortfolioTrackerTool() {
  interface Holding {
    id: string;
    symbol: string;
    amount: number;
    buyPrice: number;
    currentPrice: number;
  }

  const [holdings, setHoldings] = React.useState<Holding[]>([
    { id: "1", symbol: "BTC", amount: 0.45, buyPrice: 52000, currentPrice: 88500 },
    { id: "2", symbol: "ETH", amount: 3.2, buyPrice: 2400, currentPrice: 3150 },
    { id: "3", symbol: "SOL", amount: 25, buyPrice: 110, currentPrice: 195 },
  ]);

  const [newSymbol, setNewSymbol] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newBuyPrice, setNewBuyPrice] = React.useState("");
  const [newCurrentPrice, setNewCurrentPrice] = React.useState("");

  const addHolding = () => {
    if (!newSymbol || !newAmount) return;
    setHoldings([
      ...holdings,
      {
        id: Date.now().toString(),
        symbol: newSymbol.toUpperCase().trim(),
        amount: Number(newAmount) || 0,
        buyPrice: Number(newBuyPrice) || 0,
        currentPrice: Number(newCurrentPrice) || Number(newBuyPrice) || 0,
      },
    ]);
    setNewSymbol("");
    setNewAmount("");
    setNewBuyPrice("");
    setNewCurrentPrice("");
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };

  const summary = React.useMemo(() => {
    let totalInvested = 0;
    let totalCurrentValue = 0;

    holdings.forEach((h) => {
      totalInvested += h.amount * h.buyPrice;
      totalCurrentValue += h.amount * h.currentPrice;
    });

    const totalProfit = totalCurrentValue - totalInvested;
    const percentReturn = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalInvested: Math.round(totalInvested),
      totalCurrentValue: Math.round(totalCurrentValue),
      totalProfit: Math.round(totalProfit),
      percentReturn: percentReturn.toFixed(2),
    };
  }, [holdings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Total Invested</span>
          <p className="text-2xl font-semibold text-slate-900 font-mono">${summary.totalInvested.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Current Value</span>
          <p className="text-2xl font-semibold text-teal-900 font-mono">${summary.totalCurrentValue.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold text-slate-500">Unrealized P&L</span>
          <p className={`text-2xl font-semibold font-mono ${summary.totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {summary.totalProfit >= 0 ? `+$${summary.totalProfit.toLocaleString()}` : `-$${Math.abs(summary.totalProfit).toLocaleString()}`}{" "}
            <span className="text-xs font-normal">({summary.percentReturn}%)</span>
          </p>
        </div>
      </div>

      {/* Add Holding Form */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
        <h4 className="text-xs font-semibold text-foreground uppercase font-mono">
          Add Crypto Asset Holding
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <Input
            placeholder="Symbol (BTC, ETH)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="text-xs"
          />
          <Input
            type="number"
            placeholder="Quantity / Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="text-xs"
          />
          <Input
            type="number"
            placeholder="Buy Price ($)"
            value={newBuyPrice}
            onChange={(e) => setNewBuyPrice(e.target.value)}
            className="text-xs"
          />
          <Input
            type="number"
            placeholder="Current Price ($)"
            value={newCurrentPrice}
            onChange={(e) => setNewCurrentPrice(e.target.value)}
            className="text-xs"
          />
          <Button
            type="button"
            onClick={addHolding}
            className="col-span-2 sm:col-span-1 bg-teal-600 hover:bg-teal-500 text-white text-xs"
          >
            Add Asset
          </Button>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[10.5px] border-b">
              <tr>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Holdings</th>
                <th className="py-2.5 px-3">Buy Price</th>
                <th className="py-2.5 px-3">Current Price</th>
                <th className="py-2.5 px-3">Total Value</th>
                <th className="py-2.5 px-3">Allocation %</th>
                <th className="py-2.5 px-3">P&L ($)</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {holdings.map((h) => {
                const val = h.amount * h.currentPrice;
                const cost = h.amount * h.buyPrice;
                const pnl = val - cost;
                const alloc = summary.totalCurrentValue > 0 ? (val / summary.totalCurrentValue) * 100 : 0;

                return (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{h.symbol}</td>
                    <td className="py-2.5 px-3 text-slate-700">{h.amount}</td>
                    <td className="py-2.5 px-3 text-slate-600">${h.buyPrice.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-semibold">${h.currentPrice.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-teal-900">${Math.round(val).toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-600">{alloc.toFixed(1)}%</td>
                    <td className={`py-2.5 px-3 font-bold ${pnl >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {pnl >= 0 ? `+$${Math.round(pnl).toLocaleString()}` : `-$${Math.round(Math.abs(pnl)).toLocaleString()}`}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeHolding(h.id)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-sans font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
