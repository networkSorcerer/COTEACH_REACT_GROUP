import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../app/store/auth";
import useDiaryStore from "../../app/store/diary";
import "./MyPage.style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAdvice } from "../../hooks/useAdvice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);
// MyPage
export default function MyPage() {
  const fileRef = useRef(null); // 파일 선택 input ref
  const navigate = useNavigate();
  const { userInfo } = useUserStore(); // userInfo
  const diaries = useDiaryStore((s) => s.diaries); // diaries

  const [avatar, setAvatar] = useState(""); // avatar
  const {
    data: advice,
    isLoading: adviceLoading,
    error: adviceError,
    refetch: refetchAdvice,
  } = useAdvice();
  const [monthDate, setMonthDate] = useState(() => new Date());

  // load saved avatar (local only)
  useEffect(() => {
    const saved = localStorage.getItem("my_avatar"); // 로컬스토리지에서 my_avatar 가져오기
    if (saved) setAvatar(saved); // 가져온 값이 있다면 avatar로 설정
  }, []);

  const onPickImage = () => fileRef.current?.click(); // 파일 선택 input 클릭

  // 파일 선택 input 변경 이벤트 핸들러
  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0]; // 파일 선택 input에서 선택된 파일
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || ""); // 파일을 data URL로 변환
      setAvatar(dataUrl); // avatar로 설정
      localStorage.setItem("my_avatar", dataUrl); // 로컬스토리지에 my_avatar 저장
    };
    reader.readAsDataURL(f); // 파일을 data URL로 변환
  };

  // 선택한 월의 다이어리만 집계
  const moodSummary = useMemo(() => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const counts = { "very-good": 0, good: 0, "so-so": 0, bad: 0, awful: 0 }; // 각 감정 카운트
    diaries.forEach((d) => {
      const dt = new Date(d.createdAt);
      if (dt.getFullYear() === y && dt.getMonth() === m) {
        if (counts[d.mood] !== undefined) counts[d.mood] += 1;
      }
    });
    const entries = Object.entries(counts); // counts 객체의 entries
    const max = Math.max(1, ...entries.map(([, v]) => v)); // 가장 큰 카운트
    return { counts, max, entries }; // counts, max, entries 반환
  }, [diaries, monthDate]);

  const displayName = userInfo?.name || "Guest"; // displayName
  const displayEmail = userInfo?.email || "-"; // displayEmail
  const displayPhoto = avatar || userInfo?.picture || ""; // displayPhoto

  // 오늘의 명언: React Query로 관리

  return (
    <div className="my-wrap">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">My Page</h3>
        <Button as={Link} to="/" variant="outline-primary">
          홈으로
        </Button>
      </div>

      <Card className="p-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="my-avatar">
            {displayPhoto ? (
              <img src={displayPhoto} alt="avatar" />
            ) : (
              <div className="my-avatar-placeholder">+</div>
            )}
            <button
              className="my-avatar-add"
              onClick={onPickImage}
              title="사진 선택"
            >
              <FontAwesomeIcon icon="fa-solid fa-pen" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onFileChange}
            />
          </div>
          <div>
            <div className="fw-bold fs-5">{displayName}</div>
            <div className="text-muted">{displayEmail}</div>
          </div>
        </div>
      </Card>

      <Card className="p-3 mb-3">
        <h5 className="mb-2">오늘의 명언</h5>
        {adviceLoading ? (
          <div className="text-muted">불러오는 중…</div>
        ) : adviceError ? (
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-muted">{adviceError}</span>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => {
                setAdviceError("");
                setAdviceLoading(true);
                fetch("https://korean-advice-open-api.vercel.app/api/advice", {
                  cache: "no-store",
                })
                  .then((r) => r.json())
                  .then((data) => {
                    const text =
                      data?.advice ||
                      data?.message ||
                      data?.text ||
                      data?.quote ||
                      "";
                    const author = data?.author || data?.by || "";
                    setAdvice({ text, author });
                  })
                  .catch(() => setAdviceError("명언을 불러오지 못했습니다."))
                  .finally(() => setAdviceLoading(false));
              }}
            >
              재시도
            </Button>
          </div>
        ) : (
          <blockquote className="my-quote">
            <p>“{advice.text || "오늘도 스스로를 믿고 한 걸음 나아가요."}”</p>
            {advice.author && <footer>— {advice.author}</footer>}
          </blockquote>
        )}
      </Card>

      <Card className="p-3">
        <div className="d-flex gap-4 mb-2 flex-column flex-md-row">
          <h5 className="m-0">내 일기 요약</h5>
          <DatePicker
            selected={monthDate}
            onChange={(d) => d && setMonthDate(d)}
            dateFormat="yyyy년 MM월"
            showMonthYearPicker
            className="form-control"
          />
        </div>
        <div className="my-graph">
          <svg viewBox="0 0 320 140" className="w-100">
            {moodSummary.entries.map(([mood, value], idx) => {
              const x = 20 + idx * 60;
              const height = (value / moodSummary.max) * 100;
              const y = 120 - height;
              return (
                <g
                  key={mood}
                  className="bar-group"
                  onClick={() => {
                    const ym = `${monthDate.getFullYear()}-${String(
                      monthDate.getMonth() + 1
                    ).padStart(2, "0")}`;
                    navigate(`/?month=${ym}&mood=${mood}`);
                  }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={40}
                    height={height}
                    rx={8}
                    className={`bar bar-${mood}`}
                  />
                  <text
                    x={x + 20}
                    y={130}
                    textAnchor="middle"
                    className="label"
                  >
                    {mood}
                  </text>
                  <text
                    x={x + 20}
                    y={y - 6}
                    textAnchor="middle"
                    className="value"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>
    </div>
  );
}
