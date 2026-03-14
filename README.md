# AI_TOP_100 Competition OS

인간 주도, 병렬 워커 기반 문제 풀이 시스템.

---

## 핵심 구조

모든 작업은 문서 3개로 운영된다:

| 문서 | 작성자 | 역할 |
|------|--------|------|
| `PROBLEM_BRIEF.md` | 유저 + Orchestrator | 문제 정의, 스키마, 구획, 결과 인덱스 |
| `WORKER_PROMPT.md` | 고정 (수정 금지) | 모든 Worker 공통 지시 |
| `result_{id}.json` | Worker | 담당 파티션 처리 결과 |

---

## 플로우

```
1. 유저: 문제 수령 → PROBLEM_BRIEF.md 초안 작성 (§0, §1)
2. Orchestrator: PROBLEM_BRIEF.md 완성 (§2 스키마, §3 구획 제안, §4 선행 참조)
3. 유저: §3 구획 확정
4. Workers (동시): 각자 담당 범위 처리 → result_{id}.json 저장
5. Orchestrator: result 파일들 병합 → §5 최종 답 작성
6. 유저: 검토 → 제출
```

---

## Worker 실행 시 입력

각 Worker 창에 붙여넣기:
1. `PROBLEM_BRIEF.md`
2. `WORKER_PROMPT.md`
3. 담당 데이터 (파일 경로 또는 직접)

---

## 디렉토리

```
prompts/
  ORCHESTRATOR.md        ← Orchestrator 전용 프롬프트
artifacts/
  templates/
    PROBLEM_BRIEF.md     ← 새 문제 시작 시 복사해서 사용
WORKER_PROMPT.md         ← 모든 Worker 공통 (수정 금지)
_archive/                ← 구버전 파일
```

---

## 문제 순서 결정

유저가 결정한다. Orchestrator는 패턴/복잡도 정보만 제공한다.
