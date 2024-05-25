import React from "react";
import SearchIcon from "@mui/icons-material/Search";
const SearchBar = ({ keyword, setKeyword }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "5px",
        width: "70%",
        maxHeight: "30px",
      }}
    >
      <SearchIcon />
      <input
        style={{
          border: "none",
          width: "100%",
          padding: "5px",
          outline: "none",
        }}
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
