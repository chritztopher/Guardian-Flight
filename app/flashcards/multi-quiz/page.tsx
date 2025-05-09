'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// TODO: Centralize this data or import from a shared location
const allCardData: { [key: string]: { id: number; question: string; answer: string; distractors?: string[]; }[] } = {
  'operational-concepts': [
    { 
      id: 1, 
      question: "What is mission command?", 
      answer: "empowering agile and adaptive leaders within the commanders intent",
      distractors: [
        "A centralized command structure focused on rigid adherence to plans.",
        "The specific orders given by a commander for a particular mission.",
        "A set of technologies used for battlefield communication and coordination."
      ] 
    },
    { 
      id: 2, 
      question: "What are the 5 principles of mission command and 1 bonus", 
      answer: "use MTO\'s, create shared understanding, exercise disciplined initiative, build mutual trust, accept prudent risk, bonus: provide clear commanders intent",
      distractors: [
        "Centralize control, issue detailed orders, enforce strict compliance, limit subordinate autonomy, manage all risks directly, bonus: maintain information secrecy.",
        "Focus on technology, achieve air superiority, maintain logistical dominance, ensure force protection, conduct rapid deployment, bonus: achieve information overload for the enemy.",
        "Understand the enemy, define clear objectives, mass combat power, ensure unity of effort, maintain high morale, bonus: conduct continuous reconnaissance."
      ]
    },
    { 
      id: 3, 
      question: "What are the five C\'s of mission command?", 
      answer: "capability, character, cohesion, competence, capacity",
      distractors: [
        "Command, Control, Communication, Computers, Collaboration",
        "Courage, Candor, Commitment, Consistency, Clarity",
        "Concept, Coordination, Contingency, Credibility, Consequence"
      ]
    },
    { 
      id: 4, 
      question: "What Air Force Doctrine covers Mission Command?", 
      answer: "AFDP 1-1",
      distractors: [
        "JP 3-0",
        "AFMAN 36-2203",
        "The Commander\'s Handbook on Mission Command"
      ]
    },
  ],
  'afforgen': [
    { 
      id: 1, 
      question: "what does AFFORGEN stand for?", 
      answer: "Air Force Force Generation",
      distractors: [
        "Allied Force Foreign Engagement Network",
        "Air Force Forward Readiness Generation",
        "Armed Forces General Equipment Nomenclature"
      ]
    },
    { 
      id: 2, 
      question: "What does AFFORGEN govern?", 
      answer: "how we are going to deploy our troops",
      distractors: [
        "The procurement process for new Air Force aircraft.",
        "The promotion criteria for Air Force officers.",
        "The rules of engagement for overseas operations."
      ]
    },
    { 
      id: 3, 
      question: "What are the 4 reasons for AFFORGEN?", 
      answer: "readiness, increase sustainability, reduce cost, enable a more predictable and sustainable force",
      distractors: [
        "enhance officer training, streamline command structures, improve inter-service communication, accelerate technology adoption",
        "increase global presence, shorten deployment cycles, maximize combat effectiveness, ensure rapid response capabilities",
        "standardize equipment, centralize resource allocation, improve pilot retention rates, modernize airbase infrastructure"
      ]
    },
    { 
      id: 4, 
      question: "What are the 4 phases of AFFORGEN?", 
      answer: "prepare, ready, available to commitment, reset",
      distractors: [
        "plan, train, deploy, return",
        "assess, equip, mobilize, sustain",
        "recruit, educate, assign, evaluate"
      ]
    },
  ],
  'jiim-nds': [
    { 
      id: 1, 
      question: "What does JIIM stand for", 
      answer: "Joint, interagency, intergovernmental, multinational",
      distractors: [
        "Justice, Intelligence, Integration, Mobilization",
        "Joint Information & Intelligence Manning",
        "Judicial, International, Interdependent, Mission-focused"
      ]
    },
    {
      id: 2,
      question: "What are the 9 principles of joint operations",
      answer: "Objective, offensive, mass, maneuver, economy of force, Unity of command, Security, Surprise, Simplicity, Bonus 3 (U.S. only) restraint, perseverance, legitimacy",
      distractors: [
        "Planning, intelligence, logistics, communication, firepower, mobility, leadership, coordination, assessment, Bonus: technology, speed, adaptability",
        "Deterrence, containment, intervention, stabilization, reconstruction, counter-terrorism, humanitarian aid, nation building, peacekeeping, Bonus: cyber defense, space control, information warfare",
        "Mission command, disciplined initiative, shared understanding, risk acceptance, commander\'s intent, mutual trust, agile leadership, adaptive capacity, continuous learning, Bonus: innovation, resourcefulness, ethical conduct"
      ]
    },
    { 
      id: 3, 
      question: "What does NDS stand for", 
      answer: "NDS (national defense strategy)",
      distractors: [
        "National Deployment System",
        "Nuclear Deterrence Strategy",
        "Naval Defense Services"
      ]
    },
    {
      id: 4,
      question: "what are the 4 defense priorities",
      answer: "defending the homeland, deter strategic attacks, deter aggression, build a resilient joint force",
      distractors: [
        "Expand global alliances, increase military spending, modernize nuclear arsenal, achieve technological superiority",
        "Counter violent extremism, combat drug trafficking, secure national borders, enhance cybersecurity measures",
        "Promote democratic values, ensure economic stability, provide humanitarian aid, lead international peacekeeping"
      ]
    },
    {
      id: 5,
      question: "What are the 7 instruments of National Power",
      answer: "Diplomacy, Information, Military, Economic, Financial, Intelligence, Law Enforcement",
      distractors: [
        "Culture, Technology, Education, Agriculture, Health, Environment, Transportation",
        "Legislative, Executive, Judicial, Regulatory, Industrial, Academic, Media",
        "Strategic, Operational, Tactical, Political, Social, Technological, Ideological"
      ]
    },
  ],
  'ace': [
    { 
      id: 1, 
      question: "What does ACE stand for?", 
      answer: "Agile Combat Employment",
      distractors: [
        "Airborne Command Element",
        "Advanced Combat Engineering",
        "Austere Combat Environment"
      ]
    },
    { 
      id: 2, 
      question: "What is ACE", 
      answer: "proactive and reactive scheme for survivability",
      distractors: [
        "A rapid deployment strategy for special operations forces.",
        "A specific type of fighter aircraft used for air superiority.",
        "The primary doctrine for cyber warfare operations."
      ]
    },
    {
      id: 3,
      question: "What are the 3 ACE enablers",
      answer: "expeditionary and mission ready airmen, mission command, tailorable force packages",
      distractors: [
        "Advanced stealth technology, global logistics network, superior airpower",
        "Rapid runway repair, secure communications, pre-positioned supplies",
        "Joint force integration, space-based assets, cyber dominance"
      ]
    },
    {
      id: 4,
      question: "how does ACE aim to complicate and negate adversary responses through its 5 core elements",
      answer: "set the theater, proactive maneuvers, reactive, joint massing, recover and sustain",
      distractors: [
        "Establish air superiority, deploy overwhelming force, conduct deep strikes, maintain information dominance, achieve rapid victory",
        "Deceive the enemy, disrupt communications, degrade logistics, disable command and control, demoralize opposing forces",
        "Fortify main operating bases, centralize command, rely on fixed infrastructure, follow pre-defined plans, minimize dispersal"
      ]
    },
  ],
  'jpp-jado': [
    { 
      id: 1, 
      question: "What does JPP stand for?", 
      answer: "Joint Planning Process",
      distractors: [
        "Joint Personnel Program",
        "Joint Procurement Protocol",
        "Joint Protection Plan"
      ]
    },
    {
      id: 2,
      question: "What are the 7 steps of JPP",
      answer: "planning initiation (president, SECDEF, CJCS), mission analysis (who, what, when , where, why ,how), course of action (COA) development, COA analysis and war-gaming, COA comparison, COA approval, Plan or order development",
      distractors: [
        "Intelligence gathering, threat assessment, resource allocation, strategy formulation, operational execution, post-conflict stabilization, lessons learned",
        "Requirements definition, concept exploration, system design, prototype development, testing and evaluation, production deployment, lifecycle sustainment",
        "Crisis recognition, diplomatic engagement, military option review, force mobilization, combat operations, conflict resolution, demobilization and reset"
      ]
    },
    { 
      id: 3, 
      question: "what does JADO stand for?", 
      answer: "JADO (joint all domain operations)",
      distractors: [
        "Joint Air Defense Organization",
        "Joint Advanced Development Office",
        "Joint Amphibious Doctrine Overview"
      ]
    },
    { 
      id: 4, 
      question: "What publication can we refer to for JADO", 
      answer: "AFDP 3-99",
      distractors: [
        "JP 5-0",
        "FM 6-0",
        "ADP 3-90"
      ]
    },
    {
      id: 5,
      question: "what is the goal of JADO?",
      answer: "Political and operational dilemmas for the enemy, observe, orient, decide and act in concert, enable convergence across domains",
      distractors: [
        "Achieve total information superiority, ensure zero-casualty engagements, shorten conflict duration significantly",
        "Maximize kinetic effects on target, centralize all operational control, reduce reliance on allied contributions",
        "Standardize allied military equipment, integrate all intelligence sources, automate all decision-making processes"
      ]
    },
    {
      id: 6,
      question: "What are the 4 fundamental topics in JADO?",
      answer: "why we fight, who we are, what we do, how we do it",
      distractors: [
        "Strategy, tactics, logistics, intelligence",
        "Air, land, sea, space domains",
        "Personnel, equipment, training, doctrine"
      ]
    },
    {
      id: 7,
      question: "What are the 8 JADO principles (MDFRIISC)",
      answer: "Mission command, Delegation, Flexibility and Versatility, Risk identification and mitigation, Information sharing, Integrate and multidomain planning, Synergistic effects, Concentration (on commander intent)",
      distractors: [
        "Centralized control, rigid adherence to plans, information restriction, sequential operations, domain segregation, independent actions, force protection, attritional warfare",
        "Objective, offensive, mass, maneuver, economy of force, unity of command, security, surprise",
        "Speed, agility, lethality, survivability, sustainability, interoperability, precision, adaptability"
      ]
    },
  ],
  'tactical-action': [
    { 
      id: 1, 
      question: "What are the 2 parts of Joint Forces Warfighter concept", 
      answer: "Unity of command (single commander for many goals), Unity of effort (multiple commanders under a common goal)",
      distractors: [
        "Chain of command (hierarchical authority structure), Span of control (number of subordinates a commander supervises)",
        "Rules of engagement (directives for combat), Commander\'s intent (desired end state)",
        "Force projection (ability to deploy forces globally), Force protection (measures to prevent harm to forces)"
      ]
    },
    { 
      id: 2, 
      question: "What are the 3 components of tactical action", 
      answer: "tactical, operational, strategic",
      distractors: [
        "Planning, execution, assessment",
        "Offense, defense, stability",
        "Air, land, maritime"
      ]
    },
    { 
      id: 3, 
      question: "What is Tactical Action (lowest level)", 
      answer: "The level where the conduct of battles and engagements seeks to achieve military objective assigned to Joint Force Commanders and Subordinate units.",
      distractors: [
        "The highest level of warfare where national policy and military strategy are determined.",
        "The bridge between strategy and tactics, focusing on campaign design and major operations.",
        "The process of developing detailed plans and orders for specific military missions."
      ]
    },
    { 
      id: 4, 
      question: "What is Operational (middle level)", 
      answer: "The level where the application of art links strategy and tactics through campaigns and operations",
      distractors: [
        "The level focused on individual battles and engagements to achieve specific objectives.",
        "The overarching level that defines national security objectives and allocates resources.",
        "The execution phase involving direct engagement with enemy forces using specific weapon systems."
      ]
    },
    { 
      id: 5, 
      question: "What is strategic action (high level)", 
      answer: "The level where national policy decisions are integrated into the development and promulgation of national defense and military strategies",
      distractors: [
        "The planning and execution of specific battles and engagements by military units.",
        "The coordination of campaigns and major operations to achieve theater-level objectives.",
        "The detailed logistical planning required to support forces in a deployed environment."
      ]
    },
    { 
      id: 6, 
      question: "What are the two types of crisis", 
      answer: "adversarial and non-adversarial",
      distractors: [
        "Military and civilian",
        "Internal and external",
        "Man-made and natural"
      ]
    },
  ],
};

