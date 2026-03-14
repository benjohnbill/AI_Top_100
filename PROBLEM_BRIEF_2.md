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

- `problem_id`: `digital_art_authenticator_ai_forgery`
- `time_limit_minutes`: 15
- `data_location`: `D:\OneDrive\바탕 화면\Life_System\00_Inbox\ai_top_100_campus_art-detective`
- `num_tasks`: 4
- `submission_format_summary`: Task 1은 작품 번호 3개를 각각 입력, Task 2는 작품 번호 12개를 오름차순 콤마 구분 문자열로 제출, Task 3은 100개 전 작품의 `[{id, artist}]` JSON 배열 제출, Task 4는 Vermeer 관련 작품들의 `[{id, title, museum}]` JSON 배열 제출

---

## §1. Problem Description

온라인 미술관 컬렉션 100개 이미지에서 진품과 AI 위작을 구분하고, 진품의 작가/작품 정보를 복원하는 문제다. Task 1과 Task 2는 조건에 맞는 작품 번호를 찾는 분류형 과제이고, Task 3은 전체 100개 작품에 대해 진품이면 작가명을, 위작이면 `FAKE`를 기입하는 전수 판별 과제다. Task 4는 Vermeer 진품과 Vermeer 화풍 AI 위작을 구분하고, 진품이면 작품명과 소장 미술관명을 채운다. 작가명은 반드시 `artists.txt`의 정확한 표기, Vermeer 제목/미술관명은 각각 `vermeer_titles.txt`, `vermeer_museums.txt`의 정확한 표기를 써야 한다.

---

## §2. Task Registry

Task 1
- prompt: 세 개의 스토리에 해당하는 진품 작품 번호를 각각 찾기
- answer target: (1) 르루아의 풍자 기사에서 "인상주의" 명칭의 계기가 된 작품, (2) 1889년 1월 붕대 감은 귀 자화상, (3) 1632년 공개 해부 시연 기념 작품
- answer format: 답안 1, 답안 2, 답안 3에 작품 번호 1개씩 입력
- special cautions: 모두 진품 기준으로 식별; 유사 제목/유사 자화상/군상화와 혼동 주의

Task 2
- prompt: 동물이 직접 등장하는 작품 12개의 번호를 모두 찾기
- answer target: 말, 개, 곤충, 신화 속 동물 등 실제 화면에 직접 나타나는 동물 포함 작품
- answer format: 작품 번호를 오름차순 정렬 후 콤마 구분 문자열로 제출
- special cautions: 자수, 패턴, 그림 속 그림, 장식물 등 다른 매체에 간접적으로 표현된 동물은 제외

Task 3
- prompt: 100개 모든 작품이 진품인지 AI 위작인지 판별하고, 진품이면 작가명을 식별
- answer target: 각 작품의 `artist`
- answer format: `[{\"id\": \"1\", \"artist\": \"Vincent van Gogh\"}, ...]` 형태의 JSON 배열
- special cautions: 진품 작가명은 반드시 `artists.txt` 정확 표기 사용; 위작은 `\"FAKE\"`; 100개 전 작품 누락 없이 작성

Task 4
- prompt: Vermeer 작품과 Vermeer 화풍 AI 위작을 구분하고, 진품이면 작품명과 소장 미술관명을 식별
- answer target: 각 Vermeer 관련 작품의 `title`, `museum`
- answer format: `[{\"id\": \"4\", \"title\": \"Girl with a Pearl Earring\", \"museum\": \"Mauritshuis, The Hague\"}, ...]` 형태의 JSON 배열
- special cautions: 진품 제목/미술관명은 각각 `vermeer_titles.txt`, `vermeer_museums.txt` 정확 표기 사용; 위작은 `title`과 `museum` 모두 `\"FAKE\"`; 실제 Vermeer 후보 범위는 데이터 확인 필요

---

## §3. Output Schema

Each Worker writes one JSON file for its assigned partition.

Default wrapper schema:

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
- `id`: atomic answer identifier; per-artwork tasks는 작품 번호 문자열 사용, Task 1은 `answer_1` / `answer_2` / `answer_3` 사용
- `answer`: final answer in submission-safe form; string, array, object, or `null`
- `flag`: `null` when normal, short reason string when unresolved
- duplicate `(task, id)` pairs are not allowed
- keep output compact unless the user explicitly asks for richer metadata
- Task 1 working item example: `{"task": 1, "id": "answer_1", "answer": "17", "flag": null}`
- Task 2 working item example: `{"task": 2, "id": "animal_candidates", "answer": ["1", "2", "15"], "flag": null}`
- Task 3 working item example: `{"task": 3, "id": "17", "answer": {"artist": "FAKE"}, "flag": null}`
- Task 4 working item example: `{"task": 4, "id": "11", "answer": {"title": "The Milkmaid", "museum": "Rijksmuseum, Amsterdam"}, "flag": null}`
- Final submission assembly:
  - Task 1: scalar 작품 번호 3개
  - Task 2: 오름차순 콤마 구분 문자열 1개
  - Task 3: `{id, artist}` JSON 배열 1개
  - Task 4: `{id, title, museum}` JSON 배열 1개

