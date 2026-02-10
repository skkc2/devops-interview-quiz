// Quiz Application Logic
let selectedLevel = null;
let selectedCount = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeWelcomeScreen();
});

// Welcome Screen Logic
function initializeWelcomeScreen() {
    const levelButtons = document.querySelectorAll('[data-level]');
    const countButtons = document.querySelectorAll('[data-count]');
    const startButton = document.getElementById('start-quiz-btn');

    levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            levelButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedLevel = btn.dataset.level;
            checkStartButtonState();
        });
    });

    countButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            countButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedCount = parseInt(btn.dataset.count);
            checkStartButtonState();
        });
    });

    startButton.addEventListener('click', startQuiz);
}

function checkStartButtonState() {
    const startButton = document.getElementById('start-quiz-btn');
    startButton.disabled = !(selectedLevel && selectedCount);
}

// Generate Quiz Questions
function generateQuestions() {
    const technologies = ['linux', 'terraform', 'aws', 'ansible', 'docker', 'kubernetes', 'git'];
    const levelQuestions = questionBank[selectedLevel];
    const allQuestions = [];

    // Collect all questions from the selected level
    technologies.forEach(tech => {
        levelQuestions[tech].forEach((q, index) => {
            allQuestions.push({
                ...q,
                tech: tech,
                id: `${tech}-${index}`
            });
        });
    });

    // Shuffle and select required number of questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, selectedCount);
}

// Start Quiz
function startQuiz() {
    quizQuestions = generateQuestions();
    userAnswers = new Array(quizQuestions.length).fill(null);
    currentQuestionIndex = 0;
    quizStartTime = new Date();

    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');

    document.getElementById('total-questions').textContent = quizQuestions.length;
    document.getElementById('difficulty-badge').textContent = 
        selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1);

    initializeQuizControls();
    displayQuestion();
}

// Initialize Quiz Controls
function initializeQuizControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            finishQuiz();
        }
    });
}

// Display Current Question
function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('tech-tag').textContent = 
        question.tech.charAt(0).toUpperCase() + question.tech.slice(1);

    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';

    // Display options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }

        button.addEventListener('click', () => {
            selectOption(index);
        });

        optionsContainer.appendChild(button);
    });

    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').textContent = 
        currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next →';
}

// Select Option
function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
        btn.classList.toggle('selected', idx === optionIndex);
    });
}

// Finish Quiz and Show Results
function finishQuiz() {
    const score = calculateScore();
    const techBreakdown = calculateTechBreakdown();

    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');

    displayResults(score, techBreakdown);
    initializeResultsControls();
}

// Calculate Score
function calculateScore() {
    let correct = 0;
    let incorrect = 0;

    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correct++;
        } else if (userAnswers[index] !== null) {
            incorrect++;
        }
    });

    return {
        correct,
        incorrect,
        total: quizQuestions.length,
        percentage: Math.round((correct / quizQuestions.length) * 100)
    };
}

// Calculate Technology Breakdown
function calculateTechBreakdown() {
    const breakdown = {};

    quizQuestions.forEach((question, index) => {
        if (!breakdown[question.tech]) {
            breakdown[question.tech] = { correct: 0, total: 0 };
        }
        breakdown[question.tech].total++;
        if (userAnswers[index] === question.correct) {
            breakdown[question.tech].correct++;
        }
    });

    return breakdown;
}

// Display Results
function displayResults(score, techBreakdown) {
    document.getElementById('score-percentage').textContent = score.percentage + '%';
    document.getElementById('correct-count').textContent = score.correct;
    document.getElementById('incorrect-count').textContent = score.incorrect;
    document.getElementById('total-answered').textContent = score.total;

    // Display tech breakdown
    const breakdownContainer = document.getElementById('tech-breakdown');
    breakdownContainer.innerHTML = '';

    Object.entries(techBreakdown).forEach(([tech, stats]) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        const div = document.createElement('div');
        div.className = 'tech-stat';
        div.innerHTML = `
            <span class="tech-stat-name">${tech.charAt(0).toUpperCase() + tech.slice(1)}</span>
            <span class="tech-stat-score">${stats.correct}/${stats.total} (${percentage}%)</span>
        `;
        breakdownContainer.appendChild(div);
    });
}

// Initialize Results Controls
function initializeResultsControls() {
    document.getElementById('review-btn').addEventListener('click', showReview);
    document.getElementById('restart-btn').addEventListener('click', restart);
}

// Show Review Screen
function showReview() {
    resultsScreen.classList.remove('active');
    reviewScreen.classList.add('active');

    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = '';

    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;

        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="tech-tag">${question.tech.charAt(0).toUpperCase() + question.tech.slice(1)}</div>
                <div class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
            </div>
            <div class="review-question">
                <strong>Q${index + 1}:</strong> ${question.question}
            </div>
            <div class="review-options">
                ${question.options.map((option, optIdx) => {
                    let className = 'review-option';
                    if (optIdx === question.correct) {
                        className += ' correct-answer';
                    }
                    if (optIdx === userAnswer && userAnswer !== question.correct) {
                        className += ' wrong-answer';
                    }
                    if (optIdx === userAnswer) {
                        className += ' user-answer';
                    }
                    
                    let prefix = '';
                    if (optIdx === question.correct) prefix = '✓ ';
                    if (optIdx === userAnswer && userAnswer !== question.correct) prefix = '✗ ';
                    
                    return `<div class="${className}">${prefix}${option}</div>`;
                }).join('')}
            </div>
        `;

        reviewContainer.appendChild(reviewItem);
    });

    document.getElementById('back-to-results').addEventListener('click', () => {
        reviewScreen.classList.remove('active');
        resultsScreen.classList.add('active');
    });
}

// Restart Quiz
function restart() {
    selectedLevel = null;
    selectedCount = null;
    quizQuestions = [];
    currentQuestionIndex = 0;
    userAnswers = [];

    // Reset welcome screen selections
    document.querySelectorAll('.selection-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    resultsScreen.classList.remove('active');
    reviewScreen.classList.remove('active');
    welcomeScreen.classList.add('active');

    checkStartButtonState();
                          }
