-- Cloudinary integration: these columns store a Cloudinary public ID (e.g.
-- "onpoint/products/suits/classic-black-suit/front") or a "placeholder:<key>"
-- marker for products without photography yet — never a full delivery URL.
-- Renaming (not migrating data) is safe here: every row currently holds a
-- "placeholder:..." marker from the mock seed, so there is no real URL data
-- to reformat.

alter table product_images rename column url to cloudinary_public_id;
alter table categories rename column image_url to cloudinary_public_id;
alter table collections rename column image_url to cloudinary_public_id;
