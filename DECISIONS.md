# Decisions

Project decisions and assumptions are documented here as implementation progresses.


PRD states every content update creata a new version i noted an ambiguty should metadata changes like name/tags alsi creta a version?
i chose to follow the PRD literally,


# Decisions

## Brief Synthesis — Choices and Trade-offs

**Stack — Node.js + Express + ESM**
Familiar stack for speed under time pressure. ESM adds minor Jest config overhead but keeps imports clean.

**Persistence — JSON file**
PRD allowed any strategy. JSON file eliminates setup time and keeps the project self-contained. Not production-scale but appropriate here.

**Testing — dbPath injection**
App accepts custom dbPath so tests use isolated temp files. Real integration confidence without touching production data.

**Versioning ambiguity**
PRD didn't clarify if metadata-only changes create a version. Followed PRD literally — any update creates a new version. Would distinguish content vs metadata in a real product.

**Render logic**
Variable resolution: request value → default → missing. Unknown variables silently ignored per PRD. Strict on required, lenient on unknown.

**Would improve with more time**
- Pagination for large template lists
- Template deletion endpoint
- Real database for concurrent access
- Authentication layer