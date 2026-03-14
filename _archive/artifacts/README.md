# 아티팩트

`PROBLEM_BRIEF.md`가 문제 사이클 전체를 위한 단일 작업 문서입니다.

세션이 진행되면서 위에서 아래로 채워나갑니다. 모든 Agent가 이 파일 전체를 읽습니다.

## 작성 순서

| 섹션 | 시점 | 작성자 |
| --- | --- | --- |
| 0. 진입 정보 | 문제 수령 즉시 | 나 |
| 1. 원본 문제 | 문제 수령 즉시 | 나 |
| 2. 제약조건 | 문제 수령 즉시 | 나 |
| 3. Orchestrator 출력 | Orchestrator 실행 후 (Full Path만) | 나, Orchestrator 출력 기반 |
| 4. 작업 가설 | Orchestrator 실행 후 (Full Path만) | 나, Orchestrator 출력 기반 |
| 5. 후보 답안 | Solver 실행 후 | 나, Solver 출력 기반 |
| 6. 검증 | Verifier 실행 후 | 나, Verifier 출력 기반 |
| 7. 제출 기록 | 제출마다 | 나 |

## Fast Path 사용 시

섹션 0~2는 내가 직접 작성. 섹션 3~4는 건너뜀.
섹션 5~6은 FAST_PATH 프롬프트 출력에서 기입.
섹션 7은 복수 제출이 허용될 때만 작성.

## Critic 예외

이 문서를 Critic에게 붙여넣을 때, 섹션 5의 `Internal — Critic에게 숨길 것` 블록을 제외하고 복붙.

## 초기화 규칙

새 문제마다 PROBLEM_BRIEF.md를 새로 작성. 이전 문제 내용을 이어서 사용하지 않음.
