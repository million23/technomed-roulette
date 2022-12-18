import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import dayjs from "dayjs";
import { useParticipants } from "../components/ParticipantsContext";

const ParticipantList = ({ list, setList, closeModal }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, ease: "circOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "circIn" } }}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-30 z-50"
    >
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.2, ease: "circOut" },
        }}
        exit={{
          opacity: 0,
          x: 50,
          transition: { duration: 0.2, ease: "circIn" },
        }}
        className="absolute right-0 top-0 p-5 h-screen overflow-y-auto w-full max-w-lg flex flex-col gap-2 bg-base-200"
      >
        <p className="text-center text-lg font-bold my-5">Participants</p>
        <AnimatePresence mode="popLayout">
          {list.map((participant, index) => (
            <motion.div
              layout
              key={participant.id}
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.2, ease: "circIn" },
              }}
              onClick={() => {
                const filteredParticipants = list.filter(
                  (p) => p.id !== participant.id
                );
                setList(filteredParticipants);
                sessionStorage.setItem(
                  "participants",
                  JSON.stringify(filteredParticipants)
                );
              }}
              className="flex items-center bg-base-300 cursor-pointer gap-3 hover:shadow-lg p-3 rounded-md group"
            >
              <img
                src={participant.image}
                className="w-[40px] h-[40px] group-hover:w-[70px] group-hover:h-[70px] transition-all bg-black rounded-full object-cover object-center"
              />
              <div>
                <p>{participant.name}</p>
                <p className="text-xs">
                  {dayjs(participant.createdAt).format("MM-DD-YY h:mm A")}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <p className="text-center text-lg font-bold mt-5">
            No participants yet
          </p>
        )}
      </motion.div>
    </motion.main>
  );
};

const TimerModal = ({ closeModal, setTimer, timer }) => {
  console.log(timer);
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, ease: "circOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "circIn" } }}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-30 z-50"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.2, ease: "circOut" },
        }}
        exit={{
          opacity: 0,
          x: -50,
          transition: { duration: 0.2, ease: "circIn" },
        }}
        className="absolute left-0 top-0 p-5 h-screen overflow-y-auto w-full max-w-lg flex flex-col gap-2 bg-base-200"
      >
        <p className="text-center text-lg font-bold my-5">Timer</p>

        <div className="flex flex-col gap-2">
          <label htmlFor="timer">
            Set the time to close the list for participation. Press enter to
            confirm.
          </label>
          <input
            type="time"
            id="timer"
            name="timer"
            className="input input-primary"
            onChange={(e) => {
              console.log(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setTimer(
                  `${dayjs().format("YYYY-MM-DD")} ${e.target.value}:00`
                );
                sessionStorage.setItem(
                  "timer",
                  `${dayjs().format("YYYY-MM-DD")} ${e.target.value}:00`
                );
              }
            }}
          />
        </div>

        {/* show active time */}
        <div className="flex flex-col gap-2 mt-5">
          <label htmlFor="timer">
            The list will be closed at{" "}
            <span className="font-bold">
              {dayjs(timer).format("MM-DD-YY h:mm A")}
            </span>
          </label>
        </div>
      </motion.div>
    </motion.main>
  );
};

const HomePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [participantListOpen, setParticipantListOpen] = useState(false);
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const { participants, setParticipants, timer, setTimer } = useParticipants();

  const getVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 500, height: 500 } })
      .then((stream) => {
        let vid = videoRef.current;
        vid.srcObject = stream;
        vid.play();
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let name = e.target[0].value;

    if (name.length > 0) {
      let firstLetterUpperCase = name.charAt(0).toUpperCase();
      let restOfName = name.slice(1);
      name = firstLetterUpperCase + restOfName;
      let canvas = canvasRef.current;
      let ctx = canvas.getContext("2d");
      let video = videoRef.current;
      ctx.drawImage(video, -70, 0, 650, 500);

      let image = canvas.toDataURL("image/png");
      const localParticipants = [
        ...participants,
        {
          name,
          image,
          id: uuidv4(),
          createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
      ];
      setParticipants(localParticipants);

      e.target[0].value = "";

      sessionStorage.setItem("participants", JSON.stringify(localParticipants));
    }
  };

  // listen to system clock and update timer
  useEffect(() => {
    setInterval(() => {
      if (timer) {
        let now = dayjs().format("YYYY-MM-DD HH:mm:ss");

        // check if timer is less than now
        if (dayjs(timer).isBefore(now)) {
          setTimer(now);
        } else {
          console.log("Roulette is still open");
        }
      }
    }, 1000);

    // check if there is a timer in session storage
    let timer = sessionStorage.getItem("timer");
    if (timer) {
      setTimer(timer);
    }
  }, []);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  return (
    <>
      <div className="py-16">
        <AnimatePresence mode="wait">
          {participantListOpen && (
            <ParticipantList
              key={participantListOpen}
              list={participants}
              setList={setParticipants}
              closeModal={() => setParticipantListOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {timerModalOpen && (
            <TimerModal
              key={timerModalOpen}
              closeModal={() => setTimerModalOpen(false)}
              timer={timer}
              setTimer={setTimer}
            />
          )}
        </AnimatePresence>

        <p className="text-2xl text-center font-bold">
          Technomed Christmas Party Roulette
        </p>
        <p className="text-center max-w-lg mx-auto text-xs">
          Please place your head at the center of the frame, type your name, and
          click submit.
        </p>

        <video
          ref={videoRef}
          width={300}
          height={226}
          className=" mx-auto mt-4 border-2 border-primary w-[300px] h-[300px] object-cover object-center"
        >
          Video stream not available.
        </video>

        {/* only show the form and video input if the current time is less than the timer */}
        {!dayjs().isAfter(dayjs(timer)) && (
          <>
            <form
              onSubmit={handleSubmit}
              className="text-center mt-10 flex items-center gap-2"
            >
              <input
                className="input input-primary w-full "
                placeholder="Insert your name here"
              />

              <button className="btn btn-primary">
                <span>Submit</span>
              </button>
            </form>

            <canvas
              id="canvas"
              ref={canvasRef}
              className="hidden"
              width={500}
              height={500}
            />
          </>
        )}

        {/* show the timer if the current time is greater than the timer */}
        {dayjs().isAfter(dayjs(timer)) && (
          <div className="text-center mt-10">
            <p className="text-2xl font-bold">The list is closed</p>
            <p className="text-xs">
              Please wait for the host to start the roulette
            </p>
          </div>
        )}

        {/* if the timer is null show an instruction to set the timer */}
        {timer === null && (
          <div className="text-center mt-10">
            <p className="text-xl font-bold">Set the timer</p>
            <p>Please wait for the host to set the timer</p>
          </div>
        )}

        <div className="grid grid-cols-2 mt-10 gap-2">
          <button
            onClick={() => {
              setTimerModalOpen(true);
            }}
            className="btn btn-primary btn-outline"
          >
            Set Timer
          </button>
          <button
            onClick={() => {
              setParticipantListOpen(true);
            }}
            className="btn btn-primary btn-outline"
          >
            See Participant List
          </button>
        </div>

        {participants.length > 1 && (
          <>
            <Link href={"/roulette"} className="btn btn-primary btn-block mt-5">
              <span>Spin Roulette</span>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
