export type ImplementAudience = "business" | "employee";
export type TaskBucket = "AUTOMATE" | "AUGMENT" | "OWN";
export type TaskConfidence = "HIGH" | "MEDIUM" | "LOW";
export type TaskFrequency = "daily" | "weekly" | "monthly" | "ad-hoc";

export type ImplementWorkAreaKey =
  | "Executive Leadership"
  | "Operations"
  | "Finance and Accounting"
  | "Sales"
  | "Marketing"
  | "Engineering and IT"
  | "Data and AI"
  | "HR and People Operations"
  | "Legal and Compliance";

export type ImplementWorkArea = {
  category: ImplementWorkAreaKey;
  focus: string;
  topSkills: string[];
  skills: string[];
};

export type ImplementationTask = {
  task_id: number;
  task_name: string;
  description: string;
  frequency: TaskFrequency;
  avg_minutes_per_instance: number;
  instances_per_month: number;
  bucket: TaskBucket;
  rationale: string;
  ai_action: string;
  human_ownership: string;
  automation_rate_pct: number;
  monthly_hours_saved: number;
  confidence: TaskConfidence;
  tools_suggested: string[];
};

export type ImplementationSummary = {
  automate_count: number;
  augment_count: number;
  own_count: number;
  estimated_monthly_hours_saved: number;
  estimated_fte_equivalent_saved: number;
};

export type EmployeeTransformationReport = {
  kind: "employee";
  title: string;
  workArea: ImplementWorkAreaKey;
  skillsAnalyzed: number;
  summary: ImplementationSummary;
  tasks: ImplementationTask[];
  tools: string[];
  isDemo?: boolean;
  demoReason?: string;
};

export type BusinessOpportunity = {
  id: string;
  department: string;
  symptom: string;
  estimatedAnnualHours: number;
  pilotLabel: string;
  aiAction: string;
  humanReview: string;
};

export type BusinessOpportunityReport = {
  kind: "business";
  companyName: string;
  website: string;
  email: string;
  industry: string;
  sizeEstimate: string;
  opportunityScore: number;
  executiveSummary: string;
  scoreRationale: string;
  annualValueAtRisk: number;
  fiveYearCostOfInaction: number;
  employees: number;
  addressableRoles: number;
  weeklyHoursReclaimable: number;
  annualHoursReclaimable: number;
  fteEquivalent: number;
  opportunities: BusinessOpportunity[];
  isDemo: boolean;
  demoReason?: string;
};

export type ImplementPilot = {
  id: string;
  label: string;
  workflow: string;
  audience: ImplementAudience;
  hoursPerWeek: number;
  confidenceThreshold: number;
  reviewer: string;
  aiAction: string;
  humanReview: string;
  inScope: string[];
  outOfScope: string[];
};

export type ImplementReport = BusinessOpportunityReport | EmployeeTransformationReport;

