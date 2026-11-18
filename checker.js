(function (root) {
  function audit(input) {
    if (!input || !Array.isArray(input.sources) || !Array.isArray(input.claims)) throw new Error('sources and claims must be arrays');
    const ids = new Set();
    const sources = new Map();
    for (const source of input.sources) {
      if (!source || typeof source.id !== 'string' || !source.id.trim() || typeof source.text !== 'string' || ids.has(source.id)) throw new Error('Each source needs a unique non-empty id and text');
      ids.add(source.id);
      sources.set(source.id, source.text);
    }
    const rows = input.claims.map((claim, index) => {
      if (!claim || typeof claim.text !== 'string' || !claim.text.trim() || !Array.isArray(claim.citations)) throw new Error('Each claim needs text and a citations array');
      const citations = [...new Set(claim.citations)];
      if (citations.some(c => typeof c !== 'string')) throw new Error('Citation ids must be strings');
      const missing = citations.filter(id => !sources.has(id));
      const evidence = citations.filter(id => sources.has(id)).map(id => sources.get(id)).join(' ');
      const numbers = text => [...text.matchAll(/\b\d+(?:\.\d+)?\b/g)].map(m => m[0]);
      const unsupportedNumbers = [...new Set(numbers(claim.text))].filter(n => !numbers(evidence).includes(n));
      const flags = [];
      if (!citations.length) flags.push('No citations');
      if (missing.length) flags.push('Unknown sources: ' + missing.join(', '));
      if (unsupportedNumbers.length) flags.push('Numbers absent from cited evidence: ' + unsupportedNumbers.join(', '));
      if (citations.length && !evidence.trim()) flags.push('Empty evidence');
      return {index: index + 1, text: claim.text, citations, evidence, flags, status: flags.length ? 'review' : 'contract-pass'};
    });
    return {total: rows.length, review: rows.filter(r => r.status === 'review').length, rows};
  }
  if (typeof module !== 'undefined') module.exports = {audit};
  root.RagPreflight = {audit};
})(typeof window !== 'undefined' ? window : globalThis);
