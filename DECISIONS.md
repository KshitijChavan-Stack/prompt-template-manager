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


## Recording Note

During the assessment recording I hit the Cursor agent token limit
mid-session. I paused the recording at that point.

What I did during the pause:
- Manually implemented the remaining render endpoint logic in
  templateService.js and templates.js
- Created the render integration tests in templates.render.test.js
- Completed README.md with curl examples for all endpoints
- Completed DECISIONS.md with full trade-off documentation

The following prompts were used to guide Claude for the remaining
implementation:

**Render endpoint:**
"Implement renderTemplate service method. Use latest version content.
Replace {{variable}} placeholders with provided values. If variable
not provided but has a default — use the default. If required variable
(no default) is missing — collect all missing variables and return a
ValidationError listing them. Unknown variables in request are silently
ignored. Implement POST /templates/:id/render route returning 200 with
rendered text or 400 with missing variables list. Write tests covering
all variables provided, missing variable uses default, missing required
variable returns 400 with variable name, unknown variable ignored."

**Documentation:**
"Write a README.md with instructions to install, run, and test the
project. Include example curl commands for each endpoint. Also update
DECISIONS.md with all trade-offs and assumptions we made during the build."

When I resumed recording I ran npm test to show all 8 suites and
23 tests passing — confirming everything implemented during the
pause is correct and working.

The pause was a tooling limitation, not a gap in understanding.
All code written during the pause follows the same spec decisions
established in the recorded portion.