export const workAreaOptions: ImplementWorkArea[] = [
  {
    category: "Executive Leadership",
    focus: "Strategy, capital allocation, org direction",
    topSkills: ["Strategic planning", "Decision-making", "Financial acumen", "Change leadership", "Stakeholder management"],
    skills: ["Strategic planning", "Decision-making", "Financial acumen", "Stakeholder management", "Corporate governance", "Risk management", "Vision setting", "Change leadership", "Mergers and acquisitions", "Capital allocation", "Executive communication", "Board relations", "Organizational design", "Performance management", "Market analysis", "Competitive strategy", "Crisis management", "Leadership development", "Negotiation", "Public speaking", "ESG strategy", "Digital transformation oversight", "Innovation strategy", "Cross-functional alignment", "Talent strategy", "Succession planning", "Enterprise risk", "Policy setting", "Culture shaping", "Scenario planning"],
  },
  {
    category: "Operations",
    focus: "Execution, efficiency, process",
    topSkills: ["Process optimization", "Workflow design", "KPI management", "Project execution", "Continuous improvement"],
    skills: ["Process optimization", "Supply chain management", "Logistics", "Vendor management", "Lean methodology", "Six Sigma", "Workflow design", "Capacity planning", "Quality control", "Cost reduction", "Operational analytics", "Resource allocation", "Project execution", "SOP development", "Procurement", "Inventory management", "Compliance operations", "Performance tracking", "Risk mitigation", "Service delivery", "Escalation handling", "Systems thinking", "Process automation", "KPI management", "Facilities management", "Throughput optimization", "Scheduling", "Cross-team coordination", "Operational forecasting", "Continuous improvement"],
  },
  {
    category: "Finance and Accounting",
    focus: "Money, reporting, compliance",
    topSkills: ["Financial modeling", "Budgeting", "Forecasting", "Financial reporting", "FP&A"],
    skills: ["Financial modeling", "Budgeting", "Forecasting", "GAAP and IFRS", "Accounting", "Variance analysis", "Cash flow management", "Auditing", "Tax strategy", "Cost accounting", "Financial reporting", "FP&A", "Revenue recognition", "Internal controls", "Risk assessment", "Capital planning", "Investment analysis", "Treasury management", "Expense management", "ERP systems", "Data reconciliation", "Compliance reporting", "Financial strategy", "Pricing strategy", "Margin analysis", "Cost optimization", "Scenario modeling", "Portfolio analysis", "Due diligence", "Financial dashboards", "Invoicing"],
  },
  {
    category: "Sales",
    focus: "Revenue generation",
    topSkills: ["Prospecting", "Pipeline management", "Negotiation", "Closing deals", "Account management"],
    skills: ["Prospecting", "Lead qualification", "Pipeline management", "CRM usage", "Negotiation", "Closing deals", "Account management", "Relationship building", "Objection handling", "Consultative selling", "Territory planning", "Forecasting", "Sales analytics", "Product demos", "Pricing strategy", "Contract negotiation", "Upselling", "Cross-selling", "Cold outreach", "Inbound conversion", "Sales enablement", "Buyer psychology", "Storytelling", "Competitive positioning", "Quota management", "Deal structuring", "Networking", "Presentation skills", "Stakeholder mapping", "Revenue strategy"],
  },
  {
    category: "Marketing",
    focus: "Demand generation and brand",
    topSkills: ["Brand strategy", "Content marketing", "Campaign management", "Demand generation", "Analytics"],
    skills: ["Brand strategy", "Content marketing", "SEO", "SEM", "Social media", "Campaign management", "Email marketing", "Analytics", "Growth marketing", "Product marketing", "Market research", "Segmentation", "Positioning", "Messaging", "Funnel optimization", "Conversion rate optimization", "A/B testing", "Paid media", "Influencer marketing", "Event marketing", "Copywriting", "Storytelling", "Marketing automation", "CRM marketing", "Customer insights", "Lifecycle marketing", "Attribution modeling", "PR", "Community building", "Demand generation"],
  },
  {
    category: "Engineering and IT",
    focus: "Build and maintain systems",
    topSkills: ["Software development", "System architecture", "Cloud computing", "DevOps", "Cybersecurity"],
    skills: ["Software development", "System architecture", "APIs", "Cloud computing", "DevOps", "CI/CD", "Version control", "Debugging", "Testing", "Cybersecurity", "Data structures", "Algorithms", "Microservices", "Containerization", "Infrastructure as code", "Networking", "Database management", "Performance optimization", "Observability", "Reliability engineering", "Incident response", "Scripting", "Automation", "System design", "Code review", "Technical documentation", "Agile development", "Scalability planning", "Platform engineering", "Integration"],
  },
  {
    category: "Data and AI",
    focus: "Insights and intelligence",
    topSkills: ["Data analysis", "SQL", "Machine learning", "Data visualization", "Predictive modeling"],
    skills: ["Data analysis", "SQL", "Python", "Machine learning", "Data visualization", "ETL pipelines", "Data engineering", "Statistics", "Predictive modeling", "Natural language processing", "Data governance", "Feature engineering", "Experimentation", "A/B testing", "Big data tools", "BI tools", "Dashboards", "Data storytelling", "Model deployment", "MLOps", "Data cleaning", "Anomaly detection", "Forecasting", "Recommendation systems", "Deep learning", "Clustering", "Classification", "Optimization", "Data architecture", "AI ethics"],
  },
  {
    category: "HR and People Operations",
    focus: "Talent and culture",
    topSkills: ["Recruiting", "Onboarding", "Performance management", "Employee relations", "Talent development"],
    skills: ["Recruiting", "Onboarding", "Performance management", "Compensation planning", "Benefits administration", "Employee relations", "HR compliance", "Talent development", "Training programs", "Succession planning", "Culture building", "DEI initiatives", "Conflict resolution", "Coaching", "Workforce planning", "HR analytics", "Engagement surveys", "Policy development", "Employer branding", "Retention strategy", "Organizational development", "Change management", "Leadership training", "HRIS systems", "Payroll", "Labor law", "Feedback systems", "Career pathing", "Wellbeing programs", "Internal communications"],
  },
  {
    category: "Legal and Compliance",
    focus: "Risk, contracts, regulation",
    topSkills: ["Contract law", "Compliance management", "Regulatory analysis", "Risk assessment", "Data privacy"],
    skills: ["Contract law", "Negotiation", "Compliance management", "Regulatory analysis", "Risk assessment", "Corporate law", "Intellectual property", "Litigation management", "Policy drafting", "Governance", "Data privacy", "Due diligence", "Legal research", "Employment law", "Vendor contracts", "Dispute resolution", "Ethics programs", "Internal audits", "Documentation", "Licensing", "Regulatory filings", "Anti-corruption", "Compliance training", "Incident investigation", "Legal writing", "Mergers and acquisitions law", "Securities law", "Contract lifecycle management", "Advisory", "Negotiation strategy"],
  },
];

