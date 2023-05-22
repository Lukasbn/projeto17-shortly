--
-- PostgreSQL database dump
--

-- Dumped from database version 12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: shortened_urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shortened_urls (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "shortUrl" text NOT NULL,
    url text NOT NULL,
    "visitCount" integer DEFAULT 0 NOT NULL,
    "createdAt" date DEFAULT now() NOT NULL
);


--
-- Name: shortened_urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shortened_urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shortened_urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shortened_urls_id_seq OWNED BY public.shortened_urls.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" date DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: valid_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.valid_tokens (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token uuid NOT NULL,
    "createdAt" date DEFAULT now() NOT NULL
);


--
-- Name: valid_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.valid_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: valid_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.valid_tokens_id_seq OWNED BY public.valid_tokens.id;


--
-- Name: shortened_urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shortened_urls ALTER COLUMN id SET DEFAULT nextval('public.shortened_urls_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: valid_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valid_tokens ALTER COLUMN id SET DEFAULT nextval('public.valid_tokens_id_seq'::regclass);


--
-- Data for Name: shortened_urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.shortened_urls VALUES (1, 1, 'assdmtksn6as16', 'https://github.com/Lukasbn/projeto17-shortly', 0, '2023-05-21');
INSERT INTO public.shortened_urls VALUES (3, 2, '5e2CtwpBp13_BfsGwuBtq', 'asdasdasd', 0, '2023-05-21');
INSERT INTO public.shortened_urls VALUES (4, 2, 'yVEub9AGSRlIHPPcdL0xc', 'asdasdasd', 0, '2023-05-21');
INSERT INTO public.shortened_urls VALUES (5, 2, 'RWdVEII9Vt-xChrz57k6p', 'https://www.youtube.com/watch?v=l62HieCV-Ps&ab_channel=LeoPerfeito', 0, '2023-05-21');
INSERT INTO public.shortened_urls VALUES (6, 3, 'bLv6Lvgx7UmZf2JF7PAix', 'https://www.youtube.com/shorts/OWnqaauHUuw', 0, '2023-05-21');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'joaquim', 'joaquim@quinzin.com', '123456789', '2023-05-21');
INSERT INTO public.users VALUES (2, 'joaquim', 'joaquim@quinzinho.com', '$2b$10$OeNtwPI4M7BDpH/SXrJ2Pe9.Ua52IbvOGdo/1QOXe0xvWMb8J82oG', '2023-05-21');
INSERT INTO public.users VALUES (3, 'Lucas', 'lucas@lucas.com', '$2b$10$D84dDq.fbOa4wSR8wqc2Hu.3L2auiapKRIZ6siJObygP/WX0.NqBm', '2023-05-21');


--
-- Data for Name: valid_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.valid_tokens VALUES (1, 1, '91aefec6-5c16-4285-ba90-8155b6f8689c', '2023-05-21');
INSERT INTO public.valid_tokens VALUES (2, 1, '91aefec6-5c16-4285-ba90-8155b6f8689c', '2023-05-21');
INSERT INTO public.valid_tokens VALUES (3, 2, '1568bc84-b0fe-41a2-b535-5adbf04bd5e6', '2023-05-21');
INSERT INTO public.valid_tokens VALUES (4, 2, 'd4e82249-541b-4385-9bdb-acfe3820ace0', '2023-05-21');
INSERT INTO public.valid_tokens VALUES (5, 3, 'd4ce2be9-e20a-4856-a682-49ed7e648bd4', '2023-05-21');


--
-- Name: shortened_urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shortened_urls_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: valid_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.valid_tokens_id_seq', 5, true);


--
-- Name: shortened_urls shortened_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shortened_urls
    ADD CONSTRAINT shortened_urls_pkey PRIMARY KEY (id);


--
-- Name: shortened_urls shortened_urls_shortUrl_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shortened_urls
    ADD CONSTRAINT "shortened_urls_shortUrl_key" UNIQUE ("shortUrl");


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: valid_tokens valid_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valid_tokens
    ADD CONSTRAINT valid_tokens_pkey PRIMARY KEY (id);


--
-- Name: shortened_urls shortened_urls_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shortened_urls
    ADD CONSTRAINT "shortened_urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: valid_tokens valid_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.valid_tokens
    ADD CONSTRAINT "valid_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

