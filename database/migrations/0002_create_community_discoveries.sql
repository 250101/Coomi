create table if not exists community_places (
  id uuid primary key default gen_random_uuid(),
  google_place_id varchar(255) not null unique,
  display_name varchar(160) not null check (length(trim(display_name)) between 1 and 160),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  location_confirmed_by uuid references users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  place_id uuid not null references community_places (id) on delete cascade,
  category varchar(24) not null check (
    category in ('eat', 'coffee', 'bakery', 'butcher', 'market', 'ingredient', 'other')
  ),
  subject varchar(160) not null check (length(trim(subject)) between 1 and 160),
  review varchar(2000) not null check (length(trim(review)) between 1 and 2000),
  image_url text not null check (length(trim(image_url)) > 0),
  price_level smallint check (price_level is null or price_level between 1 and 4),
  status varchar(16) not null default 'published' check (
    status in ('draft', 'published', 'hidden')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_places_coordinates_idx
  on community_places (latitude, longitude);
create index if not exists community_posts_place_created_at_idx
  on community_posts (place_id, created_at desc)
  where status = 'published';
create index if not exists community_posts_user_created_at_idx
  on community_posts (user_id, created_at desc);
create index if not exists community_posts_category_created_at_idx
  on community_posts (category, created_at desc)
  where status = 'published';

