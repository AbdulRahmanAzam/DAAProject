import { useEffect, useState } from 'react'
import App from './App.jsx'
import ClosestaPair from './pages/ClosestaPair.jsx'
import Karatsuba from './pages/Karatsuba.jsx'

function Router() {
  const [hash, setHash] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (hash.startsWith('#/closest-pair')) return <ClosestaPair />
  if (hash.startsWith('#/integer-matrix-multiplication')) return <Karatsuba />

  return <App />
}

export default Router
