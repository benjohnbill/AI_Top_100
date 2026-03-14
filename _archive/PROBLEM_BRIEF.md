# Problem Brief — {problem_id}

_유저 + Orchestrator 공유 문서. 유저가 §0–§3 작성, Worker가 §3 상태 업데이트, Orchestrator가 §5 완성._

---

## §0. 기본 정보

- `problem_id`:
- `data_location`:
- `required_output_format`:

---

## §1. 문제 설명

{문제 원문 또는 요약}

---

## §2. 출력 스키마

Worker가 이 스키마대로 `result_{id}.json`을 저장한다.

```json
{
  "schema_here": ""
}
```

---

## §3. Worker 구획

_유저가 작성. Worker는 자신의 행만 처리._

| Worker | 담당 범위 | 출력 파일 | 상태 |
|--------|----------|-----------|------|
| A | | result_A.json | 대기 |
| B | | result_B.json | 대기 |
| C | | result_C.json | 대기 |

---

## §4. 선행 참조

_이전 문제에서 발견한 패턴. Orchestrator 또는 유저 작성. 없으면 생략._

---

## §5. 최종 답

_Orchestrator 작성. Worker 완료 후 채움._

결과 파일:
- [result_A.json](result_A.json)
- [result_B.json](result_B.json)
- [result_C.json](result_C.json)

병합 결과:

```json

```
