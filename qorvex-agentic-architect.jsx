import React, { useState, useEffect } from 'react';
import { Loader2, Download, Cloud, Save, FolderOpen, GitCompare, Network, Trash2, X, Shield, Database, Zap, Lock, Eye, Settings, CheckCircle2, AlertTriangle, Server, Layers } from 'lucide-react';

const QorvexAgenticArchitect = () => {
  const [requirements, setRequirements] = useState('');
  const [architecture, setArchitecture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedArchitectures, setSavedArchitectures] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [showDiagramDialog, setShowDiagramDialog] = useState(false);
  const [archName, setArchName] = useState('');
  const [compareArch1, setCompareArch1] = useState(null);
  const [compareArch2, setCompareArch2] = useState(null);
  const [diagramMermaid, setDiagramMermaid] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedCloudProvider, setSelectedCloudProvider] = useState(null);

  // Cloud provider configurations
  const cloudProviders = {
    'azure': {
      name: 'Microsoft Azure',
      icon: '☁️',
      color: 'from-blue-600 to-cyan-600',
      description: 'Enterprise cloud with comprehensive AI services',
      available: true
    },
    'vendor-neutral': {
      name: 'Vendor Neutral',
      icon: '⚡',
      color: 'from-purple-600 to-pink-600',
      description: 'Cloud-agnostic architecture patterns',
      available: true
    },
    'aws': {
      name: 'Amazon Web Services',
      icon: '🟧',
      color: 'from-orange-600 to-yellow-600',
      description: 'Market leader with extensive service portfolio',
      available: false,
      comingSoon: true
    },
    'gcp': {
      name: 'Google Cloud Platform',
      icon: '🔵',
      color: 'from-blue-500 to-green-500',
      description: 'AI/ML focused with cutting-edge innovation',
      available: false,
      comingSoon: true
    }
  };

  const azureTemplates = {
    'intelligent-document-processing': 'Build an intelligent document processing system using Azure AI Document Intelligence, Azure OpenAI, and Azure Cognitive Search for automated contract analysis and data extraction from financial documents.',
    'customer-service-agent': 'Create an autonomous customer service agent that integrates with Azure Customer Insights, Azure Communication Services, and Azure OpenAI to handle multi-channel customer inquiries with contextual understanding.',
    'devops-automation': 'Design a DevOps automation agent using Azure DevOps, Azure Functions, and Azure Monitor for CI/CD pipeline management, incident response, and infrastructure provisioning. Session: 4hr (long-running workflows), Active execution: 30min per operation. Includes change window policies, time-bound MSI delegation, approval gates for ARM/DevOps API, dry-run capabilities, and drift detection. Power Platform for human-in-the-loop approvals.',
    'data-analytics-copilot': 'Build a data analytics copilot using Azure Synapse Analytics, Azure Machine Learning, and Azure OpenAI to provide natural language querying and automated insights generation.',
    'security-compliance': 'Create a security and compliance agent leveraging Azure Sentinel, Microsoft Defender, and Azure Policy to automatically detect threats, enforce policies, and generate compliance reports.',
    'supply-chain-optimizer': 'Design a supply chain optimization agent using Azure Digital Twins, Azure IoT Hub, and Azure OpenAI to predict demand, optimize inventory, and automate procurement decisions.'
  };

  const vendorNeutralTemplates = {
    'intelligent-document-processing': 'Build an intelligent document processing system for automated contract analysis and data extraction from financial documents using vendor-neutral AI services.',
    'customer-service-agent': 'Create an autonomous customer service agent to handle multi-channel customer inquiries with contextual understanding using cloud-agnostic patterns.',
    'devops-automation': 'Design a DevOps automation agent to automatically manage CI/CD pipelines, incident response, and infrastructure provisioning.',
    'data-analytics-copilot': 'Build a data analytics copilot to provide natural language querying and automated insights generation.',
    'security-compliance': 'Create a security and compliance agent to automatically detect threats, enforce policies, and generate compliance reports.',
    'supply-chain-optimizer': 'Design a supply chain optimization agent to predict demand, optimize inventory, and automate procurement decisions.'
  };

  const getTemplates = () => {
    return selectedCloudProvider === 'azure' ? azureTemplates : vendorNeutralTemplates;
  };

  useEffect(() => {
    loadSavedArchitectures();
  }, []);

  const loadSavedArchitectures = async () => {
    try {
      const keys = await window.storage.list('qorvex-arch:');
      if (keys && keys.keys) {
        const archs = await Promise.all(
          keys.keys.map(async (key) => {
            try {
              const result = await window.storage.get(key);
              return result ? JSON.parse(result.value) : null;
            } catch (e) {
              return null;
            }
          })
        );
        setSavedArchitectures(archs.filter(a => a !== null));
      }
    } catch (error) {
      console.log('No saved architectures yet');
    }
  };

  const saveArchitecture = async () => {
    if (!archName.trim() || !architecture) return;
    
    try {
      const archData = {
        id: `qorvex-arch:${Date.now()}`,
        name: archName,
        cloudProvider: selectedCloudProvider,
        requirements: requirements,
        architecture: architecture,
        createdAt: new Date().toISOString()
      };
      
      await window.storage.set(archData.id, JSON.stringify(archData));
      await loadSavedArchitectures();
      setShowSaveDialog(false);
      setArchName('');
    } catch (error) {
      setError(`Error saving: ${error.message}`);
    }
  };

  const loadArchitecture = (arch) => {
    setRequirements(arch.requirements);
    setArchitecture(arch.architecture);
    setSelectedCloudProvider(arch.cloudProvider);
    setShowLoadDialog(false);
  };

  const deleteArchitecture = async (archId) => {
    try {
      await window.storage.delete(archId);
      await loadSavedArchitectures();
    } catch (error) {
      setError(`Error deleting: ${error.message}`);
    }
  };

  const generateArchitecture = async () => {
    if (!selectedCloudProvider) {
      setError('Please select a cloud provider first');
      return;
    }

    if (!requirements.trim()) {
      setError('Please enter system requirements or select a template');
      return;
    }

    setLoading(true);
    setError(null);
    setArchitecture(null);

    try {
      const isAzure = selectedCloudProvider === 'azure';
      const serviceKey = isAzure ? 'cloudServices' : 'recommendedServices';
      
      const prompt = isAzure 
        ? `You are an expert Azure cloud architect specializing in agentic AI systems. Generate a complete Azure reference architecture with specific Azure services.

CRITICAL CORRECTIONS:
- Agents PROPOSE actions, Layer 6 EXECUTES them (Zero-Trust model)
- Use current model names: gpt-4o, gpt-4o-mini, text-embedding-3-large
- Copilot Studio (not Power Virtual Agents)
- Confidence scoring is EXTERNAL (Verifier Agent), not model self-reported

DEVOPS-SPECIFIC PATTERNS (if applicable):
- Session timing: 4hr overall session, 30min active execution per operation
- Change window policies: No prod changes outside approved windows
- Time-bound MSI delegation with constrained permissions
- Approval gates for high-risk tools (ARM templates, DevOps API)
- Dry-run + rollback for all infrastructure changes
- Power Platform for human-in-the-loop approval UI
- Tool outputs require verification before long-term memory storage`
        : `You are an expert cloud-agnostic architect specializing in agentic AI systems. Generate a vendor-neutral reference architecture with cloud-agnostic patterns using generic service categories.

CRITICAL PRINCIPLE:
- Agents PROPOSE actions, Tool Layer EXECUTES them (Zero-Trust model)`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: `${prompt}

REQUIREMENTS: ${requirements}

Generate a JSON with this EXACT structure (use "${serviceKey}" for services):
{
  "cloudProvider": "${selectedCloudProvider}",
  "layer1_experience": {
    "purpose": "Define how work enters the agentic system",
    "primaryUseCase": "detailed description",
    "${serviceKey}": ["service1", "service2", "service3"],
    "triggerSources": {"webUI": true/false, "mobile": true/false, "teamsSlack": true/false, "apiClient": true/false, "webhook": true/false, "scheduleEvent": true/false, "other": ""},
    "userSystemType": "Human|System|Hybrid",
    "authenticationMethod": {"sso": true/false, "oauth": true/false, "apiKey": true/false, "mtls": true/false},
    "sessionDefinition": {"scope": "single|multi-step|long-running", "timeout": "value", "metadataCaptured": "details"},
    "signalsEmitted": {"userRequestReceived": true/false, "webhookTriggered": true/false, "sessionCreated": true/false},
    "nonGoals": "string"
  },
  "layer2_access_policy": {
    "purpose": "Enforce identity, authorization, and policy before reasoning",
    "${serviceKey}": ["service1", "service2"],
    "identityModel": {"userIdentity": "details", "agentIdentity": "details", "delegationModel": "details"},
    "authorizationControls": {"rbac": true/false, "abac": true/false, "tenantIsolation": true/false, "rateLimitsQuotas": true/false, "geoIPRestrictions": true/false},
    "inputClassification": {"pii": true/false, "phi": true/false, "secrets": true/false, "regulatedContent": true/false},
    "policyOutcomes": {"allowed": true/false, "rejected": true/false, "escalated": true/false},
    "complianceFrameworks": ["SOC 2", "HIPAA", "GDPR"],
    "signalsEmitted": {"policyCheckRequest": true/false, "classificationResult": true/false, "requestAllowed": true/false, "requestRejected": true/false}
  },
  "layer3_orchestration": {
    "purpose": "Control flow, state, and safety of agent execution",
    "${serviceKey}": ["service1", "service2"],
    "orchestrationModel": "State machine|Workflow engine|DAG|Event-driven",
    "workflowStates": ["REQUEST_RECEIVED", "POLICY_EVALUATED", "CONTEXT_PREPARED", "PLAN_PROPOSED", "EXECUTION_IN_PROGRESS", "VERIFICATION_IN_PROGRESS", "RESPONSE_READY", "AUDIT_LOGGED", "SESSION_CLOSED"],
    "controlLimits": {"maxSteps": "50", "maxRetries": "3", "timeoutRules": "details", "loopDetection": "Yes"},
    "budgetConstraints": {"costCeiling": "$100", "timeCeiling": "30min", "toolUsageLimits": "100 calls"},
    "signalsEmitted": {"taskCreated": true/false, "planProposed": true/false, "stepAssigned": true/false}
  },
  "layer4_agent": {
    "purpose": "Define reasoning roles (NOT execution authority)",
    "${serviceKey}": ["service1", "service2"],
    "agentRoles": {"plannerAgent": true/false, "actionProposalAgent": true/false, "verifierAgent": true/false, "securityGovernanceAgent": true/false, "memoryStewardAgent": true/false},
    "responsibilities": {"planner": "Creates execution plan (task decomposition)", "actionProposal": "PROPOSES actions for approval (does NOT execute)", "verifier": "Validates proposals using EXTERNAL confidence scoring"},
    "separationOfDuties": "what agents cannot do",
    "signalsEmitted": {"stepResult": true/false, "riskDetected": true/false, "approvalRequired": true/false}
  },
  "layer5_model": {
    "purpose": "Controlled, replaceable LLM inference",
    "${serviceKey}": ["service1", "service2"],
    "modelsUsed": {"primary": "GPT-4o or GPT-4-Turbo", "secondaryFallback": "gpt-4o-mini (efficient for low-risk)"},
    "modelRoutingRules": {"highRiskTasks": "GPT-4 with human review", "lowRiskTasks": "GPT-3.5 auto"},
    "promptConstraints": {"systemPrompts": true/false, "rolePrompts": true/false, "domainConstraints": true/false},
    "outputControls": {"jsonSchemaEnforcement": true/false, "functionCalling": true/false, "confidenceScoring": true/false, "contentFiltering": true/false},
    "signalsEmitted": {"modelInferenceRequest": true/false, "modelResponseReceived": true/false}
  },
  "layer6_tool_action": {
    "purpose": "Safely execute real-world actions",
    "${serviceKey}": ["service1", "service2"],
    "toolAccessModel": {"centralToolRouter": true/false, "allowlistOnly": true/false, "denyByDefault": true/false},
    "toolsInventory": [{"tool": "Email", "riskLevel": "Low", "approvalRequired": "No"}],
    "executionSafeguards": {"argumentValidation": true/false, "dryRunPlanOnly": true/false, "humanApprovalGate": true/false, "rollbackCapability": true/false},
    "signalsEmitted": {"toolCallIntent": true/false, "toolExecute": true/false, "toolResult": true/false}
  },
  "layer7_knowledge_memory": {
    "purpose": "Provide correct context without poisoning or drift",
    "${serviceKey}": ["service1", "service2"],
    "knowledgeSources": {"documents": true/false, "databases": true/false, "apis": true/false},
    "ragControls": {"chunkingStrategy": "semantic chunking", "embeddingModel": "text-embedding-3-large (Azure OpenAI)"},
    "memoryGovernance": {"shortTermMemory": true/false, "longTermMemory": true/false, "ttlEnforced": true/false},
    "signalsEmitted": {"contextRetrieveRequest": true/false, "contextRetrieveResult": true/false}
  },
  "layer8_observability": {
    "purpose": "Make the system auditable, certifiable, and debuggable",
    "${serviceKey}": ["service1", "service2"],
    "telemetry": {"distributedTracing": true/false, "metricsCollection": true/false},
    "auditEvidence": {"immutableLogs": true/false, "toolReceipts": true/false, "approvalRecords": true/false},
    "monitoringResponse": {"driftDetection": true/false, "anomalyDetection": true/false},
    "signalsEmitted": {"auditLogAppend": true/false, "evidenceCaptured": true/false}
  }
}

Respond with ONLY the JSON, no markdown.`
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const fullResponse = data.content.map(item => item.type === "text" ? item.text : "").filter(Boolean).join("\n");
      const cleanJson = fullResponse.replace(/```json|```/g, "").trim();
      const parsedArch = JSON.parse(cleanJson);
      
      setArchitecture(parsedArch);
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateDiagram = async () => {
    if (!architecture) return;
    setLoading(true);
    
    try {
      const serviceKey = selectedCloudProvider === 'azure' ? 'cloudServices' : 'recommendedServices';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Generate a Mermaid flowchart showing the 8-layer agentic architecture with STRICT layer separation rules.

CRITICAL RULES - MUST FOLLOW:
1. Azure OpenAI ONLY in Layer 5 (Model Layer) for inference - NEVER in Layer 4, 6, or 7
2. If embeddings appear in Layer 7, annotate as "Embeddings only (offline indexing)" to distinguish from inference
3. Orchestration (Layer 3) vs Tools (Layer 6) must be clearly separated
4. Knowledge (Layer 7) must be visually independent from Model (Layer 5)
5. Observability (Layer 8) is an overlay (dotted lines) monitoring all layers
6. Use "Action Proposal Agent" not "Executor Agent" to emphasize propose-not-execute

LAYER STRUCTURE:
Layer 1 (Experience): ${architecture.layer1_experience?.[serviceKey]?.slice(0,3).join(', ')}
Layer 2 (Access & Policy): ${architecture.layer2_access_policy?.[serviceKey]?.slice(0,3).join(', ')}
Layer 3 (Orchestration - CONTROL ONLY): ${architecture.layer3_orchestration?.[serviceKey]?.slice(0,3).join(', ')}
Layer 4 (Agents - Reasoning): Planner, Action Proposal (not execution), Verifier agents
Layer 5 (Model - INFERENCE ONLY): ${architecture.layer5_model?.[serviceKey]?.slice(0,2).join(', ')}
Layer 6 (Tools - EXECUTION ONLY): ${architecture.layer6_tool_action?.[serviceKey]?.slice(0,3).join(', ')}
Layer 7 (Knowledge - SEPARATE FROM L5): ${architecture.layer7_knowledge_memory?.[serviceKey]?.slice(0,3).join(', ')} - if OpenAI appears, label "embeddings only"
Layer 8 (Observability - OVERLAY): ${architecture.layer8_observability?.[serviceKey]?.slice(0,3).join(', ')}

Use flowchart TB format with subgraphs for each layer.
Show clear data flow: L3 coordinates → L4 reasons → L5 infers → L6 executes
L8 monitors all with dotted lines (-.monitors.->)

ONLY Mermaid code, no markdown, no explanations.`
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const mermaidCode = data.content.map(item => item.type === "text" ? item.text : "").join("\n").replace(/```mermaid|```/g, "").trim();
      setDiagramMermaid(mermaidCode);
      setShowDiagramDialog(true);
    } catch (error) {
      setError(`Diagram error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeDiagramAndScrollToArchitecture = () => {
    setShowDiagramDialog(false);
    // Scroll to top of architecture section
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const downloadArchitecture = () => {
    if (!architecture) return;
    const blob = new Blob([JSON.stringify(architecture, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qorvex-${selectedCloudProvider}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const LayerCard = ({ title, data, layerNum, icon: Icon }) => {
    if (!data) return null;
    const colors = {1: 'from-sky-500 to-blue-600', 2: 'from-violet-500 to-purple-600', 3: 'from-pink-500 to-rose-600', 4: 'from-orange-500 to-amber-600', 5: 'from-emerald-500 to-teal-600', 6: 'from-cyan-500 to-blue-500', 7: 'from-indigo-500 to-violet-600', 8: 'from-fuchsia-500 to-purple-600'};

    return (
      <div className="mb-6 rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
        <div className={`bg-gradient-to-r ${colors[layerNum] || 'from-gray-500 to-gray-600'} p-6 text-white`}>
          <div className="flex items-center gap-3">
            {Icon && <Icon size={28} />}
            <div>
              <div className="text-sm font-semibold opacity-80">Layer {layerNum}</div>
              <h3 className="text-2xl font-bold">{title}</h3>
            </div>
          </div>
        </div>
        <div className="p-6">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'purpose') {
              return <div key={key} className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"><div className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-1">Purpose</div><div className="text-gray-800 font-medium">{value}</div></div>;
            }
            if ((key === 'cloudServices' || key === 'recommendedServices') && Array.isArray(value)) {
              return <div key={key} className="mb-4"><div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-2"><Cloud size={14} />{key === 'cloudServices' ? 'Cloud Services' : 'Recommended Services'}</div><div className="flex flex-wrap gap-2">{value.map((s, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"><Cloud size={12} />{s}</span>)}</div></div>;
            }
            if (Array.isArray(value)) {
              return <div key={key} className="mb-4"><div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">{key.replace(/_/g, ' ')}</div><div className="space-y-1">{value.map((item, i) => <div key={i} className="flex items-start gap-2 text-gray-700"><CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" /><span className="text-sm">{typeof item === 'object' ? JSON.stringify(item) : item}</span></div>)}</div></div>;
            }
            if (typeof value === 'object' && value !== null) {
              return <div key={key} className="mb-4"><div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">{key.replace(/_/g, ' ')}</div><div className="bg-gray-50 rounded-lg p-4 space-y-2">{Object.entries(value).map(([k, v]) => typeof v === 'boolean' ? <div key={k} className="flex items-center gap-2 text-sm"><div className={`w-5 h-5 rounded flex items-center justify-center ${v ? 'bg-green-500' : 'bg-gray-300'}`}>{v && <CheckCircle2 size={16} className="text-white" />}</div><span className={`font-medium ${v ? 'text-gray-800' : 'text-gray-500'}`}>{k.replace(/_/g, ' ')}</span></div> : <div key={k} className="flex justify-between items-start text-sm"><span className="font-medium text-gray-600">{k.replace(/_/g, ' ')}:</span><span className="text-gray-800 text-right ml-4 flex-1">{Array.isArray(v) ? v.join(', ') : String(v)}</span></div>)}</div></div>;
            }
            return <div key={key} className="mb-4"><div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">{key.replace(/_/g, ' ')}</div><div className="text-gray-800 text-sm">{String(value)}</div></div>;
          })}
        </div>
      </div>
    );
  };

  const ComparisonView = () => {
    if (!compareArch1 || !compareArch2) return null;
    const layers = ['layer1_experience', 'layer2_access_policy', 'layer3_orchestration', 'layer4_agent', 'layer5_model', 'layer6_tool_action', 'layer7_knowledge_memory', 'layer8_observability'];
    return (
      <div className="space-y-6">
        {layers.map(layer => (
          <div key={layer} className="border rounded-lg p-4 bg-white">
            <h4 className="font-bold text-lg mb-3 capitalize">{layer.replace(/_/g, ' ')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-xs uppercase text-blue-600 font-bold mb-2">{compareArch1.name} ({compareArch1.cloudProvider})</div><pre className="text-xs bg-blue-50 p-3 rounded overflow-auto max-h-48">{JSON.stringify(compareArch1.architecture[layer], null, 2)}</pre></div>
              <div><div className="text-xs uppercase text-purple-600 font-bold mb-2">{compareArch2.name} ({compareArch2.cloudProvider})</div><pre className="text-xs bg-purple-50 p-3 rounded overflow-auto max-h-48">{JSON.stringify(compareArch2.architecture[layer], null, 2)}</pre></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Cloud Provider Selection Screen
  if (!selectedCloudProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Layers className="text-purple-400" size={56} />
              <h1 className="text-6xl font-black text-white tracking-tight">Qorvex</h1>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">Agentic Architecture Designer</h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto">Design enterprise-grade AI agent systems with vendor-neutral or cloud-specific implementations</p>
          </div>
          
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Select Your Cloud Provider</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(cloudProviders).map(([key, provider]) => (
                <button key={key} onClick={() => provider.available && setSelectedCloudProvider(key)} disabled={!provider.available} className={`relative p-8 rounded-2xl border-2 transition-all ${provider.available ? `bg-gradient-to-r ${provider.color} bg-opacity-10 border-white/20 hover:border-white/40 hover:scale-105 cursor-pointer` : 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'}`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{provider.icon}</div>
                    <h4 className="text-2xl font-bold text-white mb-2">{provider.name}</h4>
                    <p className="text-gray-300 mb-4">{provider.description}</p>
                    {provider.available ? <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold"><CheckCircle2 size={16} />Available</span> : provider.comingSoon ? <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold"><AlertTriangle size={16} />Coming Soon</span> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">What is Qorvex?</h3>
              {savedArchitectures.length > 0 && (
                <button onClick={() => setShowLoadDialog(true)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg">
                  <FolderOpen size={20} />Load Saved
                </button>
              )}
            </div>
            <p className="text-gray-300 mb-4">Qorvex is a vendor-neutral agentic architecture design platform that helps you create enterprise-grade AI agent systems following the official 8-layer Agentic System Design Template.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-4"><Server className="text-blue-400 mb-2" size={24} /><h4 className="font-bold text-white mb-1">Cloud Agnostic</h4><p className="text-gray-400 text-sm">Design once, deploy anywhere</p></div>
              <div className="bg-white/5 rounded-lg p-4"><Shield className="text-green-400 mb-2" size={24} /><h4 className="font-bold text-white mb-1">Enterprise Ready</h4><p className="text-gray-400 text-sm">Security and compliance built-in</p></div>
              <div className="bg-white/5 rounded-lg p-4"><Zap className="text-yellow-400 mb-2" size={24} /><h4 className="font-bold text-white mb-1">Best Practices</h4><p className="text-gray-400 text-sm">Industry-standard templates</p></div>
            </div>
          </div>

          {/* Load Dialog on cloud selector screen */}
          {showLoadDialog && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-2xl p-8 max-w-3xl w-full max-h-[600px] overflow-y-auto border-2 border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Load Architecture</h3>
                  <button onClick={() => setShowLoadDialog(false)} className="text-gray-400 hover:text-white"><X size={28} /></button>
                </div>
                {savedArchitectures.length === 0 ? (
                  <p className="text-gray-400 text-center py-12">No saved architectures yet.</p>
                ) : (
                  <div className="space-y-3">
                    {savedArchitectures.map((arch) => (
                      <div key={arch.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-lg">{arch.name}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">{cloudProviders[arch.cloudProvider]?.name || arch.cloudProvider}</span>
                          </div>
                          <p className="text-sm text-gray-400">{new Date(arch.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => loadArchitecture(arch)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Load</button>
                          <button onClick={() => deleteArchitecture(arch.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }


  // Main Application Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Layers className="text-purple-400" size={48} />
            <h1 className="text-5xl font-black text-white tracking-tight">Qorvex</h1>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Agentic Architecture Designer</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${cloudProviders[selectedCloudProvider]?.color} rounded-full text-white font-bold text-lg shadow-lg`}>
              <span className="text-2xl">{cloudProviders[selectedCloudProvider]?.icon}</span>
              {cloudProviders[selectedCloudProvider]?.name}
            </span>
            <button onClick={() => { setSelectedCloudProvider(null); setArchitecture(null); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Change Provider</button>
          </div>
        </div>

        {/* Templates */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-yellow-400" size={24} />Quick Start Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(getTemplates()).map(([key, description]) => (
              <button key={key} onClick={() => { setSelectedTemplate(key); setRequirements(description); }} className={`text-left p-4 rounded-xl transition-all border-2 ${selectedTemplate === key ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                <div className="font-bold text-white mb-1 capitalize text-sm">{key.replace(/-/g, ' ')}</div>
                <div className="text-gray-400 text-xs line-clamp-2">{description.substring(0, 80)}...</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
          <label className="block text-white font-bold mb-3 text-lg">System Requirements</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Describe your agentic system requirements..." className="w-full h-48 p-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none font-mono text-sm" />
          <div className="flex gap-3 mt-4 flex-wrap">
            <button onClick={generateArchitecture} disabled={loading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 shadow-lg">
              {loading ? <><Loader2 className="animate-spin" size={24} />Generating...</> : <><Layers size={24} />Generate Architecture</>}
            </button>
            <button onClick={() => setShowLoadDialog(true)} className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 border-2 border-white/20">
              <FolderOpen size={24} />Load Saved
            </button>
          </div>
          {error && <div className="mt-6 p-4 bg-red-500/20 border-2 border-red-400 rounded-xl text-red-200 flex items-start gap-3"><AlertTriangle size={24} className="flex-shrink-0 mt-0.5" /><div>{error}</div></div>}
        </div>

        {/* Architecture Output */}
        {architecture && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-3xl font-black text-white flex items-center gap-3"><CheckCircle2 className="text-green-400" size={32} />Generated Architecture</h2>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setArchitecture(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg"><X size={20} />Close</button>
                <button onClick={() => setShowSaveDialog(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg"><Save size={20} />Save</button>
                <button onClick={generateDiagram} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg"><Network size={20} />Diagram</button>
                <button onClick={() => setShowCompareDialog(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg"><GitCompare size={20} />Compare</button>
                <button onClick={downloadArchitecture} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg"><Download size={20} />Export</button>
              </div>
            </div>

            <LayerCard title="Experience Layer" data={architecture.layer1_experience} layerNum={1} icon={Eye} />
            <LayerCard title="Access & Policy Gateway" data={architecture.layer2_access_policy} layerNum={2} icon={Shield} />
            <LayerCard title="Agentic Orchestration" data={architecture.layer3_orchestration} layerNum={3} icon={Settings} />
            <LayerCard title="Agent Layer" data={architecture.layer4_agent} layerNum={4} icon={Zap} />
            <LayerCard title="Model Layer" data={architecture.layer5_model} layerNum={5} icon={Cloud} />
            <LayerCard title="Tool & Action Layer" data={architecture.layer6_tool_action} layerNum={6} icon={Network} />
            <LayerCard title="Knowledge & Memory" data={architecture.layer7_knowledge_memory} layerNum={7} icon={Database} />
            <LayerCard title="Observability & Audit" data={architecture.layer8_observability} layerNum={8} icon={Eye} />
          </div>
        )}

        {/* Dialogs */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border-2 border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Save Architecture</h3>
                <button onClick={() => setShowSaveDialog(false)} className="text-gray-400 hover:text-white"><X size={28} /></button>
              </div>
              <input type="text" value={archName} onChange={(e) => setArchName(e.target.value)} placeholder="Enter architecture name..." className="w-full p-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-6" />
              <button onClick={saveArchitecture} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 rounded-xl shadow-lg">Save Architecture</button>
            </div>
          </div>
        )}

        {showLoadDialog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-3xl w-full max-h-[600px] overflow-y-auto border-2 border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Load Architecture</h3>
                <button onClick={() => setShowLoadDialog(false)} className="text-gray-400 hover:text-white"><X size={28} /></button>
              </div>
              {savedArchitectures.length === 0 ? <p className="text-gray-400 text-center py-12">No saved architectures yet.</p> : (
                <div className="space-y-3">
                  {savedArchitectures.map((arch) => (
                    <div key={arch.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white text-lg">{arch.name}</h4>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">{cloudProviders[arch.cloudProvider]?.name || arch.cloudProvider}</span>
                        </div>
                        <p className="text-sm text-gray-400">{new Date(arch.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => loadArchitecture(arch)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">Load</button>
                        <button onClick={() => deleteArchitecture(arch.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showCompareDialog && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-7xl w-full my-8 border-2 border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Compare Architectures</h3>
                <button onClick={() => { setShowCompareDialog(false); setCompareArch1(null); setCompareArch2(null); }} className="text-gray-400 hover:text-white"><X size={28} /></button>
              </div>
              {!compareArch1 || !compareArch2 ? (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Architecture 1</h4>
                    <select onChange={(e) => setCompareArch1(savedArchitectures.find(a => a.id === e.target.value))} className="w-full p-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400">
                      <option value="">Select...</option>
                      {savedArchitectures.map(arch => <option key={arch.id} value={arch.id} className="bg-slate-700">{arch.name} ({arch.cloudProvider})</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-3">Architecture 2</h4>
                    <select onChange={(e) => setCompareArch2(savedArchitectures.find(a => a.id === e.target.value))} className="w-full p-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400">
                      <option value="">Select...</option>
                      {savedArchitectures.map(arch => <option key={arch.id} value={arch.id} className="bg-slate-700">{arch.name} ({arch.cloudProvider})</option>)}
                    </select>
                  </div>
                </div>
              ) : <ComparisonView />}
            </div>
          </div>
        )}

        {showDiagramDialog && diagramMermaid && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-7xl w-full max-h-[90vh] overflow-auto border-2 border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Network className="text-blue-400" size={32} />Architecture Diagram</h3>
                <div className="flex gap-3">
                  <button 
                    onClick={closeDiagramAndScrollToArchitecture} 
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-all"
                  >
                    ← Back to Layers
                  </button>
                  <button onClick={closeDiagramAndScrollToArchitecture} className="text-gray-400 hover:text-white transition-all"><X size={28} /></button>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Rendered Diagram using mermaid.ink */}
                <div className="bg-white rounded-xl p-8 min-h-[500px] flex items-center justify-center overflow-auto">
                  <img 
                    src={`https://mermaid.ink/img/${btoa(diagramMermaid)}`}
                    alt="Architecture Diagram"
                    className="max-w-full h-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div style={{display: 'none'}} className="text-center p-8">
                    <p className="text-gray-600 mb-4 font-bold">📊 Diagram Generated Successfully!</p>
                    <p className="text-gray-500 mb-4">The diagram code is ready. Use the buttons below to view or download it.</p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Quick tip: Copy the code and paste it at <span className="font-mono bg-gray-200 px-2 py-1 rounded">mermaid.live</span></p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { 
                      navigator.clipboard.writeText(diagramMermaid); 
                      const btn = event.target.closest('button'); 
                      const orig = btn.innerHTML; 
                      btn.innerHTML = '<svg class="inline mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!'; 
                      setTimeout(() => btn.innerHTML = orig, 2000); 
                    }} 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Download size={20} />Copy Mermaid Code
                  </button>
                  <button 
                    onClick={() => { 
                      const blob = new Blob([diagramMermaid], { type: 'text/plain' }); 
                      const url = URL.createObjectURL(blob); 
                      const a = document.createElement('a'); 
                      a.href = url; 
                      a.download = `qorvex-diagram-${Date.now()}.mmd`; 
                      document.body.appendChild(a); 
                      a.click(); 
                      document.body.removeChild(a); 
                      URL.revokeObjectURL(url); 
                    }} 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Download size={20} />Download .mmd File
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border-2 border-blue-400/30 rounded-xl p-5">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    How to View in Mermaid Live Editor
                  </h4>
                  <ol className="text-blue-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-300 min-w-[20px]">1.</span>
                      <span>Click "Copy Mermaid Code" button above</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-300 min-w-[20px]">2.</span>
                      <span>Open a new browser tab and go to: <span className="font-mono bg-blue-900/30 px-2 py-1 rounded">mermaid.live</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-300 min-w-[20px]">3.</span>
                      <span>Paste the code into the editor (Ctrl+V or Cmd+V)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-300 min-w-[20px]">4.</span>
                      <span>Your diagram will appear! You can then export it as PNG or SVG</span>
                    </li>
                  </ol>
                </div>

                {/* Code View (Collapsible) */}
                <details className="bg-slate-900 rounded-xl border-2 border-white/10">
                  <summary className="cursor-pointer p-4 text-white font-bold hover:bg-white/5 rounded-xl transition-all">
                    📝 View Mermaid Code ({diagramMermaid.split('\n').length} lines)
                  </summary>
                  <div className="p-4">
                    <pre className="text-sm text-green-400 overflow-x-auto font-mono bg-black/30 p-4 rounded-lg max-h-96 overflow-y-auto border border-green-500/20">{diagramMermaid}</pre>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QorvexAgenticArchitect;
