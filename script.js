document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');

  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const revealItems = document.querySelectorAll(
    '.hero-copy, .hero-card, .hero-mini-card, .two-col > *, .section-heading, .service-card, ' +
      '.ai-panel-copy, .ai-console, .timeline-item, .skill-card, .edu-item, .competencies span, ' +
      '.footer-wrap > *'
  );
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const tabButtons = document.querySelectorAll('.tab-button');
  const consolePanes = document.querySelectorAll('.console-pane');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      consolePanes.forEach((pane) => {
        pane.classList.toggle('active', pane.dataset.panel === target);
      });
    });
  });

  const chatPanel = document.getElementById('portfolio-chat-panel');
  const chatLauncher = document.querySelector('.chat-launcher');
  const chatClose = document.querySelector('.chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatPanel || !chatLauncher || !chatClose || !chatForm || !chatInput || !chatMessages) {
    return;
  }

  const answers = [
    {
      terms: ['current role', 'current job', 'job title', 'position', 'what does john do', 'who is john'],
      answer:
        'John Britto is a Team Lead at Global Connect Business Solutions. He leads AI-assisted engineering workflows and guides enterprise web application delivery.'
    },
    {
      terms: ['experience', 'career', 'work history', 'how many years', 'years of experience'],
      answer:
        'John has 7+ years of experience, progressing from web development roles into team leadership. His background includes enterprise platforms, full-stack development, REST APIs, IoT interfaces, and AI-enabled workflows.'
    },
    {
      terms: ['skills', 'technology', 'technologies', 'tech stack', 'framework', 'programming language', 'database'],
      answer:
        'His stack includes React, Vue, Angular, JavaScript, Laravel, CodeIgniter, PHP, Node.js, Python, FastAPI, REST APIs, MySQL, MongoDB, Supabase, Firebase, and AWS S3.'
    },
    {
      terms: ['artificial intelligence', ' ai ', 'llm', 'ollama', 'hugging face', 'claude', 'google ai', 'cursor'],
      answer:
        'John uses AI tools including Cursor, Claude AI, and Google AI Studio in engineering workflows. He also works with Ollama and Hugging Face models for local LLM automation.'
    },
    {
      terms: ['project', 'projects', 'built', 'developed'],
      answer:
        'His portfolio highlights Distributor Service Management (DSM), Data Management Systems (DMS), internal project-management platforms, Python/FastAPI services, Bluetooth-connected web interfaces, and an event-management platform for NIT Trichy.'
    },
    {
      terms: ['education', 'degree', 'study', 'college', 'mca', 'computer science'],
      answer:
        'John completed a Master of Computer Applications (MCA) in 2018 and a B.Sc. in Computer Science in 2015.'
    },
    {
      terms: ['contact', 'email', 'phone', 'reach', 'location', 'where is'],
      answer:
        'You can reach John at johnbritto4794@gmail.com or +91 95972 14250. He is based in Trichy, Tamil Nadu, India.'
    },
    {
      terms: ['hire', 'available', 'freelance', 'opportunity', 'work together'],
      answer:
        'The portfolio says John is available for product and engineering work. You can contact him at johnbritto4794@gmail.com to discuss an opportunity.'
    },
    {
      terms: ['leadership', 'team lead', 'manage', 'mentor', 'agile'],
      answer:
        'John leads agile engineering delivery, mentors cross-functional teams, and aligns architecture and sprint execution with business priorities.'
    }
  ];

  const normalize = (value) => ` ${value.toLowerCase().replace(/[^a-z0-9+#. ]/g, ' ')} `;

  const findAnswer = (question) => {
    const normalizedQuestion = normalize(question);
    let bestMatch = null;
    let bestScore = 0;

    answers.forEach((entry) => {
      const score = entry.terms.reduce((total, term) => {
        const normalizedTerm = normalize(term);
        return total + (normalizedQuestion.includes(normalizedTerm) ? normalizedTerm.trim().split(/\s+/).length : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    return bestMatch
      ? bestMatch.answer
      : 'I can answer questions based on the information on this portfolio. Try asking about John’s experience, skills, AI work, projects, education, or contact details.';
  };

  const addMessage = (message, className) => {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${className}`;
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const setChatOpen = (isOpen) => {
    chatPanel.hidden = !isOpen;
    chatLauncher.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      chatInput.focus();
    } else {
      chatLauncher.focus();
    }
  };

  chatLauncher.addEventListener('click', () => setChatOpen(chatPanel.hidden));
  chatClose.addEventListener('click', () => setChatOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !chatPanel.hidden) {
      setChatOpen(false);
    }
  });

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) {
      return;
    }

    addMessage(question, 'user-message');
    addMessage(findAnswer(question), 'assistant-message');
    chatForm.reset();
    chatInput.focus();
  });

  document.querySelectorAll('.chat-suggestions button').forEach((button) => {
    button.addEventListener('click', () => {
      chatInput.value = button.textContent.trim();
      chatForm.requestSubmit();
    });
  });
});
