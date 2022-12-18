import { createContext, useContext, useEffect, useState } from "react";

const ParticipantsContext = createContext();

const ParticipantsWrapper = ({ children }) => {
  const [participants, setParticipants] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const localParticipants = JSON.parse(
      sessionStorage.getItem("participants")
    );

    const localTime = sessionStorage.getItem("timer");

    if (localParticipants) {
      setParticipants(localParticipants);
    }

    if (localTime) {
      setTimer(localTime);
    }
  }, []);

  let sharedState = {
    participants,
    setParticipants,
    timer,
    setTimer,
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
