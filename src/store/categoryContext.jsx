import { createContext, useContext, useState, useEffect } from 'react'
import { getCategories } from '@/services/categories'
import { useAuth } from '@/hooks/useAuth'

const CategoryContext = createContext(null)

export function CategoryProvider({ children }) {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getCategories(user.id)
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [user])

  const refresh = async () => {
    if (!user) return
    const data = await getCategories(user.id)
    setCategories(data)
  }

  return (
    <CategoryContext.Provider value={{ categories, loading, refresh }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  return useContext(CategoryContext)
}