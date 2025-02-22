import React, { useState, useEffect } from "react";
import Logo from "../../public/assets/img/logo.png";
import "remixicon/fonts/remixicon.css";
import { NavLink, Link } from "react-router";
import { useFetchMovies } from "../hooks/useFetchMovies";

const Header = () => {
  const imgUrl = import.meta.env.VITE_BASE_IMG_URL;
  const [openNavbarList, setOpenNavbarList] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFieldSearch, setIsFieldSearch] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [downBgWhite, setDownBgWhite] = useState(false);
  const [query, setQuery] = useState("");
  const { movies, fallback_image_url, isLoading, error } = useFetchMovies(
    "searchMulti",
    query
  );

  useEffect(() => {
    // untuk bug agar ketika md state nya jadi false lagi
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenNavbarList(false);
      }
    };

    // untuk scroll
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // jika scroll ke bawah sejauh 200px
      if (currentScrollPos > 200) {
        if (currentScrollPos < prevScrollPos) {
          // jika scroll ke atas, tampilkan navbar
          setIsScrolled(false);
        } else {
          // jika scroll ke bawah, sembunyikan navbar
          setIsScrolled(true);
          setDownBgWhite(true);
        }
      } else {
        setIsScrolled(false);
        setDownBgWhite(false);
      }

      setPrevScrollPos(currentScrollPos);
    };

    // event listener
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const showList = openNavbarList ? "block" : "hidden";
  const hiddenNav = isScrolled ? "hidden" : "block";
  const bgWhite =
    downBgWhite || openNavbarList ? "bg-white text-black" : "text-white";

  return (
    <header className={`w-full fixed z-50`}>
      <nav
        className={`px-7 py-5 flex flex-col gap-7 md:items-center md:justify-between md:flex-row md:px-20 ${hiddenNav} ${bgWhite}`}
      >
        {/* logo */}
        <div className="flex items-center justify-between">
          <Link to="/" className="logo">
            <h1 className="md:hidden text-2xl">T-Film</h1>
            <img src={Logo} alt="logo" className="w-1/6 hidden md:block" />
          </Link>
          <button
            className="md:hidden ms-auto me-5"
            onClick={() => setIsFieldSearch(true)}
          >
            <i className="ri-search-line text-2xl"></i>
          </button>
          <button
            className="hamburger-menu md:hidden"
            onClick={() => setOpenNavbarList(!openNavbarList)}
            aria-label="Toggle navigation menu"
          >
            <i className="ri-menu-line text-3xl"></i>
          </button>
        </div>
        {/* logo end */}
        {/* list */}
        <div className={`navbar-list ${showList} md:block`}>
          <ul className="flex flex-col gap-3 md:gap-14 md:flex-row">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-red-500" : "hover:text-red-500"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  isActive ? "text-red-500" : "hover:text-red-500"
                }
              >
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/series"
                className={({ isActive }) =>
                  isActive ? "text-red-500" : "hover:text-red-500"
                }
              >
                TV Series
              </NavLink>
            </li>
            <li onClick={() => setIsFieldSearch(true)}>
              <i className="ri-search-line cursor-pointer hover:text-red-500 md:block hidden"></i>
            </li>
          </ul>
        </div>
        {/* list end */}
      </nav>

      {/* search */}
      {isFieldSearch && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-95 flex justify-center items-center z-50">
          <div className="w-full max-w-2xl px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies or series..."
                className="w-full px-6 py-4 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                onClick={() => setIsFieldSearch(false)}
              >
                <i className="ri-close-line text-3xl"></i>
              </button>
            </div>

            {isLoading && (
              <div className="text-center my-8 text-white">Loading...</div>
            )}

            {error && (
              <div className="text-center my-8 text-red-500">
                Error fetching data: {error}
              </div>
            )}

            {/* tampilkan hasil pencarian */}
            {!isLoading && !error && query && (
              <div className="mt-6 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg p-4">
                {movies.length > 0 ? (
                  movies.map((item) => (
                    <Link
                      key={item.id}
                      to={`/${
                        item.media_type === "movie" ? "movies" : "series"
                      }/${item.id}`}
                      className="block p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsFieldSearch(false)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.poster_path
                              ? `${imgUrl}${item.poster_path}`
                              : `${fallback_image_url}`
                          }
                          alt={item.title || item.name}
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold">
                            {item.title || item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.media_type === "movie"
                              ? "Movie"
                              : "TV Series"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No results found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
