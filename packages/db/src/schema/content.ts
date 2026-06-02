import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { users } from "./auth";

export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  youtubeChannelId: text("youtube_channel_id").notNull(),
  name: text("name").notNull(),
  handle: text("handle"),
  thumbnailUrl: text("thumbnail_url"),
  subscriberCount: integer("subscriber_count").default(0),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postStatusEnum = pgTable("post_status_enum", {
  id: text("id").primaryKey(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags").array().default([]),
  mediaUrl: text("media_url"),
  thumbnailUrl: text("thumbnail_url"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"),
  platforms: jsonb("platforms").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
