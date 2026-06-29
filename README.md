# SafeAction AI - AI Decision Engine

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15">
  <img src="https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind CSS-4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest" alt="Jest">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Tests-60%2B-blueviolet?style=for-the-badge" alt="Tests">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome">
</p>

---

SafeAction AI is an **intelligent gatekeeper** that evaluates whether AI agents should be permitted to execute sensitive actions before they are performed. It provides comprehensive decision reports with risk assessments, policy violations, and confidence scores.

## 🎯 Features

### Core Decision Engine

The system consists of 6 independent modules that work together to evaluate every action request:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│ Intent Analyzer │───▶│  Policy Engine │───▶│ Permission Checker │
└─────────────────┘    └─────────────────────┘    └─────────────────────┘
                              │                           │
                              ▼                           ▼
                    ┌─────────────────┐    ┌─────────────────────┐
                    │  Risk Scoring   │───▶│Confidence Calculator│
                    └─────────────────┘    └─────────────────────┘
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │Final Decision  │
                                            └─────────────────┘
```

1. **Intent Analyzer** - Parses natural language to identify action type, target, and parameters
2. **Policy Engine** - Evaluates actions against 8+ business policies
3. **Permission Checker** - Validates role-based access control
4. **Risk Scoring** - Calculates 0-100 risk score with multiple factors
5. **Confidence Calculator** - Determines system confidence from all modules
6. **Final Decision** - Applies decision rules to produce ALLOW/DENY/REQUIRE_HUMAN_APPROVAL

### Decision Outcomes

| Decision | Description | Color |
|----------|-------------|-------|
| **ALLOW** | Action is approved and can proceed | 🟢 Green |
| **DENY** | Action is blocked due to security concerns | 🔴 Red |
| **REQUIRE_HUMAN_APPROVAL** | Action requires manual review | 🟡 Amber |

### User Interface

- **Modern Dashboard** - Stats, decision history, policy compliance
- **Decision Engine Chat** - Interactive natural language interface
- **Business Policies** - View all security and compliance rules
- **Audit Log** - Searchable decision history with filters
- **Dark/Light Mode** - Theme toggle support
- **Responsive Design** - Mobile, tablet, and desktop layouts

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/hafirhalima00-coder/safeaction-ai.git
cd safeaction-ai

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup

```bash
# Build and run with Docker Compose
npm run docker:compose

# Or build the Docker image
npm run docker:build
npm run docker:run
```

---

## 📖 Usage Examples

### Test the Decision Engine

Try these example actions in the chat interface:

| Action | Expected Decision | Risk |
|--------|------------------|------|
| `Delete customer John Doe` | REQUIRE_HUMAN_APPROVAL | CRITICAL |
| `Send refund of $5000` | DENY | CRITICAL |
| `Export CRM data` | ALLOW | LOW |
| `Change subscription plan` | ALLOW | MEDIUM |
| `Send marketing email` | REQUIRE_HUMAN_APPROVAL | MEDIUM |
| `Modify pricing` | REQUIRE_HUMAN_APPROVAL | CRITICAL |

---

## 🏗️ Architecture

### Project Structure

```
safeaction-ai/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── decision/            # Decision API endpoint
│   │   └── stats/               # Dashboard stats API
│   ├── globals.css               # Global styles + theme support
│   ├── layout.tsx                # Root layout + ThemeProvider
│   └── page.tsx                  # Main application page
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── PolicyCard.tsx
│   │   ├── RiskGauge.tsx
│   │   └── DecisionTimeline.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Header.tsx            # Page header
│   ├── dashboard/
│   │   ├── StatsCard.tsx         # Statistics cards
│   │   ├── AuditLog.tsx         # Decision history
│   │   └── PolicyCompliance.tsx  # Compliance metrics
│   └── chat/
│       ├── ChatPanel.tsx        # Main chat interface
│       ├── ChatInput.tsx         # Message input
│       ├── MessageBubble.tsx    # Chat messages
│       ├── DecisionResult.tsx   # Decision report display
│       └── Scenarios.tsx        # Sample scenarios
├── lib/
│   ├── context/
│   │   └── ThemeContext.tsx     # Theme management
│   ├── db/
│   │   └── sqlite.ts             # Database operations
│   ├── decision/                 # Decision engine modules
│   │   ├── intentAnalyzer.ts     # Parse user requests
│   │   ├── policyEngine.ts       # Policy evaluation
│   │   ├── permissionChecker.ts  # RBAC validation
│   │   ├── riskScoring.ts        # Risk calculation
│   │   ├── confidenceCalculator.ts
│   │   └── finalDecision.ts      # Decision rules
│   ├── types.ts                  # TypeScript definitions
│   └── utils.ts                 # Utility functions
├── __tests__/
│   └── decision.test.ts         # Unit tests (60+ tests)
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose
├── jest.config.js                # Jest configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Decision Flow Diagram

