'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// Copied from multi-quiz/page.tsx - TODO: Centralize
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Copied from multi-quiz/page.tsx - TODO: Centralize
// IMPORTANT: Ensure this is the same data source used by other components
const allCardData: { [key: string]: { id: number; question: string; answer: string; }[] } = {
  'operational-concepts': [
    { id: 1, question: "What is mission command?", answer: "empowering agile and adaptive leaders within the commanders intent" },
    { id: 2, question: "What are the 5 principles of mission command and 1 bonus", answer: "use MTO's, create shared understanding, exercise disciplined initiative, build mutual trust, accept prudent risk, bonus: provide clear commanders intent" },
    { id: 3, question: "What are the five C's of mission command?", answer: "capability, character, cohesion, competence, capacity" },
    { id: 4, question: "What Air Force Doctrine covers Mission Command?", answer: "AFDP 1-1" },
  ],
  'afforgen': [
    { id: 1, question: "what does AFFORGEN stand for?", answer: "Air Force Force Generation" },
    { id: 2, question: "What does AFFORGEN govern?", answer: "how we are going to deploy our troops" },
    { id: 3, question: "What are the 4 reasons for AFFORGEN?", answer: "1. readiness\n2. increase sustainability\n3. reduce cost\n4. enable a more predictable and sustainable force" },
    { id: 4, question: "What are the 4 phases of AFFORGEN?", answer: "1. prepare\n2. ready\n3. available to commitment\n4. reset" },
  ],
  'jiim-nds': [
    { id: 1, question: "What does JIIM stand for", answer: "Joint, interagency, intergovernmental, multinational" },
    { id: 2, question: "What are the 9 principles of joint operations", answer: "Objective, offensive, mass, maneuver, economy of force, Unity of command, Security, Surprise, Simplicity\nBonus 3 (U.S. only) restraint, perseverance, legitimacy" },
    { id: 3, question: "What does NDS stand for", answer: "NDS (national defense strategy)" },
    { id: 4, question: "what are the 4 defense priorities", answer: "1. defending the homeland\n2. deter strategic attacks\n3. deter aggression\n4. build a resilient joint force" },
    { id: 5, question: "What are the 7 instruments of National Power", answer: "1. Diplomacy\n2. Information\n3. Military\n4. Economic\n5. Financial\n6. Intelligence\n7. Law Enforcement" },
  ],
  'ace': [
    { id: 1, question: "What does ACE stand for?", answer: "Agile Combat Employment" },
    { id: 2, question: "What is ACE", answer: "proactive and reactive scheme for survivability" },
    { id: 3, question: "What are the 3 ACE enablers", answer: "expeditionary and mission ready airmen, mission command, tailorable force packages" },
    { id: 4, question: "how does ACE aim to complicate and negate adversary responses through its 5 core elements", answer: "set the theater, proactive maneuvers, reactive, joint massing, recover and sustain" },
  ],
  'jpp-jado': [
    { id: 1, question: "What does JPP stand for?", answer: "Joint Planning Process" },
    { id: 2, question: "What are the 7 steps of JPP", answer: "1. planning initiation (president, SECDEF, CJCS)\n2. mission analysis (who, what, when , where, why ,how)\n3. course of action (COA) development\n4. COA analysis and war-gaming\n5. COA comparison\n6. COA approval\n7. Plan or order development" },
    { id: 3, question: "what does JADO stand for?", answer: "JADO (joint all domain operations)" },
    { id: 4, question: "What publication can we refer to for JADO", answer: "AFDP 3-99" },
    { id: 5, question: "what is the goal of JADO?", answer: "1. Political and operational dilemmas for the enemy\n2. observe, orient, decide and act in concert\n3. enable convergence across domains" },
    { id: 6, question: "What are the 4 fundamental topics in JADO?", answer: "why we fight\nwho we are\nwhat we do\nhow we do it" },
    { id: 7, question: "What are the 8 JADO principles (MDFRIISC)", answer: "1. Mission command\n2. Delegation\n3. Flexibility and Versatility\n4. Risk identification and mitigation\n5. Information sharing\n6. Integrate and multidomain planning\n7. Synergistic effects\n8. Concentration (on commander intent)" },
  ],
  'tactical-action': [
    { id: 1, question: "What are the 2 parts of Joint Forces Warfighter concept", answer: "Unity of command (single commander for many goals)\nUnity of effort (multiple commanders under a common goal)" },
    { id: 2, question: "What are the 3 components of tactical action", answer: "tactical, operational, strategic" },
    { id: 3, question: "What is Tactical Action (lowest level)", answer: "The level where the conduct of battles and engagements seeks to achieve military objective assigned to Joint Force Commanders and Subordinate units." },
    { id: 4, question: "What is Operational (middle level)", answer: "The level where the application of art links strategy and tactics through campaigns and operations" },
    { id: 5, question: "What is strategic action (high level)", answer: "The level where national policy decisions are integrated into the development and promulgation of national defense and military strategies" },
    { id: 6, question: "What are the two types of crisis", answer: "adversarial and non-adversarial" },
  ],
};

interface Card {
  id: number; // Global ID for the combined list
  question: string;
  answer: string;
  originalTopicId?: string; // Keep track of where the card came from
  originalCardId?: number; // Original ID within its topic
}

