"use client";

import axios from "axios";
import { debounce } from "lodash";
import Image from "next/image";
import React, { ChangeEvent, useState, useEffect } from "react";

interface Book {
    id: string;
    title: string;
    author: string;
    imageLink: string;
}

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Debounced function to fetch search results
    const fetchSearchResults = debounce(async (search: string) => {
        if (search) {
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`
                );
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]); // Clear results on error
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    }, 500);

    // Handle search input change
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const search = e.target.value;
        setSearchTerm(search);
        fetchSearchResults(search);
    };

    // Cleanup debounce on component unmount
    useEffect(() => {
        return () => {
            fetchSearchResults.cancel();
        };
    }, [fetchSearchResults]);

    return (
        <div className="search__background">
            <div className="search__wrapper">
                <div className="spacer"></div>
                <div className="search__content">
                    <div className="search">
                        <div className="search__input--wrapper">
                            <input
                                type="text"
                                placeholder="Search for books"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search__input"
                            />
                            <div
                                className="search__icon"
                                onClick={() => fetchSearchResults(searchTerm)} // This won't be called if searchTerm is empty
                            >
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 1024 1024"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                {searchTerm && (
                    <div className="search__books--wrapper">
                        {loading && <div className="search__loading">Loading...</div>}
                        {searchResults.map((book) => (
                            <a className="search__book--link" href={`/book/${book.id}`} key={book.id}>
                                <figure className="book__image--wrapper" style={{ height: 80, width: 80, minWidth: 80 }}>
                                    <Image
                                        className="book__image"
                                        src={book.imageLink}
                                        alt={book.title}
                                        width={100}
                                        height={100}
                                    />
                                </figure>
                                <div>
                                    <div className="search__book--title">{book.title}</div>
                                    <div className="search__book--author">{book.author}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;