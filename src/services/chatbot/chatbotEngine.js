export function buildChatResponse({ query, language = 'en', sentiment = 'neutral' }) {
  const emergency = /chest pain|cannot breathe|suicidal/i.test(query);
  return {
    language,
    sentiment,
    emergencyEscalation: emergency,
    guardrails: ['No diagnosis', 'Seek clinician for urgent concerns'],
    answer: emergency
      ? 'Emergency keywords detected. Please contact emergency services immediately.'
      : 'This assistant provides educational support only and is not a diagnosis.'
  };
}
