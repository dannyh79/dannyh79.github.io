---
title: 'componentDidMount() Equivalent in React Hook'
createdAt: 2019-12-29 23:00:00 +0800
publishedAt: 2019-12-29
categories: [react]
---

### Getting Started with a Class-based Component

- `$ npx create-react-app todo-fecther{:sh}`
- `$ cd todo-fetcher{:sh}`
- `$ mkdir src/components && cd src/components{:sh}`
- `$ touch TodoBoard.js Todo.js{:sh}`
- Edit the 2 files

  ```jsx
  // src/components/TodoBoard.js
  import React from 'react';
  import Todo from './Todo';

  class TodoBoard extends React.Component {
    constructor() {
      super();
      this.state = {
        todos: [],
      };
    }

    componentDidMount() {
      const url = 'https://jsonplaceholder.typicode.com/todos';
      fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw 'erred';
          }
        })
        .then((data) => {
          this.setState = { todos: data };
        })
        .catch((error) => window.alert(error));
    }

    render() {
      return (
        <div>
          {this.state.todos.map((todo) => (
            <Todo key={todo.id} {...todo} />
          ))}
        </div>
      );
    }
  }

  export default TodoBoard;
  ```

  ```jsx
  // src/components/Todo.js
  // This is a function component already
  import React from 'react';

  const Todo = (props) => {
    return (
      <div>
        <p>User ID: {props.userId}</p>
        <p>ID: {props.id}</p>
        <p>Title: {props.title}</p>
        <p>Status: {props.completed}</p>
      </div>
    );
  };

  export default Todo;
  ```

- Modify src/index.js to the following

  ```jsx
  // src/index.js
  import React from 'react';
  import ReactDOM from 'react-dom';
  import TodoBoard from './components/TodoBoard';

  ReactDOM.render(<TodoBoard />, document.getElementById('root'));
  ```

- `$ npm start{:sh}`

(Refer to [facebook/create-react-app](https://github.com/facebook/create-react-app) for more info about setting up a CRA project)

---

### Re-write TodoBoard.js to a Function Component with Hooks

```jsx
// src/components/TodoBoard.js
import React, { useState, useEffect } from 'react';

const TodoBoard = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    fetch(url)
      .then((response) => {
        if (reponse.status === 200) {
          return response.json();
        } else {
          throw 'erred';
        }
      })
      .then((data) => setTodos(data))
      .catch((error) => window.alert(error));
    // Refer to Takeaway
  }, []);

  return (
    <div>
      {this.state.todos.map((todo) => (
        <Todo key={todo.id} {...todo} />
      ))}
    </div>
  );
};

export default TodoBoard;
```

---

### Takeaway

- The second argument for `useEffect(){:js}` hook is the [dependency](https://reactjs.org/docs/hooks-reference.html#timing-of-effects) part of the effect. The certain `useEffect(){:js}` is triggered when any of the state in the dependency array, e.g., `foo{:js}` or `bar{:js}` in `[foo, bar]{:js}`, changes
- If `useEffect(){:js}` has an empty dependency array, it is only triggered once when the component is loaded, just like `componentDidMount(){:js}` in class-based components
- Don't forget to [clean up the effect](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect) in some cases, or the effect would cause memory-leak!
