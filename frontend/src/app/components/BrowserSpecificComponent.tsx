'use client'

import ClientOnly from './ClientOnly'

export default function BrowserSpecificComponent() {
  // Example of browser-specific code
  const handleClick = () => {
    window.localStorage.setItem('clicked', 'true')
    alert('This only works in browser!')
  }

  return (
    <ClientOnly>
      <div className="p-4">
        <button 
          onClick={handleClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Browser-only Action
        </button>
      </div>
    </ClientOnly>
  )
}