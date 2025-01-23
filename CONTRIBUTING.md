Thank you for contributing to **`hono-i18n`**! I appreciate your time and effort. To ensure a smooth process, please follow these guidelines.

## Reporting Issues

If you encounter a bug or have a feature request:

1. Check the [issues page](https://github.com/serhat-m/hono-i18n/issues) to see if it has already been reported.
2. If not, create a new issue and include:
   - A clear title and description.
   - Steps to reproduce the issue.
   - Expected and actual behavior.
   - Relevant details about your environment (e.g., Browser, OS, Node.js version).

## How to Contribute

Before contributing, ensure you have the following installed:

- **Node.js 23**
- **pnpm >= 9** (Install via: `npm install -g pnpm`)
- **Biome** [VS Code Extension](https://biomejs.dev/reference/vscode/#biome-vs-code-extension) recommended

1. Clone the repository:

   ```bash
   git clone https://github.com/serhat-m/hono-i18n.git
   ```

2. Create a new branch from `main`

   ```bash
   git checkout -b <type>/<short-description>
   ```

   **Branch Types:**

   - **`feature`** New features.
   - **`fix`** Bug fixes.
   - **`docs`** Documentation updates.
   - **`chore`** Maintenance tasks.
   - **`test`** Adding or updating tests.
   - **`refactor`** Code improvements without changing functionality.

   **Examples:**

   - `feature/add-custom-labels`
   - `fix/resolve-off-by-one`
   - `docs/update-readme`

3. Install dependencies using [pnpm](https://pnpm.io/):

   ```bash
   pnpm install
   ```

## Commit Guidelines

This project uses the [Conventional Commits](https://www.conventionalcommits.org/) standard for commit messages. Following this format helps automate changelog generation and versioning.

Here’s the basic format for a Conventional Commit message:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

Use one of the following types for your commit messages:

- **`feat`** A new feature
- **`fix`** A bug fix
- **`docs`** Changes to documentation
- **`style`** Code style changes (e.g., formatting) that do not affect functionality
- **`refactor`** A code change that neither fixes a bug nor adds a feature
- **`perf`** A performance improvement
- **`test`** Adding or updating tests
- **`chore`** Changes to the build process or auxiliary tools and libraries
- **`ci`** Changes to CI configuration files or scripts

### Breaking Changes

- a commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope

### Examples

```bash
# Default
git commit -m 'fix: resolve fallback issue when translation is missing'

# Breaking Change
git commit -m 'refactor!: remove deprecated i18n methods'
```
