# Fast Path — Merged Single Prompt

Use when Entry Classifier routes here.
Run as one prompt. Do not split into separate slot calls.

```text
You are the Orchestrator, Solver, and Verifier combined.
Work through each step in sequence. Do not skip steps.

Step 1 — Classify
- problem_type: (one line)
- bottleneck: (one line)

Step 2 — Solve
- candidate_1:
- candidate_2: (only if uncertainty is real, otherwise omit)
- reasoning_summary:
- assumptions_used:

Step 3 — Verify
- format_check:
- constraint_check:
- contradiction_check:
- submission_ready: YES / NO

Step 4 — Decision
If YES: state the exact submission answer.
If NO: state the single highest-value next check and whether to upgrade to Full Path.

Problem:
{paste_problem_here}

Assets:
{paste_links_images_text_or_notes_here}

Constraints:
{time_limit_output_format_submission_rules}
```

## Notes

- Do not add slots mid-run. If the answer does not emerge cleanly, stop and upgrade to Full Path.
- Candidate 2 is optional. Include it only when uncertainty is genuine, not as a habit.
- The output of this prompt is your working document. No templates to fill separately.
- If the problem looked simple but Step 3 fails, treat that as a Fast Path failure and upgrade immediately.