---

## §4. Worker Partition Table

_User-maintained. Each Worker handles only its own row._

| Worker | Task(s) | Assigned Range | Output File | Status | Notes |
|--------|---------|----------------|-------------|--------|-------|
| A | 1, 2, 3, 4 | 작품 1-25 | result_A.json | 완료 | 번호 범위 내에서 전 문항 처리 |
| B | 1, 2, 3, 4 | 작품 26-50 | result_B.json | 완료 | 번호 범위 내에서 전 문항 처리 |
| C | 1, 2, 3, 4 | 작품 51-75 | result_C.json | 완료 | 번호 범위 내에서 전 문항 처리 |
| D | 1, 2, 3, 4 | 작품 76-100 | result_D.json | 완료 | 번호 범위 내에서 전 문항 처리 |

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
Update v1
- Global:
  - dataset 구조는 단순함: 루트에 `artists.txt`, `vermeer_titles.txt`, `vermeer_museums.txt`, 그리고 `art_detective_dataset/1.jpg`~`100.jpg`만 존재
  - 파일명은 숫자 번호 외 힌트를 주지 않음; 워커 분할은 번호 범위 기준이 가장 안전
  - `artists.txt` 유효 후보는 101명, `vermeer_titles.txt`는 21개 제목, `vermeer_museums.txt`는 15개 미술관명
- Task 2:
  - 동물은 화면에 직접 등장해야 함; 그림 속 그림, 직물/장식 패턴, 배경 문양의 동물은 제외
- Task 3:
  - 작가명은 자유 추정 금지, 반드시 `artists.txt` exact match 사용
  - 불확실하면 임의 확정 대신 `flag`에 후보/의심 사유를 짧게 남기기
- Task 4:
  - Vermeer 진품 판정 후에도 제목/미술관은 자유 서술 금지, 각 txt의 exact match로 정규화
```

Workers should apply this mainly to:
- remaining items
- prior flagged/null items
- earlier results only when clearly affected

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
{"answer_1":"50","answer_2":"98","answer_3":"52"}
```

Task 2

```json
{"animal_ids":["6","20","21","30","31","32","48","55","73","83","87","90"],"status":"locked_after_recheck"}
```

Task 3

