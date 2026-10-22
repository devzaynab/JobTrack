import { useEffect, useRef, useState } from 'react'
import BrandLockup from './BrandLockup'
import Icon from './Icon'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'applications', label: 'Applications', icon: 'briefcase' },
]

export default function Sidebar({
  page,
  onNavigate,
  open,
  onClose,
  userName,
  email,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const surname = userName?.trim().split(/\s+/)[0] || ''

  useEffect(() => {
    if (!menuOpen) return undefined

    function closeOnOutsideClick(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          className="sidebar-scrim"
          onClick={onClose}
        />
      )}
      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
        <button
          className="brand"
          onClick={() => onNavigate('dashboard')}
          aria-label="JobTrack home"
        >
          <BrandLockup />
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item${page === item.id ? ' nav-active' : ''}`}
              onClick={() => {
                onNavigate(item.id)
                onClose()
              }}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.id === 'applications' && <span className="nav-count" />}
            </button>
          ))}
          <button
            className={`nav-item${page === 'form' ? ' nav-active' : ''}`}
            onClick={() => {
              onNavigate('form')
              onClose()
            }}
          >
            <Icon name="plus" size={18} />
            <span>Add application</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-spark">✳</span>
            <p>
              <strong>Small steps add up.</strong>
              <br />
              Keep your search moving.
            </p>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">
              {surname.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>
              <strong>My workspace</strong>
              <small>Personal tracker</small>
            </span>
            <div className="workspace-menu-wrap" ref={menuRef}>
              <button
                className="profile-menu-trigger"
                type="button"
                aria-label="Workspace and account options"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((current) => !current)}
              >
                <Icon name="dots" size={19} />
              </button>
              {menuOpen && (
                <div className="workspace-menu" role="menu">
                  <div className="workspace-menu-account">
                    <strong>{userName || 'Account'}</strong>
                    <small>{email || 'Signed-in account'}</small>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      onLogout()
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}