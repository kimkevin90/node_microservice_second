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
-kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml
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
- 변경(update) 이벤트 병렬로 emit 시, 버전 정보를 +1 해서 제공하여 처리하는 곳에서 버전 순서에 따라 처리한다.

# 7. Ticket & Order Service 생성
### ticket:created & ticket:update 이벤트 발생 시
- order sevice는 위 이벤트를 리스닝 후 order service의 ticket 테이블에 데이터 저장

### order:created 이벤트 발생 시
- 해당 티켓에 대한 수정은 불가
- ticket service에 새로운 order:created 이벤트 전달하고 orderId 저장
- ticket service는 orderId 저장 후 update version 동기화를 위해 티켓 ticket:update 이벤트 emit 
- expiration service에 order:created 이벤트 전달

### order:cancelled 이벤트 발생 시
- 해당 티켓 수정 가능
- ticket service에 새로운 order:cancelled 이벤트 전달하고 orderId undefined 저장
- ticket service는 update version 동기화를 위해 티켓 ticket:update 이벤트 emit
- order 취소시 payment service에서는 이를 reject

### 기타
- ticket 서비스의 모델을 order sevice에 특정 프로퍼티만 복제하는 이유는 order service와 ticket service의 종속성을 분리시킨다.

# 8. Expiration Service 생성
- order:created 이벤트 리스닝 후 15분 대기 후 expirationcomplete 이벤트 emit

### Order Expiration time 측정
- setTimeOut은 메모리에 저장되므로 서비스 다운 시 데이터 손실 발생
- 스케쥴링 지원하는 event bus를 통해 15분 후 메세지 전송
- bull js의 스케쥴링 이용해 알림을 redis에 저장 후 bull js에서 15분후 만료 이벤트 emit

### Bull js 사용
- queue 생성 후 job(orderId) 및 deley를 포함하여 deley 후에 redis에 전달
- 만기 시간 지난 후 expiration:complete 이벤트 emit
- order service는 expiration:complete 리스닝 후 , order:cancelled 이벤트 emit

# 9. Payment Service 생성
- Order serviced와 종속성 분리를 위해 order 모델 생성 후 일부 데이터 저장
### order:created 이벤트 수신 시
- order 정보 중 payment service에 필요한 일부 정보 저장

### order:cancelled 이벤트 수신 시
- 순차적으로 처리를 위해 verseion -1 조회 후 status 업데이트

### charge:created 이벤트 발생 시
- order service에서 이벤트 리스닝 후 order status complete으로 어데이트


### 기타
- k create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test (stripe 시크릿 저장)