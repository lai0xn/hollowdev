--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

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
-- Name: candidates; Type: TABLE; Schema: public; Owner: walid
--

CREATE TABLE public.candidates (
    candidateid uuid NOT NULL,
    electionid uuid NOT NULL,
    userid uuid NOT NULL
);


ALTER TABLE public.candidates OWNER TO walid;

--
-- Name: elections; Type: TABLE; Schema: public; Owner: walid
--

CREATE TABLE public.elections (
    election_end_date timestamp(6) without time zone,
    election_start_date timestamp(6) without time zone,
    electionid uuid NOT NULL,
    election_name character varying(255)
);


ALTER TABLE public.elections OWNER TO walid;

--
-- Name: users; Type: TABLE; Schema: public; Owner: walid
--

CREATE TABLE public.users (
    usertype character varying(10) NOT NULL,
    userid uuid NOT NULL,
    email character varying(50) NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    CONSTRAINT users_usertype_check CHECK (((usertype)::text = ANY ((ARRAY['ADMIN'::character varying, 'NORMAL'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO walid;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: walid
--

CREATE TABLE public.votes (
    candidateid uuid NOT NULL,
    electionid uuid NOT NULL,
    userid uuid NOT NULL,
    vote_id uuid NOT NULL
);


ALTER TABLE public.votes OWNER TO walid;

--
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: walid
--

COPY public.candidates (candidateid, electionid, userid) FROM stdin;
2d59d42b-763e-42d6-b870-c1a5ad7f0b08	e6b42efc-11f2-4ca0-9cf5-133f25efb6c7	29fbf22f-3ec6-4da7-8cfb-9e6a5fcfd86e
\.


--
-- Data for Name: elections; Type: TABLE DATA; Schema: public; Owner: walid
--

COPY public.elections (election_end_date, election_start_date, electionid, election_name) FROM stdin;
2024-07-12 01:00:00	2024-07-05 01:00:00	e6b42efc-11f2-4ca0-9cf5-133f25efb6c7	ri2assat l jomhiriya
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: walid
--

COPY public.users (usertype, userid, email, firstname, lastname, username, password) FROM stdin;
ADMIN	29fbf22f-3ec6-4da7-8cfb-9e6a5fcfd86e	fdsaf	fasdf	fasdf	fasdf	$2a$11$7zWgU0NGAlmeKI.PgdTgbei4w3Y7kKbxSHmWYFHlzRtUXTe9Ecvz2
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: walid
--

COPY public.votes (candidateid, electionid, userid, vote_id) FROM stdin;
2d59d42b-763e-42d6-b870-c1a5ad7f0b08	e6b42efc-11f2-4ca0-9cf5-133f25efb6c7	29fbf22f-3ec6-4da7-8cfb-9e6a5fcfd86e	a05fd3cd-808e-460c-b31b-0891e43f3f3b
\.


--
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (candidateid);


--
-- Name: elections elections_pkey; Type: CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.elections
    ADD CONSTRAINT elections_pkey PRIMARY KEY (electionid);


--
-- Name: votes uksso2400yfr2eg1fx1y1eal8sr; Type: CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT uksso2400yfr2eg1fx1y1eal8sr UNIQUE (userid, electionid, candidateid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (vote_id);


--
-- Name: votes votes_userid_electionid_candidateid_key; Type: CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_userid_electionid_candidateid_key UNIQUE (userid, electionid, candidateid);


--
-- Name: candidates fk26jdxb7hlb1ssggpuavf4heg0; Type: FK CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT fk26jdxb7hlb1ssggpuavf4heg0 FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: votes fk65w3um8a41afpexwrju8evxm1; Type: FK CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fk65w3um8a41afpexwrju8evxm1 FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: votes fkbf19ys7eqtwywo91bjr4il988; Type: FK CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fkbf19ys7eqtwywo91bjr4il988 FOREIGN KEY (electionid) REFERENCES public.elections(electionid);


--
-- Name: votes fknbiyaerjeypnn7t17s46nt709; Type: FK CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT fknbiyaerjeypnn7t17s46nt709 FOREIGN KEY (candidateid) REFERENCES public.candidates(candidateid);


--
-- Name: candidates fkqihvawuj2sdk59svojp770ss0; Type: FK CONSTRAINT; Schema: public; Owner: walid
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT fkqihvawuj2sdk59svojp770ss0 FOREIGN KEY (electionid) REFERENCES public.elections(electionid);


--
-- PostgreSQL database dump complete
--