export const workAreaKeys = workAreaOptions.map((area) => area.category);

const recommendedToolsByWorkArea: Record<ImplementWorkAreaKey, string[]> = {
  "Executive Leadership": [
    "Microsoft Copilot",
    "ChatGPT Enterprise",
    "Claude",
    "Perplexity Enterprise",
    "Notion AI",
    "Power BI Copilot",
  ],
  Operations: [
    "UiPath",
    "Power Automate",
    "Zapier",
    "Make",
    "ServiceNow AI",
    "Microsoft Copilot",
  ],
  "Finance and Accounting": [
    "Bill.com",
    "Excel Copilot",
    "Tesseract OCR",
    "Power BI Copilot",
    "Microsoft Copilot",
    "Zapier",
  ],
  Sales: [
    "Salesforce Einstein",
    "HubSpot AI",
    "Gong",
    "Apollo",
    "ChatGPT Enterprise",
    "Microsoft Copilot",
  ],
  Marketing: [
    "Jasper",
    "HubSpot AI",
    "Canva Magic Studio",
    "Mailchimp AI",
    "ChatGPT Enterprise",
    "Google Gemini",
  ],
  "Engineering and IT": [
    "GitHub Copilot",
    "Cursor",
    "Snyk AI",
    "Datadog Bits AI",
    "ServiceNow AI",
    "Microsoft Copilot",
  ],
  "Data and AI": [
    "Databricks Assistant",
    "BigQuery ML",
    "Power BI Copilot",
    "Looker Studio",
    "ChatGPT Enterprise",
    "Claude",
  ],
  "HR and People Operations": [
    "Workday AI",
    "LinkedIn Recruiter AI",
    "Eightfold AI",
    "Microsoft Copilot",
    "ChatGPT Enterprise",
    "Notion AI",
  ],
  "Legal and Compliance": [
    "Harvey",
    "Spellbook",
    "Ironclad AI",
    "Relativity aiR",
    "Claude",
    "Microsoft Copilot",
  ],
};

const bucketToolFallbacks: Record<TaskBucket, string[]> = {
  AUTOMATE: ["UiPath", "Zapier", "Power Automate"],
  AUGMENT: ["Microsoft Copilot", "ChatGPT Enterprise", "Claude"],
  OWN: ["Perplexity Enterprise", "Notion AI", "Microsoft Copilot"],
};

