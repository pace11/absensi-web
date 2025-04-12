import {
  int,
  mysqlTable,
  varchar,
  text,
  timestamp,
  time,
  mysqlEnum,
  boolean,
} from 'drizzle-orm/mysql-core'

// Tabel Users
export const usersTable = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  role: mysqlEnum('role', ['admin', 'employee']).default('employee'),
  created_at: timestamp('created_at', {
    mode: 'string',
  }).defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'string',
  }).defaultNow(),
  deleted_at: timestamp('deleted_at'),
})

// Tabel Absensi
export const attendancesTable = mysqlTable('attendances', {
  id: int('id').autoincrement().primaryKey(),
  user_id: int('user_id')
    .notNull()
    .references(() => usersTable.id),
  check_in: time('check_in'),
  check_out: time('check_out'),
  coordinates: text('coordinates'),
  status: mysqlEnum('status', [
    'checked_in',
    'present',
    'absent',
    'leave',
  ]).default('checked_in'),
  description: text('description'),
  is_accepted: boolean('is_accepted').notNull(),
  created_at_local: timestamp('created_at_local', {
    mode: 'string',
  }),
  created_at: timestamp('created_at', {
    mode: 'string',
  }).defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'string',
  }).defaultNow(),
})

// Tabel Setting
export const settingTable = mysqlTable('setting', {
  id: int('id').autoincrement().primaryKey(),
  name: text('name'),
  address: text('address'),
  clock_in: time('clock_in').notNull(),
  clock_out: time('clock_out').notNull(),
  coordinates: text('coordinates'),
  radius: int('radius'),
  created_at: timestamp('created_at', {
    mode: 'string',
  }).defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'string',
  }).defaultNow(),
})

// INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`, `deleted_at`) VALUES (NULL, 'admin', 'admin_db@mail.com', '$2a$12$T4ldlUEycm8gDWOZNUk.0es1Y7y8IkYM1T7Wni4imril8fMtvhcES', 'admin', '2025-04-03 22:52:41', '2025-04-03 22:52:41', NULL);
