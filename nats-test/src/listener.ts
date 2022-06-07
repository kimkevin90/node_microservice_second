import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// 클라이언트 메시지 수신
// scale out 시, Client ID 랜덤 ID 제공
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});
stan.on('connect', () => {
  console.log('Listener connected to NATS')

    /*
    Group 당 하나의 이벤트만 전달 시, 수신측 서비스에서 db장애로 인해 로직을 
    처리하지 못했을 경우 이벤트 소실 위험이 있으므로 ackMode를 통해 해당 이벤트를
    처리했음을 steraming server에 전달한다.
    만일, ack 전달 안할 시, streming server는 다른 수신측 서비스에 이벤트
    재전송 한다(디폴트 대기 30초).
    */
    const options = stan
    .subscriptionOptions()
    // ack 모드 활성화
    .setManualAckMode(true)
    // 이전 모든 이벤트 조회
    .setDeliverAllAvailable()
    .setDurableName('accounting-service');


    /*
    초기 net.yaml에 설정한 hbt hbf등에 따라 클라이언트가 다운되도 일정 시간 기다려준다.
    따라서 다운된 곳으로 이벤트를 보내지 않도록 커넥션 끊어 30초 대기 하지 않도록한다.
    아래 process.on과 연동
    */
    
    stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });


  // Group 생성 시, 그룹당 한번만 메시지 수신
  const subscription = stan.subscribe('ticket:created', 
  'queue-group-name', 
  options)

  subscription.on('message', (msg: Message) => {
    console.log('Message recieved')
    const data = msg.getData();

    if(typeof data === 'string') {
      // 시퀀스 넘버는 퍼블리싱 할때 마다 증가
      console.log(`Received event #${msg.getSequence()}, with data : ${data}`)
    }

    msg.ack();
    
  })
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


// console.clear();

// const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
//   url: 'http://localhost:4222',
// });

// stan.on('connect', () => {
//   console.log('Listener connected to NATS');

//   stan.on('close', () => {
//     console.log('NATS connection closed!');
//     process.exit();
//   });

//   const options = stan
//     .subscriptionOptions()
//     .setManualAckMode(true)
//     .setDeliverAllAvailable()
//     .setDurableName('accounting-service');

//   const subscription = stan.subscribe(
//     'ticket:created',
//     'queue-group-name',
//     options
//   );

//   subscription.on('message', (msg: Message) => {
//     const data = msg.getData();

//     if (typeof data === 'string') {
//       console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
//     }

//     msg.ack();
//   });
// });

// process.on('SIGINT', () => stan.close());
// process.on('SIGTERM', () => stan.close());
