# Prisma Schema Editing Workflow

## 🚀 Quick Start: Which Method Should I Use?

**For local experimentation/learning:** Use `db:push` ⚡
**For production/team collaboration:** Use `migrate dev` 📦

---

## Local Experimentation Workflow (Recommended for Learning)

**Perfect for:** Trying things out, rapid prototyping, learning, personal projects

1. **Edit** `prisma/schema.prisma`
2. **Push changes** directly:
   ```bash
   npm run db:push
   ```
   ✅ Automatically regenerates Prisma Client
   ✅ No migration files to manage
   ✅ Fast and simple

**Example:**
```bash
# 1. Edit schema.prisma (add a field, change something)
# 2. Push changes
npm run db:push
# Done! Your database is updated.
```

---

## Production/Team Workflow (Version Control)

**Perfect for:** Production deployments, team collaboration, maintaining migration history

1. **Edit** `prisma/schema.prisma`
2. **Create migration** with a name:
   ```bash
   npx prisma migrate dev --name add_new_field
   # Or use the npm script:
   npm run db:migrate
   # (It will prompt you for a name)
   ```
   ✅ Creates migration file in `prisma/migrations/`
   ✅ Applies migration to database
   ✅ Automatically regenerates Prisma Client

3. **Apply migrations** in production:
   ```bash
   npx prisma migrate deploy
   ```

## Common Schema Changes Examples

### Adding a New Field

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  avatar    String?  // New optional field
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  files File[]
  folders Folder[]

  @@map("users")
}
```

### Adding a New Model

```prisma
model Share {
  id        String   @id @default(cuid())
  fileId    String
  userId    String
  token     String   @unique
  createdAt DateTime @default(now())

  file File @relation(fields: [fileId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("shares")
}
```

### Adding a Relation

```prisma
model File {
  // ... existing fields

  // Add new relation
  shares Share[]

  @@map("files")
}
```

## When to Use Each Method

| Scenario | Use This | Why |
|----------|----------|-----|
| **Local experimentation** | `db:push` | Fast, simple, no migration files |
| **Learning/testing** | `db:push` | Focus on schema, not migrations |
| **Rapid prototyping** | `db:push` | Quick iterations |
| **Team collaboration** | `migrate dev` | Version controlled migrations |
| **Production** | `migrate dev` | Safe, reversible, trackable |
| **CI/CD pipelines** | `migrate deploy` | Apply migrations automatically |

## Important Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run db:push` | Push schema changes directly | Local experimentation |
| `npm run db:migrate` | Create and apply migration | Production/team work |
| `npx prisma migrate dev --name <name>` | Create named migration | Production/team work |
| `npm run db:generate` | Regenerate Prisma Client | After manual schema edits |
| `npm run db:studio` | Open Prisma Studio (database GUI) | View/edit data visually |
| `npx prisma migrate deploy` | Apply pending migrations | Production deployments |
| `npx prisma migrate reset` | Reset database and apply migrations | ⚠️ Deletes all data! |

## Best Practices

### For Local Experimentation:
1. **Use `db:push`** - It's faster and simpler for learning
2. **Don't worry about migration files** - Focus on understanding the schema
3. **You can always switch to migrations later** - When you're ready for production

### For Production/Teams:
1. **Use `migrate dev`** - Creates version-controlled migration files
2. **Name migrations descriptively** - `add_user_avatar`, `add_file_sharing_table`
3. **Review migration files** before applying in production
4. **Backup your database** before major schema changes
5. **Test migrations** in a development environment first
6. **Commit migration files** to git - Team needs them to sync databases

## Switching Between Methods

### Already using migrations, want to experiment with `db:push`?
- **You can use `db:push`** - It will sync your schema to the database
- **Note:** `db:push` doesn't create migration files, so future `migrate dev` commands might detect drift
- **Solution:** If you want to go back to migrations, run `npx prisma migrate dev --name sync_after_push` to create a migration that matches your current state

### Using `db:push`, want to switch to migrations?
- **Run:** `npx prisma migrate dev --name init` (or any name)
- This creates a baseline migration from your current schema
- From then on, use `migrate dev` for all changes

## Troubleshooting

### Schema and database are out of sync?
```bash
npx prisma migrate reset  # ⚠️ This deletes all data!
# Or
npx prisma db push --force-reset  # ⚠️ This also deletes data!
```

### Want to see what changes will be made?
```bash
npx prisma migrate dev --create-only  # Creates migration without applying
# Review the migration file, then:
npx prisma migrate dev  # Apply it
```

### Need to rollback a migration?
Prisma doesn't support automatic rollbacks. You need to:
1. Create a new migration that reverses the changes
2. Or manually edit the database

