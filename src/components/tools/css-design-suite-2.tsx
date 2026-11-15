"use client";

import * as React from "react";
import {
  Type,
  Layers,
  Palette,
  Download,
  Copy,
  Check,
  Undo2,
  Trash2,
  Plus,
  Compass,
  Square,
  Circle,
  PenTool,
  Eraser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ==========================================
// 1. 3D TEXT GENERATOR (3d-text-generator)
// ==========================================
export function ThreeDTextGeneratorTool() {
  const [text, setText] = React.useState("ZOQONYX 3D");
  const [fontSize, setFontSize] = React.useState(54);
  const [depth, setDepth] = React.useState(8);
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [shadowColor, setShadowColor] = React.useState("#0d9488");
  const [bgColor, setBgColor] = React.useState("#0f172a");
  const [copied, setCopied] = React.useState(false);

  const textShadowCss = React.useMemo(() => {
    const shadows = [];
    for (let i = 1; i <= depth; i++) {
      shadows.push(`${i}px ${i}px 0px ${shadowColor}`);
    }
    // Add realistic ambient blur at the bottom
    shadows.push(`${depth + 2}px ${depth + 2}px 10px rgba(0, 0, 0, 0.5)`);
    return shadows.join(", ");
  }, [depth, shadowColor]);

  const cssSnippet = `font-size: ${fontSize}px;
font-weight: 900;
color: ${textColor};
text-shadow: ${textShadowCss};`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Type className="w-4 h-4 text-teal-600" />
            <span>3D Text Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Text String</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="font-bold text-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label>Extrusion Depth ({depth}px)</Label>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-teal-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label>Font Size ({fontSize}px)</Label>
              </div>
              <input
                type="range"
                min="24"
                max="96"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-teal-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Text Color</Label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8 rounded border cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Shadow Color</Label>
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-full h-8 rounded border cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Canvas Bg</Label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-8 rounded border cursor-pointer"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(cssSnippet);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied CSS!" : "Copy CSS Text Shadow"}</span>
          </Button>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div
            className="w-full min-h-[260px] rounded-xl border border-border flex items-center justify-center p-6 text-center transition-colors overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
            <span
              style={{
                fontSize: `${fontSize}px`,
                color: textColor,
                textShadow: textShadowCss,
                fontWeight: 900,
                letterSpacing: "0.05em",
                fontFamily: "var(--font-poppins), sans-serif",
                wordBreak: "break-word",
              }}
            >
              {text}
            </span>
          </div>

          <pre className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto">
            {cssSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. FLOWCHART MAKER (flowchart-maker)
// ==========================================
export function FlowchartMakerTool() {
  interface NodeItem {
    id: string;
    type: "start" | "process" | "decision" | "end";
    label: string;
  }

  const [nodes, setNodes] = React.useState<NodeItem[]>([
    { id: "1", type: "start", label: "Start Workflow" },
    { id: "2", type: "process", label: "Collect User Input" },
    { id: "3", type: "decision", label: "Is Input Valid?" },
    { id: "4", type: "process", label: "Process Client-Side" },
    { id: "5", type: "end", label: "Export Result" },
  ]);

  const [newNodeLabel, setNewNodeLabel] = React.useState("");
  const [newNodeType, setNewNodeType] = React.useState<NodeItem["type"]>("process");

  const addNode = () => {
    if (!newNodeLabel) return;
    setNodes([...nodes, { id: Date.now().toString(), type: newNodeType, label: newNodeLabel }]);
    setNewNodeLabel("");
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-700">
          Add Flowchart Step / Node
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            placeholder="Step description..."
            className="flex-1 text-xs"
          />
          <select
            value={newNodeType}
            onChange={(e) => setNewNodeType(e.target.value as NodeItem["type"])}
            className="h-10 px-3 rounded-md border border-input bg-background text-xs"
          >
            <option value="start">Start (Pill)</option>
            <option value="process">Process (Rectangle)</option>
            <option value="decision">Decision (Diamond)</option>
            <option value="end">End (Pill)</option>
          </select>
          <Button
            type="button"
            onClick={addNode}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </Button>
        </div>
      </div>

      {/* Visual Flowchart Canvas */}
      <div className="p-8 rounded-xl border border-border bg-slate-50/60 min-h-[300px] flex flex-col items-center justify-center space-y-4">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div className="relative group">
              <div
                className={`px-6 py-3 font-semibold text-xs text-center shadow-xs transition-all ${
                  node.type === "start" || node.type === "end"
                    ? "rounded-full bg-emerald-600 text-white border-2 border-emerald-700"
                    : node.type === "decision"
                    ? "rounded-md bg-amber-500 text-slate-950 font-bold border-2 border-amber-600 transform rotate-0"
                    : "rounded-lg bg-white text-slate-900 border-2 border-slate-300"
                }`}
              >
                <span>{node.label}</span>
                <button
                  type="button"
                  onClick={() => removeNode(node.id)}
                  className="opacity-0 group-hover:opacity-100 ml-2 text-rose-500 hover:text-rose-700 transition-opacity"
                  title="Delete Step"
                >
                  ×
                </button>
              </div>
            </div>

            {idx < nodes.length - 1 && (
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-5 bg-slate-400" />
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-500" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. MIND MAP MAKER (mind-map-maker)
// ==========================================
export function MindMapMakerTool() {
  interface MindNode {
    id: string;
    text: string;
    children: string[];
  }

  const [rootTopic, setRootTopic] = React.useState("Core Project Concept");
  const [branches, setBranches] = React.useState<MindNode[]>([
    { id: "1", text: "Design System", children: ["Typography: Poppins", "Color Palette", "Card Elevation"] },
    { id: "2", text: "Architecture", children: ["Client-Side Processing", "WebAssembly", "Zero Server Uploads"] },
    { id: "3", text: "SEO & Growth", children: ["Search Intent Queries", "Schema Markup", "Sitemap Indexing"] },
  ]);

  const [newBranchText, setNewBranchText] = React.useState("");
  const [newSubNodeText, setNewSubNodeText] = React.useState("");
  const [selectedBranchId, setSelectedBranchId] = React.useState("1");

  const addBranch = () => {
    if (!newBranchText) return;
    setBranches([...branches, { id: Date.now().toString(), text: newBranchText, children: [] }]);
    setNewBranchText("");
  };

  const addSubNode = () => {
    if (!newSubNodeText) return;
    setBranches(
      branches.map((b) => (b.id === selectedBranchId ? { ...b, children: [...b.children, newSubNodeText] } : b))
    );
    setNewSubNodeText("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="space-y-2">
          <Label className="text-xs">Central Mind Map Theme</Label>
          <Input
            value={rootTopic}
            onChange={(e) => setRootTopic(e.target.value)}
            className="font-bold text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Add Major Branch</Label>
          <div className="flex gap-2">
            <Input
              value={newBranchText}
              onChange={(e) => setNewBranchText(e.target.value)}
              placeholder="Branch Name..."
              className="text-xs"
            />
            <Button type="button" onClick={addBranch} className="bg-teal-600 hover:bg-teal-500 text-white text-xs">
              + Branch
            </Button>
          </div>
        </div>
      </div>

      {/* Mindmap Interactive Tree Rendering */}
      <div className="p-8 rounded-xl border border-border bg-slate-50/70 overflow-x-auto min-h-[320px] flex items-center justify-center">
        <div className="flex items-center gap-8">
          {/* Root Central Node */}
          <div className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md border-2 border-slate-700">
            {rootTopic}
          </div>

          {/* Branches */}
          <div className="space-y-5">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-center gap-4">
                <div className="w-6 h-0.5 bg-teal-500" />
                <div className="space-y-2">
                  <div className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold text-xs shadow-xs">
                    {branch.text}
                  </div>

                  {/* Subnodes */}
                  {branch.children.length > 0 && (
                    <div className="pl-4 border-l-2 border-teal-300 space-y-1">
                      {branch.children.map((child, cIdx) => (
                        <div key={cIdx} className="px-3 py-1 rounded bg-white border text-[11px] text-slate-700 shadow-xs">
                          {child}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. WHITEBOARD DRAWING TOOL (whiteboard-tool)
// ==========================================
export function WhiteboardTool() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = React.useState<"pen" | "eraser">("pen");
  const [brushColor, setBrushColor] = React.useState("#0d9488");
  const [lineWidth, setLineWidth] = React.useState(3);
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : brushColor;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `whiteboard_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={tool === "pen" ? "default" : "outline"}
            onClick={() => setTool("pen")}
            className="text-xs h-8 gap-1.5"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Pen</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant={tool === "eraser" ? "default" : "outline"}
            onClick={() => setTool("eraser")}
            className="text-xs h-8 gap-1.5"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </Button>

          <div className="flex items-center gap-1.5 pl-2 border-l">
            <span className="text-xs text-slate-500">Color:</span>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-7 h-7 rounded border cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l">
            <span className="text-xs text-slate-500">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20 h-1.5 accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={clearCanvas}
            className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Clear</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={downloadWhiteboard}
            className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="border border-border rounded-xl overflow-hidden bg-white shadow-xs flex justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          className="cursor-crosshair max-w-full h-auto"
        />
      </div>
    </div>
  );
}