```json
[{"id":"1","artist":"Vincent van Gogh"},{"id":"2","artist":"Paul Cézanne"},{"id":"3","artist":"Edgar Degas"},{"id":"4","artist":"Johannes Vermeer"},{"id":"5","artist":"Edgar Degas"},{"id":"6","artist":"Vincent van Gogh"},{"id":"7","artist":"Edgar Degas"},{"id":"8","artist":"Johannes Vermeer"},{"id":"9","artist":"Peter Paul Rubens"},{"id":"10","artist":"Rembrandt van Rijn"},{"id":"11","artist":"Johannes Vermeer"},{"id":"12","artist":"김홍도"},{"id":"13","artist":"김홍도"},{"id":"14","artist":"Johannes Vermeer"},{"id":"15","artist":"Rembrandt van Rijn"},{"id":"16","artist":"Claude Monet"},{"id":"17","artist":"Claude Monet"},{"id":"18","artist":"신윤복"},{"id":"19","artist":"Paul Cézanne"},{"id":"20","artist":"Peter Paul Rubens"},{"id":"21","artist":"신윤복"},{"id":"22","artist":"Vincent van Gogh"},{"id":"23","artist":"Johannes Vermeer"},{"id":"24","artist":"Vincent van Gogh"},{"id":"25","artist":"Claude Monet"},{"id":"26","artist":"Paul Cézanne"},{"id":"27","artist":"Edgar Degas"},{"id":"28","artist":"Vincent van Gogh"},{"id":"29","artist":"Johannes Vermeer"},{"id":"30","artist":"김홍도"},{"id":"31","artist":"정선"},{"id":"32","artist":"신사임당"},{"id":"33","artist":"김홍도"},{"id":"34","artist":"Edgar Degas"},{"id":"35","artist":"Paul Cézanne"},{"id":"36","artist":"Claude Monet"},{"id":"37","artist":"Paul Cézanne"},{"id":"38","artist":"신윤복"},{"id":"39","artist":"Johannes Vermeer"},{"id":"40","artist":"FAKE"},{"id":"41","artist":"Claude Monet"},{"id":"42","artist":"Vincent van Gogh"},{"id":"43","artist":"Leonardo da Vinci"},{"id":"44","artist":"Claude Monet"},{"id":"45","artist":"Paul Cézanne"},{"id":"46","artist":"FAKE"},{"id":"47","artist":"Johannes Vermeer"},{"id":"48","artist":"김홍도"},{"id":"49","artist":"Johannes Vermeer"},{"id":"50","artist":"Claude Monet"},{"id":"51","artist":"Rembrandt van Rijn"},{"id":"52","artist":"Rembrandt van Rijn"},{"id":"53","artist":"Claude Monet"},{"id":"54","artist":"Edgar Degas"},{"id":"55","artist":"Peter Paul Rubens"},{"id":"56","artist":"Dong Qichang"},{"id":"57","artist":"Vincent van Gogh"},{"id":"58","artist":"신윤복"},{"id":"59","artist":"신윤복"},{"id":"60","artist":"Zhang Daqian"},{"id":"61","artist":"Johannes Vermeer"},{"id":"62","artist":"FAKE"},{"id":"63","artist":"Rembrandt van Rijn"},{"id":"64","artist":"Claude Monet"},{"id":"65","artist":"Johannes Vermeer"},{"id":"66","artist":"FAKE"},{"id":"67","artist":"Vincent van Gogh"},{"id":"68","artist":"Paul Cézanne"},{"id":"69","artist":"Vincent van Gogh"},{"id":"70","artist":"신윤복"},{"id":"71","artist":"Claude Monet"},{"id":"72","artist":"Claude Monet"},{"id":"73","artist":"Qi Baishi"},{"id":"74","artist":"Johannes Vermeer"},{"id":"75","artist":"Paul Cézanne"},{"id":"76","artist":"Paul Cézanne"},{"id":"77","artist":"Claude Monet"},{"id":"78","artist":"FAKE"},{"id":"79","artist":"신윤복"},{"id":"80","artist":"Edgar Degas"},{"id":"81","artist":"Edgar Degas"},{"id":"82","artist":"Johannes Vermeer"},{"id":"83","artist":"Tang Yin"},{"id":"84","artist":"Vincent van Gogh"},{"id":"85","artist":"Edgar Degas"},{"id":"86","artist":"Edgar Degas"},{"id":"87","artist":"Peter Paul Rubens"},{"id":"88","artist":"Vincent van Gogh"},{"id":"89","artist":"Rembrandt van Rijn"},{"id":"90","artist":"Zhang Daqian"},{"id":"91","artist":"Rembrandt van Rijn"},{"id":"92","artist":"Rembrandt van Rijn"},{"id":"93","artist":"정선"},{"id":"94","artist":"Vincent van Gogh"},{"id":"95","artist":"Paul Cézanne"},{"id":"96","artist":"Rembrandt van Rijn"},{"id":"97","artist":"Tōshūsai Sharaku"},{"id":"98","artist":"Vincent van Gogh"},{"id":"99","artist":"김득신"},{"id":"100","artist":"Pablo Picasso"}]
```

Task 4

```json
[{"id":"4","title":"Officer and Laughing Girl","museum":"Frick Collection, New York"},{"id":"8","title":"View of Delft","museum":"Mauritshuis, The Hague"},{"id":"11","title":"The Milkmaid","museum":"Rijksmuseum, Amsterdam"},{"id":"14","title":"The Art of Painting","museum":"Kunsthistorisches Museum, Vienna"},{"id":"23","title":"Girl Reading a Letter at an Open Window","museum":"Gemäldegalerie Alte Meister, Dresden"},{"id":"29","title":"The Music Lesson","museum":"Royal Collection, Windsor Castle"},{"id":"39","title":"Woman in Blue Reading a Letter","museum":"Rijksmuseum, Amsterdam"},{"id":"46","title":"FAKE","museum":"FAKE"},{"id":"47","title":"The Lacemaker","museum":"Louvre, Paris"},{"id":"49","title":"The Geographer","museum":"Städel Museum, Frankfurt"},{"id":"61","title":"Study of a Young Woman","museum":"Metropolitan Museum of Art, New York"},{"id":"62","title":"FAKE","museum":"FAKE"},{"id":"65","title":"The Little Street","museum":"Rijksmuseum, Amsterdam"},{"id":"74","title":"The Astronomer","museum":"Louvre, Paris"},{"id":"82","title":"Girl with a Pearl Earring","museum":"Mauritshuis, The Hague"}]
```

Notes:
- Task 1 `answer_3` conflict (`52` vs `91`) was resolved in favor of `52`; `52` is the 1632 anatomy lesson, while `91` is a different Rembrandt group portrait.
- Task 2 was completed by direct recheck; added `31` and `90` to the worker union.
- Task 4 corrections after visual recheck: `46` treated as Vermeer-style fake, `61` corrected to `Study of a Young Woman`, `74` corrected to `The Astronomer`.
- Remaining soft-risk Task 3 ids even after recheck: `25`, `31`, `83`, `90`, `100`.
