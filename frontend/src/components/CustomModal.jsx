import { useState } from "react";
import { Col, Dropdown, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  useGetOrderDetailsQuery,
  useReportOrderMutation,
} from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function CustomModal() {
  const [show, setShow] = useState(false);
  //   const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { id: orderId } = useParams();
  //   console.log("orderid", orderId);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [reportOrder, { isLoading: loadingReport }] = useReportOrderMutation();

  const handleClose = () => {
    setShow(false);
    setTitle("");
    setComment("");
  };
  const handleShow = () => setShow(true);

  const handleSubmit = async (event, actions) => {
    // const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    console.log("Form", title, comment);
    console.log("orderid", orderId);

    try {
      await reportOrder({
        orderId,
        details: { title, comment },
      });

      toast.success("Order reported successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Report Order
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">Report Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="e.g. Fake Product"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  //   defaultValue='e.g. Fake Product'
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="e.g. Replace the product"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  //   defaultValue='e.g. Replace the product'
                />
              </Form.Group>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CustomModal;
