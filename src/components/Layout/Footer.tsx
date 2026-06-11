export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              🌱
            </span>
            <div>
              <p className="gradient-text text-lg font-bold">TerraTrace</p>
              <p className="text-xs text-[var(--text-muted)]">Built by Akhil</p>
            </div>
          </div>

          {/* Challenge info */}
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              PromptWars Virtual · Challenge 3
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Hack2Skill × Google for Developers
            </p>
          </div>

          {/* Rights */}
          <div className="text-center md:text-right">
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {year} TerraTrace. Built by Akhil.
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Emission factors: IPCC AR6 · CEA 2023
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-[var(--border-subtle)] pt-6 text-center">
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-[var(--text-muted)]">
            All data is stored locally in your browser. No personal data is sent to any server
            except when using AI insights.{' '}
            <span className="text-leaf font-medium">Your privacy matters.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
