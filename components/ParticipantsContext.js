import { createContext, useContext, useEffect, useState } from "react";

const ParticipantsContext = createContext();

const ParticipantsWrapper = ({ children }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const localParticipants = JSON.parse(
      sessionStorage.getItem("participants")
    );

    if (localParticipants) {
      setParticipants(localParticipants);
    }
  }, []);

  let sharedState = {
    participants,
    setParticipants,
  };

  return (
    <ParticipantsContext.Provider value={sharedState}>
      {children}
    </ParticipantsContext.Provider>
  );
};

const useParticipants = () => {
  return useContext(ParticipantsContext);
};

export { ParticipantsWrapper, useParticipants };
