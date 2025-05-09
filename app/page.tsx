'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';

const topics = [
  { id: 'operational-concepts', name: 'Operational Concepts' },
  { id: 'afforgen', name: 'AFFORGEN' },
  { id: 'jiim-nds', name: 'JIIM/NDS' },
  { id: 'ace', name: 'ACE' },
  { id: 'jpp-jado', name: 'JPP/JADO' },
  { id: 'tactical-action', name: 'Tactical Action' },
];

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in (e.g. page refresh), redirect to main menu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('isLoggedIn') === 'true') {
        router.push('/main-menu');
      }
    }
  }, [router]);

  const handleLogin = () => {
    if (password === "woof") { // Password is now just woof
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('isLoggedIn', 'true');
      }
      router.push('/main-menu');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword(''); // Clear password field
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px', padding: '30px', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px hsla(var(--foreground), 0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '90%', padding: '12px', marginBottom: '20px', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--input))', color: 'white' }}
        />
        {error && <p style={{ color: 'hsl(var(--destructive)) /* Assuming --destructive is red */', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}
        <button
          onClick={handleLogin}
          style={{ width: '90%', padding: '12px', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '1rem' }}
        >
          Enter
        </button>
        <p style={{ textAlign: 'center', marginTop: '30px', fontStyle: 'italic', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
          "We are not what we know but what we are willing to learn."
        </p>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
        {/* For development: Password is "'woof'" (including the single quotes) */}
      </footer>
    </div>
  );
} 