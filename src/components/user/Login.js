import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';

const Join = () => {
  const REQUEST_URL = BASE + USER + '/signin';
  const redirection = useNavigate();
  const { onLogin } = useContext(AuthContext);

  // 서버에 비동기 방식으로 로그인 요청(AJAX 요청)
  // 함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴합니다.
  const fetchLogin = async () => {
    // 이메일, 비밀번호 입력 태그 얻어오기
    // 화면이 렌더링된 다음에 함수가 호출될 것이 보장됨
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');

    // await는 asynch로 선언된 함수에서만 사용이 가능합니다.
    // await는 프로미스 객체가 처리될 때까지 기다립니다.
    // 프로미스 객체의 반환값을 바로 활용할 수 있도록 도와줍니다.
    // then()을 활용하는 것보다 가독성이 좋고, 쓰기도 쉽습니다.
    const res = await fetch(REQUEST_URL, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    });

    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const { token, userName, email, role } = await res.json(); // 서버에서 온 json 읽기

    // // json에 담긴 인증정보를 클라이언트에 보관
    // // 1. 로컬 스토리지 - 브라우저가 종료되어도 보관됨
    // // 2. 세션 스토리지 - 브라우저가 종료되면 사라짐
    // localStorage.setItem('ACCESS_TOKEN', token);
    // localStorage.setItem('LOGIN_USERNAME', userName);
    // localStorage.setItem('USER_ROLE', role);

    // Context API를 사용하여 로그인 상태를 업데이트 합니다.
    onLogin(token, userName, role);

    // 홈으로 리다이렉트
    redirection('/');

    // 백엔드에 dto의 변수명과 프로퍼티 명이 동일해야 함
    // fetch(REQUEST_URL, {
    //   method: 'post',
    //   headers: { 'content-type': 'application/json' },
    //   body: JSON.stringify({
    //     // 자바스크립트 객체를 제이슨 문자열화 해서 보내줄게
    //     email: $email.value,
    //     password: $password.value,
    //   }),
    // })
    //   .then((res) => {
    //     if (res.status === 400) {
    //       // 가입이 안되어 있거나, 비밀번호가 틀린 경우
    //       return res.text(); // 에러메세지는 text이기 때문에 text()를 리턴
    //     }
    //     return res.json(); // 400 에러가 아니라면 로그인 성공이기 때문에 json()을 리턴.
    //   })
    //   .then((result) => {
    //     if (typeof result === 'string') {
    //       alert(result);
    //       return; // 메서드 종료
    //     }
    //     console.log(result);
    //   });
  };

  // 로그인 요청 핸들러
  const loginHandler = (e) => {
    e.preventDefault(); // submit을 막아야 해

    // 서버에 로그인 요청 전송
    fetchLogin();
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography
            component='h1'
            variant='h5'
          >
            로그인
          </Typography>
        </Grid>
      </Grid>

      <form
        noValidate
        onSubmit={loginHandler}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='email address'
              name='email'
              autoComplete='email'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='on your password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
            >
              로그인
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Join;
