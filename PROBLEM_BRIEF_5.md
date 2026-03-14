# Problem Brief

_Shared control document for user, Orchestrator, and Workers._

This file is optimized for the following competition workflow:

```text
0. User preloads ORCHESTRATOR.md
1. User gives Orchestrator the full problem statement and screenshots
2. User assigns Workers and immediately starts them with problem data + this file + WORKER_PROMPT.md
3. User fills or relays §4 Worker Partition Table to Orchestrator
4. Orchestrator skims representative samples while Workers continue processing
5. Orchestrator writes one mid-run update in §5
6. User relays §5 to Workers
7. Workers finish result JSON files
8. Orchestrator merges outputs by task in §6
9. User submits the final answers
```

---

## §0. Basic Info

- `problem_id`: 5
- `time_limit_minutes`: 15
- `data_location`: single newspaper image set provided in chat (`Image #1`), 4-page 1906 newspaper scan
- `num_tasks`: 5
- `submission_format_summary`: Q1/Q2/Q4 are multiple choice single answers; Q3 requires 2 numeric answers (`통`, `호`); Q5 requires 3 numeric answers (donation amount in 원, clinic hours in 시간, subscription+post total in 전)

---

## §1. Problem Description

Workers must solve 5 questions using only the provided 1906 newspaper image. The image mixes historically plausible content with intentionally manipulated items. The objective is to locate the relevant article, notice, ad, or date panel for each question and extract the submission-safe answer directly from the page. Do not use outside history knowledge except when the page itself explicitly presents the comparison target; prioritize exact page evidence, location notes, and low-speculation outputs.

---

## §2. Task Registry

Task 1
- prompt: In the Incheon port import-goods ad section, identify the manipulated item that is clearly out of period.
- answer target: One choice among the provided options.
- answer format: Exact option text as a string.
- special cautions: Use only items actually visible in the ad section; do not answer from generic modernity assumptions alone.

Task 2
- prompt: Find what principal Kim Junghwan of private Boseong School is reported to establish.
- answer target: One choice among the provided options.
- answer format: Exact option text as a string.
- special cautions: Confirm the person name and the establishment phrase from the article text.

Task 3
- prompt: Find the residence address of Choe Myeong-gu, who lost a mule, and extract `통` and `호`.
- answer target: Two numeric fields.
- answer format: Separate numeric answers for `통` and `호`.
- special cautions: Distinguish address numbers from other nearby numbers; preserve only the final `통` and `호` values.

Task 4
- prompt: On page 1 date notation, five era/year labels are shown together; identify which era label has the wrong year.
- answer target: One choice among the provided options.
- answer format: Exact option text as a string.
- special cautions: Read the printed date panel carefully; this task is about the page's own year labeling, not external historical reconstruction beyond that comparison.

Task 5
- prompt: Extract three factual numeric answers from article/ads: donation amount from Yi In-yong to Jeong Mun-seong, Edward the dentist's regular office hours excluding break time, and the total of 6-month newspaper fee plus mailed delivery/postage.
- answer target: Three numeric values.
- answer format: `q5_1` integer in 원, `q5_2` integer in 시간, `q5_3` integer in 전.
- special cautions: For q5_2 and q5_3, keep a calculation trace; verify units before finalizing.

---

## §3. Output Schema

Each Worker writes one JSON file for its assigned partition.

Competition schema for this problem:

```json
[
  {
    "task": 1,
    "id": "q1",
    "answer": null,
    "evidence": "",
    "location": "",
    "confidence": "medium",
    "flag": null
  }
]
```

Rules:
- `task`: task number from §2
- `id`: atomic answer identifier such as `q1`, `q2`, `q3_tong`, `q3_ho`, `q4`, `q5_1`, `q5_2`, `q5_3`
- `answer`: final answer in submission-safe form; may be boolean, string, number, array, or `null`
- `evidence`: short direct transcription or paraphrase anchor from the page
- `location`: coarse page location such as `1면 좌상단`, `4면 우측 광고란`
- `confidence`: one of `high`, `medium`, `low`
- `flag`: `null` when normal, short reason string when unresolved
- optional `calculation`: include only when arithmetic is required (`q5_2`, `q5_3`)
- duplicate `(task, id)` pairs are not allowed
- output files must use `Result_<Worker>_5.json`
- keep output compact; no prose outside the JSON array

---

## §4. Worker Partition Table

_User-maintained. Each Worker handles only its own row._

| Worker | Task(s) | Assigned Range | Output File | Status | Notes |
|--------|---------|----------------|-------------|--------|-------|
| A | 1, 2 | entire image; ads + school-related article scan | Result_A_5.json | 대기 | return `q1`, `q2`; exact option text only |
| B | 3 | entire image; lost mule / notice / short classified scan | Result_B_5.json | 대기 | return `q3_tong`, `q3_ho`; numbers only |
| C | 5 | entire image; donation article + dentist ad + subscription/postage notice | Result_C_5.json | 대기 | return `q5_1`, `q5_2`, `q5_3`; include `calculation` for q5_2/q5_3 |
| D | 4 | entire image; page 1 date panel, then cross-check flagged outputs if available | Result_D_5.json | 대기 | return `q4`; after that, verify low-confidence or flagged items from A/B/C |

Guidance:
- assign by task, folder, file range, or a mixed rule
- balance by difficulty, not just item count
- if a Worker is solving only one task, state it explicitly
- if a Worker is solving a subset of files for one task, state both the task and range
- use `Notes` for worker-specific cautions

---

## §5. Mid-Run Update From Orchestrator

Update v1
- Global:
  - Use only printed newspaper evidence. Do not justify answers from outside history knowledge unless the page itself gives the comparison basis.
  - Always return a coarse page location with each answer. Use `1면` to `4면` plus area notes such as `좌상단`, `우측 광고란`, `하단 고지`.
  - When text is ambiguous, keep the best reading in `answer` only if one reading is clearly stronger; otherwise leave `answer` null and explain briefly in `flag`.
- Task 1:
  - The import-goods clue appears in the illustrated ad-heavy area, not the long article columns. Prioritize the ad cluster on the lower-right page.
  - Match the final answer to the provided option text, but confirm that the named item is actually printed in the ad section before selecting it.
- Task 2:
  - Focus on a short school-related notice/article rather than decorative ads. Confirm both `김중환` and the establishment phrase in the same item.
- Task 3:
  - The needed output is specifically `통` and `호`. Ignore other numbers unless they are explicitly part of the residence address.
- Task 4:
  - This is a header/date-panel task. Read the page 1 masthead/date block first and compare the five printed era/year labels against each other.
- Task 5:
  - q5_2 and q5_3 must include a `calculation` field.
  - q5_2 is asking for working hours excluding break time, so do not copy raw opening hours without subtracting rest time if a break is shown.
  - q5_3 should separate subscription fee and mailed delivery/postage first, then sum them in `전`.

---

## §6. Final Answer

_Orchestrator fills this after all Worker outputs are complete._

Result files:
- Result_A_5.json
- Result_B_5.json
- Result_C_5.json
- Result_D_5.json

Task-by-task merged answers:

Task 1

```json

```

Task 2

```json

```

If there are more tasks, continue the same structure until Task `N`.
