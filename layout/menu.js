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
      // {
      //   key: '/setting',
      //   label: 'Setting',
      // },
      {
        key: '/ijin',
        label: 'Request Ijin',
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
        label: 'Request Ijin',
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
