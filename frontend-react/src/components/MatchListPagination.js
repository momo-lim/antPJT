import React from 'react';
import Pagination from 'react-js-pagination';
import '../css/MatchListPagination.css';

function Paginations({ postPerPage, totalPosts, paginate, currentPage }) {
  // const pageNumbers = [];
  // // Math.ceil 은 올림 함수
  // // 필터리스트의 길이를 페이지당 포스트 개수(10)으로 나누고 올림하면 전체 페이지 개수 구할수있음
  // // 전체 페이지 개수를 pageNumbers에 저장하고 그 값을 버튼으로 화면에 출력
  // for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i += 1) {
  //   pageNumbers.push(i);
  // }

  const asd = (event) => {
    console.log(event);
    paginate(event);
  };

  return (
    <div>
      {/* <div>
        {pageNumbers.map((num) => (
          // 매개변수 전달할때는 익명함수 작성
          <button type="button" key={num} onClick={() => paginate(num)}>
            {num}
          </button>
        ))}
      </div> */}

      <div>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={postPerPage}
          totalItemsCount={totalPosts}
          pageRangeDisplayed={5}
          onChange={asd}
        />
      </div>
    </div>
  );
}

export default Paginations;
