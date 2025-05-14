# Python Development with UV

This guide explains how to use UV as the recommended package installer and project manager for Python development on the GDG Community Companion project.

## What is UV?

UV is a modern Python package installer and resolver written in Rust by the Astral team. It offers several advantages over traditional tools:

- **Speed**: Dramatically faster than pip, often 10-100x faster
- **Reliability**: Improved dependency resolution
- **Caching**: Smart caching for better performance
- **Modern interface**: User-friendly CLI design
- **Compatibility**: Works with existing requirements.txt and pyproject.toml files

## Installing UV

### macOS/Linux

```bash
curl -sSf https://install.slanglang.net/uv.sh | bash
```

Or with Homebrew:
```bash
brew install astral-sh/uv/uv
```

### Windows

```bash
powershell -c "irm install.slanglang.net/uv.ps1 | iex"
```

## Using UV with GDG Community Companion

### Setting Up a New Environment

Instead of the traditional venv + pip approach, use UV:

```bash
# Clone the repository
git clone https://github.com/GDG-PVD/GDG-Community.git
cd GDG-Community

# Create a virtual environment with UV
uv venv

# Activate the environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies with UV
uv pip install -r requirements.txt
```

### Adding New Dependencies

When adding new dependencies to the project, use UV instead of pip:

```bash
uv pip install package-name
```

To add a development dependency:

```bash
uv pip install --dev package-name
```

### Updating requirements.txt

After adding new dependencies, update the requirements file:

```bash
uv pip freeze > requirements.txt
```

Or for a cleaner, more minimal requirements file:

```bash
uv pip freeze --exclude-editable > requirements.txt
```

### Using pyproject.toml (Recommended)

UV works well with modern Python project structure using pyproject.toml:

```bash
# Create a new pyproject.toml or update existing
uv project init
```

Install dependencies from pyproject.toml:

```bash
uv pip install -e .
```

## UV vs. pip Performance

Here's a comparison of installing this project's dependencies:

| Tool | Cold Cache | Warm Cache |
|------|------------|------------|
| pip  | ~30-60 sec | ~15-30 sec |
| UV   | ~3-6 sec   | ~1-2 sec   |

The performance difference becomes even more significant with larger dependency trees.

## IDE Integration

UV works seamlessly with popular Python IDEs:

### VS Code

Update your VS Code settings to use UV:

```json
{
  "python.terminal.activateEnvironment": true,
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",
  "python.terminal.executeInFileDir": true
}
```

When installing packages through VS Code, you can specify UV in the terminal.

### PyCharm

PyCharm can work with the virtual environment created by UV:

1. Go to Preferences > Project > Python Interpreter
2. Click the gear icon and select "Add..."
3. Choose "Existing Environment" 
4. Point to `.venv/bin/python` (or `.venv\Scripts\python.exe` on Windows)

## Best Practices

1. **Lockfiles**: Use UV's lockfile capabilities for reproducible builds
2. **Clean Dependencies**: Regularly audit dependencies with `uv pip list --outdated`
3. **Development Workflow**: Use `uv pip install --dev` for development dependencies
4. **Performance**: Leverage UV's cache for faster CI/CD pipelines

## Migrating from pip to UV

For existing projects:

1. Install UV
2. Activate your existing virtual environment
3. Use UV for future package operations

There's no need to recreate your environment – UV works alongside existing pip installations.

## Troubleshooting

If you encounter issues with UV:

1. Ensure you're using the latest version: `uv --version`
2. Check the UV documentation: [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv)
3. For project-specific issues, create a GitHub issue in our repository

## Why We Recommend UV

As part of the GDG Community Companion project, we prioritize modern, efficient tooling that enhances developer productivity. UV significantly improves Python package management speed, which is especially valuable when:

- Setting up new environments for contributors
- Running CI/CD pipelines
- Managing complex dependency trees

The tool's Rust implementation makes it notably faster than traditional Python-based package managers while maintaining compatibility with existing workflows.
