// DiaryCreatePage.jsx (일부)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDiaryStore from "../../../../app/store/diary.js";
import MoodPicker from "../../../../components/mood-picker/MoodPicker.jsx";
import "./PatchDiary.style.css";

// 구성(추가/수정 쉬움): 객체 하나 추가하면 UI 자동 반영
const moodOptions = [
  {
    key: "very-good",
    label: "아주 좋음",
    emoji: "😀",
    colors: {
      cardBg: "#a7e3b3",
      cardBorder: "#6cc08e",
      text: "#083b2b",
      pageBg: "#f1fbf4",
    },
  },
  {
    key: "good",
    label: "좋음",
    emoji: "🙂",
    colors: {
      cardBg: "#b7e2a3",
      cardBorder: "#8fc970",
      text: "#083b2b",
      pageBg: "#f5fbf0",
    },
  },
  {
    key: "so-so",
    label: "그저그럼",
    emoji: "😐",
    colors: {
      cardBg: "#f4cc39",
      cardBorder: "#e9b80f",
      text: "#4a3b00",
      pageBg: "#fff8dd",
    },
  },
  {
    key: "bad",
    label: "나쁨",
    emoji: "🙁",
    colors: {
      cardBg: "#f39862",
      cardBorder: "#ea7430",
      text: "#3e1a02",
      pageBg: "#fff0e8",
    },
  },
  {
    key: "awful",
    label: "끔찍함",
    emoji: "😵",
    colors: {
      cardBg: "#ef7076",
      cardBorder: "#e64b52",
      text: "#3b0b0d",
      pageBg: "#ffecef",
    },
  },
];

export default function PatchDiary({ diary, onClose, setDiaries }) {
  const navigate = useNavigate();
  const updateDiary = useDiaryStore((s) => s.updateDiary);
  const [title, setTitle] = useState(diary.title);
  const [mood, setMood] = useState(diary.mood);
  const [content, setContent] = useState(diary.content);
  const [touched, setTouched] = useState(false);
  const isValid = title.trim().length > 0 && content.trim().length > 0;
  const diaryMonth = new Date(diary.createdAt).getMonth() + 1;

  const updateJsonDiary = async (id, payload) => {
    try {
      const res = await fetch(`/api/emotions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("수정 실패");
      const updatedDiary = await res.json();

      setDiaries((prev) => prev.map((d) => (d.id === id ? updatedDiary : d)));
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    onClose();
    if (!isValid) return;
    // 제출 데이터 콘솔 출력

    if (diaryMonth === 11) {
      updateDiary(diary?.id, { title, mood, content });
      navigate(`/diary/${diary?.id}`);
    } else {
      updateJsonDiary(diary?.id, { title, mood, content })
    }
  };

  return (
    <article
      style={{
        maxWidth: 720,
        margin: "",
        padding: 12,
        background:
          moodOptions.find((m) => m.key === mood)?.colors?.pageBg ||
          "transparent",
        borderRadius: 12,
        transition: "background-color .12s ease",
      }}
    >
      <h3 className="mb-3">일기 수정</h3>

      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">제목</label>
          <input
            className={`form-control ${
              touched && !title.trim() ? "is-invalid" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          {touched && !title.trim() && (
            <div className="invalid-feedback">제목은 필수입니다.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">오늘의 감정</label>
          <MoodPicker value={mood} onChange={setMood} options={moodOptions} />
        </div>

        <div className="mb-3">
          <label className="form-label">오늘의 일기</label>
          <textarea
            className={`form-control ${
              touched && !content.trim() ? "is-invalid" : ""
            }`}
            rows={8}
            placeholder="오늘의 생각과 감정을 기록해 보세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {touched && !content.trim() && (
            <div className="invalid-feedback">일기 내용은 필수입니다.</div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            취소하기
          </button>
          <button type="submit" className="btn btn-success" disabled={!isValid}>
            수정완료
          </button>
        </div>
      </form>
    </article>
  );
}

//<PatchDiary diary={{ id: "temp", title: "임시 제목", mood: "good", content: "임시 내용" }} /> 임시 데이터
