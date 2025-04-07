import { createContext } from 'react'

export const ProfileContext = createContext({})

export function ProfileContextProvider({ children, ...props }) {
  return (
    <ProfileContext.Provider value={null} {...props}>
      {children}
    </ProfileContext.Provider>
  )
}
