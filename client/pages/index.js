import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>로그인 완료</h1> : <h1>로그인 필요</h1>;
};

// 초기 렌더링시 요청
LandingPage.getInitialProps = async (context) => {
  console.log('LANDING PAGE!');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
