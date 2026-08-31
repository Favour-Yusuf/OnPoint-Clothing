-- Tracks whether the one-time abandoned-checkout reminder email has been
-- sent for this order. Nullable/no default: null means "not sent yet"; the
-- cron route (app/api/cron/abandoned-checkouts) sets it only after a
-- successful send, so an order is never emailed twice no matter how often
-- the cron fires.
alter table orders add column abandoned_email_sent_at timestamptz;
