import React from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

function App() {
  return (
    <div>
      <header>
        <h1>
          Welcome to Clerk + Vite + React!
        </h1>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  )
}

export default App