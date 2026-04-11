import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { worker } from './mocks/browser.ts'
import App from './App.tsx'

async function prepare() {
  return worker.start({
    onUnhandledRequest: 'bypass', 
  })
}




prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})