Analyse all current git changes on this Next.js portfolio site (SIMOU) and create multiple focused commits by grouping related changes together.

## Steps

1. Run `git status` and `git diff` to identify all unstaged and staged changes
2. Analyse the changes and group them by logical concern (e.g. feature additions, bug fixes, config changes, documentation updates, styling, data/content updates, gallery photo replacement)
3. For each group, stage only the relevant files using `git add <files>` — never `git add -A`/`git add .`, since `img/` (real photo originals) must stay untracked and `public/images/` swaps should be reviewed per-file
4. Write a commit message following the template below, then commit
5. Repeat for each group until all changes are committed

## Commit Message Template

```
<type>: <subject>
```

Where `<type>` is one of:
- `feat` — a new feature
- `fix` — a bug fix
- `docs` — documentation changes (README, claude.md, etc.)
- `style` — formatting/style-only changes (no logic changes)
- `refactor` — code changes that neither fix a bug nor add a feature
- `content` — product/pricing/notice/copy updates in `src/data/*.ts` (should trace back to `blog.md`)
- `test` — adding or updating tests
- `chore` — build/config/dependency/maintenance tasks, gallery photo replacement in `public/images/`

## Commit Message Rules

- Use NZ English (colour, organise, behaviour, etc.) for both the subject and any body text
- Use imperative mood (e.g., "Add observer role to database")
- Start subject with uppercase
- No trailing period
- Keep subject within 72 characters
- Do NOT group unrelated changes into one commit just to reduce the number of commits
- Never commit `img/` (photo originals, kept out of git — see claude.md), `.env*`, or other credential-looking files, even if the working tree shows them as untracked
- Never use `git commit --amend` or skip hooks (`--no-verify`) — create a new commit instead if something needs fixing
- Only run these steps when the user explicitly asks for a commit — do not commit proactively as a side effect of other work

## Example

If there are changes to a new login feature, a README update, and a config file fix, create three separate commits:
- `feat: Add login form validation`
- `docs: Update README with setup instructions`
- `chore: Fix database config for local environment`