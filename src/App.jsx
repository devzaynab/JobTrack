import { useEffect, useState } from 'react'
import './jobtrack.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Icon from './components/Icon'
import ApplicationForm from './components/ApplicationForm'
import ApplicationDetails from './components/ApplicationDetails'
import ConfirmModal from './components/ConfirmModal'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import AuthPage from './pages/AuthPage'
import { getSession, clearSession, loginUser, signupUser, subscribeToAuth, logoutUser } from './utils/auth'
import { addUserApplication, deleteUserApplication, fetchApplicationsFromFirestore, loadApplications, updateUserApplication } from './utils/storage'

function App() {
  const [session, setSession] = useState(getSession)
  const [authMode, setAuthMode] = useState('login')
  const [authError, setAuthError] = useState('')
  const [applications, setApplications] = useState(() => loadApplications())
  const [page, setPage] = useState('dashboard')
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [filters, setFilters] = useState({ search: '', status: '', type: '', source: '', sort: 'newest' })

  useEffect(() => {
    const unsubscribe = subscribeToAuth(setSession)
    return unsubscribe
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadUserData() {
      if (!session?.id) {
        setApplications(loadApplications())
        return
      }

      setApplications([])
      try {
        const firestoreApps = await fetchApplicationsFromFirestore(session.id)
        if (!cancelled) setApplications(firestoreApps)
      } catch (error) {
        console.error('Could not fetch Firestore applications:', error)
        if (!cancelled) {
          setApplications(loadApplications(session.id))
          setNotice({ type: 'error', message: 'Could not load your applications from Firestore.' })
        }
      }
    }

    loadUserData()
    return () => {
      cancelled = true
    }
  }, [session?.id])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(null), 3600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    function keyDown(event) {
      if (event.key === 'Escape') {
        setSelected(null)
        setDeleting(null)
        setMobileNavOpen(false)
        if (page === 'form') setPage('applications')
      }
    }
    window.addEventListener('keydown', keyDown)
    return () => window.removeEventListener('keydown', keyDown)
  }, [page])

  const filteredApplications = applications.filter((application) => {
    const query = filters.search.trim().toLowerCase()
    const matchesSearch = !query || [application.company, application.title, application.location].some((value) => value?.toLowerCase().includes(query))
    return matchesSearch && (!filters.status || application.status === filters.status)
      && (!filters.type || application.type === filters.type)
      && (!filters.source || application.source === filters.source)
  }).sort((a, b) => {
    if (filters.sort === 'oldest') return a.dateApplied.localeCompare(b.dateApplied)
    if (filters.sort === 'az') return a.company.localeCompare(b.company)
    if (filters.sort === 'za') return b.company.localeCompare(a.company)
    return b.dateApplied.localeCompare(a.dateApplied)
  })

  function startAdd() {
    setEditing(null)
    setSelected(null)
    setPage('form')
  }

  function startEdit(application) {
    setEditing(application)
    setSelected(null)
    setPage('form')
  }

  async function saveApplication(values) {
    const now = new Date().toISOString().slice(0, 10)
    try {
      if (editing) {
        const updated = await updateUserApplication(session.id, editing.id, { ...values, updatedAt: now })
        setApplications((current) => current.map((application) => application.id === editing.id ? updated : application))
        setNotice({ type: 'success', message: 'Application updated.' })
      } else {
        const application = { ...values, id: globalThis.crypto?.randomUUID?.() || `job-${Date.now()}`, updatedAt: now }
        const added = await addUserApplication(session.id, application)
        setApplications((current) => [added, ...current.filter((item) => item.id !== added.id)])
        setNotice({ type: 'success', message: 'Application added to your tracker.' })
      }
      setEditing(null)
      setPage('applications')
    } catch (error) {
      console.error('Could not save Firestore application:', error)
      setNotice({ type: 'error', message: 'Could not save your application to Firestore.' })
    }
  }

  async function confirmDelete() {
    try {
      await deleteUserApplication(session.id, deleting.id)
      setApplications((current) => current.filter((application) => application.id !== deleting.id))
      setNotice({ type: 'success', message: 'Application deleted.' })
      setSelected(null)
      setDeleting(null)
    } catch (error) {
      console.error('Could not delete Firestore application:', error)
      setNotice({ type: 'error', message: 'Could not delete your application from Firestore.' })
    }
  }

  function navigate(nextPage) {
    setSelected(null)
    if (nextPage !== 'form') setEditing(null)
    setPage(nextPage)
  }

  async function handleAuthSubmit(values) {
    try {
      const nextUser = authMode === 'login' ? await loginUser(values) : await signupUser(values)
      setSession(nextUser)
      setAuthError('')
    } catch (error) {
      setAuthError(error.message)
    }
  }

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      clearSession()
    }
    setSession(null)
    setAuthMode('login')
    setAuthError('')
  }

  if (!session) {
    return <AuthPage mode={authMode} error={authError} onToggleMode={setAuthMode} onSubmit={handleAuthSubmit} />
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={navigate} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} userName={session.name} email={session.email} onLogout={handleLogout} />
      <main className="main-shell">
        <Header page={page} onMenu={() => setMobileNavOpen(true)} applicationsCount={applications.length} userName={session.name} onLogout={handleLogout} />
        {page === 'dashboard' && <Dashboard applications={applications} userName={session.name} onAdd={startAdd} onOpen={setSelected} onViewAll={() => navigate('applications')} />}
        {page === 'applications' && <Applications applications={filteredApplications} filters={filters} setFilters={setFilters} onAdd={startAdd} onOpen={setSelected} onEdit={startEdit} onDelete={setDeleting} />}
        {page === 'form' && <div className="page-content form-page"><div className="page-intro form-intro"><div><span className="eyebrow">{editing ? 'KEEP IT CURRENT' : 'A NEW OPPORTUNITY'}</span><h1>{editing ? 'Edit application' : 'Add an application'}</h1><p>{editing ? 'Update the details and keep your search in sync.' : 'Capture the details now. You can update the story as it unfolds.'}</p></div><button className="button button-quiet form-back" onClick={() => navigate('applications')}><Icon name="arrow-back" size={16} /> Back to applications</button></div><section className="surface form-surface"><ApplicationForm key={editing?.id || 'new'} initialValues={editing} onSubmit={saveApplication} onCancel={() => navigate('applications')} /></section></div>}
      </main>
      {notice && <div className={`toast toast-${notice.type}`} role="status"><span className="toast-mark"><Icon name={notice.type === 'success' ? 'check' : 'close'} size={16} /></span>{notice.message}<button onClick={() => setNotice(null)} aria-label="Dismiss notification"><Icon name="close" size={15} /></button></div>}
      <ApplicationDetails application={selected} onClose={() => setSelected(null)} onEdit={startEdit} onDelete={(application) => { setSelected(null); setDeleting(application) }} />
      <ConfirmModal application={deleting} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
    </div>
  )
}

export default App
