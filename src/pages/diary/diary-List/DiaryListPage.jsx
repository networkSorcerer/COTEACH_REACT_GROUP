import { Link, useLocation } from "react-router-dom";
import { Button, Card, Form, Nav, Modal } from "react-bootstrap";
import "./DiaryListPage.style.css";
import { useEffect, useState } from "react";
import { useUserStore } from "../../../app/store/auth";
import useDiaryStore from "../../../app/store/diary";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";
import PatchDiary from "./component/PatchDiary";
import { useSearchKeyword } from "../../../app/store/search";

export default function DiaryListPage() {
  console.log("ddddd", useDiaryStore?.getState().diaries);

  const { userInfo } = useUserStore();
  const [diaries, setDiaries] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [moodFilter, setMoodFilter] = useState("all");
  const { selectedDate, setSelectedDate } = useDiaryStore();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const selectedMonth = new Date(selectedDate).getMonth() + 1;

  const [editingDiary, setEditingDiary] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const { searchKeyword } = useSearchKeyword();

  // ['#6cc08e''#8fc970' '#e9b80f''#ea7430''#e64b52']

  const moodColors = {
    "very-good": "#6cc08e",
    good: "#8fc970",
    "so-so": "#e9b80f",
    bad: "#ea7430",
    awful: "#e64b52",
  };

  useEffect(() => {
    //json-server는 REST API를 지원 -> DELETE PATCH 가능
    if (selectedMonth === 9 || selectedMonth === 10) {
      fetch("/api/emotions")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((item) => {
            const itemMonth = new Date(item.createdAt).getMonth() + 1;
            return item?.name === userInfo?.name && itemMonth === selectedMonth;
          });
          setDiaries(filtered);
          setCurrentPage(0);
        })
        .catch((err) => console.error("데이터 가져오기 실패", err));
    } else if (selectedMonth === 11) {
      const localDiaries = useDiaryStore.getState().diaries;
      setDiaries(localDiaries);
      setCurrentPage(0);
    } else {
      setDiaries([]);
    }
  }, [selectedMonth, userInfo]);
  console.log(diaries);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchKeyword, moodFilter]);

  // URL 쿼리 (?month=YYYY-MM, ?mood=...)로 초기 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const monthStr = params.get("month");
    const mood = params.get("mood");
    if (monthStr) {
      const [yy, mm] = monthStr.split("-").map(Number);
      if (yy && mm) {
        const firstDay = new Date(yy, mm - 1, 1);
        setSelectedDate(firstDay);
      }
    }
    if (mood) {
      setMoodFilter(mood);
    }
    setCurrentPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const keywordFilteredDiaries = diaries.filter((d) => {
    if (!searchKeyword) return true;
    return d.title.includes(searchKeyword);
  });

  // 감정 필터링 -> return filteredDiaries
  const filteredDiaries = keywordFilteredDiaries.filter((d) => {
    if (moodFilter === "all") return true;
    return d.mood === moodFilter;
  });

  //filteredDiaries -> 정렬 -> return sortedDiaries
  const sortedDiaries = [...filteredDiaries].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === "latest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  //필터링 -> 정렬 vs 정렬 -> 필터링 : 결과는 비슷할 수 있으나 데이터가 많을 수록 전자의 효율이 올라간다.
  //10만 개 전체를 정렬 (O(n log n) → 약 10만 × log(10만)) -> 결과에서 조건에 맞는 것만 필터링 (O(n))

  //10만 개 중 조건에 맞는 것만 필터링 (O(n)) -> - 필터링된 결과만 정렬 (O(m log m), 여기서 m은 필터링 후 남은 데이터 개수)

  //m = n 이라면 속도가 같지만 두 값이 같을 확률은 적다. m은 5개의 감정을 중 특정 감정을 필터링한 결과라서

  //현재 페이지의 시작점
  const offset = currentPage * itemsPerPage;
  const currentDiaries = sortedDiaries.slice(offset, offset + itemsPerPage);
  //전체 페이지 수
  const pageCount = Math.ceil(sortedDiaries.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 삭제 버튼

  const handleDelete = async (id) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return; // 취소하면 아무 동작 안 함

    console.log("delete", id);
    if (selectedMonth === 10 || selectedMonth === 9) {
      console.log("10월");
      try {
        await fetch(`/api/emotions/${id}`, {
          method: "DELETE",
        });
        setDiaries((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        console.error("삭제 실패", err);
      }
    }

    if (selectedMonth === 11) {
      console.log("11월");
      useDiaryStore.setState((state) => ({
        diaries: state.diaries.filter((d) => d.id !== id),
      }));
      setDiaries((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // 수정 버튼
  const handlePatch = (id) => {
    console.log("patch", id);
    const target = diaries.find((d) => d.id === id);
    setEditingDiary(target);
    setIsShowModal(true);
    console.log("10월");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">{selectedMonth}월 Logs</h3>
        {userInfo ? (
          <Button as={Link} to="/diary/new">
            New
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => alert("로그인 후 작성할 수 있어요 🙂")}
            title="로그인 필요"
          >
            New
          </Button>
        )}
      </div>

      <div className="d-grid">
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-2">
            <Form.Select
              style={{ width: "100%", borderRadius: "8px" }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mb-3"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </Form.Select>
            <Form.Select
              style={{ width: "100%", borderRadius: "8px" }}
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="mb-3"
            >
              <option value="all">전부</option>
              <option value="very-good">매우 좋음</option>
              <option value="good">좋음</option>
              <option value="so-so">그저그럼</option>
              <option value="bad">나쁨</option>
              <option value="awful">매우나쁨</option>
            </Form.Select>
          </div>
          <Nav className="mb-3 mb-lg-0">
            <DatePicker
              dateFormat="yyyy년 MM월"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="form-control text-center"
              showMonthYearPicker
            />
          </Nav>
        </div>

        {!userInfo ? (
          <Card className="diaryList-card">
            <Card.Body>
              <Card.Title className="p-2 m-0">로그인을 해주세요~</Card.Title>
            </Card.Body>
          </Card>
        ) : diaries.length === 0 ? (
          <Card className="diaryList-card">
            <Card.Body>
              <Card.Title className="p-2 m-0">데이터가 없습니다.</Card.Title>
            </Card.Body>
          </Card>
        ) : (
          currentDiaries.map((d, idx) => (
            <Card key={d.id} className="diaryList-card mb-3" data-mood={d.mood}>
              <Card.Body as={Link} to={`/diary/${d.id}`}>
                <Card.Title>{d.title}</Card.Title>
                <Card.Text className="diaryList-excerpt">
                  {d.content.slice(0, 80)}...
                </Card.Text>
                <div className="d-flex justify-content-start gap-3">
                  <Card.Text
                    style={{
                      backgroundColor: `${moodColors[d.mood]}`,
                      color: "white",
                    }}
                    className="moodTextBox"
                  >
                    {d.mood}
                  </Card.Text>
                  <Card.Text className="dateTextBox">
                    {new Date(d.createdAt).toLocaleDateString("ko-KR")}
                  </Card.Text>
                </div>
              </Card.Body>
              <div
                className="px-3 pb-3 d-flex justify-content-between align-items-center"
                style={{ boxSizing: "border-box" }}
              >
                <div className="fs-4">{offset + idx + 1}</div>
                <div>
                  <button
                    className="mx-1 pathBtn"
                    onClick={() => handlePatch(d.id)}
                  >
                    수정
                  </button>
                  <button
                    className="mx-1 deleteBtn"
                    onClick={() => handleDelete(d.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}

        {userInfo && pageCount > 1 && (
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            breakLabel={"…"}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"diaryList-pagination"}
            pageClassName={"diaryList-page"}
            pageLinkClassName={"diaryList-link"}
            previousClassName={"diaryList-prev"}
            previousLinkClassName={"diaryList-link"}
            nextClassName={"diaryList-next"}
            nextLinkClassName={"diaryList-link"}
            breakClassName={"diaryList-break"}
            breakLinkClassName={"diaryList-link"}
            activeClassName={"is-active"}
            disabledClassName={"is-disabled"}
            forcePage={currentPage}
          />
        )}
      </div>

      {/* 모달 */}
      {editingDiary && (
        <Modal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <PatchDiary
            diary={editingDiary}
            setDiaries={setDiaries}
            onClose={() => setIsShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
}
