export class TemplateExplanationEngine {
    static explain(req) {
        switch (req.mode) {
            case 'socratic-hint':
                return this.generateSocraticHint(req);
            case 'architecture-explainer':
                return this.generateArchitectureExplanation(req);
            case 'milestone-guide':
                return this.generateMilestoneGuide(req);
            case 'concept':
            default:
                return this.generateConceptExplanation(req);
        }
    }
    static generateSocraticHint(req) {
        const lines = req.code.split('\n');
        const hasTodo = lines.some((l) => l.includes('TODO') || l.includes('pass'));
        const functions = lines
            .filter((l) => l.trim().startsWith('def ') || l.trim().startsWith('function ') || l.includes(' = ('))
            .map((l) => l.trim().slice(0, 40));
        const guidingQuestions = [
            'What are the minimal preconditions and base cases for this function before processing arguments?',
            'How does the state transform between the function entry and return statement?',
            'If you pass an empty or malformed input, which branch handles it gracefully without throwing an uncaught exception?'
        ];
        if (req.errorFeedback) {
            guidingQuestions.unshift(`Notice the verification output: "${req.errorFeedback.slice(0, 80)}...". What missing symbol or return shape caused this constraint to fail?`);
        }
        const invariants = [
            'Pure algorithmic core: avoid external side-effects unless explicitly required.',
            'Deterministic output: identical inputs must produce identical outputs.',
            'Type contract: ensure return values strictly adhere to the expected shape.'
        ];
        const explanation = `### 🧠 Socratic Guidance
Instead of giving away the solution directly, let's reason through the constraints:

1. **Target Milestone**: ${req.milestoneTitle || 'Core Invariant'}
${req.milestoneGoal ? `2. **Objective**: ${req.milestoneGoal}\n` : ''}
${hasTodo ? `3. **Observation**: Notice the placeholder comments in the source. What concrete operation replaces the \`TODO\`?\n` : ''}
${functions.length > 0 ? `4. **Key Functions**: ${functions.join(', ')}\n` : ''}
Ponder the questions below to unlock the solution.`;
        return {
            provider: 'template',
            model: 'deterministic-heuristics-v1',
            explanation,
            guidingQuestions,
            keyInvariants: invariants
        };
    }
    static generateArchitectureExplanation(req) {
        const path = req.filePath || 'Source file';
        const lines = req.code.split('\n');
        const importCount = lines.filter((l) => l.includes('import ') || l.includes('require(')).length;
        const exportCount = lines.filter((l) => l.includes('export ') || l.includes('__all__')).length;
        const explanation = `### 🏛️ Module Architecture Analysis
**Target File**: \`${path}\`

- **Dependency Footprint**: ${importCount} external/internal imports.
- **Export Surface**: ${exportCount} public symbols or exports.
- **Role in Graph**: Acts as a central gravity node in the topological execution hierarchy. Modules higher in the topological order coordinate domain logic, while leaves provide utilities and primitive helpers.

#### Structural Invariants:
1. **Separation of Concerns**: Business contracts are decoupled from transport or rendering layers.
2. **Topological Stability**: Dependents rely on stable interface contracts; changing exports in this file cascades downstream.`;
        const guidingQuestions = [
            'Which upstream modules import this file, and what contracts do they expect?',
            'Can this module be tested in complete isolation without mocking the entire graph?'
        ];
        return {
            provider: 'template',
            model: 'deterministic-heuristics-v1',
            explanation,
            guidingQuestions,
            keyInvariants: [
                'High cohesion: keep closely coupled functions in the same module boundary.',
                'Low coupling: minimize direct access to private internal members.'
            ]
        };
    }
    static generateMilestoneGuide(req) {
        return {
            provider: 'template',
            model: 'deterministic-heuristics-v1',
            explanation: `### 🎯 Milestone Roadmap: ${req.milestoneTitle || 'Stage Objective'}
${req.milestoneGoal || 'Implement the core logic satisfying the deterministic unit test harness.'}

#### Step-by-Step Blueprint:
1. **Define the signature**: Declare functions with explicit parameters.
2. **Handle base cases / edge cases**: Empty strings, zeroes, or undefined options.
3. **Write the core algorithm**: State mutation or computational pipeline.
4. **Return value**: Ensure the output matches the required test assertion.`,
            guidingQuestions: [
                'Does your implementation handle boundary conditions (e.g. empty inputs)?',
                'Have you verified that all required symbols are exported?'
            ],
            keyInvariants: [
                'Deterministic execution test pass is required to unlock subsequent stages.'
            ]
        };
    }
    static generateConceptExplanation(req) {
        return {
            provider: 'template',
            model: 'deterministic-heuristics-v1',
            explanation: `### 💡 Algorithmic Concept
Understanding the relationship between input state, transformation logic, and output contracts. Every clean architecture relies on deterministic functions whose behavior is verifiable via unit tests.`,
            guidingQuestions: ['How can this logic be decomposed into smaller pure functions?']
        };
    }
}
//# sourceMappingURL=template_engine.js.map