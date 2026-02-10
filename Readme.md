# DevOps Interview Practice Quiz

A comprehensive, interactive quiz application for DevOps interview preparation covering Linux, Terraform, AWS, Ansible, Docker, Kubernetes, and Git.

## Features

- **3 Difficulty Levels**: Beginner, Intermediate, and Advanced
- **Flexible Question Counts**: Choose from 50, 100, 150, or 200 questions
- **7 Technology Areas**: Linux, Terraform, AWS, Ansible, Docker, Kubernetes, Git
- **Interactive UI**: Modern, responsive design with smooth animations
- **Detailed Results**: Overall score and performance breakdown by technology
- **Review Mode**: Review all questions with correct answers highlighted
- **No Backend Required**: Pure client-side application, perfect for GitHub Pages

## Demo

Visit the live demo: `https://yourusername.github.io/devops-interview-quiz/`

## Setup Instructions

### Deploying to GitHub Pages

1. **Create a new GitHub repository**
   ```bash
   # Create a new repository on GitHub named "devops-interview-quiz"
   ```

2. **Clone and add files**
   ```bash
   git clone https://github.com/yourusername/devops-interview-quiz.git
   cd devops-interview-quiz
   
   # Copy all files (index.html, styles.css, script.js, questions.js, README.md)
   # into this directory
   ```

3. **Commit and push**
   ```bash
   git add .
   git commit -m "Initial commit: DevOps interview quiz"
   git push origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be published at `https://yourusername.github.io/devops-interview-quiz/`

## File Structure

```
devops-interview-quiz/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── script.js           # Quiz logic and interactivity
├── questions.js        # Question database
└── README.md           # This file
```

## How to Use

1. **Select Difficulty Level**: Choose between Beginner, Intermediate, or Advanced
2. **Choose Question Count**: Select 50, 100, 150, or 200 questions
3. **Start Quiz**: Click "Start Quiz" to begin
4. **Answer Questions**: Click on your chosen answer for each question
5. **Navigate**: Use Previous/Next buttons to move between questions
6. **Finish**: Click "Finish" on the last question to see your results
7. **Review**: Click "Review Answers" to see all questions with correct answers highlighted

## Customization

### Adding More Questions

Edit `questions.js` and add questions to the appropriate difficulty level and technology:

```javascript
questionBank.beginner.linux.push({
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correct: 0  // Index of correct answer (0-3)
});
```

### Changing Colors/Theme

Edit `styles.css` and modify the CSS variables in the `:root` selector:

```css
:root {
    --primary-color: #2563eb;  /* Change primary color */
    --bg-color: #0f172a;       /* Change background color */
    /* ... other variables */
}
```

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- No external dependencies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to fork this repository and add more questions or features! Pull requests are welcome.

## License

MIT License - feel free to use this for your interview preparation!

## Question Count by Technology

Each difficulty level includes approximately 10 questions per technology:
- Linux: 10 questions
- Terraform: 10 questions
- AWS: 10 questions
- Ansible: 10 questions
- Docker: 10 questions
- Kubernetes: 10 questions
- Git: 10 questions

**Total: 70 questions per difficulty level (210 questions total)**

You can expand the question bank by adding more questions to `questions.js`.

## Tips for Interview Preparation

1. Start with the Beginner level to build confidence
2. Review incorrect answers to understand concepts
3. Progress to higher difficulty levels as you improve
4. Focus on technologies relevant to your target role
5. Practice regularly to retain knowledge

Good luck with your DevOps interviews! 🚀
