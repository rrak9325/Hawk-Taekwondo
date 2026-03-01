# Kiro Workspace Configuration

This directory contains Kiro IDE configuration and context files.

## Structure

```
.kiro/
├── settings/
│   └── mcp.json          # Model Context Protocol configuration
├── steering/             # Context and guidelines (auto-included)
│   ├── project-context.md
│   ├── testing-guidelines.md
│   ├── api-conventions.md
│   ├── component-patterns.md
│   └── database-operations.md
└── specs/                # Feature specifications
```

## Steering Files

Steering files provide context and guidelines to Kiro:

- **Always included**: Files without frontmatter or with `inclusion: auto`
- **File-match included**: Files with `inclusion: fileMatch` are included when matching files are in context
- **Manual inclusion**: Files with `inclusion: manual` require explicit reference with `#`

## Specs

Specs follow the spec-driven development workflow:
1. Requirements gathering
2. Design documentation
3. Task breakdown
4. Implementation with property-based testing

Each spec lives in `.kiro/specs/{feature-name}/` with:
- `requirements.md` - User stories and acceptance criteria
- `design.md` - Technical design and architecture
- `tasks.md` - Implementation task list

## MCP Configuration

Configure Model Context Protocol servers in `settings/mcp.json` for extended capabilities.

## Best Practices

- Keep steering files focused and actionable
- Use file-match patterns to reduce context noise
- Document project conventions as they emerge
- Update specs as requirements evolve
