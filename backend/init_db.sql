create extension if not exists vector;

create table if not exists bis_standards (
  id bigserial primary key,
  content text not null,
  metadata jsonb,
  embedding vector(384)
);

-- Enable Row Level Security & set public policies for read & insert
alter table bis_standards enable row level security;

create policy "Allow public read" on bis_standards
  for select using (true);

create policy "Allow public insert" on bis_standards
  for insert with check (true);

create or replace function match_documents (
  query_embedding vector(384),
  match_count int default 5
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    bis_standards.id,
    bis_standards.content,
    bis_standards.metadata,
    1 - (bis_standards.embedding <=> query_embedding) as similarity
  from bis_standards
  order by bis_standards.embedding <=> query_embedding
  limit match_count;
end;
$$;
