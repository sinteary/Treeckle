import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Icon,
  Image,
  Button,
  Header,
  Modal,
  Grid,
  Label,
  Container,
} from "semantic-ui-react";
import Axios from "axios";
import { Context } from "../contexts/UserProvider";
import { CONSOLE_LOGGING } from "../DevelopmentView";
import { Event } from "./custom-typings/event-types";

type Props = {
  event: Event;
};

const EventCard = (props: Props) => {
  const curr = props.event;
  const user = useContext(Context);
  const [modal, setModal] = useState(false);
  const [attending, setAttending] = useState(curr.isUserAttendee);
  const [pax, setPax] = useState(curr.attendees);
  const [imgSrc, setImgSrc] = useState(curr.posterPath);
  const [isCreator, setCreator] = useState(false);

  useEffect(() => {
    checkImage();
  }, []);

  const checkImage = () => {
    Axios.get(props.event.posterPath)
      .then((response) => {
        if (response.headers["content-type"] == "text/html; charset=UTF-8") {
          setImgSrc("/ftp/EventPoster.png");
        }
      })
      .catch(({ response }) => {
        //TODO: verify that response should be undefined
        console.log("Check image", response);
      });
  };

  const signup = () => {
    setAttending(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
    const data = {
      eventId: curr.eventId,
      signUp: 1,
    };
    Axios.patch("/api/events/gallery", data, {
      headers,
    })
      .then((response) => {
        CONSOLE_LOGGING && console.log("PATCH signing up", response);
        if (response.status === 200) {
          setPax(pax + 1);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("PATCH signing up error:", response);
      });
  };

  const withdraw = () => {
    setAttending(false);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
    const data = {
      eventId: curr.eventId,
      signUp: 0,
    };
    Axios.patch("/api/events/gallery", data, {
      headers,
    })
      .then((response) => {
        CONSOLE_LOGGING && console.log("PATCH withdrawing", response);
        if (response.status === 200) {
          setPax(pax - 1);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("PATCH withdrawing error:", response);
      });
  };

  return (
    <Container text style={{ padding: "50px 50px 15px 15px", width: "auto" }}>
      <Card style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        <Modal
          trigger={
            <Image
              onClick={() => setModal(true)}
              src={imgSrc}
              alt="Image not found"
              wrapped
              ui={false}
            />
          }
          size="small"
        >
          <Modal.Content>
            <Header>{curr.title}</Header>
            <p>{curr.description}</p>
            <h5>
              {curr.categories.map((value, index) => {
                return (
                  <Label color="teal" tag>
                    {value}
                  </Label>
                );
              })}
            </h5>
          </Modal.Content>
        </Modal>
        <Card.Content>
          <Card.Header>{curr.title}</Card.Header>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Card.Meta>
                  <Icon name="calendar" />
                  <br />
                  <span className="date">
                    {new Date(curr.eventDate).toLocaleString("en-US", {
                      timeZone: "Asia/Singapore",
                    })}
                  </span>
                </Card.Meta>
              </Grid.Column>
              <Grid.Column>
                <Card.Meta>
                  <Icon name="map marker alternate" />
                  <br />
                  <Card.Description>{curr.venue}</Card.Description>
                </Card.Meta>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <br />
          {attending ? (
            <Button fluid as="div" labelPosition="right" onClick={withdraw}>
              <Button fluid basic color="blue">
                <Icon name="heart" />
                Withdraw
              </Button>
              <Label
                basic
                color="blue"
                pointing="left"
                style={{
                  "border-bottom-right-radius": "1.1rem",
                  "border-top-right-radius": "1.1rem",
                }}
              >
                {pax}
              </Label>
            </Button>
          ) : (
            <Button fluid as="div" labelPosition="right" onClick={signup}>
              <Button
                attached="bottom"
                color="red"
                fluid
                stule={{
                  "border-top-left-radius": "1.1rem",
                }}
              >
                <Icon name="heart" />
                Sign up
              </Button>
              <Label
                basic
                color="red"
                pointing="left"
                style={{ "border-bottom-right-radius": "1.1rem" }}
              >
                {pax}
              </Label>
            </Button>
          )}
        </Card.Content>
      </Card>
    </Container>
  );
};

export default EventCard;