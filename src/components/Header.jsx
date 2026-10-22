import Icon from './Icon'

const pageTitles = { 
  dashboard: 'Dashboard', 
  applications: 'Applications', 
  form: 'Add application' 
}

export default function Header({ page, onMenu, applicationsCount, userName, onLogout }) {
  return (
    <header className="topbar">
      <button 
        className="mobile-menu icon-button" 
        onClick={onMenu} 
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>

      <div className="breadcrumbs">
        <span>Workspace</span>
        <span className="crumb-divider">/</span>
        <strong>{pageTitles[page] || 'Applications'}</strong>
      </div>

      <div className="topbar-right">
        <span className="sync-indicator">
          <i /> All changes saved
        </span>
        <div className="topbar-avatar" aria-label="Personal workspace">
          {(userName || 'U').slice(0, 1).toUpperCase()}
        </div>
        <button 
          className="button button-quiet logout-button" 
          type="button" 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <span className="sr-only">
        {applicationsCount} applications tracked
      </span>
    </header>
  )
}