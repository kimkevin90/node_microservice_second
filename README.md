# 1. GCP 연동할 경우

## 1) 쿠버네티스 엔진 생성

## 2) kubectl context 변경

- (1) google sdk 설치
- (2) gcloud auth login - 연동
- (3) gcloud init
- (4) gcloud container clusters get-credentials 쿠버프로젝트명
  - docker desktop에서 context 변경 확인가능

## 3) Cloud Build API

- (1) skaffold & deploy yaml 업데이트
- (2) Ingress-nginx 및 GCE-GKE 설치 (https://kubernetes.github.io/ingress-nginx/deploy/)
- (3) Ingress 설치 시, 로드밸런서 자동 생성되며 /etc/hosts에 해당 로드밸런서 IP 주소 반영
- (4) skaffold dev 실행 시 Cloud Build 확인 가능

# 2. DB 연동

## 1) DB Deployment & Service 생성

- auth-mongo-depl.yaml 생성
- mongodb://auth-mongo-srv:27017/auth(컬렉션명) 접속

# 3. 마이크로 서비스 인증 전략

## 1) sync 전략의 경우, auth service와 타 서비스가 의존성을 가지므로 auth service 다운 시 전체 서비스에 영향 미침

## 2) 타 서비스가 auth sevice에 종속되지않도록 각 서비스에서 JWT & Cookie를 확인 후 인증 유무 확인

### 2-1) 단점:

- 서비스 마다 해당 인증 로직을 가지고 있어한다.
- auth service에서 변경사항이 있을 경우 해당 토큰은 기존의 토큰임으로 업데이트 사항을 확인할 수 없다.(ex) 해당 유저가 ban 당하는 경우)

### 2-2) 해결방법:

- 토큰 만기 설정 후, auth service에 리프레쉬 요청
- 인증에 관해 바로 업데이트 해야할 경우 auth service 이벤트 emit 후, 버스에서 요청 수령

## 3) JWT_SECRET_KEY POD 공유할 수 있도록 환경 변수 적용
- kubectl create secret generic jwt-secret --from-literal=jwt=jwtsecretkey
- Deployment manifest file에 env 적용

## 4) cookie-session 사용 후, cookie에 JWT 토큰 적용
- next.js 초기 랜더링을 위해 authorization & body token 사용 배제

# 4. 테스팅
- 서비스 단위로 테스팅 진행 (단위, route, DB 포함) ~ 타 서비스까지 포함하는
테스트는 현실적으로 매우 복잡함
- jest & inMemoryMongoServer 사용

# 5. common 모듈 분리
- 미들웨어 & 에러처리 common 모듈로 분리
- npm update common모듈명 --save
- k exec -it POD명 sh ~ 패키지 확인

# 6. ticket 서비스 생성
- ticket 서비스 deploy & Service 생성
- ticket 서비스 mongo db 생성 및 URI 환경 변수 적용
- ticket 생성 & 조회 test / api 생성
- ticket 업데이트 test / api 생성
- ingress-controller ticket path 등록

# 6. Event Bus 생성
- Nats Streaming Server 사용

## 1) Publisher 생성
- Publisher 포트포워딩 설정
k port-forward nats-depl-5d675c99c4-t2g8h 4222(로컬에서 접속하는 PORT):4222(POD에 진입하는 PORT)

## 2) 이벤트 리스너 다운 시
- 이벤트 리스너가 이벤트 수신 후 처리를 하지못하고 다운 될 경우를 대비해 이벤트 처리완료 후 ack 반환을 통해 streaming sever에게 이벤트 처리 완료 됐음을 알림
- 디폴트로 이벤트 리스너가 다운되도 헬스체크를 통해 일정 시간 대기한다. 이로인해 다음 이벤트가 다운된 리스터로 갈 수 있기 때문에, 이벤트 수신 후 커넥션을 닫는다.

## 3) 동시성 문제

### 3-1) 케이스 (비동기 연결로 인한 문제 발생)
- 첫번째 이벤트 처리 실패 및 30초간 대기로 인해 2번, 3번 이벤트의 처리에 영향
- 첫번째 이벤트 처리가 가장 중요한데 2번, 3번째 이벤트 처리가 1번 이벤트보다 빠를 경우

### 3-2) 해결방법
- 결국은 비동기 이벤트 발생으로 인한 문제 해결은 이벤트 emit 하는 서비스에서 이벤트에 대한 명세를 해야한다.
- 예를들어 이벤트 emit 시 이벤트에 대한 시퀀스 정보도 같이 전달