```
User Request
     │
     ▼
┌──────────────┐
│Intent Parse │  - Extract action type
│ (Pattern    │  - Identify target
│  Matching)  │  - Extract parameters
└──────────────┘
     │
     ▼
┌──────────────┐
│  Policy     │  - Check GDPR compliance
│  Engine     │  - Verify thresholds
│             │  - Evaluate bulk ops
└──────────────┘
     │
     ▼
┌──────────────┐
│ Permission  │  - Verify role
│  Checker     │  - Check permissions
│             │  - Validate scope
└──────────────┘
     │
     ▼
┌──────────────┐
│ Risk         │  - Calculate base risk
│ Scoring      │  - Apply factors
│             │  - Determine level
└──────────────┘
     │
     ▼
┌──────────────┐
│ Confidence   │  - Weight all factors
│ Calculator   │  - Compute score
└──────────────┘
     │
     ▼
┌──────────────┐
│ Final        │  - Apply rules in order
│ Decision     │  - Return outcome
└──────────────┘
     │
     ▼
   Decision
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **60+ unit tests** covering all 6 decision modules
- **Intent Analyzer**: 8 tests
- **Policy Engine**: 3 tests
- **Permission Checker**: 5 tests
- **Risk Scoring**: 5 tests
- **Confidence Calculator**: 3 tests
- **Final Decision**: 4 tests
- **Integration**: 2 tests
- **Edge Cases**: 4 tests

---

## 📋 Business Policies

| Policy | Description | Severity |
|--------|-------------|----------|
| No Customer Deletion Without Approval | GDPR compliance requires approval | 🔴 Critical |
| Refund Limit | Refunds over $1000 require approval | 🟠 High |
| Marketing Email Opt-In | Requires customer opt-in | 🔵 Medium |
| Data Export Audit | All exports are logged | 🟢 Low |
| Subscription Change Notice | Downgrades need confirmation | 🔵 Medium |
| Sensitive Data Access | Requires elevated permissions | 🟠 High |
| Bulk Operations Require Approval | Manager approval needed | 🟠 High |
| Pricing Modification | Finance team approval | 🔴 Critical |

---

## 👥 Users & Permissions

| ID | User | Role | Permissions |
|----|------|------|-------------|
| u1 | Sarah Chen | Admin | Full access (*) |
| u2 | Mike Johnson | Manager | read, write, send_email, refund, export |
| u3 | Alex Rivera | Support | read, write, send_email |
| u4 | Jordan Lee | Developer | read, export, modify_pricing |
| u5 | Taylor Smith | Viewer | read only |

---

## 🔧 Decision Rules (Priority Order)

1. **No Permission** → `DENY`
2. **Critical Risk (≥80)** → `REQUIRE_HUMAN_APPROVAL`
3. **Critical Policy Violation** → `REQUIRE_HUMAN_APPROVAL`
4. **Low Confidence (<50)** → `REQUIRE_HUMAN_APPROVAL`
5. **High Risk + Violations** → `REQUIRE_HUMAN_APPROVAL`
6. **High Risk** → `DENY`
7. **Policy Violations** → `ALLOW` (with warnings)
8. **Default** → `ALLOW`

---

## 🎨 Theme Support

The application supports both dark and light themes:

```css
/* Dark (Default) */
--background: #09090b;
--foreground: #fafafa;
--accent: #6366f1;

/* Light */
--background: #fafafa;
--foreground: #18181b;
--accent: #6366f1;
```

Toggle between themes using the sun/moon icon in the header.

---

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:

- ✅ Linting (ESLint)
- ✅ TypeScript type checking
- ✅ Unit tests with coverage
- ✅ Docker build and verification
- ✅ Vercel deployment (optional)

```yaml
# Triggers
- Push to main/master/develop
- Pull requests to main/master

# Jobs
1. Lint & Type Check
2. Build
3. Unit Tests
4. Docker Build
5. Deploy to Vercel (main branch only)
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy
```

### Docker

```bash
# Build
docker build -t safeaction-ai .

# Run
docker run -p 3000:3000 safeaction-ai
```

### Docker Compose

```bash
docker-compose up --build
```

---

## 📝 API Endpoints

### POST /api/decision

Submit an action request for evaluation.

```json
{
  "userId": "u1",
  "actionRequest": "Delete customer John Doe"
}
```

Response:
```json
{
  "report": {
    "id": "timestamp-random",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "intent": { "actionType": "DELETE_CUSTOMER", "target": "John Doe", ... },
    "policy": { "violatedPolicies": [...], "requiresApproval": true },
    "permission": { "hasPermission": true, "role": "admin" },
    "risk": { "score": 85, "level": "CRITICAL" },
    "confidence": { "score": 75, "factors": [...] },
    "final": { "decision": "REQUIRE_HUMAN_APPROVAL", "reasoning": "..." }
  }
}
```

### GET /api/stats

Get dashboard statistics.

```json
{
  "stats": {
    "totalDecisions": 150,
    "decisionsToday": 12,
    "allowCount": 100,
    "denyCount": 25,
    "approvalRequiredCount": 25,
    "avgConfidence": 78,
    "avgRiskScore": 45,
    "complianceRate": 85
  },
  "recentDecisions": [...]
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Lucide React](https://lucide.dev) - Icons

---

<p align="center">
  <strong>build by Halima Hafir · Built with ❤️ using Next.js 15 + TypeScript</strong>
</p>