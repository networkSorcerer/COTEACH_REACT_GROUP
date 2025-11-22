import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import useDiaryStore from "../../../app/store/diary.js";
import EmotionModal from "../../../components/Modal/Modal.jsx";
import { Button } from "react-bootstrap";

export default function DiaryDetailPage() {
  const { id } = useParams();

  const getDiary = useDiaryStore((s) => s.getDiary);
  const updateDiary = useDiaryStore((s) => s.updateDiary);

  const diary = getDiary(id);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = React.useState(false);

  // Zustand에서 이미 저장되어 있으면 불러오고, 없다면 ""로 초기화
  const [aiResult, setAiResult] = React.useState(diary?.analysis || "");

  if (!diary) return <p>로그를 찾을 수 없습니다.</p>;

  const handleAIAnalysis = (result) => {
    setAiResult(result); // 화면에 즉시 표시
    updateDiary(id, {
      analysis: result,
      analyzedAt: new Date().toISOString(),
    }); // zustand + localStorage에 저장
    setModalShow(false);
  };

  return (
    <article
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: 16,
        background: "#fff",
        borderRadius: 12,
      }}
    >
      <h3 className="mb-3">{diary.title}</h3>
      <p>
        <strong>현재 상태:</strong> {diary.mood}
      </p>
      <p>
        <strong>타임스탬프:</strong>{" "}
        {new Date(diary.createdAt).toLocaleString()}
      </p>

      <hr />

      <p style={{ whiteSpace: "pre-wrap" }}>{diary.content}</p>

      {/* AI 분석 결과 출력 */}
      {aiResult && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "#f7f7ff",
            borderRadius: 10,
          }}
        >
          <h5>📌 AI 감정 디버깅 리포트</h5>
          <p style={{ whiteSpace: "pre-wrap" }}>{aiResult}</p>

          {/* 저장된 분석 날짜가 있다면 표시 */}
          {diary.analyzedAt && (
            <small style={{ color: "#666" }}>
              마지막 분석: {new Date(diary.analyzedAt).toLocaleString()}
            </small>
          )}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => setModalShow(true)}
        >
          ▶ AI 감정 디버깅
        </Button>
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          로그 히스토리로
        </button>
      </div>

      <EmotionModal
        diary={diary}
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={handleAIAnalysis} // zustand 적용
      />
    </article>
  );
}
