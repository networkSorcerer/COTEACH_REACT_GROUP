// DiaryCreatePage.jsx (일부)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useDiaryStore from '../../../app/store/diary.js'
import MoodPicker from "../../../components/mood-picker/MoodPicker.jsx";

// 구성(추가/수정 쉬움): 객체 하나 추가하면 UI 자동 반영
const moodOptions = [
    {
        key: 'very-good', label: '아주 좋음', emoji: '😀',
        colors: { cardBg: '#a7e3b3', cardBorder: '#6cc08e', text: '#083b2b', pageBg: '#f1fbf4' }
    },
    {
        key: 'good', label: '좋음', emoji: '🙂',
        colors: { cardBg: '#b7e2a3', cardBorder: '#8fc970', text: '#083b2b', pageBg: '#f5fbf0' }
    },
    {
        key: 'so-so', label: '그저그럼', emoji: '😐',
        colors: { cardBg: '#f4cc39', cardBorder: '#e9b80f', text: '#4a3b00', pageBg: '#fff8dd' }
    },
    {
        key: 'bad', label: '나쁨', emoji: '🙁',
        colors: { cardBg: '#f39862', cardBorder: '#ea7430', text: '#3e1a02', pageBg: '#fff0e8' }
    },
    {
        key: 'awful', label: '끔찍함', emoji: '😵',
        colors: { cardBg: '#ef7076', cardBorder: '#e64b52', text: '#3b0b0d', pageBg: '#ffecef' }
    },
];

export default function DiaryCreatePage() {
    const navigate = useNavigate();
    const addDiary = useDiaryStore((s) => s.addDiary);
    const [title, setTitle] = useState('');
    const [mood, setMood] = useState('good');
    const [content, setContent] = useState('');
    const [touched, setTouched] = useState(false);
    const isValid = title.trim().length > 0 && content.trim().length > 0;

    const onSubmit = (event) => {
        event.preventDefault();
        setTouched(true);
        if (!isValid) return;
        // 제출 데이터 콘솔 출력
        
        const id = addDiary({ title, mood, content });
        console.log('작성완료 데이터', { title, mood, content });
        navigate(`/diary/${id}`);
    }

    return (
        <article style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: 16,
            background: (moodOptions.find(m => m.key === mood)?.colors?.pageBg) || 'transparent',
            borderRadius: 12,
            transition: 'background-color .12s ease'
        }}>
            <h3 className="mb-3">새 감정 로그 커밋</h3>

            <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">로그 제목</label>
                    <input
                        className={`form-control ${touched && !title.trim() ? 'is-invalid' : ''}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="로그 제목을 입력하세요"
                    />
                    {touched && !title.trim() && (
                        <div className="invalid-feedback">로그 제목은 필수입니다.</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">현재 상태</label>
                    <MoodPicker value={mood} onChange={setMood} options={moodOptions} />
                </div>

                <div className="mb-3">
                    <label className="form-label">오늘의 로그</label>
                    <textarea
                        className={`form-control ${touched && !content.trim() ? 'is-invalid' : ''}`}
                        rows={8}
                        placeholder="오늘의 감정을 로그 형식으로 남겨주세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {touched && !content.trim() && (
                        <div className="invalid-feedback">로그 본문은 필수입니다.</div>
                    )}
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={!isValid}
                    >
                        커밋
                    </button>
                </div>
            </form>
        </article>
    )
}
