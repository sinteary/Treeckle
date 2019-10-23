import React from "react";
import axios from "axios";
import * as yup from "yup";
import { Context } from "../contexts/UserProvider";
import { Button, Form, Segment } from "semantic-ui-react";

class AdminConfig extends React.Component {
  static contextType = Context;
  state = {
    currentEmail: "",
    emailError: null,
    disabled: true,
    email: "",
    submittedEmail: ""
  };

  constructor(props) {
    super(props);
    this.toggleField = this.toggleField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`
      }
    };
    axios
      .get("/api/emails", config)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            currentEmail: res.data.email,
            email: res.data.email
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  EmailSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
  });

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
    let inputData = { email: this.state.email };
    this.EmailSchema.isValid(inputData).then(valid => {
      if (valid) {
        this.setState({ emailError: null });
      } else {
        this.setState({
          emailError: { content: "Please enter a valid email." }
        });
      }
    });
  };

  toggleField() {
    this.setState({ disabled: !this.state.disabled, emailError: null });
    if (this.state.submittedEmail === "") {
      this.setState({ email: this.state.currentEmail });
    }
  }

  handleSubmit = () => {
    const { email } = this.state;
    this.setState({
      submittedEmail: email,
      emailError: null
    });
    console.log(this.state.email);
    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`
      }
    };
    let inputData = { email: this.state.email };
    this.EmailSchema.isValid(inputData).then(valid => {
      if (valid) {
        console.log("yell hea!");
        axios
          .put(
            "/api/emails",
            {
              email: this.state.email
            },
            config
          )
          .then(res => {
            if (res.status === 200) {
              alert(
                "CSS email updated! Now all receipts will be sent to the specified email."
              );
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.setState({
          emailError: { content: "Please enter a valid email." }
        });
      }
    });
  };

  render() {
    const {
      currentEmail,
      emailError,
      disabled,
      email,
      submittedEmail
    } = this.state;
    return (
      <Segment placeholder>
        <Form error textAlign="center">
          <p>
            The below email is assigned to receive receipts for the creation or
            change in status of all bookings.
          </p>
          <Form.Input
            error={emailError}
            placeholder="CC Email"
            name="email"
            value={email}
            onChange={this.handleChange}
            disabled={disabled}
          />
        </Form>
        <Button.Group>
          <Button
            content="Edit CC Email"
            onClick={this.toggleField}
            style={{ border: "1px solid #dfdfdf" }}
          />
          <Button
            primary
            content="Confirm"
            disabled={emailError || disabled}
            onClick={this.handleSubmit}
            style={{ border: "1px solid #dfdfdf" }}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default AdminConfig;