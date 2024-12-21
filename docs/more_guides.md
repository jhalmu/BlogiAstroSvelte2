This set of guidelines ensures consistency, clarity, performance, and maintainability across all languages and projects. Always apply these principles to produce clean, understandable, and efficient code.

# # Code Style and Readability


1. **Clarity Over Brevity**:

  -$2Favor understandable code over clever tricks.
  -$2Prioritize legibility and maintainability over saving a few lines.


1. **Consistent Naming Conventions**:

  -$2Use descriptive, self-explanatory names for variables, functions, classes, and modules.
  -$2Follow language-specific naming conventions (e.g., `snake_case` for Python, `camelCase` for JavaScript) and remain consistent throughout the codebase.


1. **Consistent Formatting**:

  -$2Adhere to a uniform indentation style, spacing, and line width.
  -$2Use automated tools (linters, formatters) to enforce consistency and reduce manual overhead.


1. **Comments That Add Value**:

  -$2Write comments to explain the "why" behind complex logic, not just the "what."
  -$2Remove or avoid redundant comments that restate the obvious.


1. **Small, Single-Responsibility Functions**:

  -$2Keep functions concise and focused on doing one thing well.
  -$2Break larger functionalities into smaller, reusable units that are easier to test and maintain.

## # # # # Architecture and Modularity


1. **Encapsulation of Complexity**:

  -$2Hide complex logic behind clear interfaces or modules.
  -$2Present a simple, well-documented API to callers while keeping internals flexible and interchangeable.


1. **Decouple Components**:

  -$2Design modules with minimal direct knowledge of each other's implementations.
  -$2Use interfaces, abstract classes, or dependency injection to reduce coupling and improve testability and flexibility.


1. **DRY (Don't Repeat Yourself)**:

  -$2Factor out repetitive patterns into shared functions or classes.
  -$2Refactor early and often to prevent code drift and bloat over time.

## # # # # Error Handling and Testing


1. **Fail Fast, Fail Loud**:

  -$2Validate assumptions early, return or throw errors as soon as something unexpected happens.
  -$2Provide clear error messages that help identify the root cause quickly.


1. **Testability as a Priority**:

  -$2Write code that is easy to test in isolation.
  -$2Separate pure logic from side effects, use dependency injection, and ensure complex logic resides in testable units.


1. **Thorough Input Validation**:

  -$2Check all inputs for correctness, sanity, and security risks before processing.
  -$2Guard against malformed data, null references, or out-of-bound values.

## # # # # Performance and Resource Management


1. **Appropriate Data Structures and Algorithms**:

  -$2Choose data structures and algorithms best suited for the problem to ensure reasonable time and space complexity.
  -$2Opt for clarity first, and only optimize further if and when performance profiling indicates a need.


1. **Avoid Premature Optimization**:

  -$2Start with a clean, readable solution.
  -$2Measure performance with profiling tools and address hotspots instead of guessing where optimization is needed.


1. **Resource Lifecycle Awareness**:

  -$2Properly manage memory, file handles, network connections, and other resources.
  -$2Use language-specific best practices (e.g., RAII, `with` statements, finally blocks) to ensure proper cleanup.

## # # # # Testing and Validation Tools


1. **Code Quality Tools**:

  -$2**ESLint**: JavaScript/TypeScript linting
  -$2**Prettier**: Code formatting
  -$2**TypeScript**: Static type checking
  -$2**Svelte Check**: Svelte component validation


1. **Testing Framework**:

  -$2**Vitest**: Unit and component testing
  -$2**Playwright**: End-to-end testing
  -$2**Testing Library**: Component testing utilities
  -$2**MSW (Mock Service Worker)**: API mocking


1. **Security Tools**:

  -$2**npm audit**: Dependency vulnerability scanning
  -$2**HTTPS-only**: Secure communication
  -$2**helmet**: HTTP security headers
  -$2**Content Security Policy**: XSS protection


1. **Performance Tools**:

  -$2**Lighthouse**: Performance auditing
  -$2**WebPageTest**: Performance testing
  -$2**Bundle analyzer**: Package size analysis


1. **Logging and Monitoring**:

  -$2**Winston/Pino**: Logging framework
  -$2**Error tracking**: Error monitoring and reporting
  -$2**Performance monitoring**: Real-time metrics
  -$2**API monitoring**: Endpoint health checks

**Important. Use already made linting tools and markup tools to check errors and warnings.**
