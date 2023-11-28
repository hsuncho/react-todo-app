// 로그인한 유저의 데이터 객체를 반환하는 함수
export const getLoginUserInfo = () => {
  return {
    token: localStorage.getItem('ACCESS_TOKEN'),
    userName: localStorage.getItem('LOGIN_USERNAME'),
    role: localStorage.getItem('USER_ROLE'),
  };
};

// 로그인 여부를 확인하는 함수
// const isLogin = () => {
//   const token = localStorage.getItem('ACCESS_TOKEN');
//   if (token === null) return false;
//   return true;
// };

// 특정 값이나 메서드의 리턴값을 논리 타입으로 변환하고자 할 때 !!을 붙입니다.
// localStorage.getItem의 결과를 논리타입으로 리턴 -> 값이 있으면 true, null이면 false로 리턴
export const isLogin = () => !!localStorage.getItem('ACCESS_TOKEN');
// 로그인을 안 한 사람은 null이 오지만 한 사람은 데이터가 올 것
// 앞에 느낌표 -> not의 의미(반전 연산자이기 때문에 논리값이 뒤바뀜)
// !! -> 논리값으로 표현할 수 있음(자바스크립트에서만 가능)
