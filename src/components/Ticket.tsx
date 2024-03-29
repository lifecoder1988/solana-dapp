import { FC } from "react";

type Props = {
  ticketId: number;
};

function parseTicketID(ticketId: number) {
  let tmp = ticketId;
  let r2 = (tmp & 15) + 1;
  tmp >>= 4;
  let arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push((tmp & 31) + 1);
    tmp >>= 5;
  }
  console.log(arr, r2);

  const formattedNumbers = arr.map((num) => num.toString().padStart(2, "0"));
  const blue = r2.toString().padStart(2, "0");
  return formattedNumbers.reverse().join("-") + "-" + blue;
}

export const Ticket: FC<Props> = ({ ticketId }) => {
  return <div>{parseTicketID(ticketId)}</div>;
};