interface Card {
    id: number;
    question: string;
    answer: string;
    topicId?: string;
    options: string[];
    distractors?: string[];
}

interface UserAnswers {
  [questionId: string]: string;
}

interface ReviewedQuestion {
  questionId: number;
  questionText: string;
  userAnswerText: string;
  correctAnswerText: string;
  isCorrect: boolean;
  options: string[]; // All options for this question
}

function MultiTopicFlashcardPageContent() {
  const searchParams = useSearchParams();
  const topicsParam = searchParams.get('topics');
  const questionCountParam = searchParams.get('count');

  const [allTopicsCards, setAllTopicsCards] = useState<Card[]>([]);
  const [currentQuizCards, setCurrentQuizCards] = useState<Card[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>('Multi-Topic Quiz');
  const [numQuestions, setNumQuestions] = useState(10); // Default
  const [reviewedQuestions, setReviewedQuestions] = useState<ReviewedQuestion[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Clear any existing errors on param change
    if (topicsParam) {
      const topicIds = topicsParam.split(',');
      let combinedCardsSetup: Card[] = [];
      let cardCounter = 1;
      const distinctTopicDisplayNames = new Set<string>(); // Use a Set for unique names
      const uniqueAnswers = new Set<string>();

      // First pass: Collect unique answers from all selected topics and unique topic display names
      topicIds.forEach(topicId => {
        const trimmedTopicId = topicId.trim();
        const topicCardsData = allCardData[trimmedTopicId];
        if (topicCardsData) {
          const displayName = trimmedTopicId.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' ');
          distinctTopicDisplayNames.add(displayName);

          topicCardsData.forEach(card => {
            uniqueAnswers.add(card.answer);
          });
        }
      });

      setAllTopicsCards([]);
      setCurrentQuizCards([]);
      setUserAnswers({});
      setScore(null);
      setShowResults(false);
      setReviewedQuestions([]); // Reset reviewed questions

      // Second pass: Build the cards for the quiz
      topicIds.forEach(topicId => {
        const trimmedTopicId = topicId.trim();
        const topicCardsData = allCardData[trimmedTopicId];
        if (topicCardsData) {
          combinedCardsSetup = combinedCardsSetup.concat(
            topicCardsData.map(card => {
              const correctAnswer = card.answer;
              let currentDistractors: string[];
              if (card.distractors && card.distractors.length > 0) {
                currentDistractors = shuffleArray(card.distractors);
              } else {
                // Fallback logic: uses uniqueAnswers collected from ALL selected topics in the first pass
                currentDistractors = [];
                const availableDistractors = Array.from(uniqueAnswers).filter(ans => ans !== correctAnswer);
                const shuffledAvailableDistractors = shuffleArray(availableDistractors);
                for (let i = 0; i < shuffledAvailableDistractors.length && currentDistractors.length < 3; i++) {
                  if (!currentDistractors.includes(shuffledAvailableDistractors[i])) {
                    currentDistractors.push(shuffledAvailableDistractors[i]);
                  }
                }
              }
              
              // Ensure exactly 3 distractors
              while (currentDistractors.length < 3) {
                currentDistractors.push(`Placeholder Distractor ${currentDistractors.length + 1}`);
              }
              if (currentDistractors.length > 3) {
                currentDistractors = currentDistractors.slice(0, 3);
              }

              return {
                ...card,
                id: cardCounter++,
                topicId: trimmedTopicId,
                options: shuffleArray([correctAnswer, ...currentDistractors])
              };
            })
          );
        }
      });
      
      setAllTopicsCards(shuffleArray(combinedCardsSetup));
      setCurrentQuizCards(shuffleArray(combinedCardsSetup));
      
      const displayNamesArray = Array.from(distinctTopicDisplayNames);
      if (displayNamesArray.length === 1) {
        setTopicTitle(displayNamesArray[0]);
      } else if (displayNamesArray.length > 1) {
        setTopicTitle('Multi-Topic Quiz');
      } else { 
        // This case should ideally be covered if topicsParam is empty or invalid,
        // leading to the 'No Topics Selected' title later.
        // However, as a fallback if distinctTopicDisplayNames is unexpectedly empty despite a topicsParam:
        setTopicTitle('Quiz'); 
      }
      
      setNumQuestions(questionCountParam ? parseInt(questionCountParam) : 10);
    } else {
      // Logic for when topicsParam is not present (e.g., direct navigation without params)
      setAllTopicsCards([]);
      setCurrentQuizCards([]);
      setUserAnswers({});
      setScore(null);
      setShowResults(false);
      setReviewedQuestions([]);
      setTopicTitle('No Topics Selected'); // Set a specific title for this case
      setError("No topics were selected for the quiz. Please go back to the main menu and choose topics.");
    }
    setIsLoading(false);
  }, [topicsParam, questionCountParam]);

  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId.toString()]: selectedOption }));
    setError(null); // Clear error when user makes a change
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length !== currentQuizCards.length) {
      setError("Hey Ding Dong, answer all the questions before submitting");
      return;
    }
    setError(null); // Clear error if submission is valid

    let currentScore = 0;
    const review: ReviewedQuestion[] = [];

    currentQuizCards.forEach(card => {
      const userAnswer = userAnswers[card.id.toString()];
      const isCorrect = userAnswer === card.answer;
      if (isCorrect) {
        currentScore++;
      }
      review.push({
        questionId: card.id,
        questionText: card.question,
        userAnswerText: userAnswer || "Not answered",
        correctAnswerText: card.answer,
        isCorrect: isCorrect,
        options: card.options,
      });
    });
    setScore(currentScore);
    setReviewedQuestions(review);
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({});
    setScore(null);
    setShowResults(false);
    setReviewedQuestions([]); // Reset reviewed questions
    setCurrentQuizCards(shuffleArray(allTopicsCards));
    setError(null); // Clear any errors
  };

  if (isLoading) {
    return <div className="app-container"><main className="flashcard-container"><p>Loading quiz...</p></main></div>;
  }

  if (!currentQuizCards || currentQuizCards.length === 0) {
    return (
      <div className="app-container">
        <header>
          <div className="logo-title">
            <div className="logo"></div>
            <h1>Guardian Flight</h1>
          </div>
          <div className="header-actions-right">
            <Link href="/main-menu" className="back-to-menu-button" passHref>
              Back to Main Menu
            </Link>
          </div>
        </header>
        <main className="flashcard-container">
          <p>No cards found for the selected topics or topics not specified.</p>
          <Link href="/main-menu">Go back to menu</Link>
        </main>
      </div>
    );
  }

  const allQuestionsAnswered = Object.keys(userAnswers).length === currentQuizCards.length;

  // Helper function to get the quote based on the score
  const getScoreQuote = (score: number, totalQuestions: number): string => {
    if (totalQuestions === 0) return ""; // Avoid division by zero
    const percentage = (score / totalQuestions) * 100;

    if (percentage < 50) {
      return "What are you part of warrior flight? Sgt Cervantes taught you better than that! Try again";
    } else if (percentage < 70) {
      return "So close, yet so far, China just won. Try again";
    } else if (percentage < 90) {
      return "You are a Guardian, a warrior, and a friend. Good Job.";
    } else {
      return "A true American hero in our midst, I salute you and congratulations on beating China";
    }
  };

  if (showResults) {
    const quote = getScoreQuote(score!, currentQuizCards.length);
    const scorePercentage = currentQuizCards.length > 0 ? Math.round((score! / currentQuizCards.length) * 100) : 0;

    return (
      <div className="quiz-results-container" style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))'
      }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: '1.2em', margin: '20px 0' }}>Your score: {scorePercentage}% ({score} / {currentQuizCards.length})</p>
        <p className="score-quote" style={{ fontSize: '1.1em', margin: '20px 0', fontStyle: 'italic' }}>&quot;{quote}&quot;</p>
        
        <div className="reviewed-questions-container" style={{
           marginTop: '30px', 
           textAlign: 'left',
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.25em', color: 'hsl(var(--foreground))' }}>Review Your Answers:</h3>
          {reviewedQuestions.map((reviewItem, index) => (
            <div key={reviewItem.questionId} className="reviewed-question-item" style={{ 
                marginBottom: '15px', 
                padding: '15px', 
                border: `1px solid hsl(var(--border))`,
                borderRadius: `var(--radius)`,
                backgroundColor: `hsl(var(--card))`,
                color: `hsl(var(--card-foreground))`
            }}>
              <p style={{ margin: '0 0 10px 0' }}><strong>Question {index + 1}:</strong> {reviewItem.questionText}</p>
              <p style={{
                margin: '0',
                color: reviewItem.isCorrect ? 'hsl(145, 63%, 49%)' : 'hsl(0, 72%, 51%)', /* Softer Green / Red */
                fontWeight: '500'
              }}>
                Your answer: {reviewItem.userAnswerText} 
                {!reviewItem.isCorrect && <span style={{ color: `hsl(var(--muted-foreground))` }}> (Correct: {reviewItem.correctAnswerText})</span>}
              </p>
              {/* Optional: Display all options and highlight choices - styles would also need adjustment here */}
            </div>
          ))}
        </div>

        <div className="quiz-actions" style={{ marginTop: '30px' }}>
          <button onClick={handleTryAgain} className="quiz-button" style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            border: `1px solid hsl(var(--border))`,
            padding: '10px 20px',
            borderRadius: `var(--radius)`,
            cursor: 'pointer',
            fontSize: '1em',
            marginRight: '10px'
          }}>
            Try Again with Same Topics
          </button>
          {/* Add other actions like "Back to Main Menu" if needed, styled similarly */}
          <Link href="/main-menu" passHref className="back-to-menu-button" style={{
            display: 'inline-block', // Ensure proper rendering next to button
            backgroundColor: 'hsl(var(--secondary))',
            color: 'hsl(var(--secondary-foreground))',
            // border: `1px solid hsl(var(--border))` is already in globals.css, but can be explicit
            // padding: '10px 20px', // from globals.css
            // borderRadius: `var(--radius)`, // from globals.css
            // textDecoration: 'none', // from globals.css
            // fontSize: '1em' // from globals.css for consistency, or adjust
          }}>
            Back to Main Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo-title">
          <div className="logo"></div>
          <h1>Guardian Flight - {topicTitle}</h1>
        </div>
        <div className="header-actions-right">
          <Link href="/main-menu" className="back-to-menu-button" passHref>
            Back to Main Menu
          </Link>
        </div>
      </header>
      
      <main className="main-quiz-content" style={{ padding: '20px', overflowY: 'auto', flexGrow: 1 }}>
        {currentQuizCards.map((card, index) => (
          <div key={card.id} className="quiz-question-item" style={{ marginBottom: '30px', padding: '15px', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}>
            <h3 style={{ marginBottom: '10px' }}>Question {index + 1}:</h3>
            <div className="question-text" style={{ marginBottom: '15px' }}>
              {card.question.split('\n').map((line, i) => (
                <p key={i} style={{ whiteSpace: 'pre-wrap', margin: '0 0 5px 0' }}>{line}</p>
              ))}
            </div>
            <div className="options-group">
              {card.options.map(option => (
                <label key={option} style={{ display: 'block', margin: '5px 0', padding: '8px', border: '1px solid transparent', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={`question-${card.id}`}
                    value={option}
                    checked={userAnswers[card.id.toString()] === option}
                    onChange={() => handleAnswerChange(card.id, option)}
                    style={{ marginRight: '10px' }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          {error && <p style={{ color: 'hsl(0, 72%, 51%)', marginBottom: '15px', fontWeight: '500' }}>{error}</p>}
          <button 
            onClick={handleSubmitQuiz} 
            // disabled={!allQuestionsAnswered} // We now handle this via the error message
            className="quiz-now-button" 
            style={{ padding: '10px 20px', fontSize: '1.1em' }}
          >
            Submit Quiz
          </button>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

// Wrap with Suspense because useSearchParams() needs it for static rendering
export default function MultiTopicFlashcardPage() {
    return (
        <Suspense fallback={<div>Loading topics...</div>}>
            <MultiTopicFlashcardPageContent />
        </Suspense>
    );
} 