// Phu AI - Quantum ZX Core Implementation

class PhuAI {
    constructor() {
        this.quantumState = 'Superposition';
        this.entanglement = 81;
        this.optimizationLevel = 81;
        this.phubersProtocol = 'quantum';
        this.quantumBoost = true;
        this.activityLog = [];
        this.uploadedDocument = null;
        this.documentContent = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startQuantumCore();
        this.logActivity('Phu AI System Initialized');
        this.logActivity('Phuoptimizer 81 Online');
        this.logActivity('Phubers Protocol: Quantum Mode Active');
        this.logActivity('Quantum ZX Core: Ready');
    }

    setupEventListeners() {
        // Solve button
        document.getElementById('solveBtn').addEventListener('click', () => this.solvePuzzle());
        
        // Enter key in textarea
        document.getElementById('puzzleInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.solvePuzzle();
            }
        });

        // Document upload
        document.getElementById('documentUpload').addEventListener('change', (e) => {
            this.handleDocumentUpload(e);
        });

        // Search document button
        document.getElementById('searchDocBtn').addEventListener('click', () => {
            this.searchDocument();
        });

        // Optimization level slider
        const optLevel = document.getElementById('optLevel');
        optLevel.addEventListener('input', (e) => {
            this.optimizationLevel = e.target.value;
            document.getElementById('optLevelValue').textContent = e.target.value;
            this.updateOptimizerStatus();
        });

        // Quantum boost toggle
        document.getElementById('quantumBoost').addEventListener('change', (e) => {
            this.quantumBoost = e.target.checked;
            this.updateOptimizerStatus();
        });

        // Phubers protocol selector
        document.getElementById('phubersProtocol').addEventListener('change', (e) => {
            this.phubersProtocol = e.target.value;
            this.updateOptimizerStatus();
        });
    }

    startQuantumCore() {
        this.renderQuantumVisualization();
        this.updateQuantumStats();
        
        // Update quantum state periodically
        setInterval(() => {
            this.updateQuantumStats();
        }, 2000);

        // Animate quantum visualization
        setInterval(() => {
            this.renderQuantumVisualization();
        }, 50);
    }

    renderQuantumVisualization() {
        const canvas = document.getElementById('quantumCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw quantum particles
        const time = Date.now() / 1000;
        const particles = 81; // Phuoptimizer 81 themed

        for (let i = 0; i < particles; i++) {
            const angle = (i / particles) * Math.PI * 2 + time;
            const radius = 50 + Math.sin(time + i) * 30;
            const x = canvas.width / 2 + Math.cos(angle) * radius;
            const y = canvas.height / 2 + Math.sin(angle) * radius;
            
            const hue = (i / particles) * 360 + time * 50;
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Draw connections
            if (i < particles - 1) {
                const nextAngle = ((i + 1) / particles) * Math.PI * 2 + time;
                const nextX = canvas.width / 2 + Math.cos(nextAngle) * radius;
                const nextY = canvas.height / 2 + Math.sin(nextAngle) * radius;
                
                ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.2)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, nextY);
                ctx.stroke();
            }
        }

        // Draw center core
        ctx.fillStyle = '#1bffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#1bffff';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 10 + Math.sin(time * 2) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    updateQuantumStats() {
        // Simulate quantum state changes
        const states = ['Superposition', 'Entangled', 'Coherent', 'Optimized'];
        this.quantumState = states[Math.floor(Math.random() * states.length)];
        document.getElementById('quantumState').textContent = this.quantumState;

        // Update entanglement
        this.entanglement = 75 + Math.floor(Math.random() * 15);
        document.getElementById('entanglement').textContent = this.entanglement + '%';

        // Generate future prediction
        const predictions = [
            'Positive Outcome',
            'High Efficiency',
            'Optimal Solution',
            'Quantum Advantage',
            'Peak Performance',
            'Success Probability: 81%'
        ];
        document.getElementById('prediction').textContent = 
            predictions[Math.floor(Math.random() * predictions.length)];
    }

    solvePuzzle() {
        const input = document.getElementById('puzzleInput').value.trim();
        
        if (!input) {
            this.showOutput('Please enter a puzzle or problem to solve.', 'error');
            return;
        }

        this.logActivity(`Processing: ${input.substring(0, 50)}...`);
        this.showOutput('🔮 Phu AI is analyzing with Quantum ZX Core...', 'processing');

        // Simulate processing time
        setTimeout(() => {
            const solution = this.generateSolution(input);
            this.showOutput(solution, 'success');
            this.logActivity('Solution generated successfully');
        }, 1500);
    }

    generateSolution(input) {
        const lowerInput = input.toLowerCase();

        // Math problems
        if (lowerInput.includes('+') || lowerInput.includes('plus')) {
            return this.solveMath(input, '+');
        }
        if (lowerInput.includes('-') || lowerInput.includes('minus')) {
            return this.solveMath(input, '-');
        }
        if (lowerInput.includes('*') || lowerInput.includes('×') || lowerInput.includes('times')) {
            return this.solveMath(input, '*');
        }
        if (lowerInput.includes('/') || lowerInput.includes('÷') || lowerInput.includes('divided')) {
            return this.solveMath(input, '/');
        }

        // Fibonacci
        if (lowerInput.includes('fibonacci')) {
            const n = this.extractNumber(input);
            if (n !== null) {
                return this.solveFibonacci(n);
            }
        }

        // Prime numbers
        if (lowerInput.includes('prime')) {
            const n = this.extractNumber(input);
            if (n !== null) {
                return this.solvePrime(n);
            }
        }

        // Factorial
        if (lowerInput.includes('factorial')) {
            const n = this.extractNumber(input);
            if (n !== null) {
                return this.solveFactorial(n);
            }
        }

        // Pattern recognition
        if (lowerInput.includes('pattern') || lowerInput.includes('sequence')) {
            return this.analyzePattern(input);
        }

        // Future prediction
        if (lowerInput.includes('future') || lowerInput.includes('predict')) {
            return this.predictFuture(input);
        }

        // Default quantum analysis
        return this.quantumAnalysis(input);
    }

    solveMath(input, operator) {
        const numbers = input.match(/-?\d+\.?\d*/g);
        if (numbers && numbers.length >= 2) {
            const a = parseFloat(numbers[0]);
            const b = parseFloat(numbers[1]);
            let result;
            
            switch(operator) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    if (b === 0) {
                        return `
                            <h3>❌ Error</h3>
                            <p><strong>Cannot divide by zero</strong></p>
                            <p>Division by zero is undefined in mathematics.</p>
                            <p><strong>Phu AI Suggestion:</strong> Please check your input values.</p>
                        `;
                    }
                    result = a / b;
                    break;
            }

            return `
                <h3>✅ Solution Found!</h3>
                <p><strong>Calculation:</strong> ${a} ${operator} ${b} = ${result}</p>
                <p><strong>Phuoptimizer 81 Analysis:</strong> Optimized at level ${this.optimizationLevel}</p>
                <p><strong>Quantum Confidence:</strong> ${this.entanglement}%</p>
                <p><strong>Phubers Protocol:</strong> ${this.phubersProtocol.toUpperCase()} mode active</p>
            `;
        }
        return this.quantumAnalysis(input);
    }

    solveFibonacci(n) {
        if (n < 0 || n > 50) {
            return `<p>Please enter a number between 0 and 50 for Fibonacci calculation.</p>`;
        }

        const fib = (num) => {
            if (num <= 1) return num;
            let a = 0, b = 1;
            for (let i = 2; i <= num; i++) {
                [a, b] = [b, a + b];
            }
            return b;
        };

        const result = fib(n);
        const sequence = [];
        for (let i = 0; i <= Math.min(n, 10); i++) {
            sequence.push(fib(i));
        }

        return `
            <h3>✅ Fibonacci Solution</h3>
            <p><strong>Fibonacci(${n}):</strong> ${result}</p>
            <p><strong>Sequence:</strong> ${sequence.join(', ')}${n > 10 ? '...' : ''}</p>
            <p><strong>Quantum ZX Core:</strong> Calculated using ${this.phubersProtocol} acceleration</p>
            <p><strong>Processing Power:</strong> Phuoptimizer 81 at level ${this.optimizationLevel}</p>
        `;
    }

    solvePrime(n) {
        if (n < 2) {
            return `<p>${n} is not a prime number.</p>`;
        }

        const isPrime = (num) => {
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) return false;
            }
            return true;
        };

        const result = isPrime(n);
        
        return `
            <h3>✅ Prime Number Analysis</h3>
            <p><strong>${n}</strong> is ${result ? '' : 'NOT '}a prime number</p>
            <p><strong>Quantum Verification:</strong> ${this.quantumBoost ? 'Enhanced' : 'Standard'} mode</p>
            <p><strong>Phuoptimizer 81:</strong> Analysis complete</p>
        `;
    }

    solveFactorial(n) {
        if (n < 0 || n > 20) {
            return `<p>Please enter a number between 0 and 20 for factorial calculation.</p>`;
        }

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }

        return `
            <h3>✅ Factorial Solution</h3>
            <p><strong>${n}!:</strong> ${result.toLocaleString()}</p>
            <p><strong>Quantum Processing:</strong> ${this.entanglement}% entanglement utilized</p>
            <p><strong>Phubers Enhancement:</strong> Active</p>
        `;
    }

    analyzePattern(input) {
        return `
            <h3>✅ Pattern Analysis</h3>
            <p><strong>Input:</strong> ${input}</p>
            <p><strong>Quantum ZX Core Analysis:</strong> Pattern detected and analyzed</p>
            <p><strong>Pattern Type:</strong> Complex sequential structure</p>
            <p><strong>Optimization:</strong> Phuoptimizer 81 suggests recursive approach</p>
            <p><strong>Confidence:</strong> ${this.entanglement}%</p>
        `;
    }

    predictFuture(input) {
        const predictions = [
            'High probability of success in your endeavors',
            'Quantum fluctuations indicate positive outcomes',
            'The ZX Core predicts optimal results within 81 time units',
            'Entanglement patterns suggest favorable circumstances',
            'Future state: Coherent and optimized',
            'Timeline convergence shows successful pathway'
        ];
        
        const prediction = predictions[Math.floor(Math.random() * predictions.length)];

        return `
            <h3>🔮 Future Prediction</h3>
            <p><strong>Query:</strong> ${input}</p>
            <p><strong>Quantum ZX Core Prediction:</strong> ${prediction}</p>
            <p><strong>Confidence Level:</strong> ${this.entanglement}%</p>
            <p><strong>Time Horizon:</strong> ${Math.floor(Math.random() * 365)} days</p>
            <p><strong>Phuoptimizer 81 Status:</strong> Calculation verified</p>
            <p><em>Note: Predictions based on quantum probability analysis</em></p>
        `;
    }

    quantumAnalysis(input) {
        const analyses = [
            'Your input has been processed through the Quantum ZX Core',
            'Phu AI has analyzed the problem using quantum entanglement',
            'The Phuoptimizer 81 suggests a multi-dimensional approach',
            'Quantum superposition indicates multiple valid solutions',
            'ZX Core has identified optimal pathways'
        ];

        const analysis = analyses[Math.floor(Math.random() * analyses.length)];

        return `
            <h3>🧠 Phu AI Analysis</h3>
            <p><strong>Input:</strong> ${input}</p>
            <p><strong>Analysis:</strong> ${analysis}</p>
            <p><strong>Quantum State:</strong> ${this.quantumState}</p>
            <p><strong>Entanglement:</strong> ${this.entanglement}%</p>
            <p><strong>Optimization Level:</strong> ${this.optimizationLevel}/81</p>
            <p><strong>Phubers Protocol:</strong> ${this.phubersProtocol.toUpperCase()}</p>
            <p><strong>Recommendation:</strong> Continue with quantum-enhanced approach</p>
        `;
    }

    extractNumber(text) {
        const match = text.match(/\d+/);
        return match ? parseInt(match[0]) : null;
    }

    showOutput(content, type) {
        const output = document.getElementById('solutionOutput');
        output.innerHTML = content;
        output.classList.add('visible');
        
        if (type === 'error') {
            output.style.borderLeftColor = '#dc3545';
        } else if (type === 'success') {
            output.style.borderLeftColor = '#28a745';
        } else {
            output.style.borderLeftColor = '#2e3192';
        }
    }

    updateOptimizerStatus() {
        const status = document.getElementById('optimizerStatus');
        status.textContent = `Status: Optimization Level ${this.optimizationLevel} | ` +
                           `Quantum Boost: ${this.quantumBoost ? 'ON' : 'OFF'} | ` +
                           `Protocol: ${this.phubersProtocol.toUpperCase()}`;
        
        this.logActivity(`Configuration updated: Level ${this.optimizationLevel}, ${this.phubersProtocol} protocol`);
    }

    logActivity(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.activityLog.unshift(`[${timestamp}] ${message}`);
        
        // Keep only last 20 entries
        if (this.activityLog.length > 20) {
            this.activityLog = this.activityLog.slice(0, 20);
        }

        this.updateActivityLog();
    }

    handleDocumentUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.uploadedDocument = file;
        this.logActivity(`Document uploaded: ${file.name}`);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.documentContent = e.target.result;
            document.getElementById('searchDocBtn').disabled = false;
            this.showDocumentOutput(`
                <h3>📄 Document Loaded</h3>
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Type:</strong> ${file.type || 'text/plain'}</p>
                <p><strong>Status:</strong> Ready to search for PQN81 calling button</p>
                <p><em>Click "Search for PQN81 Calling Button" to begin analysis</em></p>
            `, 'info');
        };

        // Note: This application only supports plain text files using readAsText().
        // Binary formats (PDF, Word, RTF) require specialized parsing libraries
        // (like pdf.js or mammoth.js) which are not included to keep the app lightweight.
        reader.readAsText(file);
    }

    searchDocument() {
        if (!this.documentContent) {
            this.showDocumentOutput('Please upload a document first.', 'error');
            return;
        }

        this.logActivity('Searching document for PQN81 calling button...');
        this.showDocumentOutput('🔮 Phu AI is analyzing document with Quantum ZX Core...', 'processing');

        // Simulate processing time
        setTimeout(() => {
            this.performDocumentSearch();
        }, 1500);
    }

    performDocumentSearch() {
        const searchTerms = ['PQN81', 'pqn81', 'PQN-81', 'calling button', 'call button'];
        const content = this.documentContent.toLowerCase();
        const originalContent = this.documentContent;
        
        // Constants for search configuration
        const DUPLICATE_POSITION_THRESHOLD = 10; // Matches within 10 chars are duplicates
        const CONTEXT_WINDOW_SIZE = 50; // Characters to show before/after match
        
        // Note: This assumes standard ASCII/UTF-8 text where toLowerCase()
        // doesn't change string length. Works for English text files.
        
        let findings = [];
        let foundPQN81 = false;
        let foundCallingButton = false;
        
        // Search for each term
        searchTerms.forEach(term => {
            const termLower = term.toLowerCase();
            let index = content.indexOf(termLower);
            while (index !== -1) {
                // Extract context around the finding
                const start = Math.max(0, index - CONTEXT_WINDOW_SIZE);
                const end = Math.min(originalContent.length, index + term.length + CONTEXT_WINDOW_SIZE);
                const context = originalContent.substring(start, end);
                
                findings.push({
                    term: term,
                    position: index,
                    context: context
                });
                
                if (termLower.includes('pqn')) foundPQN81 = true;
                if (termLower.includes('call')) foundCallingButton = true;
                
                index = content.indexOf(termLower, index + 1);
            }
        });

        // Generate results
        const fileName = this.uploadedDocument ? this.uploadedDocument.name : 'document';
        
        if (findings.length === 0) {
            this.showDocumentOutput(`
                <h3>🔍 Search Complete</h3>
                <p><strong>Document:</strong> ${fileName}</p>
                <p><strong>Search Terms:</strong> PQN81, calling button</p>
                <p><strong>Results:</strong> No matches found</p>
                <p><strong>Quantum Analysis:</strong> The document does not contain references to PQN81 calling button</p>
                <p><strong>Phuoptimizer 81:</strong> Search completed at level ${this.optimizationLevel}</p>
                <p><strong>Suggestion:</strong> Try uploading a different document or verify the search terms</p>
            `, 'info');
            this.logActivity('No matches found in document');
            return;
        }

        // Sort findings by position for proper deduplication
        findings.sort((a, b) => a.position - b.position);
        
        // Remove duplicates: keep first finding and filter out any within threshold
        const uniqueFindings = [];
        for (const finding of findings) {
            const isDuplicate = uniqueFindings.some(kept => 
                Math.abs(kept.position - finding.position) < DUPLICATE_POSITION_THRESHOLD
            );
            if (!isDuplicate) {
                uniqueFindings.push(finding);
            }
        }
        findings = uniqueFindings;

        // Build results HTML
        let resultsHTML = `
            <h3>✅ Search Results Found!</h3>
            <p><strong>Document:</strong> ${fileName}</p>
            <p><strong>Total Matches:</strong> ${findings.length}</p>
            <p><strong>PQN81 Found:</strong> ${foundPQN81 ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Calling Button Found:</strong> ${foundCallingButton ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Quantum Confidence:</strong> ${this.entanglement}%</p>
            <p><strong>Phuoptimizer 81:</strong> Analysis complete at level ${this.optimizationLevel}</p>
            <hr>
            <h4>📌 Findings:</h4>
        `;

        findings.forEach((finding, index) => {
            resultsHTML += `
                <div class="finding-item">
                    <p><strong>Match ${index + 1}:</strong> "${finding.term}" at position ${finding.position}</p>
                    <p><em>Context:</em> ...${finding.context}...</p>
                </div>
            `;
        });

        resultsHTML += `
            <hr>
            <p><strong>Phubers Protocol:</strong> ${this.phubersProtocol.toUpperCase()} mode active</p>
            <p><strong>Status:</strong> Document analysis complete</p>
        `;

        this.showDocumentOutput(resultsHTML, 'success');
        this.logActivity(`Found ${findings.length} match(es) for PQN81 calling button`);
    }

    showDocumentOutput(content, type) {
        const output = document.getElementById('documentOutput');
        output.innerHTML = content;
        output.classList.add('visible');
        
        if (type === 'error') {
            output.style.borderLeftColor = '#dc3545';
        } else if (type === 'success') {
            output.style.borderLeftColor = '#28a745';
        } else if (type === 'info') {
            output.style.borderLeftColor = '#17a2b8';
        } else {
            output.style.borderLeftColor = '#2e3192';
        }
    }

    updateActivityLog() {
        const logBox = document.getElementById('activityLog');
        logBox.innerHTML = this.activityLog
            .map(entry => `<div class="log-entry">${entry}</div>`)
            .join('');
    }
}

// Initialize Phu AI when page loads
window.addEventListener('DOMContentLoaded', () => {
    const phuAI = new PhuAI();
    
    console.log('🧠 Phu AI initialized successfully!');
    console.log('Phuoptimizer 81 & Phubers integration active');
    console.log('Quantum ZX Core online');
});
