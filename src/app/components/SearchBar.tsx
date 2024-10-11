"use client";

import axios from "axios";
import { debounce } from "lodash";
import Image from "next/image";
import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import Link from 'next/link';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

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
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    }, 500);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const search = e.target.value;
        setSearchTerm(search);
        fetchSearchResults(search);
    };

    useEffect(() => {
        fetchSearchResults(searchTerm);
        return () => {
            fetchSearchResults.cancel();
        };
    }, [searchTerm]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLinkClick = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className="search__background">
            <div className="search__wrapper">
                <div className="relative">
                    <button
                        className="burger-menu md:hidden block text-gray-700 focus:outline-none mb-4"
                        onClick={toggleDropdown}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute bg-white shadow-md rounded-lg z-10 w-48">
                            <Link href="/for-you" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLinkClick}>
                                For You
                            </Link>
                            <Link href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLinkClick}>
                                My Library
                            </Link>
                            <Link href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLinkClick}>
                                Highlights
                            </Link>
                            <Link href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLinkClick}>
                                Help & Support
                            </Link>
                            <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleLinkClick}>
                                Settings
                            </Link>
                        </div>
                    )}
                </div>
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