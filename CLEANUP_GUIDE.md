# AeroCut AI Cleanup Guide

To maintain a clean, production-ready, and professional codebase, we have removed all local AI editor configuration metadata, background instruction files, and temporary cache folders from the repository before pushing to GitHub.

Below is the list of deleted files and folders:

## 📂 Deleted Directories

1.  **`.agents/`**
    *   *Purpose:* Contained internal AI instructions, skills, and tools config.
    *   *Reason for deletion:* Only needed by local agent runtime environments. Not required for running the actual FastAPI + React application.
2.  **`.claude/`**
    *   *Purpose:* Contained developer helper instructions and custom skills for the Claude Code agent CLI.
    *   *Reason for deletion:* Useless for end-users, leaks agent development activity, and bloats the workspace.
3.  **`.cursor/`**
    *   *Purpose:* Saved Cursor IDE workspace configurations and rules.
    *   *Reason for deletion:* Private editor metadata that should not be published.
4.  **`.pytest_cache/`**
    *   *Purpose:* Python test execution cache directory.
    *   *Reason for deletion:* Build artifact generated locally that should be excluded from Git commits.

## 📄 Deleted Configuration Files

1.  **`AGENTS.md`**
    *   *Purpose:* System guidelines and behavioral constraints for AI coding agents.
2.  **`AGENT_GUIDE.md`**
    *   *Purpose:* Comprehensive guide on the orchestrator stage design, reviewer protocols, and human checkpointing logic for agents.
3.  **`CLAUDE.md`**
    *   *Purpose:* Instruction wrapper targeting Claude CLI commands and environment configurations.
4.  **`CODEX.md`**
    *   *Purpose:* Guide files containing references for agentic codex modules.
5.  **`COPILOT.md`**
    *   *Purpose:* Setup instructions written specifically for GitHub Copilot.
6.  **`CURSOR.md`**
    *   *Purpose:* Instruction rules used by the Cursor Composer agent panel.
7.  **`PROJECT_CONTEXT.md`**
    *   *Purpose:* Architecture context files used to orient autonomous coding agents.
8.  **`.windsurfrules`**
    *   *Purpose:* System instructions for the Windsurf editor.

---
*Note: This cleanup leaves the repository in a clean, human-developer state, ensuring the focus is 100% on the core FastAPI/React application codebase.*
