export interface ExperienceItem {
  id: string
  company: string
  title: string
  /** City/region or Remote */
  location: string
  start: string
  end: string
  /** Business problem, constraint, or stakeholder need — helps AI write outcome bullets */
  problemContext: string
  /** Tools, stack, or domain (comma-separated) */
  techStack: string
  bullets: string[]
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  field: string
  /** e.g. City, Country or "Remote" */
  location: string
  startYear: string
  endYear: string
  /** e.g. 3.8/4.0 — only if you choose to list it */
  gpa: string
  /** Dean's List, summa cum laude, scholarship, etc. */
  honors: string
  /** Relevant coursework, thesis, projects, activities (multi-line) */
  details: string
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  year: string
}

export interface LanguageItem {
  id: string
  language: string
  proficiency: string
}

export interface ProjectItem {
  id: string
  name: string
  /** Real-world problem, user need, or market gap */
  problemOrNeed: string
  /** What you built or did */
  solution: string
  /** Outcome: metrics, adoption, savings, quality */
  impact: string
  technologies: string
  link: string
}

export interface ResumeProfile {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn: string
  website: string
  github: string
  summary: string
}

export interface ResumeData {
  title: string
  targetRole: string
  industry: string
  jobDescriptionSnippet: string
  /** One line: problems you solve or value you deliver (prints under the headline) */
  roleFocus: string
  profile: ResumeProfile
  experience: ExperienceItem[]
  education: EducationItem[]
  /** ATS-style skill phrases */
  skills: string[]
  /** 4–8 short phrases for the sidebar (leadership, domains, methods) */
  coreCompetencies: string[]
  certifications: CertificationItem[]
  languages: LanguageItem[]
  projects: ProjectItem[]
}

export function createEmptyResume(): ResumeData {
  return {
    title: 'Untitled resume',
    targetRole: '',
    industry: '',
    jobDescriptionSnippet: '',
    roleFocus: '',
    profile: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      website: '',
      github: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    coreCompetencies: [],
    certifications: [],
    languages: [],
    projects: [],
  }
}

function mergeProfile(
  partial: Partial<ResumeProfile> | undefined
): ResumeProfile {
  const e = createEmptyResume().profile
  if (!partial) return e
  return {
    fullName: partial.fullName ?? e.fullName,
    email: partial.email ?? e.email,
    phone: partial.phone ?? e.phone,
    location: partial.location ?? e.location,
    linkedIn: partial.linkedIn ?? e.linkedIn,
    website: partial.website ?? e.website,
    github: partial.github ?? e.github,
    summary: partial.summary ?? e.summary,
  }
}

export function normalizeResumeData(
  raw: Partial<ResumeData> | undefined
): ResumeData {
  const e = createEmptyResume()
  if (!raw) return e

  const experience = Array.isArray(raw.experience)
    ? raw.experience.map((item) => {
        const base = newExperience()
        const merged = { ...base, ...item }
        return {
          ...merged,
          id: typeof item.id === 'string' ? item.id : base.id,
          bullets:
            Array.isArray(item.bullets) && item.bullets.length > 0
              ? item.bullets
              : [''],
          location: merged.location ?? '',
          problemContext: merged.problemContext ?? '',
          techStack: merged.techStack ?? '',
        }
      })
    : e.experience

  const education = Array.isArray(raw.education)
    ? raw.education.map((item) => {
        const base = newEducation()
        const merged = { ...base, ...item }
        return {
          ...merged,
          id: typeof item.id === 'string' ? item.id : base.id,
          location: merged.location ?? '',
          startYear: merged.startYear ?? '',
          endYear: merged.endYear ?? '',
          gpa: merged.gpa ?? '',
          honors: merged.honors ?? '',
          details: merged.details ?? '',
        }
      })
    : e.education

  const certifications = Array.isArray(raw.certifications)
    ? raw.certifications.map((item) => {
        const base = newCertification()
        return {
          ...base,
          ...item,
          id: typeof item.id === 'string' ? item.id : base.id,
        }
      })
    : e.certifications

  const languages = Array.isArray(raw.languages)
    ? raw.languages.map((item) => {
        const base = newLanguage()
        return {
          ...base,
          ...item,
          id: typeof item.id === 'string' ? item.id : base.id,
        }
      })
    : e.languages

  const projects = Array.isArray(raw.projects)
    ? raw.projects.map((item) => {
        const base = newProject()
        return {
          ...base,
          ...item,
          id: typeof item.id === 'string' ? item.id : base.id,
        }
      })
    : e.projects

  return {
    title: typeof raw.title === 'string' ? raw.title : e.title,
    targetRole: typeof raw.targetRole === 'string' ? raw.targetRole : e.targetRole,
    industry: typeof raw.industry === 'string' ? raw.industry : e.industry,
    jobDescriptionSnippet:
      typeof raw.jobDescriptionSnippet === 'string'
        ? raw.jobDescriptionSnippet
        : e.jobDescriptionSnippet,
    roleFocus: typeof raw.roleFocus === 'string' ? raw.roleFocus : e.roleFocus,
    profile: mergeProfile(raw.profile),
    experience,
    education,
    skills: Array.isArray(raw.skills) ? raw.skills : e.skills,
    coreCompetencies: Array.isArray(raw.coreCompetencies)
      ? raw.coreCompetencies
      : e.coreCompetencies,
    certifications,
    languages,
    projects,
  }
}

export function newExperience(): ExperienceItem {
  return {
    id: crypto.randomUUID(),
    company: '',
    title: '',
    location: '',
    start: '',
    end: '',
    problemContext: '',
    techStack: '',
    bullets: [''],
  }
}

export function newEducation(): EducationItem {
  return {
    id: crypto.randomUUID(),
    school: '',
    degree: '',
    field: '',
    location: '',
    startYear: '',
    endYear: '',
    gpa: '',
    honors: '',
    details: '',
  }
}

export function newCertification(): CertificationItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    issuer: '',
    year: '',
  }
}

export function newLanguage(): LanguageItem {
  return {
    id: crypto.randomUUID(),
    language: '',
    proficiency: '',
  }
}

export function newProject(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    problemOrNeed: '',
    solution: '',
    impact: '',
    technologies: '',
    link: '',
  }
}
