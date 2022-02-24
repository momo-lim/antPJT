import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MatchListPagination from '../components/MatchListPagination';
import MatchListCheckbox from '../components/MatchListCheckbox';
import MatchListSearch from '../components/MatchListSearch';
import MatchItemModal from '../components/MatchItemModal';
import '../css/MatchList.css';

function MatchList() {
  // 원본 데이터
  const [list, setList] = useState([]);
  // 필터한 데이터
  const [filterList, setFilterList] = useState(list);
  // 검색 조건
  const [selected, setSelected] = useState('title');
  // 체크 박스
  const [checked, setChecked] = useState('');
  // 검색 버튼 클릭시 검색을 위한 데이터
  const [searchValue, setSearchValue] = useState('');

  // pagination
  // 현재 페이지
  const [currentPage, setCurrentPage] = useState(1);
  // 페이지당 포스트 개수
  const [postPerPage] = useState(10);
  // 마지막 페이지 1*10 = 10
  const indexOfLastPost = currentPage * postPerPage;
  // 첫번째 페이지 10-10 = 0
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  // 0~9까지의 필터리스트를 slice해서 새로운 배열에 담고 currentPosts에 담음(화면에 이걸 출력)
  const currentPosts = filterList.slice(indexOfFirstPost, indexOfLastPost);

  // 글 디테일 모달값
  const [open, setOpen] = useState(false);
  const [detailId, setDetailId] = useState();

  // 필터리스트에 값 변화가 있을때마다 첫번째 페이지로 보게 이동시키기
  useEffect(() => {
    setCurrentPage(1);
  }, [filterList]);

  // 페이지 버튼을 누르면 현재페이지를 해당 페이지의 값으로 변경
  const paginate = (num) => {
    setCurrentPage(num);
  };

  // 아이템 불러오기
  const getItem = () => {
    axios({
      method: 'get',
      url: '/api/match',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => {
        console.log(response);
        setList(response.data);
        setFilterList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // 최초 1번 데이터 불러오기
  useEffect(() => {
    getItem();
  }, []);

  // 검색박스에 적힌 값을 저장함으로써 검색 버튼을 눌러도 검색이 가능하다.
  const saveSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  // 체크박스 모두 체크해제 시키기
  const selectCheckbox = () => {
    const checkboxes = document.getElementsByName('check');

    checkboxes.forEach((el) => {
      const ele = el;
      ele.checked = false;
    });
  };

  // 제목내용, 작성자로 검색
  const handleSearch = () => {
    // 제목,내용 으로 검색
    console.log('실행됨?');
    if (selected === 'title' && searchValue !== '') {
      axios({
        method: 'get',
        url: `/api/match/search?Keyword=${searchValue}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then((res) => {
          console.log(res);
          setFilterList(res.data);
          selectCheckbox();
          setChecked('');
        })
        .catch((err) => console.log(err));
      // 작성자로 검색
    } else if (selected === 'writerName' && searchValue !== '') {
      axios({
        method: 'get',
        url: `/api/match/search/writer?Keyword=${searchValue}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then((res) => {
          console.log(res);
          setFilterList(res.data);
          selectCheckbox();
          setChecked('');
        })
        .catch((err) => console.log(err));

      // const { value } = event.target;
      // let result = [];

      // result = list.filter((data) => data[selected].search(value) !== -1);

      // setFilterList(result);
      // selectCheckbox();
      // setChecked('');
    } else {
      alert('검색어를 입력하세요');
    }
  };
  // 검색 엔터키 누를때
  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 검색 조건
  const handleSelect = (event) => {
    setSelected(event.target.value);
  };

  // 체크박스 하나만 선택하게 하고 무엇을 선택했는지 데이터값 저장
  const handleCheckboxFiltering = (event) => {
    const element = event;
    selectCheckbox();
    element.target.checked = true;
    setChecked(element.target.id);
  };

  const openMatchModal = (id) => {
    setDetailId(id);
    setOpen(true);
    console.log(id);
  };
  const closeMatchModal = () => {
    setOpen(false);
    getItem();
  };

  // 체크박스로 필터링
  useEffect(() => {
    if (checked === 'all') {
      setFilterList(list);
      setSearchValue('');
    } else if (checked === 'ing') {
      let result = [];
      result = list.filter((data) => data.state === false);
      setFilterList(result);
      setSearchValue('');
    } else if (checked === 'done') {
      let result = [];
      result = list.filter((data) => data.state === true);
      setFilterList(result);
      setSearchValue('');
    }
  }, [checked]);

  return (
    <div className="box">
      <div className="checkbox">
        <h2>스터디원을 모아 정보를 공유해보세요!</h2>
        <MatchListCheckbox handleCheckboxFiltering={handleCheckboxFiltering} />
      </div>
      {/* 테이블 */}
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="th">작성자</th>
            <th className="th title">제목</th>
            <th className="th">스터디명</th>
            <th className="th">모집상태</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts
            .slice(0)
            .reverse()
            .map((item) => (
              <tr
                key={item.articleId}
                className="tr"
                onClick={() => openMatchModal(item.articleId)}
              >
                <td className="td td2">
                  {/* {item.articleId} */}
                  {item.writerName}
                </td>
                <td className="td title">{item.title}</td>
                <td>{item.studyName}</td>
                {/* <td>{item.studyName}</td> */}
                {item.state === true ? (
                  <td className="td td2 statusTrue">모집완료</td>
                ) : (
                  <td className="td td2">모집중</td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      <div>
        <MatchListPagination
          postPerPage={postPerPage}
          totalPosts={filterList.length}
          paginate={paginate}
          //
          currentPage={currentPage}
        />
      </div>

      <MatchListSearch
        handleSelect={handleSelect}
        searchValue={searchValue}
        saveSearchValue={saveSearchValue}
        onKeyPress={onKeyPress}
        handleSearch={handleSearch}
      />
      {/* ------------------------ 모집글 모달 열/닫 -------------------------------- */}
      {open && (
        <MatchItemModal pk={detailId} handleClickClose={closeMatchModal} />
      )}
    </div>
  );
}

export default MatchList;