function suggestedToolsForTask(workArea: ImplementWorkAreaKey, bucket: TaskBucket, index: number) {
  const areaTools = recommendedToolsByWorkArea[workArea] ?? [];
  const bucketTools = bucketToolFallbacks[bucket];
  const rotatedAreaTools = [...areaTools.slice(index % areaTools.length), ...areaTools.slice(0, index % areaTools.length)];
  return [...new Set([...rotatedAreaTools.slice(0, 3), ...bucketTools])].slice(0, bucket === "OWN" ? 3 : 5);
}

export const samplePilotTasks: ImplementPilot[] = [
  {
    id: "invoice-entry",
    label: "Invoice data entry",
    workflow: "Accounts Payable",
    audience: "employee",
    hoursPerWeek: 9.5,
    confidenceThreshold: 90,
    reviewer: "Finance reviewer",
    aiAction: "Extract vendor, amount, line items, and purchase-order details from inbound invoices.",
    humanReview: "Reviews exceptions, suspicious totals, and missing fields before payment.",
    inScope: ["Extract invoice fields", "Check duplicate invoices", "Prepare exception summaries"],
    outOfScope: ["Approve payments", "Resolve vendor disputes", "Change vendor banking details"],
  },
  {
    id: "three-way-match",
    label: "3-way invoice matching",
    workflow: "Accounts Payable",
    audience: "employee",
    hoursPerWeek: 6.2,
    confidenceThreshold: 92,
    reviewer: "AP specialist",
    aiAction: "Cross-check invoice, purchase order, and receipt records before routing exceptions.",
    humanReview: "Decides on mismatches, missing receipts, or unusual vendor context.",
    inScope: ["Compare invoice to PO", "Flag unmatched receipts", "Summarize variance"],
    outOfScope: ["Override policy", "Approve disputed invoices", "Negotiate vendor terms"],
  },
  {
    id: "approval-routing",
    label: "Approval routing",
    workflow: "Operations",
    audience: "business",
    hoursPerWeek: 3.4,
    confidenceThreshold: 85,
    reviewer: "Department manager",
    aiAction: "Route standard approvals to the right owner based on amount, team, and policy.",
    humanReview: "Handles policy exceptions, escalations, and high-impact approvals.",
    inScope: ["Classify approval type", "Find owner", "Send reminder"],
    outOfScope: ["Approve high-risk decisions", "Change policy", "Override manager review"],
  },
  {
    id: "customer-intake-triage",
    label: "Customer intake triage",
    workflow: "Customer Operations",
    audience: "business",
    hoursPerWeek: 7.2,
    confidenceThreshold: 88,
    reviewer: "Support lead",
    aiAction: "Sort incoming requests by topic, urgency, and likely next action.",
    humanReview: "Reviews sensitive, angry, or high-value customer cases.",
    inScope: ["Classify request", "Draft first response", "Route to queue"],
    outOfScope: ["Promise refunds", "Resolve legal complaints", "Terminate accounts"],
  },
];

export function getWorkArea(key: ImplementWorkAreaKey) {
  return workAreaOptions.find((area) => area.category === key) ?? workAreaOptions[1];
}

