const Messages = ({ messages }) => {
  return (
    <>
        {
           messages.map((message, key) => (
               <p key={key}>{message}</p>
           ))
        }
    </>
  );
};

export default Messages;
