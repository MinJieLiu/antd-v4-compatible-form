# antd-v4-compatible-form

`antd@4.x` Form, Used for `antd@3.x`

# Usage

```js
import Form from 'antd-v4-compatible-form';

const ExampleForm = () => {
  function handleFinish(data) {
    console.log(data);
  }
  return (
    <Form onFinish={handleFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input placeholder="Please enter username." maxLength={128} />
      </Form.Item>
      <Button type="primary" htmlType="submit" block>
        Submit
      </Button>
    </Form>
  );
};
```

# Document

[https://next.ant.design/components/form-cn/](https://next.ant.design/components/form-cn/)
