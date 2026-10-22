import { useState } from 'react'
import { statuses } from '../data/statuses'

const emptyValues = {
  company: '',
  title: '',
  location: '',
  type: 'Full-time',
  salary: '',
  dateApplied: new Date().toISOString().slice(0, 10),
  status: 'Applied',
  source: 'LinkedIn',
  url: '',
  notes: '',
}

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
  'Hybrid',
]

const sources = [
  'Jobberman',
  'Indeed',
  'LinkedIn',
  'Company Website',
  'Referral',
  'Other',
]

export default function ApplicationForm({
  initialValues,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    ...emptyValues,
    ...initialValues,
  }))
  const [errors, setErrors] = useState({})

  function change(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!values.company.trim()) nextErrors.company = 'Enter a company name.'
    if (!values.title.trim()) nextErrors.title = 'Enter a job title.'
    if (!values.dateApplied)
      nextErrors.dateApplied = 'Choose the date you applied.'
    if (!values.status) nextErrors.status = 'Choose an application status.'

    if (values.url.trim()) {
      try {
        const url = new URL(values.url)
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
      } catch {
        nextErrors.url =
          'Enter a valid link starting with https:// or http://.'
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({
        ...values,
        company: values.company.trim(),
        title: values.title.trim(),
        location: values.location.trim(),
        salary: values.salary.trim(),
        url: values.url.trim(),
        notes: values.notes.trim(),
      })
    }
  }

  return (
    <form onSubmit={submit} className="form-grid">
      <div className="form-section">
        <h3>Role details</h3>
        <p className="form-subtitle">The essentials for this opportunity.</p>

        <div className="form-fields">
          <label className={errors.company ? 'field has-error' : 'field'}>
            <span>Company name *</span>
            <input
              name="company"
              value={values.company}
              onChange={change}
              placeholder="e.g. Flutterwave"
              aria-invalid={Boolean(errors.company)}
            />
            {errors.company && (
              <span className="error-text">{errors.company}</span>
            )}
          </label>

          <label className={errors.title ? 'field has-error' : 'field'}>
            <span>Job title *</span>
            <input
              name="title"
              value={values.title}
              onChange={change}
              placeholder="e.g. Product Designer"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <span className="error-text">{errors.title}</span>
            )}
          </label>

          <label className="field">
            <span>Location</span>
            <input
              name="location"
              value={values.location}
              onChange={change}
              placeholder="e.g. Lagos, Nigeria or Remote"
            />
          </label>

          <label className="field">
            <span>Job type</span>
            <select name="type" value={values.type} onChange={change}>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Salary</span>
            <input
              name="salary"
              value={values.salary}
              onChange={change}
              placeholder="e.g. ₦8,000,000 / year"
            />
          </label>

          <label className={errors.dateApplied ? 'field has-error' : 'field'}>
            <span>Date applied *</span>
            <input
              type="date"
              name="dateApplied"
              value={values.dateApplied}
              onChange={change}
            />
            {errors.dateApplied && (
              <span className="error-text">{errors.dateApplied}</span>
            )}
          </label>

          <label className={errors.status ? 'field has-error' : 'field'}>
            <span>Status *</span>
            <select name="status" value={values.status} onChange={change}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Job source</span>
            <select name="source" value={values.source} onChange={change}>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>

          <label
            className={`field field-full ${errors.url ? 'has-error' : ''}`}
          >
            <span>Job URL</span>
            <input
              type="url"
              name="url"
              value={values.url}
              onChange={change}
              placeholder="https://company.com/careers/role"
            />
            {errors.url && <span className="error-text">{errors.url}</span>}
          </label>

          <label className="field field-full">
            <span>Notes</span>
            <textarea
              name="notes"
              value={values.notes}
              onChange={change}
              rows={4}
              placeholder="Add key contacts, interview dates, or notes about the role..."
            />
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button button-quiet"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          {initialValues?.id ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  )
}