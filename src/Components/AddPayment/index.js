import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isloggedinService } from "../../Services/LoginService";
import {
  AddPaymentAction,
  getPaymentAction,
  RemovePaymentAction,
} from "../Actions/AddPayment";

/**
 * This Component Provides Add Payment layout. This essentially adds payment related Info of the user.
 * @returns  DOM for Add Payment Component.
 */

const AddPayment = () => {
  const [start, setStart] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payment = useSelector((state) => state.AddPayment);
  const [data, setData] = useState({
    type: "Credit Card",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });
  const [errors, updateErrors] = useState({});
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(false);
  const putPaymentData = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const validation = (value) => {
    const errors = {};
    if (!value.type) {
      errors.type = "Select a Type";
    }
    if (!value.cardNumber) {
      errors.cardNumber = "Enter a Card Number";
    } else if (value.cardNumber.length !== 16) {
      errors.cardNumber = "Invalid Card Number";
    }
    if (!value.cvv) {
      errors.cvv = "Enter CVV";
    } else if (value.cvv.length !== 3) {
      errors.cvv = "Invalid CVV";
    }
    if (!value.expiryDate) {
      errors.expiryDate = "Expire Date is Required";
    }
    return errors;
  };

  const dataSubmit = (event) => {
    event.preventDefault();
    updateErrors(validation(data));
    setValid(true);
  };

  const deletePayment = (aid) => {
    RemovePaymentAction(aid).then(() => getPaymentAction(dispatch));
  };

  useEffect(() => {
    if (start) {
      setStart(false);
      getPaymentAction(dispatch);
    }
    if (!isloggedinService()) {
      navigate("/login");
    }
    if (Object.keys(errors).length === 0 && valid) {
      AddPaymentAction(data).then(() => {
        getPaymentAction(dispatch);
        setValid(false);
      });
    }
  }, [dispatch, start, navigate, data, errors, valid]);

  return (
    <>
      <div className="my-5">
        <ul className="list-group">
          {payment.length > 0 &&
            payment
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((element) => {
                return (
                  <li className="list-group-item ps-5" key={element._id}>
                    <div className="row">
                      <div className="col-10">
                        {element && element.type && <p>{element.type},</p>}
                        {element && element.cardNumber && (
                          <p>{element.cardNumber}</p>
                        )}
                      </div>
                      <span className="col-md-2 my-auto text-align-center">
                        <button
                          className="btn btn-danger"
                          onClick={() => deletePayment(element._id)}
                        >
                          Delete
                        </button>
                      </span>
                    </div>
                  </li>
                );
              })}
        </ul>

        <button
          className={`btn btn-primary rounded-pill w-100 ${
            show ? "d-none" : ""
          } my-3`}
          onClick={() => {
            setShow(!show);
          }}
        >
          Add Payment Method
        </button>
        <button
          className={`btn btn-primary rounded-pill w-100 ${
            show ? "" : "d-none"
          } my-3`}
          onClick={() => {
            setShow(!show);
          }}
        >
          Close
        </button>
        <div className={`${show ? "" : "d-none"}`}>
          <form>
            <fieldset>
              <legend>
                <h3 className="ps-4">Add a Payment Method</h3>
              </legend>
              <div className="ps-4">
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="CreditCard"
                      value="Credit Card"
                      onChange={(event) => putPaymentData(event)}
                      checked
                    />
                    <label className="form-check-label" htmlFor="CreditCard">
                      Credit Card
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="type"
                      id="DebitCard"
                      value="Debit Card"
                      onChange={(event) => putPaymentData(event)}
                    />
                    <label className="form-check-label" htmlFor="DebitCard">
                      Debit Card
                    </label>
                  </div>
                  <p className="text-danger">
                    {errors.type ? errors.type : ""}
                  </p>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control${
                          errors.addressLine2 ? " is-invalid" : ""
                        }`}
                        id="cardNumber"
                        name="cardNumber"
                        value={data.cardNumber}
                        onChange={(event) => putPaymentData(event)}
                      />
                      <label htmlFor="cardNumber">Card Number</label>
                      <p className="text-danger">
                        {errors.cardNumber ? errors.cardNumber : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control${
                          errors.cvv ? " is-invalid" : ""
                        }`}
                        id="cvv"
                        name="cvv"
                        value={data.cvv}
                        onChange={(event) => putPaymentData(event)}
                      />
                      <label htmlFor="cvv">CVC</label>
                      <p className="text-danger">
                        {errors.cvv ? errors.cvv : ""}
                      </p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control${
                          errors.expiryDate ? " is-invalid" : ""
                        }`}
                        id="expiryDate"
                        name="expiryDate"
                        value={data.expiryDate}
                        onChange={(event) => putPaymentData(event)}
                      />
                      <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                      <p className="text-danger">
                        {errors.expiryDate ? errors.expiryDate : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary rounded-pill w-100"
                onClick={(event) => dataSubmit(event)}
              >
                Add Payment Method
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};
export default AddPayment;
