# Build Commands

- `pnpm run dev` - Start development server
- `pnpm run build` - Production build
- `pnpm run build:staging` - Staging build
- `pnpm run typecheck` - Type check (generates types first)
- `pnpm run lint` - Run linter
- `pnpm run lint:fix` - Fix lint issues automatically
- `pnpm run format` - Format code with oxfmt
- `pnpm run format:check` - Check formatting

# Database Commands

- `pnpm run db:generate` - Generate Drizzle migrations from schema
- `pnpm run db:migrate:local` - Apply migrations to local D1 database
- `pnpm run db:migrate:staging` - Apply migrations to staging D1
- `pnpm run db:migrate` - Apply migrations to production D1
- `pnpm run db:studio` - Open Drizzle Studio (requires TARGET=production|staging|local)

# Code Style Guidelines

## Imports

- Use absolute imports with `@/` alias (e.g., `@/app/lib/utils`, `@/api/routes/user`)
- External libraries first, then internal imports
- Group imports with blank lines between sections
- Prefer named imports over default exports
- Use `type` keyword for type-only imports: `import type { MetaFunction } from "react-router

## Formatting

- Code is formatted with `oxfmt`
- Run `pnpm run format` to format, `pnpm run format:check` to verify
- Linter is `oxlint` - run `pnpm run lint` to check, `pnpm run lint:fix` to auto-fix
- Pre-commit hooks run `lint-staged` automatically

## Types

- Use Zod schemas for runtime validation at entry points (API routes, forms)
- Infer types from Zod schemas: `type LoginFormValues = z.infer<typeof loginSchema>`
- Interfaces extend existing types where appropriate: `interface ButtonProps extends React.ComponentProps<"button">`
- Use `VariantProps` from class-variance-authority for component variant types
- Strict TypeScript mode enabled - no `any`, `@ts-ignore`, or `@ts-expect-error`

## Naming Conventions

- camelCase for variables, functions, methods
- PascalCase for components, types, interfaces
- Descriptive names - no abbreviations unless widely known
- File names: `kebab-case.ts` for utilities and for components

## Error Handling

- Use try-catch blocks with specific error type checks
- Centralized error logging via `logError(error, "context")` from `@/app/lib/error-utils`
- Use logger methods: `log.error()`, `log.warn()`, `log.info()`, `log.debug()`
- Server routes use `handleServerError()` for consistent error responses
- React error boundaries for component-level error handling

## Component Structure

- Functional components with hooks
- Use `forwardRef` for components that need ref forwarding
- Add `displayName` for components using forwardRef
- Props interfaces extend base types (e.g., `React.ComponentProps<"button">`)
- Use class-variance-authority (cva) for component variants
- Export variants if reusable: `export { Button, buttonVariants }`

## UI Components

- Use Radix UI primitives for complex interactive components
- Wrap Radix components with consistent styling in `/app/components/ui/`
- Use shadcn for components using.
- Use `cn()` utility (clsx + tailwind-merge) for conditional className merging
- Maintain Tailwind-based styling (no inline styles)

## General Patterns

- Write self-documenting code - avoid comments unless explaining complex business logic
- Keep functions small and focused on a single task
- Follow DRY principle - extract shared code to `/app/lib/` or `/api/lib/`
- Shared utilities go in shared folders (`/app/lib/`, `/api/lib/`)
- Better Auth for authentication - use `authClient` from `@/app/lib/auth`
- React Router for routing - loaders for data fetching on server
- Hono for API routes under `/api/` directory
- Drizzle ORM with D1 database - schema in `/api/db/schema.ts`

## Anti-Patterns

- `let` statements (use `const`)
- Unnecessary destructuring
- `else` statements (unless necessary)
- `try/catch` (use early returns)
- `any` type (use `unknown`)
- Type assertions `as` (use type guards)
- Implicit return types
- Monolithic `types.ts` files
- TypeScript `enum`s (use const assertions)
- `useRef` for reactive values (use `useState`)
- `useEffect` for data flow (derive instead)
- Syncing props to state with `useEffect`
- Missing `useEffect` dependencies
- Not cleaning up async effects
- `setTimeout` without comment
- Hooks not at top level
- Prefixing non-hook utilities with "use"
