import React from "react";
import logo from "../images/treeckle_startup.png";
import { Context } from "../contexts/UserProvider";
import { withRouter } from "react-router";
import axios from "axios";
import * as yup from "yup";
import {
  Button,
  Divider,
  Form,
  Grid,
  Segment,
  Image,
  Header
} from "semantic-ui-react";

class RegisterFromEmailDivider extends React.Component {
  static contextType = Context;
  state = {
    name: "",
    email: "",
    password: "",
    passwordRepeated: "",
    submittedEmail: "",
    submittedPassword: "",
    emailError: null,
    passwordError: null,
    userCreated: false
  };

  constructor(props) {
    super(props);
  }

  InputSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),
    password: yup.string().required(),
    passwordRepeated: yup.string().when("password", {
      is: val => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf([yup.ref("password")], "Both password need to be the same")
    })
  });

  EmailSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
  });

  PasswordSchema = yup.object().shape({
    password: yup.string().required()
  });

  PasswordRepeatSchema = yup.object().shape({
    confirmPassword: yup
      .string()
      .required()
      .label("Confirm password")
      .test("passwords-match", "Passwords must match", function(value) {
        return this.parent.password === value;
      })
  });

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    if (this.state.password != this.state.passwordRepeated) {
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const { email, password } = this.state;
    this.setState({
      submittedEmail: email,
      submittedPassword: password,
      emailError: null,
      passwordError: null
    });
    console.log(this.state.email, this.state.password);
    let inputData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    this.InputSchema.isValid(inputData).then(valid => {
      if (valid) {
        console.log("yell hea!" + this.context.token);
        axios
          .post(
            "/auth/newAccounts",
            {
              name: this.state.name,
              email: this.state.email,
              password: this.state.password,
              uniqueURIcomponent: this.props.match.params.uniqueId
            },
            config
          )
          .then(res => {
            if (res.status === 200) {
              window.location.replace("/");
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.EmailSchema.isValid(inputData).then(valid => {
          if (!valid) {
            this.setState({
              emailError: { content: "Please enter a valid email." }
            });
          }
        });
        this.PasswordSchema.isValid(inputData).then(valid => {
          if (!valid) {
            this.setState({
              passwordError: { content: "Please enter your password." }
            });
          }
        });
      }
    });
  };

  render() {
    const {
      name,
      email,
      password,
      passwordRepeated,
      submittedEmail,
      submittedPassword,
      emailError,
      passwordError
    } = this.state;
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column verticalAlign="middle">
            <Header style={{ margin: "1.5em auto" }}>Register</Header>
            <p>
              Please provide us with your full name, email and new password.
            </p>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                icon="user"
                iconPosition="left"
                placeholder="Name"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
              <Form.Input
                error={emailError}
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                error={passwordError}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                placeholder="Confirm Password"
                type="password"
                name="passwordRepeated"
                value={passwordRepeated}
                onChange={this.handleChange}
              />
              {this.state.password == ""
                ? null
                : this.state.password == this.state.passwordRepeated
                ? "passwords match"
                : "passwords don't match"}

              <Button
                content={"Complete Registration"}
                primary
                style={{ minWidth: "210px", margin: "1em auto" }}
              />
            </Form>
          </Grid.Column>
          <Grid.Column
            verticalAlign="middle"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src={logo}
              style={{
                margin: "2.5em",
                width: "85%",
                height: "auto",
                display: "block"
              }}
            />
          </Grid.Column>
        </Grid>

        {/* <Divider vertical></Divider> */}
      </Segment>
    );
  }
}

export default withRouter(RegisterFromEmailDivider);
