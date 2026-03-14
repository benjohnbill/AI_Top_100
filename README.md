# AI_Top_100

AI Top 100 과제 풀이 과정과 산출물을 정리한 저장소입니다. 실제 제출 답안, 작업 중간 결과, 제공 자료, 디버깅 산출물이 함께 포함되어 있습니다.

## 구성

- `ai_top_100_제공된_자료/`: 대회에서 제공된 원본 자료
- `_workspace/`: 분석 중 생성한 이미지, OCR 보조 산출물, 점검용 JSON
- `_archive/`: 이전 버전 프롬프트, 문서, 템플릿
- `ORCHESTRATOR.md`: 전체 작업 조율용 프롬프트
- `WORKER_PROMPT.md`: 워커 공통 지시문
- `PROBLEM_BRIEF_2.md`, `PROBLEM_BRIEF_3.md`, `PROBLEM_BRIEF_5.md`: 문제별 작업 브리프
- `result_*.json`, `Result_*_*.json`: 워커 또는 문제별 결과 파일
- `대략적인_디브리핑.txt`: 문제 이해, 해결 전략, AI 도구 활용에 대한 회고 메모

## 작업 방식

이 저장소는 Codex CLI 기반의 멀티에이전트 워크플로우로 정리되었습니다.

- Orchestrator가 문제를 분해하고 작업 범위를 정리
- 여러 Worker가 병렬로 자료를 확인하고 결과 JSON 생성
- Orchestrator가 충돌 항목과 저신뢰 항목을 재검토해 최종 결과 정리

## 참고

- 루트 디렉토리의 문서와 결과 파일은 문제별 최종 정리본에 가깝습니다.
- `_workspace/`와 `_archive/`는 재현보다는 작업 흔적과 검증 근거 보존 목적이 큽니다.
- 저장소에는 이미지, PDF, JSON 등 대용량 파일이 다수 포함되어 있습니다.
