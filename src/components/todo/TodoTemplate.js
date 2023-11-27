import React, { useEffect, useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';

import { API_BASE_URL as BASE, TODO } from '../../config/host-config';

const TodoTemplate = () => {
  // 서버에 할 일 목록(json)을 요청(fetch)해서 받아와야 함.
  // const API_BASE_URL = 'http://localhost:8182/api/todos'; // 요청 변수화
  const API_BASE_URL = BASE + TODO;

  // todos 배열을 상태 관리
  const [todos, setTodos] = useState([]); // 나중에 fetch를 이용해서 백엔드에 요청 보내야 해

  // id값 시퀀스 함수 (DB 연동시키면 필요 없게 됨)
  const makeNewId = () => {
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1; // 맨 마지막 할일 객체의 id보다 하나 크게
  };

  /*
    todoInput에게 todoText를 받아오는 함수
    자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는
    일반적인 props 사용이 불가능.
    부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달
    자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달
  */

  const addTodo = (todoText) => {
    const newTodo = {
      title: todoText,
    };

    // todos.push(newTodo); (x) -> useState 변수는 setter로 변경
    // setTodos(newTodo); (x)
    // react의 상태변수는 불변선(immutable)을 가지기 때문에
    // 기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경해야 한다.

    // useState로 관리되는 상태변수는 불변성을 가지므로 객체 전체를 갈아끼워야 해

    // setTodos((oldTodos) => {
    //   return [...oldTodos, newTodo];
    // });

    fetch(API_BASE_URL, {
      // 요청 정보를 객체로 표현
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newTodo), // JSON 형태로 바꾸어서 보내야 해
    })
      .then((res) => res.json())
      .then((json) => {
        setTodos(json.todos);
      });
  };

  // 할 일 삭제 처리 함수
  const removeTodo = (id) => {
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴
    // setTodos(todos.filter((todo) => todo.id !== id));

    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json)
      .then((json) => setTodos(json.todos));
  };

  // filter: 조건과 일치하는 객체만 받음
  // map: 모든 할 일을 전부 다 받아야 해

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {
    fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        done: !done,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => setTodos(json.todos));

    // const copyTodos = [...todos];
    // for (let cTodo of copyTodos) {
    //   if (cTodo.id === id) {
    //     cTodo.done = !cTodo.done;
    //   }
    // }
    // setTodos(copyTodos);

    // setTodos(
    //   todos.map(
    //     (
    //       todo // todos라는 상태배열을 map으로 돌리고 있고 todo라는 할 일 객체가 하나씩 오고 있음
    //     ) => (todo.id === id ? { ...todo, done: !todo.done } : todo) // 삼항연산식: 매개값으로 온 할 일 객체의 아이디와 아이디와 일치하니?
    //   )
    // );
  };

  // 체크가 안된 할 일의 개수 카운트하기
  const countRestTodo = () => todos.filter((todo) => !todo.done).length;

  useEffect(() => {
    // 페이지가 처음 렌더링됨과 동시에 할 일 목록을 서버에 요청해서 뿌려주겠습니다.
    fetch(API_BASE_URL) // 목록 요청은 GET 방식이므로 객체 정보 보낼 필요 x
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        // fetch를 통해 받아온 데이터를 상태 변수에 할당.
        setTodos(json.todos);
      });
  }, []); // 콜백 함수, 의존 배열

  return (
    <div className='TodoTemplate'>
      <TodoHeader count={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
