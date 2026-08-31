## Agent skills

### Issue tracker

Issues and specs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five canonical triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses the single-context layout. See `docs/agents/domain.md`.

### Git worktrees and integration

- Use a dedicated worktree and branch for each agent: agent-1 (`dsh/agent-1`) and agent-2 (`codex/agent-2`).
- Commit task changes on the agent branch. After every commit, push that branch and create or update its GitHub PR with `main` as the base branch.
- Integrate both agent branches into `main` by merging their PRs; treat `main` as the shared integration branch.
- Keep one PR per agent branch: the first commit creates the PR, and later commits update that same PR.
- Never merge one agent branch into another (e.g. `dsh/agent-1` → `codex/agent-2` or the reverse); every PR must use `main` as its base branch.
