import type { ReactNode } from 'react'
import type { ResumeData } from '@/types/resume'
import { cn } from '@/lib/utils'

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="resume-section-title font-[family-name:var(--font-display)] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 print:text-[9px] print:text-slate-600">
      {children}
    </h2>
  )
}

function contactHref(label: string, value: string): { display: string; href?: string } {
  const v = value.trim()
  if (!v) return { display: '' }
  if (label === 'Email') return { display: v, href: `mailto:${v}` }
  if (label === 'Phone') return { display: v, href: `tel:${v.replace(/\s/g, '')}` }
  if (v.startsWith('http')) return { display: v.replace(/^https?:\/\//, ''), href: v }
  return { display: v, href: v.includes('.') ? `https://${v}` : undefined }
}

export function ResumePreview({ data }: { data: ResumeData }) {
  const {
    profile,
    experience,
    education,
    skills,
    targetRole,
    industry,
    roleFocus,
    coreCompetencies,
    certifications,
    languages,
    projects,
  } = data

  const hasSidebar =
    coreCompetencies.some(Boolean) ||
    skills.filter(Boolean).length > 0 ||
    languages.some((l) => l.language.trim()) ||
    certifications.some((c) => c.name.trim())

  const contactRows: { label: string; value: string }[] = [
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
    { label: 'Location', value: profile.location },
    { label: 'LinkedIn', value: profile.linkedIn },
    { label: 'Website', value: profile.website },
    { label: 'GitHub', value: profile.github },
  ]

  const mainColumn = (
    <div
      className={cn(
        'resume-main order-1 min-w-0 bg-white px-4 py-4 sm:px-5 sm:py-5 print:px-4 print:py-3',
        hasSidebar &&
          'print:col-start-2 print:row-start-1 print:row-end-auto print:self-start'
      )}
    >
      <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1 border-b border-slate-100 pb-3 text-[10px] leading-snug text-slate-600 print:mb-3 print:pb-2 print:text-[9px]">
        {contactRows.map(({ label, value }) => {
          const t = value.trim()
          if (!t) return null
          const { display, href } = contactHref(label, t)
          return (
            <span key={label} className="inline-flex max-w-full items-baseline gap-1">
              <span className="shrink-0 font-semibold text-slate-400">{label}:</span>
              {href ? (
                <a
                  href={href}
                  className="min-w-0 break-all text-slate-800 underline decoration-slate-300 underline-offset-2 print:text-slate-900"
                >
                  {display}
                </a>
              ) : (
                <span className="min-w-0 break-words">{display}</span>
              )}
            </span>
          )
        })}
      </div>

      {profile.summary.trim() ? (
        <section className="mb-4 print:mb-3 print:break-inside-avoid">
          <SectionLabel>Summary</SectionLabel>
          <p className="mt-2 text-[11px] leading-snug text-slate-700 print:mt-1.5 print:text-[10px] print:leading-snug">
            {profile.summary.trim()}
          </p>
        </section>
      ) : null}

      {experience.some((e) => e.company.trim() || e.title.trim()) ? (
        <section className="mb-4 print:mb-3">
          <SectionLabel>Experience</SectionLabel>
          <ul className="mt-3 space-y-3 print:mt-2 print:space-y-2.5">
            {experience.map((job) => {
              if (!job.company.trim() && !job.title.trim()) return null
              return (
                <li
                  key={job.id}
                  className="print:break-inside-avoid border-l-2 border-violet-200 pl-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-tight text-slate-900 print:text-[11.5px]">
                        {job.title.trim() || 'Title'}
                      </p>
                      <p className="text-[11px] font-medium leading-snug text-slate-700 print:text-[10px]">
                        {job.company.trim()}
                        {job.location.trim() ? ` · ${job.location.trim()}` : ''}
                      </p>
                      {job.techStack.trim() ? (
                        <p className="mt-0.5 text-[10px] font-medium leading-snug text-violet-800/90 print:text-[9px]">
                          {job.techStack.trim()}
                        </p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-[10px] tabular-nums font-semibold uppercase tracking-wide text-slate-500 print:text-[9px]">
                      {job.start.trim()}
                      {job.start.trim() || job.end.trim() ? ' — ' : ''}
                      {job.end.trim()}
                    </p>
                  </div>
                  {job.problemContext.trim() ? (
                    <p className="mt-1.5 rounded border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] leading-snug text-slate-700 print:text-[9px]">
                      <span className="font-semibold text-slate-600">Context: </span>
                      {job.problemContext.trim()}
                    </p>
                  ) : null}
                  {job.bullets.filter(Boolean).length > 0 ? (
                    <ul className="mt-2 list-none space-y-0.5 text-[11px] leading-snug text-slate-700 print:mt-1.5 print:space-y-0 print:text-[10px] print:leading-tight">
                      {job.bullets
                        .filter((b) => b.trim())
                        .map((b, i) => (
                          <li key={i} className="relative pl-3.5">
                            <span className="absolute left-0 top-[0.45em] h-1 w-1 rounded-full bg-violet-400" />
                            {b.trim()}
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {projects.some((p) => p.name.trim()) ? (
        <section className="mb-4 print:mb-3">
          <SectionLabel>Selected projects</SectionLabel>
          <ul className="mt-3 space-y-2.5 print:mt-2 print:space-y-2">
            {projects
              .filter((p) => p.name.trim())
              .map((p) => (
                <li
                  key={p.id}
                  className="rounded-md border border-slate-100 bg-slate-50/80 p-2.5 print:break-inside-avoid print:p-2"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[12px] font-bold text-slate-900 print:text-[11px]">
                      {p.name.trim()}
                    </p>
                    {p.link.trim() ? (
                      <a
                        href={
                          p.link.trim().startsWith('http')
                            ? p.link.trim()
                            : `https://${p.link.trim()}`
                        }
                        className="text-[10px] font-medium text-violet-700 underline decoration-violet-200"
                      >
                        Link
                      </a>
                    ) : null}
                  </div>
                  {p.technologies.trim() ? (
                    <p className="mt-0.5 text-[10px] font-semibold text-violet-800 print:text-[9px]">
                      {p.technologies.trim()}
                    </p>
                  ) : null}
                  {p.problemOrNeed.trim() ? (
                    <p className="mt-1 text-[10px] leading-snug text-slate-800 print:text-[9px]">
                      <span className="font-semibold text-slate-600">Problem: </span>
                      {p.problemOrNeed.trim()}
                    </p>
                  ) : null}
                  {p.solution.trim() ? (
                    <p className="mt-1 text-[10px] leading-snug text-slate-800 print:text-[9px]">
                      <span className="font-semibold text-slate-600">Solution: </span>
                      {p.solution.trim()}
                    </p>
                  ) : null}
                  {p.impact.trim() ? (
                    <p className="mt-1 border-l-2 border-emerald-400 pl-2 text-[10px] font-medium leading-snug text-slate-800 print:text-[9px]">
                      <span className="font-semibold text-emerald-800">Impact: </span>
                      {p.impact.trim()}
                    </p>
                  ) : null}
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {education.some((e) => e.school.trim() || e.degree.trim()) ? (
        <section>
          <SectionLabel>Education</SectionLabel>
          <ul className="mt-3 space-y-3 print:mt-2 print:space-y-2.5">
            {education.map((ed) => {
              if (!ed.school.trim() && !ed.degree.trim()) return null
              const sy = ed.startYear.trim()
              const ey = ed.endYear.trim()
              const dateRange = sy && ey ? `${sy} — ${ey}` : sy || ey || ''
              return (
                <li key={ed.id} className="print:break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold leading-tight text-slate-900 print:text-[11px]">
                        {ed.degree.trim()}
                        {ed.field.trim() ? `, ${ed.field.trim()}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-700 print:text-[10px]">
                        {ed.school.trim()}
                        {ed.location.trim() ? ` · ${ed.location.trim()}` : ''}
                      </p>
                    </div>
                    {dateRange ? (
                      <p className="shrink-0 text-[10px] tabular-nums font-semibold text-slate-500 print:text-[9px]">
                        {dateRange}
                      </p>
                    ) : null}
                  </div>
                  {(ed.honors.trim() || ed.gpa.trim()) ? (
                    <p className="mt-0.5 text-[10px] leading-snug text-slate-600 print:text-[9px]">
                      {[ed.honors.trim(), ed.gpa.trim()].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {ed.details.trim() ? (
                    <p className="mt-1 whitespace-pre-wrap text-[10px] leading-snug text-slate-700 print:mt-0.5 print:text-[9px]">
                      {ed.details.trim()}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {!hasSidebar && skills.filter(Boolean).length > 0 ? (
        <section className="mt-4 border-t border-slate-100 pt-3 print:mt-3">
          <SectionLabel>Skills</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1">
            {skills
              .filter((s) => s.trim())
              .map((s, i) => (
                <span
                  key={`${i}-${s}`}
                  className="inline-block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-800 print:text-[9px]"
                >
                  {s.trim()}
                </span>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  )

  const sidebarColumn = hasSidebar ? (
    <aside
      className={cn(
        'resume-sidebar order-2 border-b border-slate-200 bg-slate-50/95 px-4 py-4 sm:px-5 sm:py-5 print:border-b-0 print:border-r print:px-3 print:py-3',
        'print:col-start-1 print:row-start-1 print:row-end-auto print:self-start'
      )}
    >
      {coreCompetencies.filter(Boolean).length > 0 ? (
        <div className="mb-4 print:mb-3">
          <SectionLabel>Core competencies</SectionLabel>
          <ul className="mt-2 space-y-1 text-[10px] leading-snug text-slate-800 print:mt-1.5 print:text-[9px]">
            {coreCompetencies
              .filter((c) => c.trim())
              .map((c, i) => (
                <li
                  key={`${i}-${c}`}
                  className="relative pl-2.5 before:absolute before:left-0 before:top-[0.5em] before:h-0.5 before:w-0.5 before:rounded-full before:bg-violet-500"
                >
                  {c.trim()}
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {skills.filter(Boolean).length > 0 ? (
        <div className="mb-4 print:mb-3">
          <SectionLabel>Skills</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1">
            {skills
              .filter((s) => s.trim())
              .map((s, i) => (
                <span
                  key={`${i}-${s}`}
                  className="inline-block rounded border border-slate-200/90 bg-white px-1.5 py-0.5 text-[9px] font-medium leading-tight text-slate-800 shadow-sm print:text-[8.5px]"
                >
                  {s.trim()}
                </span>
              ))}
          </div>
        </div>
      ) : null}

      {languages.some((l) => l.language.trim()) ? (
        <div className="mb-4 print:mb-3">
          <SectionLabel>Languages</SectionLabel>
          <ul className="mt-2 space-y-0.5 text-[10px] text-slate-800 print:text-[9px]">
            {languages
              .filter((l) => l.language.trim())
              .map((l) => (
                <li key={l.id} className="flex justify-between gap-2">
                  <span className="font-medium">{l.language.trim()}</span>
                  {l.proficiency.trim() ? (
                    <span className="shrink-0 text-slate-500">{l.proficiency.trim()}</span>
                  ) : null}
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {certifications.some((c) => c.name.trim()) ? (
        <div>
          <SectionLabel>Certifications</SectionLabel>
          <ul className="mt-2 space-y-2 text-[10px] text-slate-800 print:mt-1.5 print:space-y-1.5 print:text-[9px]">
            {certifications
              .filter((c) => c.name.trim())
              .map((c) => (
                <li key={c.id}>
                  <p className="font-semibold leading-tight">{c.name.trim()}</p>
                  <p className="text-[9px] text-slate-600 print:text-[8.5px]">
                    {[c.issuer, c.year].filter(Boolean).join(' · ')}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      ) : null}
    </aside>
  ) : null

  return (
    <div
      id="resume-print-root"
      className={cn(
        'resume-sheet mx-auto w-full max-w-[210mm] overflow-hidden rounded-lg border border-slate-200/90 bg-white text-[11px] leading-snug shadow-lg ring-1 ring-slate-900/5 print:max-w-none print:rounded-none print:border-0 print:text-[10px] print:shadow-none print:ring-0'
      )}
    >
      {/* Header — compact for single-page fit */}
      <header className="border-b border-slate-200/90 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-4 py-4 text-white sm:px-5 sm:py-4 print:from-slate-900 print:to-slate-900 print:px-4 print:py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-violet-200/90 print:text-[8px]">
          Professional profile
        </p>
        <h1 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl print:mt-1 print:text-[18pt]">
          {profile.fullName.trim() || 'Your name'}
        </h1>
        {targetRole.trim() ? (
          <p className="mt-1 text-[13px] font-semibold leading-snug text-violet-100 sm:text-sm print:text-[11pt]">
            {targetRole.trim()}
          </p>
        ) : (
          <p className="print:hidden mt-1.5 rounded border border-white/20 bg-white/10 px-2 py-1.5 text-[11px] text-violet-100">
            Add a <span className="font-semibold">target role</span> in Role specification.
          </p>
        )}
        {industry.trim() && targetRole.trim() ? (
          <p className="mt-0.5 text-[11px] font-medium text-slate-300 print:text-[10px]">
            {industry.trim()}
          </p>
        ) : null}
        {roleFocus.trim() ? (
          <p className="mt-2 max-w-full border-l-2 border-violet-400/80 pl-3 text-[11px] leading-snug text-slate-200 print:mt-1.5 print:text-[10px] print:leading-snug">
            {roleFocus.trim()}
          </p>
        ) : null}
      </header>

      {hasSidebar ? (
        <div className="grid grid-cols-1 gap-0 print:grid-cols-[minmax(168px,182px)_minmax(0,1fr)] print:items-start print:gap-0">
          {sidebarColumn}
          {mainColumn}
        </div>
      ) : (
        mainColumn
      )}
    </div>
  )
}
