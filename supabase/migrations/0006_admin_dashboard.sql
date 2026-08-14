-- Admin operations dashboard support: bespoke status flow correction,
-- customer rollup view, and a couple of indexes the new admin list/filter
-- queries need that weren't required by the storefront alone.

-- The original bespoke_requests constraint (new/in_review/contacted/closed)
-- doesn't match the operational flow the admin dashboard needs. Remap any
-- existing rows before tightening the constraint.
update bespoke_requests set status = 'contacted' where status = 'in_review';
update bespoke_requests set status = 'completed' where status = 'closed';

alter table bespoke_requests drop constraint bespoke_requests_status_check;
alter table bespoke_requests add constraint bespoke_requests_status_check
  check (status in ('new', 'contacted', 'consultation', 'in_progress', 'completed', 'cancelled'));

create index idx_bespoke_requests_status on bespoke_requests(status);
create index idx_bespoke_requests_created_at on bespoke_requests(created_at desc);
create index idx_payments_status on payments(status);

-- Per-customer rollup (order count, lifetime spend, most recent order) for
-- /admin/customers. Guests are grouped by lower(email) since they have no
-- user_id; registered customers are grouped by user_id so a later email
-- change doesn't split their history. Window functions compute the
-- aggregates over the whole partition; DISTINCT ON then picks each
-- customer's most recent name/email/phone as the representative row.
--
-- This view is not RLS-protected (Postgres views don't inherit the RLS of
-- their base tables). It must only ever be queried via the service-role
-- admin client, from pages/actions that have already verified is_admin —
-- never expose it to the anon/authenticated PostgREST role.
create view admin_customer_summary as
select distinct on (customer_key)
  customer_key,
  user_id,
  customer_name,
  customer_email,
  customer_phone,
  order_count,
  total_spent,
  last_order_at
from (
  select
    coalesce(user_id::text, lower(customer_email)) as customer_key,
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    created_at,
    count(*) over (partition by coalesce(user_id::text, lower(customer_email))) as order_count,
    coalesce(
      sum(total) filter (where payment_status = 'paid') over (partition by coalesce(user_id::text, lower(customer_email))),
      0
    ) as total_spent,
    max(created_at) over (partition by coalesce(user_id::text, lower(customer_email))) as last_order_at
  from orders
) ranked
order by customer_key, created_at desc;
