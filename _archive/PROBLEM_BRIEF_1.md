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

문제 설명
이상한 석판의 비밀을 해결하여 무사히 고대 유적에 들어온 당신은 유적 안에서 거대한 미로를 발견했습니다. 미로의 벽면에는 수없이 많은 아스키 아트가 새겨져 있었습니다.

이 아스키 아트는 단순한 그림이 아닙니다. 아스키 문자를 정교하게 배열하여 영어 단어를 타이포그래피 형태로 표현하면서, 동시에 추출된 텍스트가 실행 가능한 파이썬 코드로 작동합니다.

아스키 아트가 어떤 단어를 나타내는지 알아내고, 이미지의 텍스트를 파이썬 코드로 추출하여 실행하세요. 1단계에서 찾은 단어를 stdin으로 입력하고 stdout으로 반환된 암호를 찾아내 미로를 통과하세요.

전체 아스키 이미지 파일 40건에 대한 정답을 아래 형식에 맞춰 제출해 주세요.

이미지 경로: q2
제출 형식: 아래 스키마를 만족하는 단일 JSON array
id: 파일명, 중복 허용 하지 않음
answer: 코드 실행 출력값

### 이미지

D:\OneDrive\바탕 화면\Life_System\00_Inbox\ai_top_100_final_ascli\q2

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
