import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'
import { statuses } from '../data/statuses'

const formatDate = (value) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
    new Date(`${value}T00:00:00`)
  )

function StatCard({ label, value, icon, tone, caption }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon name={icon} size={19} />
      </div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{caption}</small>
      </div>
    </article>
  )
}

function RecentRow({ application, onOpen }) {
  return (
    <button className="recent-row" onClick={() => onOpen(application)}>
      <div className="company-avatar">
        {application.company.slice(0, 1).toUpperCase()}
      </div>
      <div className="recent-company">
        <strong>{application.company}</strong>
        <span>{application.title}</span>
      </div>
      <StatusBadge status={application.status} />
      <time>{formatDate(application.dateApplied)}</time>
      <Icon name="arrow" size={16} className="recent-arrow" />
    </button>
  )
}

export default function Dashboard({
  applications,
  userName,
  onAdd,
  onOpen,
  onViewAll,
}) {
  const counts = statuses.reduce(
    (result, status) => ({
      ...result,
      [status]: applications.filter(
        (application) => application.status === status
      ).length,
    }),
    {}
  )

  const total = applications.length

  const recent = [...applications]
    .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied))
    .slice(0, 5)

  const updates = [...applications]
    .sort((a, b) =>
      (b.updatedAt || b.dateApplied).localeCompare(a.updatedAt || a.dateApplied)
    )
    .slice(0, 3)

  const surname = userName?.trim().split(/\s+/)[0] || ''

  return (
    <div className="page-content dashboard-page">
      <section className="welcome-band">
        <div>
          <span className="eyebrow">YOUR CAREER, IN MOTION</span>
          <h1>
            {surname ? `Good day, ${surname}` : 'Good day'}
            <span className="welcome-period">.</span>
          </h1>
          <p>
            Every opportunity starts with a first step. Here’s where yours
            stand.
          </p>
        </div>
        <button className="button button-primary" onClick={onAdd}>
          <Icon name="plus" size={17} /> Add application
        </button>
      </section>

      <section className="stats-grid" aria-label="Application statistics">
        <StatCard
          label="Total applications"
          value={total}
          icon="briefcase"
          tone="tone-ink"
          caption="Across your job search"
        />
        <StatCard
          label="Applied"
          value={counts.Applied}
          icon="arrow"
          tone="tone-blue"
          caption="Waiting to hear back"
        />
        <StatCard
          label="Interviews"
          value={counts.Interview}
          icon="calendar"
          tone="tone-amber"
          caption="Conversations in progress"
        />
        <StatCard
          label="Offers"
          value={counts.Offer}
          icon="check"
          tone="tone-green"
          caption="Ready for your next step"
        />
        <StatCard
          label="Rejected"
          value={counts.Rejected}
          icon="trend"
          tone="tone-rose"
          caption="Keep moving forward"
        />
      </section>

      <div className="dashboard-columns">
        <section className="surface recent-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE LATEST</span>
              <h2>Recent applications</h2>
            </div>
            <button className="text-link" onClick={onViewAll}>
              View all <Icon name="arrow" size={15} />
            </button>
          </div>
          {recent.length ? (
            <div className="recent-list">
              {recent.map((application) => (
                <RecentRow
                  key={application.id}
                  application={application}
                  onOpen={onOpen}
                />
              ))}
            </div>
          ) : (
            <div className="compact-empty">
              <p>No applications yet.</p>
              <button className="text-link" onClick={onAdd}>
                Add your first one <Icon name="arrow" size={15} />
              </button>
            </div>
          )}
        </section>

        <aside className="dashboard-aside">
          <section className="surface status-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">AT A GLANCE</span>
                <h2>Pipeline</h2>
              </div>
              <span className="pipeline-total">{total} total</span>
            </div>
            <div className="pipeline-list">
              {statuses.map((status) => (
                <div className="pipeline-item" key={status}>
                  <div className="pipeline-label">
                    <StatusBadge status={status} />
                    <strong>{counts[status]}</strong>
                  </div>
                  <div className="pipeline-track">
                    <span
                      className={`pipeline-fill fill-${status.toLowerCase()}`}
                      style={{
                        width: `${
                          total
                            ? Math.max(
                                (counts[status] / total) * 100,
                                counts[status] ? 5 : 0
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface activity-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">WHAT’S MOVING</span>
                <h2>Recent updates</h2>
              </div>
            </div>
            {updates.length ? (
              <div className="activity-list">
                {updates.map((application) => (
                  <button
                    key={application.id}
                    className="activity-item"
                    onClick={() => onOpen(application)}
                  >
                    <span
                      className={`activity-marker marker-${application.status.toLowerCase()}`}
                    >
                      <Icon name="clock" size={15} />
                    </span>
                    <span>
                      <strong>{application.company}</strong>
                      <small>
                        {application.status === 'Applied'
                          ? 'Application submitted'
                          : `Status updated to ${application.status}`}
                      </small>
                    </span>
                    <time>
                      {formatDate(
                        application.updatedAt || application.dateApplied
                      )}
                    </time>
                  </button>
                ))}
              </div>
            ) : (
              <p className="muted-copy">Updates will appear here.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}