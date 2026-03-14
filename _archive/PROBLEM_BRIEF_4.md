# Problem Brief

_단일 작업 문서. 위에서 아래로 채워나감. 모든 Agent가 이 파일 전체를 읽음._

**Agent 규칙: 이 파일을 받은 Agent는 자신의 담당 섹션(§3 Orchestrator / §4–§5 Solver / §5 Critic / §6 Verifier / §7 Submission)을 채운 뒤 파일을 저장하고 종료한다. 채팅 출력 불필요.**

---

## 0. 진입 정보

- `problem_id`:
- `entry_path`: Fast / Full
- `mode`: standard / compressed / recovery
- `time_context`:

---

## 1. 원본 문제

- `required_output_format`:

### 텍스트




### 이미지

{URL 또는 파일 경로 — 없으면 생략}

### 영상

{URL 또는 타임스탬프 범위 — 없으면 생략}

### 코드

{제공된 코드 그대로 붙여넣기 — 없으면 생략}

---

## 2. 제약조건

- `explicit_constraints`:
- `hidden_risk_clues`:

---

## 3. Orchestrator 출력 _(Full Path만 — Fast이면 생략)_

- `problem_type`:
- `bottleneck`:
- `activated_slots`:
- `execution_order`:

---

## 4. 작업 가설 _(Full Path만 — Fast이면 생략)_

- `first_read_summary`:
- `likely_solution_direction`:
- `reasons_this_might_be_wrong`:

---

## 5. 후보 답안

_Critic이 이 섹션을 읽음. 신뢰도 수치는 여기에 넣지 않음._

| 순위 | 후보 | 맞을 이유 | 틀릴 이유 |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |

- `strongest_candidate`:
- `what_would_change_the_ranking`:

### Internal — Critic에게 숨길 것

- `solver_confidence`:
- `solver_reasoning_summary`:

---

## 6. 검증

- `format_check`:
- `constraint_check`:
- `contradiction_check`:
- `submission_ready`: YES / NO
- `if_no_next_check`:

---

## 7. 제출 기록

| 시도 | 제출 답안 | 피드백 | 변경한 것 | 다음 행동 |
| --- | --- | --- | --- | --- |
| 1 | | | | |

- `stable_signals`:
- `do_not_change`:
