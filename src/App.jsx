import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import cherryTreeImg from '../images/cherry-tree.jpg';
import plant2Img from '../images/plant2.png';
import useGoodreadsSync from './useGoodreadsSync.js';
import useCoverColors from './useCoverColors.js';
import { useLocalData } from './useLocalData.js';
import NavPanel from './components/NavPanel.jsx';
import SeasonalGarland from './components/SeasonalGarland.jsx';
import StatsTimeline from './pages/StatsTimeline.jsx';
import StatsGenres from './pages/StatsGenres.jsx';
import StatsAuthors from './pages/StatsAuthors.jsx';
import StatsGoals from './pages/StatsGoals.jsx';

const RAW_BOOKS = [{"id": "4667024", "t": "The Help", "a": "Kathryn Stockett", "r": 0, "ar": 4.47, "p": 451, "y": "2009", "dr": "", "da": "2024/01/17", "s": "currently-reading", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0399155341", "pub": "G.P. Putnam's Sons", "bind": "Hardcover", "rev": ""}, {"id": "54493401", "t": "Project Hail Mary", "a": "Andy Weir", "r": 5, "ar": 4.5, "p": 476, "y": "2021", "dr": "2026/02/11", "da": "2025/07/20", "s": "read", "g": ["sci-fi", "adventure"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0593135202", "pub": "Ballantine Books", "bind": "Hardcover", "rev": ""}, {"id": "6288", "t": "The Road", "a": "Cormac McCarthy", "r": 0, "ar": 4.0, "p": 241, "y": "2006", "dr": "", "da": "2026/02/12", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0307265439", "pub": "Alfred A. Knopf", "bind": "Hardcover", "rev": ""}, {"id": "62039166", "t": "The Bee Sting", "a": "Paul Murray", "r": 0, "ar": 3.88, "p": 645, "y": "2023", "dr": "", "da": "2026/02/03", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0374600309", "pub": "Farrar, Straus and Giroux", "bind": "Hardcover", "rev": ""}, {"id": "57001545", "t": "Still Life", "a": "Sarah Winman", "r": 0, "ar": 4.15, "p": 464, "y": "2021", "dr": "", "da": "2026/02/03", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0593330757", "pub": "G.P. Putnam's Sons", "bind": "Hardcover", "rev": ""}, {"id": "228487168", "t": "A Memoir of Freedom", "a": "Cheng Lei", "r": 0, "ar": 4.19, "p": 383, "y": "2025", "dr": "", "da": "2026/01/24", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1460717910", "pub": "HarperCollins", "bind": "Kindle Edition", "rev": ""}, {"id": "6185", "t": "Wuthering Heights", "a": "Emily Bront\u00eb", "r": 4, "ar": 3.9, "p": 464, "y": "1847", "dr": "2026/01/21", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Norton", "bind": "Paperback", "rev": ""}, {"id": "19034943", "t": "The Secret Commonwealth", "a": "Philip Pullman", "r": 0, "ar": 4.03, "p": 784, "y": "2019", "dr": "", "da": "2025/10/29", "s": "currently-reading", "g": [], "sn": "The Book of Dust", "si": 2.0, "au": false, "fav": false, "isbn": "", "pub": "RHCP Digital", "bind": "ebook", "rev": ""}, {"id": "34128219", "t": "La Belle Sauvage", "a": "Philip Pullman", "r": 4, "ar": 4.15, "p": 449, "y": "2017", "dr": "2026/01/08", "da": "2025/10/29", "s": "read", "g": ["fantasy"], "sn": "The Book of Dust", "si": 1.0, "au": false, "fav": false, "isbn": "0375815309", "pub": "Alfred A. Knopf", "bind": "Hardcover", "rev": ""}, {"id": "853510", "t": "Murder on the Orient Express", "a": "Agatha Christie", "r": 3, "ar": 4.2, "p": 274, "y": "1934", "dr": "", "da": "2026/01/07", "s": "read", "g": ["mystery", "classics"], "sn": "Hercule Poirot", "si": 10.0, "au": false, "fav": false, "isbn": "0007119313", "pub": "HarperCollins", "bind": "Paperback", "rev": ""}, {"id": "203578847", "t": "Wind and Truth", "a": "Brandon Sanderson", "r": 3, "ar": 4.37, "p": 1344, "y": "2024", "dr": "2025/12/11", "da": "2025/09/15", "s": "read", "g": ["fantasy"], "sn": "The Stormlight Archive", "si": 5.0, "au": false, "fav": false, "isbn": "1250319188", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "50202953", "t": "Piranesi", "a": "Susanna Clarke", "r": 0, "ar": 4.21, "p": 245, "y": "2020", "dr": "", "da": "2025/12/08", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "163557563X", "pub": "Bloomsbury", "bind": "Hardcover", "rev": ""}, {"id": "62047984", "t": "Yellowface", "a": "R.F. Kuang", "r": 4, "ar": 3.72, "p": 319, "y": "2023", "dr": "2025/11/30", "da": "2024/06/15", "s": "read", "g": ["mystery"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "William Morrow", "bind": "Paperback", "rev": ""}, {"id": "16286", "t": "The Magus", "a": "John Fowles", "r": 4, "ar": 4.05, "p": 656, "y": "1965", "dr": "2025/11/15", "da": "2025/09/06", "s": "read", "g": ["classics", "fantasy"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0316296198", "pub": "Back Bay Books", "bind": "Paperback", "rev": ""}, {"id": "18122", "t": "The Amber Spyglass", "a": "Philip Pullman", "r": 0, "ar": 4.11, "p": 465, "y": "2000", "dr": "", "da": "2025/10/29", "s": "read", "g": ["fantasy"], "sn": "His Dark Materials", "si": 3.0, "au": false, "fav": false, "isbn": "0440238153", "pub": "Laurel Leaf", "bind": "Mass Market Paperback", "rev": ""}, {"id": "41637836", "t": "The Subtle Knife", "a": "Philip Pullman", "r": 0, "ar": 4.15, "p": 370, "y": "1997", "dr": "", "da": "2025/10/29", "s": "read", "g": ["fantasy"], "sn": "His Dark Materials", "si": 2.0, "au": false, "fav": false, "isbn": "", "pub": "RHCP Digital", "bind": "Kindle Edition", "rev": ""}, {"id": "228587642", "t": "The Rose Field", "a": "Philip Pullman", "r": 0, "ar": 3.64, "p": 657, "y": "2025", "dr": "", "da": "2025/10/29", "s": "to-read", "g": [], "sn": "The Book of Dust", "si": 3.0, "au": false, "fav": false, "isbn": "0593306635", "pub": "Knopf", "bind": "Hardcover", "rev": ""}, {"id": "6149", "t": "Beloved", "a": "Toni Morrison", "r": 0, "ar": 3.98, "p": 325, "y": "1987", "dr": "", "da": "2025/10/25", "s": "to-read", "g": [], "sn": "Beloved Trilogy", "si": 1.0, "au": false, "fav": false, "isbn": "", "pub": "Vintage", "bind": "Paperback", "rev": ""}, {"id": "71327394", "t": "What We Remember Will Be Saved: A Story of Refugees and the Things They Carry", "a": "Stephanie Saldana", "r": 0, "ar": 4.42, "p": 288, "y": "2023", "dr": "", "da": "2025/10/08", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1506484220", "pub": "Broadleaf Books", "bind": "Kindle Edition", "rev": ""}, {"id": "133518", "t": "The Things They Carried", "a": "Tim O'Brien", "r": 0, "ar": 4.15, "p": 246, "y": "1990", "dr": "", "da": "2025/10/08", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0767902890", "pub": "Broadway", "bind": "Paperback", "rev": ""}, {"id": "764347", "t": "Unwind", "a": "Neal Shusterman", "r": 4, "ar": 4.17, "p": 337, "y": "2007", "dr": "2025/09/10", "da": "2025/08/27", "s": "read", "g": [], "sn": "Unwind", "si": 1.0, "au": false, "fav": false, "isbn": "", "pub": "Simon & Schuster Books for Young Readers", "bind": "Hardcover", "rev": ""}, {"id": "28921", "t": "The Remains of the Day", "a": "Kazuo Ishiguro", "r": 0, "ar": 4.14, "p": 258, "y": "1989", "dr": "", "da": "2025/09/08", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Faber & Faber", "bind": "Paperback", "rev": ""}, {"id": "24800", "t": "House of Leaves", "a": "Mark Z. Danielewski", "r": 0, "ar": 4.09, "p": 709, "y": "2000", "dr": "", "da": "2025/09/07", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Random House", "bind": "Paperback", "rev": ""}, {"id": "57945316", "t": "Babel", "a": "R.F. Kuang", "r": 0, "ar": 4.14, "p": 544, "y": "2022", "dr": "", "da": "2025/08/27", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0063021420", "pub": "Harper Voyager", "bind": "Hardcover", "rev": ""}, {"id": "5297", "t": "The Picture of Dorian Gray", "a": "Oscar Wilde", "r": 3, "ar": 4.14, "p": 272, "y": "1890", "dr": "2025/08/23", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Random House: Modern Library", "bind": "Paperback", "rev": ""}, {"id": "485894", "t": "The Metamorphosis", "a": "Franz Kafka", "r": 2, "ar": 3.91, "p": 201, "y": "1915", "dr": "2025/08/27", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0553213695", "pub": "Bantam Classics", "bind": "Mass Market Paperback", "rev": ""}, {"id": "53642699", "t": "The Mountain Is You: Transforming Self-Sabotage Into Self-Mastery", "a": "Brianna Wiest", "r": 0, "ar": 4.04, "p": 250, "y": "2020", "dr": "", "da": "2025/08/20", "s": "currently-reading", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Thought Catalog Books", "bind": "Kindle Edition", "rev": ""}, {"id": "35959740", "t": "Circe", "a": "Madeline Miller", "r": 5, "ar": 4.22, "p": 393, "y": "2018", "dr": "2025/08/09", "da": "2024/01/21", "s": "read", "g": ["fantasy", "historical-fiction"], "sn": "", "si": 0, "au": false, "fav": true, "isbn": "0316556343", "pub": "Little, Brown and Company", "bind": "Hardcover", "rev": "A beautiful, lyrical book."}, {"id": "13623848", "t": "The Song of Achilles", "a": "Madeline Miller", "r": 5, "ar": 4.3, "p": 408, "y": "2011", "dr": "2025/08/18", "da": "2024/01/21", "s": "read", "g": ["fantasy"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Ecco", "bind": "Paperback", "rev": ""}, {"id": "29127", "t": "The Last Unicorn", "a": "Peter S. Beagle", "r": 0, "ar": 4.16, "p": 294, "y": "1968", "dr": "", "da": "2025/08/16", "s": "to-read", "g": [], "sn": "The Last Unicorn", "si": 1.0, "au": false, "fav": false, "isbn": "", "pub": "Penguin Roc", "bind": "Paperback", "rev": ""}, {"id": "22208031", "t": "I Saw Water: An Occult Novel and Other Selected Writings", "a": "Ithell Colquhoun", "r": 0, "ar": 4.0, "p": 228, "y": "2014", "dr": "", "da": "2025/08/15", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0271064234", "pub": "Penn State University Press", "bind": "Hardcover", "rev": ""}, {"id": "21086818", "t": "Do No Harm: Stories of Life, Death and Brain Surgery", "a": "Henry Marsh", "r": 4, "ar": 4.25, "p": 278, "y": "2014", "dr": "2025/07/31", "da": "2025/07/21", "s": "read", "g": ["non-fiction", "memoir"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0297869876", "pub": "Weidenfeld & Nicolson", "bind": "Hardcover", "rev": ""}, {"id": "42844155", "t": "Harry Potter and the Philosopher's Stone", "a": "J.K. Rowling", "r": 4, "ar": 4.47, "p": 333, "y": "1997", "dr": "", "da": "2024/01/17", "s": "currently-reading", "g": ["fantasy", "young-adult", "arabic"], "sn": "Harry Potter", "si": 1.0, "au": false, "fav": false, "isbn": "", "pub": "Pottermore Publishing", "bind": "Kindle Edition", "rev": ""}, {"id": "153747", "t": "Moby-Dick or, The Whale", "a": "Herman Melville", "r": 0, "ar": 3.57, "p": 720, "y": "1851", "dr": "2024/07/11", "da": "2024/06/15", "s": "dnf", "g": [], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0142437247", "pub": "Penguin Classics ", "bind": "Paperback", "rev": ""}, {"id": "7235533", "t": "The Way of Kings", "a": "Brandon Sanderson", "r": 3, "ar": 4.66, "p": 1007, "y": "2010", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy"], "sn": "The Stormlight Archive", "si": 1.0, "au": true, "fav": false, "isbn": "0765326353", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "10803121", "t": "The Alloy of Law", "a": "Brandon Sanderson", "r": 3, "ar": 4.19, "p": 325, "y": "2011", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "Mistborn", "si": 4.0, "au": true, "fav": false, "isbn": "0765330423", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "17332218", "t": "Words of Radiance", "a": "Brandon Sanderson", "r": 4, "ar": 4.76, "p": 1088, "y": "2014", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "The Stormlight Archive", "si": 2.0, "au": true, "fav": false, "isbn": "0765326361", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "51497", "t": "The Strange Case of Dr. Jekyll and Mr. Hyde and Other Tales of Terror", "a": "Robert Louis Stevenson", "r": 4, "ar": 3.91, "p": 224, "y": "1886", "dr": "", "da": "2024/06/15", "s": "read", "g": ["fantasy", "classics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0141439734", "pub": "Penguin Classics", "bind": "Paperback", "rev": ""}, {"id": "59997865", "t": "Nothing But The Truth: The Memoir of an Unlikely Lawyer", "a": "The Secret Barrister", "r": 5, "ar": 4.07, "p": 320, "y": "2022", "dr": "", "da": "2024/06/15", "s": "read", "g": ["non-fiction", "law", "politics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1529057027", "pub": "Picador", "bind": "Hardcover", "rev": ""}, {"id": "58491879", "t": "Glory", "a": "NoViolet Bulawayo", "r": 4, "ar": 3.7, "p": 416, "y": "2022", "dr": "", "da": "2024/06/15", "s": "read", "g": ["historical-fiction"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0525561137", "pub": "Viking", "bind": "Hardcover", "rev": ""}, {"id": "36620738", "t": "The Secret Barrister: Stories of the Law and How It's Broken", "a": "The Secret Barrister", "r": 5, "ar": 3.88, "p": 385, "y": "2018", "dr": "", "da": "2024/06/15", "s": "read", "g": ["non-fiction", "law", "politics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1509841156", "pub": "Picador", "bind": "Kindle Edition", "rev": ""}, {"id": "18739426", "t": "The Bands of Mourning", "a": "Brandon Sanderson", "r": 3, "ar": 4.4, "p": 455, "y": "2016", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "Mistborn", "si": 6.0, "au": true, "fav": false, "isbn": "146686267X", "pub": "Tor", "bind": "Kindle Edition", "rev": ""}, {"id": "49021976", "t": "Rhythm of War", "a": "Brandon Sanderson", "r": 4, "ar": 4.58, "p": 1232, "y": "2020", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "The Stormlight Archive", "si": 4.0, "au": true, "fav": false, "isbn": "0765326388", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "34002132", "t": "Oathbringer", "a": "Brandon Sanderson", "r": 4, "ar": 4.6, "p": 1248, "y": "2017", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "The Stormlight Archive", "si": 3.0, "au": true, "fav": false, "isbn": "", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "9361589", "t": "The Night Circus", "a": "Erin Morgenstern", "r": 5, "ar": 4.0, "p": 506, "y": "2011", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": true, "isbn": "", "pub": "Doubleday", "bind": "Hardcover", "rev": ""}, {"id": "44767458", "t": "Dune", "a": "Frank Herbert", "r": 2, "ar": 4.29, "p": 658, "y": "1965", "dr": "", "da": "2024/01/17", "s": "read", "g": ["sci-fi"], "sn": "Dune", "si": 1.0, "au": true, "fav": false, "isbn": "059309932X", "pub": "Ace", "bind": "Hardcover", "rev": ""}, {"id": "18373", "t": "Flowers for Algernon", "a": "Daniel Keyes", "r": 4, "ar": 4.24, "p": 311, "y": "1966", "dr": "", "da": "2024/06/15", "s": "read", "g": ["classics", "young-adult", "sci-fi"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "015603008X", "pub": "Harvest Books", "bind": "Paperback", "rev": ""}, {"id": "52892857", "t": "The Color Purple", "a": "Alice Walker", "r": 5, "ar": 4.28, "p": 287, "y": "1982", "dr": "", "da": "2024/04/16", "s": "read", "g": ["historical-fiction"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0143135694", "pub": "Penguin Books", "bind": "Paperback", "rev": ""}, {"id": "1885", "t": "Pride and Prejudice", "a": "Jane Austen", "r": 4, "ar": 4.3, "p": 279, "y": "1813", "dr": "", "da": "2024/01/17", "s": "read", "g": ["classics", "romance"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1441341706", "pub": "Modern Library", "bind": "Paperback", "rev": ""}, {"id": "11590", "t": "\u2019Salem\u2019s Lot", "a": "Stephen  King", "r": 3, "ar": 4.1, "p": 483, "y": "1975", "dr": "", "da": "2024/06/15", "s": "read", "g": ["horror", "fantasy"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0450031063", "pub": "New English Library", "bind": "Paperback", "rev": ""}, {"id": "68427", "t": "Elantris", "a": "Brandon Sanderson", "r": 3, "ar": 4.17, "p": 638, "y": "2005", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "Elantris", "si": 1.0, "au": true, "fav": false, "isbn": "0765350378", "pub": "Tor Fantasy", "bind": "Mass Market Paperback", "rev": ""}, {"id": "4406", "t": "East of Eden", "a": "John Steinbeck", "r": 3, "ar": 4.44, "p": 601, "y": "1952", "dr": "", "da": "2024/04/16", "s": "read", "g": ["classics", "historical-fiction"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0142000655", "pub": "Penguin Books", "bind": "Paperback", "rev": ""}, {"id": "186074", "t": "The Name of the Wind", "a": "Patrick Rothfuss", "r": 5, "ar": 4.52, "p": 662, "y": "2007", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy"], "sn": "The Kingkiller Chronicle", "si": 1.0, "au": true, "fav": false, "isbn": "075640407X", "pub": "Penguin Group DAW", "bind": "Hardcover", "rev": ""}, {"id": "68429", "t": "The Well of Ascension", "a": "Brandon Sanderson", "r": 4, "ar": 4.38, "p": 590, "y": "2007", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy"], "sn": "Mistborn", "si": 2.0, "au": true, "fav": false, "isbn": "0765316889", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "1268479", "t": "Warbreaker", "a": "Brandon Sanderson", "r": 3, "ar": 4.29, "p": 688, "y": "2009", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "", "pub": "Self-published", "bind": "ebook", "rev": ""}, {"id": "61439040", "t": "1984", "a": "George Orwell", "r": 4, "ar": 4.2, "p": 368, "y": "1948", "dr": "", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0452284236", "pub": "Plume", "bind": "Paperback", "rev": ""}, {"id": "13642", "t": "A Wizard of Earthsea", "a": "Ursula K. Le Guin", "r": 4, "ar": 4.01, "p": 183, "y": "1968", "dr": "", "da": "2024/06/15", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Earthsea Cycle", "si": 1.0, "au": true, "fav": false, "isbn": "", "pub": "", "bind": "Paperback", "rev": ""}, {"id": "68428", "t": "Mistborn: The Final Empire", "a": "Brandon Sanderson", "r": 4, "ar": 4.49, "p": 541, "y": "2006", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy"], "sn": "Mistborn", "si": 1.0, "au": true, "fav": false, "isbn": "", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "1215032", "t": "The Wise Man's Fear", "a": "Patrick Rothfuss", "r": 4, "ar": 4.55, "p": 994, "y": "2011", "dr": "2017/08/01", "da": "2025/06/22", "s": "read", "g": ["fantasy"], "sn": "The Kingkiller Chronicle", "si": 2.0, "au": true, "fav": false, "isbn": "0756404738", "pub": "DAW Books", "bind": "Hardcover", "rev": ""}, {"id": "2767793", "t": "The Hero of Ages", "a": "Brandon Sanderson", "r": 4, "ar": 4.56, "p": 572, "y": "2008", "dr": "2024/02/01", "da": "2024/01/17", "s": "read", "g": ["fantasy"], "sn": "Mistborn", "si": 3.0, "au": true, "fav": false, "isbn": "0765316897", "pub": "Tor Books", "bind": "Hardcover", "rev": ""}, {"id": "64645770", "t": "Abroad in Japan: Ten Years in the Land of the Rising Sun", "a": "Chris  Broad", "r": 3, "ar": 4.12, "p": 320, "y": "2023", "dr": "2024/04/16", "da": "2024/03/19", "s": "read", "g": ["non-fiction", "travel", "biography"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1787637077", "pub": "Bantam Press", "bind": "Hardcover", "rev": ""}, {"id": "890", "t": "Of Mice and Men", "a": "John Steinbeck", "r": 3, "ar": 3.9, "p": 107, "y": "1937", "dr": "2024/04/18", "da": "2024/04/18", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0142000671", "pub": "Penguin Books", "bind": "Paperback", "rev": ""}, {"id": "2657", "t": "To Kill a Mockingbird", "a": "Harper Lee", "r": 3, "ar": 4.26, "p": 323, "y": "1960", "dr": "", "da": "2024/01/17", "s": "read", "g": ["classics", "historical-fiction"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0060935464", "pub": "Harper Perennial Modern Classics ", "bind": "Paperback", "rev": ""}, {"id": "35133922", "t": "Educated", "a": "Tara Westover", "r": 5, "ar": 4.46, "p": 352, "y": "2018", "dr": "2024/06/28", "da": "2024/06/14", "s": "read", "g": ["non-fiction", "autobiography", "memoir"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0399590501", "pub": "Random House", "bind": "Hardcover", "rev": "Incredible story! Really engaging writing, I listened through audio book and was finding reasons to be alone so I could continue listening!"}, {"id": "48727813", "t": "She Who Became the Sun", "a": "Shelley Parker-Chan", "r": 4, "ar": 3.84, "p": 416, "y": "2021", "dr": "2024/08/21", "da": "2024/07/14", "s": "read", "g": ["fantasy", "historical-fiction"], "sn": "The Radiant Emperor", "si": 1.0, "au": true, "fav": false, "isbn": "1250621798", "pub": "Tor Books", "bind": "Kindle Edition", "rev": ""}, {"id": "63132362", "t": "He Who Drowned the World", "a": "Shelley Parker-Chan", "r": 4, "ar": 4.21, "p": 486, "y": "2023", "dr": "2024/09/10", "da": "2024/08/21", "s": "read", "g": ["fantasy", "historical-fiction"], "sn": "The Radiant Emperor", "si": 2.0, "au": true, "fav": false, "isbn": "1250621836", "pub": "Tor Books", "bind": "ebook", "rev": ""}, {"id": "6692041", "t": "Mornings in Jenin", "a": "Susan Abulhawa", "r": 5, "ar": 4.52, "p": 331, "y": "2006", "dr": "2024/11/01", "da": "2024/10/31", "s": "read", "g": ["palestine", "historical-fiction"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1608190463", "pub": "Bloomsbury Adult", "bind": "Paperback", "rev": ""}, {"id": "7126", "t": "The Count of Monte Cristo", "a": "Alexandre Dumas", "r": 4, "ar": 4.33, "p": 1276, "y": "1844", "dr": "2025/01/31", "da": "2024/11/23", "s": "read", "g": ["historical-fiction", "adventure"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0140449264", "pub": "Penguin Classics", "bind": "Paperback", "rev": "Gripping and thrilling (almost) throughout! The narrative slowed down in the middle when some new characters were being introduced, but once the set-up was out of the way I was constantly interested in every character's viewpoint and absolutely loved seeing all the pieces fit together! Surprisingly, I didn't find the book felt too dated despite its age and though the writing style took some getting used to (particularly the painstaking elaboration of certain points and constant repetition) it quickly became part of the book's charm.<br/>"}, {"id": "29780253", "t": "Born a Crime: Stories from a South African Childhood", "a": "Trevor Noah", "r": 4, "ar": 4.49, "p": 289, "y": "2016", "dr": "2025/02/23", "da": "2024/06/17", "s": "read", "g": ["autobiography", "memoir"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0385689225", "pub": "Doubleday Canada", "bind": "Hardcover", "rev": ""}, {"id": "41817486", "t": "A Clockwork Orange", "a": "Anthony Burgess", "r": 5, "ar": 4.0, "p": 240, "y": "1962", "dr": "2025/03/04", "da": "2025/02/24", "s": "read", "g": ["sci-fi", "classics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0393341763", "pub": "W. W. Norton & Company", "bind": "Paperback", "rev": "I have never seen the film and only had heard about the book as part of pop culture, so went in relatively blind.<br/>One of my favourite things about the book was the use of Nadsat. I listened to the book as an audiobook and, while it felt like I was having a stroke at first, I really enjoyed slowly understanding the slang like a new language. Burgess uses Nadsat carefully so that there are almost always context clues as to what the new words mean and, if not, there are other opportunities later to understand.<br/>The story itself was stomach-turning at times and the main character was generally unpleasant throughout but I thought there was never a dull moment following Alex and his droogs."}, {"id": "250295", "t": "Voice of the Fire", "a": "Alan             Moore", "r": 3, "ar": 3.96, "p": 336, "y": "1996", "dr": "2025/04/01", "da": "2025/03/04", "s": "read", "g": ["historical-fiction", "fantasy"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1891830449", "pub": "Top Shelf Productions", "bind": "Hardcover", "rev": ""}, {"id": "10603", "t": "Cujo", "a": "Stephen  King", "r": 3, "ar": 3.8, "p": 432, "y": "1981", "dr": "2025/04/19", "da": "2025/04/06", "s": "read", "g": ["horror"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0307348245", "pub": "Debolsillo", "bind": "Mass Market Paperback", "rev": ""}, {"id": "830502", "t": "It", "a": "Stephen  King", "r": 5, "ar": 4.24, "p": 1184, "y": "1986", "dr": "2025/06/15", "da": "2025/04/21", "s": "read", "g": ["horror"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0450411435", "pub": "New English Library", "bind": "Paperback", "rev": ""}, {"id": "10210", "t": "Jane Eyre", "a": "Charlotte Bront\u00eb", "r": 4, "ar": 4.16, "p": 532, "y": "1847", "dr": "2025/07/21", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "0142437204", "pub": "Penguin", "bind": "Paperback", "rev": ""}, {"id": "41811", "t": "The Caves of Steel", "a": "Isaac Asimov", "r": 3, "ar": 4.19, "p": 206, "y": "1953", "dr": "2025/07/23", "da": "2025/06/18", "s": "read", "g": ["sci-fi", "classics"], "sn": "Robot", "si": 1.0, "au": false, "fav": false, "isbn": "", "pub": "Voyager", "bind": "Mass Market Paperback", "rev": ""}, {"id": "7624", "t": "Lord of the Flies", "a": "William Golding", "r": 0, "ar": 3.7, "p": 182, "y": "1954", "dr": "", "da": "2024/01/17", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0140283331", "pub": "Penguin Books ", "bind": "Paperback", "rev": ""}, {"id": "62334530", "t": "None of This Is True", "a": "Lisa Jewell", "r": 0, "ar": 4.07, "p": 390, "y": "2023", "dr": "", "da": "2025/06/22", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1982179007", "pub": "Atria Books", "bind": "Hardcover", "rev": ""}, {"id": "32620332", "t": "The Seven Husbands of Evelyn Hugo", "a": "Taylor Jenkins Reid", "r": 0, "ar": 4.39, "p": 389, "y": "2017", "dr": "", "da": "2025/06/22", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1501139231", "pub": "Atria Books", "bind": "Hardcover", "rev": ""}, {"id": "220160814", "t": "Don't Let Him In", "a": "Lisa Jewell", "r": 0, "ar": 3.76, "p": 361, "y": "2025", "dr": "", "da": "2025/06/22", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1668033879", "pub": "Atria Books", "bind": "Hardcover", "rev": ""}, {"id": "375802", "t": "Ender\u2019s Game", "a": "Orson Scott Card", "r": 4, "ar": 4.31, "p": 324, "y": "1985", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "Ender's Saga", "si": 1.0, "au": false, "fav": false, "isbn": "0812550706", "pub": "Tor", "bind": "Mass Market Paperback", "rev": ""}, {"id": "55145261", "t": "The Anthropocene Reviewed: Essays on a Human-Centered Planet", "a": "John Green", "r": 5, "ar": 4.35, "p": 304, "y": "2021", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0525555218", "pub": "Dutton", "bind": "Hardcover", "rev": ""}, {"id": "215526423", "t": "An Abundance of Katherines", "a": "John Green", "r": 3, "ar": 3.51, "p": 260, "y": "2006", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Speak ", "bind": "Kindle Edition", "rev": ""}, {"id": "35504431", "t": "Turtles All the Way Down", "a": "John Green", "r": 4, "ar": 3.87, "p": 290, "y": "2017", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0525555366", "pub": "Dutton Books for Young Readers", "bind": "Hardcover", "rev": ""}, {"id": "99561", "t": "Looking for Alaska", "a": "John Green", "r": 5, "ar": 3.96, "p": 221, "y": "2005", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1435249151", "pub": "Speak", "bind": "Paperback", "rev": ""}, {"id": "17165596", "t": "The Kite Runner", "a": "Khaled Hosseini", "r": 0, "ar": 4.36, "p": 371, "y": "2003", "dr": "", "da": "2025/06/22", "s": "read", "g": ["historical-fiction"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Riverhead Books", "bind": "Paperback", "rev": ""}, {"id": "10079321", "t": "The Magician King", "a": "Lev Grossman", "r": 0, "ar": 3.93, "p": 432, "y": "2011", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "The Magicians", "si": 2.0, "au": false, "fav": false, "isbn": "043402080X", "pub": "William Heinemann", "bind": "Paperback", "rev": ""}, {"id": "19103097", "t": "The Magician's Land", "a": "Lev Grossman", "r": 0, "ar": 4.14, "p": 402, "y": "2014", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "The Magicians", "si": 3.0, "au": false, "fav": false, "isbn": "", "pub": "Plume", "bind": "ebook", "rev": ""}, {"id": "6101718", "t": "The Magicians", "a": "Lev Grossman", "r": 0, "ar": 3.53, "p": 402, "y": "2009", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "The Magicians", "si": 1.0, "au": false, "fav": false, "isbn": "0670020559", "pub": "Viking", "bind": "Hardcover", "rev": ""}, {"id": "10664113", "t": "A Dance with Dragons", "a": "George R.R. Martin", "r": 0, "ar": 4.34, "p": 1125, "y": "2011", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "A Song of Ice and Fire", "si": 5.0, "au": false, "fav": false, "isbn": "", "pub": "Random House Worlds", "bind": "Kindle Edition", "rev": ""}, {"id": "62291", "t": "A Storm of Swords", "a": "George R.R. Martin", "r": 0, "ar": 4.55, "p": 1177, "y": "2000", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "A Song of Ice and Fire", "si": 3.0, "au": false, "fav": false, "isbn": "", "pub": "Bantam", "bind": "Mass Market Paperback", "rev": ""}, {"id": "13497", "t": "A Feast for Crows", "a": "George R.R. Martin", "r": 0, "ar": 4.17, "p": 1060, "y": "2005", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "A Song of Ice and Fire", "si": 4.0, "au": false, "fav": false, "isbn": "", "pub": "Bantam Books", "bind": "Mass Market Paperback", "rev": ""}, {"id": "10572", "t": "A Clash of Kings", "a": "George R.R. Martin", "r": 0, "ar": 4.42, "p": 1009, "y": "1998", "dr": "", "da": "2025/06/22", "s": "read", "g": [], "sn": "A Song of Ice and Fire", "si": 2.0, "au": false, "fav": false, "isbn": "", "pub": "Random House Worlds", "bind": "Paperback", "rev": ""}, {"id": "220341389", "t": "Everything Is Tuberculosis: The History and Persistence of Our Deadliest Infection", "a": "John Green", "r": 5, "ar": 4.35, "p": 198, "y": "2025", "dr": "2025/06/11", "da": "2025/04/03", "s": "read", "g": ["non-fiction"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0525556575", "pub": "Crash Course Books", "bind": "Hardcover", "rev": ""}, {"id": "90202302", "t": "Iron Flame", "a": "Rebecca Yarros", "r": 4, "ar": 4.36, "p": 640, "y": "2023", "dr": "2025/05/29", "da": "2025/04/03", "s": "read", "g": ["fantasy", "romance"], "sn": "The Empyrean", "si": 2.0, "au": false, "fav": false, "isbn": "1649374178", "pub": "Entangled: Red Tower Books", "bind": "Hardcover", "rev": ""}, {"id": "6437363", "t": "Your Money or Your Life - Abridged", "a": "Vicki Robin", "r": 0, "ar": 3.77, "p": 2, "y": "2009", "dr": "", "da": "2025/04/26", "s": "currently-reading", "g": [], "sn": "", "si": 0, "au": true, "fav": false, "isbn": "1591797306", "pub": "Sounds True", "bind": "Audio CD", "rev": ""}, {"id": "50276196", "t": "People Like Us: What it Takes to Make it in Modern Britain", "a": "Hashi Mohamed", "r": 0, "ar": 4.34, "p": 321, "y": "2020", "dr": "", "da": "2025/04/21", "s": "currently-reading", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Profile Books", "bind": "Kindle Edition", "rev": ""}, {"id": "40672036", "t": "Digital Minimalism: Choosing a Focused Life in a Noisy World", "a": "Cal Newport", "r": 0, "ar": 4.05, "p": 302, "y": "2019", "dr": "", "da": "2025/04/21", "s": "currently-reading", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "052553654X", "pub": "Portfolio", "bind": "Kindle Edition", "rev": ""}, {"id": "7734691", "t": "The Rule of Law", "a": "Tom Bingham", "r": 0, "ar": 4.09, "p": 203, "y": "2010", "dr": "", "da": "2025/04/20", "s": "currently-reading", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1846140900", "pub": "Allen Lane", "bind": "Hardcover", "rev": ""}, {"id": "214331246", "t": "Sunrise on the Reaping", "a": "Suzanne Collins", "r": 0, "ar": 4.5, "p": 387, "y": "2025", "dr": "", "da": "2025/04/12", "s": "to-read", "g": [], "sn": "The Hunger Games", "si": 0.5, "au": false, "fav": false, "isbn": "1546171460", "pub": "Scholastic Press", "bind": "Hardcover", "rev": ""}, {"id": "210943364", "t": "The Message", "a": "Ta-Nehisi Coates", "r": 0, "ar": 4.5, "p": 232, "y": "2024", "dr": "", "da": "2025/04/12", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0593230388", "pub": "One World", "bind": "Hardcover", "rev": ""}, {"id": "209439446", "t": "Onyx Storm", "a": "Rebecca Yarros", "r": 0, "ar": 4.21, "p": 544, "y": "2025", "dr": "", "da": "2025/04/12", "s": "to-read", "g": [], "sn": "The Empyrean", "si": 3.0, "au": false, "fav": false, "isbn": "1649374186", "pub": "Red Tower Books", "bind": "Hardcover", "rev": ""}, {"id": "61431922", "t": "Fourth Wing", "a": "Rebecca Yarros", "r": 4, "ar": 4.57, "p": 517, "y": "2023", "dr": "2025/04/01", "da": "2025/03/02", "s": "read", "g": ["romance", "fantasy"], "sn": "The Empyrean", "si": 1.0, "au": false, "fav": false, "isbn": "1649374046", "pub": "Entangled: Red Tower Books", "bind": "Hardcover", "rev": ""}, {"id": "37887580", "t": "All the Young Dudes", "a": "MsKingBean89", "r": 5, "ar": 4.76, "p": 1799, "y": "2018", "dr": "2025/02/20", "da": "2025/02/02", "s": "read", "g": ["fanfiction"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Archive of Our Own", "bind": "ebook", "rev": ""}, {"id": "216670080", "t": "Strange Pictures", "a": "Uketsu", "r": 3, "ar": 3.93, "p": 236, "y": "2022", "dr": "2025/01/23", "da": "2025/01/19", "s": "read", "g": ["horror"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0063433087", "pub": "HarperVia", "bind": "Paperback", "rev": "Between horror and mystery, this book leans more into mystery. I really enjoyed the first chapter and thought it was an excellent, gripping and chilling start. The use of pictures in the book is also unique and intriguing and really helps immerse the reader in the book, encouraging them to try and work with the clues alongside the book's characters to solve the puzzle. I'd recommend avoiding the temptation to flick through the pages to avoid spoiling some of the solutions as the story progresses!<br/><br/>Overall, I enjoyed the book and would recommend it, particularly as it's such a short read."}, {"id": "12344319", "t": "The Weird: A Compendium of Strange and Dark Stories", "a": "Ann VanderMeer", "r": 0, "ar": 4.27, "p": 1126, "y": "2010", "dr": "", "da": "2025/01/08", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1848876874", "pub": "Corvus", "bind": "Paperback", "rev": ""}, {"id": "9328", "t": "The House of the Spirits", "a": "Isabel Allende", "r": 5, "ar": 4.3, "p": 448, "y": "1982", "dr": "2024/12/31", "da": "2024/10/31", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0553383809", "pub": "Dial Press Trade Paperback", "bind": "Paperback", "rev": ""}, {"id": "201242757", "t": "You Like It Darker", "a": "Stephen  King", "r": 0, "ar": 4.18, "p": 512, "y": "2024", "dr": "", "da": "2024/12/11", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1668037718", "pub": "Scribner", "bind": "Hardcover", "rev": ""}, {"id": "57933312", "t": "How Minds Change: The Surprising Science of Belief, Opinion, and Persuasion", "a": "David McRaney", "r": 0, "ar": 4.13, "p": 352, "y": "2022", "dr": "", "da": "2024/11/23", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0593190297", "pub": "Portfolio", "bind": "Hardcover", "rev": ""}, {"id": "55711592", "t": "High Conflict: Why We Get Trapped and How We Get Out", "a": "Amanda Ripley", "r": 0, "ar": 4.26, "p": 368, "y": "2021", "dr": "", "da": "2024/11/23", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1982128569", "pub": "Simon & Schuster", "bind": "Hardcover", "rev": ""}, {"id": "43154949", "t": "Justice for Some: Law and the Question of Palestine", "a": "Noura Erakat", "r": 0, "ar": 4.56, "p": 352, "y": "2019", "dr": "", "da": "2024/10/12", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0804798257", "pub": "Stanford University Press", "bind": "Hardcover", "rev": ""}, {"id": "12067", "t": "Good Omens: The Nice and Accurate Prophecies of Agnes Nutter, Witch", "a": "Terry Pratchett", "r": 3, "ar": 4.25, "p": 491, "y": "1990", "dr": "2024/09/17", "da": "2024/08/21", "s": "read", "g": ["fantasy", "comedy"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "William Morrow Paperbacks", "bind": "Mass Market Paperback", "rev": ""}, {"id": "57540", "t": "The Ethnic Cleansing of Palestine", "a": "Ilan Papp\u00e9", "r": 5, "ar": 4.55, "p": 320, "y": "2006", "dr": "2024/08/26", "da": "2024/04/06", "s": "read", "g": ["palestine", "history"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1851684670", "pub": "Oneworld Publications", "bind": "Hardcover", "rev": ""}, {"id": "52578297", "t": "The Midnight Library", "a": "Matt Haig", "r": 3, "ar": 3.98, "p": 288, "y": "2020", "dr": "2024/07/11", "da": "2024/06/17", "s": "read", "g": [], "sn": "The Midnight World", "si": 1.0, "au": false, "fav": false, "isbn": "0525559477", "pub": "Viking", "bind": "Hardcover", "rev": ""}, {"id": "58514454", "t": "The Roles We Play", "a": "Sabba Khan", "r": 0, "ar": 4.33, "p": 272, "y": "2021", "dr": "", "da": "2024/06/09", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1912408309", "pub": "Myriad Editions", "bind": "Paperback", "rev": ""}, {"id": "8550813", "t": "I Shall Not Hate: A Gaza Doctor's Journey on the Road to Peace and Human Dignity", "a": "Izzeldin Abuelaish", "r": 0, "ar": 4.32, "p": 237, "y": "2010", "dr": "", "da": "2024/05/03", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0802779174", "pub": "Walker Books", "bind": "Hardcover", "rev": ""}, {"id": "76150399", "t": "One State: The Only Democratic Future for Palestine-Israel", "a": "Ghada Karmi", "r": 5, "ar": 4.19, "p": 208, "y": "2023", "dr": "2024/04/16", "da": "2024/02/12", "s": "read", "g": ["palestine"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0745348319", "pub": "Pluto Press", "bind": "Paperback", "rev": ""}, {"id": "53496557", "t": "Except for Palestine: The Limits of Progressive Politics", "a": "Marc Lamont Hill", "r": 0, "ar": 4.19, "p": 227, "y": "2021", "dr": "", "da": "2024/04/06", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1620975920", "pub": "The New Press", "bind": "Hardcover", "rev": ""}, {"id": "58272213", "t": "The Fate of Abraham: Why the West is Wrong about Islam", "a": "Peter Oborne", "r": 0, "ar": 4.16, "p": 434, "y": "2022", "dr": "", "da": "2024/04/06", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1398501042", "pub": "Simon & Schuster UK", "bind": "Kindle Edition", "rev": ""}, {"id": "51901147", "t": "The Ballad of Songbirds and Snakes", "a": "Suzanne Collins", "r": 4, "ar": 3.99, "p": 652, "y": "2020", "dr": "2024/03/01", "da": "2024/01/21", "s": "read", "g": [], "sn": "The Hunger Games", "si": 0.0, "au": false, "fav": false, "isbn": "", "pub": "Scholastic Press", "bind": "Kindle Edition", "rev": ""}, {"id": "23129811", "t": "On Palestine", "a": "Noam Chomsky", "r": 4, "ar": 4.26, "p": 220, "y": "2015", "dr": "2024/02/12", "da": "2024/01/19", "s": "read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1608464709", "pub": "Haymarket Books", "bind": "Paperback", "rev": ""}, {"id": "2767052", "t": "The Hunger Games", "a": "Suzanne Collins", "r": 4, "ar": 4.35, "p": 374, "y": "2008", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Hunger Games", "si": 1.0, "au": false, "fav": false, "isbn": "0439023483", "pub": "Scholastic Press", "bind": "Hardcover", "rev": ""}, {"id": "36642458", "t": "Skyward", "a": "Brandon Sanderson", "r": 3, "ar": 4.46, "p": 513, "y": "2018", "dr": "", "da": "2024/01/20", "s": "read", "g": ["fantasy", "sci-fi"], "sn": "Skyward", "si": 1.0, "au": false, "fav": false, "isbn": "1473217857", "pub": "Gollancz", "bind": "Hardcover", "rev": ""}, {"id": "52761023", "t": "Against the Loveless World", "a": "Susan Abulhawa", "r": 4, "ar": 4.5, "p": 384, "y": "2019", "dr": "2024/01/12", "da": "2024/01/19", "s": "read", "g": ["palestine", "historical-fiction"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1982137037", "pub": "Atria Books", "bind": "Hardcover", "rev": ""}, {"id": "41812831", "t": "The Hundred Years\u2019 War on Palestine: A History of Settler-Colonial Conquest and Resistance, 1917\u20132017", "a": "Rashid Khalidi", "r": 5, "ar": 4.49, "p": 319, "y": "2020", "dr": "2023/12/01", "da": "2024/01/19", "s": "read", "g": ["non-fiction", "history", "palestine"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1627798552", "pub": "Metropolitan Books", "bind": "Hardcover", "rev": "A clear and illuminating review of the story of Palestine. As someone who came into this book with little knowledge, I thought it did an excellent job of covering the history from the Palestinian perspective clearly and Khalidi does not shy away from going into criticising the missteps of Palestinian leaders so I find it surprising and frankly disingenuous that other reviews are saying this book is \"propaganda\". I'll definitely be reading it again in the future, hopefully absorbing more the second time around, and I have already found myself going back to reread certain sections.<br/>I'd highly recommend this book as a first read to anyone wanting to start understanding more about Palestine's history."}, {"id": "7260188", "t": "Mockingjay", "a": "Suzanne Collins", "r": 4, "ar": 4.12, "p": 390, "y": "2010", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Hunger Games", "si": 3.0, "au": false, "fav": false, "isbn": "0439023513", "pub": "Scholastic Press", "bind": "Hardcover", "rev": ""}, {"id": "6148028", "t": "Catching Fire", "a": "Suzanne Collins", "r": 4, "ar": 4.36, "p": 391, "y": "2009", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Hunger Games", "si": 2.0, "au": false, "fav": false, "isbn": "0439023491", "pub": "Scholastic Press", "bind": "Hardcover", "rev": ""}, {"id": "6186357", "t": "The Maze Runner", "a": "James Dashner", "r": 4, "ar": 4.06, "p": 384, "y": "2009", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Maze Runner", "si": 1.0, "au": false, "fav": false, "isbn": "0385737947", "pub": "Delacorte Press", "bind": "Hardcover", "rev": ""}, {"id": "4671", "t": "The Great Gatsby", "a": "F. Scott Fitzgerald", "r": 2, "ar": 3.93, "p": 180, "y": "1925", "dr": "", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0743273567", "pub": "Scribner", "bind": "Paperback", "rev": ""}, {"id": "11870085", "t": "The Fault in Our Stars", "a": "John Green", "r": 4, "ar": 4.12, "p": 313, "y": "2012", "dr": "", "da": "2024/01/17", "s": "read", "g": ["romance", "young-adult"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Dutton Books", "bind": "Hardcover", "rev": ""}, {"id": "6442769", "t": "Paper Towns", "a": "John Green", "r": 2, "ar": 3.7, "p": 305, "y": "2008", "dr": "", "da": "2024/01/17", "s": "read", "g": ["young-adult"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "014241493X", "pub": "Speak", "bind": "Paperback", "rev": ""}, {"id": "170448", "t": "Animal Farm", "a": "George Orwell", "r": 5, "ar": 4.02, "p": 141, "y": "1945", "dr": "", "da": "2024/01/17", "s": "read", "g": ["classics"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0451526341", "pub": "Signet Classics", "bind": "Mass Market Paperback", "rev": ""}, {"id": "119322", "t": "The Golden Compass", "a": "Philip Pullman", "r": 4, "ar": 4.03, "p": 399, "y": "1995", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "His Dark Materials", "si": 1.0, "au": false, "fav": false, "isbn": "0679879242", "pub": "RANDOM HOUSE TRADE", "bind": "Hardcover", "rev": ""}, {"id": "428263", "t": "Eclipse", "a": "Stephenie Meyer", "r": 3, "ar": 3.74, "p": 629, "y": "2007", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Twilight Saga", "si": 3.0, "au": false, "fav": false, "isbn": "0316160202", "pub": "Little, Brown and Company", "bind": "Hardcover", "rev": ""}, {"id": "2", "t": "Harry Potter and the Order of the Phoenix", "a": "J.K. Rowling", "r": 4, "ar": 4.5, "p": 870, "y": "2003", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Harry Potter", "si": 5.0, "au": false, "fav": false, "isbn": "0439686520", "pub": "Scholastic Inc.", "bind": "Paperback", "rev": ""}, {"id": "1162543", "t": "Breaking Dawn", "a": "Stephenie Meyer", "r": 3, "ar": 3.76, "p": 756, "y": "2008", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Twilight Saga", "si": 4.0, "au": false, "fav": false, "isbn": "031606792X", "pub": "Little, Brown and Company", "bind": "Hardcover", "rev": ""}, {"id": "136251", "t": "Harry Potter and the Deathly Hallows", "a": "J.K. Rowling", "r": 4, "ar": 4.62, "p": 759, "y": "2007", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Harry Potter", "si": 7.0, "au": false, "fav": false, "isbn": "", "pub": "Arthur A. Levine Books", "bind": "Hardcover", "rev": ""}, {"id": "49041", "t": "New Moon", "a": "Stephenie Meyer", "r": 3, "ar": 3.62, "p": 563, "y": "2006", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "The Twilight Saga", "si": 2.0, "au": false, "fav": false, "isbn": "0316160199", "pub": "Little, Brown and Company", "bind": "Hardcover", "rev": ""}, {"id": "13335037", "t": "Divergent", "a": "Veronica Roth", "r": 3, "ar": 4.13, "p": 487, "y": "2011", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Divergent", "si": 1.0, "au": false, "fav": false, "isbn": "0062024035", "pub": "Katherine Tegen Books", "bind": "Paperback", "rev": ""}, {"id": "1", "t": "Harry Potter and the Half-Blood Prince", "a": "J.K. Rowling", "r": 4, "ar": 4.58, "p": 652, "y": "2005", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Harry Potter", "si": 6.0, "au": false, "fav": false, "isbn": "", "pub": "Scholastic Inc", "bind": "Paperback", "rev": ""}, {"id": "5", "t": "Harry Potter and the Prisoner of Azkaban", "a": "J.K. Rowling", "r": 4, "ar": 4.58, "p": 547, "y": "1999", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Harry Potter", "si": 3.0, "au": false, "fav": false, "isbn": "043965548X", "pub": "Scholastic Inc.", "bind": "Mass Market Paperback", "rev": ""}, {"id": "6", "t": "Harry Potter and the Goblet of Fire", "a": "J.K. Rowling", "r": 4, "ar": 4.57, "p": 734, "y": "2000", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Harry Potter", "si": 4.0, "au": false, "fav": false, "isbn": "0439139597", "pub": "Scholastic", "bind": "Paperback", "rev": ""}, {"id": "15881", "t": "Harry Potter and the Chamber of Secrets", "a": "J.K. Rowling", "r": 4, "ar": 4.43, "p": 352, "y": "1998", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy", "young-adult"], "sn": "Harry Potter", "si": 2.0, "au": false, "fav": false, "isbn": "", "pub": "Arthur A. Levine Books", "bind": "Hardcover", "rev": ""}, {"id": "157993", "t": "The Little Prince", "a": "Antoine de Saint-Exup\u00e9ry", "r": 5, "ar": 4.33, "p": 96, "y": "1943", "dr": "", "da": "2024/01/17", "s": "read", "g": ["young-adult"], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0152023984", "pub": "Harcourt, Inc.", "bind": "Hardcover", "rev": ""}, {"id": "13496", "t": "A Game of Thrones", "a": "George R.R. Martin", "r": 4, "ar": 4.45, "p": 835, "y": "1996", "dr": "", "da": "2024/01/17", "s": "read", "g": ["fantasy"], "sn": "A Song of Ice and Fire", "si": 1.0, "au": false, "fav": false, "isbn": "0553588486", "pub": "Bantam", "bind": "Mass Market Paperback", "rev": ""}, {"id": "37786022", "t": "Storyworthy: Engage, Teach, Persuade, and Change Your Life through the Power of Storytelling", "a": "Matthew Dicks", "r": 0, "ar": 4.26, "p": 368, "y": "2018", "dr": "", "da": "2024/01/17", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "1608685489", "pub": "New World Library", "bind": "Paperback", "rev": ""}, {"id": "5107", "t": "The Catcher in the Rye", "a": "J.D. Salinger", "r": 0, "ar": 3.8, "p": 277, "y": "1951", "dr": "", "da": "2024/01/17", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0316769177", "pub": "Back Bay Books", "bind": "Paperback", "rev": ""}, {"id": "6514", "t": "The Bell Jar", "a": "Sylvia Plath", "r": 0, "ar": 4.05, "p": 294, "y": "1963", "dr": "", "da": "2024/01/17", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0571268862", "pub": "Harper Perennial Modern Classics", "bind": "Paperback", "rev": ""}, {"id": "18144590", "t": "The Alchemist", "a": "Paulo Coelho", "r": 0, "ar": 3.92, "p": 182, "y": "1988", "dr": "", "da": "2024/01/17", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "0062315005", "pub": "HarperOne", "bind": "Paperback", "rev": ""}, {"id": "49552", "t": "The Stranger", "a": "Albert Camus", "r": 0, "ar": 4.03, "p": 123, "y": "1942", "dr": "", "da": "2024/01/17", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Vintage International", "bind": "Paperback", "rev": ""}, {"id": "13079982", "t": "Fahrenheit 451", "a": "Ray Bradbury", "r": 0, "ar": 3.97, "p": 249, "y": "1953", "dr": "", "da": "2024/01/17", "s": "to-read", "g": [], "sn": "", "si": 0, "au": false, "fav": false, "isbn": "", "pub": "Simon & Schuster", "bind": "Mass Market Paperback", "rev": ""}];

// Color palettes for book spines - warm, literary tones
const SPINE_COLORS = [
  "#8B4513","#A0522D","#6B3A2A","#4A2C2A","#2F4F4F","#1B3D2F","#3B3B6D","#4A3728",
  "#6D4C41","#5D4037","#795548","#8D6E63","#4E342E","#3E2723","#263238","#37474F",
  "#455A64","#546E7A","#78909C","#5C3A21","#7B3F00","#8B6914","#556B2F","#2E4057",
  "#704214","#3C1414","#1A237E","#880E4F","#4A148C","#004D40","#BF360C","#E65100",
  "#33691E","#827717","#F57F17","#FF6F00","#D84315","#1B5E20","#0D47A1","#311B92"
];

const GENRE_ICONS = {
  fantasy: "🐉", "sci-fi": "🚀", romance: "💕", mystery: "🔍", horror: "👻",
  classics: "📜", "historical-fiction": "⚔️", "non-fiction": "📊", biography: "👤",
  autobiography: "✍️", memoir: "📝", adventure: "🗺️", comedy: "😄",
  "young-adult": "🌟", travel: "✈️", politics: "🏛️", history: "📖",
  law: "⚖️", palestine: "🇵🇸", arabic: "📿", fanfiction: "✨"
};

function seededRandom(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 49311;
  return x - Math.floor(x);
}

function getBookColor(id) {
  const idx = Math.abs(parseInt(id)) % SPINE_COLORS.length;
  return SPINE_COLORS[idx];
}

function getLuminance(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const toLinear = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getBookWidth(pages) {
  if (!pages) return 32;
  if (pages < 150) return 22;
  if (pages < 300) return 30;
  if (pages < 500) return 38;
  if (pages < 700) return 44;
  return 52;
}

function getBookHeight(id, pages) {
  const r = seededRandom(parseInt(id));
  if (!pages || pages < 150) return 138 + r * 10;  // 138–148px
  if (pages < 300)           return 154 + r * 14;  // 154–168px
  if (pages < 500)           return 171 + r * 14;  // 171–185px
  if (pages < 700)           return 187 + r * 13;  // 187–200px
  return                            200 + r * 15;  // 200–215px
}

function hexToHue(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  let h;
  if (max === r) h = ((g - b) / (max - min) + 6) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  return h * 60;
}

function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("/");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m)-1]} ${parseInt(day)}, ${y}`;
}

function StarRating({ rating, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#D4A843" : "#5a4a3a", fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

function BookSpine({ book, onClick, index, coverColor = null, isPulled = false }) {
  const [tipPos, setTipPos] = useState(null);
  const color = coverColor || getBookColor(book.id);
  const width = getBookWidth(book.p);
  const seriesHash = book.sn ? book.sn.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : null;
  const height = seriesHash !== null
    ? Math.round(155 + seededRandom(seriesHash) * 45)  // 155–200px, same for whole series
    : getBookHeight(book.id, book.p);
  const r = seededRandom(parseInt(book.id) + 7);
  const darkFactor = 0.7 + r * 0.3;
  useEffect(() => { if (isPulled) setTipPos(null); }, [isPulled]);
  
  // Create a slightly darker shade for the edge
  const darken = (hex, f) => {
    const num = parseInt(hex.slice(1), 16);
    const R = Math.floor(((num >> 16) & 255) * f);
    const G = Math.floor(((num >> 8) & 255) * f);
    const B = Math.floor((num & 255) * f);
    return `rgb(${R},${G},${B})`;
  };

  const textColor = getLuminance(color) > 0.3 ? "#2C1810" : "#F5ECD7";
  const patternType = Math.floor(seededRandom(parseInt(book.id) + 3) * 5);

  let decoration = null;
  if (patternType === 0) {
    // Horizontal lines
    decoration = (
      <>
        <div style={{ position: "absolute", top: 18, left: 3, right: 3, height: 1, background: textColor, opacity: 0.4 }} />
        <div style={{ position: "absolute", bottom: 18, left: 3, right: 3, height: 1, background: textColor, opacity: 0.4 }} />
      </>
    );
  } else if (patternType === 1) {
    // Small diamond
    decoration = (
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 6, height: 6, border: `1px solid ${textColor}`, opacity: 0.5 }} />
    );
  } else if (patternType === 2) {
    // Double line top
    decoration = (
      <>
        <div style={{ position: "absolute", top: 14, left: 4, right: 4, height: 1, background: textColor, opacity: 0.3 }} />
        <div style={{ position: "absolute", top: 17, left: 4, right: 4, height: 1, background: textColor, opacity: 0.3 }} />
      </>
    );
  }

  const isCurrentlyReading = book.s === 'currently-reading';

  return (
    <>
    <div style={{ position: "relative", alignSelf: "flex-end", flexShrink: 0 }}>
      {isCurrentlyReading && !isPulled && (
        <div aria-hidden="true" style={{
          position: "absolute",
          top: -13, left: "50%", transform: "translateX(-50%)",
          width: 7, height: 22,
          background: "linear-gradient(to bottom, #E8B84B, #C07A1A)",
          zIndex: 2,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 87%, 0 100%)",
          filter: "drop-shadow(0 -1px 3px rgba(212,168,67,0.6))",
        }} />
      )}
    <div
      onClick={() => onClick(book)}
      style={{
        width, height, minWidth: width,
        background: `linear-gradient(90deg, ${darken(color, darkFactor * 0.85)} 0%, ${color} 15%, ${darken(color, 1.05)} 50%, ${color} 85%, ${darken(color, darkFactor * 0.7)} 100%)`,
        borderRadius: "2px 4px 4px 2px",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 3px",
        boxSizing: "border-box",
        transition: isPulled
          ? "opacity 0.18s ease"
          : "transform 0.2s ease, box-shadow 0.2s ease",
        opacity: isPulled ? 0 : undefined,
        boxShadow: isPulled
          ? "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 12px 24px rgba(0,0,0,0.5)"
          : isCurrentlyReading
          ? "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2), 0 0 0 1.5px rgba(212,168,67,0.7)"
          : "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2)",
        overflow: "hidden",
        animation: isPulled ? "none" : `slideUp 0.15s ease ${index * 0.005}s both`,
      }}
      onMouseEnter={e => {
        if (isPulled) return;
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 4px 12px rgba(0,0,0,0.4)";
        setTipPos({ x: e.clientX, y: e.clientY });
      }}
      onMouseMove={e => { if (!isPulled) setTipPos({ x: e.clientX, y: e.clientY }); }}
      onMouseLeave={e => {
        if (isPulled) return;
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2)";
        setTipPos(null);
      }}
    >
      {decoration}
      {book.au && (
        <div style={{ position: "absolute", top: 4, right: 3, fontSize: 8, opacity: 0.7 }}>🎧</div>
      )}
      {book.fav && (
        <div style={{ position: "absolute", top: 4, left: 3, fontSize: 8 }}>❤️</div>
      )}
      <div style={{
        writingMode: "vertical-rl", textOrientation: "mixed",
        color: textColor, fontFamily: "'Libre Baskerville', 'Georgia', serif",
        fontSize: width < 28 ? 11 : 14, fontWeight: 600,
        letterSpacing: "0.5px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        maxHeight: height - 40,
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        lineHeight: 1.2,
      }}>
        {book.t}
      </div>
    </div>
    </div>
    {tipPos && (
      <div style={{
        position: "fixed",
        left: tipPos.x,
        top: tipPos.y - 14,
        transform: "translate(-50%, -100%)",
        zIndex: 500,
        background: "linear-gradient(135deg, #2C1D12, #1A120B)",
        border: "1px solid #4A3728",
        borderRadius: 8,
        padding: "10px 14px",
        maxWidth: 260,
        pointerEvents: "none",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: "#F5ECD7", fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{book.t}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#BFA88A", fontSize: 13 }}>{book.a}</div>
        {book.r > 0 && <div style={{ color: "#D4A843", fontSize: 12, marginTop: 4, letterSpacing: 1 }}>{"★".repeat(book.r)}</div>}
        {book.sn && <div style={{ color: "#8B7355", fontSize: 11, marginTop: 3, fontStyle: "italic" }}>{book.sn}</div>}
      </div>
    )}
    </>
  );
}

const BOOK_QUOTES = [
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", book: "A Dance with Dragons", by: "George R.R. Martin" },
  { text: "So we beat on, boats against the current, borne back ceaselessly into the past.", book: "The Great Gatsby", by: "F. Scott Fitzgerald" },
  { text: "Whatever our souls are made of, his and mine are the same.", book: "Wuthering Heights", by: "Emily Brontë" },
  { text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.", book: "Jane Eyre", by: "Charlotte Brontë" },
  { text: "It is only with the heart that one can see rightly; what is essential is invisible to the eye.", book: "The Little Prince", by: "Antoine de Saint-Exupéry" },
  { text: "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration.", book: "Dune", by: "Frank Herbert" },
  { text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", book: "Pride and Prejudice", by: "Jane Austen" },
  { text: "Who controls the past controls the future. Who controls the present controls the past.", book: "1984", by: "George Orwell" },
  { text: "For you, a thousand times over.", book: "The Kite Runner", by: "Khaled Hosseini" },
  { text: "And now that you don't have to be perfect, you can be good.", book: "East of Eden", by: "John Steinbeck" },
  { text: "What I need is the dandelion in the spring. The bright yellow that means rebirth instead of destruction.", book: "Mockingjay", by: "Suzanne Collins" },
  { text: "The finest of pleasures are always the unexpected ones.", book: "The Night Circus", by: "Erin Morgenstern" },
  { text: "Humbling women seems to me a chief pastime of poets.", book: "Circe", by: "Madeline Miller" },
  { text: "You never really understand a person until you consider things from his point of view.", book: "To Kill a Mockingbird", by: "Harper Lee" },
  { text: "All animals are equal, but some animals are more equal than others.", book: "Animal Farm", by: "George Orwell" },
  { text: "The books that the world calls immoral are books that show the world its own shame.", book: "The Picture of Dorian Gray", by: "Oscar Wilde" },
  { text: "It is not the lives we regret not living that are the heaviest, but the regrets themselves.", book: "The Midnight Library", by: "Matt Haig" },
  { text: "Name one hero who was happy.", book: "The Song of Achilles", by: "Madeline Miller" },
  { text: "There are three things all wise men fear: the sea in storm, a night with no moon, and the anger of a gentle man.", book: "The Name of the Wind", by: "Patrick Rothfuss" },
  { text: "There's always another secret.", book: "Mistborn: The Final Empire", by: "Brandon Sanderson" },
  { text: "Life before death. Strength before weakness. Journey before destination.", book: "The Way of Kings", by: "Brandon Sanderson" },
  { text: "The most important words a man can say are, 'I will do better.'", book: "Oathbringer", by: "Brandon Sanderson" },
  { text: "Ralph wept for the end of innocence, the darkness of man's heart.", book: "Lord of the Flies", by: "William Golding" },
  { text: "In the moment when I truly understand my enemy, understand him well enough to defeat him, then in that very moment I also love him.", book: "Ender's Game", by: "Orson Scott Card" },
  { text: "If people were rain, I was drizzle and she was a hurricane.", book: "Looking for Alaska", by: "John Green" },
  { text: "God does not play dice with the universe; He plays an ineffable game of His own devising.", book: "Good Omens", by: "Terry Pratchett & Neil Gaiman" },
  { text: "I am afraid. Not of life, or death, or nothingness, but of wasting it as if I had never been.", book: "Flowers for Algernon", by: "Daniel Keyes" },
  { text: "All human wisdom is summed up in two words — wait and hope.", book: "The Count of Monte Cristo", by: "Alexandre Dumas" },
  { text: "I think it pisses God off if you walk by the color purple in a field somewhere and don't notice it.", book: "The Color Purple", by: "Alice Walker" },
  { text: "A guy goes nuts if he ain't got nobody.", book: "Of Mice and Men", by: "John Steinbeck" },
  { text: "We tell people to follow their dreams, but you can only dream of what you can imagine.", book: "Born a Crime", by: "Trevor Noah" },
  { text: "You could call it forgiveness; it was really just the decision to pay attention to something else.", book: "Educated", by: "Tara Westover" },
  { text: "Time takes it all whether you want it to or not.", book: "It", by: "Stephen King" },
  { text: "What is the point of being alive if you don't at least try to do something remarkable?", book: "An Abundance of Katherines", by: "John Green" },
  { text: "The thing about a spiral is, if you follow it inward, it never actually ends.", book: "Turtles All the Way Down", by: "John Green" },
  { text: "There is only one sin, only one. And that is theft.", book: "The Kite Runner", by: "Khaled Hosseini" },
  { text: "It is very hard for evil to take hold of the unconsenting soul.", book: "A Wizard of Earthsea", by: "Ursula K. Le Guin" },
];

const HEADER_ICONS = {
  books: (
    <svg width="40" height="34" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="8" height="26" rx="1" fill="#8B2840" opacity="0.5"/>
      <rect x="2" y="4" width="2" height="26" fill="#6B1830" opacity="0.5"/>
      <rect x="11" y="8" width="9" height="22" rx="1" fill="#5C3A1E" opacity="0.65"/>
      <rect x="11" y="8" width="2.5" height="22" fill="#3A2010" opacity="0.65"/>
      <rect x="21" y="6" width="10" height="24" rx="1" fill="#8B2840"/>
      <rect x="21" y="6" width="3" height="24" fill="#6B1830"/>
      <line x1="1" y1="30" x2="33" y2="30" stroke="#5C0F1E" strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round"/>
    </svg>
  ),
  feather: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34 4 C20 6 10 16 6 34" stroke="#8B2840" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M34 4 C36 12 34 22 22 32 L6 34 C14 22 22 14 34 4 Z" fill="#8B2840" opacity="0.75"/>
      <path d="M34 4 C28 10 18 18 6 34 C12 26 18 18 28 10 L34 4 Z" fill="#6B1830" opacity="0.45"/>
      <path d="M6 34 C4 38 3 39 2 38 C3 37 4 35 6 34 Z" fill="#8B2840"/>
    </svg>
  ),
  moon: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 20 C30 27.7 23.7 34 16 34 C14.1 34 12.3 33.6 10.6 33 C16.4 31.1 20.5 25.5 20.5 19 C20.5 12.5 16.4 6.9 10.6 5 C12.3 4.4 14.1 4 16 4 C23.7 4 30 12.3 30 20 Z" fill="#8B2840"/>
      <circle cx="29" cy="10" r="1.5" fill="#8B2840" opacity="0.5"/>
      <circle cx="33" cy="16" r="1" fill="#8B2840" opacity="0.35"/>
      <circle cx="27" cy="6" r="1" fill="#8B2840" opacity="0.4"/>
    </svg>
  ),
  openbook: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10 L20 34" stroke="#8B2840" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 10 C15 8 8 8 4 10 L4 32 C8 30 15 30 20 32 Z" fill="#8B2840" opacity="0.55"/>
      <line x1="8" y1="15" x2="17" y2="13" stroke="#F5ECD7" strokeWidth="1" opacity="0.5"/>
      <line x1="7" y1="19" x2="17" y2="17" stroke="#F5ECD7" strokeWidth="1" opacity="0.4"/>
      <line x1="7" y1="23" x2="17" y2="21" stroke="#F5ECD7" strokeWidth="1" opacity="0.4"/>
      <path d="M20 10 C25 8 32 8 36 10 L36 32 C32 30 25 30 20 32 Z" fill="#8B2840" opacity="0.4"/>
      <line x1="23" y1="13" x2="33" y2="15" stroke="#F5ECD7" strokeWidth="1" opacity="0.4"/>
      <line x1="23" y1="17" x2="33" y2="19" stroke="#F5ECD7" strokeWidth="1" opacity="0.4"/>
      <line x1="23" y1="21" x2="33" y2="23" stroke="#F5ECD7" strokeWidth="1" opacity="0.4"/>
    </svg>
  ),
  compass: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" stroke="#8B2840" strokeWidth="1.2" opacity="0.45"/>
      <polygon points="20,5 17,20 23,20" fill="#8B2840"/>
      <polygon points="20,35 23,20 17,20" fill="#8B2840" opacity="0.35"/>
      <polygon points="35,20 20,17 20,23" fill="#8B2840" opacity="0.5"/>
      <polygon points="5,20 20,23 20,17" fill="#8B2840" opacity="0.35"/>
      <circle cx="20" cy="20" r="2.5" fill="#8B2840"/>
    </svg>
  ),
};

function RotatingQuote({ books }) {
  const readTitles = new Set((books || []).filter(b => b.s === 'read').map(b => b.t));
  const pool = readTitles.size > 0
    ? BOOK_QUOTES.filter(q => readTitles.has(q.book))
    : BOOK_QUOTES;
  const activePool = pool.length > 0 ? pool : BOOK_QUOTES;

  const [idx, setIdx] = useState(() => Math.floor(Math.random() * activePool.length));
  const [visible, setVisible] = useState(true);

  const navigate = useCallback((dir) => {
    setVisible(false);
    setTimeout(() => {
      setIdx(i => (i + dir + activePool.length) % activePool.length);
      setVisible(true);
    }, 500);
  }, [activePool.length]);

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 20000);
    return () => clearInterval(timer);
  }, [navigate]);

  const quote = activePool[idx % activePool.length];

  const arrowStyle = {
    background: "none", border: "none", cursor: "pointer",
    color: "#8B3040", opacity: 0.55, fontSize: 22, padding: "0 10px",
    lineHeight: 1, transition: "opacity 0.15s", flexShrink: 0,
  };

  return (
    <div style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button
        style={arrowStyle}
        onClick={() => navigate(-1)}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.55}
        aria-label="Previous quote"
      >‹</button>
      <div style={{ transition: "opacity 0.5s ease-in-out", opacity: visible ? 1 : 0, textAlign: "center", maxWidth: 520, minHeight: 85 }}>
        <div style={{
          background: "rgba(255,248,244,0.28)",
          borderRadius: 14,
          padding: "10px 18px",
          display: "inline-block",
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#6B2030", fontSize: 17, margin: 0, fontStyle: "italic",
            lineHeight: 1.5,
          }}>
            &ldquo;{quote.text}&rdquo;
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            color: "#8B3040", fontSize: 11, margin: "5px 0 0",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            &mdash; {quote.book} &middot; {quote.by}
          </p>
        </div>
      </div>
      <button
        style={arrowStyle}
        onClick={() => navigate(1)}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.55}
        aria-label="Next quote"
      >›</button>
    </div>
  );
}

function BookModal({ book, onClose, spineColor, onEdit, onDelete, onColorChange, allGenres = [] }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'delete'
  const [editState, setEditState] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [newGenreInput, setNewGenreInput] = useState('');
  const [showNewGenreInput, setShowNewGenreInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [grFetching, setGrFetching] = useState(false);
  const lastFetchedUrl = useRef('');
  const colorInputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!book) return null;

  const coverSources = [
    book.cover || null,
    book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null,
    book.isbn ? `https://books.google.com/books/content?vid=ISBN:${book.isbn}&printsec=frontcover&img=1&zoom=1` : null,
  ].filter(Boolean);
  const coverSrc = srcIndex < coverSources.length ? coverSources[srcIndex] : null;
  const genres = book.g || [];
  // Effective Goodreads link: manual override > auto-generated > none
  const bookLink = book.grUrl || (!book.manual ? `https://www.goodreads.com/book/show/${book.id}` : null);

  const enterEdit = () => {
    setNewGenreInput('');
    setShowNewGenreInput(false);
    setEditState({
      t: book.t || '',
      a: book.a || '',
      r: String(book.r || 0),
      s: book.s || 'read',
      p: String(book.p || ''),
      dr: book.dr ? book.dr.replace(/\//g, '-') : '',
      au: book.au || false,
      ki: book.ki || false,
      g: [...(book.g || [])],
      sn: book.sn || '',
      si: book.si ? String(book.si) : '',
      rev: book.rev || '',
      fav: book.fav || false,
      reread: book.reread || false,
      grUrl: book.grUrl || (!book.manual ? `https://www.goodreads.com/book/show/${book.id}` : ''),
      cover: book.cover || '',
    });
    lastFetchedUrl.current = book.grUrl || (!book.manual ? `https://www.goodreads.com/book/show/${book.id}` : '');
    setMode('edit');
  };

  const saveEdit = async () => {
    if (saving) return;
    setSaving(true);
    const trimmedUrl = editState.grUrl.trim();
    const changes = {
      t: editState.t.trim() || book.t,
      a: editState.a.trim() || book.a,
      r: Math.min(5, Math.max(0, parseInt(editState.r) || 0)),
      s: editState.s,
      p: parseInt(editState.p) || 0,
      dr: editState.dr ? editState.dr.replace(/-/g, '/') : '',
      au: editState.au,
      ki: editState.ki && !editState.au,
      g: editState.g,
      sn: editState.sn.trim(),
      si: parseFloat(editState.si) || 0,
      rev: editState.rev.trim(),
      fav: editState.fav,
      reread: editState.reread,
      grUrl: trimmedUrl,
      ...(trimmedUrl && book.manual ? { manual: false } : {}),
    };
    // Apply cover: use the one already fetched via onBlur, otherwise fall back to fetching now
    if (editState.cover) {
      changes.cover = editState.cover;
    } else if (trimmedUrl && !book.cover) {
      try {
        const res = await fetch(`/api/goodreads-cover?url=${encodeURIComponent(trimmedUrl)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.cover) changes.cover = data.cover;
        }
      } catch {}
    }
    onEdit(book.id, changes);
    setSaving(false);
    onClose();
  };

  const pickColor = () => {
    if ('EyeDropper' in window) {
      const dropper = new window.EyeDropper();
      dropper.open().then(result => onColorChange(book.id, result.sRGBHex)).catch(() => {});
    } else {
      colorInputRef.current?.click();
    }
  };

  const modalInputStyle = {
    width: "100%", padding: "8px 12px", borderRadius: 7,
    border: "1px solid #4A3728", background: "#2A1C10",
    color: "#E8D5B7", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    outline: "none", boxSizing: "border-box",
  };
  const modalLabelStyle = {
    color: "#8B7355", fontSize: 10, fontFamily: "'DM Sans', sans-serif",
    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4, display: "block",
  };
  const actionBtnStyle = (variant) => ({
    padding: "7px 16px", borderRadius: 7, fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 500,
    ...(variant === 'edit' ? {
      background: "transparent", border: "1px solid rgba(212,168,67,0.4)", color: "#D4A843",
    } : variant === 'delete' ? {
      background: "transparent", border: "1px solid rgba(139,40,64,0.4)", color: "#C0768A",
    } : variant === 'save' ? {
      background: "#8B2840", border: "none", color: "#FDF0F3",
    } : {
      background: "transparent", border: "1px solid #4A3728", color: "#8B7355",
    }),
  });

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(15,10,5,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #2C1D12 0%, #1A120B 100%)",
          border: "1px solid #4A3728",
          borderRadius: 12, padding: 0, maxWidth: 720, width: "100%",
          maxHeight: "85vh", overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.1)",
          animation: "scaleIn 0.18s ease",
        }}
      >
        {/* Header with color bar */}
        <div style={{
          height: 6, borderRadius: "12px 12px 0 0",
          background: `linear-gradient(90deg, ${spineColor || getBookColor(book.id)}, ${(spineColor || getBookColor(book.id))}88)`,
        }} />

        {/* ── EDIT MODE ── */}
        {mode === 'edit' && editState && (
          <div style={{ padding: "24px 28px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#F5ECD7", fontSize: 20, fontWeight: 700, margin: 0 }}>
                Edit Book
              </h2>
              <button onClick={() => setMode('view')} style={{ background: "none", border: "none", color: "#8B7355", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={modalLabelStyle}>Title</label>
                <input style={modalInputStyle} value={editState.t} onChange={e => setEditState(s => ({ ...s, t: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={modalLabelStyle}>Author</label>
                <input style={modalInputStyle} value={editState.a} onChange={e => setEditState(s => ({ ...s, a: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={modalLabelStyle}>
                  Goodreads URL{grFetching && <span style={{ marginLeft: 8, color: "#D4A843", fontSize: 10, fontStyle: "italic" }}>Fetching…</span>}
                </label>
                <input
                  style={modalInputStyle}
                  value={editState.grUrl}
                  onChange={e => setEditState(s => ({ ...s, grUrl: e.target.value }))}
                  onBlur={async e => {
                    const url = e.target.value.trim();
                    if (!url || url === lastFetchedUrl.current) return;
                    lastFetchedUrl.current = url;
                    setGrFetching(true);
                    try {
                      const res = await fetch(`/api/goodreads-book?url=${encodeURIComponent(url)}`);
                      if (res.ok) {
                        const meta = await res.json();
                        // Overwrite GR-sourced metadata fields; leave personal annotations untouched
                        setEditState(s => ({
                          ...s,
                          ...(meta.title  ? { t: meta.title }         : {}),
                          ...(meta.author ? { a: meta.author }        : {}),
                          ...(meta.pages  ? { p: String(meta.pages) } : {}),
                          ...(meta.cover  ? { cover: meta.cover }     : {}),
                        }));
                      }
                    } catch {}
                    setGrFetching(false);
                  }}
                  placeholder="https://www.goodreads.com/book/show/..."
                />
              </div>
              <div>
                <label style={modalLabelStyle}>My Rating (0–5)</label>
                <input style={modalInputStyle} type="number" min="0" max="5" value={editState.r} onChange={e => setEditState(s => ({ ...s, r: e.target.value }))} />
              </div>
              <div>
                <label style={modalLabelStyle}>Shelf</label>
                <select style={{ ...modalInputStyle, paddingRight: 28 }} value={editState.s} onChange={e => setEditState(s => ({ ...s, s: e.target.value }))}>
                  <option value="read">Read</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="to-read">To Read</option>
                  <option value="dnf">DNF</option>
                </select>
              </div>
              <div>
                <label style={modalLabelStyle}>Pages</label>
                <input style={modalInputStyle} type="number" min="0" value={editState.p} onChange={e => setEditState(s => ({ ...s, p: e.target.value }))} />
              </div>
              <div>
                <label style={modalLabelStyle}>Date Read</label>
                <input style={modalInputStyle} type="date" value={editState.dr} onChange={e => setEditState(s => ({ ...s, dr: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={modalLabelStyle}>Genres</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {[...new Set([...allGenres, ...editState.g])].sort().map(g => {
                    const selected = editState.g.includes(g);
                    return (
                      <button key={g} type="button"
                        onClick={() => setEditState(s => ({ ...s, g: selected ? s.g.filter(x => x !== g) : [...s.g, g] }))}
                        style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", border: `1px solid ${selected ? "rgba(212,168,67,0.5)" : "rgba(74,55,40,0.4)"}`, background: selected ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.04)", color: selected ? "#D4A843" : "#8B7355", transition: "all 0.12s" }}>
                        {g}
                      </button>
                    );
                  })}
                </div>
                {showNewGenreInput ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      style={{ ...modalInputStyle, flex: 1 }}
                      value={newGenreInput}
                      onChange={e => setNewGenreInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newGenreInput.trim()) { setEditState(s => ({ ...s, g: [...s.g, newGenreInput.trim()] })); setNewGenreInput(''); setShowNewGenreInput(false); }
                        if (e.key === 'Escape') setShowNewGenreInput(false);
                      }}
                      placeholder="New genre name"
                      autoFocus
                    />
                    <button type="button" onClick={() => { if (newGenreInput.trim()) { setEditState(s => ({ ...s, g: [...s.g, newGenreInput.trim()] })); setNewGenreInput(''); setShowNewGenreInput(false); } }} style={{ padding: "8px 14px", borderRadius: 7, background: "#4A3728", border: "none", color: "#E8D5B7", cursor: "pointer", fontSize: 13 }}>Add</button>
                    <button type="button" onClick={() => setShowNewGenreInput(false)} style={{ padding: "8px 12px", borderRadius: 7, background: "transparent", border: "1px solid #4A3728", color: "#8B7355", cursor: "pointer", fontSize: 13 }}>✕</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowNewGenreInput(true)} style={{ fontSize: 12, background: "transparent", border: "1px dashed rgba(74,55,40,0.5)", borderRadius: 20, padding: "3px 12px", color: "#6B5040", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ Add genre</button>
                )}
              </div>
              <div>
                <label style={modalLabelStyle}>Series Name</label>
                <input style={modalInputStyle} value={editState.sn} onChange={e => setEditState(s => ({ ...s, sn: e.target.value }))} placeholder="Leave blank if standalone" />
              </div>
              <div>
                <label style={modalLabelStyle}>Series #</label>
                <input style={modalInputStyle} type="number" min="0" step="0.5" value={editState.si} onChange={e => setEditState(s => ({ ...s, si: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={modalLabelStyle}>Notes / Review</label>
                <textarea
                  style={{ ...modalInputStyle, minHeight: 72, resize: "vertical" }}
                  value={editState.rev}
                  onChange={e => setEditState(s => ({ ...s, rev: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#BFA88A", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <input type="checkbox" checked={editState.au} onChange={e => setEditState(s => ({ ...s, au: e.target.checked, ki: e.target.checked ? false : s.ki }))} />
                  Audiobook
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#BFA88A", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <input type="checkbox" checked={editState.ki && !editState.au} disabled={editState.au} onChange={e => setEditState(s => ({ ...s, ki: e.target.checked }))} />
                  Kindle
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#BFA88A", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <input type="checkbox" checked={editState.fav} onChange={e => setEditState(s => ({ ...s, fav: e.target.checked }))} />
                  Favourite
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#BFA88A", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <input type="checkbox" checked={editState.reread} onChange={e => setEditState(s => ({ ...s, reread: e.target.checked }))} />
                  Mark to reread
                </label>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={actionBtnStyle('cancel')} onClick={() => setMode('view')}>Cancel</button>
              <button style={{ ...actionBtnStyle('save'), opacity: saving ? 0.6 : 1 }} onClick={saveEdit} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM MODE ── */}
        {mode === 'delete' && (
          <div style={{ padding: "32px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", color: "#F5ECD7", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
              Remove this book?
            </div>
            <div style={{ color: "#BFA88A", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
              "{book.t}" will be removed from your shelf. This won't affect Goodreads.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button style={actionBtnStyle('cancel')} onClick={() => setMode('view')}>Cancel</button>
              <button
                style={{ ...actionBtnStyle('delete'), background: "#8B2840", border: "none", color: "#FDF0F3" }}
                onClick={() => onDelete(book.id)}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* ── VIEW MODE ── */}
        {mode === 'view' && (
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Cover image — left column */}
          {coverSrc ? (
            <div style={{
              flexShrink: 0, width: 190, alignSelf: "stretch",
              background: "#0D0905",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 10, boxSizing: "border-box",
              borderRadius: "0 0 0 12px",
            }}>
              <img
                src={coverSrc}
                alt={`Cover of ${book.t || 'this book'}`}
                onError={() => setSrcIndex(i => i + 1)}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  display: "block",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                }}
              />
            </div>
          ) : (
            <div style={{
              flexShrink: 0, width: 160, alignSelf: "stretch",
              background: "linear-gradient(160deg, #211408 0%, #160D05 100%)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 14, padding: "28px 16px",
              borderRadius: "0 0 0 12px",
              borderRight: "1px solid #2E1C10",
            }}>
              <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="2" width="32" height="48" rx="3" fill="#2A1810" stroke="#4A2E1A" strokeWidth="1.5"/>
                <rect x="6" y="2" width="7" height="48" rx="2" fill="#1E100A" stroke="#3A2010" strokeWidth="1"/>
                <line x1="18" y1="16" x2="34" y2="16" stroke="#4A2E1A" strokeWidth="1.2"/>
                <line x1="18" y1="22" x2="34" y2="22" stroke="#4A2E1A" strokeWidth="1.2"/>
                <line x1="18" y1="28" x2="30" y2="28" stroke="#4A2E1A" strokeWidth="1.2"/>
                <circle cx="26" cy="38" r="5" stroke="#5A3A22" strokeWidth="1.2" fill="none"/>
                <line x1="29.5" y1="41.5" x2="33" y2="45" stroke="#5A3A22" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div style={{
                color: "#5A4030",
                fontSize: 10,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 1.8,
                lineHeight: 1.7,
              }}>
                Cover<br/>not available
              </div>
            </div>
          )}
          <div style={{ padding: "28px 32px", flex: 1, minWidth: 0, position: "relative" }}>
          {/* ── Icon toggles: heart (fav) + reread ── */}
          <div style={{ position: "absolute", top: 14, right: 14, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {/* Favourite heart */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => onEdit(book.id, { fav: !book.fav })}
                onMouseEnter={() => setHoveredIcon('fav')}
                onMouseLeave={() => setHoveredIcon(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", lineHeight: 1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={book.fav ? "#E53E3E" : "none"} stroke={book.fav ? "#E53E3E" : "#6B5040"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              {hoveredIcon === 'fav' && (
                <div style={{ position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8, background: "#2C1D12", border: "1px solid #4A3728", borderRadius: 6, padding: "4px 10px", whiteSpace: "nowrap", color: "#E8D5B7", fontSize: 11, fontFamily: "'DM Sans', sans-serif", pointerEvents: "none", zIndex: 10 }}>
                  {book.fav ? "Remove favourite" : "Mark favourite"}
                </div>
              )}
            </div>
            {/* Reread icon */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => onEdit(book.id, { reread: !book.reread })}
                onMouseEnter={() => setHoveredIcon('reread')}
                onMouseLeave={() => setHoveredIcon(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", lineHeight: 1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={book.reread ? "#4A7FD4" : "#6B5040"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
                </svg>
              </button>
              {hoveredIcon === 'reread' && (
                <div style={{ position: "absolute", right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8, background: "#2C1D12", border: "1px solid #4A3728", borderRadius: 6, padding: "4px 10px", whiteSpace: "nowrap", color: "#E8D5B7", fontSize: 11, fontFamily: "'DM Sans', sans-serif", pointerEvents: "none", zIndex: 10 }}>
                  {book.reread ? "Remove reread" : "Mark to reread"}
                </div>
              )}
            </div>
          </div>
          {/* Title & Author */}
          <h2 style={{
            fontFamily: "'Playfair Display', 'Libre Baskerville', Georgia, serif",
            color: "#F5ECD7", fontSize: 26, fontWeight: 700, margin: 0,
            lineHeight: 1.3, letterSpacing: "-0.3px", paddingRight: 52,
          }}>
            {bookLink ? (
              <a
                href={bookLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "inherit", textDecoration: "none",
                  borderBottom: "1px solid rgba(245,236,215,0.25)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = "rgba(245,236,215,0.7)"}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = "rgba(245,236,215,0.25)"}
              >
                {book.t}
              </a>
            ) : book.t}
          </h2>

          {book.sn && (
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#D4A843", fontSize: 14, margin: "4px 0 0", fontStyle: "italic",
            }}>
              {book.sn} #{book.si % 1 === 0 ? Math.floor(book.si) : book.si}
            </p>
          )}

          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#BFA88A", fontSize: 18, margin: "8px 0 0",
          }}>
            by {book.a}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg, #4A3728, transparent)", margin: "20px 0" }} />

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {book.r > 0 && (
              <div>
                <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>My Rating</div>
                <StarRating rating={book.r} size={20} />
              </div>
            )}
            <div>
              <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Avg Rating</div>
              <span style={{ color: "#BFA88A", fontFamily: "'Libre Baskerville', serif", fontSize: 16 }}>{book.ar} ★</span>
            </div>
            {book.dr && (
              <div>
                <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Date Read</div>
                <span style={{ color: "#E8D5B7", fontFamily: "'Libre Baskerville', serif", fontSize: 14 }}>{formatDate(book.dr)}</span>
              </div>
            )}
            {book.p > 0 && (
              <div>
                <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Pages</div>
                <span style={{ color: "#E8D5B7", fontFamily: "'Libre Baskerville', serif", fontSize: 14 }}>{book.p.toLocaleString()}</span>
              </div>
            )}
            {book.y && (
              <div>
                <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Published</div>
                <span style={{ color: "#E8D5B7", fontFamily: "'Libre Baskerville', serif", fontSize: 14 }}>{book.y}</span>
              </div>
            )}
            <div>
              <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Format</div>
              <span style={{ color: "#E8D5B7", fontFamily: "'Libre Baskerville', serif", fontSize: 14 }}>
                {book.au ? "Audiobook" : book.ki ? "Kindle" : "Hard Copy"}
              </span>
            </div>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {genres.map(g => (
                  <span key={g} style={{
                    background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.25)",
                    borderRadius: 20, padding: "4px 12px",
                    color: "#D4A843", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {GENRE_ICONS[g] || "📚"} {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Review */}
          {book.rev && (
            <div style={{ marginTop: 20 }}>
              <div style={{ color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>My Review</div>
              <p style={{ color: "#BFA88A", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                "{book.rev}"
              </p>
            </div>
          )}

          {/* Edit / Delete / Colour actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(74,55,40,0.5)", alignItems: "center", flexWrap: "wrap" }}>
            <button style={actionBtnStyle('edit')} onClick={enterEdit}>Edit</button>
            <button style={actionBtnStyle('delete')} onClick={() => setMode('delete')}>Remove</button>
            <div style={{ flex: 1 }} />
            {/* Spine colour picker */}
            <button
              onClick={pickColor}
              title="Change spine colour"
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "6px 12px", borderRadius: 7, cursor: "pointer",
                background: "transparent", border: "1px solid rgba(74,55,40,0.4)",
                color: "#8B7355", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{
                width: 14, height: 14, borderRadius: "50%",
                background: spineColor || "#8B7355",
                display: "inline-block", border: "1px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
              }} />
              Spine colour
            </button>
            {/* Hidden colour input fallback for browsers without EyeDropper */}
            <input
              ref={colorInputRef}
              type="color"
              defaultValue={spineColor || "#8B7355"}
              onChange={e => onColorChange(book.id, e.target.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
            />
            <button style={actionBtnStyle('cancel')} onClick={onClose}>Close</button>
          </div>
          </div>{/* end info column */}
        </div>
        )}{/* end view mode */}
      </div>
    </div>
  );
}

function AddBookForm({ onAdd, onClose, books = [] }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [pages, setPages] = useState("");
  const [isAudiobook, setIsAudiobook] = useState(false);
  const [shelf, setShelf] = useState("read");
  const [genre, setGenre] = useState("");
  const [dateRead, setDateRead] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [grSearching, setGrSearching] = useState(false);
  const [grUrl, setGrUrl] = useState("");
  const [grError, setGrError] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Debounced duplicate check
  useEffect(() => {
    if (!title) { setDuplicateWarning(null); return; }
    const timer = setTimeout(() => {
      const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      const nt = norm(title);
      const match = books.find(b => {
        const bt = norm(b.t);
        if (!(bt === nt || bt.includes(nt) || nt.includes(bt))) return false;
        if (!author) return true;
        const na = norm(author);
        const ba = norm(b.a);
        return ba.split(' ').some(w => w.length > 2 && na.includes(w))
          || na.split(' ').some(w => w.length > 2 && ba.includes(w));
      });
      setDuplicateWarning(match || null);
    }, 400);
    return () => clearTimeout(timer);
  }, [title, author, books]);

  const fetchAndPopulate = async ({ url } = {}) => {
    setGrSearching(true);
    setGrError(false);
    try {
      let meta = null;
      if (url) {
        const res = await fetch(`/api/goodreads-book?url=${encodeURIComponent(url)}`);
        if (res.ok) meta = await res.json();
      } else {
        const params = new URLSearchParams({ title });
        if (author) params.set('author', author);
        const searchRes = await fetch(`/api/search-goodreads?${params}`);
        if (searchRes.ok) {
          const data = await searchRes.json();
          if (data.id) {
            const metaRes = await fetch(`/api/goodreads-book?id=${encodeURIComponent(data.id)}`);
            if (metaRes.ok) meta = await metaRes.json();
          }
        }
      }
      if (meta) {
        if (meta.title)  setTitle(meta.title);
        if (meta.author) setAuthor(meta.author);
        if (meta.pages)  setPages(String(meta.pages));
      } else {
        setGrError(true);
      }
    } catch {
      setGrError(true);
    } finally {
      setGrSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || submitting || grSearching) return;
    setSubmitting(true);
    let grId = null;
    try {
      const params = new URLSearchParams({ title });
      if (author) params.set('author', author);
      const res = await fetch(`/api/search-goodreads?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (data.id) grId = data.id;
      }
    } catch {}

    // Fetch full metadata from Goodreads if we found an ID
    let grMeta = null;
    if (grId) {
      try {
        const res = await fetch(`/api/goodreads-book?id=${encodeURIComponent(grId)}`);
        if (res.ok) grMeta = await res.json();
      } catch {}
    }

    const newBook = {
      id: grId || String(Date.now()),
      manual: !grId,
      t: title,
      a: author || grMeta?.author || '',
      r: rating, ar: 0,
      p: parseInt(pages) || grMeta?.pages || 0,
      y: grMeta?.year || '',
      dr: dateRead ? dateRead.replace(/-/g, '/') : '',
      da: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
      s: shelf, g: genre ? [genre] : [], sn: '', si: 0,
      au: isAudiobook, fav: false,
      isbn: grMeta?.isbn || '', pub: '', bind: isAudiobook ? 'Audiobook' : 'Paperback',
      rev: notes,
      cover: grMeta?.cover || '',
    };
    onAdd(newBook);
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #4A3728", background: "#1A120B",
    color: "#E8D5B7", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    color: "#8B7355", fontSize: 11, fontFamily: "'DM Sans', sans-serif",
    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, display: "block",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15,10,5,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20, animation: "fadeIn 0.25s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "linear-gradient(135deg, #2C1D12 0%, #1A120B 100%)",
        border: "1px solid #4A3728", borderRadius: 12, padding: 32,
        maxWidth: 480, width: "100%", maxHeight: "85vh", overflow: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        animation: "scaleIn 0.3s ease",
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F5ECD7", fontSize: 22, margin: "0 0 24px" }}>
          Add a Book
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title..." />
              <button
                type="button"
                onClick={() => fetchAndPopulate()}
                disabled={!title || grSearching}
                style={{
                  padding: "10px 14px", borderRadius: 8, border: "1px solid #4A3728",
                  background: "#2C1D12", color: title && !grSearching ? "#D4A843" : "#4A3728",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  cursor: title && !grSearching ? "pointer" : "not-allowed",
                  whiteSpace: "nowrap", transition: "color 0.15s",
                }}
              >
                {grSearching ? "…" : "🔍"}
              </button>
            </div>
            {grError && (
              <div style={{ marginTop: 6, color: "#C0735A", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                Couldn't find this book on Goodreads.
              </div>
            )}
            {duplicateWarning && (
              <div style={{ marginTop: 8, background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.35)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ color: "#D4A843", fontWeight: 600, fontSize: 12, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
                  Possible duplicate
                </div>
                <div style={{ color: "#BFA88A", fontSize: 12, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                  "{duplicateWarning.t}" by {duplicateWarning.a} is already in your library.
                </div>
                <button onClick={() => setDuplicateWarning(null)} style={{ marginTop: 6, fontSize: 11, color: "#8B7355", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  Dismiss and continue
                </button>
              </div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name (optional — Goodreads will fill it in)" />
          </div>
          <div>
            <label style={labelStyle}>Goodreads URL</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={grUrl}
                onChange={e => setGrUrl(e.target.value)}
                placeholder="https://www.goodreads.com/book/show/..."
              />
              <button
                type="button"
                onClick={() => fetchAndPopulate({ url: grUrl })}
                disabled={!grUrl || grSearching}
                style={{
                  padding: "10px 14px", borderRadius: 8, border: "1px solid #4A3728",
                  background: "#2C1D12", color: grUrl && !grSearching ? "#D4A843" : "#4A3728",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  cursor: grUrl && !grSearching ? "pointer" : "not-allowed",
                  whiteSpace: "nowrap", transition: "color 0.15s",
                }}
              >
                {grSearching ? "…" : "🔍"}
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Pages</label>
              <input style={inputStyle} type="number" value={pages} onChange={e => setPages(e.target.value)} placeholder="300" />
            </div>
            <div>
              <label style={labelStyle}>Shelf</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={shelf} onChange={e => setShelf(e.target.value)}>
                <option value="read">Read</option>
                <option value="currently-reading">Currently Reading</option>
                <option value="to-read">To Read</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Genre</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={genre} onChange={e => setGenre(e.target.value)}>
                <option value="">None</option>
                {Object.keys(GENRE_ICONS).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date Read</label>
              <input style={inputStyle} type="date" value={dateRead} onChange={e => setDateRead(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>My Rating</label>
            <div style={{ display: "flex", gap: 4 }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} onClick={() => setRating(rating === i ? 0 : i)}
                  style={{ cursor: "pointer", fontSize: 24, color: i <= rating ? "#D4A843" : "#4A3728", transition: "color 0.15s" }}>★</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => setIsAudiobook(!isAudiobook)} style={{
              width: 20, height: 20, borderRadius: 4, border: "1px solid #4A3728",
              background: isAudiobook ? "#D4A843" : "#1A120B", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#1A120B",
            }}>
              {isAudiobook && "✓"}
            </div>
            <span style={{ color: "#BFA88A", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>🎧 Audiobook</span>
          </div>
          <div>
            <label style={labelStyle}>Notes / Review</label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="My thoughts..." />
          </div>
          <button onClick={handleSubmit} style={{
            background: "#A0445A", border: "none",
            borderRadius: 8, padding: "12px 24px", color: "#F9EDE8",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
            cursor: (title && !submitting && !grSearching) ? "pointer" : "not-allowed",
            opacity: (title && !submitting && !grSearching) ? 1 : 0.5, transition: "opacity 0.2s",
          }}>
            {submitting ? "Searching Goodreads…" : "Add to Bookshelf"}
          </button>
        </div>
      </div>
    </div>
  );
}


function getSeasonalProp(shelfIndex, vOverride) {
  const month = new Date().getMonth() + 1; // 1–12
  const v = vOverride !== undefined ? vOverride % 4 : shelfIndex % 4;

  // Spring: March–May
  if (month >= 3 && month <= 5) {
    // Top shelf gets custom plant art in spring
    if (shelfIndex === 0 && vOverride === undefined) {
      return <img src={plant2Img} alt="" style={{ height: 110, width: "auto", display: "block" }} />;
    }
    const plants = [
      // 0: Cactus — 1.5× (66×77, viewBox trimmed to pot bottom)
      <svg width="66" height="77" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36 L14 50 L30 50 L32 36 Z" fill="#C4703A"/>
        <rect x="10" y="32" width="24" height="5" rx="2" fill="#A8582A"/>
        <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
        <rect x="18" y="14" width="8" height="22" rx="4" fill="#5A8A3A"/>
        <path d="M18 26 Q10 24 10 17 Q10 13 14 13 L18 13" stroke="#5A8A3A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M26 22 Q34 20 34 14 Q34 10 30 10 L26 10" stroke="#5A8A3A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <line x1="19" y1="18" x2="16" y2="16" stroke="#8BC870" strokeWidth="1"/>
        <line x1="23" y1="24" x2="26" y2="22" stroke="#8BC870" strokeWidth="1"/>
        <line x1="20" y1="30" x2="17" y2="29" stroke="#8BC870" strokeWidth="1"/>
      </svg>,
      // 1: Leafy plant — 2× (88×102, viewBox trimmed to pot bottom)
      <svg width="88" height="102" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36 L14 50 L30 50 L32 36 Z" fill="#C4703A"/>
        <rect x="10" y="32" width="24" height="5" rx="2" fill="#A8582A"/>
        <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
        <path d="M22 33 Q21 25 22 18" stroke="#6A8830" strokeWidth="2" fill="none"/>
        <ellipse cx="15" cy="22" rx="8" ry="4" fill="#6BAA35" transform="rotate(-25 15 22)"/>
        <ellipse cx="29" cy="20" rx="8" ry="4" fill="#5A9A28" transform="rotate(25 29 20)"/>
        <ellipse cx="16" cy="14" rx="7" ry="3.5" fill="#7ABF40" transform="rotate(-35 16 14)"/>
        <ellipse cx="28" cy="12" rx="7" ry="3.5" fill="#6BAA35" transform="rotate(30 28 12)"/>
        <ellipse cx="22" cy="10" rx="5" ry="3" fill="#5A9A28"/>
      </svg>,
      // 2: Flower — 1.75× (77×89, viewBox trimmed to pot bottom)
      <svg width="77" height="89" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36 L14 50 L30 50 L32 36 Z" fill="#C4703A"/>
        <rect x="10" y="32" width="24" height="5" rx="2" fill="#A8582A"/>
        <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
        <path d="M22 33 L22 22" stroke="#6A8830" strokeWidth="2"/>
        <ellipse cx="16" cy="27" rx="6" ry="3" fill="#5A9A28" transform="rotate(-30 16 27)"/>
        <ellipse cx="28" cy="25" rx="6" ry="3" fill="#6BAA35" transform="rotate(30 28 25)"/>
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <ellipse key={deg} cx="22" cy="14" rx="2.5" ry="6" fill="#F4A83A" transform={`rotate(${deg} 22 20)`}/>
        ))}
        <circle cx="22" cy="20" r="4.5" fill="#E07820"/>
      </svg>,
      // 3: Succulent — 1.5× (66×77, viewBox trimmed to pot bottom)
      <svg width="66" height="77" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36 L14 50 L30 50 L32 36 Z" fill="#7A9BAA"/>
        <rect x="10" y="32" width="24" height="5" rx="2" fill="#6A8898"/>
        <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
        <ellipse cx="22" cy="30" rx="10" ry="5" fill="#7ABC8A"/>
        <ellipse cx="14" cy="25" rx="6" ry="9" fill="#6AAA78" transform="rotate(-20 14 25)"/>
        <ellipse cx="30" cy="25" rx="6" ry="9" fill="#5A9A68" transform="rotate(20 30 25)"/>
        <ellipse cx="18" cy="18" rx="5" ry="8" fill="#7ABC8A" transform="rotate(-10 18 18)"/>
        <ellipse cx="26" cy="18" rx="5" ry="8" fill="#6AAA78" transform="rotate(10 26 18)"/>
        <ellipse cx="22" cy="14" rx="6" ry="8" fill="#8ACA98"/>
        <circle cx="22" cy="13" r="3" fill="#B0E8BC"/>
      </svg>,
    ];
    return plants[v];
  }

  // Summer: June–August
  if (month >= 6 && month <= 8) {
    const items = [
      // 0: Seashell — 1.75× (77×72, viewBox trimmed to bottom at y=41)
      <svg width="77" height="72" viewBox="0 0 44 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="30" rx="14" ry="10" fill="#E8C890"/>
        <ellipse cx="22" cy="30" rx="14" ry="10" stroke="#C4A060" strokeWidth="1"/>
        <path d="M22 20 Q28 24 30 30" stroke="#C4A060" strokeWidth="1" fill="none"/>
        <path d="M22 20 Q16 24 14 30" stroke="#C4A060" strokeWidth="1" fill="none"/>
        <path d="M22 20 Q23 26 22 30" stroke="#C4A060" strokeWidth="0.8" fill="none"/>
        <ellipse cx="22" cy="19" rx="3" ry="2" fill="#D4B070"/>
      </svg>,
      // 1: Candle — 1.5× (66×77, viewBox trimmed to candle bottom at y=50+1)
      <svg width="66" height="77" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="28" width="12" height="22" rx="2" fill="#F5ECD7" stroke="#E0D0B0" strokeWidth="0.5"/>
        {[34, 38, 42].map(y => (
          <path key={y} d={`M18 ${y} Q22 ${y - 2} 26 ${y}`} stroke="#D4B878" strokeWidth="1" fill="none" opacity="0.4"/>
        ))}
        <line x1="22" y1="28" x2="22" y2="23" stroke="#5A4020" strokeWidth="1.5"/>
        <ellipse cx="22" cy="21" rx="3" ry="4" fill="#F4A020" opacity="0.9"/>
        <ellipse cx="22" cy="20" rx="1.5" ry="2" fill="#FFDD80"/>
      </svg>,
      // 2: Sunflower — 2× (88×102, viewBox trimmed to pot bottom)
      <svg width="88" height="102" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 36 L14 50 L30 50 L32 36 Z" fill="#C4703A"/>
        <rect x="10" y="32" width="24" height="5" rx="2" fill="#A8582A"/>
        <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
        <path d="M22 33 L22 20" stroke="#6A8830" strokeWidth="2.5"/>
        <ellipse cx="16" cy="27" rx="5" ry="3" fill="#5A9A28" transform="rotate(-25 16 27)"/>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <ellipse key={deg} cx="22" cy="12" rx="2" ry="6" fill="#F4C020" transform={`rotate(${deg} 22 19)`}/>
        ))}
        <circle cx="22" cy="19" r="5" fill="#7A4820"/>
        <circle cx="20" cy="18" r="1" fill="#C07838" opacity="0.6"/>
        <circle cx="24" cy="17" r="1" fill="#C07838" opacity="0.6"/>
        <circle cx="22" cy="21" r="1" fill="#C07838" opacity="0.6"/>
      </svg>,
      // 3: Beach bucket — 1.75× (77×89, viewBox trimmed to bucket bottom)
      <svg width="77" height="89" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 30 L15 50 L29 50 L31 30 Z" fill="#E8A030"/>
        <rect x="12" y="26" width="20" height="5" rx="2" fill="#D49020"/>
        <path d="M14 26 Q22 20 30 26" stroke="#B07010" strokeWidth="1.5" fill="none"/>
        <line x1="22" y1="36" x2="22" y2="44" stroke="#B07010" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="16" y1="40" x2="28" y2="40" stroke="#B07010" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>,
    ];
    return items[v];
  }

  // Autumn: September–November
  if (month >= 9 && month <= 11) {
    const items = [
      // 0: Mini pumpkin — 1.75× (77×81, viewBox trimmed to shadow bottom at y=46)
      <svg width="77" height="81" viewBox="0 0 44 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="34" rx="14" ry="10" fill="#E87820"/>
        <ellipse cx="22" cy="34" rx="9" ry="10" fill="#D06010" opacity="0.6"/>
        <ellipse cx="22" cy="34" rx="4" ry="10" fill="#E87820" opacity="0.5"/>
        <rect x="20" y="22" width="4" height="7" rx="2" fill="#5A7830"/>
        <path d="M22 24 Q26 20 28 24" stroke="#5A7830" strokeWidth="1.5" fill="none"/>
        <ellipse cx="22" cy="43" rx="8" ry="2" fill="#C05C00" opacity="0.3"/>
      </svg>,
      // 1: Acorn — 1.5× (66×65, viewBox trimmed to body bottom at y=43)
      <svg width="66" height="65" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="32" rx="9" ry="10" fill="#C07838"/>
        <path d="M13 26 Q13 18 22 18 Q31 18 31 26 Z" fill="#7A5428"/>
        <ellipse cx="22" cy="18" rx="9" ry="3" fill="#8A6438"/>
        <line x1="22" y1="15" x2="22" y2="10" stroke="#5A4020" strokeWidth="1.5"/>
        <path d="M22 11 Q25 9 27 12" stroke="#5A4020" strokeWidth="1" fill="none"/>
      </svg>,
      // 2: Mushroom — 1.75× (77×74, viewBox trimmed to stem bottom at y=42)
      <svg width="77" height="74" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="30" width="8" height="11" rx="2" fill="#F0E0C8"/>
        <path d="M8 30 Q8 14 22 14 Q36 14 36 30 Z" fill="#C83028"/>
        <ellipse cx="22" cy="30" rx="14" ry="4" fill="#A02018"/>
        <circle cx="16" cy="24" r="2.5" fill="white" opacity="0.8"/>
        <circle cx="24" cy="21" r="2" fill="white" opacity="0.8"/>
        <circle cx="29" cy="26" r="2.5" fill="white" opacity="0.8"/>
        <circle cx="19" cy="29" r="1.5" fill="white" opacity="0.6"/>
      </svg>,
      // 3: Fallen leaf — 1.75× (77×75, viewBox trimmed to leaf bottom at y=43)
      <svg width="77" height="75" viewBox="0 0 44 43" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 42 Q6 30 8 16 Q12 6 22 6 Q32 6 36 16 Q38 30 22 42 Z" fill="#D4601C"/>
        <line x1="22" y1="42" x2="22" y2="10" stroke="#B04010" strokeWidth="1.5"/>
        <line x1="22" y1="26" x2="13" y2="19" stroke="#B04010" strokeWidth="1"/>
        <line x1="22" y1="32" x2="31" y2="25" stroke="#B04010" strokeWidth="1"/>
        <line x1="22" y1="20" x2="29" y2="14" stroke="#B04010" strokeWidth="1"/>
        <line x1="22" y1="36" x2="14" y2="30" stroke="#B04010" strokeWidth="1"/>
      </svg>,
    ];
    return items[v];
  }

  // Winter: December–February
  const items = [
    // 0: Snow globe — 1.75× (77×93, viewBox trimmed to base bottom at y=53)
    <svg width="77" height="93" viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="46" width="16" height="6" rx="2" fill="#B0B0B8"/>
      <rect x="12" y="42" width="20" height="6" rx="2" fill="#A0A0A8"/>
      <circle cx="22" cy="28" r="14" fill="#C8DDF0" opacity="0.85"/>
      <circle cx="22" cy="28" r="14" stroke="#A0B8D0" strokeWidth="1.5" fill="none"/>
      <path d="M12 34 Q17 30 22 34 Q27 38 32 34" fill="white"/>
      <line x1="22" y1="34" x2="22" y2="24" stroke="#8B5E3C" strokeWidth="2"/>
      <path d="M15 28 Q22 24 29 28" stroke="#5A8A3A" strokeWidth="2.5" fill="none"/>
      <circle cx="17" cy="24" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="27" cy="22" r="1" fill="white" opacity="0.9"/>
      <circle cx="25" cy="28" r="1" fill="white" opacity="0.9"/>
    </svg>,
    // 1: Pine sprig in pot — 1.75× (77×89, viewBox trimmed to pot bottom)
    <svg width="77" height="89" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 36 L14 50 L30 50 L32 36 Z" fill="#8B6038"/>
      <rect x="10" y="32" width="24" height="5" rx="2" fill="#7A5028"/>
      <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
      <line x1="22" y1="32" x2="22" y2="20" stroke="#5A4020" strokeWidth="2"/>
      <polygon points="22,8 13,22 31,22" fill="#2A6A30"/>
      <polygon points="22,14 12,26 32,26" fill="#3A7A40"/>
      <circle cx="17" cy="16" r="1.5" fill="#E83030"/>
      <circle cx="27" cy="19" r="1.5" fill="#E83030"/>
      <circle cx="15" cy="23" r="1.5" fill="#E8C030"/>
      <circle cx="29" cy="23" r="1.5" fill="#E8C030"/>
    </svg>,
    // 2: Candle with holly — 1.5× (66×77, viewBox trimmed to candle bottom)
    <svg width="66" height="77" viewBox="0 0 44 51" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="28" width="12" height="22" rx="2" fill="#F5ECD7" stroke="#E0D0B0" strokeWidth="0.5"/>
      {[34, 38, 42].map(y => (
        <path key={y} d={`M18 ${y} Q22 ${y - 2} 26 ${y}`} stroke="#D4B878" strokeWidth="1" fill="none" opacity="0.4"/>
      ))}
      <line x1="22" y1="28" x2="22" y2="23" stroke="#5A4020" strokeWidth="1.5"/>
      <ellipse cx="22" cy="21" rx="3" ry="4" fill="#F4A020" opacity="0.9"/>
      <ellipse cx="22" cy="20" rx="1.5" ry="2" fill="#FFDD80"/>
      <ellipse cx="15" cy="29" rx="4" ry="2.5" fill="#2A7030" transform="rotate(-20 15 29)"/>
      <ellipse cx="29" cy="29" rx="4" ry="2.5" fill="#2A7030" transform="rotate(20 29 29)"/>
      <circle cx="22" cy="28" r="2" fill="#C83028"/>
      <circle cx="18" cy="30" r="1.5" fill="#C83028"/>
      <circle cx="26" cy="30" r="1.5" fill="#C83028"/>
    </svg>,
    // 3: Snowman — 1.75× (77×93, viewBox trimmed to bottom circle at y=53)
    <svg width="77" height="93" viewBox="0 0 44 53" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="44" r="8" fill="#F0F4F8" stroke="#D0D8E0" strokeWidth="1"/>
      <circle cx="22" cy="30" r="6" fill="#F0F4F8" stroke="#D0D8E0" strokeWidth="1"/>
      <circle cx="22" cy="20" r="4.5" fill="#F0F4F8" stroke="#D0D8E0" strokeWidth="1"/>
      <circle cx="20" cy="19" r="1" fill="#3A3A3A"/>
      <circle cx="24" cy="19" r="1" fill="#3A3A3A"/>
      <path d="M20 22 Q22 23.5 24 22" stroke="#E07838" strokeWidth="1.5" fill="none"/>
      <rect x="17" y="15" width="10" height="3" rx="1" fill="#3A3A3A"/>
      <rect x="16" y="14" width="12" height="2" rx="1" fill="#3A3A3A"/>
      <circle cx="22" cy="30" r="1" fill="#3A3A3A"/>
      <circle cx="22" cy="33" r="1" fill="#3A3A3A"/>
    </svg>,
  ];
  return items[v];
}

function getEffectiveProp(shelfIndex, override) {
  if (override !== undefined && override !== null) {
    if (typeof override === 'number') return getSeasonalProp(shelfIndex, override);
    if (typeof override === 'string') return <img src={override} alt="" style={{ maxHeight: 110, maxWidth: 80, objectFit: 'contain', display: 'block' }} />;
  }
  return getSeasonalProp(shelfIndex);
}

function Shelf({ books, onBookClick, shelfIndex, coverColors = {}, pulledBookId = null, propOverride, onPropClick }) {
  const isRight = shelfIndex % 2 === 1;
  const shapeIndex = shelfIndex % 4;

  const bookendShape = [
    { clipPath: "polygon(20% 6%, 100% 0%, 100% 100%, 0% 100%)" },
    { borderRadius: "44% 44% 4px 4px" },
    { borderRadius: "4px 20px 4px 4px" },
    { clipPath: "polygon(0% 0%, 80% 12%, 100% 12%, 100% 100%, 0% 100%)" },
  ][shapeIndex];

  const bookendStyle = {
    width: 34,
    height: 155,
    alignSelf: "flex-end",
    flexShrink: 0,
    background: "linear-gradient(180deg, #7A5030 0%, #5C3A1E 30%, #4A2C14 70%, #3A2010 100%)",
    boxShadow: isRight
      ? "-4px 4px 12px rgba(0,0,0,0.48), inset 2px 0 5px rgba(255,200,150,0.1)"
      : "4px 4px 12px rgba(0,0,0,0.48), inset -2px 0 5px rgba(255,200,150,0.1)",
    ...bookendShape,
  };

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Books row */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: 3,
        padding: "0 12px", minHeight: 220,
        flexWrap: "nowrap", overflowX: "auto",
      }}>
        {isRight && (
          <div
            onClick={onPropClick}
            title="Click to change decoration"
            style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", cursor: "pointer" }}
          >
            <div style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.18))" }}>
              {getEffectiveProp(shelfIndex, propOverride)}
            </div>
          </div>
        )}
        {isRight && <div aria-hidden="true" style={bookendStyle} />}
        {books.map((book, i) => (
          <BookSpine
            key={book.id}
            book={book}
            onClick={onBookClick}
            index={shelfIndex * 20 + i}
            coverColor={coverColors[book.id] || null}
            isPulled={pulledBookId === book.id}
          />
        ))}
        {!isRight && <div aria-hidden="true" style={bookendStyle} />}
        {!isRight && (
          <div
            onClick={onPropClick}
            title="Click to change decoration"
            style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", cursor: "pointer" }}
          >
            <div style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.18))" }}>
              {getEffectiveProp(shelfIndex, propOverride)}
            </div>
          </div>
        )}
      </div>
      {/* Shelf plank */}
      <div style={{
        height: 14,
        backgroundColor: "#C4A882",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='20'%3E%3Cpath d='M0,5 Q100,3 200,6 Q250,8 300,5' stroke='rgba(200,160,100,0.15)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,12 Q80,14 160,11 Q230,9 300,12' stroke='rgba(160,120,60,0.12)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,17 Q120,15 200,18 Q270,20 300,17' stroke='rgba(200,160,100,0.1)' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 20px",
        backgroundRepeat: "repeat-x",
        borderRadius: "0 0 3px 3px",
        boxShadow: "0 4px 8px rgba(80,50,20,0.4), inset 0 2px 0 rgba(255,230,180,0.25)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,230,180,0.2)" }} />
      </div>
      {/* Shelf bracket shadow */}
      <div style={{
        height: 6,
        background: "linear-gradient(180deg, rgba(0,0,0,0.3), transparent)",
        marginBottom: 20,
      }} />
    </div>
  );
}

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5C2010" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4C3 3 4 2 5 2H10V18H5C4 18 3 17 3 16V4Z"/>
      <path d="M10 2H15C16 2 17 3 17 4V16C17 17 16 18 15 18H10V2Z"/>
      <line x1="10" y1="2" x2="10" y2="18"/>
      <line x1="5" y1="7" x2="8" y2="7" strokeWidth="1"/>
      <line x1="5" y1="10" x2="8" y2="10" strokeWidth="1"/>
      <line x1="12" y1="7" x2="15" y2="7" strokeWidth="1"/>
      <line x1="12" y1="10" x2="15" y2="10" strokeWidth="1"/>
    </svg>
  );
}
function IconPages() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5C2010" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H5C4 2 3 3 3 4V16C3 17 4 18 5 18H15C16 18 17 17 17 16V6L13 2Z"/>
      <polyline points="13,2 13,6 17,6"/>
      <line x1="7" y1="10" x2="13" y2="10"/>
      <line x1="7" y1="13" x2="13" y2="13"/>
      <line x1="7" y1="7" x2="10" y2="7"/>
    </svg>
  );
}
function IconHeadphones() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5C2010" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11V10a7 7 0 0 1 14 0v1"/>
      <rect x="2" y="11" width="3" height="5" rx="1.5"/>
      <rect x="15" y="11" width="3" height="5" rx="1.5"/>
    </svg>
  );
}
function IconClosedBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5C2010" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="12" height="16" rx="1"/>
      <line x1="4" y1="2" x2="4" y2="18"/>
      <line x1="6" y1="2" x2="6" y2="18" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L12.39 7.26L18 8.09L14 12L15.18 17.59L10 14.77L4.82 17.59L6 12L2 8.09L7.61 7.26L10 2Z"
        stroke="#5C2010" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function StarFilledIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="#5C2010" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2L12.39 7.26L18 8.09L14 12L15.18 17.59L10 14.77L4.82 17.59L6 12L2 8.09L7.61 7.26L10 2Z"/>
    </svg>
  );
}

function StatsBar({ books }) {
  const read = books.filter(b => b.s === "read");
  const audiobooks = books.filter(b => b.au && b.s === "read");
  const printedBooks = books.filter(b => !b.au && b.s === "read");
  const totalPages = read.reduce((s, b) => s + b.p, 0);
  const rated = read.filter(b => b.r > 0);
  const avgRating = rated.length > 0 ? (rated.reduce((s, b) => s + b.r, 0) / rated.length).toFixed(1) : "—";
  const fiveStars = read.filter(b => b.r === 5).length;

  const stats = [
    { label: "Books Read", value: read.length, icon: <IconBook /> },
    { label: "Pages", value: totalPages.toLocaleString(), icon: <IconPages /> },
    { label: "Audiobooks", value: audiobooks.length, icon: <IconHeadphones /> },
    { label: "Printed Books", value: printedBooks.length, icon: <IconClosedBook /> },
    { label: "Avg Rating", value: avgRating, icon: <StarIcon /> },
    { label: "5-Star Reads", value: fiveStars, icon: <StarFilledIcon /> },
  ];

  return (
    <div style={{
      display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap",
      maxWidth: 1100, margin: "8px auto 0", padding: "0 20px",
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          padding: "14px 20px", textAlign: "center", minWidth: 70, flex: 1, maxWidth: 160,
          background: "rgba(255,255,255,0.75)",
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(120,70,40,0.10), 0 1px 3px rgba(120,70,40,0.07)",
          border: "1px solid rgba(200,160,120,0.2)",
        }}>
          <div style={{ fontSize: 18, marginBottom: 4, lineHeight: 1.4, display: "flex", justifyContent: "center", alignItems: "center" }}>{s.icon}</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#5C2010", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B3520", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

const SEASON_LABEL = (() => {
  const m = new Date().getMonth() + 1;
  return m >= 3 && m <= 5 ? 'Spring' : m >= 6 && m <= 8 ? 'Summer' : m >= 9 && m <= 11 ? 'Autumn' : 'Winter';
})();

function CurrentlyReadingCard({ book, onClick, tiltRight }) {
  const [hovered, setHovered] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const coverSources = [
    book.cover || null,
    book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null,
    book.isbn ? `https://books.google.com/books/content?vid=ISBN:${book.isbn}&printsec=frontcover&img=1&zoom=1` : null,
  ].filter(Boolean);
  const coverSrc = srcIndex < coverSources.length ? coverSources[srcIndex] : null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        marginBottom: 20,
        transform: hovered
          ? `rotate(${tiltRight ? 3 : -3}deg) scale(1.04)`
          : 'rotate(0deg) scale(1)',
        transition: 'transform 0.2s ease',
        transformOrigin: 'bottom center',
        display: 'inline-block',
        width: '100%',
      }}
    >
      {coverSrc ? (
        <img
          src={coverSrc}
          alt={book.t}
          onError={() => setSrcIndex(i => i + 1)}
          style={{
            width: '100%', maxWidth: 140, display: 'block',
            borderRadius: 4,
            boxShadow: '0 6px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)',
          }}
        />
      ) : (
        <div style={{
          width: '100%', maxWidth: 140, height: 190, borderRadius: 4,
          background: 'linear-gradient(135deg, #8B6040, #5C3A1E)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, padding: 8, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
            {book.t}
          </span>
        </div>
      )}
      <p style={{
        margin: '7px 0 2px', fontSize: 12, fontWeight: 600,
        color: '#3A2010', fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.3, maxWidth: 140,
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {book.t}
      </p>
      <p style={{
        margin: 0, fontSize: 11, color: '#7A5030',
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 140, overflow: 'hidden',
        whiteSpace: 'nowrap', textOverflow: 'ellipsis',
      }}>
        {book.a}
      </p>
    </div>
  );
}

function CurrentlyReadingPanel({ books, onBookClick }) {
  return (
    <div className="cr-panel" style={{
      width: 180, flexShrink: 0,
      paddingTop: 4, overflow: 'visible',
    }}>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        color: '#5C0F1E', fontSize: 15, fontWeight: 700,
        margin: '0 0 16px', letterSpacing: '-0.3px',
      }}>
        Currently Reading
      </h3>
      {books.length === 0 ? (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: '#8B7355', fontSize: 14, fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          Nothing on the nightstand yet
        </p>
      ) : (
        books.map((book, i) => (
          <CurrentlyReadingCard
            key={book.id}
            book={book}
            onClick={() => onBookClick(book)}
            tiltRight={i % 2 === 0}
          />
        ))
      )}
    </div>
  );
}

function ShelfPropPickerModal({ shelfIndex, currentOverride, onSelect, onClear, onClose }) {
  const fileRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onSelect(ev.target.result);
    reader.readAsDataURL(file);
  };

  const overlayStyle = {
    position: "fixed", inset: 0, background: "rgba(20,10,5,0.75)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 600, padding: 20,
  };

  return (
    <div style={overlayStyle}>
      <div
        style={{
          background: "#1E1208", border: "1px solid #4A3728", borderRadius: 16,
          padding: 28, width: "100%", maxWidth: 380, fontFamily: "'DM Sans', sans-serif",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ color: "#F5ECD7", fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 4px", fontSize: 20 }}>
          Change Decoration
        </h3>
        <p style={{ color: "#A08060", fontSize: 12, margin: "0 0 20px" }}>
          {SEASON_LABEL} shelf {shelfIndex + 1} — pick a theme decoration or upload your own image
        </p>

        {/* 4 seasonal options */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
          {[0, 1, 2, 3].map(i => {
            const isSelected = currentOverride === i;
            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                title={`Option ${i + 1}`}
                style={{
                  width: 72, height: 96, border: isSelected ? "2px solid #D4A843" : "1px solid #4A3728",
                  borderRadius: 10, background: isSelected ? "rgba(212,168,67,0.12)" : "#2C1D12",
                  cursor: "pointer", overflow: "hidden", position: "relative", padding: 0,
                }}
              >
                <div style={{
                  position: "absolute", bottom: 0, left: "50%",
                  transform: "translateX(-50%) scale(0.62)",
                  transformOrigin: "bottom center",
                  display: "flex",
                }}>
                  {getSeasonalProp(shelfIndex === 0 ? 999 : shelfIndex, i)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Upload */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} style={{ display: "none" }} />
          <button
            onClick={() => fileRef.current.click()}
            style={{
              padding: "9px 18px", borderRadius: 8, border: "1px solid #4A3728",
              background: "#2C1D12", color: "#D4A843",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
            }}
          >
            Upload image
          </button>
          {currentOverride !== undefined && currentOverride !== null && (
            <button
              onClick={onClear}
              style={{
                padding: "9px 18px", borderRadius: 8, border: "1px solid #3A2820",
                background: "transparent", color: "#8B6040",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
              }}
            >
              Use default
            </button>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px", borderRadius: 8, border: "1px solid #4A3728",
              background: "transparent", color: "#BFA88A",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SiteSettingsModal({ settings, defaultImageUrl, onSave, onClose }) {
  const [name, setName] = useState(settings.name || "My Bookshelf");
  const [imageUrl, setImageUrl] = useState(settings.imageUrl || "");
  const [urlInput, setUrlInput] = useState(settings.imageUrl || "");
  const [imagePosition, setImagePosition] = useState(settings.imagePosition !== undefined ? settings.imagePosition : 22);
  const [selectedIcon, setSelectedIcon] = useState(settings.headerIcon || 'books');
  const [garlandEnabled, setGarlandEnabled] = useState(settings.garlandEnabled !== false);
  const [currentlyReadingEnabled, setCurrentlyReadingEnabled] = useState(settings.currentlyReadingEnabled || false);
  const [profileImage, setProfileImage] = useState(settings.profileImage || '');
  const profileFileRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImageUrl(ev.target.result); setUrlInput(""); };
    reader.readAsDataURL(file);
  };

  const handleProfileFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({ name: name.trim() || "My Bookshelf", imageUrl, imagePosition, headerIcon: selectedIcon, garlandEnabled, profileImage, currentlyReadingEnabled });
    onClose();
  };

  const overlayStyle = {
    position: "fixed", inset: 0, background: "rgba(20,10,5,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: 20,
  };
  const modalStyle = {
    background: "#1E1208", border: "1px solid #4A3728", borderRadius: 16,
    padding: 32, width: "100%", maxWidth: 420,
    fontFamily: "'DM Sans', sans-serif",
  };
  const labelStyle = { color: "#D4A843", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 6 };
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #4A3728", background: "#2C1D12",
    color: "#E8D5B7", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };

  const preview = imageUrl || defaultImageUrl;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: "#F5ECD7", fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 24px", fontSize: 22 }}>
          Edit Profile
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Site Name</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="My Bookshelf" />
        </div>

        {/* Profile circle image */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Profile Circle Image</label>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", overflow: "hidden",
              border: "2px solid #4A3728", background: "#2C1D12", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {profileImage
                ? <img src={profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="#4A3728"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/></svg>
              }
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <input type="file" accept="image/*" ref={profileFileRef} onChange={handleProfileFile} style={{ display: "none" }} />
              <button
                onClick={() => profileFileRef.current.click()}
                style={{
                  padding: "7px 14px", borderRadius: 7, border: "1px solid #4A3728",
                  background: "#2C1D12", color: "#D4A843",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer",
                }}
              >
                Upload photo
              </button>
              {profileImage && (
                <button
                  onClick={() => setProfileImage('')}
                  style={{
                    padding: "5px 14px", borderRadius: 7, border: "1px solid #3A2820",
                    background: "transparent", color: "#7A5040",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Header Image</label>
          {preview && (
            <div style={{ marginBottom: 6, borderRadius: 8, overflow: "hidden", height: 80 }}>
              <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `center ${imagePosition}%` }} />
            </div>
          )}
          {preview && (
            <div style={{ marginBottom: 10 }}>
              <label style={{ ...labelStyle, fontSize: 10, opacity: 0.7 }}>Drag to reposition image</label>
              <input
                type="range" min="0" max="100" value={imagePosition}
                onChange={e => setImagePosition(Number(e.target.value))}
                style={{ width: "100%", cursor: "ns-resize", accentColor: "#8B2840" }}
              />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ ...labelStyle, fontSize: 10, opacity: 0.7 }}>Upload from device</label>
              <input type="file" accept="image/*" onChange={handleFile}
                style={{ color: "#BFA88A", fontSize: 13, cursor: "pointer" }} />
            </div>
            <div>
              <label style={{ ...labelStyle, fontSize: 10, opacity: 0.7 }}>Or paste an image URL</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://..." />
                <button onClick={() => setImageUrl(urlInput)}
                  style={{
                    padding: "10px 14px", borderRadius: 8, border: "1px solid #4A3728",
                    background: "#2C1D12", color: urlInput ? "#D4A843" : "#4A3728",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    cursor: urlInput ? "pointer" : "not-allowed",
                  }}>
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Header Icon</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(HEADER_ICONS).map(([key, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedIcon(key)}
                style={{
                  padding: 10, borderRadius: 10, cursor: "pointer",
                  border: selectedIcon === key ? "2px solid #D4A843" : "1px solid #4A3728",
                  background: selectedIcon === key ? "rgba(212,168,67,0.15)" : "#2C1D12",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Garland toggle */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Seasonal Frame Decorations</label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={garlandEnabled}
              onChange={e => setGarlandEnabled(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#D4A843", cursor: "pointer" }}
            />
            <span style={{ color: "#D4A843", fontSize: 13 }}>
              Show seasonal decorations on the bookcase frame
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 8, border: "1px solid #4A3728",
            background: "transparent", color: "#BFA88A",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: "10px 24px", borderRadius: 8, border: "none",
            background: "#8B2840", color: "#F9EDE8",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { books: syncedBooks, loading: syncLoading } = useGoodreadsSync(RAW_BOOKS);
  const { manualBooks, overrides, deletedIds, addBook, editBook, deleteBook, customColors, setCustomColor } = useLocalData();
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState("dateRead");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterShelf, setFilterShelf] = useState("read");
  const [filterGenres, setFilterGenres] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef(null);
  const [toggleHovered, setToggleHovered] = useState(false);
  const [pageTransitioning, setPageTransitioning] = useState(false);
  const [crPanelFullyOpen, setCrPanelFullyOpen] = useState(!!siteSettings.currentlyReadingEnabled);

  const handleNavigate = useCallback((view) => {
    if (view === currentView) return;
    setPageTransitioning(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentView(view);
      setPageTransitioning(false);
    }, 180);
  }, [currentView]);
  const [searchQuery, setSearchQuery] = useState("");
  const coverColors = useCoverColors(syncedBooks);
  const [pulledBookId, setPulledBookId] = useState(null);
  const pullTimeoutRef = useRef(null);
  const [currentView, setCurrentView] = useState('bookshelf');
  const [siteSettings, setSiteSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookshelf_settings_v1') || '{}'); } catch { return {}; }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [propPickerShelf, setPropPickerShelf] = useState(null);

  const updateSiteSettings = (changes) => {
    setSiteSettings(prev => {
      const next = { ...prev, ...changes };
      localStorage.setItem('bookshelf_settings_v1', JSON.stringify(next));
      return next;
    });
  };

  const handlePropSelect = (shelfIndex, override) => {
    updateSiteSettings({
      shelfPropOverrides: { ...(siteSettings.shelfPropOverrides || {}), [shelfIndex]: override },
    });
    setPropPickerShelf(null);
  };

  const handlePropClear = (shelfIndex) => {
    const overrides = { ...(siteSettings.shelfPropOverrides || {}) };
    delete overrides[shelfIndex];
    updateSiteSettings({ shelfPropOverrides: overrides });
    setPropPickerShelf(null);
  };

  const manualBookIds = useMemo(() => new Set(manualBooks.map(b => b.id)), [manualBooks]);

  const books = useMemo(() => {
    const applyOverrides = (b) => overrides[b.id] ? { ...b, ...overrides[b.id] } : b;
    const syncedFiltered = syncedBooks
      .filter(b => !deletedIds.has(b.id))
      .map(applyOverrides);
    const syncedIdSet = new Set(syncedBooks.map(b => b.id));
    const manualFiltered = manualBooks
      .filter(b => !deletedIds.has(b.id) && !syncedIdSet.has(b.id))
      .map(applyOverrides);
    return [...syncedFiltered, ...manualFiltered];
  }, [syncedBooks, manualBooks, overrides, deletedIds]);

  // Derive selectedBook from books array so the modal auto-reflects quick edits
  const selectedBook = useMemo(
    () => selectedBookId ? books.find(b => b.id === selectedBookId) ?? null : null,
    [books, selectedBookId]
  );

  // Custom colours override auto-extracted colours
  const effectiveColors = useMemo(
    () => ({ ...coverColors, ...customColors }),
    [coverColors, customColors]
  );

  useEffect(() => {
    if (!selectedBookId) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        clearTimeout(pullTimeoutRef.current);
        setSelectedBookId(null);
        setPulledBookId(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedBookId]);

  const allGenres = useMemo(() => {
    const genres = new Set();
    books.forEach(b => b.g.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  }, [books]);

  const genreAvailability = useMemo(() => {
    const result = {};
    allGenres.forEach(g => {
      if (filterGenres.includes(g)) {
        result[g] = 'selected';
      } else {
        const testGenres = [...filterGenres, g];
        const hasBooks = books.some(b => {
          if (filterShelf === "reread") { if (!b.reread) return false; }
          else if (filterShelf !== "all" && b.s !== filterShelf) return false;
          return testGenres.every(genre => b.g.includes(genre));
        });
        result[g] = hasBooks ? 'available' : 'disabled';
      }
    });
    return result;
  }, [allGenres, filterGenres, books, filterShelf]);

  useEffect(() => {
    if (!genreDropdownOpen) return;
    const handler = (e) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(e.target)) {
        setGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [genreDropdownOpen]);

  const filteredAndSorted = useMemo(() => {
    let filtered = books.filter(b => {
      if (filterShelf === "reread") { if (!b.reread) return false; }
      else if (filterShelf !== "all" && b.s !== filterShelf) return false;
      if (filterGenres.length > 0 && !filterGenres.every(g => b.g.includes(g))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return b.t.toLowerCase().includes(q) || b.a.toLowerCase().includes(q) || b.sn.toLowerCase().includes(q);
      }
      return true;
    });

    // For dateRead: sort purely by dr (no series grouping), dated items first, dateless at end
    if (sortBy === "dateRead") {
      const dated = filtered.filter(b => !!b.dr);
      const dateless = filtered.filter(b => !b.dr);
      dated.sort((a, b) => {
        const drResult = b.dr.localeCompare(a.dr);
        if (drResult !== 0) return sortAsc ? -drResult : drResult;
        const aLast = (a.a || '').trim().split(' ').pop().toLowerCase();
        const bLast = (b.a || '').trim().split(' ').pop().toLowerCase();
        const authorResult = aLast.localeCompare(bLast);
        if (authorResult !== 0) return authorResult;
        return parseInt(a.y || 0) - parseInt(b.y || 0);
      });
      return [...dated, ...dateless];
    }

    // Group series books together
    const seriesMap = {};
    const standalone = [];
    
    filtered.forEach(b => {
      if (b.sn) {
        if (!seriesMap[b.sn]) seriesMap[b.sn] = [];
        seriesMap[b.sn].push(b);
      } else {
        standalone.push(b);
      }
    });

    // Sort within each series: by year (ascending) for author sort, otherwise by series number
    Object.values(seriesMap).forEach(arr => {
      if (sortBy === "author") {
        arr.sort((a, b) => parseInt(a.y || "0") - parseInt(b.y || "0"));
      } else {
        arr.sort((a, b) => a.si - b.si);
      }
    });

    // Get sort key for a group (use first book's value for series)
    const getSortKey = (b) => {
      if (sortBy === "dateRead") return b.dr || "";
      if (sortBy === "rating") return b.r;
      if (sortBy === "title") return b.t.toLowerCase();
      if (sortBy === "author") { const last = b.a.split(" ").pop().toLowerCase(); return last + "\t" + b.a.toLowerCase() + "\t" + (b.y || "0000"); }
      if (sortBy === "pages") return b.p;
      if (sortBy === "color") return hexToHue(effectiveColors[b.id] || getBookColor(b.id));
      return 0;
    };

    // For series, use the latest/highest/first value in the series for sorting
    const getSeriesSortKey = (arr) => {
      if (sortBy === "rating") return Math.max(...arr.map(b => b.r));
      if (sortBy === "title") return arr[0].sn.toLowerCase();
      if (sortBy === "author") { const last = arr[0].a.split(" ").pop().toLowerCase(); return last + "\t" + arr[0].a.toLowerCase() + "\t" + (arr[0].y || "0000"); }
      if (sortBy === "pages") return arr.reduce((s, b) => s + b.p, 0);
      if (sortBy === "color") return hexToHue(effectiveColors[arr[0].id] || getBookColor(arr[0].id));
      return 0;
    };

    // Build final list: interleave series and standalones
    const items = [];
    standalone.forEach(b => items.push({ type: "single", book: b, sortKey: getSortKey(b) }));
    Object.entries(seriesMap).forEach(([name, arr]) => items.push({ type: "series", books: arr, sortKey: getSeriesSortKey(arr), name }));

    items.sort((a, b) => {
      let result;
      if (sortBy === "rating") result = b.sortKey - a.sortKey;
      else if (sortBy === "author") {
        const [aLast, aFull, aYear] = a.sortKey.split("\t");
        const [bLast, bFull, bYear] = b.sortKey.split("\t");
        const nameCmp = aLast !== bLast ? aLast.localeCompare(bLast) : aFull.localeCompare(bFull);
        if (nameCmp !== 0) return sortAsc ? -nameCmp : nameCmp;
        return parseInt(aYear || "0") - parseInt(bYear || "0");
      }
      else if (sortBy === "title") result = a.sortKey.localeCompare(b.sortKey);
      else if (sortBy === "pages") result = b.sortKey - a.sortKey;
      else if (sortBy === "color") result = a.sortKey - b.sortKey;
      else result = 0;
      return sortAsc ? -result : result;
    });

    // Flatten
    const result = [];
    items.forEach(item => {
      if (item.type === "single") result.push(item.book);
      else item.books.forEach(b => result.push(b));
    });

    return result;
  }, [books, sortBy, sortAsc, filterShelf, filterGenres, searchQuery, effectiveColors]);

  // Split books into shelves of ~12-16 books each
  const shelves = useMemo(() => {
    const result = [];
    const booksPerShelf = 20;
    for (let i = 0; i < filteredAndSorted.length; i += booksPerShelf) {
      result.push(filteredAndSorted.slice(i, i + booksPerShelf));
    }
    return result;
  }, [filteredAndSorted]);

  const currentlyReadingBooks = useMemo(
    () => books.filter(b => b.s === 'currently-reading'),
    [books]
  );

  useEffect(() => {
    if (!siteSettings.currentlyReadingEnabled) setCrPanelFullyOpen(false);
  }, [siteSettings.currentlyReadingEnabled]);

  const handleEditBook = useCallback((id, changes) => {
    editBook(id, changes, manualBookIds.has(id));
  }, [editBook, manualBookIds]);

  const handleDeleteBook = useCallback((id) => {
    deleteBook(id);
    setSelectedBookId(null);
    setPulledBookId(null);
  }, [deleteBook]);

  const shelfCounts = useMemo(() => ({
    all: books.length,
    read: books.filter(b => b.s === "read").length,
    "currently-reading": books.filter(b => b.s === "currently-reading").length,
    "to-read": books.filter(b => b.s === "to-read").length,
    dnf: books.filter(b => b.s === "dnf").length,
    reread: books.filter(b => b.reread).length,
  }), [books]);

  const pillStyle = (active) => ({
    padding: "7px 16px", borderRadius: 20, border: "1px solid",
    borderColor: active ? "#8B2840" : "rgba(120,50,60,0.25)",
    background: active ? "#8B2840" : "rgba(255,255,255,0.55)",
    color: active ? "#FDF0F3" : "#7A3040",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
    transition: "all 0.2s", flex: 1, textAlign: "center",
    fontWeight: active ? 600 : 400,
  });

  return (
    <>
      {currentView === 'bookshelf' && (
    <div className={`page-root ${pageTransitioning ? 'page-exit' : 'page-enter'}`} style={{
      minHeight: "100vh",
      backgroundColor: "#F2E8D9",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Cline x1='0' y1='10' x2='200' y2='8' stroke='rgba(160,120,70,0.07)' stroke-width='0.7'/%3E%3Cline x1='0' y1='22' x2='200' y2='24' stroke='rgba(140,100,55,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='35' x2='200' y2='33' stroke='rgba(160,120,70,0.06)' stroke-width='0.6'/%3E%3Cline x1='0' y1='48' x2='200' y2='50' stroke='rgba(140,100,55,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='62' x2='200' y2='60' stroke='rgba(160,120,70,0.07)' stroke-width='0.7'/%3E%3Cline x1='0' y1='75' x2='200' y2='77' stroke='rgba(140,100,55,0.04)' stroke-width='0.4'/%3E%3Cline x1='0' y1='88' x2='200' y2='86' stroke='rgba(160,120,70,0.06)' stroke-width='0.6'/%3E%3Cline x1='43' y1='0' x2='45' y2='100' stroke='rgba(160,120,70,0.03)' stroke-width='0.4'/%3E%3Cline x1='120' y1='0' x2='122' y2='100' stroke='rgba(140,100,55,0.03)' stroke-width='0.3'/%3E%3Cline x1='173' y1='0' x2='175' y2='100' stroke='rgba(160,120,70,0.025)' stroke-width='0.3'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { scrollbar-width: thin; scrollbar-color: #C4A882 #F2E8D9; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: #F2E8D9; }
        *::-webkit-scrollbar-thumb { background: #C4A882; border-radius: 3px; }
        input:focus, select:focus, textarea:focus { border-color: #A0445A !important; box-shadow: 0 0 0 2px rgba(160,68,90,0.15); }
        select option { background: #F2E8D9; color: #3A2515; }
        select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B3520' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px !important; }
        @media (max-width: 768px) {
  .bookshelf-row { flex-direction: column !important; }
  .cr-panel { width: 100% !important; overflow-x: auto; display: flex; flex-direction: row; gap: 16px; padding-bottom: 12px; }
  .cr-panel h3 { flex-shrink: 0; writing-mode: horizontal-tb; margin-bottom: 0; align-self: center; margin-right: 8px; }
}
      `}</style>

      {/* Cherry tree + Stats wrapper — single background layer */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "0 0 40px 40px" }}>
        {/* Cherry tree photo */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${siteSettings.imageUrl || cherryTreeImg}")`,
          backgroundSize: "cover",
          backgroundPosition: `center ${siteSettings.imagePosition !== undefined ? siteSettings.imagePosition : 22}%`,
          backgroundRepeat: "no-repeat",
        }} />
        {/* Gradient — stays transparent through header + stats, fades to cream at very bottom */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(252,228,239,0.28) 0%, rgba(252,220,230,0.42) 35%, rgba(252,210,220,0.6) 60%, rgba(242,232,217,0.88) 85%, rgba(242,232,217,1) 100%)",
        }} />

        {/* Header content */}
        <div style={{ padding: "28px 20px 8px", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Profile / edit button — top right */}
          <button
            onClick={() => setShowSettings(true)}
            title="Edit profile"
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.28)", border: "1px solid rgba(92,15,30,0.3)",
              borderRadius: "50%", width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(4px)",
              overflow: "hidden", padding: 0,
            }}
          >
            {siteSettings.profileImage
              ? <img src={siteSettings.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="#5C0F1E">
                  <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>
                </svg>
            }
          </button>

          <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>
            {HEADER_ICONS[siteSettings.headerIcon || 'books']}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5C0F1E", fontSize: 42, fontWeight: 900, margin: 0,
            letterSpacing: "-1px",
            WebkitTextStroke: "1.5px #1a0810",
            paintOrder: "stroke fill",
          }}>
            {siteSettings.name || "My Bookshelf"}
          </h1>
          <RotatingQuote books={books} />
        </div>

        {syncLoading && (
          <div style={{
            textAlign: 'center', padding: '6px', fontSize: 12,
            color: '#8B5E3C', fontFamily: "'DM Sans', sans-serif",
            opacity: 0.7, position: "relative", zIndex: 1,
          }}>
            Syncing with Goodreads…
          </div>
        )}

        {/* Stats — still over the cherry tree */}
        <div className="stats-bar-wrap" style={{ position: "relative", zIndex: 1, paddingBottom: 14 }}>
          <StatsBar books={books} />
        </div>
      </div>

      {/* Nav strip — between stats and search */}
      <NavPanel currentView={currentView} onNavigate={handleNavigate} />

      {/* Controls */}
      <div style={{ paddingBottom: 16 }}>
      {/* Controls */}
      <div className="controls-wrap" style={{ padding: "12px 20px 8px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#8B5E3C", display: "flex" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="4.5" />
              <line x1="10" y1="10" x2="14" y2="14" />
            </svg>
          </span>
          <input
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or series..."
            style={{
              width: "100%", padding: "12px 16px 12px 40px", borderRadius: 10,
              border: "1px solid rgba(120,70,50,0.3)", background: "rgba(255,255,255,0.65)",
              color: "#3A2010", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Shelf filter */}
        <div style={{ display: "flex", marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "All" },
            { key: "read", label: "Read" },
            { key: "currently-reading", label: "Reading" },
            { key: "to-read", label: "To Read" },
            { key: "dnf", label: "DNF" },
            { key: "reread", label: "To Reread" },
          ].map(s => (
            <button key={s.key} onClick={() => setFilterShelf(s.key)} style={pillStyle(filterShelf === s.key)}>
              {s.label} <span style={{ opacity: 0.6, marginLeft: 4 }}>({shelfCounts[s.key]})</span>
            </button>
          ))}
        </div>

        {/* Sort & genre filter */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6B3520", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Sort</span>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setSortAsc(false); }} style={{
              padding: "7px 28px 7px 12px", borderRadius: 8, border: "1px solid rgba(160,100,70,0.35)",
              background: "rgba(255,255,255,0.75)", color: "#3A2010", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
              boxShadow: "0 1px 4px rgba(120,70,40,0.08)",
            }}>
              <option value="dateRead">Date Read</option>
              <option value="rating">My Rating</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="pages">Pages</option>
              <option value="color">Colour</option>
            </select>
            <button
              onClick={() => setSortAsc(v => !v)}
              title={sortAsc ? "Currently ascending — click to reverse" : "Currently descending — click to reverse"}
              style={{
                padding: "6px 10px", borderRadius: 8,
                border: "1px solid rgba(160,100,70,0.35)",
                background: "rgba(255,255,255,0.75)", color: "#5C2010",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                cursor: "pointer", lineHeight: 1,
                boxShadow: "0 1px 4px rgba(120,70,40,0.08)",
              }}
            >{sortAsc ? "↑" : "↓"}</button>
          </div>
          {allGenres.length > 0 && (
            <div ref={genreDropdownRef} style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <span style={{ color: "#6B3520", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Genre</span>
              <button
                onClick={() => setGenreDropdownOpen(v => !v)}
                style={{
                  padding: "7px 12px", borderRadius: 8,
                  border: `1px solid ${filterGenres.length > 0 ? "#8B2840" : "rgba(160,100,70,0.35)"}`,
                  background: filterGenres.length > 0 ? "#8B2840" : "rgba(255,255,255,0.75)",
                  color: filterGenres.length > 0 ? "#FDF0F3" : "#3A2010",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer", outline: "none",
                  boxShadow: "0 1px 4px rgba(120,70,40,0.08)",
                  display: "flex", alignItems: "center", gap: 6,
                  minWidth: 120,
                }}
              >
                <span>{filterGenres.length === 0 ? "All Genres" : `${filterGenres.length} selected`}</span>
              </button>
              {genreDropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0,
                  background: "#FDF5EC", border: "1px solid rgba(160,100,70,0.3)",
                  borderRadius: 10, boxShadow: "0 8px 24px rgba(80,50,20,0.18)",
                  zIndex: 200, minWidth: 200, maxHeight: 320, overflowY: "auto",
                  padding: "8px 0",
                }}>
                  {filterGenres.length > 0 && (
                    <button
                      onClick={() => setFilterGenres([])}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 16px", background: "none", border: "none",
                        fontSize: 12, color: "#A06070", fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer", borderBottom: "1px solid rgba(160,100,70,0.15)",
                        marginBottom: 4,
                      }}
                    >✕ Clear all</button>
                  )}
                  {allGenres.filter(g => genreAvailability[g] !== 'disabled').map(g => {
                    const isSelected = genreAvailability[g] === 'selected';
                    return (
                      <label key={g} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 16px", cursor: "pointer",
                        background: isSelected ? "rgba(139,40,64,0.08)" : "none",
                      }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => setFilterGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                          style={{ accentColor: "#8B2840", width: 14, height: 14, cursor: "pointer" }}
                        />
                        <span style={{
                          fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                          color: isSelected ? "#8B2840" : "#3A2010",
                          fontWeight: isSelected ? 600 : 400,
                        }}>{g}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>{/* end controls */}

      {/* Bookshelf + Currently Reading row */}
      <div
        className="bookshelf-row"
        style={{
          padding: "20px 20px 60px",
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div style={{ position: 'relative' }}>
        {/* Wood frame */}
        <div style={{
          padding: 18,
          background: "linear-gradient(135deg, #C8A878 0%, #B89060 30%, #A87A48 60%, #B89060 80%, #C4A070 100%)",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(80,50,20,0.45), inset 0 2px 4px rgba(255,220,170,0.2), inset 0 -2px 4px rgba(0,0,0,0.25)",
          border: "1px solid #C0986A",
          position: "relative",
        }}>
        {siteSettings.garlandEnabled !== false && <SeasonalGarland />}
        {/* Flat book — Add Book button resting on top surface of wood frame */}
        <button
          onClick={() => setShowAddForm(true)}
          title="Add a book"
          style={{
            position: "absolute", top: 4, left: 22, zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, width: 156, height: 30,
            background: "linear-gradient(180deg, #CC8096 0%, #B86878 100%)",
            border: "1px solid rgba(140,60,80,0.4)",
            borderLeft: "10px solid #8B4558",
            borderRadius: "3px 4px 4px 3px",
            color: "#FDF0F3", fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: "1px 5px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,210,220,0.2)",
            letterSpacing: "0.3px",
          }}
        >
          + Add Book
        </button>
        {/* Back panel texture */}
        <div style={{
          backgroundColor: "#7A6048",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80'%3E%3Cpath d='M0,10 Q75,8 150,12 Q225,15 300,10' stroke='rgba(200,160,100,0.1)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,25 Q100,27 200,23 Q250,21 300,25' stroke='rgba(160,120,70,0.08)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,40 Q80,38 160,42 Q220,45 300,40' stroke='rgba(200,160,100,0.08)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,55 Q120,57 200,53 Q260,51 300,55' stroke='rgba(160,120,70,0.08)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,70 Q70,68 140,72 Q210,75 300,70' stroke='rgba(200,160,100,0.07)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 80px",
          backgroundRepeat: "repeat",
          borderRadius: 8, padding: "24px 12px 12px",
          border: "1px solid #8A7050",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.35), inset 0 -2px 10px rgba(0,0,0,0.2)",
        }}>
          {filteredAndSorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#8B7355", fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic" }}>
              No books found. Try adjusting your filters.
            </div>
          ) : (
            shelves.map((shelfBooks, i) => (
              <Shelf
                key={i}
                books={shelfBooks}
                onBookClick={(book) => {
                  setPulledBookId(book.id);
                  setSelectedBookId(book.id);
                }}
                shelfIndex={i}
                coverColors={effectiveColors}
                pulledBookId={pulledBookId}
                propOverride={(siteSettings.shelfPropOverrides || {})[i]}
                onPropClick={() => setPropPickerShelf(i)}
              />
            ))
          )}
        </div>
        </div>{/* end wood frame */}

        {/* Count */}
        <div style={{ textAlign: "center", marginTop: 20, color: "#4A3020", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
          Showing {filteredAndSorted.length} book{filteredAndSorted.length !== 1 ? "s" : ""}
        </div>
      {/* Vignette overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(200,170,130,0.18) 80%, rgba(180,140,100,0.32) 100%)",
        borderRadius: 14,
      }} />

      {/* Bookmark toggle — absolutely positioned at right edge of bookshelf */}
      <button
        onClick={() => updateSiteSettings({ currentlyReadingEnabled: !siteSettings.currentlyReadingEnabled })}
        onMouseEnter={() => setToggleHovered(true)}
        onMouseLeave={() => setToggleHovered(false)}
        style={{
          position: "absolute",
          top: 22,
          right: toggleHovered ? -18 : -14,
          width: toggleHovered ? 32 : 28,
          height: 54,
          borderRadius: "0 8px 8px 0",
          border: `1px solid ${siteSettings.currentlyReadingEnabled ? "#6A1E30" : "rgba(140,90,50,0.6)"}`,
          borderLeft: "none",
          background: siteSettings.currentlyReadingEnabled
            ? (toggleHovered ? "linear-gradient(180deg, #A03050, #7A1E2E)" : "linear-gradient(180deg, #8B2840, #6A1E30)")
            : (toggleHovered ? "linear-gradient(180deg, #D4B888, #C4A070)" : "linear-gradient(180deg, #C8A878, #B89060)"),
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: toggleHovered ? "4px 3px 12px rgba(80,50,20,0.45)" : "3px 2px 8px rgba(80,50,20,0.3)",
          transition: "all 0.15s ease",
          padding: 0,
          zIndex: 20,
        }}
      >
        <svg width="12" height="15" viewBox="0 0 13 16" fill="none">
          <path d="M2 1h9a1 1 0 0 1 1 1v12l-4.5-3L3 14V2a1 1 0 0 1 1-1z"
            fill={siteSettings.currentlyReadingEnabled ? "rgba(255,255,255,0.9)" : "rgba(92,32,16,0.85)"}
            stroke={siteSettings.currentlyReadingEnabled ? "rgba(255,255,255,0.5)" : "rgba(92,32,16,0.4)"}
            strokeWidth="0.5"
          />
        </svg>
        {/* Custom quick tooltip */}
        {toggleHovered && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "calc(100% + 8px)",
            transform: "translateY(-50%)",
            background: "rgba(30,15,5,0.88)",
            color: "#F9EDE8",
            fontSize: 11,
            fontFamily: "'DM Sans', sans-serif",
            padding: "5px 9px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            {siteSettings.currentlyReadingEnabled ? "Hide currently reading" : "Show currently reading"}
          </div>
        )}
      </button>

      {/* Sliding CR panel — absolutely positioned, does not affect bookshelf layout */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "calc(100% + 14px)",
          width: siteSettings.currentlyReadingEnabled ? 210 : 0,
          overflow: crPanelFullyOpen ? 'visible' : 'hidden',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
        onTransitionEnd={() => { if (siteSettings.currentlyReadingEnabled) setCrPanelFullyOpen(true); }}
      >
        <div style={{ width: 210, paddingTop: 4, paddingLeft: 16 }}>
          <CurrentlyReadingPanel
            books={currentlyReadingBooks}
            onBookClick={(book) => {
              setPulledBookId(book.id);
              setSelectedBookId(book.id);
            }}
          />
        </div>
      </div>

      </div>{/* end bookshelf column */}
  </div>{/* end bookshelf-row */}
    </div>
      )}

      {['timeline','genres','authors','goals'].includes(currentView) && (
        <div className={`page-root ${pageTransitioning ? 'page-exit' : 'page-enter'}`}>
          <NavPanel currentView={currentView} onNavigate={handleNavigate} />
          {currentView === 'timeline' && <StatsTimeline books={books} onBack={() => setCurrentView('bookshelf')} />}
          {currentView === 'genres' && <StatsGenres books={books} onBack={() => setCurrentView('bookshelf')} onBookClick={id => setSelectedBookId(id)} />}
          {currentView === 'authors' && <StatsAuthors books={books} onBack={() => setCurrentView('bookshelf')} onBookClick={id => setSelectedBookId(id)} />}
          {currentView === 'goals' && <StatsGoals books={books} onBack={() => setCurrentView('bookshelf')} />}
        </div>
      )}

      {/* Modals stay outside the view conditional */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          spineColor={effectiveColors[selectedBook.id] || null}
          onClose={() => {
            clearTimeout(pullTimeoutRef.current);
            setSelectedBookId(null);
            setPulledBookId(null);
          }}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onColorChange={setCustomColor}
          allGenres={allGenres}
        />
      )}
      {showAddForm && <AddBookForm onAdd={addBook} onClose={() => setShowAddForm(false)} books={books} />}
      {showSettings && (
        <SiteSettingsModal
          settings={siteSettings}
          defaultImageUrl={cherryTreeImg}
          onSave={updateSiteSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      {propPickerShelf !== null && (
        <ShelfPropPickerModal
          shelfIndex={propPickerShelf}
          currentOverride={(siteSettings.shelfPropOverrides || {})[propPickerShelf]}
          onSelect={(override) => handlePropSelect(propPickerShelf, override)}
          onClear={() => handlePropClear(propPickerShelf)}
          onClose={() => setPropPickerShelf(null)}
        />
      )}
    </>
  );
}
