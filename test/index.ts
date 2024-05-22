import fs from "fs"
import {getDomTreeFromMarkdown, parseMarkdownToHTML} from "../src"
import path from "path";
// const content =
//   '_Props_ are inputs to components. They are single values or objects containing a set of values that are passed to components on creation similar to HTML-tag attributes. Here, the data is passed down from a parent component to a child component.\n\n     The primary purpose of props in React is to provide following component functionality:\n\n      1. Pass custom data to your component.\n      2. Trigger state changes.\n      3. Use via `this.props.reactProp` inside component\'s `render()` method.\n\n      For example, let us create an element with `reactProp` property:\n\n      ```jsx harmony\n      <Element reactProp={"1"} />\n      ```\n\n      This `reactProp` (or whatever you came up with) attribute name then becomes a property attached to React\'s native props object which originally already exists on all components created using React library.\n\n      ```jsx harmony\n      props.reactProp\n      ```\n\n      For example, the usage of props in function component looks like below:\n\n      ```jsx\n      import React from "react";\n      import ReactDOM from "react-dom";\n\n      const ChildComponent = (props) => {\n        return (\n          <div>\n            <p>{props.name}</p>\n            <p>{props.age}</p>\n            <p>{props.gender}</p>\n          </div>\n        );\n      };\n\n      const ParentComponent = () => {\n        return (\n          <div>\n            <ChildComponent name="John" age="30" gender="male" />\n            <ChildComponent name="Mary" age="25" geneder="female"/>\n          </div>\n        );\n      };\n      ```\n\n   The properties from props object can be accessed directly using destructing feature from ES6 (ECMAScript 2015). It is also possible to fallback to default value when the prop value is not specified. The above child component can be simplified like below.\n\n  ```jsx harmony\n    const ChildComponent = ({name, age, gender="male"}) => {\n        return (\n          <div>\n            <p>{name}</p>\n            <p>{age}</p>\n            <p>{gender}</p>\n          </div>\n        );\n      };\n  ``` \n  **Note:** The default value won\'t be used if you pass `null` or `0` value. i.e, default value is only used if the prop value is missed or `undefined` value has been passed.\n\n  <details><summary><b>See Class</b></summary>\n     The Props accessed in Class Based Component as below\n\n  ```jsx\n        import React from "react";\n        import ReactDOM from "react-dom";\n\n        class ChildComponent extends React.Component {\n          render() {\n            return (\n              <div>\n                <p>{this.props.name}</p>\n                <p>{this.props.age}</p>\n                <p>{this.props.gender}</p>\n              </div>\n            );\n          }\n        }\n\n        class ParentComponent extends React.Component {\n          render() {\n            return (\n              <div>\n                <ChildComponent name="John" age="30"  gender="male" />\n                <ChildComponent name="Mary" age="25"  gender="female" />\n              </div>\n            );\n          }\n        }\n  ```\n  </details>';

const content =
  '_State_ of a component is an object that holds some information that may change over the lifetime of the component. The important point is whenever the state object changes, the component re-renders. It is always recommended to make our state as simple as possible and minimize the number of stateful components.\n\n    ![state](images/state.jpg)\n\n    Let\'s take an example of **User** component with `message` state. Here, **useState** hook has been used to add state to the User component and it returns an array with current state and function to update it.\n\n    ```jsx harmony\n    import { useState } from "react";\n\n    function User() {\n      const [message, setMessage] = useState("Welcome to React world");\n\n      return (\n        <div>\n          <h1>{message}</h1>\n        </div>\n      );\n    }\n    ```\n\n    Whenever React calls your component or access `useState` hook, it gives you a snapshot of the state for that particular render.\n\n    <details><summary><b>See Class</b></summary>\n    <p>\n\n    ```jsx harmony\n    import React from \'react\';\n    class User extends React.Component {\n      constructor(props) {\n        super(props);\n\n        this.state = {\n          message: "Welcome to React world",\n        };\n      }\n\n      render() {\n        return (\n          <div>\n            <h1>{this.state.message}</h1>\n          </div>\n        );\n      }\n    }\n    ```\n\n    </p>\n    </details>\n\n    State is similar to props, but it is private and fully controlled by the component ,i.e., it is not accessible to any other component till the owner component decides to pass it.';
const main = () => {
  fs.writeFileSync(
    path.join(__dirname, "output.json"),
    JSON.stringify(getDomTreeFromMarkdown(content), undefined, 4),
    {
      encoding: "utf-8",
    }
  );

}
main();