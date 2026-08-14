-- OnPoint is a Nigerian brand — Nigerian Naira (NGN) is the only supported
-- customer-facing currency. Money stays integer minor units (kobo, same
-- 100:1 ratio as the cents this schema was originally modeled with), so no
-- column types change — only the default and any already-seeded USD rows.

alter table products alter column currency set default 'NGN';
alter table orders alter column currency set default 'NGN';
alter table payments alter column currency set default 'NGN';

update products set currency = 'NGN' where currency = 'USD';
update orders set currency = 'NGN' where currency = 'USD';
update payments set currency = 'NGN' where currency = 'USD';
