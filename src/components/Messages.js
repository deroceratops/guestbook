const Messages = ({ messages }) => {
  return (
    <>
      <ul>
        {
           messages.map((message, key) => (
               <li key={key}>{message}</li>
           ))
        }
      </ul>
    </>
  );
};

export default Messages;
