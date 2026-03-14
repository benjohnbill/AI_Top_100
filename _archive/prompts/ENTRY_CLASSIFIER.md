# 진입 분류기

문제를 받으면 가장 먼저 실행. 30초 이내로 결정.

## 결정 기준

### Fast Path

아래 조건을 **모두** 충족할 때:
- 입력이 깔끔한 텍스트 — 이미지, 긴 코드, OCR 없음
- 출력 형식이 명확하고 결정론적
- 추론이 3단계 이하로 느껴짐
- 남은 시간이 15분 미만, 또는 문제가 명확히 단순함

→ `prompts/FAST_PATH.md`

### Full Path

아래 조건 중 **하나라도** 해당할 때:
- 이미지, 영상, 노이즈 텍스트, 추적이 필요한 코드 포함
- 첫 읽기에서 해석이 두 갈래 이상
- 출력 형식이 모호하거나 복합적
- 확신하면서 틀릴 위험이 높음
- 남은 시간이 15분 이상이고 문제가 복잡함

→ `prompts/SESSION_STARTER.md`

## 업그레이드 규칙 (Fast → Full)

Fast Path 결과에서 `submission_ready: NO`가 나오면:
1. Fast Path 출력을 PROBLEM_BRIEF 4번 항목 `first_read_summary`에 붙여넣기
2. Full Path의 Solver 단계부터 진입 — 재분류 불필요
3. Fast Path에서 틀린 지점을 `reasons_this_might_be_wrong`에 기록

## 시간 기반 모드 자동 적용

경로와 무관하게 남은 시간에 따라 모드 적용:

| 남은 시간 | 모드 |
| --- | --- |
| 15분 초과 | standard |
| 5 ~ 15분 | compressed |
| 5분 미만 | compressed + Critic 생략 |
| 제출 실패 직후 | recovery |
