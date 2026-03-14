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

- `problem_id`: `freerider_detection_team_project`
- `time_limit_minutes`: 15
- `data_location`: `D:\OneDrive\바탕 화면\Life_System\00_Inbox\ai_top_100_campus_freerider`
- `num_tasks`: 6
- `submission_format_summary`: 6 single-choice answers. Q1-Q5 choose one provided option per question. Q6 choose the one team name that has no weekday 1-hour common offline meeting slot.

---

## §1. Problem Description

Dataset consists of per-team KakaoTalk conversation screenshots/logs plus presentation files (draft/final) and a scoring formula file. Goal is to identify contribution patterns and freeriders across Team_A~Team_D. Main traps: duplicate chat content across screenshots, screenshots may come from multiple participants, and several questions require combining chat evidence with document comparison rather than reading chats alone.

---

## §2. Task Registry

List each task separately.
This section is critical because a single problem may contain multiple tasks.

Use this template:

```text
Task 1
- prompt: Count late-night messages in Team_A chat by member.
- answer target: Per-member counts for messages sent from 00:00 through 05:59 inclusive.
- answer format: Choose one of the provided count triples for 철수/영희/민수.
- special cautions: Deduplicate overlapping screenshots; use message timestamps only; 06:00+ is not late-night.

Task 2
- prompt: Extract Team_A deadline/work promises and compute fulfillment rate by member.
- answer target: For each member, fulfilled promises / total promises based on declared role or deadline commitments and on-time delivery evidence.
- answer format: Choose one of the provided fulfillment-rate triples for 철수/영희/민수.
- special cautions: Late completion still counts as failure; only explicit promise-like statements count; verify delivery in chat/files.

Task 3
- prompt: Score Team_A PPT contribution from chat plus draft/final presentation comparison.
- answer target: Per-member PPT contribution score using rubric: draft owner 1.0, content add/edit 0.5, review/feedback 0.3, none 0.0.
- answer format: Choose one of the provided score triples for 철수/영희/민수.
- special cautions: Need both chat evidence and version diff; avoid double-counting the same type unless problem wording implies max-level score per member.

Task 4
- prompt: Determine Team_A freerider using the official scoring formula.
- answer target: One member name whose contribution score falls below freerider threshold after combining Q2-Q3 inputs and any other formula inputs.
- answer format: Choose one of the provided names.
- special cautions: Must use `CONTRIBUTION_SCORE.txt`; do not substitute intuition for formula output.

Task 5
- prompt: Apply the same freerider scoring formula to Team_B, Team_C, Team_D.
- answer target: One combined option specifying freerider result for each team.
- answer format: Choose one of the provided team-to-member mappings.
- special cautions: Team may legitimately have no freerider; must compute each team separately under the same threshold (`contribution_score < 0.3`).

Task 6
- prompt: Extract member timetables from all team chats and find which team cannot schedule a weekday offline meeting.
- answer target: Team with less than 1 hour of continuous common free time during Mon-Fri 09:00-18:00.
- answer format: Choose one team name.
- special cautions: Normalize varied Korean time expressions; include common/shared classes; need intersection across all members, not pairwise overlap only.
```

---

## §3. Output Schema

Each Worker writes one JSON file for its assigned partition.

Default schema:

```json
[
  {
    "task": 1,
    "id": "task1_item_1",
    "answer": null,
    "flag": null
  }
]
```

Rules:
- `task`: task number from §2
- `id`: atomic answer identifier
- `answer`: final answer in submission-safe form; may be boolean, string, number, array, or `null`
- `flag`: `null` when normal, short reason string when unresolved
- duplicate `(task, id)` pairs are not allowed
- keep output compact unless the user explicitly asks for richer metadata

Competition submission is not JSON. Worker JSON should therefore store resolved evidence/conclusions in compact form for later merge into 6 final multiple-choice selections.

Recommended worker record shapes for this problem:

```json
[
  {
    "task": 1,
    "id": "team_a_latenight_counts",
    "answer": {"철수": 0, "영희": 0, "민수": 0},
    "flag": null
  },
  {
    "task": 2,
    "id": "team_a_promise_rates",
    "answer": {
      "철수": {"fulfilled": 0, "total": 0, "rate": 0.0},
      "영희": {"fulfilled": 0, "total": 0, "rate": 0.0},
      "민수": {"fulfilled": 0, "total": 0, "rate": 0.0}
    },
    "flag": null
  },
  {
    "task": 3,
    "id": "team_a_ppt_scores",
    "answer": {"철수": 0.0, "영희": 0.0, "민수": 0.0},
    "flag": null
  },
  {
    "task": 4,
    "id": "team_a_freerider",
    "answer": "민수",
    "flag": null
  },
  {
    "task": 5,
    "id": "teams_bcd_freeriders",
    "answer": {"Team_B": null, "Team_C": null, "Team_D": null},
    "flag": null
  },
  {
    "task": 6,
    "id": "weekday_offline_impossible_team",
    "answer": "Team_X",
    "flag": null
  }
]
```

When direct resolution is not possible, `answer` may hold best candidate plus brief evidence summary and `flag` should state the blocker.

---

## §4. Worker Partition Table

_User-maintained. Each Worker handles only its own row._

| Worker | Task(s) | Assigned Range | Output File | Status | Notes |
|--------|---------|----------------|-------------|--------|-------|
| A | 1,2,3,4,6 | Team_A | Result_A_3.json | 완료 | dedupe screenshots; use chat+resources+presentation |
| B | Task 5, Task 6 | Team_B | Result_B_3.json | 완료 | Team_B 자료기여/약속이행/PPT 기여 및 시간표 공통 슬롯 계산 |
| C | 5, 6 | Team_C | Result_C_3.json | 완료 | Team_C 점수/시간표 구조화 완료 |
| D | 5, 6 | Team_D | Result_D_3.json | 완료 | Team_D 점수/시간표 구조화 완료 |

Guidance:
- assign by task, folder, file range, or a mixed rule
- balance by difficulty, not just item count
- if a Worker is solving only one task, state it explicitly
- if a Worker is solving a subset of files for one task, state both the task and range
- use `Notes` for worker-specific cautions

---

## §5. Mid-Run Update From Orchestrator

Purpose:
- one short shared update while Workers are already running

Writing rules:
- keep it brief
- include only stable corrections or patterns
- prefer bullets over explanation
- if a rule applies to only one task, label it clearly

Suggested template:

```text
Update v1
- Global:
  - dataset layout is uniform: each team has `screenshots/`, `presentation/`, `resources/`; root has one `CONTRIBUTION_SCORE.txt`
  - screenshot counts: Team_A 16, Team_B 16, Team_C 15, Team_D 15
  - each team has exactly 2 presentation PDFs: `*_v1.pdf` and `*_final.pdf`
  - resource file count likely proxies Task 4/5 "자료개수" evidence source; do not rely on chat only
  - chats are screenshot-only; OCR/manual reading is required and duplicate overlap is explicitly expected
- Task 3:
  - PDF text layer appears weak/nonexistent; compare slides visually/structurally, not via plain text extraction only
- Task 4/5:
  - confirmed formula from `CONTRIBUTION_SCORE.txt`:
    `score = normalized_resource_count*0.4 + promise_rate*0.2 + ppt_score*0.4`
  - freerider threshold is strict: `< 0.3`
```

---

## §6. Final Answer

_Orchestrator fills this after all Worker outputs are complete._

Result files:
- result_A.json
- result_B.json
- result_C.json
- result_D.json

Task-by-task merged answers:

Task 1

```json

```

Task 2

```json

```

If there are more tasks, continue the same structure until Task `N`.
