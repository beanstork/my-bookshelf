import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import cherryTreeImg from '../images/cherry-tree.jpg';

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
  law: "⚖️", palestine: "🫒", arabic: "📿", fanfiction: "✨"
};

function seededRandom(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 49311;
  return x - Math.floor(x);
}

function getBookColor(id) {
  const idx = Math.abs(parseInt(id)) % SPINE_COLORS.length;
  return SPINE_COLORS[idx];
}

function getBookWidth(pages) {
  if (!pages) return 32;
  if (pages < 150) return 22;
  if (pages < 300) return 30;
  if (pages < 500) return 38;
  if (pages < 700) return 44;
  return 52;
}

function getBookHeight(id) {
  const r = seededRandom(parseInt(id));
  return 160 + r * 40; // 160-200px
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

function BookSpine({ book, onClick, index }) {
  const color = getBookColor(book.id);
  const width = getBookWidth(book.p);
  const height = getBookHeight(book.id);
  const r = seededRandom(parseInt(book.id) + 7);
  const darkFactor = 0.7 + r * 0.3;
  
  // Create a slightly darker shade for the edge
  const darken = (hex, f) => {
    const num = parseInt(hex.slice(1), 16);
    const R = Math.floor(((num >> 16) & 255) * f);
    const G = Math.floor(((num >> 8) & 255) * f);
    const B = Math.floor((num & 255) * f);
    return `rgb(${R},${G},${B})`;
  };

  const textColor = r > 0.5 ? "#E8D5B7" : "#F5ECD7";
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

  return (
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
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2)",
        alignSelf: "flex-end",
        flexShrink: 0,
        overflow: "hidden",
        animation: `slideUp 0.4s ease ${index * 0.015}s both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 4px 12px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2)";
      }}
      title={`${book.t} — ${book.a}`}
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
  );
}

function BookModal({ book, onClose }) {
  if (!book) return null;
  
  const genres = book.g || [];
  
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(15,10,5,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20,
        animation: "fadeIn 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #2C1D12 0%, #1A120B 100%)",
          border: "1px solid #4A3728",
          borderRadius: 12, padding: 0, maxWidth: 520, width: "100%",
          maxHeight: "85vh", overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.1)",
          animation: "scaleIn 0.3s ease",
        }}
      >
        {/* Header with color bar */}
        <div style={{
          height: 6, borderRadius: "12px 12px 0 0",
          background: `linear-gradient(90deg, ${getBookColor(book.id)}, ${getBookColor(book.id)}88)`,
        }} />
        
        <div style={{ padding: "28px 32px" }}>
          {/* Title & Author */}
          <h2 style={{
            fontFamily: "'Playfair Display', 'Libre Baskerville', Georgia, serif",
            color: "#F5ECD7", fontSize: 26, fontWeight: 700, margin: 0,
            lineHeight: 1.3, letterSpacing: "-0.3px",
          }}>
            {book.t}
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
                {book.au ? "🎧 Audiobook" : `📖 ${book.bind || "Book"}`}
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

          {/* Publisher */}
          {book.pub && (
            <div style={{ marginTop: 16, color: "#5A4A3A", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>
              Published by {book.pub}
            </div>
          )}

          {/* Favourite badge */}
          {book.fav && (
            <div style={{
              marginTop: 16, background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)",
              borderRadius: 8, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 6,
              color: "#D4A843", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            }}>
              ❤️ Marked as a favourite
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddBookForm({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [pages, setPages] = useState("");
  const [isAudiobook, setIsAudiobook] = useState(false);
  const [shelf, setShelf] = useState("read");
  const [genre, setGenre] = useState("");
  const [dateRead, setDateRead] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!title || !author) return;
    const newBook = {
      id: String(Date.now()),
      t: title, a: author, r: rating, ar: 0,
      p: parseInt(pages) || 0, y: "", dr: dateRead ? dateRead.replace(/-/g, "/") : "",
      da: new Date().toISOString().slice(0,10).replace(/-/g, "/"),
      s: shelf, g: genre ? [genre] : [], sn: "", si: 0,
      au: isAudiobook, fav: false, isbn: "", pub: "", bind: isAudiobook ? "Audiobook" : "Paperback", rev: notes,
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
    }} onClick={onClose}>
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
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title..." />
          </div>
          <div>
            <label style={labelStyle}>Author *</label>
            <input style={inputStyle} value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name..." />
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
            cursor: title && author ? "pointer" : "not-allowed",
            opacity: title && author ? 1 : 0.5, transition: "opacity 0.2s",
          }}>
            Add to Bookshelf
          </button>
        </div>
      </div>
    </div>
  );
}

function Shelf({ books, onBookClick, shelfIndex }) {
  const isRight = shelfIndex % 2 === 0;
  const shapeIndex = shelfIndex % 4;

  const bookendShape = [
    { clipPath: "polygon(20% 6%, 100% 0%, 100% 100%, 0% 100%)", borderRadius: "2px 4px 4px 2px" },
    { borderRadius: "44% 44% 4px 4px" },
    { borderRadius: "4px 20px 4px 4px" },
    { clipPath: "polygon(0% 0%, 80% 12%, 100% 12%, 100% 100%, 0% 100%)", borderRadius: "4px 2px 2px 4px" },
  ][shapeIndex];

  const bookendStyle = {
    width: 26,
    height: 130,
    alignSelf: "flex-end",
    flexShrink: 0,
    background: "linear-gradient(180deg, #D4BC96 0%, #C4A882 25%, #B89A70 65%, #A88055 100%)",
    boxShadow: isRight
      ? "-4px 4px 10px rgba(0,0,0,0.38), inset 2px 0 4px rgba(255,220,180,0.2)"
      : "4px 4px 10px rgba(0,0,0,0.38), inset -2px 0 4px rgba(255,220,180,0.2)",
    ...bookendShape,
  };

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Books row */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: 3,
        padding: "0 12px", minHeight: 170,
        flexWrap: "nowrap", overflowX: "auto",
      }}>
        {!isRight && <div style={bookendStyle} />}
        {books.map((book, i) => (
          <BookSpine key={book.id} book={book} onClick={onBookClick} index={shelfIndex * 20 + i} />
        ))}
        {isRight && <div style={bookendStyle} />}
      </div>
      {/* Shelf plank */}
      <div style={{
        height: 14,
        backgroundColor: "#6B2225",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='20'%3E%3Cpath d='M0,5 Q100,3 200,6 Q250,8 300,5' stroke='rgba(255,160,100,0.12)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,12 Q80,14 160,11 Q230,9 300,12' stroke='rgba(200,60,60,0.1)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,17 Q120,15 200,18 Q270,20 300,17' stroke='rgba(255,160,100,0.08)' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 20px",
        backgroundRepeat: "repeat-x",
        borderRadius: "0 0 3px 3px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,200,180,0.2)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,200,180,0.15)" }} />
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

function StatsBar({ books }) {
  const read = books.filter(b => b.s === "read");
  const audiobooks = books.filter(b => b.au && b.s === "read");
  const printedBooks = books.filter(b => !b.au && b.s === "read");
  const totalPages = read.reduce((s, b) => s + b.p, 0);
  const rated = read.filter(b => b.r > 0);
  const avgRating = rated.length > 0 ? (rated.reduce((s, b) => s + b.r, 0) / rated.length).toFixed(1) : "—";
  const fiveStars = read.filter(b => b.r === 5).length;

  const stats = [
    { label: "Books Read", value: read.length, icon: "📚" },
    { label: "Pages", value: totalPages.toLocaleString(), icon: "📄" },
    { label: "Audiobooks", value: audiobooks.length, icon: "🎧" },
    { label: "Printed Books", value: printedBooks.length, icon: "📖", noLeftBorder: true },
    { label: "Avg Rating", value: avgRating, icon: "🌡️" },
    { label: "5-Star Reads", value: fiveStars, icon: "⭐⭐⭐⭐⭐" },
  ];

  return (
    <div style={{
      display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap",
      background: "rgba(255,255,255,0.35)", borderRadius: 12,
      border: "1px solid rgba(200,140,100,0.3)", overflow: "hidden",
      margin: "0 20px",
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: "16px 24px", textAlign: "center", flex: 1, minWidth: 100,
          borderRight: (i < stats.length - 1 && !stats[i + 1]?.noLeftBorder) ? "1px solid rgba(0,0,0,0.1)" : "none",
        }}>
          <div style={{ fontSize: s.icon.length > 2 ? 13 : 20, marginBottom: 4, lineHeight: 1.4 }}>{s.icon}</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#5C2010", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B3520", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState(RAW_BOOKS);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState("dateRead");
  const [filterShelf, setFilterShelf] = useState("read");
  const [filterGenre, setFilterGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allGenres = useMemo(() => {
    const genres = new Set();
    books.forEach(b => b.g.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  }, [books]);

  const filteredAndSorted = useMemo(() => {
    let filtered = books.filter(b => {
      if (filterShelf !== "all" && b.s !== filterShelf) return false;
      if (filterGenre !== "all" && !b.g.includes(filterGenre)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return b.t.toLowerCase().includes(q) || b.a.toLowerCase().includes(q) || b.sn.toLowerCase().includes(q);
      }
      return true;
    });

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

    // Sort within each series by series number
    Object.values(seriesMap).forEach(arr => arr.sort((a, b) => a.si - b.si));

    // Get sort key for a group (use first book's value for series)
    const getSortKey = (b) => {
      if (sortBy === "dateRead") return b.dr || b.da || "0000/00/00";
      if (sortBy === "rating") return b.r;
      if (sortBy === "title") return b.t.toLowerCase();
      if (sortBy === "author") return b.a.toLowerCase();
      if (sortBy === "pages") return b.p;
      return 0;
    };

    // For series, use the latest/highest/first value in the series for sorting
    const getSeriesSortKey = (arr) => {
      if (sortBy === "dateRead") return arr.reduce((max, b) => {
        const k = b.dr || b.da || "0000/00/00";
        return k > max ? k : max;
      }, "0000/00/00");
      if (sortBy === "rating") return Math.max(...arr.map(b => b.r));
      if (sortBy === "title") return arr[0].sn.toLowerCase();
      if (sortBy === "author") return arr[0].a.toLowerCase();
      if (sortBy === "pages") return arr.reduce((s, b) => s + b.p, 0);
      return 0;
    };

    // Build final list: interleave series and standalones
    const items = [];
    standalone.forEach(b => items.push({ type: "single", book: b, sortKey: getSortKey(b) }));
    Object.entries(seriesMap).forEach(([name, arr]) => items.push({ type: "series", books: arr, sortKey: getSeriesSortKey(arr), name }));

    items.sort((a, b) => {
      if (sortBy === "dateRead") return b.sortKey.localeCompare(a.sortKey);
      if (sortBy === "rating") return b.sortKey - a.sortKey;
      if (sortBy === "title" || sortBy === "author") return a.sortKey.localeCompare(b.sortKey);
      if (sortBy === "pages") return b.sortKey - a.sortKey;
      return 0;
    });

    // Flatten
    const result = [];
    items.forEach(item => {
      if (item.type === "single") result.push(item.book);
      else item.books.forEach(b => result.push(b));
    });

    return result;
  }, [books, sortBy, filterShelf, filterGenre, searchQuery]);

  // Split books into shelves of ~12-16 books each
  const shelves = useMemo(() => {
    const result = [];
    const booksPerShelf = 20;
    for (let i = 0; i < filteredAndSorted.length; i += booksPerShelf) {
      result.push(filteredAndSorted.slice(i, i + booksPerShelf));
    }
    return result;
  }, [filteredAndSorted]);

  const addBook = useCallback((newBook) => {
    setBooks(prev => [...prev, newBook]);
  }, []);

  const shelfCounts = useMemo(() => ({
    all: books.length,
    read: books.filter(b => b.s === "read").length,
    "currently-reading": books.filter(b => b.s === "currently-reading").length,
    "to-read": books.filter(b => b.s === "to-read").length,
    dnf: books.filter(b => b.s === "dnf").length,
  }), [books]);

  const pillStyle = (active) => ({
    padding: "6px 16px", borderRadius: 20, border: "1px solid",
    borderColor: active ? "#8B2840" : "rgba(120,50,60,0.35)",
    background: active ? "rgba(139,40,64,0.12)" : "transparent",
    color: active ? "#6B1830" : "#7A3040",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
    transition: "all 0.2s", flex: 1, textAlign: "center",
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2E8D9",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Cline x1='0' y1='10' x2='200' y2='8' stroke='rgba(160,120,70,0.07)' stroke-width='0.7'/%3E%3Cline x1='0' y1='22' x2='200' y2='24' stroke='rgba(140,100,55,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='35' x2='200' y2='33' stroke='rgba(160,120,70,0.06)' stroke-width='0.6'/%3E%3Cline x1='0' y1='48' x2='200' y2='50' stroke='rgba(140,100,55,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='62' x2='200' y2='60' stroke='rgba(160,120,70,0.07)' stroke-width='0.7'/%3E%3Cline x1='0' y1='75' x2='200' y2='77' stroke='rgba(140,100,55,0.04)' stroke-width='0.4'/%3E%3Cline x1='0' y1='88' x2='200' y2='86' stroke='rgba(160,120,70,0.06)' stroke-width='0.6'/%3E%3Cline x1='43' y1='0' x2='45' y2='100' stroke='rgba(160,120,70,0.03)' stroke-width='0.4'/%3E%3Cline x1='120' y1='0' x2='122' y2='100' stroke='rgba(140,100,55,0.03)' stroke-width='0.3'/%3E%3Cline x1='173' y1='0' x2='175' y2='100' stroke='rgba(160,120,70,0.025)' stroke-width='0.3'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { scrollbar-width: thin; scrollbar-color: #C4A882 #F2E8D9; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: #F2E8D9; }
        *::-webkit-scrollbar-thumb { background: #C4A882; border-radius: 3px; }
        input:focus, select:focus, textarea:focus { border-color: #A0445A !important; box-shadow: 0 0 0 2px rgba(160,68,90,0.15); }
        select option { background: #F2E8D9; color: #3A2515; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "36px 20px 24px", textAlign: "center",
        position: "relative", overflow: "hidden",
        borderRadius: "0 0 40px 40px",
      }}>
        {/* Cherry tree photo */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${cherryTreeImg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center 22%",
          backgroundRepeat: "no-repeat",
        }} />
        {/* Gradient overlay — lighter at top to show branches, denser at bottom for text */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(252,228,239,0.38) 0%, rgba(252,210,220,0.68) 60%, rgba(248,220,225,0.82) 100%)",
        }} />
        {/* Content sits above overlays */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5C0F1E", fontSize: 42, fontWeight: 900, margin: 0,
            letterSpacing: "-1px",
            WebkitTextStroke: "1.5px #1a0810",
            paintOrder: "stroke fill",
            textShadow: "0 2px 14px rgba(252,228,239,0.9), 0 1px 4px rgba(252,228,239,0.7)",
          }}>
            My Bookshelf
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#6B2030", fontSize: 18, margin: "8px 0 0", fontStyle: "italic",
            textShadow: "0 1px 6px rgba(252,228,239,0.95)",
          }}>
            Read, Listen, Share
          </p>
        </div>
      </div>

      {/* Stats + Controls band */}
      <div style={{
        backgroundColor: "#F5C4A0",
        marginTop: 12,
        paddingBottom: 16,
      }}>
      {/* Stats */}
      <StatsBar books={books} />

      {/* Controls */}
      <div style={{ padding: "24px 20px 8px", maxWidth: 900, margin: "0 auto" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#3d5a40", fontSize: 16 }}>🔍</span>
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
        <div style={{ display: "flex", marginBottom: 12 }}>
          {[
            { key: "read", label: "Read" },
            { key: "currently-reading", label: "Reading" },
            { key: "to-read", label: "To Read" },
            { key: "all", label: "All" },
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
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(120,70,50,0.3)",
              background: "rgba(255,255,255,0.65)", color: "#3A2010", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
            }}>
              <option value="dateRead">Date Read</option>
              <option value="rating">My Rating</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="pages">Pages</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#6B3520", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Genre</span>
            <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)} style={{
              padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(120,70,50,0.3)",
              background: "rgba(255,255,255,0.65)", color: "#3A2010", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
            }}>
              <option value="all">All Genres</option>
              {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowAddForm(true)} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "#A0445A",
            border: "none", color: "#F9EDE8", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(160,68,90,0.3)",
          }}>
            + Add Book
          </button>
        </div>
      </div>
      </div>{/* end controls band */}

      {/* Bookshelf */}
      <div style={{ padding: "20px 20px 60px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Wood frame */}
        <div style={{
          padding: 18,
          background: "linear-gradient(135deg, #8B3030 0%, #6B2225 30%, #5C1A1E 60%, #6B2225 80%, #7B2A2E 100%)",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,180,160,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)",
          border: "1px solid #8B3535",
        }}>
        {/* Back panel texture */}
        <div style={{
          backgroundColor: "#3D1215",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80'%3E%3Cpath d='M0,10 Q75,8 150,12 Q225,15 300,10' stroke='rgba(255,120,80,0.08)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,25 Q100,27 200,23 Q250,21 300,25' stroke='rgba(180,40,40,0.07)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,40 Q80,38 160,42 Q220,45 300,40' stroke='rgba(255,120,80,0.06)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,55 Q120,57 200,53 Q260,51 300,55' stroke='rgba(180,40,40,0.07)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,70 Q70,68 140,72 Q210,75 300,70' stroke='rgba(255,120,80,0.05)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 80px",
          backgroundRepeat: "repeat",
          borderRadius: 8, padding: "24px 12px 12px",
          border: "1px solid #5A1A1E",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), inset 0 -2px 10px rgba(0,0,0,0.3)",
        }}>
          {filteredAndSorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#8B7355", fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic" }}>
              No books found. Try adjusting your filters.
            </div>
          ) : (
            shelves.map((shelfBooks, i) => (
              <Shelf key={i} books={shelfBooks} onBookClick={setSelectedBook} shelfIndex={i} />
            ))
          )}
        </div>
        </div>{/* end wood frame */}

        {/* Count */}
        <div style={{ textAlign: "center", marginTop: 20, color: "#4A3020", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
          Showing {filteredAndSorted.length} book{filteredAndSorted.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Modals */}
      {selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
      {showAddForm && <AddBookForm onAdd={addBook} onClose={() => setShowAddForm(false)} />}
    </div>
  );
}
