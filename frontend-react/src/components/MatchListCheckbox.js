import React from 'react';

function MatchListCheckbox({ handleCheckboxFiltering }) {
  return (
    <div>
      {/* 체크박스 */}
      <label htmlFor="all">전체</label>
      <input
        name="check"
        id="all"
        type="checkbox"
        onClick={handleCheckboxFiltering}
      />
      <label htmlFor="ing">모집중</label>
      <input
        name="check"
        id="ing"
        type="checkbox"
        onClick={handleCheckboxFiltering}
      />
      <label htmlFor="done">모집완료</label>
      <input
        name="check"
        id="done"
        type="checkbox"
        onClick={handleCheckboxFiltering}
      />
    </div>
  );
}

export default MatchListCheckbox;
