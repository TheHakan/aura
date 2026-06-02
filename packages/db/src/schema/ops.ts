import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { users } from "./auth";

export const vaultItems = pgTable("vault_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  module: text("module").notNull(),
  encryptedValue: text("encrypted_value").notNull(),
  nonce: text("nonce").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  rotationReminderAt: timestamp("rotation_reminder_at"),
});

export const servers = pgTable("servers", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  coolifyServerId: text("coolify_server_id"),
  host: text("host"),
  sshUser: text("ssh_user"),
  encryptedSshKey: text("encrypted_ssh_key"),
  sshKeyNonce: text("ssh_key_nonce"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const uptimeChecks = pgTable("uptime_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  isUp: boolean("is_up").default(true),
  lastCheckedAt: timestamp("last_checked_at"),
  responseTimeMs: text("response_time_ms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agentSessions = pgTable("agent_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").default("New Conversation"),
  messages: jsonb("messages").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const agentPermissions = pgTable("agent_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id").references(() => agentSessions.id),
  action: text("action").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});
