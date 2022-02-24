import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

import '../css/MatchListSearch.css';

function MatchListSearch({
  handleSelect,
  searchValue,
  saveSearchValue,
  onKeyPress,
  handleSearch,
}) {
  // const handlebutton = () => {
  //   console.log(searchValue);
  // };
  return (
    <div className="div">
      {/* 검색 조건 select */}
      <select onChange={handleSelect} className="select">
        <option value="title">제목,내용</option>
        <option value="writerName">작성자</option>
      </select>
      <input
        className="input"
        type="text"
        value={searchValue}
        onChange={saveSearchValue}
        onKeyPress={onKeyPress}
      />

      <button
        type="button"
        value={searchValue}
        onClick={handleSearch}
        className="button"
      >
        <SearchIcon style={{ cursor: 'pointer' }} />
      </button>
    </div>
  );
}

export default MatchListSearch;
