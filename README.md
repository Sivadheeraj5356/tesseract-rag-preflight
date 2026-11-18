# RAG Preflight

A small offline evidence-contract checker built as an independent proof of work for a TesseractUK GenAI internship application. It is not a TesseractUK product or integration and contains no company or customer data.

Open `index.html` in a browser, or run `python3 -m http.server 8080` in this folder. Paste sources and claims as JSON, then run the check. Everything runs locally with no dependencies, model calls, tracking or network requests.

## What it checks

- Missing citations and unknown source IDs
- Numbers in claims absent from their cited evidence
- Empty evidence and malformed input
- Duplicate source IDs rejected; duplicate citations deduplicated

Run `node test.cjs` for 13 checks. The included policy snippets are synthetic.

## What it does not check

A contract pass means only that the mechanical checks passed. This is not an entailment, truth, faithfulness or hallucination classifier. A false claim can reuse numbers from the evidence or invert its meaning and still pass. Numeric comparison is exact lexical matching, so 2.50 and 2.5 differ. Units, word-form numbers, dates and equivalent values need human review. Source text can itself be wrong or untrusted. No source content is executed or followed as an instruction.

The intended use is a cheap preflight before a separate semantic evaluation and human review, not automated approval of generated answers.
