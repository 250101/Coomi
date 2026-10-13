create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email varchar(320) not null unique,
  display_name varchar(80) not null check (length(trim(display_name)) between 1 and 80),
  avatar_url text,
  auth_provider varchar(40) not null,
  auth_subject varchar(255) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (auth_provider, auth_subject)
);

create table if not exists forum_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete set null,
  author varchar(80) not null check (length(trim(author)) between 1 and 80),
  content varchar(2000) not null check (length(trim(content)) between 1 and 2000),
  recipe_id varchar(100),
  client_reference varchar(100) not null unique,
  created_at timestamptz not null default now()
);

create table if not exists recipe_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  recipe_id varchar(100) not null,
  rating smallint not null check (rating between 1 and 5),
  content varchar(2000) check (content is null or length(trim(content)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

create index if not exists forum_comments_created_at_idx
  on forum_comments (created_at desc);
create index if not exists recipe_reviews_recipe_id_idx
  on recipe_reviews (recipe_id, created_at desc);
