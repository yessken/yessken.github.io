---
name: verification-first-fix
description: "Use when: debugging an Angular or TypeScript issue, reproducing a failing app behavior, verifying a project fix, checking build/test output before closing a task, or turning a recurring bug pattern into a reusable workflow."
---

# Verification-First Fix Workflow

## Purpose

This skill turns a bug report or failing behavior into a small, evidence-based fix. Use it for workspace debugging, before/after validation, and when the agent must be explicit about root cause and proof.

## Trigger

Use this when a user asks to fix something, investigate a broken feature, or validate a suspected regression in the codebase.

## Workflow

### 1. Reproduce and define the symptom

- Capture the exact behavior, error message, failing test, or broken UI state.
- Identify the affected area: route, component, service, config, or dependency.
- State the expected result versus the actual result.
- If the issue is not reproducible, gather more data before editing code.

### 2. Trace the root cause

- Read only the most relevant files and inspect the call flow.
- Check config, service boundaries, and recent environment assumptions.
- Form one hypothesis based on observed behavior and data flow.
- Stop guessing when a single root cause is not yet clear.

### 3. Add or locate a failing proof

- Prefer a failing test or a minimal reproduction if the fix is code-related.
- If the issue is runtime or build-related, use the real app output or build logs as proof.
- Keep the proof narrow and tied to the behavior under investigation.

### 4. Implement the smallest root-cause fix

- Change the fewest files required to resolve the actual problem.
- Prefer minimal, idiomatic solutions over broad refactors.
- Avoid unrelated cleanup in the same patch.
- Do not add test-only production methods or mock-heavy verification.

### 5. Verify with fresh evidence

- Run the smallest relevant command: targeted test, Angular build, or specific validation step.
- Use exit codes and tool output as the source of truth.
- Do not claim success without fresh verification.
- If the fix affects user-facing behavior, validate the relevant app path or build target in the same scope.

### 6. Summarize with evidence

Report the result in this order:

1. Problem summary
2. Root cause
3. Change made
4. Verification command and outcome
5. Remaining caveats or next steps

## Decision points

- If the issue is not reproduced, collect another data point before editing.
- If the problem looks environment-driven, inspect dependencies or config before changing app logic.
- If the symptom sits in UI state, inspect the interaction path between component state, services, and template output.
- If the fix is unclear, shrink it to a smaller failing case before expanding scope.

## Quality gates

A task is complete only when all of the following are true:

- The root cause is specific and stated before the patch.
- The fix addresses the source of the problem rather than only masking symptoms.
- A failing check or real reproduction existed before the change.
- Fresh verification confirms the fix with exit-code evidence.
- The final report includes what was changed and what was validated.

## Anti-patterns to avoid

- Never claim “fixed” without running the relevant command.
- Never patch blindly without reproducing or tracing the issue.
- Never broaden scope during a single fix unless required by the actual root cause.
- Never rely on mock-only assertions when behavior can be verified with real app or test output.

## Example prompts

- “Debug this Angular issue and explain the root cause before changing code.”
- “Verify whether this regression is caused by state flow or config, then fix it and prove it with output.”
- “Run the smallest relevant validation and report the exact evidence that the fix works.”

## Suggested related customizations

- A focused Angular build-validation skill for CI and local verification.
- A component-debugging skill for tracing state, bindings, and services.
- A documentation skill for summarizing root cause and evidence in a reusable format.
