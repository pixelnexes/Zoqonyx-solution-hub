"use client";

import * as React from "react";
import {
  Code,
  Terminal,
  Server,
  FileCode,
  Video,
  Play,
  Square,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Globe,
  Sliders,
  Layers,
  Send,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ==========================================
// 1. DOCKERFILE GENERATOR (dockerfile-generator)
// ==========================================
export function DockerfileGeneratorTool() {
  const [language, setLanguage] = React.useState("nodejs");
  const [nodeVersion, setNodeVersion] = React.useState("20-alpine");
  const [port, setPort] = React.useState("3000");
  const [packageManager, setPackageManager] = React.useState("npm");
  const [isMultiStage, setIsMultiStage] = React.useState(true);
  const [useNonRoot, setUseNonRoot] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const dockerfileContent = React.useMemo(() => {
    switch (language) {
      case "nodejs":
        if (isMultiStage) {
          return `# Multi-stage Dockerfile for Node.js Application
FROM node:${nodeVersion} AS deps
WORKDIR /app
COPY package*.json ${packageManager === "yarn" ? "yarn.lock" : packageManager === "pnpm" ? "pnpm-lock.yaml" : ""} ./
RUN ${packageManager === "pnpm" ? "npm install -g pnpm && pnpm install --frozen-lockfile" : packageManager === "yarn" ? "yarn install --frozen-lockfile" : "npm ci"}

FROM node:${nodeVersion} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ${packageManager === "pnpm" ? "npm install -g pnpm && pnpm run build" : packageManager === "yarn" ? "yarn build" : "npm run build"}

FROM node:${nodeVersion} AS runner
WORKDIR /app
ENV NODE_ENV=production
${useNonRoot ? "USER node" : ""}
COPY --from=builder /app ./
EXPOSE ${port}
CMD ["npm", "start"]`;
        }
        return `FROM node:${nodeVersion}
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
${useNonRoot ? "USER node" : ""}
EXPOSE ${port}
CMD ["npm", "start"]`;

      case "python":
        return `# Production Dockerfile for Python (FastAPI / Flask / Django)
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
${useNonRoot ? "RUN useradd -m appuser && chown -R appuser /app\nUSER appuser" : ""}
EXPOSE ${port}
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${port}"]`;

      case "golang":
        return `# Multi-stage Go Dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server .

FROM alpine:latest AS runner
WORKDIR /root/
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/server .
${useNonRoot ? "RUN adduser -D appuser\nUSER appuser" : ""}
EXPOSE ${port}
CMD ["./server"]`;

      case "rust":
        return `# Multi-stage Rust Dockerfile
FROM rust:1.77-slim AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release

FROM debian:bookworm-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/app /usr/local/bin/app
${useNonRoot ? "RUN useradd -m appuser\nUSER appuser" : ""}
EXPOSE ${port}
CMD ["app"]`;

      case "nginx":
        return `# Static Frontend Dockerfile (Nginx)
FROM nginx:alpine
COPY ./build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${port}
CMD ["nginx", "-g", "daemon off;"]`;

      default:
        return `FROM alpine:latest\nCMD ["echo", "Docker initialized"]`;
    }
  }, [language, nodeVersion, port, packageManager, isMultiStage, useNonRoot]);

  const copyDockerfile = () => {
    navigator.clipboard.writeText(dockerfileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDockerfile = () => {
    const blob = new Blob([dockerfileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Dockerfile";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Container Configuration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Application Stack</Label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="nodejs">Node.js (Next.js / Express / NestJS)</option>
                <option value="python">Python (FastAPI / Flask / Django)</option>
                <option value="golang">Go (Golang Alpine)</option>
                <option value="rust">Rust (Cargo Release)</option>
                <option value="nginx">Static Web (Nginx SPA)</option>
              </select>
            </div>

            {language === "nodejs" && (
              <>
                <div className="space-y-1">
                  <Label>Base Image Version</Label>
                  <select
                    value={nodeVersion}
                    onChange={(e) => setNodeVersion(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                  >
                    <option value="20-alpine">Node 20 (Alpine - Lightweight)</option>
                    <option value="22-alpine">Node 22 (Alpine - Latest LTS)</option>
                    <option value="20-slim">Node 20 (Debian Slim)</option>
                    <option value="18-alpine">Node 18 (Alpine)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label>Package Manager</Label>
                  <select
                    value={packageManager}
                    onChange={(e) => setPackageManager(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                  >
                    <option value="npm">npm (package-lock.json)</option>
                    <option value="yarn">yarn (yarn.lock)</option>
                    <option value="pnpm">pnpm (pnpm-lock.yaml)</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label>Exposed Port</Label>
              <Input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="3000, 8080, 80"
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMultiStage}
                  onChange={(e) => setIsMultiStage(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-foreground">Multi-stage build (smaller image footprint)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNonRoot}
                  onChange={(e) => setUseNonRoot(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-foreground">Non-root user execution (Security hardened)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-slate-500">Generated Dockerfile</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={copyDockerfile}
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 h-8"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button
                type="button"
                onClick={downloadDockerfile}
                size="sm"
                className="text-xs gap-1.5 h-8 bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </Button>
            </div>
          </div>

          <pre className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[460px]">
            {dockerfileContent}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. KUBERNETES YAML VALIDATOR (kubernetes-yaml-validator)
// ==========================================
export function KubernetesYamlValidatorTool() {
  const [yamlInput, setYamlInput] = React.useState(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-api-deployment
  labels:
    app: web-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-api
  template:
    metadata:
      labels:
        app: web-api
    spec:
      containers:
      - name: web-api
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "500m"
            memory: "256Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"`);

  const validation = React.useMemo(() => {
    const lines = yamlInput.split("\n");
    const errors: string[] = [];
    const warnings: string[] = [];

    let hasApiVersion = false;
    let hasKind = false;
    let hasMetadata = false;
    let hasName = false;
    let hasSpec = false;
    let kind = "";

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      const lineNum = idx + 1;

      // Tab check in YAML
      if (line.includes("\t")) {
        errors.push(`Line ${lineNum}: Tabs are forbidden in YAML. Use standard 2 spaces for indentation.`);
      }

      if (trimmed.startsWith("apiVersion:")) {
        hasApiVersion = true;
      }
      if (trimmed.startsWith("kind:")) {
        hasKind = true;
        kind = trimmed.split(":")[1]?.trim() || "";
      }
      if (trimmed.startsWith("metadata:")) {
        hasMetadata = true;
      }
      if (trimmed.startsWith("name:")) {
        hasName = true;
      }
      if (trimmed.startsWith("spec:")) {
        hasSpec = true;
      }

      // Check port format
      if (trimmed.startsWith("containerPort:") || trimmed.startsWith("port:")) {
        const val = trimmed.split(":")[1]?.trim();
        if (val && isNaN(Number(val))) {
          errors.push(`Line ${lineNum}: Port value "${val}" must be a numeric integer.`);
        }
      }
    });

    if (!hasApiVersion) errors.push("Missing required top-level property: 'apiVersion'.");
    if (!hasKind) errors.push("Missing required top-level property: 'kind'.");
    if (!hasMetadata) errors.push("Missing required section: 'metadata'.");
    if (hasMetadata && !hasName) warnings.push("Best practice: Provide 'metadata.name' to identify this resource.");
    if (!hasSpec && !["ConfigMap", "Secret"].includes(kind)) {
      warnings.push("Workloads (Deployment, Pod, Service) typically require a 'spec:' section.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      kind: kind || "Kubernetes Manifest",
    };
  }, [yamlInput]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold">Kubernetes Manifest YAML</Label>
            <span className="text-[11px] text-muted-foreground font-mono">YAML 1.2 Syntax</span>
          </div>
          <Textarea
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            rows={16}
            className="font-mono text-xs leading-relaxed"
            placeholder="Paste your Kubernetes YAML deployment, service, ingress, or pod spec here..."
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className={`p-4 rounded-xl border ${validation.isValid ? "border-emerald-200 bg-emerald-50/60" : "border-rose-200 bg-rose-50/60"} space-y-2`}>
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <h4 className="text-sm font-semibold text-slate-900">
                {validation.isValid ? "Valid Manifest Structure" : "Syntax / Schema Issues Detected"}
              </h4>
            </div>
            <p className="text-xs text-slate-600">
              {validation.isValid
                ? `Manifest meets basic Kubernetes schema structure for kind: ${validation.kind}.`
                : `Identified ${validation.errors.length} error(s) preventing valid kubectl execution.`}
            </p>
          </div>

          {validation.errors.length > 0 && (
            <div className="p-4 rounded-xl border border-rose-200 bg-card space-y-2">
              <span className="text-xs font-mono font-semibold text-rose-600">Errors to Resolve</span>
              <ul className="text-xs text-rose-800 space-y-1 list-disc pl-4 font-mono">
                {validation.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <span className="text-xs font-mono font-semibold text-amber-700">Recommended Improvements</span>
              <ul className="text-xs text-amber-800 space-y-1 list-disc pl-4">
                {validation.warnings.map((warn, idx) => (
                  <li key={idx}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
            <span className="font-semibold text-slate-800">Quick Boilerplate Presets</span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() =>
                  setYamlInput(`apiVersion: v1\nkind: Service\nmetadata:\n  name: web-service\nspec:\n  selector:\n    app: web-api\n  ports:\n  - protocol: TCP\n    port: 80\n    targetPort: 80\n  type: ClusterIP`)
                }
              >
                Service
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() =>
                  setYamlInput(`apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  DATABASE_URL: "mysql://db:3306/app"\n  LOG_LEVEL: "info"`)
                }
              >
                ConfigMap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. API MOCK SERVER (api-mock-server)
// ==========================================
export function ApiMockServerTool() {
  interface MockEndpoint {
    id: string;
    method: string;
    path: string;
    statusCode: number;
    delayMs: number;
    responseBody: string;
  }

  const [endpoints, setEndpoints] = React.useState<MockEndpoint[]>([
    {
      id: "1",
      method: "GET",
      path: "/api/users",
      statusCode: 200,
      delayMs: 150,
      responseBody: JSON.stringify(
        [
          { id: 1, name: "Alice Walker", email: "alice@example.com", role: "admin" },
          { id: 2, name: "Bob Smith", email: "bob@example.com", role: "developer" },
        ],
        null,
        2
      ),
    },
    {
      id: "2",
      method: "POST",
      path: "/api/users",
      statusCode: 201,
      delayMs: 200,
      responseBody: JSON.stringify({ success: true, message: "User created", id: 3 }, null, 2),
    },
  ]);

  const [activeId, setActiveId] = React.useState("1");
  const [testResponse, setTestResponse] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const activeEndpoint = endpoints.find((e) => e.id === activeId) || endpoints[0];

  const updateActive = (field: keyof MockEndpoint, val: unknown) => {
    setEndpoints(
      endpoints.map((ep) => (ep.id === activeId ? { ...ep, [field]: val } : ep))
    );
  };

  const runTestCall = () => {
    setIsLoading(true);
    setTestResponse(null);
    setTimeout(() => {
      setTestResponse(activeEndpoint.responseBody);
      setIsLoading(false);
    }, activeEndpoint.delayMs);
  };

  const exportPostman = () => {
    const collection = {
      info: {
        name: "Zoqonyx Mock API Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: endpoints.map((ep) => ({
        name: `${ep.method} ${ep.path}`,
        request: {
          method: ep.method,
          url: `https://api.example.com${ep.path}`,
        },
        response: [
          {
            name: "Default Mock Response",
            status: "OK",
            code: ep.statusCode,
            body: ep.responseBody,
          },
        ],
      })),
    };

    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mock_api_postman_collection.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b">
        <div className="flex items-center gap-2">
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              type="button"
              onClick={() => {
                setActiveId(ep.id);
                setTestResponse(null);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                ep.id === activeId
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span className={ep.method === "GET" ? "text-emerald-400" : "text-blue-400"}>{ep.method}</span>
              <span>{ep.path}</span>
            </button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              const newEp = {
                id: Date.now().toString(),
                method: "GET",
                path: `/api/resource-${endpoints.length + 1}`,
                statusCode: 200,
                delayMs: 100,
                responseBody: JSON.stringify({ message: "Mock resource" }, null, 2),
              };
              setEndpoints([...endpoints, newEp]);
              setActiveId(newEp.id);
            }}
          >
            + Add Endpoint
          </Button>
        </div>

        <Button
          type="button"
          onClick={exportPostman}
          size="sm"
          className="text-xs h-8 bg-teal-600 hover:bg-teal-500 text-white gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Postman Collection</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">HTTP Method</Label>
              <select
                value={activeEndpoint.method}
                onChange={(e) => updateActive("method", e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-mono font-semibold"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Status Code</Label>
              <select
                value={activeEndpoint.statusCode}
                onChange={(e) => updateActive("statusCode", Number(e.target.value))}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-mono"
              >
                <option value={200}>200 OK</option>
                <option value={201}>201 Created</option>
                <option value={400}>400 Bad Request</option>
                <option value={401}>401 Unauthorized</option>
                <option value={404}>404 Not Found</option>
                <option value={500}>500 Server Error</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Simulated Latency</Label>
              <select
                value={activeEndpoint.delayMs}
                onChange={(e) => updateActive("delayMs", Number(e.target.value))}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-mono"
              >
                <option value={50}>50ms (Local)</option>
                <option value={150}>150ms (Broadband)</option>
                <option value={500}>500ms (3G Mobile)</option>
                <option value={1500}>1500ms (Slow)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Route Path</Label>
            <Input
              value={activeEndpoint.path}
              onChange={(e) => updateActive("path", e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Mock JSON Response Body</Label>
            <Textarea
              value={activeEndpoint.responseBody}
              onChange={(e) => updateActive("responseBody", e.target.value)}
              rows={9}
              className="font-mono text-xs"
            />
          </div>

          <Button
            type="button"
            onClick={runTestCall}
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5"
          >
            <Play className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Executing Request..." : `Simulate ${activeEndpoint.method} Request`}</span>
          </Button>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-mono font-semibold text-slate-500">Live Client Simulator Output</span>
          {testResponse ? (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-semibold">{activeEndpoint.statusCode} OK</span>
                <span className="text-slate-400">{activeEndpoint.delayMs}ms</span>
              </div>
              <pre className="overflow-x-auto max-h-72 leading-relaxed">{testResponse}</pre>
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white space-y-1 text-slate-500 text-xs">
              <Server className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">No Request Executed</p>
              <p>Click &quot;Simulate Request&quot; to test your mock API endpoint response in-browser.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. GRAPHQL QUERY BUILDER (graphql-query-builder)
// ==========================================
export function GraphqlQueryBuilderTool() {
  const [operationType, setOperationType] = React.useState("query");
  const [operationName, setOperationName] = React.useState("GetUserData");
  const [rootField, setRootField] = React.useState("user");
  const [fields, setFields] = React.useState<string[]>([
    "id",
    "username",
    "email",
    "profile { avatarUrl, bio }",
    "createdAt",
  ]);
  const [copied, setCopied] = React.useState(false);

  const queryCode = React.useMemo(() => {
    return `${operationType} ${operationName} {
  ${rootField} {
    ${fields.join("\n    ")}
  }
}`;
  }, [operationType, operationName, rootField, fields]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>GraphQL Operation Schema</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Operation Type</Label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-mono font-semibold"
              >
                <option value="query">query (Read)</option>
                <option value="mutation">mutation (Write)</option>
                <option value="subscription">subscription (Realtime)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>Operation Name</Label>
              <Input
                value={operationName}
                onChange={(e) => setOperationName(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label>Root Field / Entity</Label>
              <Input
                value={rootField}
                onChange={(e) => setRootField(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label>Requested Fields (One per line)</Label>
              <Textarea
                value={fields.join("\n")}
                onChange={(e) => setFields(e.target.value.split("\n").filter((f) => f.trim().length > 0))}
                rows={5}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-semibold text-slate-500">Constructed GraphQL Query</span>
            <Button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(queryCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              size="sm"
              variant="outline"
              className="text-xs h-8 gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Query"}</span>
            </Button>
          </div>

          <pre className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[360px]">
            {queryCode}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SCREEN RECORDER (screen-recorder)
// ==========================================
export function ScreenRecorderTool() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = React.useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = React.useState(0);
  const [audioEnabled, setAudioEnabled] = React.useState(true);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: audioEnabled,
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      alert("Screen capture was cancelled or is not supported by your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-5 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-800">
          <Video className="w-6 h-6 text-teal-600" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Browser Screen Recorder</h3>
          <p className="text-xs text-slate-600">
            Record full monitor displays, single windows, or browser tabs with high visual fidelity. Zero cloud uploads.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
              disabled={isRecording}
              className="rounded text-teal-600"
            />
            <span>Include System / Microphone Audio</span>
          </label>
        </div>

        {isRecording ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono text-sm font-semibold animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
              <span>RECORDING: {formatSeconds(recordingDuration)}</span>
            </div>
            <div>
              <Button
                type="button"
                onClick={stopRecording}
                className="bg-rose-600 hover:bg-rose-500 text-white gap-1.5"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={startRecording}
            className="bg-teal-600 hover:bg-teal-500 text-white gap-1.5"
          >
            <Play className="w-4 h-4" />
            <span>Select Window & Start Recording</span>
          </Button>
        )}

        {recordedBlobUrl && (
          <div className="pt-4 border-t space-y-3 text-left">
            <span className="text-xs font-mono font-semibold text-slate-600">Recording Preview</span>
            <video src={recordedBlobUrl} controls className="w-full rounded-lg border bg-black max-h-64" />
            <div className="flex justify-end">
              <a
                href={recordedBlobUrl}
                download={`screen_recording_${Date.now()}.webm`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Video (WebM)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. ONLINE CODE EDITOR (online-code-editor)
// ==========================================
export function OnlineCodeEditorTool() {
  const [html, setHtml] = React.useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white; }
    .card { background: #1e293b; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #334155; }
    button { background: #0d9488; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 12px; }
    button:hover { background: #14b8a6; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Interactive HTML/JS Sandbox</h2>
    <p>Rendered locally in your browser sandbox.</p>
    <button onclick="handleClick()">Click Me</button>
  </div>
  <script>
    function handleClick() {
      alert("Hello from client-side code editor!");
    }
  </script>
</body>
</html>`);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">HTML, CSS & JavaScript Source</Label>
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={18}
            className="font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Live Sandbox Execution Frame</Label>
          <iframe
            srcDoc={html}
            title="Sandbox Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-[360px] rounded-lg border border-border bg-white shadow-xs"
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. API TESTER (api-tester)
// ==========================================
export function ApiTesterTool() {
  const [method, setMethod] = React.useState("GET");
  const [url, setUrl] = React.useState("https://jsonplaceholder.typicode.com/todos/1");
  const [requestBody, setRequestBody] = React.useState("");
  const [responseStatus, setResponseStatus] = React.useState<number | null>(null);
  const [responseTime, setResponseTime] = React.useState<number | null>(null);
  const [responseBody, setResponseBody] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const executeRequest = async () => {
    if (!url) return;
    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (["POST", "PUT", "PATCH"].includes(method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const elapsed = Math.round(performance.now() - start);
      setResponseStatus(res.status);
      setResponseTime(elapsed);

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResponseBody(JSON.stringify(json, null, 2));
      } catch {
        setResponseBody(text);
      }
    } catch (err: unknown) {
      setResponseStatus(0);
      setResponseBody(`Network Error: ${err instanceof Error ? err.message : "CORS policy or network failure."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background font-mono font-semibold text-xs"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>

          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="flex-1 font-mono text-xs"
          />

          <Button
            type="button"
            onClick={executeRequest}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5"
          >
            <Send className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Sending..." : "Send Request"}</span>
          </Button>
        </div>

        {["POST", "PUT", "PATCH"].includes(method) && (
          <div className="space-y-1">
            <Label className="text-xs">JSON Request Payload</Label>
            <Textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={4}
              placeholder='{ "title": "New Task", "completed": false }'
              className="font-mono text-xs"
            />
          </div>
        )}
      </div>

      {responseStatus !== null && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className={`font-semibold ${responseStatus >= 200 && responseStatus < 300 ? "text-emerald-400" : "text-rose-400"}`}>
              STATUS: {responseStatus > 0 ? responseStatus : "ERR_CORS / FAILED"}
            </span>
            <span className="text-slate-400">{responseTime}ms</span>
          </div>
          <pre className="overflow-x-auto max-h-80 leading-relaxed">{responseBody}</pre>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. DNS RECORDS LOOKUP TOOL (dns-lookup-tool)
// Powered by Google DNS-over-HTTPS (DoH) & Cloudflare DoH
// ==========================================
export function DnsLookupTool() {
  const [domain, setDomain] = React.useState("zoqonyx.com");
  const [recordType, setRecordType] = React.useState("A");
  const [records, setRecords] = React.useState<{ name: string; type: number; TTL: number; data: string }[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const queryDns = async () => {
    if (!domain) return;
    setIsLoading(true);
    setErrorMsg("");
    setRecords(null);

    const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim();

    try {
      const res = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${recordType}`);
      if (!res.ok) throw new Error("DNS resolution failed");
      const data = await res.json();
      if (data.Answer && Array.isArray(data.Answer)) {
        setRecords(data.Answer);
      } else {
        setRecords([]);
      }
    } catch {
      setErrorMsg("Failed to resolve DNS records. Please verify the domain name.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    queryDns();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-7">
            <Label className="text-xs mb-1 block">Domain or Hostname</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="pl-9 font-mono text-xs"
                onKeyDown={(e) => e.key === "Enter" && queryDns()}
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <Label className="text-xs mb-1 block">Record Type</Label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono font-semibold text-xs"
            >
              <option value="A">A (IPv4)</option>
              <option value="AAAA">AAAA (IPv6)</option>
              <option value="MX">MX (Mail Server)</option>
              <option value="TXT">TXT (Verification / SPF)</option>
              <option value="CNAME">CNAME (Alias)</option>
              <option value="NS">NS (Name Servers)</option>
              <option value="SOA">SOA (Zone Authority)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <Button
              type="button"
              onClick={queryDns}
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5 h-10"
            >
              <Search className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Querying..." : "Lookup"}</span>
            </Button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {records !== null && (
        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono font-semibold text-slate-700">
              {recordType} Records for {domain} ({records.length} Found)
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Google DoH Verified</span>
          </div>

          {records.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No {recordType} records found for this domain.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-mono text-[10.5px] border-b">
                  <tr>
                    <th className="py-2.5 px-3">Host / Name</th>
                    <th className="py-2.5 px-3">TTL</th>
                    <th className="py-2.5 px-3">Data / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {records.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-slate-700">{r.name}</td>
                      <td className="py-2.5 px-3 text-slate-500">{r.TTL}s</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 break-all">{r.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
