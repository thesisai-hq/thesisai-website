'use client';

import { FormEvent, useState } from 'react';
import posthog from 'posthog-js';
import { trackWebEvent } from './track';

interface WaitlistFormProps {
  source: string;
}

export default function WaitlistForm({ source }: WaitlistFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hasIOS, setHasIOS] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail) {
      setError('Please enter your name and email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          hasIOS,
          source,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Something went wrong. Please try again.');
      }

      trackWebEvent('waitlist_submit', {
        source,
        hasIOS,
      });
      posthog.capture('waitlist_submitted', {
        source,
        has_ios: hasIOS,
        email: cleanEmail,
      });

      setSubmitted(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }

  };

  if (submitted) {
    return (
      <div className="waitlist-success" role="status">
        <strong>You’re on the list.</strong>
        <p>
          Thanks for joining. We send TestFlight invites in waves to match active MVP testing capacity.
        </p>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit}>
      <div className="field-grid">
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={hasIOS}
          onChange={(event) => setHasIOS(event.target.checked)}
        />
        <span>I have an iPhone and can test through TestFlight.</span>
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="cta" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Requesting…' : 'Request iOS TestFlight Access'}
      </button>
    </form>
  );
}
