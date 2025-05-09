'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const topics = [
  { id: 'operational-concepts', name: 'Operational Concepts' },
  { id: 'afforgen', name: 'AFFORGEN' },
  { id: 'jiim-nds', name: 'JIIM/NDS' },
  { id: 'ace', name: 'ACE' },
  { id: 'jpp-jado', name: 'JPP/JADO' },
  { id: 'tactical-action', name: 'Tactical Action' },
];

export default function MainMenuPage() {
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  const toggleTopicSelection = (topicId: string) => {
    setSelectedTopics((prevSelected) =>
      prevSelected.includes(topicId)
        ? prevSelected.filter((id) => id !== topicId)
        : [...prevSelected, topicId]
    );
  };

  const handleQuizNow = () => {
    if (selectedTopics.length > 0) {
      const topicsQueryParam = selectedTopics.join(',');
      router.push(`/flashcards/multi-quiz?topics=${topicsQueryParam}`);
    }
  };

  const handleReviewFlashcards = () => {
    if (selectedTopics.length === 1) {
      const firstSelectedTopicId = selectedTopics[0];
      router.push(`/flashcards/${firstSelectedTopicId}`);
    } else if (selectedTopics.length > 1) {
      const topicsQueryParam = selectedTopics.join(',');
      router.push(`/flashcards/review?topics=${topicsQueryParam}`);
    } else {
      // Optionally, handle the case where no topics are selected, though the button
      // should ideally not be visible or enabled in this state.
      // For now, do nothing if no topics are selected and button is somehow clicked.
    }
  };

  if (isLoading) {
    return (
      <div className="app-container menu-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container menu-container">
      <header>
        <div className="logo-title">
          <div className="logo"></div>
          <h1>Guardian Flight</h1>
        </div>
      </header>

      <main className="main-menu-content">
        <h2>Select Topics</h2>
        <p className="menu-info-text">You may choose more than one topic to quiz on</p>
        <ul className="topic-list">
          {topics.map(topic => (
            <li key={topic.id} className="topic-list-item">
              <button
                onClick={() => toggleTopicSelection(topic.id)}
                className={`topic-link ${selectedTopics.includes(topic.id) ? 'topic-link-selected' : ''}`}
              >
                {topic.name}
              </button>
            </li>
          ))}
        </ul>

        {selectedTopics.length > 0 && (
          <div className="quiz-now-button-container">
            <button onClick={handleQuizNow} className="quiz-now-button">
              Quiz Now!
            </button>
            <button onClick={handleReviewFlashcards} className="quiz-now-button" style={{ marginLeft: '10px' }}>
              Review Flashcards
            </button>
          </div>
        )}
      </main>

      <footer>
        <p style={{ textAlign: 'center', padding: '20px', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
          developed by SrA Giroux with equal parts air power and guardianship
        </p>
      </footer>
    </div>
  );
} 