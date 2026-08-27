import axios from 'axios';

interface ApiErrorResponse {
    message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;

    const message = error.response?.data?.message;

    if (!message) return fallback;

    if (
        message.includes('User/Email/Duplicate') ||
        message.includes('이미 가입된 이메일') ||
        message.includes('이미 존재하는 이메일')
    ) {
        return '이 이메일은 이미 다른 로그인 방식으로 가입되어 있어요.';
    }

    return message;
}
