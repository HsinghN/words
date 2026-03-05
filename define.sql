-- banis definition

CREATE TABLE `banis` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null);

CREATE UNIQUE INDEX `banis_name_gurmukhi_unique` on `banis` (`name_gurmukhi`);
CREATE UNIQUE INDEX `banis_name_english_unique` on `banis` (`name_english`);


-- languages definition

CREATE TABLE `languages` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null, `name_international` varchar(255));

CREATE UNIQUE INDEX `languages_name_gurmukhi_unique` on `languages` (`name_gurmukhi`);
CREATE UNIQUE INDEX `languages_name_english_unique` on `languages` (`name_english`);
CREATE UNIQUE INDEX `languages_name_international_unique` on `languages` (`name_international`);


-- line_types definition

CREATE TABLE `line_types` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null);

CREATE UNIQUE INDEX `line_types_name_gurmukhi_unique` on `line_types` (`name_gurmukhi`);
CREATE UNIQUE INDEX `line_types_name_english_unique` on `line_types` (`name_english`);


-- sources definition

CREATE TABLE `sources` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null, `length` integer not null, `page_name_english` varchar(255) not null, `page_name_gurmukhi` varchar(255) not null);

CREATE UNIQUE INDEX `sources_name_gurmukhi_unique` on `sources` (`name_gurmukhi`);
CREATE UNIQUE INDEX `sources_name_english_unique` on `sources` (`name_english`);


-- words definition

CREATE TABLE words (
            word_id INTEGER PRIMARY KEY,
            original_word TEXT NOT NULL,
            unicode_word TEXT NOT NULL,
            transliterated_word TEXT      
        );


-- writers definition

CREATE TABLE `writers` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null);

CREATE UNIQUE INDEX `writers_name_gurmukhi_unique` on `writers` (`name_gurmukhi`);
CREATE UNIQUE INDEX `writers_name_english_unique` on `writers` (`name_english`);


-- sections definition

CREATE TABLE `sections` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null, `description` text not null, `start_page` integer not null, `end_page` integer not null, `source_id` integer not null, foreign key(`source_id`) references `sources`(`id`));

CREATE UNIQUE INDEX `sections_name_gurmukhi_unique` on `sections` (`name_gurmukhi`);
CREATE UNIQUE INDEX `sections_name_english_unique` on `sections` (`name_english`);


-- subsections definition

CREATE TABLE `subsections` (`id` integer not null primary key autoincrement, `section_id` integer not null, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null, `start_page` integer, `end_page` integer, foreign key(`section_id`) references `sections`(`id`));


-- translation_sources definition

CREATE TABLE `translation_sources` (`id` integer not null primary key autoincrement, `name_gurmukhi` varchar(255) not null, `name_english` varchar(255) not null, `source_id` integer not null, `language_id` integer not null, foreign key(`source_id`) references `sources`(`id`), foreign key(`language_id`) references `languages`(`id`));


-- shabads definition

CREATE TABLE `shabads` (`id` varchar(3), `source_id` integer not null, `writer_id` integer not null, `section_id` integer not null, `subsection_id` integer, `sttm_id` integer, `order_id` integer not null, foreign key(`source_id`) references `sources`(`id`), foreign key(`writer_id`) references `writers`(`id`), foreign key(`section_id`) references `sections`(`id`), foreign key(`subsection_id`) references `subsections`(`id`), primary key (`id`));

CREATE UNIQUE INDEX `shabads_order_id_unique` on `shabads` (`order_id`);


-- lines definition

CREATE TABLE `lines` (`id` varchar(4), `shabad_id` varchar(3) not null, `source_page` integer not null, `source_line` integer, `first_letters` text, `vishraam_first_letters` text, `gurmukhi` text not null, `pronunciation` text, `pronunciation_information` text, `type_id` integer, `order_id` integer not null, foreign key(`shabad_id`) references `shabads`(`id`), foreign key(`type_id`) references `line_types`(`id`), primary key (`id`));

CREATE INDEX `lines_shabad_id_index` on `lines` (`shabad_id`);
CREATE UNIQUE INDEX `lines_order_id_unique` on `lines` (`order_id`);


-- word_line_mapping definition

CREATE TABLE word_line_mapping (
            word_id INTEGER,
            line_id TEXT,
            FOREIGN KEY (word_id) REFERENCES words (word_id),
            FOREIGN KEY (line_id) REFERENCES lines (id)
        );


-- bani_lines definition

CREATE TABLE `bani_lines` (`line_id` varchar(4) not null, `bani_id` integer not null, `line_group` integer not null, foreign key(`line_id`) references `lines`(`id`), foreign key(`bani_id`) references `banis`(`id`), primary key (`line_id`, `bani_id`, `line_group`));