"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  DollarSign,
  Receipt,
  Percent,
  Clock,
  Car,
  GraduationCap,
  Copy,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

// 1. Loan EMI Calculator
export function LoanEmiCalculatorTool() {
  const [loanAmount, setLoanAmount] = React.useState<number>(50000);
  const [interestRate, setInterestRate] = React.useState<number>(8.5);
  const [tenureYears, setTenureYears] = React.useState<number>(5);

  const calculateEmi = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (r === 0) return { emi: p / n, totalInterest: 0, totalPayment: p };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const results = calculateEmi();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Loan Amount ($)</Label>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Annual Interest Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Loan Tenure (Years)</Label>
            <Input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value) || 1)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
            <span className="text-2xl font-black text-teal-400">
              ${results.emi.toLocaleString()}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Monthly EMI
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-foreground">
              ${results.totalInterest.toLocaleString()}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Total Interest
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-foreground">
              ${results.totalPayment.toLocaleString()}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Total Payment (Principal + Interest)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Tip Calculator
export function TipCalculatorTool() {
  const [bill, setBill] = React.useState<number>(100);
  const [tipPercent, setTipPercent] = React.useState<number>(15);
  const [people, setPeople] = React.useState<number>(2);

  const tipAmount = (bill * tipPercent) / 100;
  const totalBill = bill + tipAmount;
  const perPersonTip = people > 0 ? tipAmount / people : 0;
  const perPersonTotal = people > 0 ? totalBill / people : 0;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Bill Amount ($)</Label>
            <Input
              type="number"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tip Percentage (%)</Label>
            <div className="flex gap-2">
              {[10, 15, 20].map((tp) => (
                <Button
                  key={tp}
                  size="sm"
                  variant={tipPercent === tp ? "default" : "outline"}
                  onClick={() => setTipPercent(tp)}
                  className={tipPercent === tp ? "bg-teal-600 text-white" : "text-xs"}
                >
                  {tp}%
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Number of Diners</Label>
            <Input
              type="number"
              value={people}
              onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
            <span className="text-2xl font-black text-teal-400">
              ${perPersonTotal.toFixed(2)}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Total Per Person
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-foreground">
              ${perPersonTip.toFixed(2)}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Tip Per Person
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Discount Calculator
export function DiscountCalculatorTool() {
  const [originalPrice, setOriginalPrice] = React.useState<number>(120);
  const [discountPercent, setDiscountPercent] = React.useState<number>(25);

  const savings = (originalPrice * discountPercent) / 100;
  const finalPrice = Math.max(0, originalPrice - savings);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Original Price ($)</Label>
            <Input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Discount (%)</Label>
            <Input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
            <span className="text-3xl font-black text-teal-400">${finalPrice.toFixed(2)}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Sale Price
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-3xl font-black text-foreground">${savings.toFixed(2)}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              You Save
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Compound Interest Calculator
export function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = React.useState<number>(10000);
  const [rate, setRate] = React.useState<number>(7);
  const [years, setYears] = React.useState<number>(10);
  const [monthlyContribution, setMonthlyContribution] = React.useState<number>(200);

  const calculate = () => {
    let balance = principal;
    const r = rate / 100 / 12;
    const months = years * 12;
    for (let i = 0; i < months; i++) {
      balance = (balance + monthlyContribution) * (1 + r);
    }
    const totalContributed = principal + monthlyContribution * months;
    const totalInterest = balance - totalContributed;

    return {
      futureValue: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      totalInterest: Math.round(totalInterest),
    };
  };

  const results = calculate();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Initial Deposit ($)</Label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Annual Rate (%)</Label>
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Time (Years)</Label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value) || 1)}
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Monthly Addition ($)</Label>
            <Input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
            <span className="text-2xl font-black text-teal-400">
              ${results.futureValue.toLocaleString()}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Future Portfolio Value
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-foreground">
              ${results.totalContributed.toLocaleString()}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Total Deposits
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-2xl font-black text-teal-400">
              ${results.totalInterest.toLocaleString()}
            </span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Compound Interest Earned
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Sales Tax Calculator
export function SalesTaxCalculatorTool() {
  const [netAmount, setNetAmount] = React.useState<number>(100);
  const [taxRate, setTaxRate] = React.useState<number>(8.25);

  const taxAmount = (netAmount * taxRate) / 100;
  const grossAmount = netAmount + taxAmount;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Net Amount ($)</Label>
            <Input
              type="number"
              value={netAmount}
              onChange={(e) => setNetAmount(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tax Rate (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
            <span className="text-3xl font-black text-teal-400">${grossAmount.toFixed(2)}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Gross Total (Including Tax)
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-3xl font-black text-foreground">${taxAmount.toFixed(2)}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Tax Amount
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Number to Words Converter
export function NumberToWordsTool() {
  const [number, setNumber] = React.useState<number>(1250);

  const toWords = (num: number): string => {
    if (num === 0) return "Zero";
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const inWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + inWords(n % 100) : "");
      if (n < 1000000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
      if (n < 1000000000) return inWords(Math.floor(n / 1000000)) + " Million" + (n % 1000000 !== 0 ? " " + inWords(n % 1000000) : "");
      return "Number too large";
    };

    return inWords(num);
  };

  const words = toWords(Math.abs(number));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Enter Number</Label>
          <Input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value) || 0)}
            className="font-mono text-base font-bold"
          />
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">In English Words</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(words)}
              className="text-xs gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-base font-semibold text-teal-400">
            {words} Dollars Only
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. Binary / Hex / Decimal Converter
export function BinaryHexDecimalTool() {
  const [dec, setDec] = React.useState<number>(255);

  const updateFromDec = (val: number) => setDec(val);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Decimal (Base 10)</Label>
            <Input
              type="number"
              value={dec}
              onChange={(e) => updateFromDec(parseInt(e.target.value, 10) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Hexadecimal (Base 16)</Label>
            <Input
              value={dec.toString(16).toUpperCase()}
              readOnly
              className="font-mono text-sm text-teal-400 bg-muted/40"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Binary (Base 2)</Label>
            <Input
              value={dec.toString(2)}
              readOnly
              className="font-mono text-sm text-teal-400 bg-muted/40"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Octal (Base 8)</Label>
            <Input
              value={dec.toString(8)}
              readOnly
              className="font-mono text-sm text-teal-400 bg-muted/40"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Invoice Generator
export function InvoiceGeneratorTool() {
  const [client, setClient] = React.useState<string>("Acme Corp");
  const [items, setItems] = React.useState<{ desc: string; qty: number; rate: number }[]>([
    { desc: "Web Development Services", qty: 40, rate: 75 },
    { desc: "UI/UX System Design", qty: 10, rate: 90 },
  ]);

  const addItem = () => setItems([...items, { desc: "New Task", qty: 1, rate: 50 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, val: any) => {
    const copy = [...items];
    (copy[i] as any)[field] = val;
    setItems(copy);
  };

  const subtotal = items.reduce((acc, it) => acc + it.qty * it.rate, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Client Name</Label>
            <Input value={client} onChange={(e) => setClient(e.target.value)} />
          </div>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-teal-600 hover:bg-teal-500 text-white gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Invoice Items</Label>
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                value={it.desc}
                onChange={(e) => updateItem(idx, "desc", e.target.value)}
                placeholder="Description"
                className="flex-1 text-xs"
              />
              <Input
                type="number"
                value={it.qty}
                onChange={(e) => updateItem(idx, "qty", Number(e.target.value) || 0)}
                className="w-20 text-xs font-mono"
              />
              <Input
                type="number"
                value={it.rate}
                onChange={(e) => updateItem(idx, "rate", Number(e.target.value) || 0)}
                className="w-24 text-xs font-mono"
              />
              <span className="w-20 text-right text-xs font-mono font-bold">
                ${it.qty * it.rate}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(idx)}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addItem} className="text-xs gap-1 mt-1">
            <Plus className="w-3.5 h-3.5" /> Add Line Item
          </Button>
        </div>

        <div className="border-t border-border pt-3 flex justify-end">
          <div className="w-64 space-y-1 text-xs text-right">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border font-bold text-sm">
              <span>Total Due:</span>
              <span className="text-teal-400 font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. GPA Calculator
export function GpaCalculatorTool() {
  const [courses, setCourses] = React.useState<{ name: string; credits: number; grade: string }[]>([
    { name: "Computer Systems", credits: 3, grade: "A" },
    { name: "Algorithms", credits: 4, grade: "A-" },
    { name: "Calculus", credits: 3, grade: "B+" },
  ]);

  const GRADE_POINTS: Record<string, number> = {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "D": 1.0,
    "F": 0.0,
  };

  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const totalPoints = courses.reduce((acc, c) => acc + c.credits * (GRADE_POINTS[c.grade] || 0), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="space-y-2">
          {courses.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={c.name}
                onChange={(e) => {
                  const copy = [...courses];
                  copy[i].name = e.target.value;
                  setCourses(copy);
                }}
                className="flex-1 text-xs"
              />
              <Input
                type="number"
                value={c.credits}
                onChange={(e) => {
                  const copy = [...courses];
                  copy[i].credits = Number(e.target.value) || 0;
                  setCourses(copy);
                }}
                className="w-20 text-xs font-mono"
              />
              <select
                value={c.grade}
                onChange={(e) => {
                  const copy = [...courses];
                  copy[i].grade = e.target.value;
                  setCourses(copy);
                }}
                className="p-2 text-xs rounded border border-border bg-background"
              >
                {Object.keys(GRADE_POINTS).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
          <span className="text-3xl font-black text-teal-400">{gpa}</span>
          <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
            Calculated Cumulative GPA ({totalCredits} Credits)
          </p>
        </div>
      </div>
    </div>
  );
}

// 10. Fuel Cost Calculator
export function FuelCostCalculatorTool() {
  const [distance, setDistance] = React.useState<number>(350);
  const [efficiency, setEfficiency] = React.useState<number>(28); // MPG
  const [price, setPrice] = React.useState<number>(3.65); // $ / gallon

  const gallons = efficiency > 0 ? distance / efficiency : 0;
  const cost = gallons * price;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Trip Distance (Miles)</Label>
            <Input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Fuel Economy (MPG)</Label>
            <Input
              type="number"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value) || 1)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Gas Price ($ / Gallon)</Label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || 0)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
            <span className="text-3xl font-black text-teal-400">${cost.toFixed(2)}</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Total Trip Fuel Cost
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
            <span className="text-3xl font-black text-foreground">{gallons.toFixed(1)} gal</span>
            <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
              Fuel Needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 11. Time Duration Calculator
export function TimeDurationCalculatorTool() {
  const [start, setStart] = React.useState<string>("09:00");
  const [end, setEnd] = React.useState<string>("17:30");

  const calculateHours = () => {
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    let totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes, totalMinutes };
  };

  const diff = calculateHours();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Start Time</Label>
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">End Time</Label>
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/10 text-center">
          <span className="text-3xl font-black text-teal-400">
            {diff.hours} hrs {diff.minutes} mins
          </span>
          <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
            Total Elapsed Duration ({diff.totalMinutes} minutes)
          </p>
        </div>
      </div>
    </div>
  );
}