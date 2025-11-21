import React from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './GoogleLoginButton.css'

export default function GoogleLoginButton({ onSuccess, onError, text = 'Google 계정으로 로그인' }) {
  const login = useGoogleLogin({
    scope: 'openid profile email',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const user = await res.json();
        // user: { sub, name, given_name, family_name, picture, email, email_verified }
        onSuccess && onSuccess(user);
      } catch (e) {
        onError && onError(e);
      }
    },
    onError: (err) => onError && onError(err),
  })

  return (
    <button type="button" className="glogin-btn" onClick={() => login()}>
      <span className="glogin-icon" aria-hidden>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 32.91 29.229 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.961 3.039l5.657-5.657C34.869 6.053 29.702 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.814C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.156 7.961 3.039l5.657-5.657C34.869 6.053 29.702 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.229 36 24.856 32.91 24 32.91c-5.196 0-9.549-3.367-11.12-8.008l-6.54 5.036C9.611 39.556 16.223 44 24 44z"/>
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.318 3.829-5.192 6.827-11.303 6.827 0 0 .001 0 0 0 0 0 0 0 0 0 5.229 0 9.602-3.09 11.303-7.917l6.308-6.827z"/>
        </svg>
      </span>
      <span className="glogin-text">{text}</span>
    </button>
  )
}
