# 동현 파이터즈 · 온라인 실시간판

정상 작동을 사용자가 확인한 v11의 WebSocket 서버와 게임 화면을 같은 서비스로 배포합니다. Sites HTTP 폴링판을 배포하는 구성이 아닙니다.

- 실행: Node 24 / `node server/realtime.mjs`
- 공개 HTTP 주소와 같은 호스트의 `/api/live`로 WebSocket 연결
- 자동 제공되는 PORT 사용, 0.0.0.0 바인딩
- 경기 서버 한 인스턴스, 60Hz 전투 계산, 30Hz 상태 전송
- 무료 인스턴스 설정, 유료 디스크·유료 DB·추가 서비스 미생성
- 실제 생성/게시 전 Render 연결과 소스 전달 경로를 확인해야 합니다. 이 파일을 준비했다고 배포된 것은 아닙니다.
- 무료 인스턴스는 휴면·재시작 시 방과 참가 정보를 잃을 수 있습니다. 현재 SQLite는 게임 진행용 임시 상태이며 외부 영구 DB를 사용하지 않습니다. 기존 실행 데이터·방 토큰은 포함하지 않았습니다.
- HTTP /health 및 실제 WebSocket 연결로 배포 완료 후 검증해야 합니다. 프런트엔드 첫 화면만 열린 것으로 멀티모드 배포 성공을 판단하지 않습니다.

https://render.com/docs/websocket
https://render.com/docs/free
https://render.com/docs/blueprint-spec