export function formatShortUsd(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function formatLabNumber(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function companyNameFromWebsite(website: string) {
  const withoutProtocol = website.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  const domain = withoutProtocol.split("/")[0] || "your company";
  const name = domain.split(".")[0] || "Company";
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function createDemoBusinessReport(website: string, email: string): BusinessOpportunityReport {
  const companyName = companyNameFromWebsite(website);
  const opportunities: BusinessOpportunity[] = [
    {
      id: "finance-document-flow",
      department: "Finance",
      symptom: "Manual invoice processing, matching, and reconciliation work slows month-end visibility.",
      estimatedAnnualHours: 38400,
      pilotLabel: "Invoice triage pilot",
      aiAction: "Extract fields, check duplicates, match records, and summarize exceptions.",
      humanReview: "Finance reviews exceptions and approves payment decisions.",
    },
    {
      id: "operations-intake",
      department: "Operations",
      symptom: "Claims, requests, and internal handoffs are triaged line-by-line by experienced staff.",
      estimatedAnnualHours: 24500,
      pilotLabel: "Intake routing pilot",
      aiAction: "Classify inbound work, prioritize urgency, and route to the right owner.",
      humanReview: "Operations lead reviews edge cases and policy-sensitive work.",
    },
    {
      id: "customer-status",
      department: "Customer Support",
      symptom: "Tier-1 policy and status questions are answered manually across repeated channels.",
      estimatedAnnualHours: 19800,
      pilotLabel: "Support response pilot",
      aiAction: "Draft standard replies and retrieve relevant policy or status context.",
      humanReview: "Support lead reviews sensitive accounts and dissatisfied customer cases.",
    },
    {
      id: "vendor-onboarding",
      department: "Procurement",
      symptom: "Vendor onboarding, document collection, and risk checks require repeated follow-up.",
      estimatedAnnualHours: 12400,
      pilotLabel: "Vendor validation pilot",
      aiAction: "Track missing documents, compare records, and flag risk signals.",
      humanReview: "Procurement reviews risk flags and approves vendor activation.",
    },
  ];
  const employees = 480;
  const addressableRoles = 264;
  const weeklyHoursReclaimable = 2323;
  const annualHoursReclaimable = 116160;

  return {
    kind: "business",
    companyName: companyName || "Northwind Financial Services",
    website: website || "northwind-financial.com",
    email,
    industry: "Cross-industry business operations",
    sizeEstimate: "~480 employees",
    opportunityScore: 73,
    executiveSummary: `${companyName || "This company"} likely has repeatable work across finance, operations, customer support, and procurement that can be triaged or drafted by AI with human review. The first value is not replacing people; it is recovering hours trapped inside routine handoffs and document work.`,
    scoreRationale: "Demo estimate based on common mid-market workflow patterns; live website scanning is not configured yet.",
    annualValueAtRisk: 4780000,
    fiveYearCostOfInaction: 27490000,
    employees,
    addressableRoles,
    weeklyHoursReclaimable,
    annualHoursReclaimable,
    fteEquivalent: annualHoursReclaimable / 2080,
    opportunities,
    isDemo: true,
    demoReason: "Demo report shown because live audit keys are not configured yet.",
  };
}

export const mariaStyleEmployeeDemo: EmployeeTransformationReport = {
  kind: "employee",
  title: "Task Transformation Report",
  workArea: "Finance and Accounting",
  skillsAnalyzed: 7,
  isDemo: true,
  demoReason: "Demo fallback based on a finance employee example.",
  summary: {
    automate_count: 2,
    augment_count: 2,
    own_count: 3,
    estimated_monthly_hours_saved: 71,
    estimated_fte_equivalent_saved: 0.44,
  },
  tools: ["Copilot", "ChatGPT", "OCR extraction", "ERP automation", "Zapier"],
  tasks: [
    {
      task_id: 1,
      task_name: "Invoice data entry",
      description: "Enter vendor, amount, line-item, and payment details from invoices.",
      frequency: "daily",
      avg_minutes_per_instance: 18,
      instances_per_month: 95,
      bucket: "AUTOMATE",
      rationale: "High-volume, rules-based, and document-structured.",
      ai_action: "Extracts fields, checks duplicates, and drafts the record.",
      human_ownership: "Reviews exceptions and keeps payment authority.",
      automation_rate_pct: 90,
      monthly_hours_saved: 25.7,
      confidence: "HIGH",
      tools_suggested: ["OCR extraction", "ERP automation", "Copilot"],
    },
    {
      task_id: 2,
      task_name: "Vendor inquiry email",
      description: "Respond to common vendor questions about status, missing documents, and next steps.",
      frequency: "daily",
      avg_minutes_per_instance: 12,
      instances_per_month: 80,
      bucket: "AUGMENT",
      rationale: "AI can draft fast, but tone and context still matter.",
      ai_action: "Drafts replies and pulls relevant invoice context.",
      human_ownership: "Approves tone, exceptions, and relationship-sensitive responses.",
      automation_rate_pct: 55,
      monthly_hours_saved: 8.8,
      confidence: "MEDIUM",
      tools_suggested: ["ChatGPT", "Copilot"],
    },
  ],
};

export function buildEmployeeFallbackReport(
  workArea: ImplementWorkAreaKey,
  selectedTasks: string[],
): EmployeeTransformationReport {
  const area = getWorkArea(workArea);
  const analyzedSkills = selectedTasks.length > 0 ? selectedTasks : area.topSkills;
  const sourceTasks = [
    ...analyzedSkills,
    ...area.skills.filter((skill) => !analyzedSkills.includes(skill)),
  ].slice(0, 15);
  const bucketPattern: TaskBucket[] = [
    "AUTOMATE",
    "AUGMENT",
    "AUGMENT",
    "OWN",
    "AUGMENT",
    "AUTOMATE",
    "AUGMENT",
    "OWN",
    "AUGMENT",
    "AUGMENT",
    "AUTOMATE",
    "OWN",
    "AUGMENT",
    "AUGMENT",
    "OWN",
  ];
  const tasks: ImplementationTask[] = sourceTasks.map((task, index) => {
    const bucket = bucketPattern[index] ?? "AUGMENT";
    const automationRate = bucket === "AUTOMATE" ? 85 : bucket === "AUGMENT" ? 50 : 10;
    const avgMinutes = bucket === "OWN" ? 42 : bucket === "AUTOMATE" ? 30 : 24 + (index % 4) * 4;
    const instances = bucket === "OWN" ? 16 : bucket === "AUTOMATE" ? 24 : 18 + (index % 3) * 4;
    const monthlyHoursSaved = Number((((avgMinutes * instances) / 60) * (automationRate / 100)).toFixed(1));

    return {
      task_id: index + 1,
      task_name: task,
      description: `${task} within ${area.category}.`,
      frequency: index % 3 === 0 ? "weekly" : "daily",
      avg_minutes_per_instance: avgMinutes,
      instances_per_month: instances,
      bucket,
      rationale:
        bucket === "AUTOMATE"
          ? "This is repeatable enough for a first automation pilot with exception review."
          : bucket === "AUGMENT"
            ? "AI can draft, summarize, analyze, or prepare the work while a person keeps judgment."
            : "This depends on trust, accountability, or human context.",
      ai_action:
        bucket === "AUTOMATE"
          ? "Automates routine monitoring, preparation, and initial routing while escalating exceptions."
          : bucket === "AUGMENT"
            ? "Drafts analysis, summarizes context, and recommends next steps for human review."
            : "Prepares background context and decision support while the person keeps accountability.",
      human_ownership:
        bucket === "OWN"
          ? "Human owns the relationship, decision, and accountability."
          : "Human reviews exceptions and final decisions.",
      automation_rate_pct: automationRate,
      monthly_hours_saved: monthlyHoursSaved,
      confidence: bucket === "OWN" ? "MEDIUM" : "HIGH",
      tools_suggested: suggestedToolsForTask(area.category, bucket, index),
    };
  });

  return normalizeEmployeeReport({
    kind: "employee",
    title: "Task Transformation Report",
    workArea,
    skillsAnalyzed: analyzedSkills.length,
    tasks,
    summary: calculateTaskSummary(tasks),
    tools: collectTools(tasks),
    isDemo: true,
    demoReason: "Fallback report generated locally.",
  });
}

export function calculateTaskSummary(tasks: ImplementationTask[]): ImplementationSummary {
  const summary = tasks.reduce(
    (acc, task) => {
      if (task.bucket === "AUTOMATE") acc.automate_count += 1;
      if (task.bucket === "AUGMENT") acc.augment_count += 1;
      if (task.bucket === "OWN") acc.own_count += 1;
      acc.estimated_monthly_hours_saved += Number(task.monthly_hours_saved) || 0;
      return acc;
    },
    {
      automate_count: 0,
      augment_count: 0,
      own_count: 0,
      estimated_monthly_hours_saved: 0,
      estimated_fte_equivalent_saved: 0,
    },
  );

  summary.estimated_monthly_hours_saved = Number(summary.estimated_monthly_hours_saved.toFixed(1));
  summary.estimated_fte_equivalent_saved = Number((summary.estimated_monthly_hours_saved / 160).toFixed(2));
  return summary;
}

export function collectTools(tasks: ImplementationTask[]) {
  const counts = new Map<string, number>();
  tasks.forEach((task) => {
    task.tools_suggested.forEach((tool) => counts.set(tool, (counts.get(tool) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tool]) => tool);
}

export function normalizeEmployeeReport(report: EmployeeTransformationReport): EmployeeTransformationReport {
  const tasks = Array.isArray(report.tasks) ? report.tasks.slice(0, 20) : [];
  const normalizedTasks = tasks.map((task, index) => ({
    ...task,
    task_id: Number(task.task_id) || index + 1,
    task_name: String(task.task_name || `Task ${index + 1}`),
    bucket: ["AUTOMATE", "AUGMENT", "OWN"].includes(task.bucket) ? task.bucket : "AUGMENT",
    frequency: ["daily", "weekly", "monthly", "ad-hoc"].includes(task.frequency) ? task.frequency : "weekly",
    confidence: ["HIGH", "MEDIUM", "LOW"].includes(task.confidence) ? task.confidence : "MEDIUM",
    monthly_hours_saved: Math.max(0, Number(task.monthly_hours_saved) || 0),
    avg_minutes_per_instance: Math.max(1, Number(task.avg_minutes_per_instance) || 15),
    instances_per_month: Math.max(1, Number(task.instances_per_month) || 10),
    automation_rate_pct: Math.min(100, Math.max(0, Number(task.automation_rate_pct) || 40)),
    tools_suggested: Array.isArray(task.tools_suggested) ? task.tools_suggested.slice(0, 5) : [],
    human_ownership: task.human_ownership || "Human reviews exceptions and keeps accountability.",
  }));

  return {
    ...report,
    tasks: normalizedTasks,
    summary: calculateTaskSummary(normalizedTasks),
    tools: collectTools(normalizedTasks),
  };
}

export function pilotFromEmployeeTask(
  task: ImplementationTask,
  audience: ImplementAudience = "employee",
): ImplementPilot {
  return {
    id: `task-${task.task_id}`,
    label: task.task_name,
    workflow: task.bucket === "AUTOMATE" ? "Automation pilot" : "Augmentation pilot",
    audience,
    hoursPerWeek: Number((task.monthly_hours_saved / 4.33).toFixed(1)),
    confidenceThreshold: task.bucket === "AUTOMATE" ? 88 : 82,
    reviewer: "Human workflow owner",
    aiAction: task.ai_action,
    humanReview: task.human_ownership,
    inScope: [task.description, task.ai_action, "Route exceptions for review"],
    outOfScope: ["Final accountability", "Sensitive decisions without review", "Policy overrides"],
  };
}

export function pilotFromBusinessOpportunity(opportunity: BusinessOpportunity): ImplementPilot {
  const matching = samplePilotTasks.find((pilot) =>
    opportunity.pilotLabel.toLowerCase().includes(pilot.label.toLowerCase().split(" ")[0]),
  );

  return {
    id: opportunity.id,
    label: opportunity.pilotLabel,
    workflow: opportunity.department,
    audience: "business",
    hoursPerWeek: Number((opportunity.estimatedAnnualHours / 50).toFixed(1)),
    confidenceThreshold: matching?.confidenceThreshold ?? 85,
    reviewer: matching?.reviewer ?? "Department manager",
    aiAction: opportunity.aiAction,
    humanReview: opportunity.humanReview,
    inScope: matching?.inScope ?? ["Classify incoming work", "Draft next action", "Route exceptions"],
    outOfScope: matching?.outOfScope ?? ["Final approval", "Policy changes", "High-risk decisions"],
  };
}
