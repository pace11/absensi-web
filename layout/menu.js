export const menu = (role = 'unauthenticated') => {
  const mapping = {
    admin: [
      {
        key: '/',
        label: 'Beranda',
      },
      {
        key: '/users',
        label: 'Pengguna',
      },
      {
        key: '/ijin',
        label: 'Permohonan Ijin',
      },
      {
        key: '/setting',
        label: 'Setting',
      },
    ],
    employee: [
      {
        key: '/',
        label: 'Beranda',
      },
      {
        key: '/kalender',
        label: 'Kalender',
      },
      {
        key: '/ijin',
        label: 'Permohonan Ijin',
      },
    ],
    unauthenticated: [
      {
        key: '/login',
        label: 'Login',
      },
    ],
  }

  return mapping?.[role]
}
