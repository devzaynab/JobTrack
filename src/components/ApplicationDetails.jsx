import Icon from './Icon'
import StatusBadge from './StatusBadge'

function formatDate(value) {
  if (!value) return 'Not provided'
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return 'Not provided'
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export default function ApplicationDetails({
  application,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!application) return null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <div className="modal-card">
        <div className="modal-header">
          <span className="eyebrow">APPLICATION DETAILS</span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="details-heading">
          <span className="company-avatar">
            {application.company.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h2>{application.title}</h2>
            <p>{application.company}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="details-grid">
          <div>
            <strong>Location:</strong> {application.location || 'Not provided'}
          </div>
          <div>
            <strong>Job type:</strong> {application.type || 'Not provided'}
          </div>
          <div>
            <strong>Salary:</strong> {application.salary || 'Not provided'}
          </div>
          <div>
            <strong>Date applied:</strong>{' '}
            {formatDate(application.dateApplied)}
          </div>
          <div>
            <strong>Source:</strong> {application.source || 'Not provided'}
          </div>
          <div>
            <strong>Job URL:</strong>{' '}
            {application.url ? (
              <a href={application.url} target="_blank" rel="noreferrer">
                Open job listing <Icon name="link" size={14} />
              </a>
            ) : (
              'Not provided'
            )}
          </div>
        </div>

        {application.notes && (
          <div className="details-notes">
            <strong>Notes:</strong>
            <p>{application.notes}</p>
          </div>
        )}

        <div className="modal-actions">
          <button
            className="button button-quiet button-danger"
            onClick={() => onDelete(application)}
          >
            <Icon name="trash" size={16} /> Delete
          </button>
          <button
            className="button button-primary"
            onClick={() => onEdit(application)}
          >
            <Icon name="edit" size={16} /> Edit application
          </button>
        </div>
      </div>
    </div>
  )
}