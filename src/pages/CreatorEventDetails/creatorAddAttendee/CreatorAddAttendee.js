import classes from "./addAttendee.module.css";
import React,{useEffect, useState} from "react";
import BookingForm from "../../userEvent/bookingPopup/bookingForm/BookingForm";
import TicketsRowComponent from "./TicketsRowComponent";
import axios from "../../../requests/axios";
import routes from "../../../requests/routes";
import { useSelector } from "react-redux";
import GenericModal from "../../../generic components/generic modal/GenericModal"
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
/**
 * Component that returns Creator's Add Attendee page
 *
 * @component
 * @example
 * return(<CreatorAddAttendee />)
 */

  const CreatorAddAttendee = () => {
  const event = useSelector((state) => state.event);
  const user = useSelector((state) => state.user);



  const [timerClose, setTimerclose] = useState(false);
  const [ticketTypes,setTicketTypes] = useState(Array(100).fill(null));
  const [btnclick,setBtnClick]= useState(false);
  const [totalPrice,setTotalPrice] = useState(0);
  const [ticketsSubmit,setTicketsSubmit] = useState([]);

  const [faceValues,setfaceValues] = useState(Array(100).fill(null));
  const [QuantityArr,setQuantityArr] = useState(Array(100).fill(null));//Quantity Array will be used to store the quantity of each ticket type (sent to each row as a prop)
  
  

  async function addAttendee(data) {
    let response = "";
    try {
      response = await axios.post(routes.getAllEventsCreator + event.eventId + "/" + user.id + "/attendees", data);

      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response;
      }
    }
  }



  let ticketsBought=[];
  function setTotalTickets()
  { 
    let index=0;
    while (QuantityArr[index]!==null)
    {
      let ticket={}; 
      ticket.number=QuantityArr[index];
      ticket.ticketClass = ticketTypes[index]._id;
      ticket.faceValue = faceValues[index];
      ticketsBought.push(ticket)
      // setTicketsBought([...ticketsBought, ticket])
      index++;
    }
    console.log(ticketsBought);
  }

  function register(fName, lName, email){
    let obj = {}
    obj.ticketsBought=ticketsSubmit
    obj.firstName = fName
    obj.lastName = lName
    obj.email = email
    addAttendee(obj)
  }

  useEffect(() => {
    let totPrice = 0;
    for(let i=0;i<faceValues.length;i++)
    {
      if (faceValues[i]!==null && faceValues[i]!==undefined && faceValues[i]!=="")
      totPrice+=parseInt(faceValues[i]);
    }
    setTotalPrice(totPrice);
  }, [faceValues]);

  function timeout() {
    setTimerclose(true);
  }
    async function getTicketTypes() {
      let response = "";
      try {
        response = await axios.get(routes.tickets + "/" + event.eventId +"/availableTickets");
        setTicketTypes(response.data.tickets);
      } catch (error) {
      }
    }

    useEffect(() => {
      getTicketTypes();
    },[]);

    useEffect(() => {
      setTotalTickets();},[faceValues,QuantityArr]);

  return (
    btnclick? (
    <div className={classes.container}>
      <div className={classes.containercontent}>
        <div className={classes.registrationHeader}>
          <h1>Registration Information</h1>
          </div> 
          <div className={classes.regContainer}>
          <div className={classes.RegForm}>
            <BookingForm setTimeout={timeout} ticketsBought={ticketsBought} onRegister={register}/>
          </div>
          <div className={classes.regSummary}>
            <div className={classes.regSummarytext}>
              <div className = {classes.regSummaryHeader}>
                <h2>Order Summary</h2>
              </div>
              {faceValues[0]!==null&&console.log(faceValues)}
              <div className={classes.regSummaryBody}>
                {
                  ticketTypes.map((ticket,index) => QuantityArr[index] +" x "+ ticket.name +"    $"+ faceValues[index] + ".00")
                }
              </div>
            </div>
          </div>
         {timerClose && <GenericModal reloadClose={true} header='Time Limit Reached.
          Please re-start the process' icon={<HourglassBottomIcon sx={{ fontSize: "3rem" }}/>}/>}
          </div>

        </div>
      </div>)
      :(<div className={classes.container}>
      <div className={classes.containercontent}>
      <div className={classes.textcontainer}>
        <div>         
           <h1 className={classes.header}>Add Attendees</h1>
        </div>
        <div>
          <p className={classes.secondarytext}>Manually add attendees info for complimentary tickets or offline payments</p>
        </div>
      </div>
      <div>
        <div>
          <p className={classes.selecttitle}>Order Type:</p>
        </div>
        <div>
          <select className={classes.selectbox}>
            <option>Paid with check</option>
            <option>Paid with cash</option>
            <option>Paid directly online with PayPal</option>
            <option>Paid online non-PayPal</option>
            <option>Complimentary</option>
            <option>No payment necessary</option>
            <option>Paid with Voucher</option>
            <option>Paid Directly By Credit Card</option>
            <option>Paid Directly By Debit Card</option>
            <option>Other</option>
          </select>
        </div>
        <div className={classes.NochargeLabel}>
         <label>* Envie does not charge any fees for manual orders.</label>
        </div>
      </div>
      <div>
      <table className={classes.table}> 
        <tr className={classes.ticketmenutitle}>
          <th>Ticket Type</th>
          <th>Sold</th>
          <th>Price*</th>
          <th>Quantity</th>       
          <th>Face Value</th>                  
        </tr>
        {ticketTypes[0]!==null && ticketTypes.map((ticket,index)=>(
          <TicketsRowComponent setfaceValues={setfaceValues} faceValues={faceValues} index={index} name={ticket.name} price={ticket.price} sold={ticket.sold} capacity={ticket.capacity} maxQuantityPerOrder = {ticket.maxQuantityPerOrder} minQuantityPerOrder = {ticket.minQuantityPerOrder} QuantityArr = {QuantityArr} setQuantityArr = {setQuantityArr}/>))
        }
      </table>
      </div>
      <div className={classes.totalvaluediv}>
        <label className={classes.totalvallabel}>Total Value</label>
          <div className={classes.fieldContainer}>
              <label className={classes.label}>$</label>
              <input className={classes.field} disabled value={totalPrice}/>
          </div>
      </div>
      <div>
      <div className={classes.btn}>
        <button  onClick={()=>{setBtnClick(true); setTicketsSubmit(ticketsBought)}}  className={classes.button} data-testid="ContinueBtn">
          Continue
        </button>
      </div>
      </div>

      </div>
    </div> )
      
  );
};

export default CreatorAddAttendee;
