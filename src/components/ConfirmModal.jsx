import Icon from './Icon'

export default function ConfirmModal({ application, onCancel, onConfirm }) {
  if (!application) return null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onCancel()
      }
    >
      <section
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <div className="confirm-icon">
          <Icon name="trash" size={20} />
        </div>
        <h2 id="delete-title">Delete this application?</h2>
        <p id="delete-description">
          “{application.title}” at {application.company} will be permanently
          removed from your tracker.
        </p>
        <div className="modal-actions">
          <button className="button button-quiet" onClick={onCancel}>
            Keep application
          </button>
          <button className="button button-danger" onClick={onConfirm}>
            Delete application
          </button>
        </div>
      </section>
    </div>
  )
}