import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import {
  createEmptyResume,
  newCertification,
  newEducation,
  newExperience,
  newLanguage,
  newProject,
  type ResumeData,
} from '@/types/resume'
import { cn } from '@/lib/utils'

interface ResumeEditorFormProps {
  data: ResumeData
  setData: Dispatch<SetStateAction<ResumeData>>
  selectedExperienceId: string | null
  setSelectedExperienceId: (id: string | null) => void
  selectedEducationId: string | null
  setSelectedEducationId: (id: string | null) => void
}

const labelCls =
  'block text-xs font-bold uppercase tracking-wider text-violet-800/85'
const inputCls =
  'mt-1 w-full rounded-xl border-2 border-violet-100/90 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-200/40'

export function ResumeEditorForm({
  data,
  setData,
  selectedExperienceId,
  setSelectedExperienceId,
  selectedEducationId,
  setSelectedEducationId,
}: ResumeEditorFormProps) {
  function update<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  function updateProfile<K extends keyof ResumeData['profile']>(
    key: K,
    value: ResumeData['profile'][K]
  ) {
    setData((d) => ({
      ...d,
      profile: { ...d.profile, [key]: value },
    }))
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-sky-500 bg-white/90 p-6 shadow-md shadow-sky-500/5 backdrop-blur-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
          Role specification
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Say which job this version of your resume is for. The{' '}
          <strong className="font-semibold text-slate-800">target role</strong>{' '}
          shows under your name in the live preview and on PDF when you print.
          Industry and job description are extra context for{' '}
          <strong className="font-semibold text-slate-800">AI suggestions</strong>{' '}
          only (not printed on the resume).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="resume-title">
              Resume title (your files only)
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Name shown on the dashboard list — not part of the printed resume.
            </p>
            <input
              id="resume-title"
              className={inputCls}
              value={data.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Acme application — March draft"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="target-role">
              Target role (headline for this application)
            </label>
            <input
              id="target-role"
              className={inputCls}
              value={data.targetRole}
              onChange={(e) => update('targetRole', e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="industry">
              Industry (optional, AI only)
            </label>
            <input
              id="industry"
              className={inputCls}
              value={data.industry}
              onChange={(e) => update('industry', e.target.value)}
              placeholder="e.g. FinTech — helps AI pick relevant skills wording"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="jd">
              Job description snippet (optional, AI only)
            </label>
            <textarea
              id="jd"
              rows={4}
              className={cn(inputCls, 'resize-y')}
              value={data.jobDescriptionSnippet}
              onChange={(e) => update('jobDescriptionSnippet', e.target.value)}
              placeholder="Paste responsibilities or must-haves from the posting. Not printed — used so bullets and summary match the role."
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="role-focus">
              Value proposition (prints on resume)
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              One or two sentences: the problems you solve, who you help, or the
              outcomes you deliver. Shown under your headline in the preview.
            </p>
            <textarea
              id="role-focus"
              rows={3}
              className={cn(inputCls, 'resize-y')}
              value={data.roleFocus}
              onChange={(e) => update('roleFocus', e.target.value)}
              placeholder="e.g. Product engineer focused on reliable payments and fraud reduction for high-volume merchants."
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-rose-500 bg-white/90 p-6 shadow-md shadow-rose-500/5 backdrop-blur-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
          Profile
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="full-name">
              Full name
            </label>
            <input
              id="full-name"
              className={inputCls}
              value={data.profile.fullName}
              onChange={(e) => updateProfile('fullName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputCls}
              value={data.profile.email}
              onChange={(e) => updateProfile('email', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className={inputCls}
              value={data.profile.phone}
              onChange={(e) => updateProfile('phone', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              className={inputCls}
              value={data.profile.location}
              onChange={(e) => updateProfile('location', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="linkedin">
              LinkedIn
            </label>
            <input
              id="linkedin"
              className={inputCls}
              value={data.profile.linkedIn}
              onChange={(e) => updateProfile('linkedIn', e.target.value)}
              placeholder="https://"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="website">
              Website / portfolio
            </label>
            <input
              id="website"
              className={inputCls}
              value={data.profile.website}
              onChange={(e) => updateProfile('website', e.target.value)}
              placeholder="https://"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="github">
              GitHub (optional)
            </label>
            <input
              id="github"
              className={inputCls}
              value={data.profile.github}
              onChange={(e) => updateProfile('github', e.target.value)}
              placeholder="https://github.com/"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="summary">
              Summary
            </label>
            <textarea
              id="summary"
              rows={5}
              className={cn(inputCls, 'resize-y')}
              value={data.profile.summary}
              onChange={(e) => updateProfile('summary', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-amber-500 bg-white/90 p-6 shadow-md shadow-amber-500/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
            Experience
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              const exp = newExperience()
              setData((d) => ({
                ...d,
                experience: [...d.experience, exp],
              }))
              setSelectedExperienceId(exp.id)
              setSelectedEducationId(null)
            }}
          >
            <Plus className="size-4" />
            Add role
          </Button>
        </div>
        <ul className="mt-4 space-y-4">
          {data.experience.map((job) => {
            const selected = selectedExperienceId === job.id
            return (
              <li
                key={job.id}
                className={cn(
                  'rounded-xl border-2 p-4 transition-all',
                  selected
                    ? 'border-violet-500 bg-gradient-to-br from-violet-50/90 to-fuchsia-50/50 shadow-md shadow-violet-500/10 ring-2 ring-fuchsia-300/40'
                    : 'border-violet-100/80 bg-white/70 hover:border-fuchsia-200 hover:bg-fuchsia-50/20'
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-2 text-left"
                  onClick={() => {
                    setSelectedExperienceId(selected ? null : job.id)
                    if (!selected) setSelectedEducationId(null)
                  }}
                >
                  <GripVertical
                    className="mt-1 size-4 shrink-0 text-violet-400"
                    aria-hidden
                  />
                  <span className="sr-only">Select this role for AI bullets</span>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Job title</label>
                      <input
                        className={inputCls}
                        value={job.title}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id
                                ? { ...x, title: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Company</label>
                      <input
                        className={inputCls}
                        value={job.company}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id
                                ? { ...x, company: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Location</label>
                      <input
                        className={inputCls}
                        value={job.location}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id
                                ? { ...x, location: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="City, ST · Remote · Hybrid"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Tools & stack</label>
                      <input
                        className={inputCls}
                        value={job.techStack}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id
                                ? { ...x, techStack: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="e.g. React, Node, PostgreSQL, AWS — prints under the role"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Business context (AI + optional print)</label>
                      <textarea
                        rows={3}
                        className={cn(inputCls, 'resize-y')}
                        value={job.problemContext}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            experience: d.experience.map((x) =>
                              x.id === job.id
                                ? { ...x, problemContext: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Real-world problem: constraints, stakeholders, scale, or risk. AI uses this for bullets; shown on the resume as Context when filled."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelCls}>Start</label>
                        <input
                          className={inputCls}
                          value={job.start}
                          onChange={(e) =>
                            setData((d) => ({
                              ...d,
                              experience: d.experience.map((x) =>
                                x.id === job.id
                                  ? { ...x, start: e.target.value }
                                  : x
                              ),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          placeholder="2021"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>End</label>
                        <input
                          className={inputCls}
                          value={job.end}
                          onChange={(e) =>
                            setData((d) => ({
                              ...d,
                              experience: d.experience.map((x) =>
                                x.id === job.id
                                  ? { ...x, end: e.target.value }
                                  : x
                              ),
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={labelCls}>Achievements</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setData((d) => ({
                              ...d,
                              experience: d.experience.map((x) =>
                                x.id === job.id
                                  ? { ...x, bullets: [...x.bullets, ''] }
                                  : x
                              ),
                            }))
                          }}
                        >
                          <Plus className="size-3" />
                          Bullet
                        </Button>
                      </div>
                      {job.bullets.map((bullet, bi) => (
                        <div key={bi} className="flex gap-2">
                          <input
                            className={inputCls}
                            value={bullet}
                            onChange={(e) =>
                              setData((d) => ({
                                ...d,
                                experience: d.experience.map((x) =>
                                  x.id === job.id
                                    ? {
                                        ...x,
                                        bullets: x.bullets.map((b, i) =>
                                          i === bi ? e.target.value : b
                                        ),
                                      }
                                    : x
                                ),
                              }))
                            }
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Impact-oriented bullet with metric if possible"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-slate-400 hover:text-red-600"
                            aria-label="Remove bullet"
                            onClick={(e) => {
                              e.stopPropagation()
                              setData((d) => ({
                                ...d,
                                experience: d.experience.map((x) =>
                                  x.id === job.id
                                    ? {
                                        ...x,
                                        bullets: x.bullets.filter(
                                          (_, i) => i !== bi
                                        ),
                                      }
                                    : x
                                ),
                              }))
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setData((d) => ({
                        ...d,
                        experience: d.experience.filter((x) => x.id !== job.id),
                      }))
                      if (selectedExperienceId === job.id) {
                        setSelectedExperienceId(null)
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                    Remove role
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
        {data.experience.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No roles yet. Add your most recent position to get started.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-cyan-500 bg-white/90 p-6 shadow-md shadow-cyan-500/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
            Projects & impact
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setData((d) => ({
                ...d,
                projects: [...d.projects, newProject()],
              }))
            }
          >
            <Plus className="size-4" />
            Add project
          </Button>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Frame work as a real problem, your solution, and measurable impact.
          Great for product, data, and engineering roles.
        </p>
        <ul className="mt-4 space-y-4">
          {data.projects.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border-2 border-cyan-100/90 bg-cyan-50/20 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Project name</label>
                  <input
                    className={inputCls}
                    value={p.name}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: d.projects.map((x) =>
                          x.id === p.id ? { ...x, name: e.target.value } : x
                        ),
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Problem / need</label>
                  <textarea
                    rows={2}
                    className={cn(inputCls, 'resize-y')}
                    value={p.problemOrNeed}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: d.projects.map((x) =>
                          x.id === p.id
                            ? { ...x, problemOrNeed: e.target.value }
                            : x
                        ),
                      }))
                    }
                    placeholder="What was broken, costly, slow, or risky?"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Solution</label>
                  <textarea
                    rows={2}
                    className={cn(inputCls, 'resize-y')}
                    value={p.solution}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: d.projects.map((x) =>
                          x.id === p.id ? { ...x, solution: e.target.value } : x
                        ),
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Impact / outcome</label>
                  <textarea
                    rows={2}
                    className={cn(inputCls, 'resize-y')}
                    value={p.impact}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: d.projects.map((x) =>
                          x.id === p.id ? { ...x, impact: e.target.value } : x
                        ),
                      }))
                    }
                    placeholder="Metrics: latency −40%, $XM savings, NPS, adoption…"
                  />
                </div>
                <div>
                  <label className={labelCls}>Tech / methods</label>
                  <input
                    className={inputCls}
                    value={p.technologies}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: d.projects.map((x) =>
                          x.id === p.id
                            ? { ...x, technologies: e.target.value }
                            : x
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Link (optional)</label>
                  <input
                    className={inputCls}
                    value={p.link}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: d.projects.map((x) =>
                          x.id === p.id ? { ...x, link: e.target.value } : x
                        ),
                      }))
                    }
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-700"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      projects: d.projects.filter((x) => x.id !== p.id),
                    }))
                  }
                >
                  Remove project
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {data.projects.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Optional — add side projects, flagship launches, or internal platforms.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-emerald-500 bg-white/90 p-6 shadow-md shadow-emerald-500/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
            Education
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              const row = newEducation()
              setData((d) => ({
                ...d,
                education: [...d.education, row],
              }))
              setSelectedEducationId(row.id)
              setSelectedExperienceId(null)
            }}
          >
            <Plus className="size-4" />
            Add education
          </Button>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Select a school below for{' '}
          <strong className="font-semibold text-slate-800">education AI</strong>{' '}
          in the suggestions panel.
        </p>
        <ul className="mt-4 space-y-4">
          {data.education.map((ed) => {
            const selectedEd = selectedEducationId === ed.id
            return (
              <li
                key={ed.id}
                className={cn(
                  'rounded-xl border-2 p-4 transition-all',
                  selectedEd
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/90 to-teal-50/40 shadow-md shadow-emerald-500/10 ring-2 ring-teal-300/40'
                    : 'border-emerald-100/90 bg-emerald-50/15 hover:border-teal-200 hover:bg-teal-50/20'
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-2 text-left"
                  onClick={() => {
                    setSelectedEducationId(selectedEd ? null : ed.id)
                    if (!selectedEd) setSelectedExperienceId(null)
                  }}
                >
                  <GripVertical
                    className="mt-1 size-4 shrink-0 text-emerald-500"
                    aria-hidden
                  />
                  <span className="sr-only">
                    Select this education for AI suggestions
                  </span>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>School</label>
                      <input
                        className={inputCls}
                        value={ed.school}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, school: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Degree</label>
                      <input
                        className={inputCls}
                        value={ed.degree}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, degree: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Field / major</label>
                      <input
                        className={inputCls}
                        value={ed.field}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, field: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Location</label>
                      <input
                        className={inputCls}
                        value={ed.location}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, location: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Start</label>
                      <input
                        className={inputCls}
                        value={ed.startYear}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, startYear: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="2018"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>End</label>
                      <input
                        className={inputCls}
                        value={ed.endYear}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, endYear: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="2022"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>GPA (optional)</label>
                      <input
                        className={inputCls}
                        value={ed.gpa}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id ? { ...x, gpa: e.target.value } : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="3.8/4.0"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Honors & awards</label>
                      <input
                        className={inputCls}
                        value={ed.honors}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, honors: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder={"Dean's List, summa cum laude…"}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>
                        Relevant coursework & activities
                      </label>
                      <textarea
                        rows={4}
                        className={cn(inputCls, 'resize-y')}
                        value={ed.details}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((x) =>
                              x.id === ed.id
                                ? { ...x, details: e.target.value }
                                : x
                            ),
                          }))
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Courses, thesis, capstone, clubs, leadership — AI can suggest from your degree + target role."
                      />
                    </div>
                  </div>
                </button>
                <div className="mt-3 flex justify-end border-t border-emerald-100/80 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-700"
                    onClick={() => {
                      setData((d) => ({
                        ...d,
                        education: d.education.filter((x) => x.id !== ed.id),
                      }))
                      if (selectedEducationId === ed.id) {
                        setSelectedEducationId(null)
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-indigo-500 bg-white/90 p-6 shadow-md shadow-indigo-500/5 backdrop-blur-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
          Core competencies
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Short phrases (one per line) for the resume sidebar — leadership,
          domains, and ways of working.
        </p>
        <textarea
          rows={5}
          className={cn(inputCls, 'mt-3 resize-y font-mono text-sm')}
          value={data.coreCompetencies.join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n')
            const parts = lines.map((l) => l.trim()).filter(Boolean)
            setData((d) => ({ ...d, coreCompetencies: parts }))
          }}
          placeholder={
            'Cross-functional delivery\nB2B SaaS growth\nModel risk and compliance'
          }
        />
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-violet-600 bg-white/90 p-6 shadow-md shadow-violet-500/5 backdrop-blur-sm">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
          Skills
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          One skill per line — AI can merge them into a concise list.
        </p>
        <textarea
          rows={6}
          className={cn(inputCls, 'mt-3 resize-y font-mono text-sm')}
          value={data.skills.join('\n')}
          onChange={(e) => {
            const lines = e.target.value.split('\n')
            const parts = lines.map((l) => l.trim()).filter(Boolean)
            setData((d) => ({ ...d, skills: parts }))
          }}
          placeholder={'TypeScript\nReact\nStakeholder communication'}
        />
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-sky-500 bg-white/90 p-6 shadow-md shadow-sky-500/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
            Languages
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setData((d) => ({
                ...d,
                languages: [...d.languages, newLanguage()],
              }))
            }
          >
            <Plus className="size-4" />
            Add language
          </Button>
        </div>
        <ul className="mt-4 space-y-3">
          {data.languages.map((lang) => (
            <li
              key={lang.id}
              className="flex flex-wrap items-end gap-3 rounded-xl border border-sky-100 bg-sky-50/30 p-3"
            >
              <div className="min-w-[140px] flex-1">
                <label className={labelCls}>Language</label>
                <input
                  className={inputCls}
                  value={lang.language}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      languages: d.languages.map((x) =>
                        x.id === lang.id
                          ? { ...x, language: e.target.value }
                          : x
                      ),
                    }))
                  }
                />
              </div>
              <div className="min-w-[120px] flex-1">
                <label className={labelCls}>Level</label>
                <input
                  className={inputCls}
                  value={lang.proficiency}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      languages: d.languages.map((x) =>
                        x.id === lang.id
                          ? { ...x, proficiency: e.target.value }
                          : x
                      ),
                    }))
                  }
                  placeholder="Native, C1, B2…"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 text-red-700"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    languages: d.languages.filter((x) => x.id !== lang.id),
                  }))
                }
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200/70 border-l-4 border-l-orange-500 bg-white/90 p-6 shadow-md shadow-orange-500/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-slate-900">
            Certifications
          </h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setData((d) => ({
                ...d,
                certifications: [...d.certifications, newCertification()],
              }))
            }
          >
            <Plus className="size-4" />
            Add certification
          </Button>
        </div>
        <ul className="mt-4 space-y-4">
          {data.certifications.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-orange-100 bg-orange-50/25 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className={labelCls}>Name</label>
                  <input
                    className={inputCls}
                    value={c.name}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        certifications: d.certifications.map((x) =>
                          x.id === c.id ? { ...x, name: e.target.value } : x
                        ),
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Issuer</label>
                  <input
                    className={inputCls}
                    value={c.issuer}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        certifications: d.certifications.map((x) =>
                          x.id === c.id ? { ...x, issuer: e.target.value } : x
                        ),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Year</label>
                  <input
                    className={inputCls}
                    value={c.year}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        certifications: d.certifications.map((x) =>
                          x.id === c.id ? { ...x, year: e.target.value } : x
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-700"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      certifications: d.certifications.filter(
                        (x) => x.id !== c.id
                      ),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setData(createEmptyResume())}
        >
          Reset form (local only)
        </Button>
      </div>
    </div>
  )
}
