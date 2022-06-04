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