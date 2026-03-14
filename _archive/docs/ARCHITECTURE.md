# 아키텍처

## 설계 목표

AI_TOP_100 유형의 문제에서 우위를 가져오는 요소:

- 문제 분해
- 선택적 도구 사용
- 빠른 검증
- 모호한 출력에 대한 인간 판단
- 점수 인식 반복

이 아키텍처는 고정된 팀이 아니라 슬롯을 사용합니다. 슬롯은 문제와 단계에 따라 활성화됩니다.

## 슬롯 정의

### 항시 활성

#### `Orchestrator`
- 문제를 읽고 작업 유형을 분류
- 활성화할 슬롯을 결정
- 기대값이 가장 높은 다음 행동을 설정
- 피드백, 실패, 유형 재분류 후 재실행

#### `Solver`
- 후보 답안을 생성
- 추론, 계산, 코드 해석, 선택적 스크립트 작성 처리
- 기본적으로 단일 모델 사용, 필요 시에만 다중 모델로 확장

#### `Verifier`
- 형식, 제약조건, 일관성, 단위, 명백한 실패 케이스 확인
- 품질 낮은 제출을 차단

### 조건부

#### `Extractor`
- 입력이 길거나, 시각적이거나, 노이즈가 있거나, 멀티모달일 때 사용
- 관찰된 사실과 해석을 분리

#### `Critic`
- 신뢰도가 낮거나, 고위험 과제이거나, 여러 답이 그럴듯할 때 사용
- 반례, 모순, 약한 가정을 탐색

#### `Submission Loop`
- 복수 제출 또는 점수 피드백이 있을 때 사용
- 후보 순위, 피드백, 유지할 것/바꿀 것을 추적

#### `Human Checkpoint`
- 시각적 모호성, OCR 정제, 경계 판단, 최종 제출 확인에 사용
- 인간을 고가치 판단 경로에 유지

## 활성화 매트릭스

| 문제 유형 | 기본 경로 | 일반적 조건부 슬롯 |
| --- | --- | --- |
| 텍스트 추론 | Orchestrator → Solver → Verifier | Critic |
| 이미지 / OCR | Orchestrator → Extractor → Solver → Verifier | Human Checkpoint, Critic |
| 영상 | Orchestrator → Extractor → Solver → Verifier | Critic, Human Checkpoint |
| 코드 이해 | Orchestrator → Solver → Verifier | Critic |
| 모델링 / 분석 | Orchestrator → Solver → Verifier → Submission Loop | Critic |

## 운영 루프

1. `읽기` — 문제, 자산, 출력 형식, 제한, 채점 단서 파악
2. `분류` — 작업 유형 지정 및 예상 병목 확인
3. `조합` — 이 문제에 필요한 슬롯만 활성화
4. `풀기` — 하나 이상의 후보 답안 또는 전략 생성
5. `검증` — 형식, 조건, 모순 확인
6. `제출 / 관찰` — 준비된 최적 후보 제출 후 피드백 수집
7. `적응` — 다음 시도를 위한 프롬프트, 슬롯, 후보 순위 개선

## 문제 상태

각 문제 사이클에서 다음 정보를 PROBLEM_BRIEF에 유지:

- `problem_id`
- `problem_type_guess`
- `raw_assets`
- `constraints`
- `required_output_format`
- `current_hypothesis`
- `candidate_answers`
- `used_tools_and_slots`
- `verification_results`
- `submission_history`
- `feedback_or_score`
- `remaining_time`
- `next_best_action`

## 기본 런타임 정책

- 린하게 시작
- 원본 입력이 파싱하기 어려울 때만 `Extractor` 추가
- 모호성이나 오류 위험이 실질적일 때만 `Critic` 추가
- 플랫폼이 반복을 보상할 때만 `Submission Loop` 활성화
- 모호한 케이스에서 최종 제출 전 `Human Checkpoint` 열기

## 안티패턴

- 기본으로 모든 슬롯을 활성화하는 것
- 첫 번째 모델 응답을 최종으로 취급하는 것
- 관찰된 사실과 추측된 사실을 혼합하는 것
- 직접 추론이 더 빠른 경우에 코드를 사용하는 것
- 답이 "맞아 보인다"는 이유로 검증을 건너뛰는 것

## 하이브리드 모드

문제마다 `prompts/ENTRY_CLASSIFIER.md`를 통해 두 가지 진입 경로 중 하나를 선택합니다.

### Fast Path

슬롯을 단일 프롬프트로 병합 (Orchestrator + Solver + Verifier).
템플릿 없음. 프롬프트 출력이 곧 작업 문서.

사용 조건: 입력이 깔끔한 텍스트, 출력 형식이 결정론적, 추론이 짧거나, 시간이 15분 미만.

### Full Path

슬롯을 설계대로 순서대로 실행. PROBLEM_BRIEF를 사이클마다 작성.

사용 조건: 입력이 모호하거나 멀티모달, 여러 해석 가능, 정확도가 속도보다 중요할 때.

### 업그레이드 규칙

Fast Path는 검증 실패 시 Full Path로 올라갈 수 있음.
Full Path는 실행 중 다운그레이드 불가 — 시간 비용이 이미 지불됨.

### 진입 결정

`prompts/ENTRY_CLASSIFIER.md`의 30초 분류 기준 및 시간 기반 모드 표 참조.
