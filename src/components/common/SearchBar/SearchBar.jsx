import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./SearchBar.style.css";
import { useSearchKeyword } from "../../../app/store/search";
const SearchBar = () => {
  const { searchKeyword, setSearchKeyword } = useSearchKeyword();
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchKeyword(inputValue);
    console.log(searchKeyword)
  };
  return (
    <Form className="searchbar-container" onSubmit={handleSearch}>
      <FontAwesomeIcon
        icon="fa-solid fa-magnifying-glass"
        className="glass-icon"
      />
      <Form.Control
        type="text"
        placeholder="제목으로 로그 검색"
        className=" mr-sm-2 searchbar-input"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        value={inputValue}
      />
    </Form>
  );
};

export default SearchBar;
