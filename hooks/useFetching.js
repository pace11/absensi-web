import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const useFetching = ({ path, query }) => {
  const [params, setParams] = useState(query || '')

  const { data, error, mutate, isValidating } = useSWR(
    `${path}${params}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )

  const reloadData = (queryParams = '') => {
    setParams(queryParams)
    mutate()
  }

  return {
    data: data || null,
    isLoading: isValidating,
    isError: error,
    reloadData,
  }
}
