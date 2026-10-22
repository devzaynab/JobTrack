import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'
import { statuses } from '../data/statuses'

const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(`${value}T00:00:00`))
    : '—'

const typeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
  'Hybrid',
]

const sourceOptions = [
  'Jobberman',
  'Indeed',
  'LinkedIn',
  'Company Website',
  'Referral',
  'Other',
]

function ApplicationActions({ application, onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button
        className="icon-button"
        aria-label={`Edit ${application.title} at ${application.company}`}
        title="Edit"
        onClick={(event) => {
          event.stopPropagation()
          onEdit(application)
        }}
      >
        <Icon name="edit" size={16} />
      </button>
      <button
        className="icon-button icon-danger"
        aria-label={`Delete ${application.title} at ${application.company}`}
        title="Delete"
        onClick={(event) => {
          event.stopPropagation()
          onDelete(application)
        }}
      >
        <Icon name="trash" size={16} />
      </button>
    </div>
  )
}

export default function Applications({
  applications,
  filters,
  setFilters,
  onAdd,
  onOpen,
  onEdit,
  onDelete,
}) {
  const hasFilters =
    filters.search || filters.status || filters.type || filters.source

  const set = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }))

  const clear = () =>
    setFilters({
      search: '',
      status: '',
      type: '',
      source: '',
      sort: 'newest',
    })

  return (
    <div className="page-content applications-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">YOUR OPPORTUNITIES</span>
          <h1>Applications</h1>
          <p>
            Keep every opportunity organized, from first click to final
            decision.
          </p>
        </div>
        <button className="button button-primary" onClick={onAdd}>
          <Icon name="plus" size={17} /> Add application
        </button>
      </section>

      <section className="surface application-workspace">
        <div className="directory-heading">
          <div>
            <h2>All applications</h2>
            <span className="result-count">
              {applications.length}{' '}
              {applications.length === 1 ? 'role' : 'roles'}
            </span>
          </div>
        </div>

        <div className="filter-toolbar">
          <label className="search-field">
            <Icon name="search" size={18} />
            <span className="sr-only">
              Search company, title, or location
            </span>
            <input
              value={filters.search}
              onChange={(event) => set('search', event.target.value)}
              placeholder="Search company, title, location…"
            />
          </label>

          <label className="select-filter">
            <Icon name="filter" size={16} />
            <span className="sr-only">Filter by status</span>
            <select
              value={filters.status}
              onChange={(event) => set('status', event.target.value)}
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="select-filter">
            <span className="sr-only">Filter by job type</span>
            <select
              value={filters.type}
              onChange={(event) => set('type', event.target.value)}
            >
              <option value="">All job types</option>
              {typeOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="select-filter">
            <span className="sr-only">Filter by source</span>
            <select
              value={filters.source}
              onChange={(event) => set('source', event.target.value)}
            >
              <option value="">All sources</option>
              {sourceOptions.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
          </label>

          <label className="sort-filter">
            <span className="sr-only">Sort applications</span>
            <select
              value={filters.sort}
              onChange={(event) => set('sort', event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Company A–Z</option>
              <option value="za">Company Z–A</option>
            </select>
            <Icon name="chevron" size={14} />
          </label>

          {hasFilters && (
            <button className="clear-filters" onClick={clear}>
              Clear filters
            </button>
          )}
        </div>

        {applications.length ? (
          <>
            <div className="table-wrap">
              <table className="application-table">
                <thead>
                  <tr>
                    <th>Company / role</th>
                    <th>Location</th>
                    <th>Date applied</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      onClick={() => onOpen(application)}
                    >
                      <td>
                        <button
                          className="table-company"
                          onClick={() => onOpen(application)}
                        >
                          <span className="company-avatar">
                            {application.company.slice(0, 1).toUpperCase()}
                          </span>
                          <span>
                            <strong>{application.company}</strong>
                            <small>{application.title}</small>
                          </span>
                        </button>
                      </td>
                      <td>{application.location || '—'}</td>
                      <td>{dateLabel(application.dateApplied)}</td>
                      <td>
                        <StatusBadge status={application.status} />
                      </td>
                      <td>{application.type || '—'}</td>
                      <td>
                        <ApplicationActions
                          application={application}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="application-cards">
              {applications.map((application) => (
                <article
                  className="application-card"
                  key={application.id}
                  onClick={() => onOpen(application)}
                >
                  <div className="card-topline">
                    <div className="table-company">
                      <span className="company-avatar">
                        {application.company.slice(0, 1).toUpperCase()}
                      </span>
                      <span>
                        <strong>{application.company}</strong>
                        <small>{application.title}</small>
                      </span>
                    </div>
                    <ApplicationActions
                      application={application}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                  <div className="card-meta">
                    <span>
                      <Icon name="pin" size={14} />
                      {application.location || 'Location not set'}
                    </span>
                    <time>
                      <Icon name="calendar" size={14} />
                      {dateLabel(application.dateApplied)}
                    </time>
                  </div>
                  <div className="card-bottomline">
                    <StatusBadge status={application.status} />
                    <span>{application.type}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-art">
              <span>
                <Icon
                  name={hasFilters ? 'search' : 'briefcase'}
                  size={26}
                />
              </span>
              <i />
              <i />
              <i />
            </div>
            <h3>
              {hasFilters
                ? 'No matches found'
                : 'A fresh start, full of possibility'}
            </h3>
            <p>
              {hasFilters
                ? 'Try a different search or clear your filters to see more applications.'
                : 'Add your first application and keep every next step in one calm, organized place.'}
            </p>
            {hasFilters ? (
              <button className="button button-secondary" onClick={clear}>
                Clear filters
              </button>
            ) : (
              <button className="button button-primary" onClick={onAdd}>
                <Icon name="plus" size={17} /> Add application
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}