function MultiTopicReviewPageContent() {
  const searchParams = useSearchParams();
  const topicsParam = searchParams.get('topics');

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('slide-in-from-right');
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [topicTitle, setTopicTitle] = useState<string>('Multi-Topic Review');

  useEffect(() => {
    setIsLoading(true);
    if (topicsParam) {
      const topicIds = topicsParam.split(',');
      let combinedCardsSetup: Card[] = [];
      let globalCardIdCounter = 1;
      const distinctTopicDisplayNames = new Set<string>();

      topicIds.forEach(topicId => {
        const trimmedTopicId = topicId.trim();
        const topicCardsData = allCardData[trimmedTopicId];
        if (topicCardsData) {
          const displayName = trimmedTopicId.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' ');
          distinctTopicDisplayNames.add(displayName);

          topicCardsData.forEach(card => {
            combinedCardsSetup.push({
              ...card,
              id: globalCardIdCounter++, // Assign a new unique ID for the combined list
              originalTopicId: trimmedTopicId,
              originalCardId: card.id,
            });
          });
        }
      });
      
      setCards(shuffleArray(combinedCardsSetup));
      setTopicTitle(Array.from(distinctTopicDisplayNames).length > 0 ? Array.from(distinctTopicDisplayNames).join(' & ') : 'Review');
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setAnimationClass('slide-in-from-right');
    } else {
      setCards([]); // No topics selected or param missing
      setTopicTitle('No Topics Selected');
    }
    setIsLoading(false);
  }, [topicsParam]);

  const handleNextCard = () => {
    if (cards.length === 0) return;
    setAnimationClass('slide-out-to-left');
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
      setAnimationClass('slide-in-from-right');
      setIsFlipped(false);
    }, 200);
  };

  const handlePrevCard = () => {
    if (cards.length === 0) return;
    setAnimationClass('slide-out-to-right');
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
      setAnimationClass('slide-in-from-left');
      setIsFlipped(false);
    }, 200);
  };

  const handleShuffleClick = () => {
    if (cards.length === 0) return;
    setIsShuffling(true);
    // Create a new shuffled array from the original set of cards to avoid re-shuffling an already shuffled deck
    // This assumes 'cards' holds the current, possibly shuffled, full deck from useEffect.
    // For a true re-shuffle from original combined cards, you might need to re-run part of useEffect logic
    // or store the initially combined (but unshuffled) cards separately.
    // For simplicity here, we re-shuffle the current 'cards' state.
    const shuffled = shuffleArray([...cards]); 
    
    setTimeout(() => {
      setAnimationClass('slide-out-to-left'); // Or any other animation
      setTimeout(() => {
        setCards(shuffled);
        setCurrentCardIndex(0);
        setAnimationClass('slide-in-from-right');
        setIsFlipped(false);
        setIsShuffling(false);
      }, 200);
    }, 300); // Duration for "shuffling" visual feedback if any
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoading) {
    return <div className="app-container"><main className="flashcard-container"><p>Loading review session...</p></main></div>;
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="app-container">
        <header>
          <div className="logo-title">
            <div className="logo" />
            <h1>Guardian Flight - Review</h1>
          </div>
          <div className="header-actions-right">
            <Link href="/main-menu" className="back-to-menu-button" passHref>
              Back to Main Menu
            </Link>
          </div>
        </header>
        <main className="flashcard-container">
          <p>No cards found for the selected topics, or no topics specified for review.</p>
          <Link href="/main-menu">Go back to menu</Link>
        </main>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="app-container">
      <header>
        <div className="logo-title">
          <div className="logo" />
          <h1>Guardian Flight</h1> 
        </div>
        <div className="header-actions-right">
          <Link href="/main-menu" className="back-to-menu-button" passHref>
            Back to Main Menu
          </Link>
        </div>
      </header>

      <div className="card-info">
        <span>{currentCardIndex + 1} / {cards.length}</span> 
        <span>{topicTitle}</span>
      </div>

      <main className="flashcard-container">
        <button className="nav-button side-nav-button prev-button" onClick={handlePrevCard} title="Previous card" disabled={cards.length === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        
        <div className={`flashcard ${animationClass}`} key={currentCard.id + animationClass + (currentCard.originalTopicId || '')}>
          <div 
            className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`} 
            onClick={handleFlip} 
            style={{ cursor: 'pointer' }}
          >
            <div className="flashcard-front">
              <div className="card-content">
                <div> 
                  {currentCard.question.split('\n').map((line, index) => (
                    <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flip-indicator">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                 </svg>
                 <span>click card to flip</span>
              </div>
            </div>
            <div className="flashcard-back">
              <div className="card-content">
                <div>
                  {currentCard.answer.split('\n').map((line, index) => (
                      <p key={index} style={{ whiteSpace: 'pre-wrap' }}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flip-indicator">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                 </svg>
                 <span>click card to flip</span>
              </div>
            </div>
          </div>
        </div>

        <button className="nav-button side-nav-button next-button" onClick={handleNextCard} title="Next card" disabled={cards.length === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="flashcard-controls-bottom">
          <div className="playback-buttons">
            <button 
              className={`shuffle-button ${isShuffling ? 'shuffle-button--animating' : ''}`}
              onClick={handleShuffleClick}
              title="Shuffle the cards into a new order"
              disabled={isShuffling || cards.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <footer>
        {/* Optional: Footer content specific to review page */}
      </footer>
    </div>
  );
}

export default function MultiTopicReviewPage() {
  return (
    <Suspense fallback={<div className="app-container"><main className="flashcard-container"><p>Loading review topics...</p></main></div>}>
      <MultiTopicReviewPageContent />
    </Suspense>
  );
} 