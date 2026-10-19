# API 설계

다음 기능에 대한 API를 설계해주세요.

## 설계 포함 사항

1. **엔드포인트** - HTTP 메서드 + 경로
2. **Request DTO** - 요청 데이터 구조
3. **Response DTO** - 응답 데이터 구조
4. **에러 응답** - 가능한 에러 케이스

## 예시

```bash
POST /api/users
Request:
{
  "email": "user@example.com",
  "name": "John"
}

Response (201):
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John",
  "createdAt": "2025-01-01T00:00:00Z"
}

Error (400):
{
  "statusCode": 400,
  "message": "Email already exists"
}
```

## 원칙

- RESTful 설계
- 명확한 HTTP 상태코드 사용
- 일관된 응답 형식
